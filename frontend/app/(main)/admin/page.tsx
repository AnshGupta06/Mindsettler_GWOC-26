"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; 
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard,
  Award,
  Video,
  X,
  Link as LinkIcon,
  ExternalLink,
  Settings,
  ShieldAlert,
  Phone,
  Mail
} from "lucide-react";

// --- Types ---
type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  type: "FIRST" | "FOLLOW_UP";
  therapyType?: string;
  reason?: string;
  meetingLink?: string;
  user: {
    id: string; // Needed for blocking
    name?: string;
    email: string;
    phone?: string;
  };
  slot: {
    date: string;
    startTime: string;
    endTime: string;
    mode: "ONLINE" | "OFFLINE";
  };
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "REJECTED">("ALL");

  // Modal State
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; bookingId: string | null }>({
    isOpen: false,
    bookingId: null
  });
  const [manualLink, setManualLink] = useState("");

  const isValidLink = (link: string) => {
    try {
      const url = new URL(link);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const fetchBookings = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch bookings");
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace("/login"); return; }
      const token = await user.getIdToken();
      await fetchBookings(token);
    });
    return () => unsub();
  }, [router]);

  // --- ACTIONS ---

  const handleConfirmClick = (booking: Booking) => {
    if (booking.slot.mode === "ONLINE") {
      setManualLink(""); 
      setConfirmModal({ isOpen: true, bookingId: booking.id });
    } else {
      updateStatus(booking.id, "CONFIRMED");
    }
  };

  const submitConfirmWithLink = async () => {
    if (!confirmModal.bookingId) return;
    if (!isValidLink(manualLink)) {
      toast.error("Please enter a valid URL (e.g., https://meet.google.com/...)");
      return;
    }
    await updateStatus(confirmModal.bookingId, "CONFIRMED", manualLink);
    setConfirmModal({ isOpen: false, bookingId: null });
  };

  const updateStatus = async (id: string, status: "CONFIRMED" | "REJECTED", link?: string) => {
    const token = await auth.currentUser?.getIdToken();
    const toastId = toast.loading(status === "CONFIRMED" ? "Confirming..." : "Rejecting...");

    // Optimistic Update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status, meetingLink: link } : b));

    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, meetingLink: link }),
      });

      if (!res.ok) throw new Error("Failed");
      toast.success(status === "CONFIRMED" ? "Confirmed!" : "Rejected", { id: toastId });
      
      const refreshedToken = await auth.currentUser?.getIdToken();
      if(refreshedToken) await fetchBookings(refreshedToken);

    } catch (err) {
      toast.error("Failed to update.", { id: toastId });
      const refreshedToken = await auth.currentUser?.getIdToken();
      if(refreshedToken) await fetchBookings(refreshedToken);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
  };

  if (error === "Admin access only") return <div>Access Denied</div>;

  return (
    <div className="min-h-screen bg-[#F9F6FF] pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8">
      
      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
         <div className="fixed inset-0 bg-[#3F2965]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-[#3F2965]/10 animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-[#3F2965]">Add Meeting Link</h3>
               <button onClick={() => setConfirmModal({isOpen: false, bookingId: null})} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                 <X size={20} className="text-[#3F2965]/60" />
               </button>
             </div>
             
             <p className="text-sm text-[#3F2965]/60 mb-4 font-medium">
               Create a meeting link below, then copy-paste it here.
             </p>

             <a 
               href="https://meet.google.com/new" 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center justify-center gap-2 w-full py-3 mb-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl font-bold hover:bg-blue-100 transition-colors"
             >
                <Video size={18} /> Generate Google Meet Link <ExternalLink size={14} />
             </a>

             <div className="relative mb-2">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/40 pointer-events-none">
                 <LinkIcon size={18} />
               </div>
               <input 
                 className={`w-full pl-12 pr-4 py-3.5 bg-[#F9F6FF] rounded-xl border focus:ring-4 outline-none font-medium transition-all placeholder:text-[#3F2965]/30 ${
                   manualLink && !isValidLink(manualLink) 
                   ? "border-red-300 focus:border-red-500 focus:ring-red-100 text-red-600" 
                   : "border-[#3F2965]/10 focus:border-[#Dd1764] focus:ring-[#Dd1764]/5 text-[#3F2965]"
                 }`}
                 placeholder="https://meet.google.com/..."
                 value={manualLink}
                 onChange={(e) => setManualLink(e.target.value)}
                 autoFocus
               />
             </div>
             
             {manualLink && !isValidLink(manualLink) && (
                <p className="text-xs text-red-500 font-bold mb-4 ml-1">
                  ⚠️ Please enter a valid URL (starting with http:// or https://)
                </p>
             )}
             
             <div className={manualLink && !isValidLink(manualLink) ? "" : "mt-6"}></div>

             <button 
               onClick={submitConfirmWithLink}
               disabled={!manualLink || !isValidLink(manualLink)}
               className="w-full py-3.5 bg-[#Dd1764] text-white rounded-xl font-bold hover:bg-[#b01350] transition-all shadow-lg shadow-[#Dd1764]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <CheckCircle size={18} /> Confirm & Send
             </button>
           </div>
         </div>
      )}
        
        {/* HEADER & NAV ACTIONS */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <LayoutDashboard className="text-[#Dd1764]" />
              Admin Dashboard
            </h1>
            <p className="text-[#3F2965]/60 mt-1 text-sm md:text-base">Manage appointments, users, and platform settings.</p>
          </div>
          
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full xl:w-auto">
            {/* Clients */}
            <button
              onClick={() => router.push("/admin/clients")}
              className="justify-center px-4 py-3 bg-white text-[#3F2965] border border-[#3F2965]/10 rounded-full font-bold shadow-sm hover:bg-[#F9F6FF] transition-all flex items-center gap-2 text-xs md:text-sm"
            >
              <User size={16} className="text-[#Dd1764]" />
              Clients
            </button>

            {/* Discounts */}
            <button
              onClick={() => router.push("/admin/discounts")}
              className="justify-center px-4 py-3 bg-white text-[#3F2965] border border-[#3F2965]/10 rounded-full font-bold shadow-sm hover:bg-[#F9F6FF] transition-all flex items-center gap-2 text-xs md:text-sm"
            >
              <Award size={16} className="text-[#Dd1764]" />
              Discounts
            </button>

            {/* Config / Settings */}
            <button
              onClick={() => router.push("/admin/settings")}
              className="justify-center px-4 py-3 bg-white text-[#3F2965] border border-[#3F2965]/10 rounded-full font-bold shadow-sm hover:bg-[#F9F6FF] transition-all flex items-center gap-2 text-xs md:text-sm"
            >
              <Settings size={16} className="text-[#Dd1764]" />
              Config
            </button>

            {/* Slots */}
            <button
              onClick={() => router.push("/admin/slots")}
              className="justify-center px-4 py-3 bg-[#3F2965] text-white rounded-full font-bold shadow-lg hover:shadow-[#3F2965]/20 hover:scale-105 transition-all flex items-center gap-2 text-xs md:text-sm"
            >
              <Calendar size={16} />
              Slots
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 px-2 md:px-8">
          <StatCircle
            label="Total Requests"
            value={stats.total}
            icon={LayoutDashboard}
            color="border-[#3F2965]"
            bg="bg-[#3F2965]/5"
            textColor="text-[#3F2965]"
          />
          <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-[#3F2965]/5 via-[#3F2965]/20 to-[#3F2965]/5" />
          <StatCircle
            label="Pending Action"
            value={stats.pending}
            icon={Clock}
            color="border-orange-400"
            bg="bg-orange-50"
            textColor="text-orange-600"
          />
          <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-[#3F2965]/5 via-[#3F2965]/20 to-[#3F2965]/5" />
          <StatCircle
            label="Confirmed"
            value={stats.confirmed}
            icon={CheckCircle}
            color="border-emerald-500"
            bg="bg-emerald-50"
            textColor="text-emerald-600"
          />
        </div>

        {/* FILTERS */}
        <div className="flex overflow-x-auto pb-4 mb-4 md:mb-8 border-b border-[#3F2965]/10 gap-2 no-scrollbar">
          {["ALL", "PENDING", "CONFIRMED", "REJECTED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${filter === f
                ? "bg-[#3F2965] text-white shadow-md"
                : "bg-white text-[#3F2965]/60 hover:bg-white hover:text-[#3F2965]"
                }`}
            >
              {f === "ALL" ? "All Bookings" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* BOOKINGS GRID */}
        {loading ? (
          <Loader fullScreen={true} message="Loading Dashboard Data..."/>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#3F2965]/20">
            <p className="text-[#3F2965]/40">No bookings found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {filteredBookings.map((b) => (
              <BookingCard 
                key={b.id} 
                booking={b} 
                onConfirm={handleConfirmClick}
                onReject={(id) => updateStatus(id, "REJECTED")}
              />
            ))}
          </div>
        )}
      </div>
  );
}

// ---------------- SUB-COMPONENTS ---------------- //

type StatCircleProps = {
  label: string;
  value: number;
  icon: any;
  color: string;
  bg: string;
  textColor: string;
};

function StatCircle({ label, value, icon: Icon, color, bg, textColor }: StatCircleProps) {
  return (
    <div className={`relative w-36 h-36 md:w-48 md:h-48 rounded-full border-[4px] md:border-[6px] ${color} ${bg} flex flex-col items-center justify-center shadow-xl md:shadow-2xl shadow-[#3F2965]/10 hover:scale-105 transition-all duration-300 group`}>
      <div className={`absolute -top-4 md:-top-5 p-2 md:p-3 rounded-full bg-white shadow-md border ${color} group-hover:-translate-y-1 transition-transform`}>
        <Icon className={`${textColor} w-5 h-5 md:w-6 md:h-6`} strokeWidth={2.5} />
      </div>
      <p className={`text-3xl md:text-5xl font-black ${textColor} mt-2`}>{value}</p>
      <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-[#3F2965]/60 mt-1 md:mt-2">{label}</p>
    </div>
  );
}

type BookingCardProps = {
  booking: Booking;
  onConfirm: (booking: Booking) => void;
  onReject: (id: string) => void;
};

function BookingCard({ booking, onConfirm, onReject}: BookingCardProps) {
  const date = new Date(booking.slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = `${new Date(booking.slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#3F2965]/5 hover:shadow-md transition-all flex flex-col md:flex-row gap-4 md:gap-6">

      <div className="flex flex-row md:flex-col items-center justify-between md:justify-center bg-[#F9F6FF] text-[#3F2965] rounded-xl p-3 md:p-4 min-w-full md:min-w-[120px] text-center border border-[#3F2965]/5">
        <div className="flex flex-col md:items-center text-left md:text-center">
          <span className="text-[10px] font-bold uppercase opacity-60">Session</span>
          <span className="text-lg font-bold mt-0 md:mt-1">{date}</span>
        </div>
        <div className="text-right md:text-center">
          <span className="text-xs font-medium block">{time}</span>
          <span className={`inline-block mt-1 md:mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${booking.slot.mode === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            {booking.slot.mode}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-base md:text-lg text-[#3F2965]">{booking.user.name || "Unknown User"}</h3>
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-xs md:text-sm text-[#3F2965]/60 flex items-center gap-2">
                  <Mail size={12} /> <span className="break-all">{booking.user.email}</span>
                </p>
                {booking.user.phone && (
                  <p className="text-xs md:text-sm text-[#3F2965]/60 flex items-center gap-2">
                    <Phone size={12} /> {booking.user.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {booking.status}
                </span>
                
               
            </div>
          </div>

          <div className="bg-[#F9F6FF] p-3 rounded-lg border border-[#3F2965]/5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold bg-[#3F2965] text-white px-2 py-0.5 rounded">
                {booking.type === "FIRST" ? "First Session" : "Follow-up"}
              </span>
              {booking.therapyType && (
                <span className="text-[10px] font-bold bg-[#Dd1764] text-white px-2 py-0.5 rounded">
                  {booking.therapyType}
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-[#3F2965]/80 italic">
              {booking.reason ? `"${booking.reason}"` : <span className="opacity-50">No specific reason provided.</span>}
            </p>
          </div>
          
          {booking.meetingLink && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100 w-fit">
                <LinkIcon size={12} className="text-green-600" />
                <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 font-bold underline truncate max-w-[200px]">
                    {booking.meetingLink}
                </a>
            </div>
          )}
        </div>

        {booking.status === "PENDING" && (
          <div className="flex gap-3 pt-3 border-t border-[#3F2965]/5">
            <button onClick={() => onConfirm(booking)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs md:text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <CheckCircle size={14} /> Confirm
            </button>
            <button onClick={() => onReject(booking.id)} className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-xs md:text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <XCircle size={14} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}