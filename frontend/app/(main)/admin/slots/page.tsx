"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase"; // Adjust path if needed
import { 
  Calendar, 
  Clock, 
  Trash2, 
  Plus, 
  MapPin, 
  Wifi, 
  Lock, 
  ArrowLeft,
  LayoutGrid
} from "lucide-react";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "ONLINE" | "OFFLINE";
  isBooked: boolean;
};

export default function AdminSlotsPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mode, setMode] = useState<"ONLINE" | "OFFLINE">("ONLINE");

  // Fetch Slots
  const fetchSlots = async (token?: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/slots", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch slots");
      
      setSlots(data);
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

  // Group slots by Date for better UI
  const groupedSlots = slots.reduce((acc, slot) => {
    const dateStr = new Date(slot.date).toLocaleDateString('en-US', { 
      weekday: 'long', month: 'short', day: 'numeric' 
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  // Check for conflicts
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

    try {
      if (!date || !startTime || !endTime) throw new Error("Please fill in all fields");

      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      if (startDateTime >= endDateTime) throw new Error("End time must be after start time");
      if (checkConflict(startDateTime, endDateTime)) throw new Error("❌ Overlaps with existing slot!");

      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await fetch("http://localhost:5000/api/admin/slots", {
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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create slot");

      await fetchSlots(token);
      // Reset time but keep date (useful for adding multiple slots in one day)
      setStartTime("");
      setEndTime("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slot permanently?")) return;
    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      const res = await fetch(`http://localhost:5000/api/admin/slots/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Stats
  const totalSlots = slots.length;
  const bookedSlots = slots.filter(s => s.isBooked).length;

  if (error === "Admin access only") {
    return (
      <div className="min-h-screen bg-[#F9F6FF] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-[#Dd1764] mb-2">Access Denied</h1>
          <button onClick={() => router.push("/")} className="mt-4 px-6 py-2 bg-[#3F2965] text-white rounded-full font-bold">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6FF] text-[#3F2965] pt-24 pb-12 px-6 md:px-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutGrid className="text-[#Dd1764]" />
            Slot Manager
          </h1>
          <p className="text-[#3F2965]/60 mt-1">Create and manage your availability</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-bold border border-[#3F2965]/5">
            <span className="text-[#3F2965]/50 uppercase text-xs mr-2">Capacity</span>
            {bookedSlots} <span className="text-[#3F2965]/40">/</span> {totalSlots} Booked
          </div>
          <button 
            onClick={() => router.push("/admin")}
            className="px-5 py-2.5 bg-white border border-[#3F2965]/10 text-[#3F2965] rounded-full font-bold hover:bg-[#F9F6FF] transition flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* === LEFT: CREATE FORM === */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-[#3F2965]/5 lg:sticky lg:top-28">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="bg-[#3F2965] text-white rounded-full p-1" size={24} />
            Add Availability
          </h2>

          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[#F9F6FF] border border-[#3F2965]/10 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">Start</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#F9F6FF] border border-[#3F2965]/10 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">End</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#F9F6FF] border border-[#3F2965]/10 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">Mode</label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {["ONLINE", "OFFLINE"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m as any)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      mode === m
                        ? "bg-[#3F2965] text-white border-[#3F2965]"
                        : "bg-white text-[#3F2965]/60 border-[#3F2965]/10 hover:bg-[#F9F6FF]"
                    }`}
                  >
                    {m === "ONLINE" ? "Online" : "Studio"}
                  </button>
                ))}
              </div>
            </div>

            {error && error !== "Admin access only" && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-[#Dd1764] text-white font-bold shadow-lg hover:shadow-[#Dd1764]/20 transition-all disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Create Slot"}
            </button>
          </form>
        </div>

        {/* === RIGHT: SLOTS LIST === */}
        <div className="lg:col-span-2 space-y-8">
          {loading ? (
            <div className="text-center py-20 opacity-50">Loading schedule...</div>
          ) : slots.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-[#3F2965]/20 text-center">
              <Calendar className="mx-auto text-[#3F2965]/20 mb-4" size={48} />
              <p className="text-[#3F2965]/60 font-medium">No slots created yet.</p>
              <p className="text-sm text-[#3F2965]/40">Use the form to add your first availability.</p>
            </div>
          ) : (
            Object.entries(groupedSlots).map(([dateString, dateSlots]) => (
              <div key={dateString} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-bold text-[#3F2965] mb-4 sticky top-24 bg-[#F9F6FF]/95 backdrop-blur-sm py-2 z-10 w-fit pr-4">
                  {dateString}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dateSlots.map((slot) => {
                    const start = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const end = new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div 
                        key={slot.id} 
                        className={`relative p-5 rounded-2xl border transition-all flex justify-between items-center group ${
                          slot.isBooked 
                            ? "bg-gray-50 border-gray-200 text-gray-400" 
                            : "bg-white border-[#3F2965]/10 text-[#3F2965] hover:border-[#3F2965]/30 hover:shadow-md"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-lg">{start} <span className="text-xs font-normal opacity-60">to</span> {end}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit ${
                              slot.mode === 'ONLINE' 
                                ? (slot.isBooked ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700')
                                : (slot.isBooked ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700')
                            }`}>
                              {slot.mode === 'ONLINE' ? <Wifi size={10} /> : <MapPin size={10} />}
                              {slot.mode}
                            </span>
                            {slot.isBooked && (
                              <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                                <Lock size={10} /> BOOKED
                              </span>
                            )}
                          </div>
                        </div>

                        {!slot.isBooked && (
                          <button
                            onClick={() => handleDelete(slot.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete Slot"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        {slot.isBooked && <Lock className="text-gray-300" size={20} />}
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
  );
}