"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase"; 
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast"; 
import { 
  Calendar, Trash2, Plus, MapPin, Wifi, Lock, ArrowLeft, LayoutGrid, ArrowUpDown, Search, X 
} from "lucide-react";
import Loader from "../../components/common/Loader";
import therapyApproachesData from '../../../../data/therapyApproaches.json';

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "ONLINE" | "OFFLINE";
  therapyType?: string;
  isBooked: boolean;
};

export default function AdminSlotsPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterDate, setFilterDate] = useState(""); 
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mode, setMode] = useState<"ONLINE" | "OFFLINE">("ONLINE");
  const [therapyType, setTherapyType] = useState<string>("");

  const therapyApproaches = therapyApproachesData;

  const fetchSlots = async (token?: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/slots`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch slots");
      
      if (Array.isArray(data)) {
        setSlots(data);
      } else {
        setSlots([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      const token = await user.getIdToken();
      fetchSlots(token);
    });
    return () => unsub();
  }, [router]);

  
  const filteredSlots = slots.filter((slot) => {
    if (!filterDate) return true;
    const slotDate = new Date(slot.startTime).toISOString().split('T')[0];
    return slotDate === filterDate;
  });

  const sortedSlots = [...filteredSlots].sort((a, b) => {
    const dateA = new Date(a.startTime).getTime();
    const dateB = new Date(b.startTime).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const groupedSlots = sortedSlots.reduce((acc, slot) => {
    const dateStr = new Date(slot.date).toLocaleDateString('en-US', { 
      weekday: 'long', month: 'short', day: 'numeric' 
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  const checkConflict = (newStart: Date, newEnd: Date) => {
    return slots.some((slot) => {
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      return newStart < slotEnd && newEnd > slotStart;
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    
    const toastId = toast.loading("Adding slot availability...");

    try {
      if (!date || !startTime || !endTime) throw new Error("Please fill in all fields");

      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      if (startDateTime >= endDateTime) throw new Error("End time must be after start time");
      if (checkConflict(startDateTime, endDateTime)) throw new Error("Overlaps with existing slot!");

      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await fetch(`${API_URL}/api/admin/slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: startDateTime.toISOString(),
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          mode,
          therapyType: therapyType || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create slot");

      await fetchSlots(token);
      toast.success("Slot added successfully!", { id: toastId });
      
      setStartTime("");
      setEndTime("");
      setDate("");
      setMode("ONLINE");
      setTherapyType("");
      setError("");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Failed to create slot", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slot permanently?")) return;
    const toastId = toast.loading("Deleting slot...");

    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      
      const res = await fetch(`${API_URL}/api/admin/slots/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setSlots((prev) => prev.filter((s) => s.id !== id));
      toast.success("Slot deleted", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Could not delete slot", { id: toastId });
    }
  };

  const totalSlots = slots.length;
  const bookedSlots = slots.filter(s => s.isBooked).length;

  if (loading) return <Loader fullScreen message="Loading Slots..." />;

  return (
    <div className="min-h-screen bg-[#F9F6FF] pt-20 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
      
        <div className="flex flex-col gap-6 mb-8 relative z-10">
          <div>
            <button 
                onClick={() => router.push('/admin')} 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3F2965] font-bold mb-4 transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/50"
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-[#3F2965]">
                    <LayoutGrid className="text-[#Dd1764]" size={32} /> Slot Manager
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Create and manage your availability schedule.</p>
                </div>
                
                <div className="bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-200 text-sm font-bold flex items-center gap-3">
                    <span className="text-gray-400 uppercase text-xs tracking-wider">Capacity</span>
                    <span className="text-[#3F2965] text-base">{bookedSlots} <span className="text-gray-300">/</span> {totalSlots} <span className="text-xs text-gray-400 font-normal">Booked</span></span>
                </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#3F2965]/10 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#3F2965] border-b border-gray-100 pb-4">
              <Plus className="bg-[#3F2965] text-white rounded-full p-1" size={20} />
              Add Availability
            </h2>
            
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#Dd1764] text-sm font-medium text-[#3F2965] transition-all min-h-[46px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#Dd1764] text-sm font-medium text-[#3F2965] transition-all min-h-[46px]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#Dd1764] text-sm font-medium text-[#3F2965] transition-all min-h-[46px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Session Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  {["ONLINE", "OFFLINE"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m as any)}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                        mode === m
                          ? m === "ONLINE" 
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {m === "ONLINE" ? "Online" : "Studio"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Therapy Type</label>
                <select
                  value={therapyType}
                  onChange={(e) => setTherapyType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#Dd1764] text-sm font-medium text-[#3F2965] transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Therapies (General)</option>
                  {therapyApproaches.map((therapy) => (
                    <option key={therapy.id} value={therapy.title}>
                      {therapy.title}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-500 mt-1.5 ml-1 leading-tight">
                  Leaving this empty creates a general slot open for any therapy type.
                </p>
              </div>

              {error && error !== "Admin access only" && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                  <X size={14} /> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#Dd1764] text-white font-bold shadow-lg shadow-[#Dd1764]/20 hover:bg-[#b01350] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? "Adding Slot..." : "Create Slot"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-[#3F2965]/10 gap-4">
              <h3 className="font-bold text-base text-[#3F2965] shrink-0 px-2 hidden sm:block">Schedule</h3>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Search size={14} />
                  </div>
                  <input 
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full sm:w-auto pl-9 pr-8 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-[#3F2965] focus:outline-none focus:border-[#Dd1764]/30 cursor-pointer min-h-[38px]"
                  />
                  {filterDate && (
                    <button 
                      onClick={() => setFilterDate("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#Dd1764] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="w-px h-6 bg-gray-200 hidden sm:block" />

                <button
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#Dd1764] transition-colors whitespace-nowrap px-2"
                >
                  <ArrowUpDown size={16} />
                  <span className="hidden sm:inline">{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
                </button>
              </div>
            </div>

            {filteredSlots.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
                <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 font-medium">
                  {filterDate ? "No slots found for this date." : "No slots created yet."}
                </p>
                {filterDate && (
                  <button 
                    onClick={() => setFilterDate("")}
                    className="mt-2 text-sm text-[#Dd1764] font-bold hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              Object.entries(groupedSlots).map(([dateString, dateSlots]) => (
                <div key={dateString} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="sticky top-4 z-10 -mx-2 px-2 bg-[#F9F6FF]/95 backdrop-blur-sm py-3 mb-2 flex items-center gap-3">
                     <span className="text-sm font-bold text-[#3F2965] bg-white border border-[#3F2965]/10 px-3 py-1 rounded-lg shadow-sm">
                        {dateString}
                     </span>
                     <div className="h-px flex-1 bg-[#3F2965]/10"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dateSlots.map((slot) => {
                      const start = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const end = new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                      return (
                        <div 
                          key={slot.id} 
                          className={`relative p-4 rounded-xl border transition-all flex justify-between items-center group ${
                            slot.isBooked 
                              ? "bg-gray-50 border-gray-200" 
                              : "bg-white border-gray-200 hover:border-[#3F2965]/20 hover:shadow-md"
                          }`}
                        >
                          <div>
                            <p className={`font-bold text-lg ${slot.isBooked ? "text-gray-400" : "text-[#3F2965]"}`}>
                                {start} <span className="text-xs font-normal opacity-50">to</span> {end}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                                slot.mode === 'ONLINE' 
                                  ? (slot.isBooked ? 'bg-gray-100 text-gray-400 border-transparent' : 'bg-green-50 text-green-700 border-green-100')
                                  : (slot.isBooked ? 'bg-gray-100 text-gray-400 border-transparent' : 'bg-blue-50 text-blue-700 border-blue-100')
                              }`}>
                                {slot.mode === 'ONLINE' ? <Wifi size={10} /> : <MapPin size={10} />}
                                {slot.mode}
                              </span>
                              
                              {slot.therapyType && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    slot.isBooked ? "bg-gray-100 text-gray-400 border-transparent" : "bg-[#Dd1764]/5 text-[#Dd1764] border-[#Dd1764]/10"
                                }`}>
                                  {slot.therapyType}
                                </span>
                              )}

                              {slot.isBooked && (
                                <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Lock size={10} /> BOOKED
                                </span>
                              )}
                            </div>
                          </div>

                          {!slot.isBooked ? (
                            <button
                              onClick={() => handleDelete(slot.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-100"
                              title="Delete Slot"
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <Lock className="text-gray-300" size={20} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}