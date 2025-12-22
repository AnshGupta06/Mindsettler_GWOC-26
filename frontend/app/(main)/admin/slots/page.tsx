"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase"; 

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
      console.error(err);
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

  // Check for conflicts locally before sending to backend
  const checkConflict = (newStart: Date, newEnd: Date) => {
    return slots.some((slot) => {
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      // Overlap formula: (StartA < EndB) && (EndA > StartB)
      return newStart < slotEnd && newEnd > slotStart;
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!date || !startTime || !endTime) {
        throw new Error("Please fill in all fields");
      }

      // Construct Date Objects
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      if (startDateTime >= endDateTime) {
        throw new Error("End time must be after start time");
      }

      // 🛡️ Conflict Check
      if (checkConflict(startDateTime, endDateTime)) {
        throw new Error("❌ This time slot overlaps with an existing slot!");
      }

      const user = auth.currentUser;
      const token = await user?.getIdToken();

      const res = await fetch("http://localhost:5000/api/admin/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: startDateTime.toISOString(), // Backend expects ISO string for 'date' field too usually, or just YYYY-MM-DD
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          mode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create slot");

      // Success: Refresh list and clear form
      await fetchSlots(token);
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;

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

  // 🔒 Admin Access Protection
  if (error === "Admin access only") {
    return (
      <div className="min-h-screen bg-[#F9F6FF] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-[#Dd1764] mb-2">Access Denied</h1>
          <p className="text-[#3F2965]/70 mb-6">
            You do not have permission to manage slots.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-[#3F2965] text-white rounded-full font-bold hover:bg-[#3F2965]/90 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6FF] px-4 py-24 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8">
        
        {/* Header with Navigation */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#3F2965]">Manage Slots</h1>
          <button 
            onClick={() => router.push("/admin")}
            className="text-sm font-semibold text-[#3F2965]/60 hover:text-[#3F2965]"
          >
            ← Back to Bookings
          </button>
        </div>

        {/* Create Slot Form */}
        <div className="bg-[#F9F6FF] p-6 rounded-2xl mb-8 border border-[#3F2965]/10">
          <h2 className="font-semibold text-[#3F2965] mb-4">Add New Slot</h2>
          
          {error && error !== "Admin access only" && (
            <div className="mb-4 p-3 bg-[#Dd1764]/10 text-[#Dd1764] text-sm rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {/* Date */}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#3F2965]/20 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
              required
            />

            {/* Start Time */}
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#3F2965]/20 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
              required
            />

            {/* End Time */}
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="px-4 py-2 rounded-xl border border-[#3F2965]/20 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
              required
            />

            {/* Mode */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="px-4 py-2 rounded-xl border border-[#3F2965]/20 focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#3F2965] text-white font-bold py-2 rounded-xl hover:bg-[#3F2965]/90 transition disabled:opacity-50"
            >
              {submitting ? "..." : "Add Slot"}
            </button>
          </form>
        </div>

        {/* Slots List */}
        <div>
          <h3 className="font-bold text-[#3F2965] mb-4">Existing Slots</h3>
          
          {loading ? (
            <p className="text-[#3F2965]/60">Loading...</p>
          ) : slots.length === 0 ? (
            <p className="text-[#3F2965]/60">No slots created yet.</p>
          ) : (
            <div className="grid gap-3">
              {slots.map((slot) => {
                const sDate = new Date(slot.startTime).toDateString();
                const sTime = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const eTime = new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={slot.id} className={`flex items-center justify-between p-4 rounded-xl border ${slot.isBooked ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-[#3F2965]/10"}`}>
                    
                    <div>
                      <span className="font-semibold text-[#3F2965] mr-3">{sDate}</span>
                      <span className="text-[#3F2965]/80 text-sm">{sTime} - {eTime}</span>
                      <span className={`ml-3 text-xs font-bold px-2 py-1 rounded-full ${slot.mode === 'ONLINE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {slot.mode}
                      </span>
                      {slot.isBooked && (
                        <span className="ml-2 text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          BOOKED
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(slot.id)}
                      disabled={slot.isBooked} // Prevent deleting booked slots for safety?
                      className="text-red-500 hover:text-red-700 font-semibold text-sm disabled:text-gray-400"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}