"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; 
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import { 
  Calendar, Clock, User, CheckCircle, XCircle, 
  Video, X, Link as LinkIcon, ExternalLink,
  Phone, Mail, FileText, Save, Users, Heart,
  Filter, Search, LayoutDashboard, Award, Settings, ShieldAlert,
  Banknote
} from "lucide-react";

type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  type: "FIRST" | "FOLLOW_UP";
  therapyType?: string;
  reason?: string;
  meetingLink?: string;
  paymentType?: string; 
  clientName?: string;
  phone?: string;
  attendees?: number;
  maritalStatus?: string;

  user: {
    id: string; 
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
  meetingNotes?: MeetingNotes;
};

type MeetingNotes = {
  id: string;
  meetingStartedAt?: string;
  meetingEndedAt?: string;
  meetingDuration?: number;
  sessionSummary?: string;
  clientProgress?: string;
  keyInsights?: string;
  followUpPlan?: string;
  additionalNotes?: string;
  therapistNotes?: string;
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "REJECTED">("ALL");
  const [dateSearch, setDateSearch] = useState("");
  const [therapyFilter, setTherapyFilter] = useState("ALL");

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; bookingId: string | null }>({
    isOpen: false, bookingId: null
  });
  const [manualLink, setManualLink] = useState("");

  const [notesModal, setNotesModal] = useState<{ isOpen: boolean; booking: Booking | null }>({
    isOpen: false, booking: null
  });
  const [meetingNotes, setMeetingNotes] = useState<MeetingNotes | null>(null);
  const [notesForm, setNotesForm] = useState({
    sessionSummary: "", clientProgress: "", keyInsights: "", followUpPlan: "", additionalNotes: "", therapistNotes: ""
  });

  const isValidLink = (link: string) => {
    try {
      const url = new URL(link);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) { return false; }
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
      toast.error("Please enter a valid URL");
      return;
    }
    await updateStatus(confirmModal.bookingId, "CONFIRMED", manualLink);
    setConfirmModal({ isOpen: false, bookingId: null });
  };

  const updateStatus = async (id: string, status: "CONFIRMED" | "REJECTED", link?: string) => {
    const token = await auth.currentUser?.getIdToken();
    const toastId = toast.loading(status === "CONFIRMED" ? "Confirming..." : "Rejecting...");
    
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status, meetingLink: link } : b));

    try {
      const res = await fetch(`${API_URL}/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

  const openNotesModal = async (booking: Booking) => {
    setNotesModal({ isOpen: true, booking });
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`${API_URL}/api/bookings/${booking.id}/meeting-notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const notes = await res.json();
        setMeetingNotes(notes);
        setNotesForm({
          sessionSummary: notes.sessionSummary || "",
          clientProgress: notes.clientProgress || "",
          keyInsights: notes.keyInsights || "",
          followUpPlan: notes.followUpPlan || "",
          additionalNotes: notes.additionalNotes || "",
          therapistNotes: notes.therapistNotes || ""
        });
      } else {
        setMeetingNotes(null);
        setNotesForm({ sessionSummary: "", clientProgress: "", keyInsights: "", followUpPlan: "", additionalNotes: "", therapistNotes: "" });
      }
    } catch (err) { console.error("Failed to fetch meeting notes:", err); }
  };

  const saveMeetingNotes = async () => {
    if (!notesModal.booking) return;
    const token = await auth.currentUser?.getIdToken();
    const toastId = toast.loading("Saving notes...");
    try {
      const res = await fetch(`${API_URL}/api/bookings/${notesModal.booking.id}/meeting-notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(notesForm),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      toast.success("Notes saved successfully!", { id: toastId });
      setNotesModal({ isOpen: false, booking: null });
      const refreshedToken = await auth.currentUser?.getIdToken();
      if(refreshedToken) await fetchBookings(refreshedToken);
    } catch (err: any) {
      toast.error(err.message || "Failed to save notes", { id: toastId });
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filter === "ALL" ? true : b.status === filter;
    let matchesDate = true;
    if (dateSearch) {
      const bookingDate = new Date(b.slot.date).toISOString().split('T')[0];
      matchesDate = bookingDate === dateSearch;
    }
    const matchesTherapy = therapyFilter === "ALL" ? true : b.therapyType === therapyFilter;
    return matchesStatus && matchesDate && matchesTherapy;
  });

  const uniqueTherapyTypes = Array.from(new Set(bookings.map(b => b.therapyType).filter(Boolean)));

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
  };

  if (error === "Admin access only") return <div className="p-10 text-center text-red-600 font-bold">Access Denied</div>;

  return (
    <div className="min-h-screen bg-[#F9F6FF] pt-20 px-4 md:px-8 pb-12">
      
      {confirmModal.isOpen && (
         <div className="fixed inset-0 bg-[#3F2965]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-[#3F2965]/10 animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-[#3F2965]">Add Meeting Link</h3>
               <button onClick={() => setConfirmModal({isOpen: false, bookingId: null})} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                 <X size={20} className="text-[#3F2965]/60" />
               </button>
             </div>
             
             <p className="text-sm text-[#3F2965]/60 mb-4 font-medium">Create a meeting link below, then copy-paste it here.</p>
             <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 mb-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                <Video size={18} /> Generate Google Meet Link <ExternalLink size={14} />
             </a>
             <div className="relative mb-2">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/40 pointer-events-none"><LinkIcon size={18} /></div>
               <input 
                 className={`w-full pl-12 pr-4 py-3.5 bg-[#F9F6FF] rounded-xl border focus:ring-4 outline-none font-medium transition-all placeholder:text-[#3F2965]/30 ${manualLink && !isValidLink(manualLink) ? "border-red-300 focus:border-red-500 focus:ring-red-100 text-red-600" : "border-[#3F2965]/10 focus:border-[#Dd1764] focus:ring-[#Dd1764]/5 text-[#3F2965]"}`} 
                 placeholder="https://meet.google.com/..." 
                 value={manualLink} 
                 onChange={(e) => setManualLink(e.target.value)} 
                 autoFocus 
               />
             </div>
             
             <button 
               onClick={submitConfirmWithLink}
               disabled={!manualLink || !isValidLink(manualLink)}
               className="w-full mt-6 py-3.5 bg-[#Dd1764] text-white rounded-xl font-bold hover:bg-[#b01350] transition-all shadow-lg shadow-[#Dd1764]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <CheckCircle size={18} /> Confirm & Send
             </button>
           </div>
         </div>
      )}

      {notesModal.isOpen && (
        <div className="fixed inset-0 bg-[#3F2965]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#3F2965]/10 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#3F2965]">Session Notes</h3>
                <button onClick={() => setNotesModal({isOpen: false, booking: null})} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-[#3F2965]/60" /></button>
                </div>
                
                {notesModal.booking && (
                  <div className="mb-6 p-4 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10">
                    <div className="flex items-center gap-3 mb-2">
                      <User size={16} className="text-[#Dd1764]" />
                      <span className="font-bold text-[#3F2965]">{notesModal.booking.clientName || notesModal.booking.user.name}</span>
                      <span className="text-xs text-[#3F2965]/60">
                        {new Date(notesModal.booking.slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                    <div><label className="block text-sm font-bold text-[#3F2965] mb-2">Session Summary</label><textarea value={notesForm.sessionSummary} onChange={(e) => setNotesForm(prev => ({ ...prev, sessionSummary: e.target.value }))} className="w-full p-3 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10 focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/5 outline-none resize-none" rows={3}/></div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold text-[#3F2965] mb-2">Client Progress</label><textarea value={notesForm.clientProgress} onChange={(e) => setNotesForm(prev => ({ ...prev, clientProgress: e.target.value }))} className="w-full p-3 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10 focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/5 outline-none resize-none" rows={3}/></div>
                        <div><label className="block text-sm font-bold text-[#3F2965] mb-2">Key Insights</label><textarea value={notesForm.keyInsights} onChange={(e) => setNotesForm(prev => ({ ...prev, keyInsights: e.target.value }))} className="w-full p-3 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10 focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/5 outline-none resize-none" rows={3}/></div>
                    </div>
                    <div><label className="block text-sm font-bold text-[#3F2965] mb-2">Follow-up Plan</label><textarea value={notesForm.followUpPlan} onChange={(e) => setNotesForm(prev => ({ ...prev, followUpPlan: e.target.value }))} className="w-full p-3 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10 focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/5 outline-none resize-none" rows={3}/></div>
                    <div><label className="block text-sm font-bold text-[#3F2965] mb-2">Additional Notes</label><textarea value={notesForm.additionalNotes} onChange={(e) => setNotesForm(prev => ({ ...prev, additionalNotes: e.target.value }))} className="w-full p-3 bg-[#F9F6FF] rounded-xl border border-[#3F2965]/10 focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/5 outline-none resize-none" rows={3}/></div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <label className="block text-sm font-bold text-yellow-700 mb-2 flex items-center gap-2"><ShieldAlert size={14}/> Therapist Private Notes</label>
                        <textarea value={notesForm.therapistNotes} onChange={(e) => setNotesForm(prev => ({ ...prev, therapistNotes: e.target.value }))} className="w-full p-3 bg-white rounded-lg border border-yellow-200 focus:border-yellow-500 outline-none text-sm min-h-[80px]" placeholder="Visible only to admins..." />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                    <button onClick={() => setNotesModal({isOpen: false, booking: null})} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                    <button onClick={saveMeetingNotes} className="px-5 py-2.5 text-sm font-bold bg-[#3F2965] text-white rounded-lg hover:bg-[#2a1b45] transition-colors flex items-center gap-2"><Save size={16} /> Save Notes</button>
                </div>
            </div>
        </div>
      )}
        
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3F2965] flex items-center gap-3">
              <LayoutDashboard size={32} className="text-[#Dd1764]" /> Admin Dashboard
            </h1>
            <p className="text-[#3F2965]/60 mt-2 text-base">Overview of all appointments and platform management.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <button onClick={() => router.push("/admin/clients")} className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#3F2965]/10 rounded-xl shadow-sm hover:shadow-md hover:border-[#3F2965]/20 transition-all group">
                <div className="w-10 h-10 rounded-full bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] mb-2 group-hover:bg-[#3F2965] group-hover:text-white transition-colors">
                    <User size={20} />
                </div>
                <span className="font-bold text-[#3F2965] text-xs sm:text-sm">Clients</span>
            </button>
            <button onClick={() => router.push("/admin/discounts")} className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#3F2965]/10 rounded-xl shadow-sm hover:shadow-md hover:border-[#3F2965]/20 transition-all group">
                <div className="w-10 h-10 rounded-full bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] mb-2 group-hover:bg-[#3F2965] group-hover:text-white transition-colors">
                    <Award size={20} />
                </div>
                <span className="font-bold text-[#3F2965] text-xs sm:text-sm">Discounts</span>
            </button>
            <button onClick={() => router.push("/admin/settings")} className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#3F2965]/10 rounded-xl shadow-sm hover:shadow-md hover:border-[#3F2965]/20 transition-all group">
                <div className="w-10 h-10 rounded-full bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] mb-2 group-hover:bg-[#3F2965] group-hover:text-white transition-colors">
                    <Settings size={20} />
                </div>
                <span className="font-bold text-[#3F2965] text-xs sm:text-sm">Config</span>
            </button>
            <button onClick={() => router.push("/admin/slots")} className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-[#3F2965]/10 rounded-xl shadow-sm hover:shadow-md hover:border-[#3F2965]/20 transition-all group">
                <div className="w-10 h-10 rounded-full bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] mb-2 group-hover:bg-[#3F2965] group-hover:text-white transition-colors">
                    <Calendar size={20} />
                </div>
                <span className="font-bold text-[#3F2965] text-xs sm:text-sm">Slots</span>
            </button>
        </div>

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

        <div className="bg-white p-3 rounded-2xl border border-[#3F2965]/10 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex overflow-x-auto gap-2 no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                {["ALL", "PENDING", "CONFIRMED", "REJECTED"].map((f) => (
                    <button key={f} onClick={() => setFilter(f as any)} className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === f ? "bg-[#3F2965] text-white" : "bg-[#F9F6FF] text-[#3F2965]/60 hover:bg-[#3F2965]/5"}`}>{f === "ALL" ? "All Status" : f.charAt(0) + f.slice(1).toLowerCase()}</button>
                ))}
            </div>

            <div className="flex-1 hidden md:block"></div>

            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative group flex-1 md:w-auto">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3F2965]/30"><Calendar size={16} /></div>
                    <input 
                        type="date" 
                        value={dateSearch}
                        onChange={(e) => setDateSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F9F6FF] text-[#3F2965] text-sm font-bold rounded-xl border border-transparent focus:border-[#Dd1764]/30 focus:bg-white focus:outline-none transition-all cursor-pointer"
                    />
                </div>

                <div className="relative group flex-1 md:w-auto">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3F2965]/30"><Filter size={16} /></div>
                    <select
                        value={therapyFilter}
                        onChange={(e) => setTherapyFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 bg-[#F9F6FF] text-[#3F2965] text-sm font-bold rounded-xl border border-transparent focus:border-[#Dd1764]/30 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="ALL">All Therapies</option>
                        {uniqueTherapyTypes.map((type) => (
                            <option key={type as string} value={type as string}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {loading ? ( 
            <Loader fullScreen={true} message="Loading Dashboard Data..."/> 
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-[#3F2965]/10">
            <div className="w-16 h-16 bg-[#F9F6FF] rounded-full flex items-center justify-center mx-auto mb-4 text-[#3F2965]/40">
                <Search size={32} />
            </div>
            <p className="text-[#3F2965]/40 font-bold text-lg">No bookings found matching filters.</p>
            <button onClick={() => {setDateSearch(""); setTherapyFilter("ALL"); setFilter("ALL")}} className="mt-2 text-[#Dd1764] text-sm font-bold hover:underline">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((b) => (
              <BookingCard 
                key={b.id} 
                booking={b} 
                onConfirm={handleConfirmClick}
                onReject={(id) => updateStatus(id, "REJECTED")}
                onOpenNotes={openNotesModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type StatCircleProps = { label: string; value: number; icon: any; color: string; bg: string; textColor: string; };
function StatCircle({ label, value, icon: Icon, color, bg, textColor }: StatCircleProps) {
  return (
    <div className={`relative w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full border-[4px] md:border-[6px] ${color} ${bg} flex flex-col items-center justify-center shadow-xl md:shadow-2xl shadow-[#3F2965]/10 hover:scale-105 transition-all duration-300 group`}>
      <div className={`absolute -top-3 md:-top-5 p-2 md:p-3 rounded-full bg-white shadow-md border ${color} group-hover:-translate-y-1 transition-transform`}><Icon className={`${textColor} w-4 h-4 md:w-6 md:h-6`} strokeWidth={2.5} /></div>
      <p className={`text-2xl sm:text-3xl md:text-5xl font-black ${textColor} mt-1 md:mt-2`}>{value}</p>
      <p className="text-[8px] sm:text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-[#3F2965]/60 mt-0.5 md:mt-2">{label}</p>
    </div>
  );
}

type BookingCardProps = {
  booking: Booking;
  onConfirm: (booking: Booking) => void;
  onReject: (id: string) => void;
  onOpenNotes?: (booking: Booking) => void;
};

function BookingCard({ booking, onConfirm, onReject, onOpenNotes }: BookingCardProps) {
  const date = new Date(booking.slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = `${new Date(booking.slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="bg-white rounded-2xl border border-[#3F2965]/5 p-5 flex flex-col sm:flex-row gap-6 hover:shadow-lg hover:border-[#3F2965]/10 transition-all duration-300">
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


      <div className="flex-1 flex flex-col justify-between gap-4">
        <div>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg text-[#3F2965]">{booking.clientName || booking.user.name || "Unknown User"}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {booking.attendees && booking.attendees > 1 && (
                            <span className="text-[10px] font-bold text-[#3F2965] flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                <Users size={10} /> {booking.attendees} People
                            </span>
                        )}
                        {booking.maritalStatus && (
                             <span className="text-[10px] font-bold text-[#Dd1764] flex items-center gap-1 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                                <Heart size={10} /> {booking.maritalStatus}
                            </span>
                        )}
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                    booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                }`}>
                    {booking.status}
                </span>
            </div>
            
            <div className="space-y-1.5 mb-4">
                <p className="text-xs font-medium text-[#3F2965]/60 flex items-center gap-2">
                  <Mail size={12} /> <span className="break-all">{booking.user.email}</span>
                </p>
                {(booking.phone || booking.user.phone) && (
                    <p className="text-xs font-medium text-[#3F2965]/60 flex items-center gap-2">
                        <Phone size={12} /> {booking.phone || booking.user.phone}
                    </p>
                )}
            </div>

            <div className="bg-[#F9F6FF] p-3 rounded-xl border border-[#3F2965]/5">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-[#3F2965] text-white px-2 py-0.5 rounded-md">
                        {booking.type === "FIRST" ? "First Session" : "Follow-up"}
                    </span>
                    {booking.therapyType && (
                        <span className="text-[10px] font-bold bg-[#Dd1764] text-white px-2 py-0.5 rounded-md">
                            {booking.therapyType}
                        </span>
                    )}

                    {booking.paymentType && (
                         <div className="flex flex-col items-start gap-1">
                             <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Banknote size={10} /> {booking.paymentType}
                            </span>
                            {booking.paymentType === "UPI" && (booking as any).transactionId && (
                                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 select-all" title="Copy to verify">
                                    UTR: {(booking as any).transactionId}
                                </span>
                            )}
                         </div>
                    )}
                </div>
                <p className="text-xs text-[#3F2965]/70 italic line-clamp-2">
                    {booking.reason || "No specific notes provided."}
                </p>
            </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-[#3F2965]/5">
            {booking.meetingLink && (
                <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100" title="Join Meeting">
                    <Video size={16} />
                </a>
            )}
            
            {booking.status === "CONFIRMED" && (
                <button onClick={() => onOpenNotes?.(booking)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#3F2965] bg-white border border-[#3F2965]/10 hover:bg-[#F9F6FF] rounded-xl transition-all shadow-sm">
                    <FileText size={14} className="text-[#3F2965]/60" /> Session Notes
                </button>
            )}

            {booking.status === "PENDING" && (
                <>
                    <button onClick={() => onReject(booking.id)} className="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-xl transition-all">
                        Reject
                    </button>
                    <button onClick={() => onConfirm(booking)} className="px-4 py-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5">
                        <CheckCircle size={14} /> Confirm
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
}