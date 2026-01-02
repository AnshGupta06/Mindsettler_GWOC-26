"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Ensure path is correct
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast"; // 🔔 IMPORT TOAST
import Loader from "../components/common/Loader";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Filter, 
  AlertCircle,
  MapPin,
  LayoutDashboard
} from "lucide-react";

type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  type: "FIRST" | "FOLLOW_UP";
  reason?: string;
  user: {
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
      // Optional: Toast here if page load fails, but text error is usually fine for initial load
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

  // 🔔 UPDATED STATUS HANDLER WITH TOASTS
  const updateStatus = async (id: string, status: "CONFIRMED" | "REJECTED") => {
    const token = await auth.currentUser?.getIdToken();
    
    // 1. Show Loading Toast
    const toastId = toast.loading(
      status === "CONFIRMED" ? "Confirming booking..." : "Rejecting booking..."
    );

    // Optimistic Update (Update UI immediately)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // 2. Success Toast (Updates the loading toast)
      toast.success(
        status === "CONFIRMED" ? "Booking Confirmed!" : "Booking Rejected",
        { id: toastId }
      );

      // Refresh data to ensure sync
      const refreshedToken = await auth.currentUser?.getIdToken();
      if(refreshedToken) await fetchBookings(refreshedToken);

    } catch (err) {
      console.error(err);
      // 3. Error Toast (Updates the loading toast)
      toast.error("Failed to update status. Please try again.", { id: toastId });
      
      // Revert Optimistic Update on Error
      // (Optional but recommended so UI matches Server state)
      const refreshedToken = await auth.currentUser?.getIdToken();
      if(refreshedToken) await fetchBookings(refreshedToken);
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  if (error === "Admin access only") {
    return (
      <div className="min-h-screen bg-[#F9F6FF] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-[#Dd1764] mb-2">Access Denied</h1>
          <p className="text-[#3F2965]/70 mb-6">Administrators only.</p>
          <button onClick={() => router.push("/")} className="px-6 py-3 bg-[#3F2965] text-white rounded-full font-bold">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8">
      
      <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-[2.5rem] p-6 md:p-12 shadow-sm min-h-[80vh] text-[#3F2965]">
      
        {/* HEADER & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <LayoutDashboard className="text-[#Dd1764]" />
              Admin Dashboard
            </h1>
            <p className="text-[#3F2965]/60 mt-1 text-sm md:text-base">Manage appointments and schedules</p>
          </div>
          
          <button
            onClick={() => router.push("/admin/slots")}
            className="w-full md:w-auto justify-center px-6 py-3 bg-[#3F2965] text-white rounded-full font-bold shadow-lg hover:shadow-[#3F2965]/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Calendar size={18} />
            Manage Slots
          </button>
        </div>

        {/* CIRCULAR STATS */}
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
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
                filter === f 
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
              <BookingCard key={b.id} booking={b} onUpdate={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- SUB-COMPONENTS ---------------- //

function StatCircle({ 
  label, 
  value, 
  icon: Icon, 
  color,
  bg,
  textColor
}: { 
  label: string, 
  value: number, 
  icon: any, 
  color: string,
  bg: string,
  textColor: string
}) {
  return (
    <div className={`relative w-36 h-36 md:w-48 md:h-48 rounded-full border-[4px] md:border-[6px] ${color} ${bg} flex flex-col items-center justify-center shadow-xl md:shadow-2xl shadow-[#3F2965]/10 hover:scale-105 transition-all duration-300 group`}>
      <div className={`absolute -top-4 md:-top-5 p-2 md:p-3 rounded-full bg-white shadow-md border ${color} group-hover:-translate-y-1 transition-transform`}>
        <Icon className={`${textColor} w-5 h-5 md:w-6 md:h-6`} strokeWidth={2.5} />
      </div>
      <p className={`text-3xl md:text-5xl font-black ${textColor} mt-2`}>
        {value}
      </p>
      <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-[#3F2965]/60 mt-1 md:mt-2">
        {label}
      </p>
    </div>
  );
}

function BookingCard({ booking, onUpdate }: { booking: Booking, onUpdate: (id: string, status: any) => void }) {
  const date = new Date(booking.slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = `${new Date(booking.slot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - ${new Date(booking.slot.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
  
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#3F2965]/5 hover:shadow-md transition-all flex flex-col md:flex-row gap-4 md:gap-6">
      
      {/* Date Badge */}
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

      {/* Info & Actions */}
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
            
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
              booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
              'bg-yellow-100 text-yellow-700'
            }`}>
              {booking.status}
            </span>
          </div>

          <div className="bg-[#F9F6FF] p-3 rounded-lg border border-[#3F2965]/5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold bg-[#3F2965] text-white px-2 py-0.5 rounded">
                {booking.type === "FIRST" ? "First Session" : "Follow-up"}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#3F2965]/80 italic">
              {booking.reason ? `"${booking.reason}"` : <span className="opacity-50">No specific reason provided.</span>}
            </p>
          </div>
        </div>

        {booking.status === "PENDING" && (
          <div className="flex gap-3 pt-3 border-t border-[#3F2965]/5">
            <button
              onClick={() => onUpdate(booking.id, "CONFIRMED")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs md:text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={14} /> Confirm
            </button>
            <button
              onClick={() => onUpdate(booking.id, "REJECTED")}
              className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-xs md:text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <XCircle size={14} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}