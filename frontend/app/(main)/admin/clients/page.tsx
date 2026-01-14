"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase"; 
import { API_URL } from "@/app/lib/api";
import { 
  Users, Search, Mail, Phone, Calendar, 
  Edit2, Ban, CheckCircle, Save, X, ShieldAlert, Check, 
  ChevronDown, ChevronUp, Clock, MapPin, Filter, Send
} from "lucide-react";
import Loader from "../../components/common/Loader";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// --- Types ---
type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  type: "FIRST" | "FOLLOW_UP";
  therapyType?: string;
  reason?: string;
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
  
  // Search & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [activityFilter, setActivityFilter] = useState<"ALL" | "REGULAR" | "NEW">("ALL");

  // State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reportModal, setReportModal] = useState<{isOpen: boolean, client: Client | null}>({isOpen: false, client: null});
  const [reportContent, setReportContent] = useState("");

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

  // --- Client Actions ---
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
    if (!token) {
      toast.error("Authentication failed");
      return;
    }
    
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
      // Refresh clients to update notes
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

  // --- Filter Logic ---
  const filteredClients = clients.filter(c => {
    const matchesSearch = (c.name || "").toLowerCase().includes(search.toLowerCase()) || 
                          (c.email || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" ? true :
                          statusFilter === "BLOCKED" ? c.isBlocked :
                          !c.isBlocked; // Active

    const matchesActivity = activityFilter === "ALL" ? true :
                            activityFilter === "REGULAR" ? c.totalBookings > 0 :
                            c.totalBookings === 0; // New

    return matchesSearch && matchesStatus && matchesActivity;
  });

  if (loading) return <Loader fullScreen message="Loading Client Base..." />;

  return (
    <div className="min-h-screen bg-[#F9F6FF] pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-[#3F2965]">
              <Users className="text-[#Dd1764]" size={32} /> Client Management
            </h1>
            <p className="text-[#3F2965]/60 mt-2">Manage users, notes, and booking history.</p>
          </div>

          {/* Search & Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/40 group-focus-within:text-[#Dd1764]" size={20} />
              <input 
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-[#3F2965]/10 focus:outline-none focus:border-[#Dd1764] text-[#3F2965] shadow-sm"
                placeholder="Search clients by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#3F2965]/10 shadow-sm">
                <Filter size={16} className="text-[#3F2965]/40" />
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-transparent text-sm font-bold text-[#3F2965] outline-none cursor-pointer"
                >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active Only</option>
                    <option value="BLOCKED">Blocked Only</option>
                </select>
            </div>

            {/* Activity Filter */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#3F2965]/10 shadow-sm">
                <Calendar size={16} className="text-[#3F2965]/40" />
                <select 
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value as any)}
                    className="bg-transparent text-sm font-bold text-[#3F2965] outline-none cursor-pointer"
                >
                    <option value="ALL">All Activity</option>
                    <option value="REGULAR">With Bookings</option>
                    <option value="NEW">New Signups</option>
                </select>
            </div>

          </div>
        </div>

        {/* Clients List */}
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#3F2965]/20">
                <Users className="mx-auto h-12 w-12 text-[#3F2965]/20 mb-3" />
                <p className="text-[#3F2965]/40 font-bold">No clients found matching your filters.</p>
                <button 
                    onClick={() => {setSearch(""); setStatusFilter("ALL"); setActivityFilter("ALL");}}
                    className="mt-4 text-[#Dd1764] font-bold text-sm hover:underline"
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
              className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-all ${
                  client.isBlocked ? "border-red-200 bg-red-50/10" : "border-[#3F2965]/5 hover:shadow-md"
              }`}
            >
              <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                
                {/* 1. Client Info */}
                <div className="flex-1 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                        client.isBlocked ? "bg-red-100 text-red-600" : "bg-[#F9F6FF] text-[#3F2965]"
                    }`}>
                        {client.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#3F2965] flex items-center gap-2">
                          {client.name || "Unknown"}
                          {client.isBlocked && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><ShieldAlert size={10} /> BLOCKED</span>}
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-sm text-[#3F2965]/60 mt-1">
                           <span className="flex items-center gap-1.5"><Mail size={12}/> {client.email}</span>
                           {client.phone && <span className="hidden sm:inline">•</span>}
                           {client.phone && <span className="flex items-center gap-1.5"><Phone size={12}/> {client.phone}</span>}
                        </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Bookings</p>
                        <p className="font-bold text-[#3F2965] text-xl">{client.totalBookings}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Last Session</p>
                        <p className="font-bold text-[#3F2965] text-xl truncate">
                            {client.lastSession ? new Date(client.lastSession).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : "-"}
                        </p>
                    </div>
                  </div>
                </div>

                {/* 2. Admin Notes */}
                <div className="flex-1 bg-gray-50 p-5 rounded-2xl border border-gray-100 relative group flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Edit2 size={12} /> Admin Notes</p>
                        {editingId === client.id ? (
                            <div className="flex gap-2">
                                <button onClick={() => setEditingId(null)} className="p-1 hover:bg-white rounded text-red-500"><X size={14}/></button>
                                <button onClick={() => handleSaveNotes(client.id)} className="p-1 hover:bg-white rounded text-green-600"><Check size={14}/></button>
                            </div>
                        ) : (
                            <button onClick={() => { setEditingId(client.id); setEditNotes(""); }} className="p-1 hover:bg-white rounded opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#3F2965]">
                                <Edit2 size={14} />
                            </button>
                        )}
                    </div>
                    {editingId === client.id ? (
                        <textarea 
                            className="w-full flex-1 bg-white p-2 rounded-xl text-sm border focus:border-[#3F2965]/30 focus:outline-none resize-none"
                            rows={3} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} autoFocus
                            placeholder="Add a new note..."
                        />
                    ) : (
                        <div className="flex-1 overflow-y-auto max-h-32">
                            {client.adminNotes && client.adminNotes.length > 0 ? (
                                <div className="space-y-2">
                                    {client.adminNotes.map((note) => (
                                        <div key={note.id} className="bg-white p-2 rounded-lg border border-gray-100">
                                            <p className="text-sm text-[#3F2965]/80 whitespace-pre-wrap">{note.note}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(note.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-[#3F2965]/70 italic">No notes.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. Actions */}
                <div className="flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8 min-w-[140px]">
                    <button 
                        onClick={() => toggleBlock(client)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 ${client.isBlocked ? "bg-green-100 text-green-700" : "bg-white border border-red-100 text-red-500 hover:bg-red-50"}`}
                    >
                        {client.isBlocked ? <><CheckCircle size={14}/> Unblock</> : <><Ban size={14}/> Block User</>}
                    </button>

                    <button 
                        onClick={() => setReportModal({isOpen: true, client})}
                        className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                    >
                        <Send size={14}/> Send Message
                    </button>
                    
                    <button 
                        onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors ${expandedId === client.id ? "bg-[#3F2965] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                        {expandedId === client.id ? "Hide History" : "View History"} 
                        {expandedId === client.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                </div>
              </div>

              {/* ✨ EXPANDABLE BOOKING HISTORY */}
              <AnimatePresence>
                {expandedId === client.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[#F9F6FF] border-t border-[#3F2965]/5 overflow-hidden"
                  >
                    <div className="p-6 md:p-8">
                      <h4 className="text-sm font-bold text-[#3F2965]/60 uppercase tracking-wider mb-4">Booking History</h4>
                      
                      {client.bookings.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">No booking history found.</p>
                      ) : (
                        <div className="grid gap-3">
                          {client.bookings.map(booking => (
                            <div key={booking.id} className="bg-white p-4 rounded-xl border border-[#3F2965]/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="font-bold text-[#3F2965]">
                                            {new Date(booking.slot.startTime).toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'})}
                                        </p>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                                            booking.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-[#3F2965]/60">
                                        <span className="flex items-center gap-1"><Clock size={12}/> {new Date(booking.slot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                        <span className="flex items-center gap-1"><MapPin size={12}/> {booking.slot.mode}</span>
                                        <span className="font-bold text-[#3F2965]/40">{booking.type}</span>
                                    </div>
                                    {booking.reason && <p className="text-xs text-[#3F2965]/50 italic mt-1">"{booking.reason}"</p>}
                                </div>

                                {booking.status === "PENDING" && (
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button onClick={() => handleBookingStatus(booking.id, "CONFIRMED")} className="flex-1 md:flex-none px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors">Confirm</button>
                                        <button onClick={() => handleBookingStatus(booking.id, "REJECTED")} className="flex-1 md:flex-none px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-lg transition-colors">Reject</button>
                                    </div>
                                )}
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

      {/* Report Modal */}
      {reportModal.isOpen && reportModal.client && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#3F2965] mb-4">Send Message to {reportModal.client.name}</h3>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:border-[#3F2965] focus:outline-none"
              rows={6}
              placeholder="Write your report here..."
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setReportModal({isOpen: false, client: null})}
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => reportModal.client && sendReport(reportModal.client.id)}
                className="flex-1 py-2 px-4 bg-[#3F2965] text-white rounded-xl font-bold hover:bg-[#2a1b45]"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}