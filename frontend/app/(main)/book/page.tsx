"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { API_URL } from "@/app/lib/api";
import Link from "next/link";
import { 
  Calendar, Clock, MapPin, CheckCircle, AlertCircle, ShieldCheck, 
  Sparkles, ArrowRight, Wallet, User as UserIcon, Banknote, BrainCircuit, ChevronRight,
  Monitor, Building2, CalendarDays, Receipt, Mail, Bell
} from "lucide-react";
import { motion } from "framer-motion";
import AlertModal from "../components/common/AlertModal";
import toast from "react-hot-toast";
import DiscountBanner from "./components/DiscountBanner";

import therapyApproachesData from '../../../data/therapyApproaches.json';

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "ONLINE" | "OFFLINE";
};

export default function BookPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [type, setType] = useState<"FIRST" | "FOLLOW_UP">("FIRST");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CASH">("UPI");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [therapyType, setTherapyType] = useState<string>("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [slotModeFilter, setSlotModeFilter] = useState<"ONLINE" | "OFFLINE" | "BOTH">("BOTH");

  const therapyApproaches = therapyApproachesData;

  useEffect(() => {
    if (therapyType) {
      const selectedTherapy = therapyApproaches.find(therapy => therapy.title === therapyType);
      if (selectedTherapy) {
        if (selectedTherapy.availableOnline && !selectedTherapy.availableOffline) {
          setSlotModeFilter("ONLINE");
        }
        else if (!selectedTherapy.availableOnline && selectedTherapy.availableOffline) {
          setSlotModeFilter("OFFLINE");
        }
        else {
          setSlotModeFilter("BOTH");
        }
      }
    } else {
      setSlotModeFilter("BOTH");
    }
  }, [therapyType, therapyApproaches]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setAuthChecking(false);
      
      if (!user) return;

      const urlParams = new URLSearchParams(window.location.search);
      const therapy = urlParams.get('therapy');
      if (therapy) {
        setTherapyType(decodeURIComponent(therapy));
      }
    });
    
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) fetchSlots();
  }, [therapyType, user]);

  const fetchSlots = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const url = therapyType 
        ? `${API_URL}/api/bookings/slots?therapyType=${encodeURIComponent(therapyType)}`
        : `${API_URL}/api/bookings/slots`;
      
      const token = await user.getIdToken();
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      
      if (!res.ok) throw new Error("Failed to fetch slots");
      
      const data = await res.json();
      setSlots(data || []); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to load available slots");
      setError("Failed to load slots.");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSlots = slots.filter(slot => {
    if (slotModeFilter === "BOTH") return true;
    return slot.mode === slotModeFilter;
  });

  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    const dateStr = new Date(slot.date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  const handleSubmit = async () => {
    if (!selectedSlot) { 
      toast.error("Please select a time slot.");
      return; 
    }
    if (!agreed) { 
      toast.error("You must agree to the Confidentiality Policy.");
      return; 
    }

    setSubmitting(true);
    const toastId = toast.loading("Confirming your session...");
    setError("");

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("Please login to continue");
        return;
      }
      
      const token = await currentUser.getIdToken();

      await fetch(`${API_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

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
          therapyType,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Booking failed");
      }

      toast.success("Session Booked Successfully! 🎉", { id: toastId });
      setSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
      setBookingSuccess(true);
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Booking Failed", { id: toastId });
      setError(err.message || "Booking failed. Please try again.");
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
    <div className="min-h-screen bg-[#F9F6FF] pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 relative">
      
      {/* Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(63, 41, 101, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(63, 41, 101, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(221, 23, 100, 0.5);
        }
      `}</style>

      {!user && (
        <AlertModal 
          isOpen={true} 
          onClose={() => router.push("/")}
          page={"book"}
        />
      )}

      <div className={`transition-all duration-500 h-full ${!user ? 'blur-md pointer-events-none opacity-50 select-none grayscale-[0.5]' : ''}`}>
                  
          {/* Content Container */}
          <div className="relative z-10 text-[#3F2965] h-full">

            {bookingSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 p-12">
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
              </div>
            ) : (
              
              /* LAYOUT: Split Pane Grid */
              <div className="grid lg:grid-cols-12 h-full">
                
                {/* --- LEFT COLUMN (Form) - Scrollable --- */}
                <div className="lg:col-span-8 lg:overflow-y-auto custom-scrollbar p-6 md:p-10 lg:pr-6">
                  <div className="space-y-10">
                    
                    <div className="space-y-8">
                        <DiscountBanner />
                        <div className="space-y-3">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                            Book your <span className="text-[#Dd1764]">Healing Space</span>
                        </h1>
                        <p className="text-[#3F2965]/70 text-base md:text-lg max-w-2xl font-medium">
                            Take the first step towards clarity. Choose a time that works for you. 🌿
                        </p>
                        </div>

                        {/* 1. Session Type */}
                        <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-[#3F2965] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-[#3F2965]/20">1</div>
                            <h2 className="text-xl font-bold">Choose Session Type</h2>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                            { id: "FIRST", label: "First Session (60m)", desc: "New clients.", icon: Sparkles },
                            { id: "FOLLOW_UP", label: "Follow-up (60m)", desc: "Returning.", icon: ArrowRight }
                            ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setType(item.id as any)}
                                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden ${
                                type === item.id
                                    ? "border-[#Dd1764] bg-white shadow-xl shadow-[#Dd1764]/10"
                                    : "border-transparent bg-white/60 hover:bg-white hover:border-[#3F2965]/10"
                                }`}
                            >
                                <div className={`absolute top-0 right-0 p-3 opacity-0 transition-opacity ${type === item.id ? 'opacity-100' : ''}`}>
                                <CheckCircle className="text-[#Dd1764] fill-[#Dd1764]/10" size={20} />
                                </div>
                                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors ${
                                type === item.id ? "bg-[#Dd1764] text-white" : "bg-[#F9F6FF] text-[#3F2965]"
                                }`}>
                                <item.icon size={18} />
                                </div>
                                <h3 className="font-bold text-base mb-1">{item.label}</h3>
                                <p className="text-xs text-[#3F2965]/60">{item.desc}</p>
                            </button>
                            ))}
                        </div>
                        </section>

                        {/* 2. Therapy Selection */}
                        <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-[#3F2965] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-[#3F2965]/20">2</div>
                            <h2 className="text-xl font-bold">Choose Therapy</h2>
                        </div>

                        <div className="bg-white/60 rounded-2xl p-6 border border-[#3F2965]/5">
                            <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-[#F9F6FF] flex items-center justify-center">
                                <BrainCircuit className="text-[#Dd1764]" size={20} />
                                </div>
                                <div>
                                <h3 className="font-bold text-base text-[#3F2965]">Select Approach</h3>
                                <p className="text-xs text-[#3F2965]/60">What best fits your needs?</p>
                                </div>
                            </div>

                            <div className="relative">
                                <select
                                value={therapyType}
                                onChange={(e) => setTherapyType(e.target.value)}
                                className="w-full bg-white border-2 border-[#F9F6FF] hover:border-[#Dd1764]/30 focus:border-[#Dd1764] rounded-xl p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#Dd1764]/10 transition-all cursor-pointer"
                                >
                                <option value="" className="text-[#3F2965]/60">Select a therapy approach...</option>
                                {therapyApproaches.map((therapy) => (
                                    <option key={therapy.id} value={therapy.title} className="text-[#3F2965] py-2">
                                    {therapy.title}
                                    </option>
                                ))}
                                </select>
                            </div>
                            </div>
                        </div>
                        </section>

                        {/* 3. Slot Selection */}
                        <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-[#3F2965] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-[#3F2965]/20">3</div>
                            <h2 className="text-xl font-bold">Select Time</h2>
                        </div>

                        {/* Filter */}
                        <div className="bg-white/60 rounded-2xl p-4 mb-6 border border-[#3F2965]/5">
                            <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSlotModeFilter("BOTH")}
                                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                slotModeFilter === "BOTH" ? "bg-[#3F2965] text-white shadow-md" : "bg-white text-[#3F2965] border border-[#3F2965]/10"
                                }`}
                            >
                                <CalendarDays size={14} /> All
                            </button>
                            <button
                                onClick={() => setSlotModeFilter("ONLINE")}
                                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                slotModeFilter === "ONLINE" ? "bg-green-600 text-white shadow-md" : "bg-white text-green-700 border border-green-100"
                                }`}
                            >
                                <Monitor size={14} /> Online
                            </button>
                            <button
                                onClick={() => setSlotModeFilter("OFFLINE")}
                                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                slotModeFilter === "OFFLINE" ? "bg-blue-600 text-white shadow-md" : "bg-white text-blue-700 border border-blue-100"
                                }`}
                            >
                                <Building2 size={14} /> In-Person
                            </button>
                            </div>
                        </div>

                        {loading && (
                            <div className="p-8 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-[#Dd1764] border-t-transparent rounded-full mx-auto mb-4"/>
                            <p className="text-[#3F2965]/50 text-sm">Loading availability...</p>
                            </div>
                        )}
                        
                        {!loading && filteredSlots.length > 0 && (
                            <div className="space-y-8">
                            {Object.entries(groupedSlots).map(([dateString, dateSlots]) => (
                                <div key={dateString} className="relative">
                                {/* Sticky Date Header */}
                                <div className="sticky top-0 z-10 -mx-4 px-4 bg-[#F9F6FF]/95 backdrop-blur-md py-3 mb-2 flex items-center gap-3">
                                    <div className="h-px flex-1 bg-[#3F2965]/10"></div>
                                    <span className="font-bold text-[#3F2965]/80 bg-white px-4 py-1.5 rounded-full text-xs shadow-sm border border-[#3F2965]/5 flex items-center gap-2">
                                    <Calendar size={12} /> {dateString}
                                    </span>
                                    <div className="h-px flex-1 bg-[#3F2965]/10"></div>
                                </div>

                                {/* Updated Grid for Mobile (2 cols) */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {dateSlots.map((slot) => {
                                    const start = new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                                    const end = new Date(slot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                                    const isSelected = selectedSlot?.id === slot.id;

                                    return (
                                        <button
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`relative p-3 rounded-xl border transition-all duration-200 group text-left flex flex-col justify-between min-h-[90px] ${
                                            isSelected
                                            ? "bg-[#3F2965] text-white border-[#3F2965] shadow-lg scale-[1.02]"
                                            : "bg-white border-transparent hover:border-[#Dd1764]/30 hover:shadow-md"
                                        }`}
                                        >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 ${
                                                slot.mode === 'ONLINE' 
                                                    ? (isSelected ? 'bg-white/20 text-white' : 'bg-green-50 text-green-700')
                                                    : (isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700')
                                            }`}>
                                            {slot.mode === 'ONLINE' ? <Monitor size={8} /> : <Building2 size={8} />}
                                            {slot.mode}
                                            </div>
                                            {isSelected && <CheckCircle size={14} className="text-[#Dd1764] fill-white" />}
                                        </div>
                                        
                                        <div>
                                            <p className="font-bold text-lg leading-none mb-1">{start}</p>
                                            <p className={`text-[10px] ${isSelected ? "text-white/60" : "text-[#3F2965]/40"}`}>
                                            Until {end}
                                            </p>
                                        </div>
                                        </button>
                                    );
                                    })}
                                </div>
                                </div>
                            ))}
                            </div>
                        )}
                        </section>
                    </div>
                  </div>
                </div>

                {/* --- RIGHT COLUMN: SUMMARY & NEXT STEPS - Scrollable Independently --- */}
                <div className="lg:col-span-4 lg:h-full lg:overflow-y-auto custom-scrollbar lg:border-l lg:border-[#3F2965]/5 lg:bg-white/30 p-6 md:p-8">
                    
                    {/* Unified Ticket Card (No longer Sticky to prevent overlap) */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-[#3F2965]/5 border border-[#3F2965]/5 overflow-hidden mb-6">
                      
                      <div className="bg-[#3F2965] p-5 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <h3 className="text-base font-bold relative z-10 flex items-center justify-center gap-2">
                           <Receipt size={16} className="text-[#Dd1764]" /> Booking Summary
                        </h3>
                      </div>

                      <div className="p-5 space-y-5">
                        {!selectedSlot ? (
                          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                            <Clock size={24} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-xs text-gray-400">Select a time slot</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                                <p className="font-bold text-sm text-[#3F2965]">
                                  {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                                <p className="font-bold text-sm text-[#3F2965]">
                                  {new Date(selectedSlot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Type</p>
                                <p className="font-semibold text-xs text-[#Dd1764]">
                                  {type === "FIRST" ? "First Session" : "Follow-up"}
                                </p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${selectedSlot.mode === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {selectedSlot.mode === 'ONLINE' ? <Monitor size={8} /> : <Building2 size={8} />}
                                {selectedSlot.mode}
                              </span>
                            </div>

                            {therapyType && (
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Therapy</p>
                                  <p className="font-semibold text-xs text-[#3F2965]">
                                    {therapyType}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold text-[#3F2965]/60 mb-1.5 block uppercase tracking-wider">
                            Note (Optional)
                          </label>
                          <textarea
                            className="w-full bg-[#F9F6FF] border border-transparent focus:bg-white focus:border-[#Dd1764]/20 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#Dd1764]/10 resize-none transition-all"
                            rows={2}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Reason..."
                          />
                        </div>

                        {selectedSlot && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-4 pt-2 border-t border-gray-100"
                          >
                            {selectedSlot.mode === "OFFLINE" && (
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#3F2965]/60 uppercase">Payment</label>
                                <div className="grid grid-cols-2 gap-2 bg-[#F9F6FF] p-1 rounded-xl">
                                  <button 
                                    onClick={() => setPaymentMethod("UPI")}
                                    className={`py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${paymentMethod === "UPI" ? "bg-white text-[#Dd1764] shadow-sm" : "text-gray-400 hover:text-[#3F2965]"}`}
                                  >
                                    <Wallet size={12} /> UPI
                                  </button>
                                  <button 
                                    onClick={() => setPaymentMethod("CASH")}
                                    className={`py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${paymentMethod === "CASH" ? "bg-white text-[#Dd1764] shadow-sm" : "text-gray-400 hover:text-[#3F2965]"}`}
                                  >
                                    <Banknote size={12} /> Cash
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="bg-[#F9F6FF] p-3 rounded-xl border border-[#3F2965]/5">
                              <div className="flex items-center gap-2 mb-2">
                                {paymentMethod === "UPI" ? (
                                  <Wallet size={14} className="text-[#Dd1764]" />
                                ) : (
                                  <Banknote size={14} className="text-[#Dd1764]" />
                                )}
                                <span className="text-xs font-bold text-[#3F2965]">
                                  {paymentMethod === "UPI" ? "Payment Required" : "Pay at Studio"}
                                </span>
                              </div>
                              
                              {paymentMethod === "UPI" ? (
                                <>
                                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                    <span className="text-[10px] text-gray-400 font-medium">UPI ID</span>
                                    <code className="font-mono text-xs font-bold text-[#3F2965] select-all">
                                      mindsettler@upi
                                    </code>
                                  </div>
                                </>
                              ) : (
                                <p className="text-[10px] text-[#3F2965]/70 italic bg-white p-2 rounded-lg border border-gray-100">
                                  Bring exact cash.
                                </p>
                              )}
                            </div>

                            <label className="flex items-start gap-2 cursor-pointer group p-1 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="relative flex items-center mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={agreed}
                                  onChange={(e) => setAgreed(e.target.checked)}
                                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-gray-300 transition-all checked:border-[#Dd1764] checked:bg-[#Dd1764]"
                                />
                                <CheckCircle size={10} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                              </div>
                              <span className="text-[10px] text-[#3F2965]/70 leading-tight">
                                I agree to <Link href="/confidentiality" className="underline font-bold text-[#3F2965]">Policy</Link>.
                              </span>
                            </label>

                            {error && (
                              <div className="p-2 bg-red-50 border border-red-100 rounded-lg text-[10px] text-red-600 flex items-center gap-2 font-medium">
                                <AlertCircle size={12} /> {error}
                              </div>
                            )}

                            <button
                              onClick={handleSubmit}
                              disabled={submitting || !agreed}
                              className="w-full py-3 rounded-xl bg-[#Dd1764] text-white font-bold text-base hover:bg-[#c91559] hover:shadow-lg hover:shadow-[#Dd1764]/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {submitting ? "Processing..." : (
                                <>
                                  Confirm <ShieldCheck size={16} />
                                </>
                              )}
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* What Happens Next Section - Positioned Below */}
                    <div className="bg-white/80 rounded-[2rem] p-6 border border-[#3F2965]/5 backdrop-blur-sm">
                      <h4 className="font-bold text-[#3F2965] mb-5 flex items-center gap-2 text-xs uppercase tracking-widest">
                        <Sparkles size={14} className="text-[#Dd1764]" /> What happens next?
                      </h4>
                      <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex gap-4 group">
                          <div className="mt-0.5 w-6 h-6 rounded-full bg-[#F9F6FF] group-hover:bg-[#3F2965] transition-colors duration-300 flex items-center justify-center text-[#Dd1764] group-hover:text-white text-xs font-bold border border-[#3F2965]/10 shrink-0">
                            1
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#3F2965] mb-0.5">Confirmation</p>
                            <p className="text-xs text-[#3F2965]/60 leading-relaxed">
                              We'll review your slot and confirm it within 2 hours.
                            </p>
                          </div>
                        </div>

                        {/* Line */}
                        <div className="ml-3 w-px h-4 bg-[#3F2965]/10 -my-2"></div>

                        {/* Step 2 */}
                        <div className="flex gap-4 group">
                           <div className="mt-0.5 w-6 h-6 rounded-full bg-[#F9F6FF] group-hover:bg-[#3F2965] transition-colors duration-300 flex items-center justify-center text-[#Dd1764] group-hover:text-white text-xs font-bold border border-[#3F2965]/10 shrink-0">
                            <Mail size={12} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#3F2965] mb-0.5">Notification</p>
                            <p className="text-xs text-[#3F2965]/60 leading-relaxed">
                              You'll receive an email with payment details (if pending) & session link.
                            </p>
                          </div>
                        </div>

                        {/* Line */}
                        <div className="ml-3 w-px h-4 bg-[#3F2965]/10 -my-2"></div>

                        {/* Step 3 */}
                        <div className="flex gap-4 group">
                           <div className="mt-0.5 w-6 h-6 rounded-full bg-[#F9F6FF] group-hover:bg-[#3F2965] transition-colors duration-300 flex items-center justify-center text-[#Dd1764] group-hover:text-white text-xs font-bold border border-[#3F2965]/10 shrink-0">
                            <Bell size={12} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#3F2965] mb-0.5">Session Time</p>
                            <p className="text-xs text-[#3F2965]/60 leading-relaxed">
                              Join 5 minutes early. We'll be ready for you!
                            </p>
                          </div>
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