"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { API_URL } from "@/app/lib/api";
import Link from "next/link";
import { 
  Calendar, Clock, CheckCircle, AlertCircle, ShieldCheck, 
  Sparkles, ArrowRight, Wallet, Banknote, BrainCircuit,
  Monitor, Building2, CalendarDays, Receipt, Mail, Bell, Lock,
  Copy, Check, Smartphone, Tag, Loader2, Ban,
  User as UserIcon, Phone, Users, Heart, Info
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

type BookingHistory = {
  id: string;
  therapyType?: string;
  status: string;
  createdAt: string;
};

type ApplicableDiscount = {
    label: string;
    discountPercent: number;
};

const UPI_ID = "mindsettler@upi"; 

export default function BookPage() {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false); 
  
  const [pricing, setPricing] = useState({
    FIRST: 1499,
    FOLLOW_UP: 999
  });
  
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [discount, setDiscount] = useState<ApplicableDiscount | null>(null);
  const [checkingDiscount, setCheckingDiscount] = useState(false);
  
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [type, setType] = useState<"FIRST" | "FOLLOW_UP">("FIRST");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CASH">("UPI");
  
  // --- Form Fields ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendees, setAttendees] = useState(1);
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [maritalStatusOther, setMaritalStatusOther] = useState("");
  const [reason, setReason] = useState("");
  
  const [therapyType, setTherapyType] = useState<string>("general");
  const [slotModeFilter, setSlotModeFilter] = useState<"ONLINE" | "OFFLINE" | "BOTH">("BOTH");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isFirstSessionAllowed, setIsFirstSessionAllowed] = useState(true);

  const therapyApproaches = therapyApproachesData;

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
         if(data.priceFirst && data.priceFollowUp) {
             setPricing({ 
               FIRST: Number(data.priceFirst), 
               FOLLOW_UP: Number(data.priceFollowUp) 
             });
         }
      })
      .catch(err => console.error("Failed to load pricing:", err));

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Initial fallback prefill from Firebase
        if (currentUser.displayName) setName(currentUser.displayName);
        if (currentUser.phoneNumber) setPhone(currentUser.phoneNumber);
        
        try {
            const token = await currentUser.getIdToken();
            const res = await fetch(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
                const userData = await res.json();
                // Prefill from DB if available (and user hasn't typed yet)
                if (userData.name) setName(userData.name);
                if (userData.phone) setPhone(userData.phone);
            } else if (res.status === 403) {
                const data = await res.json();
                if (data.error === "ACCOUNT_BLOCKED") setIsBlocked(true);
            }
        } catch (err) {
            console.error("Status/Profile check failed", err);
        }

        const urlParams = new URLSearchParams(window.location.search);
        const therapy = urlParams.get('therapy');
        if (therapy) setTherapyType(decodeURIComponent(therapy));

        fetchBookingHistory(currentUser);
        fetchApplicableDiscount(currentUser);
      } else {
        setUser(null);
      }
      setAuthChecking(false);
    });
    
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user && !isBlocked) fetchSlots();
  }, [therapyType, user, isBlocked]);

  useEffect(() => {
    if (!user) return;

    const relevantBookings = bookingHistory.filter(b => {
      const isNotRejected = b.status !== "REJECTED";
      const matchesTherapy = therapyType ? b.therapyType === therapyType : true;
      return isNotRejected && matchesTherapy;
    });

    const hasPriorHistory = relevantBookings.length > 0;

    if (hasPriorHistory) {
      setIsFirstSessionAllowed(false);
      setType("FOLLOW_UP"); 
    } else {
      setIsFirstSessionAllowed(true);
      setType("FIRST");
    }

    if (therapyType) {
      const selectedTherapy = therapyApproaches.find(t => t.title === therapyType);
      if (selectedTherapy) {
        if (selectedTherapy.availableOnline && !selectedTherapy.availableOffline) {
          setSlotModeFilter("ONLINE");
        } else if (!selectedTherapy.availableOnline && selectedTherapy.availableOffline) {
          setSlotModeFilter("OFFLINE");
        } else {
          setSlotModeFilter("BOTH");
        }
      }
    } else {
      setSlotModeFilter("BOTH");
    }
  }, [bookingHistory, therapyType, user, therapyApproaches]);

  const fetchApplicableDiscount = async (currentUser: User) => {
    try {
        setCheckingDiscount(true);
        const token = await currentUser.getIdToken();
        const res = await fetch(`${API_URL}/api/discounts/check`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setDiscount(data.discount); 
        }
    } catch (err) {
        console.error("Failed to check discounts", err);
    } finally {
        setCheckingDiscount(false);
    }
  };

  const fetchBookingHistory = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_URL}/api/bookings/my`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.ok) {
        const data = await res.json();
        setBookingHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const fetchSlots = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const url = therapyType && therapyType !== "general"
        ? `${API_URL}/api/bookings/slots?therapyType=${encodeURIComponent(therapyType)}`
        : `${API_URL}/api/bookings/slots`;
      
      const token = await user.getIdToken();
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      setSlots(data || []); 
    } catch (err) {
      console.error(err);
      toast.error("Could not load available times");
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

  const calculateTotal = () => {
    const basePrice = type === "FIRST" ? pricing.FIRST : pricing.FOLLOW_UP;
    if (!discount) return basePrice;
    const discountAmount = (basePrice * discount.discountPercent) / 100;
    return Math.max(0, Math.ceil(basePrice - discountAmount));
  };

  const finalPrice = calculateTotal();

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success("UPI ID Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=MindSettler&am=${finalPrice}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiDeepLink)}`;

  const handleSubmit = async () => {
    if (!selectedSlot) { 
      toast.error("Please select a time slot.");
      return; 
    }
    
    // --- Validation ---
    if (!name.trim()) { toast.error("Name is required."); return; }
    if (!phone.trim()) { toast.error("Phone number is required."); return; }
    if (!attendees || attendees < 1) { toast.error("Please specify number of people joining."); return; }
    if (maritalStatus === "Other" && !maritalStatusOther.trim()) { toast.error("Please specify your status."); return; }
    // ------------------

    if (!agreed) { 
      toast.error("Please agree to the Confidentiality Policy.");
      return; 
    }

    setSubmitting(true);
    const toastId = toast.loading("Securing your session...");
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

      // Construct reason with metadata for admin clarity
      let finalReason = reason;
      if (discount) {
        finalReason += ` | [${discount.label}: ${discount.discountPercent}% OFF APPLIED]`;
      }
      finalReason += ` | [System Price: ₹${finalPrice}]`;

      const finalStatus = maritalStatus === "Other" ? maritalStatusOther : maritalStatus;

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          type,
          reason: finalReason,
          paymentMethod,
          therapyType,
          // New Fields
          name,
          phone,
          attendees: Number(attendees),
          status: finalStatus
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      toast.success("Session Booked Successfully! 🎉", { id: toastId });
      setSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
      setBookingSuccess(true);
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message, { id: toastId, duration: 5000 });
      setError(err.message);
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
    <div className="min-h-screen lg:h-screen bg-[#F9F6FF] pt-20 sm:pt-24 px-4 sm:px-6 md:px-8 relative flex flex-col">
      
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

      <div className={`transition-all duration-500 flex-1 min-h-0 ${!user ? 'blur-md pointer-events-none opacity-50 select-none grayscale-[0.5]' : ''}`}>
                  
          <div className="relative z-10 text-[#3F2965] h-full">

            {isBlocked ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 p-12">
                <div className="w-24 h-24 bg-red-50 border-4 border-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Ban size={48} className="text-red-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3F2965]">Account Restricted</h2>
                <p className="text-[#3F2965]/70 text-lg max-w-md mb-8 leading-relaxed">
                  Your account has been temporarily restricted from making new bookings due to policy violations (e.g., repeated cancellations).
                </p>
                <Link 
                  href="/contact"
                  className="w-full max-w-sm py-4 rounded-xl bg-[#3F2965] text-white font-bold shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Contact Support <ArrowRight size={20} />
                </Link>
              </div>

            ) : bookingSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 p-12 overflow-y-auto">
                <div className="w-24 h-24 bg-yellow-50 border-4 border-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Clock size={48} className="text-yellow-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Request Sent!</h2>
                <p className="text-[#3F2965]/70 text-lg max-w-md mb-8 leading-relaxed">
                  Your session request has been received. <br/>
                  We will notify you via email at <strong>{user?.email}</strong> once the admin confirms your slot.
                </p>
                <button 
                  onClick={() => router.push("/profile")}
                  className="w-full max-w-sm py-4 rounded-xl bg-[#3F2965] text-white font-bold shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              
              <div className="grid lg:grid-cols-12 h-full gap-0 lg:gap-8">
                
                {/* --- LEFT COLUMN (Selection) --- */}
                <div className="lg:col-span-8 h-full overflow-y-auto custom-scrollbar p-1 pb-20 lg:p-4 lg:pr-2">
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

                        {/* --- Step 1: Therapy Type --- */}
                        <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-[#3F2965] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-[#3F2965]/20">1</div>
                            <h2 className="text-xl font-bold">Choose Therapy</h2>
                        </div>

                        <div className="bg-white/60 rounded-2xl p-6 border border-[#3F2965]/5 relative overflow-hidden group">                            
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-start gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-2xl bg-[#F9F6FF] flex items-center justify-center shadow-sm shrink-0">
                                        <BrainCircuit className="text-[#Dd1764]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-[#3F2965]">Select Approach</h3>
                                        <p className="text-sm text-[#3F2965]/60 leading-relaxed">
                                            Different approaches work for different needs. Select one to see available slots and customized pricing.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <select
                                    value={therapyType}
                                    onChange={(e) => setTherapyType(e.target.value)}
                                    className="w-full bg-white border-2 border-[#F9F6FF] hover:border-[#Dd1764]/30 focus:border-[#Dd1764] rounded-xl p-4 pr-10 text-base font-medium focus:outline-none focus:ring-4 focus:ring-[#Dd1764]/5 transition-all cursor-pointer shadow-sm"
                                    >
                                    <option value="general" className="text-[#3F2965]/60">General Session</option>
                                    {therapyApproaches.map((therapy) => (
                                        <option key={therapy.id} value={therapy.title} className="text-[#3F2965] py-2">
                                        {therapy.title}
                                        </option>
                                    ))}
                                    </select>
                                </div>

                                <p className="text-xs text-[#3F2965]/50 italic leading-relaxed">
                                    💡 Not sure which therapy to choose? Start with a <strong>General Session</strong> - our therapist will help guide you to the right approach.
                                </p>
                            </div>
                        </div>
                        </section>

                        {/* --- Step 2: Session Type --- */}
                        <section className={!therapyType ? "opacity-50 grayscale pointer-events-none blur-[1px] transition-all" : "transition-all"}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-[#3F2965] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-[#3F2965]/20">2</div>
                            <h2 className="text-xl font-bold">Select Session Type</h2>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                            
                            {/* Option 1: First Session */}
                            <button
                                disabled={!isFirstSessionAllowed}
                                onClick={() => setType("FIRST")}
                                className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden flex flex-col justify-between min-h-[160px] ${
                                type === "FIRST"
                                    ? "border-[#Dd1764] bg-white shadow-xl shadow-[#Dd1764]/10 scale-[1.01]"
                                    : isFirstSessionAllowed 
                                        ? "border-transparent bg-white/60 hover:bg-white hover:border-[#3F2965]/10"
                                        : "border-transparent bg-gray-100/80 opacity-60 cursor-not-allowed"
                                }`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                            type === "FIRST" ? "bg-[#Dd1764] text-white" : "bg-[#F9F6FF] text-[#3F2965]"
                                        }`}>
                                            <Sparkles size={20} />
                                        </div>
                                        <div className={`transition-all duration-300 ${type === "FIRST" ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                            <CheckCircle className="text-[#Dd1764] fill-[#Dd1764]/10" size={24} />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 text-[#3F2965]">First Session</h3>
                                    <p className="text-xs text-[#3F2965]/60 font-medium mb-1">60 Minutes • Intake</p>
                                    <p className="text-[11px] leading-relaxed text-[#3F2965]/50">
                                        Detailed initial consultation to understand your needs.
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                                        type === "FIRST" 
                                            ? "bg-[#Dd1764]/10 text-[#Dd1764] border-[#Dd1764]/20" 
                                            : "bg-[#F9F6FF] text-[#3F2965] border-[#3F2965]/5"
                                    }`}>
                                        ₹{pricing.FIRST}
                                    </span>
                                </div>
                                {!isFirstSessionAllowed && (
                                   <div className="absolute top-3 right-3 bg-gray-200/80 p-1.5 rounded-lg z-10" title="You have previous bookings">
                                     <Lock size={16} className="text-gray-400" />
                                   </div>
                                )}
                            </button>

                            {/* Option 2: Follow-up */}
                            <button
                                disabled={isFirstSessionAllowed} 
                                onClick={() => setType("FOLLOW_UP")}
                                className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group overflow-hidden flex flex-col justify-between min-h-[160px] ${
                                type === "FOLLOW_UP"
                                    ? "border-[#Dd1764] bg-white shadow-xl shadow-[#Dd1764]/10 scale-[1.01]"
                                    : !isFirstSessionAllowed
                                        ? "border-transparent bg-white/60 hover:bg-white hover:border-[#3F2965]/10"
                                        : "border-transparent bg-gray-100/80 opacity-60 cursor-not-allowed"
                                }`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                            type === "FOLLOW_UP" ? "bg-[#Dd1764] text-white" : "bg-[#F9F6FF] text-[#3F2965]"
                                        }`}>
                                            <ArrowRight size={20} />
                                        </div>
                                        <div className={`transition-all duration-300 ${type === "FOLLOW_UP" ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                            <CheckCircle className="text-[#Dd1764] fill-[#Dd1764]/10" size={24} />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1 text-[#3F2965]">Follow-up Session</h3>
                                    <p className="text-xs text-[#3F2965]/60 font-medium mb-1">60 Minutes • Growth</p>
                                    <p className="text-[11px] leading-relaxed text-[#3F2965]/50">
                                        Continue your journey and review progress.
                                    </p>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-colors ${
                                        type === "FOLLOW_UP" 
                                            ? "bg-[#Dd1764]/10 text-[#Dd1764] border-[#Dd1764]/20" 
                                            : "bg-[#F9F6FF] text-[#3F2965] border-[#3F2965]/5"
                                    }`}>
                                        ₹{pricing.FOLLOW_UP}
                                    </span>
                                </div>
                                {isFirstSessionAllowed && (
                                   <div className="absolute top-3 right-3 bg-gray-200/80 p-1.5 rounded-lg z-10" title="Complete your first session first">
                                     <Lock size={16} className="text-gray-400" />
                                   </div>
                                )}
                            </button>
                        </div>
                        </section>

                        {/* --- Step 3: Slots --- */}
                        <section className={!therapyType ? "opacity-50 grayscale pointer-events-none blur-[1px] transition-all" : "transition-all"}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-[#3F2965] text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-[#3F2965]/20">3</div>
                            <h2 className="text-xl font-bold">Select Time</h2>
                        </div>

                        {/* Filter Toggles */}
                        <div className="bg-white/60 rounded-2xl p-4 mb-6 border border-[#3F2965]/5">
                            <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSlotModeFilter("BOTH")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                slotModeFilter === "BOTH" ? "bg-[#3F2965] text-white shadow-md" : "bg-white text-[#3F2965] border border-[#3F2965]/10"
                                }`}
                            >
                                <CalendarDays size={14} /> All Slots
                            </button>
                            <button
                                onClick={() => setSlotModeFilter("ONLINE")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                slotModeFilter === "ONLINE" ? "bg-green-600 text-white shadow-md" : "bg-white text-green-700 border border-green-100"
                                }`}
                            >
                                <Monitor size={14} /> Online
                            </button>
                            <button
                                onClick={() => setSlotModeFilter("OFFLINE")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                                slotModeFilter === "OFFLINE" ? "bg-blue-600 text-white shadow-md" : "bg-white text-blue-700 border border-blue-100"
                                }`}
                            >
                                <Building2 size={14} /> Offline
                            </button>
                            </div>
                        </div>

                        {loading && (
                            <div className="p-12 text-center bg-white/40 rounded-3xl border border-dashed border-[#3F2965]/10">
                            <div className="animate-spin w-8 h-8 border-4 border-[#Dd1764] border-t-transparent rounded-full mx-auto mb-4"/>
                            <p className="text-[#3F2965]/50 text-sm font-medium">Checking doctor's availability...</p>
                            </div>
                        )}
                        
                        {!loading && filteredSlots.length > 0 && (
                            <div className="space-y-8">
                            {Object.entries(groupedSlots).map(([dateString, dateSlots]) => (
                                <div key={dateString} className="relative">
                                <div className="sticky top-0 z-10 -mx-4 px-4 bg-[#F9F6FF]/95 backdrop-blur-md py-3 mb-2 flex items-center gap-3">
                                    <div className="h-px flex-1 bg-[#3F2965]/10"></div>
                                    <span className="font-bold text-[#3F2965]/80 bg-white px-4 py-1.5 rounded-full text-xs shadow-sm border border-[#3F2965]/5 flex items-center gap-2">
                                    <Calendar size={12} /> {dateString}
                                    </span>
                                    <div className="h-px flex-1 bg-[#3F2965]/10"></div>
                                </div>

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

                {/* --- RIGHT COLUMN (Summary & Details) --- */}
                <div className="lg:col-span-4 h-full overflow-y-auto custom-scrollbar lg:border-l lg:border-[#3F2965]/5 lg:bg-white/30 p-6 md:p-8 pb-20">
                    
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-[#3F2965]/5 border border-[#3F2965]/5 overflow-hidden mb-6">
                      
                      <div className="bg-[#3F2965] p-5 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.webp')] opacity-10"></div>                        
                        <h3 className="text-base font-bold relative z-10 flex items-center justify-center gap-2">
                           <Receipt size={16} className="text-[#Dd1764]" /> Booking Summary
                        </h3>
                      </div>

                      <div className="p-5 space-y-5">
                        {!selectedSlot ? (
                          <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                            <Clock size={32} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-sm font-bold text-[#3F2965]/40">No time selected yet</p>
                            <p className="text-xs text-[#3F2965]/30">Complete steps on left</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Time/Date */}
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
                                <p className="font-bold text-sm text-[#3F2965]">
                                  {new Date(selectedSlot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Time</p>
                                <p className="font-bold text-sm text-[#3F2965]">
                                  {new Date(selectedSlot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium text-gray-500">Therapy</span>
                                  <span className="text-xs font-bold text-[#3F2965] max-w-[150px] text-right truncate">
                                    {therapyType || "General Session"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium text-gray-500">Session Type</span>
                                  <span className="text-xs font-bold text-[#Dd1764]">
                                    {type === "FIRST" ? "First Session" : "Follow-up"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium text-gray-500">Mode</span>
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 ${selectedSlot.mode === 'ONLINE' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {selectedSlot.mode === 'ONLINE' ? <Monitor size={8} /> : <Building2 size={8} />}
                                    {selectedSlot.mode}
                                  </span>
                                </div>
                            </div>

                            {/* Discount Logic */}
                            <div className="pt-2">
                                {checkingDiscount ? (
                                    <div className="flex items-center gap-2 text-[#3F2965]/50 text-xs">
                                        <Loader2 size={12} className="animate-spin" /> Checking eligible discounts...
                                    </div>
                                ) : discount ? (
                                    <div className="bg-green-50 border border-green-100 p-2.5 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Tag size={14} className="text-green-600" />
                                            <div>
                                                <p className="text-[10px] font-bold text-green-700 uppercase">
                                                    {discount.label} Applied!
                                                </p>
                                                <p className="text-[10px] text-green-600">
                                                    You save {discount.discountPercent}%
                                                </p>
                                            </div>
                                        </div>
                                        <Check size={14} className="text-green-600" />
                                    </div>
                                ) : null}
                            </div>
                            
                            {/* Total */}
                            <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                                <span className="text-sm font-bold text-[#3F2965]">Total Amount</span>
                                <div className="text-right">
                                  {discount && (
                                     <span className="block text-xs text-gray-400 line-through decoration-red-400 decoration-2 mr-1">
                                       ₹{type === "FIRST" ? pricing.FIRST : pricing.FOLLOW_UP}
                                     </span>
                                  )}
                                  <span className="text-2xl font-black text-[#3F2965]">
                                      ₹{finalPrice}
                                  </span>
                                </div>
                            </div>
                          </div>
                        )}

                        {/* --- NEW FIELDS SECTION --- */}
                        {selectedSlot && (
                          <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                             
                             {/* Name */}
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#3F2965]/60 uppercase tracking-wider">
                                  Name *
                                </label>
                                <div className="relative">
                                  <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Full Name"
                                    className="w-full pl-9 pr-3 py-2.5 bg-[#F9F6FF] rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/10 transition-all border border-transparent focus:border-[#Dd1764]/20"
                                  />
                                </div>
                             </div>

                             {/* Email Notification Note (Replaces Input) */}
                             <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 flex items-start gap-2">
                                <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-blue-700/80 leading-relaxed">
                                   Confirmation details will be sent to your registered email: <br/>
                                   <span className="font-bold text-blue-800">{user?.email}</span>
                                </p>
                             </div>

                             {/* Phone & Attendees */}
                             <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-[#3F2965]/60 uppercase tracking-wider">
                                    Number *
                                  </label>
                                  <div className="relative">
                                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                      type="tel"
                                      value={phone}
                                      onChange={(e) => setPhone(e.target.value)}
                                      placeholder="Mobile No."
                                      className="w-full pl-9 pr-3 py-2.5 bg-[#F9F6FF] rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/10 transition-all border border-transparent focus:border-[#Dd1764]/20"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-[#3F2965]/60 uppercase tracking-wider">
                                    People Joining *
                                  </label>
                                  <div className="relative">
                                    <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                      type="number"
                                      min="1"
                                      value={attendees}
                                      onChange={(e) => setAttendees(parseInt(e.target.value))}
                                      className="w-full pl-9 pr-3 py-2.5 bg-[#F9F6FF] rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/10 transition-all border border-transparent focus:border-[#Dd1764]/20"
                                    />
                                  </div>
                                </div>
                             </div>

                             {/* Status */}
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-[#3F2965]/60 uppercase tracking-wider">
                                  Status *
                                </label>
                                <div className="relative">
                                  <Heart size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <select 
                                    value={maritalStatus}
                                    onChange={(e) => setMaritalStatus(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 bg-[#F9F6FF] rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/10 transition-all border border-transparent focus:border-[#Dd1764]/20 appearance-none"
                                  >
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Couple">Couple</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                {maritalStatus === "Other" && (
                                  <input 
                                    type="text"
                                    value={maritalStatusOther}
                                    onChange={(e) => setMaritalStatusOther(e.target.value)}
                                    placeholder="Please specify..."
                                    className="mt-2 w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#Dd1764]"
                                  />
                                )}
                             </div>

                          </div>
                        )}

                        {/* Reason Field */}
                        <div className="space-y-2 pt-2">
                          <label className="text-[10px] font-bold text-[#3F2965]/60 block uppercase tracking-wider leading-tight">
                            What will you think to talk about? <br/> or what you are going through?
                          </label>
                          <textarea
                            className="w-full bg-[#F9F6FF] border border-transparent focus:bg-white focus:border-[#Dd1764]/20 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#Dd1764]/10 resize-none transition-all placeholder:text-gray-400"
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Briefly describe here..."
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
                                <label className="text-[10px] font-bold text-[#3F2965]/60 uppercase">Payment Method</label>
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

                            {/* Payment Section */}
                            <div className="bg-[#F9F6FF] p-4 rounded-xl border border-[#3F2965]/5 space-y-3">
                                
                                <div className="flex items-center gap-2 mb-1">
                                    {paymentMethod === "UPI" ? (
                                        <Wallet size={14} className="text-[#Dd1764]" />
                                    ) : (
                                        <Banknote size={14} className="text-[#Dd1764]" />
                                    )}
                                    <span className="text-xs font-bold text-[#3F2965]">
                                        {paymentMethod === "UPI" ? "Scan to Pay" : "Pay at Studio"}
                                    </span>
                                </div>
                              
                                {paymentMethod === "UPI" ? (
                                    <>
                                        <div className="flex gap-4 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                            {/* QR */}
                                            <div className="shrink-0 bg-white p-1 rounded-lg border border-gray-100">
                                                <img 
                                                    src={qrCodeUrl} 
                                                    alt="UPI QR Code" 
                                                    className="w-20 h-20 object-contain mix-blend-multiply"
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                    <code className="text-[10px] font-mono font-bold text-[#3F2965] truncate max-w-[100px]">
                                                        {UPI_ID}
                                                    </code>
                                                    <button 
                                                        onClick={handleCopyUpi}
                                                        className="text-gray-400 hover:text-[#Dd1764] transition-colors"
                                                        title="Copy UPI ID"
                                                    >
                                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                                    </button>
                                                </div>

                                                {/* Deep Link */}
                                                <a 
                                                    href={upiDeepLink}
                                                    className="w-full text-center py-1.5 rounded-lg bg-[#3F2965] text-white text-[10px] font-bold hover:bg-[#2a1b45] transition-colors flex items-center justify-center gap-1.5 md:hidden"
                                                >
                                                    <Smartphone size={10} /> Open App
                                                </a>
                                                <p className="hidden md:block text-[9px] text-gray-400 text-center">
                                                    Scan QR with GPay/PhonePe
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-[10px] text-[#3F2965]/70 italic bg-white p-3 rounded-lg border border-gray-100 text-center">
                                        Please bring exact change (₹{finalPrice}) to the clinic. <br/>
                                        Payment collected before session.
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
                                I agree to the <Link href="/confidentiality" target="_blank" className="underline font-bold text-[#3F2965]">Confidentiality Policy</Link>.
                              </span>
                            </label>

                            {error && (
                              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 flex items-start gap-2 font-medium animate-pulse">
                                <AlertCircle size={14} className="mt-0.5 shrink-0" /> 
                                <span>{error}</span>
                              </div>
                            )}

                            <button
                              onClick={handleSubmit}
                              disabled={submitting || !agreed}
                              className="w-full py-3.5 rounded-xl bg-[#Dd1764] text-white font-bold text-base hover:bg-[#c91559] hover:shadow-lg hover:shadow-[#Dd1764]/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                    <div className="bg-white/80 rounded-[2rem] p-6 border border-[#3F2965]/5 backdrop-blur-sm">
                      <h4 className="font-bold text-[#3F2965] mb-5 flex items-center gap-2 text-xs uppercase tracking-widest">
                        <Sparkles size={14} className="text-[#Dd1764]" /> What happens next?
                      </h4>
                      <div className="space-y-5">
                        <div className="flex gap-4 group">
                          <div className="mt-0.5 w-6 h-6 rounded-full bg-[#F9F6FF] group-hover:bg-[#3F2965] transition-colors duration-300 flex items-center justify-center text-[#Dd1764] group-hover:text-white text-xs font-bold border border-[#3F2965]/10 shrink-0">
                            1
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#3F2965] mb-0.5">Confirmation Review</p>
                            <p className="text-xs text-[#3F2965]/60 leading-relaxed">
                              Our admin reviews the slot availability. You'll receive a confirmation email within 2 hours.
                            </p>
                          </div>
                        </div>

                        <div className="ml-3 w-px h-4 bg-[#3F2965]/10 -my-2"></div>

                        <div className="flex gap-4 group">
                           <div className="mt-0.5 w-6 h-6 rounded-full bg-[#F9F6FF] group-hover:bg-[#3F2965] transition-colors duration-300 flex items-center justify-center text-[#Dd1764] group-hover:text-white text-xs font-bold border border-[#3F2965]/10 shrink-0">
                            <Mail size={12} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#3F2965] mb-0.5">Session Details</p>
                            <p className="text-xs text-[#3F2965]/60 leading-relaxed">
                              Check your inbox for the Google Meet link (if online) or clinic location pin (if offline).
                            </p>
                          </div>
                        </div>

                        <div className="ml-3 w-px h-4 bg-[#3F2965]/10 -my-2"></div>

                        <div className="flex gap-4 group">
                           <div className="mt-0.5 w-6 h-6 rounded-full bg-[#F9F6FF] group-hover:bg-[#3F2965] transition-colors duration-300 flex items-center justify-center text-[#Dd1764] group-hover:text-white text-xs font-bold border border-[#3F2965]/10 shrink-0">
                            <Bell size={12} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#3F2965] mb-0.5">Start Healing</p>
                            <p className="text-xs text-[#3F2965]/60 leading-relaxed">
                              Join 5 minutes early. Bring a notebook and an open mind. We are ready for you!
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