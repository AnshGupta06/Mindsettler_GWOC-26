"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import { 
  Calendar, Clock, MapPin, CheckCircle, AlertCircle, ShieldCheck, 
  CreditCard, Sparkles, ArrowRight, Wallet, User, Tag, ChevronDown, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "ONLINE" | "OFFLINE";
};

type Discount = {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minAmount?: number;
  description: string;
  expiresAt?: string;
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
  
  // Discount states
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);

  // Prices
  const PRICES = {
    FIRST: 2500,
    FOLLOW_UP: 2000
  };

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
        
        // Load available discounts
        const discountsRes = await fetch("http://localhost:5000/api/discounts/available");
        if (discountsRes.ok) {
          const discountsData = await discountsRes.json();
          setAvailableDiscounts(discountsData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load slots.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  // Calculate price with discount
  const calculatePrice = () => {
    const basePrice = PRICES[type];
    if (!appliedDiscount) return basePrice;
    
    if (appliedDiscount.type === "PERCENTAGE") {
      const discountAmount = (basePrice * appliedDiscount.value) / 100;
      return Math.max(0, basePrice - discountAmount);
    } else {
      return Math.max(0, basePrice - appliedDiscount.value);
    }
  };

  const finalPrice = calculatePrice();
  const discountAmount = appliedDiscount ? PRICES[type] - finalPrice : 0;

  // Apply discount code
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }

    setIsApplyingDiscount(true);
    setDiscountError("");

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:5000/api/discounts/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: discountCode,
          amount: PRICES[type],
          type
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid discount code");
      }

      setAppliedDiscount(data.discount);
      setDiscountCode("");
      setShowDiscountInput(false);
    } catch (err: any) {
      console.error(err);
      setDiscountError(err.message);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  // Remove applied discount
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  // 🗓️ Helper: Group slots by Date String
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
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      await fetch("http://localhost:5000/api/auth/sync-user", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

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
          discountCode: appliedDiscount?.code,
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
    <div className="min-h-screen bg-[#F9F6FF] text-[#3F2965] pt-24 lg:pt-32 px-4 md:px-8 pb-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 relative">
        
        {/* ================= LEFT COLUMN: SELECTION AREA ================= */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Book your <span className="text-[#Dd1764]">Healing Space</span>
            </h1>
            <p className="text-[#3F2965]/60 text-lg max-w-2xl">
              Take the first step towards clarity. Choose a time that works for you, and let's begin this journey together. 🌿
            </p>
          </div>

          {/* 1. Session Type Selection */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#3F2965] text-white flex items-center justify-center font-bold shadow-md shadow-[#3F2965]/20">1</div>
              <h2 className="text-xl font-bold">Choose Session Type</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { id: "FIRST", label: "First Session", desc: "For new clients. We'll explore your history and goals.", icon: Sparkles },
                { id: "FOLLOW_UP", label: "Follow-up", desc: "For returning clients. Continuing our progress.", icon: ArrowRight }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setType(item.id as any);
                    // Reset discount when type changes
                    setAppliedDiscount(null);
                  }}
                  className={`relative p-6 rounded-3xl border-2 text-left transition-all duration-300 group overflow-hidden ${
                    type === item.id
                      ? "border-[#Dd1764] bg-white shadow-xl shadow-[#Dd1764]/10"
                      : "border-transparent bg-white/50 hover:bg-white hover:border-[#3F2965]/10"
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
                  
                  {/* Price badge */}
                  <div className={`mt-3 text-sm font-bold ${
                    type === item.id ? "text-[#Dd1764]" : "text-[#3F2965]/60"
                  }`}>
                    ₹{PRICES[item.id as keyof typeof PRICES]}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Slot Selection */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#3F2965] text-white flex items-center justify-center font-bold shadow-md shadow-[#3F2965]/20">2</div>
              <h2 className="text-xl font-bold">Select a Time Slot</h2>
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
                  <div className="sticky top-24 z-10 -mx-4 px-4 bg-[#F9F6FF]/95 backdrop-blur-md py-3 mb-4 flex items-center gap-3">
                     <div className="h-px flex-1 bg-[#3F2965]/10"></div>
                     <span className="font-bold text-[#3F2965]/80 bg-white px-4 py-1.5 rounded-full text-sm shadow-sm border border-[#3F2965]/5">
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
                             <div className={`text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 ${
                                slot.mode === 'ONLINE' 
                                  ? (isSelected ? 'bg-white/20 text-white' : 'bg-green-50 text-green-700')
                                  : (isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700')
                              }`}>
                                {slot.mode === 'ONLINE' ? <MapPin size={10} /> : <MapPin size={10} />}
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


        {/* ================= RIGHT COLUMN: SUMMARY & ACTION (Sticky) ================= */}
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            
            {/* Unified Ticket Card */}
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-[#3F2965]/10 border border-[#3F2965]/5 overflow-hidden">
              
              {/* Header */}
              <div className="bg-[#3F2965] p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <h3 className="text-lg font-bold relative z-10">Booking Summary</h3>
                <p className="text-xs text-white/60 relative z-10 mt-1">Review your details below</p>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Session Details */}
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

                {/* Price Breakdown */}
                {selectedSlot && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3 pt-4 border-t border-gray-100"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#3F2965]/60">Session Fee</span>
                        <span className="font-medium">₹{PRICES[type]}</span>
                      </div>
                      
                      {/* Discount Section */}
                      <AnimatePresence>
                        {appliedDiscount && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between items-center bg-green-50 p-3 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Tag size={14} className="text-green-600" />
                              <div>
                                <span className="text-sm font-medium text-green-700">
                                  {appliedDiscount.type === "PERCENTAGE" 
                                    ? `${appliedDiscount.value}% OFF`
                                    : `₹${appliedDiscount.value} OFF`}
                                </span>
                                <p className="text-xs text-green-600">
                                  {appliedDiscount.code}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-700">-₹{discountAmount}</span>
                              <button 
                                onClick={handleRemoveDiscount}
                                className="p-1 hover:bg-green-100 rounded-full transition-colors"
                              >
                                <X size={14} className="text-green-600" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Apply Discount Button */}
                      {!appliedDiscount && !showDiscountInput && (
                        <button
                          onClick={() => setShowDiscountInput(true)}
                          className="w-full py-2 text-sm text-[#Dd1764] hover:text-[#c91559] font-medium flex items-center justify-center gap-2 hover:bg-[#F9F6FF] rounded-lg transition-colors"
                        >
                          <Tag size={14} />
                          Have a discount code?
                          <ChevronDown size={14} className={`transition-transform ${showDiscountInput ? 'rotate-180' : ''}`} />
                        </button>
                      )}

                      {/* Discount Input */}
                      <AnimatePresence>
                        {showDiscountInput && !appliedDiscount && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2"
                          >
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                placeholder="Enter discount code"
                                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#Dd1764]"
                                disabled={isApplyingDiscount}
                              />
                              <button
                                onClick={handleApplyDiscount}
                                disabled={isApplyingDiscount || !discountCode.trim()}
                                className="px-4 py-2 bg-[#Dd1764] text-white rounded-lg text-sm font-medium hover:bg-[#c91559] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {isApplyingDiscount ? "..." : "Apply"}
                              </button>
                            </div>
                            {discountError && (
                              <p className="text-xs text-red-500">{discountError}</p>
                            )}
                            <button
                              onClick={() => {
                                setShowDiscountInput(false);
                                setDiscountError("");
                              }}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              Cancel
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span className="font-bold text-[#3F2965]">Total Amount</span>
                        <div className="text-right">
                          {appliedDiscount && (
                            <span className="text-xs text-gray-400 line-through block">₹{PRICES[type]}</span>
                          )}
                          <span className="text-xl font-bold text-[#Dd1764]">₹{finalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Optional Reason Input */}
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

                {/* Payment Section */}
                {selectedSlot && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-4 border-t border-gray-100"
                  >
                    <div className="bg-[#F9F6FF] p-4 rounded-xl border border-[#3F2965]/5">
                      <div className="flex items-center gap-2 mb-3">
                        <Wallet size={16} className="text-[#Dd1764]" />
                        <span className="text-sm font-bold text-[#3F2965]">Payment Required</span>
                      </div>
                      
                      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                         <span className="text-xs text-gray-400 font-medium">UPI ID</span>
                         <code className="font-mono text-sm font-bold text-[#3F2965] select-all">
                           mindsettler@upi
                         </code>
                      </div>
                      <p className="text-[10px] text-center text-gray-400 mt-2">
                        Complete payment via any UPI app to confirm.
                      </p>
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
                        I agree to the <Link href="/policy" className="underline font-bold text-[#3F2965] hover:text-[#Dd1764]">Confidentiality Policy</Link>.
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
                          Pay ₹{finalPrice} <ShieldCheck size={18} />
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
                   <User size={14} /> Private
                </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}