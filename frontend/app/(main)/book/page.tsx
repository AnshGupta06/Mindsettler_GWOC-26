"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, ShieldCheck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "ONLINE" | "OFFLINE";
};

export default function BookPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [type, setType] = useState<"FIRST" | "FOLLOW_UP">("FIRST");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/bookings/slots");
        const data = await res.json();
        setSlots(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load slots.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  // 🗓️ Helper: Group slots by Date String
  const groupedSlots = slots.reduce((acc, slot) => {
    const dateStr = new Date(slot.date).toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric' 
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  const handleSubmit = async () => {
    if (!selectedSlot) { setError("Please select a time slot."); return; }
    if (!agreed) { setError("You must agree to the Confidentiality Policy."); return; }
    
    setSubmitting(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      // Sync User
      await fetch("http://localhost:5000/api/auth/sync-user", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Create Booking
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          type,
          reason,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Booking failed");
      }

      setSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
      router.push("/profile");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6FF] text-[#3F2965] pt-20 lg:pt-24 px-6 md:px-12 pb-12">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-8 relative">
        
        {/* ================= LEFT COLUMN: SELECTION AREA (Scrollable) ================= */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-2">Book a Session</h1>
            <p className="text-[#3F2965]/60 text-lg">
              Take a step towards clarity. Select a time that works for you. 🌿
            </p>
          </div>

          {/* 1. Session Type Selection */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-[#3F2965] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Choose Session Type
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setType("FIRST")}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                  type === "FIRST"
                    ? "border-[#Dd1764] bg-white shadow-lg ring-1 ring-[#Dd1764]"
                    : "border-transparent bg-white hover:bg-white/60"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-lg">First Session</span>
                  {type === "FIRST" && <CheckCircle className="text-[#Dd1764]" size={20} />}
                </div>
                <p className="text-sm text-[#3F2965]/60">
                  Ideal if you are new to MindSettler. We'll explore your needs and set a path.
                </p>
              </button>

              <button
                onClick={() => setType("FOLLOW_UP")}
                className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                  type === "FOLLOW_UP"
                    ? "border-[#Dd1764] bg-white shadow-lg ring-1 ring-[#Dd1764]"
                    : "border-transparent bg-white hover:bg-white/60"
                }`}
              >
                 <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-lg">Follow-up</span>
                  {type === "FOLLOW_UP" && <CheckCircle className="text-[#Dd1764]" size={20} />}
                </div>
                <p className="text-sm text-[#3F2965]/60">
                  Continue your journey. We'll review progress and go deeper.
                </p>
              </button>
            </div>
          </section>

          {/* 2. Slot Selection */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-[#3F2965] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Select a Time Slot
            </h2>

            {loading && <p className="text-[#3F2965]/50 animate-pulse">Loading availability...</p>}
            
            {!loading && slots.length === 0 && (
              <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-[#3F2965]/20">
                <Calendar className="mx-auto text-[#3F2965]/30 mb-3" size={40} />
                <p className="font-medium text-[#3F2965]/60">No slots available right now.</p>
                <p className="text-sm text-[#3F2965]/40">Please check back later or contact us.</p>
              </div>
            )}

            <div className="space-y-8">
              {Object.entries(groupedSlots).map(([dateString, dateSlots]) => (
                <div key={dateString}>
                  <h3 className="font-bold text-[#3F2965]/80 mb-3 sticky top-20 z-10 bg-[#F9F6FF]/95 backdrop-blur py-2">
                    {dateString}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dateSlots.map((slot) => {
                      const start = new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      const end = new Date(slot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      const isSelected = selectedSlot?.id === slot.id;

                      return (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`relative p-4 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "bg-[#3F2965] text-white shadow-lg scale-[1.02]"
                              : "bg-white border-transparent hover:border-[#3F2965]/20 hover:shadow-md"
                          }`}
                        >
                          <p className={`font-bold text-lg ${isSelected ? "text-white" : "text-[#3F2965]"}`}>
                            {start}
                          </p>
                          <p className={`text-xs mb-2 ${isSelected ? "text-white/70" : "text-[#3F2965]/50"}`}>
                             to {end}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            slot.mode === 'ONLINE' 
                              ? (isSelected ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700')
                              : (isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700')
                          }`}>
                            {slot.mode === 'ONLINE' ? <MapPin size={10} /> : <MapPin size={10} />}
                            {slot.mode}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>


        {/* ================= RIGHT COLUMN: SUMMARY & ACTION (Sticky) ================= */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            
            {/* Summary Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-[#3F2965]/5 border border-[#3F2965]/5">
              <h3 className="text-lg font-bold mb-4 border-b border-[#3F2965]/10 pb-2">Booking Summary</h3>
              
              {!selectedSlot ? (
                <div className="text-center py-8 text-[#3F2965]/40">
                  <Clock size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a time slot to continue</p>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <p className="text-xs text-[#3F2965]/50 font-bold uppercase">Date & Time</p>
                    <p className="font-semibold text-lg">
                      {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-[#3F2965]/80">
                      {new Date(selectedSlot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - {new Date(selectedSlot.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-[#3F2965]/50 font-bold uppercase">Session Type</p>
                    <p className="font-medium text-[#Dd1764]">
                      {type === "FIRST" ? "First Session" : "Follow-up Session"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#3F2965]/50 font-bold uppercase">Mode</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${selectedSlot.mode === 'ONLINE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {selectedSlot.mode}
                    </span>
                  </div>
                </div>
              )}

              {/* Reason Input */}
              <div className="mt-6 pt-6 border-t border-[#3F2965]/10">
                <label className="text-xs font-bold text-[#3F2965]/70 mb-1 block">
                  Any specific topic? (Optional)
                </label>
                <textarea
                  className="w-full bg-[#F9F6FF] border-0 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#Dd1764] resize-none"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="I'm feeling anxious about..."
                />
              </div>
            </div>

            {/* Payment & Action Card */}
            {selectedSlot && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#3F2965] text-white rounded-3xl p-6 shadow-xl"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <CreditCard size={20} className="text-[#Dd1764]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Payment Required</p>
                    <p className="text-xs text-white/60">Pay via UPI to confirm slot</p>
                  </div>
                </div>
                
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-center mb-4">
                  <p className="font-mono text-lg tracking-wider text-[#Dd1764] font-bold">mindsettler@upi</p>
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <input
                    type="checkbox"
                    id="policy"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#Dd1764] focus:ring-[#Dd1764] bg-white/10 border-white/20"
                  />
                  <label htmlFor="policy" className="text-xs text-white/70 cursor-pointer">
                    I agree to the <Link href="/policy" className="underline text-white hover:text-[#Dd1764]">Confidentiality Policy</Link>.
                  </label>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-[#Dd1764]/20 border border-[#Dd1764] rounded-lg text-xs text-white flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !agreed}
                  className="w-full py-4 rounded-full bg-[#Dd1764] text-white font-bold text-lg hover:bg-white hover:text-[#Dd1764] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? "Processing..." : (
                    <>
                      Confirm Booking <ShieldCheck size={18} />
                    </>
                  )}
                </button>
              </motion.div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}