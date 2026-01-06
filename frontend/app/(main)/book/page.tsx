"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { API_URL } from "@/app/lib/api";
import Link from "next/link";
import { 
  Calendar, Clock, MapPin, CheckCircle, AlertCircle, ShieldCheck, 
  Sparkles, ArrowRight, Wallet, User as UserIcon, Banknote 
} from "lucide-react";
import { motion } from "framer-motion";
import AlertModal from "../components/common/AlertModal"; 
import toast from "react-hot-toast";
import DiscountBanner from "./components/DiscountBanner";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "ONLINE" | "OFFLINE";
};

export default function BookPage() {
  const router = useRouter();
  
  // --- Auth & Protection States ---
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // --- Booking Data States ---
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [type, setType] = useState<"FIRST" | "FOLLOW_UP">("FIRST");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CASH">("UPI");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  
  // ✨ Success State
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Auto-reset to UPI if user switches to Online
  useEffect(() => {
    if (selectedSlot?.mode === "ONLINE") {
      setPaymentMethod("UPI");
    }
  }, [selectedSlot]);

  // --- 1. Combined Auth Check & Data Fetching ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false); 

      if (currentUser) {
        try {
          const res = await fetch(`${API_URL}/api/bookings/slots`);
          const data = await res.json();
          setSlots(data);
        } catch (err) {
          console.error(err);
          setError("Failed to load slots.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  // Helper: Group slots by Date String
  const safeSlots = Array.isArray(slots) ? slots : [];
  const groupedSlots = safeSlots.reduce((acc, slot) => {
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
    const toastId = toast.loading("Sending booking request...");
    setError("");

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return; 
      const token = await currentUser.getIdToken();

      // Sync user
      await fetch(`${API_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Create Booking
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          type,
          reason,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Booking failed");
      }

      toast.success("Request Sent! Waiting for approval.", { id: toastId });
      
      // ✨ Show Success View
      setBookingSuccess(true); 
      setSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Booking Failed", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-10 h-10 border-4 border-[#Dd1764] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 relative">
      
      {!user && (
        <AlertModal 
          isOpen={true} 
          onClose={() => router.push("/")} 
          page= {"book"}
        />
      )}

      <div className={`transition-all duration-500 ${!user ? 'blur-md pointer-events-none opacity-50 select-none grayscale-[0.5]' : ''}`}>
        
        <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-[2.5rem] p-6 md:p-12 lg:p-10 text-[#3F2965] shadow-sm relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#Dd1764]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {/* ✨ CORRECTED SUCCESS VIEW */}
          {bookingSuccess ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 relative z-10">
              <div className="w-24 h-24 bg-yellow-50 border-4 border-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Clock size={48} className="text-yellow-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Request Sent!</h2>
              <p className="text-[#3F2965]/70 text-lg max-w-md mb-8 leading-relaxed">
                Your session request has been received. <br/>
                We will notify you via email once the admin confirms your slot.
              </p>

              <button 
                onClick={() => router.push("/profile")}
                className="w-full max-w-sm py-4 rounded-xl bg-[#3F2965] text-white font-bold shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight size={20} />
              </button>
              
              <p className="text-xs text-[#3F2965]/40 mt-6">
                You can track the status of your booking in your profile.
              </p>
            </div>
          ) : (
            // ✨ NORMAL BOOKING VIEW
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
              
              {/* LEFT COLUMN */}
              <div className="lg:col-span-8 space-y-12">
                <DiscountBanner />
                {/* Header */}
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                    Book your <span className="text-[#Dd1764]">Healing Space</span>
                  </h1>
                  <p className="text-[#3F2965]/70 text-lg md:text-xl max-w-2xl font-medium">
                    Take the first step towards clarity. Choose a time that works for you, and let's begin this journey together. 🌿
                  </p>
                </div>

                {/* 1. Session Type */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-[#3F2965] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#3F2965]/20">1</div>
                    <h2 className="text-2xl font-bold">Choose Session Type</h2>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-5">
                    {[
                      { id: "FIRST", label: "First Session (60 Mins)", desc: "For new clients. We'll explore your history and goals.", icon: Sparkles },
                      { id: "FOLLOW_UP", label: "Follow-up (60 Mins)", desc: "For returning clients. Continuing our progress.", icon: ArrowRight }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setType(item.id as any)}
                        className={`relative p-6 rounded-3xl border-2 text-left transition-all duration-300 group overflow-hidden ${
                          type === item.id
                            ? "border-[#Dd1764] bg-white shadow-xl shadow-[#Dd1764]/10"
                            : "border-transparent bg-white/60 hover:bg-white hover:border-[#3F2965]/10"
                        }`}
                      >
                        <div className={`absolute top-0 right-0 p-4 opacity-0 transition-opacity ${type === item.id ? 'opacity-100' : ''}`}>
                          <CheckCircle className="text-[#Dd1764] fill-[#Dd1764]/10" size={24} />
                        </div>
                        
                        <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-colors ${
                          type === item.id ? "bg-[#Dd1764] text-white" : "bg-[#F9F6FF] text-[#3F2965]"
                        }`}>
                          <item.icon size={20} />
                        </div>
                        
                        <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                        <p className="text-sm text-[#3F2965]/60 leading-relaxed">
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* 2. Slot Selection */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-[#3F2965] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#3F2965]/20">2</div>
                    <h2 className="text-2xl font-bold">Select a Time Slot</h2>
                  </div>

                  {loading && (
                    <div className="p-12 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-[#Dd1764] border-t-transparent rounded-full mx-auto mb-4"/>
                      <p className="text-[#3F2965]/50">Loading availability...</p>
                    </div>
                  )}
                  
                  {!loading && slots.length === 0 && (
                    <div className="bg-white p-10 rounded-3xl text-center border-2 border-dashed border-[#3F2965]/10">
                      <Calendar className="mx-auto text-[#3F2965]/20 mb-4" size={48} />
                      <p className="font-bold text-lg text-[#3F2965]/80">No slots available right now.</p>
                      <p className="text-sm text-[#3F2965]/50">Please check back later or contact us directly.</p>
                    </div>
                  )}

                  <div className="space-y-10">
                    {Object.entries(groupedSlots).map(([dateString, dateSlots]) => (
                      <div key={dateString} className="relative">
                        <div className="sticky top-0 z-10 -mx-4 px-4 bg-[#F9F6FF]/90 backdrop-blur-md py-4 mb-4 flex items-center gap-3">
                          <div className="h-px flex-1 bg-[#3F2965]/10"></div>
                          <span className="font-bold text-[#3F2965]/80 bg-white px-5 py-2 rounded-full text-sm shadow-sm border border-[#3F2965]/5">
                              {dateString}
                          </span>
                          <div className="h-px flex-1 bg-[#3F2965]/10"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {dateSlots.map((slot) => {
                            const start = new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            const end = new Date(slot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            const isSelected = selectedSlot?.id === slot.id;

                            return (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot)}
                                className={`relative p-5 rounded-2xl border transition-all duration-300 group ${
                                  isSelected
                                    ? "bg-[#3F2965] text-white border-[#3F2965] shadow-lg shadow-[#3F2965]/20 scale-[1.02]"
                                    : "bg-white border-transparent hover:border-[#Dd1764]/30 hover:shadow-md"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <div className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 ${
                                      slot.mode === 'ONLINE' 
                                        ? (isSelected ? 'bg-white/20 text-white' : 'bg-green-50 text-green-700')
                                        : (isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700')
                                    }`}>
                                      <MapPin size={10} />
                                      {slot.mode}
                                    </div>
                                    {isSelected && <CheckCircle size={16} className="text-[#Dd1764] fill-white" />}
                                </div>
                                
                                <p className="font-bold text-xl mb-1">
                                  {start}
                                </p>
                                <p className={`text-xs ${isSelected ? "text-white/60" : "text-[#3F2965]/40"}`}>
                                  Until {end}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN (SUMMARY) */}
              <div className="lg:col-span-4">
                <div className="sticky top-8">
                  <div className="bg-white rounded-[2rem] shadow-2xl shadow-[#3F2965]/10 border border-[#3F2965]/5 overflow-hidden">
                    {/* Summary Header */}
                    <div className="bg-[#3F2965] p-6 text-white text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <h3 className="text-lg font-bold relative z-10">Booking Summary</h3>
                      <p className="text-xs text-white/60 relative z-10 mt-1">Review your details below</p>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                      {!selectedSlot ? (
                        <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                          <Clock size={32} className="mx-auto mb-3 text-gray-300" />
                          <p className="text-sm text-gray-400">Select a time slot to continue</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                            <div>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date</p>
                              <p className="font-bold text-[#3F2965]">
                                {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Time</p>
                              <p className="font-bold text-[#3F2965]">
                                {new Date(selectedSlot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Type</p>
                                <p className="font-semibold text-[#Dd1764]">
                                  {type === "FIRST" ? "First Session" : "Follow-up"}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedSlot.mode === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {selectedSlot.mode}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Reason Input */}
                      <div>
                          <label className="text-xs font-bold text-[#3F2965]/60 mb-2 block uppercase tracking-wider">
                            Anything to share? (Optional)
                          </label>
                          <textarea
                            className="w-full bg-[#F9F6FF] border border-transparent focus:bg-white focus:border-[#Dd1764]/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#Dd1764]/10 resize-none transition-all"
                            rows={2}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="I'm feeling anxious about..."
                          />
                      </div>

                      {/* Payment & Confirm */}
                      {selectedSlot && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-4 pt-4 border-t border-gray-100"
                        >
                          {selectedSlot.mode === "OFFLINE" && (
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-[#3F2965]/60 uppercase">Payment Method</label>
                              <div className="grid grid-cols-2 gap-2 bg-[#F9F6FF] p-1 rounded-xl">
                                <button 
                                  onClick={() => setPaymentMethod("UPI")}
                                  className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === "UPI" ? "bg-white text-[#Dd1764] shadow-sm" : "text-gray-400 hover:text-[#3F2965]"}`}
                                >
                                  <Wallet size={14} /> UPI
                                </button>
                                <button 
                                  onClick={() => setPaymentMethod("CASH")}
                                  className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${paymentMethod === "CASH" ? "bg-white text-[#Dd1764] shadow-sm" : "text-gray-400 hover:text-[#3F2965]"}`}
                                >
                                  <Banknote size={14} /> Cash
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="bg-[#F9F6FF] p-4 rounded-xl border border-[#3F2965]/5">
                            <div className="flex items-center gap-2 mb-3">
                              {paymentMethod === "UPI" ? (
                                <Wallet size={16} className="text-[#Dd1764]" />
                              ) : (
                                <Banknote size={16} className="text-[#Dd1764]" />
                              )}
                              <span className="text-sm font-bold text-[#3F2965]">
                                {paymentMethod === "UPI" ? "Payment Required" : "Pay at Studio"}
                              </span>
                            </div>
                            
                            {paymentMethod === "UPI" ? (
                              <>
                                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                  <span className="text-xs text-gray-400 font-medium">UPI ID</span>
                                  <code className="font-mono text-sm font-bold text-[#3F2965] select-all">
                                    mindsettler@upi
                                  </code>
                                </div>
                                <p className="text-[10px] text-center text-gray-400 mt-2">
                                  Complete payment via any UPI app.
                                </p>
                              </>
                            ) : (
                              <p className="text-xs text-[#3F2965]/70 leading-relaxed italic bg-white p-3 rounded-lg border border-gray-100">
                                Please bring the exact amount in cash to your session.
                              </p>
                            )}
                          </div>

                          <label className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-gray-300 transition-all checked:border-[#Dd1764] checked:bg-[#Dd1764]"
                              />
                              <CheckCircle size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <span className="text-xs text-[#3F2965]/70 leading-tight">
                              I agree to the <Link href="/confidentiality" className="underline font-bold text-[#3F2965] hover:text-[#Dd1764]">Confidentiality Policy</Link>.
                            </span>
                          </label>

                          {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex items-center gap-2 font-medium">
                              <AlertCircle size={14} /> {error}
                            </div>
                          )}

                          <button
                            onClick={handleSubmit}
                            disabled={submitting || !agreed}
                            className="w-full py-4 rounded-xl bg-[#Dd1764] text-white font-bold text-lg hover:bg-[#c91559] hover:shadow-lg hover:shadow-[#Dd1764]/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                  {/* Trust Badges */}
                  <div className="mt-6 flex justify-center gap-6 text-[#3F2965]/40 grayscale opacity-60">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <ShieldCheck size={14} /> Secure
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <UserIcon size={14} /> Private
                      </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}