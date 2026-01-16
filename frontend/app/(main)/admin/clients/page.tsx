"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase"; 
import { API_URL } from "@/app/lib/api";
import { 
  Users, Search, Mail, Phone, Calendar, 
  Edit2, Ban, CheckCircle, Save, X, ShieldAlert, Check, 
  ChevronDown, ChevronUp, Clock, MapPin, Filter, Send,
  Heart, FileText, ArrowLeft, AlignLeft 
} from "lucide-react";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

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

type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  type: "FIRST" | "FOLLOW_UP";
  therapyType?: string;
  reason?: string;
  
  // New Fields
  clientName?: string;
  phone?: string;
  attendees?: number;
  maritalStatus?: string;

  meetingNotes?: MeetingNotes;

  slot: {
    startTime: string;
    endTime: string;
    mode: "ONLINE" | "OFFLINE";
  };
};

type AdminNote = {
  id: string;
  note: string;
  createdAt: string;
  createdBy: string;
};

type Client = {
  id: string;
  email: string;
  name: string;
  phone: string;
  totalBookings: number;
  lastSession: string | null;
  adminNotes: AdminNote[];
  isBlocked: boolean;
  bookings: Booking[];
};

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [activityFilter, setActivityFilter] = useState<"ALL" | "REGULAR" | "NEW">("ALL");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [reportModal, setReportModal] = useState<{isOpen: boolean, client: Client | null}>({isOpen: false, client: null});
  const [reportContent, setReportContent] = useState("");

  const [viewNotesModal, setViewNotesModal] = useState<{isOpen: boolean, booking: Booking | null, notes: MeetingNotes | null}>({
    isOpen: false, booking: null, notes: null
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace("/login"); return; }
      const token = await user.getIdToken();
      fetchClients(token);
    });
    return () => unsub();
  }, []);

  const fetchClients = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data);
    } catch (err) {
      toast.error("Failed to load client database");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async (id: string) => {
    const token = await auth.currentUser?.getIdToken();
    const toastId = toast.loading("Saving note...");
    try {
      const res = await fetch(`${API_URL}/api/admin/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ adminNotes: editNotes }),
      });
      const data = await res.json();
      setClients(prev => prev.map(c => c.id === id ? data.user : c));
      setEditingId(null);
      toast.success("Note saved!", { id: toastId });
    } catch (err) { toast.error("Failed to save", { id: toastId }); }
  };

  const toggleBlock = async (client: Client) => {
    if (!confirm(`Are you sure you want to ${client.isBlocked ? "UNBLOCK" : "BLOCK"} this user?`)) return;
    const token = await auth.currentUser?.getIdToken();
    try {
      await fetch(`${API_URL}/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isBlocked: !client.isBlocked }),
      });
      setClients(prev => prev.map(c => c.id === client.id ? { ...c, isBlocked: !client.isBlocked } : c));
      toast.success(client.isBlocked ? "Unblocked" : "Blocked");
    } catch (err) { toast.error("Failed to update status"); }
  };

  const sendReport = async (clientId: string) => {
    if (!reportContent.trim()) {
      toast.error("Please enter report content");
      return;
    }
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;
    
    const toastId = toast.loading("Sending message...");
    try {
      await fetch(`${API_URL}/api/admin/clients/${clientId}/send-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reportContent, adminName: "Admin" }),
      });
      toast.success("Message sent successfully!", { id: toastId });
      setReportModal({isOpen: false, client: null});
      setReportContent("");
      fetchClients(token);
    } catch (err) { 
      toast.error("Failed to send message", { id: toastId }); 
    }
  };

  const handleBookingStatus = async (bookingId: string, status: "CONFIRMED" | "REJECTED") => {
    const token = await auth.currentUser?.getIdToken();
    const toastId = toast.loading("Updating booking...");
    try {
      await fetch(`${API_URL}/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if(token) fetchClients(token);
      toast.success(`Booking ${status}`, { id: toastId });
    } catch (err) { toast.error("Failed to update", { id: toastId }); }
  };

  const handleViewNotes = async (booking: Booking) => {
    const token = await auth.currentUser?.getIdToken();
    const toastId = toast.loading("Fetching notes...");
    try {
        const res = await fetch(`${API_URL}/api/bookings/${booking.id}/meeting-notes`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const notes = await res.json();
            setViewNotesModal({ isOpen: true, booking, notes });
            toast.dismiss(toastId);
        } else {
            toast.error("No notes found for this session.", { id: toastId });
        }
    } catch (err) {
        console.error(err);
        toast.error("Failed to load notes", { id: toastId });
    }
  };
  
  const filteredClients = clients.filter(c => {
    const matchesSearch = (c.name || "").toLowerCase().includes(search.toLowerCase()) || 
                          (c.email || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" ? true :
                          statusFilter === "BLOCKED" ? c.isBlocked :
                          !c.isBlocked; 
    const matchesActivity = activityFilter === "ALL" ? true :
                            activityFilter === "REGULAR" ? c.totalBookings > 0 :
                            c.totalBookings === 0; 
    return matchesSearch && matchesStatus && matchesActivity;
  });

  if (loading) return <Loader fullScreen message="Loading Client Database..." />;

  return (
    <div className="min-h-screen bg-[#F9F6FF] pt-20 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header & Back Button --- */}
        <div className="flex flex-col gap-6 mb-8 relative z-10">
          <div>
            <button 
                onClick={() => router.push('/admin')} 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3F2965] font-medium mb-4 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/50"
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
              <Users className="text-[#Dd1764]" size={32} /> Client Management
            </h1>
            <p className="text-gray-500 mt-1">Manage users, view histories, and update notes.</p>
          </div>

          {/* --- Filters Toolbar --- */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search */}
            <div className="relative w-full md:flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#Dd1764]" size={18} />
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200 text-sm transition-all placeholder:text-gray-400"
                placeholder="Search clients by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-40 group">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#Dd1764]" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none cursor-pointer appearance-none font-medium hover:bg-gray-100 transition-colors"
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BLOCKED">Blocked</option>
                    </select>
                </div>

                <div className="relative flex-1 md:w-40 group">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#Dd1764]" />
                    <select 
                        value={activityFilter}
                        onChange={(e) => setActivityFilter(e.target.value as any)}
                        className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none cursor-pointer appearance-none font-medium hover:bg-gray-100 transition-colors"
                    >
                        <option value="ALL">All Activity</option>
                        <option value="REGULAR">With Bookings</option>
                        <option value="NEW">New Signups</option>
                    </select>
                </div>
            </div>
          </div>
        </div>

        {/* --- Client List --- */}
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
             <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-300">
                <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No clients found matching your filters.</p>
                <button 
                    onClick={() => {setSearch(""); setStatusFilter("ALL"); setActivityFilter("ALL");}}
                    className="mt-3 text-[#Dd1764] font-bold text-sm hover:underline"
                >
                    Clear Filters
                </button>
             </div>
          ) : (
            filteredClients.map((client) => (
            <motion.div 
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-xl border shadow-sm transition-all ${
                  client.isBlocked ? "border-red-200 bg-red-50/10" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="p-4 lg:p-6 flex flex-col lg:flex-row gap-6 lg:items-start">
                
                {/* 1. Profile & Stats */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${
                        client.isBlocked ? "bg-red-100 text-red-600" : "bg-[#3F2965] text-white"
                    }`}>
                        {client.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {client.name || "Unknown"}
                          {client.isBlocked && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><ShieldAlert size={10} /> Blocked</span>}
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-y-1 sm:gap-x-4 text-sm text-gray-500 mt-1">
                           <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400"/> {client.email}</span>
                           {client.phone && <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400"/> {client.phone}</span>}
                        </div>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Bookings</p>
                        <p className="font-bold text-gray-900 text-xl">{client.totalBookings}</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Session</p>
                        <p className="font-bold text-gray-900 text-xl truncate">
                            {client.lastSession ? new Date(client.lastSession).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : "-"}
                        </p>
                    </div>
                  </div>
                </div>

                {/* 2. Admin Notes (Responsive Fix) */}
                <div className="lg:w-1/3 w-full bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col min-h-[120px] lg:min-h-[160px]">
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><Edit2 size={12} /> Admin Notes</p>
                        {editingId === client.id ? (
                            <div className="flex gap-1">
                                <button onClick={() => setEditingId(null)} className="p-1 hover:bg-white rounded text-red-500 transition-colors"><X size={14}/></button>
                                <button onClick={() => handleSaveNotes(client.id)} className="p-1 hover:bg-white rounded text-green-600 transition-colors"><Check size={14}/></button>
                            </div>
                        ) : (
                            <button onClick={() => { setEditingId(client.id); setEditNotes(""); }} className="p-1 hover:bg-white rounded text-gray-400 hover:text-[#3F2965] transition-colors">
                                <Edit2 size={14} />
                            </button>
                        )}
                    </div>
                    {editingId === client.id ? (
                        <textarea 
                            className="w-full flex-1 bg-white p-3 rounded-lg text-sm border border-gray-200 focus:border-purple-500 focus:outline-none resize-none"
                            rows={3} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} autoFocus
                            placeholder="Add a new note..."
                        />
                    ) : (
                        <div className="flex-1 overflow-y-auto max-h-[120px] custom-scrollbar">
                            {client.adminNotes && client.adminNotes.length > 0 ? (
                                <div className="space-y-2">
                                    {client.adminNotes.map((note) => (
                                        <div key={note.id} className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.note}</p>
                                            <p className="text-[10px] text-gray-400 mt-1.5 text-right">
                                                {new Date(note.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic text-center mt-4">No notes recorded.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. Actions Toolbar */}
                <div className="flex flex-col gap-2 lg:w-40 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6">
                    <button 
                        onClick={() => toggleBlock(client)}
                        className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors ${client.isBlocked ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-white border border-red-200 text-red-600 hover:bg-red-50"}`}
                    >
                        {client.isBlocked ? <><CheckCircle size={14}/> Unblock</> : <><Ban size={14}/> Block</>}
                    </button>

                    <button 
                        onClick={() => setReportModal({isOpen: true, client})}
                        className="w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 transition-colors"
                    >
                        <Send size={14}/> Message
                    </button>
                    
                    <button 
                        onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                        className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors ${expandedId === client.id ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        {expandedId === client.id ? "Hide History" : "History"} 
                        {expandedId === client.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                </div>
              </div>

              {/* --- Booking History (Expandable) --- */}
              <AnimatePresence>
              {expandedId === client.id && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-gray-50 border-t border-gray-200 overflow-hidden"
                >
                    <div className="p-4 lg:p-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Clock size={14} /> Recent Activity
                        </h4>
                        
                        {client.bookings.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No booking history found for this client.</p>
                        ) : (
                            <div className="grid gap-3">
                                {client.bookings.map(booking => (
                                <div key={booking.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-bold text-gray-900">
                                                {new Date(booking.slot.startTime).toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'})}
                                            </p>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                                booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                                                booking.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 mt-2">
                                            <span className="flex items-center gap-1"><Clock size={12}/> {new Date(booking.slot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                            <span className="flex items-center gap-1"><MapPin size={12}/> {booking.slot.mode}</span>
                                            <span className="font-bold text-[#3F2965] bg-[#3F2965]/5 px-1.5 py-0.5 rounded">{booking.type}</span>
                                        </div>

                                        {/* Attendees & Status Badges */}
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            {booking.attendees && booking.attendees > 1 && (
                                                <span className="text-[10px] font-bold text-purple-700 flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                                    <Users size={10} /> {booking.attendees} People
                                                </span>
                                            )}
                                            {booking.maritalStatus && (
                                                    <span className="text-[10px] font-bold text-pink-700 flex items-center gap-1 bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                                                    <Heart size={10} /> {booking.maritalStatus}
                                                </span>
                                            )}
                                        </div>

                                        {/* Specific Contact Info (If different) */}
                                        {(booking.clientName || booking.phone) && (
                                            <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-4 text-[10px] text-gray-400 font-medium">
                                                {booking.clientName && <span>User: {booking.clientName}</span>}
                                                {booking.phone && <span>Phone: {booking.phone}</span>}
                                            </div>
                                        )}

                                        {/* --- REASON FIELD DISPLAY --- */}
                                        {booking.reason && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                                    <AlignLeft size={10} /> Reason for Visit
                                                </span>
                                                <p className="text-xs text-gray-600 italic mt-0.5 pl-1 border-l-2 border-[#3F2965]/20">
                                                    "{booking.reason}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 w-full md:w-auto min-w-[120px]">
                                        {booking.status === "PENDING" && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleBookingStatus(booking.id, "CONFIRMED")} className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition-colors">Confirm</button>
                                                <button onClick={() => handleBookingStatus(booking.id, "REJECTED")} className="flex-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded transition-colors">Reject</button>
                                            </div>
                                        )}
                                        {/* View Notes Button */}
                                        <button 
                                            onClick={() => handleViewNotes(booking)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded border border-gray-200 transition-colors"
                                        >
                                            <FileText size={12} /> View Notes
                                        </button>
                                    </div>
                                </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
            ))
          )}
        </div>
      </div>

      {/* --- Report Modal --- */}
      {reportModal.isOpen && reportModal.client && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Message {reportModal.client.name}</h3>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:border-purple-500 focus:outline-none text-sm"
              rows={5}
              placeholder="Type your message or report here..."
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            />
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setReportModal({isOpen: false, client: null})}
                className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => reportModal.client && sendReport(reportModal.client.id)}
                className="flex-1 py-2.5 px-4 bg-[#3F2965] text-white rounded-lg font-bold hover:bg-[#2a1b45] text-sm transition-colors"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- View Notes Modal (Read Only) --- */}
      {viewNotesModal.isOpen && viewNotesModal.notes && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Session Notes</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(viewNotesModal.booking?.slot.startTime!).toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'})}
                        </p>
                    </div>
                    <button onClick={() => setViewNotesModal({isOpen: false, booking: null, notes: null})} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                     {/* Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Session Summary</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {viewNotesModal.notes.sessionSummary || <span className="italic text-gray-400">No summary provided.</span>}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Client Progress</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {viewNotesModal.notes.clientProgress || "-"}
                            </p>
                        </div>
                         <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Key Insights</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {viewNotesModal.notes.keyInsights || "-"}
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Follow-up Plan</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {viewNotesModal.notes.followUpPlan || "-"}
                        </p>
                    </div>

                    {viewNotesModal.notes.additionalNotes && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Additional Notes</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {viewNotesModal.notes.additionalNotes}
                            </p>
                        </div>
                    )}
                    
                    {/* Private Notes Section */}
                    {viewNotesModal.notes.therapistNotes && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <h4 className="text-xs font-bold text-amber-700 uppercase mb-2 flex items-center gap-1">
                                <ShieldAlert size={12}/> Therapist Private Notes
                            </h4>
                            <p className="text-sm text-amber-900/80 whitespace-pre-wrap leading-relaxed font-medium">
                                {viewNotesModal.notes.therapistNotes}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
                    <button 
                        onClick={() => setViewNotesModal({isOpen: false, booking: null, notes: null})} 
                        className="px-6 py-2.5 bg-[#3F2965] text-white rounded-lg font-bold hover:bg-[#2a1b45] transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
          </div>
      )}
    </div>
  );
}