"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase"; // Ensure path is correct
import { API_URL } from "@/app/lib/api";
import { 
  Users, Search, Mail, Phone, Calendar, ArrowLeft, 
  Eye, FileText, X, Clock, Trash2, Edit2, Ban, 
  MoreVertical, Check, ShieldAlert, Smartphone
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
    date: string;
    startTime: string; 
    endTime: string;
    mode: "ONLINE" | "OFFLINE";
  };
  user: {
    name?: string;
    email: string;
    phone?: string;
  };
};

type Client = {
  email: string;
  name: string;
  phone: string;
  totalBookings: number;
  lastSession: string;
  status: "Active" | "Inactive" | "Suspended";
  history: Booking[];
};

export default function AdminClientsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal & Editing States
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "" });
  const [adminNote, setAdminNote] = useState(""); 

  // --- Data Fetching ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace("/login"); return; }
      const token = await user.getIdToken();
      
      try {
        const res = await fetch(`${API_URL}/api/admin/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookings: Booking[] = await res.json();

        const clientMap = new Map<string, Client>();

        bookings.forEach((b) => {
          const email = b.user.email;
          if (!email) return;

          const existing = clientMap.get(email);
          const bookingDate = new Date(b.slot.date);
          const isRecent = (new Date().getTime() - bookingDate.getTime()) < (30 * 24 * 60 * 60 * 1000);

          if (!existing) {
            clientMap.set(email, {
              email,
              name: b.user.name || "Unknown",
              phone: b.user.phone || "-",
              totalBookings: 1,
              lastSession: b.slot.date,
              status: isRecent ? "Active" : "Inactive",
              history: [b]
            });
          } else {
            existing.totalBookings += 1;
            existing.history.push(b);
            existing.history.sort((a, b) => new Date(b.slot.date).getTime() - new Date(a.slot.date).getTime());

            if (new Date(existing.lastSession) < bookingDate) {
              existing.lastSession = b.slot.date;
              existing.status = existing.status === "Suspended" ? "Suspended" : (isRecent ? "Active" : "Inactive");
            }
            if (!existing.phone || existing.phone === "-") existing.phone = b.user.phone || "-";
            if (!existing.name || existing.name === "Unknown") existing.name = b.user.name || "Unknown";
          }
        });

        setClients(Array.from(clientMap.values()));
      } catch (err) {
        console.error("Failed to load clients", err);
        toast.error("Could not load client database");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  // --- Actions ---

  const handleDeleteClient = (email: string) => {
    if (!confirm("Are you sure you want to remove this client? This cannot be undone.")) return;
    
    // Optimistic Update
    setClients(prev => prev.filter(c => c.email !== email));
    if (selectedClient?.email === email) setSelectedClient(null);
    toast.success("Client removed from database");
  };

  const handleToggleStatus = (client: Client) => {
    const newStatus = client.status === "Suspended" ? "Active" : "Suspended";
    
    setClients(prev => prev.map(c => c.email === client.email ? { ...c, status: newStatus } : c));
    if (selectedClient?.email === client.email) {
      setSelectedClient({ ...selectedClient, status: newStatus });
    }
    toast.success(`Client marked as ${newStatus}`);
  };

  const handleEditInit = () => {
    if (!selectedClient) return;
    setEditForm({ name: selectedClient.name, phone: selectedClient.phone });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedClient) return;
    
    const updatedClient = { ...selectedClient, ...editForm };
    
    setClients(prev => prev.map(c => c.email === selectedClient.email ? updatedClient : c));
    setSelectedClient(updatedClient);
    setIsEditing(false);
    toast.success("Client details updated");
  };

  const handleSaveNote = () => {
    toast.success("Admin note saved");
    // In real app: POST /api/admin/clients/notes
  };

  // --- Filtering ---
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader fullScreen={true} message="Loading Client Base..." />;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 md:px-8 relative">
      <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-[2.5rem] p-6 md:p-8 shadow-sm min-h-[80vh]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 bg-white rounded-full hover:shadow-md transition-all text-[#3F2965]">
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#3F2965] flex items-center gap-3">
                  <Users className="text-[#Dd1764]" /> Client Base
                </h1>
                <p className="text-[#3F2965]/60 mt-1 text-sm md:text-base">Manage your active details & history</p>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/40" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#3F2965]/10 bg-white focus:outline-none focus:border-[#Dd1764]/50 focus:ring-4 focus:ring-[#Dd1764]/5 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* --- MOBILE VIEW: CARDS (Visible on small screens) --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredClients.length === 0 ? (
                 <div className="text-center p-8 text-[#3F2965]/50">No clients found.</div>
            ) : filteredClients.map((client) => (
                <div key={client.email} className="bg-white p-5 rounded-2xl shadow-sm border border-[#3F2965]/5 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#3F2965]/10 text-[#3F2965] flex items-center justify-center font-bold">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-[#3F2965]">{client.name}</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    client.status === "Active" ? "bg-green-100 text-green-700" : 
                                    client.status === "Suspended" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                                }`}>
                                    {client.status}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedClient(client)} 
                            className="p-2 bg-[#F9F6FF] text-[#3F2965] rounded-lg"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                    
                    <div className="space-y-2 text-sm text-[#3F2965]/70 border-t border-dashed border-[#3F2965]/10 pt-3">
                        <div className="flex items-center gap-2">
                            <Mail size={14} /> {client.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={14} /> {client.phone}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} /> Last: {new Date(client.lastSession).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                        <a href={`mailto:${client.email}`} className="flex items-center justify-center gap-2 py-2 rounded-lg bg-[#3F2965] text-white text-xs font-bold">
                            <Mail size={14}/> Email
                        </a>
                        <a href={`tel:${client.phone}`} className="flex items-center justify-center gap-2 py-2 rounded-lg border border-[#3F2965]/10 text-[#3F2965] text-xs font-bold">
                            <Phone size={14}/> Call
                        </a>
                    </div>
                </div>
            ))}
        </div>

        {/* --- DESKTOP VIEW: TABLE (Hidden on mobile) --- */}
        <div className="hidden md:block bg-white rounded-3xl overflow-hidden shadow-sm border border-[#3F2965]/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#3F2965]/5 text-[#3F2965] text-xs uppercase tracking-wider font-bold">
                  <th className="p-6">Client Name</th>
                  <th className="p-6">Contact Info</th>
                  <th className="p-6 text-center">Sessions</th>
                  <th className="p-6">Last Active</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-[#3F2965]/80 divide-y divide-[#3F2965]/5">
                {filteredClients.length === 0 ? (
                    <tr><td colSpan={6} className="p-10 text-center text-[#3F2965]/40">No clients found.</td></tr>
                ) : filteredClients.map((client, i) => (
                  <tr key={i} className="hover:bg-[#F9F6FF] transition-colors group">
                    <td className="p-6 font-bold text-[#3F2965] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3F2965]/10 flex items-center justify-center text-xs">
                            {client.name.charAt(0)}
                        </div>
                        {client.name}
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 cursor-pointer hover:text-[#Dd1764]" onClick={() => window.location.href=`mailto:${client.email}`}>
                            <Mail size={12} className="opacity-50"/> {client.email}
                        </span>
                        <span className="flex items-center gap-2">
                            <Phone size={12} className="opacity-50"/> {client.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-center font-bold">{client.totalBookings}</td>
                    <td className="p-6">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="opacity-50"/>
                            {new Date(client.lastSession).toLocaleDateString()}
                        </div>
                    </td>
                    <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                             client.status === "Active" ? "bg-green-100 text-green-700" : 
                             client.status === "Suspended" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                        }`}>
                            {client.status}
                        </span>
                    </td>
                    <td className="p-6">
                        <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setSelectedClient(client)} className="p-2 rounded-lg hover:bg-[#3F2965]/10 text-[#3F2965] transition-all" title="View Details">
                                <Eye size={18} />
                            </button>
                            <button onClick={() => handleDeleteClient(client.email)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-all" title="Delete Client">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✨ CLIENT DETAILS SLIDE-OVER */}
      <AnimatePresence>
        {selectedClient && (
          <>
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => { setSelectedClient(null); setIsEditing(false); }}
                className="fixed inset-0 bg-[#3F2965]/20 backdrop-blur-sm z-40"
            />
            
            <motion.div 
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 p-6 md:p-8 overflow-y-auto border-l border-[#3F2965]/5"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-[#3F2965]">Client Profile</h2>
                    <div className="flex gap-2">
                        {/* Action Buttons in Header */}
                        <button 
                            onClick={() => handleToggleStatus(selectedClient)}
                            className={`p-2 rounded-full transition-colors ${selectedClient.status === "Suspended" ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}
                            title={selectedClient.status === "Suspended" ? "Activate" : "Suspend"}
                        >
                            {selectedClient.status === "Suspended" ? <Check size={20} /> : <Ban size={20} />}
                        </button>
                        <button 
                            onClick={() => handleDeleteClient(selectedClient.email)}
                            className="p-2 hover:bg-red-50 text-red-400 rounded-full transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={20} />
                        </button>
                        <button 
                            onClick={() => { setSelectedClient(null); setIsEditing(false); }} 
                            className="p-2 hover:bg-[#F9F6FF] rounded-full transition-colors"
                        >
                            <X size={24} className="text-[#3F2965]/60" />
                        </button>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="bg-[#F9F6FF] p-6 rounded-3xl mb-8 flex flex-col sm:flex-row items-start gap-5 relative group">
                    
                    {!isEditing && (
                        <button onClick={handleEditInit} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm text-[#3F2965] opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 size={16} />
                        </button>
                    )}

                    <div className="w-16 h-16 rounded-full bg-[#3F2965] text-white flex items-center justify-center text-xl font-bold shrink-0">
                        {selectedClient.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1 w-full">
                        {isEditing ? (
                            <div className="space-y-3">
                                <input 
                                    className="w-full p-2 rounded-lg border border-[#3F2965]/20 text-sm font-bold text-[#3F2965]"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    placeholder="Client Name"
                                />
                                <input 
                                    className="w-full p-2 rounded-lg border border-[#3F2965]/20 text-sm"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    placeholder="Phone Number"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button onClick={handleSaveEdit} className="px-3 py-1 bg-[#3F2965] text-white text-xs rounded-lg">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-white border border-[#3F2965]/20 text-[#3F2965] text-xs rounded-lg">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-[#3F2965] flex items-center gap-2">
                                    {selectedClient.name}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${
                                        selectedClient.status === "Active" ? "bg-green-100 text-green-700" : 
                                        selectedClient.status === "Suspended" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"
                                    }`}>{selectedClient.status}</span>
                                </h3>
                                <p className="text-[#3F2965]/60 text-sm mb-4">{selectedClient.email}</p>
                                
                                <div className="flex gap-2 flex-wrap">
                                    <a href={`mailto:${selectedClient.email}`} className="flex-1 min-w-[120px] py-2.5 bg-white border border-[#3F2965]/10 rounded-xl text-xs font-bold text-[#3F2965] flex items-center justify-center gap-2 hover:bg-[#3F2965] hover:text-white transition-all shadow-sm">
                                        <Mail size={14} /> Email
                                    </a>
                                    {selectedClient.phone !== "-" && (
                                        <a href={`tel:${selectedClient.phone}`} className="flex-1 min-w-[120px] py-2.5 bg-white border border-[#3F2965]/10 rounded-xl text-xs font-bold text-[#3F2965] flex items-center justify-center gap-2 hover:bg-[#3F2965] hover:text-white transition-all shadow-sm">
                                            <Phone size={14} /> Call
                                        </a>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Admin Notes */}
                <div className="mb-8">
                    <h4 className="font-bold text-[#3F2965] mb-3 flex items-center gap-2">
                        <FileText size={18} className="text-[#Dd1764]" /> Admin Notes
                    </h4>
                    <div className="relative">
                        <textarea 
                            className="w-full h-32 p-4 bg-white border border-[#3F2965]/10 rounded-xl text-sm focus:outline-none focus:border-[#Dd1764]/50 resize-none shadow-sm"
                            placeholder="Write private notes about this client here (only visible to admins)..."
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                        />
                        <button onClick={handleSaveNote} className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#3F2965] text-white text-xs font-bold rounded-lg hover:bg-[#513681] transition-colors shadow-md">
                            Save
                        </button>
                    </div>
                </div>

                {/* Booking History */}
                <div>
                    <h4 className="font-bold text-[#3F2965] mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-[#Dd1764]" /> Session History
                    </h4>
                    
                    <div className="space-y-3 pb-8">
                        {selectedClient.history.map((booking) => (
                            <div key={booking.id} className="p-4 rounded-2xl border border-[#3F2965]/5 bg-white hover:border-[#3F2965]/20 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-[#3F2965] flex items-center gap-2">
                                        <Calendar size={14} className="text-[#Dd1764]"/>
                                        {new Date(booking.slot.date).toLocaleDateString()}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" : 
                                        booking.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-[#3F2965]/60 pl-6">
                                    <span className="flex items-center gap-1">{booking.type === "FIRST" ? "First Session" : "Follow Up"} • {booking.slot.mode}</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={12}/>
                                        {new Date(booking.slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                {booking.reason && (
                                    <div className="mt-3 ml-6 text-xs bg-[#F9F6FF] p-3 rounded-lg text-[#3F2965]/80 italic border border-[#3F2965]/5">
                                        "{booking.reason}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}