"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { API_URL } from "@/app/lib/api";
import { 
  Calendar, Clock, MapPin, User as UserIcon, 
  Video, Info, History, Edit3, Smartphone, BrainCircuit,
  AlertTriangle, Banknote 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AlertModal from "../components/common/AlertModal";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";


type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  type: "FIRST" | "FOLLOW_UP";
  therapyType?: string;
  reason?: string;
  meetingLink?: string;
  paymentType?: string; // ✅ ADDED
  slot: {
    date: string;
    startTime: string;
    endTime: string;
    mode: "ONLINE" | "OFFLINE";
  };
};

type UserProfile = {
  name: string | null;
  email: string | null;
  phone: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "HISTORY">("UPCOMING");
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "AUTH" | "CONFIRM" | "SUCCESS" | "ERROR" | "BLOCKED";
    title?: string;
    message?: string | React.ReactNode;
    actionLabel?: string;
    bookingId?: string; 
  }>({
    isOpen: false,
    type: "AUTH",
  });
  
  const [actionLoading, setActionLoading] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfileData(currentUser);
      } else {
        setLoading(false);
        setModalState({ isOpen: true, type: "AUTH" });
      }
    });
    return () => unsub();
  }, []);

  const fetchProfileData = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const [userRes, bookingRes] = await Promise.all([
        fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/bookings/my`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const userData = await userRes.json();
      
      if (userRes.status === 403 && userData.error === "ACCOUNT_BLOCKED") {
        setModalState({
          isOpen: true,
          type: "BLOCKED",
          title: "Account Restricted",
          message: "Your account has been temporarily restricted. Please contact support for assistance."
        });
        setLoading(false); 
        return;
      }

      setDbUser(userData);
      setEditName(userData.name || currentUser.displayName || "");
      setEditPhone(userData.phone || "");

      const bookingData = await bookingRes.json();
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = await user?.getIdToken();
      await fetch(`${API_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });
      
      if (user) await fetchProfileData(user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    if (modalState.type === "AUTH" || modalState.type === "BLOCKED") router.push("/"); 
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const initiateCancel = (booking: Booking) => {
    const isConfirmed = booking.status === "CONFIRMED";
    
    // Calculate time difference in hours
    const sessionStart = new Date(booking.slot.startTime).getTime();
    const now = new Date().getTime();
    const hoursUntilSession = (sessionStart - now) / (1000 * 60 * 60);
    const isLateCancellation = hoursUntilSession < 24;

    let title = "Cancel Session?";
    let message: React.ReactNode = "Are you sure you want to cancel this session? This action cannot be undone.";
    let actionLabel = "Yes, Cancel Session";

    if (isConfirmed) {
      if (isLateCancellation) {
        // --- Late Cancellation Logic (< 24h) ---
        title = "Late Cancellation (Fee Forfeited)";
        actionLabel = "Confirm Cancellation";
        message = (
          <div className="text-left space-y-4">
            <div className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
               <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
               <div className="text-sm text-red-800">
                  <p className="font-bold">Policy Warning</p>
                  <p>You are cancelling with less than 24 hours' notice.</p>
               </div>
            </div>
            
            <p className="text-sm text-[#3F2965]/80 leading-relaxed">
              According to our refund policy, this results in the <strong>forfeiture of the session fee</strong> as the time was specifically reserved for you.
            </p>

            {/* Cash Note: Only relevant for offline sessions */}
            {booking.slot.mode === "OFFLINE" && (
              <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                      <p className="font-bold">Pay at Session Note</p>
                      <p className="text-xs mt-1">
                        If you are going to pay with cash which is only available in offline session, please note that late cancellations may affect your eligibility for future bookings.
                      </p>
                  </div>
              </div>
            )}
          </div>
        );
      } else {
        // --- Early Cancellation Logic (> 24h) ---
        title = "Cancel Session";
        actionLabel = "Remove Booking";
        message = (
          <div className="text-left space-y-4">
            <div className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
               <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
               <div className="text-sm text-blue-800">
                  <p className="font-bold">Policy Note</p>
                  <p>Payments are generally non-refundable.</p>
               </div>
            </div>

            <p className="text-sm text-[#3F2965]/80 leading-relaxed">
               However, since you are notifying us early (24h+), you are eligible to <strong>reschedule</strong> without penalty.
            </p>

            {booking.slot.mode === "OFFLINE" ? (
               <p className="text-xs text-[#3F2965]/60 italic pl-1 border-l-2 border-[#3F2965]/10">
                  Note: If you are going to pay with cash which is only available in offline session, no online refund processing is needed.
               </p>
            ) : (
               <p className="text-sm text-[#3F2965]/80">
                  Cancelling here will simply remove the booking. To reschedule instead, please contact us directly.
               </p>
            )}
          </div>
        );
      }
    }

    setModalState({
      isOpen: true,
      type: "CONFIRM",
      bookingId: booking.id,
      title: title,
      message: message,
      actionLabel: actionLabel
    });
  };

  const handleConfirmCancel = async () => {
    if (!modalState.bookingId) return;
    setActionLoading(true);
    try {
      const token = await user?.getIdToken();
      const res = await fetch(`${API_URL}/api/bookings/${modalState.bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to cancel");

      setBookings((prev) => prev.filter((b) => b.id !== modalState.bookingId));
      setModalState({
        isOpen: true,
        type: "SUCCESS",
        title: "Session Cancelled",
        message: "Your booking has been successfully cancelled.",
      });
    } catch (err) {
      setModalState({
        isOpen: true,
        type: "ERROR",
        title: "Cancellation Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getGoogleCalendarUrl = (booking: Booking) => {
    const formatTime = (d: string) => new Date(d).toISOString().replace(/-|:|\.\d+/g, "");
    const title = "MindSettler Therapy Session";
    const details = `Type: ${booking.type}\nLink: ${booking.meetingLink || "N/A"}`;
    const location = booking.slot.mode === "ONLINE" ? (booking.meetingLink || "Online") : "MindSettler Studio";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatTime(booking.slot.startTime)}/${formatTime(booking.slot.endTime)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const upcomingBookings = bookings
    .filter(b => new Date(b.slot.endTime) >= new Date() && b.status !== "REJECTED")
    .sort((a,b) => new Date(a.slot.startTime).getTime() - new Date(b.slot.startTime).getTime());
  
  const historyBookings = bookings
    .filter(b => new Date(b.slot.endTime) < new Date() || b.status === "REJECTED")
    .sort((a,b) => new Date(b.slot.startTime).getTime() - new Date(a.slot.startTime).getTime());
  
  const displayBookings = activeTab === "UPCOMING" ? upcomingBookings : historyBookings;

  if (loading) return <Loader fullScreen message="Loading your space..." />;

  return (
    <div className="min-h-screen bg-[#F9F6FF] pt-24 pb-12 px-4 sm:px-8 relative">
      
      <AlertModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        actionLabel={modalState.actionLabel}
        onAction={modalState.type === "CONFIRM" ? handleConfirmCancel : closeModal}
        isLoading={actionLoading}
        page="profile" 
      />

      <div className={`max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8 relative z-10 ${modalState.isOpen && modalState.type === 'BLOCKED' ? 'blur-md pointer-events-none opacity-50' : ''}`}>
        
        {/* Sidebar */}
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full lg:w-[350px] flex-shrink-0"
        >
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#3F2965]/5 sticky top-28">
            <div className="flex flex-col items-center text-center relative">
              
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] text-3xl font-bold shadow-sm border border-[#3F2965]/5">
                  {getInitials(dbUser?.name || user?.displayName || "")}
                </div>
              </div>

              {/* Name Info */}
              {isEditing ? (
                  <div className="w-full mb-6 space-y-4">
                     <div>
                       <label className="text-xs font-bold text-[#3F2965]/40 uppercase block text-left mb-1">Full Name</label>
                       <input 
                         className="w-full text-lg font-bold text-[#3F2965] border-b-2 border-[#Dd1764] outline-none pb-1 bg-transparent"
                         value={editName}
                         onChange={(e) => setEditName(e.target.value)}
                         placeholder="Your Name"
                         autoFocus
                       />
                     </div>
                  </div>
              ) : (
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#3F2965]">{dbUser?.name || "Welcome"}</h2>
                    <p className="text-sm text-[#3F2965]/60 mt-1 font-medium">{dbUser?.email}</p>
                  </div>
              )}
              
              <div className="w-full space-y-4">
                {/* Phone Field */}
                <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${!dbUser?.phone && !isEditing ? "bg-amber-50 border-amber-200" : "bg-white border-[#3F2965]/10"}`}>
                   <div className={`p-2 rounded-xl shadow-sm transition-colors ${!dbUser?.phone && !isEditing ? "bg-amber-100 text-amber-600" : "bg-[#F9F6FF] text-[#3F2965]/60"}`}>
                     <Smartphone size={18} />
                   </div>
                   
                   <div className="flex-1 text-left">
                      <p className="text-[10px] uppercase font-bold text-[#3F2965]/40 tracking-wider mb-0.5">Phone Number</p>
                      
                      {isEditing ? (
                             <input 
                               className="w-full bg-transparent border-b-2 border-[#Dd1764] outline-none text-sm font-bold text-[#3F2965] pb-1"
                               value={editPhone}
                               onChange={(e) => setEditPhone(e.target.value)}
                               placeholder="Enter number"
                             />
                      ) : (
                          <p className={`text-sm font-bold ${!dbUser?.phone ? "text-amber-600 italic" : "text-[#3F2965]"}`}>
                             {dbUser?.phone || "Add Phone Number"}
                          </p>
                      )}
                   </div>
                </div>

                {/* Edit Actions */}
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full py-3.5 rounded-xl border border-[#3F2965]/10 text-[#3F2965] font-bold text-sm hover:bg-[#F9F6FF] hover:border-[#3F2965]/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Edit3 size={16} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={() => { setIsEditing(false); setEditName(dbUser?.name || ""); setEditPhone(dbUser?.phone || ""); }}
                            className="flex-1 py-3 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveProfile} 
                            disabled={isSaving}
                            className="flex-1 py-3 rounded-xl bg-[#3F2965] text-white font-bold text-sm hover:bg-[#513681] transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        <div className="flex-1 min-w-0">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <h1 className="text-3xl font-bold text-[#3F2965] self-start sm:self-auto">My Sessions</h1>
              
              <div className="flex p-1 bg-white rounded-full shadow-sm border border-[#3F2965]/5">
                 {["UPCOMING", "HISTORY"].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab as any)}
                     className={`relative px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                       activeTab === tab ? "bg-[#3F2965] text-white shadow-md" : "text-[#3F2965]/50 hover:bg-[#F9F6FF]"
                     }`}
                   >
                     {tab === "UPCOMING" ? "Upcoming" : "History"}
                   </button>
                 ))}
              </div>
           </div>

           {activeTab === "UPCOMING" && upcomingBookings.length > 0 && (
             <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-blue-800 font-medium">
                   <strong>Note:</strong> The "Join Session" button will automatically appear here <strong>10 minutes before</strong> your scheduled start time.
                </p>
             </div>
           )}

           <div className="space-y-4">
             <AnimatePresence mode="popLayout">
               {displayBookings.length === 0 ? (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-[#3F2965]/10 flex flex-col items-center"
                 >
                    <div className="w-20 h-20 bg-[#F9F6FF] rounded-full flex items-center justify-center mb-6 text-[#3F2965]/20">
                      {activeTab === "UPCOMING" ? <Calendar size={40} /> : <History size={40} />}
                    </div>
                    <h3 className="text-xl font-bold text-[#3F2965] mb-2">
                      {activeTab === "UPCOMING" ? "No upcoming sessions" : "No session history"}
                    </h3>
                    <p className="text-[#3F2965]/50 max-w-xs mb-8">
                      {activeTab === "UPCOMING" 
                        ? "You don't have any scheduled therapy sessions at the moment." 
                        : "You haven't completed any sessions yet."}
                    </p>
                    {activeTab === "UPCOMING" && (
                        <button onClick={() => router.push("/book")} className="px-8 py-4 bg-[#3F2965] text-white rounded-2xl font-bold hover:bg-[#513681] transition-all flex items-center gap-2">
                            <Calendar size={18} /> Book Your First Session
                        </button>
                    )}
                 </motion.div>
               ) : (
                 displayBookings.map((booking, i) => {
                    const now = new Date();
                    const startTime = new Date(booking.slot.startTime);
                    const endTime = new Date(booking.slot.endTime);
                    const joinWindowStart = new Date(startTime.getTime() - 10 * 60000); 
                    const isJoinable = now >= joinWindowStart && now <= endTime;
                    const isSessionOver = now > endTime;
                    const isTooEarly = now < joinWindowStart;

                    return (
                      <motion.div 
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#3F2965]/5 hover:shadow-lg hover:border-[#3F2965]/10 transition-all group"
                      > 
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                            
                            <div className="flex-shrink-0 w-full md:w-auto flex flex-row md:flex-col items-stretch justify-between md:justify-center bg-white rounded-2xl border border-[#3F2965]/10 overflow-hidden shadow-sm h-auto">
                                <div className="md:w-full w-auto bg-[#3F2965] py-2 px-6 md:py-1.5 md:px-6 flex items-center justify-center">
                                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">{startTime.toLocaleString('default', { month: 'short' })}</p>
                                </div>
                                <div className="flex-1 p-3 md:p-4 md:py-6 text-center flex flex-col items-center justify-center">
                                    <p className="text-2xl md:text-3xl font-black text-[#3F2965] leading-none">{startTime.getDate()}</p>
                                    <p className="text-[10px] font-bold text-[#3F2965]/40 uppercase mt-1">{startTime.toLocaleString('default', { weekday: 'short' })}</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-xl font-bold text-[#3F2965]">Therapy Session</h3>
                                            {booking.type === "FIRST" && <span className="bg-[#Dd1764]/10 text-[#Dd1764] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">First Time</span>}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#3F2965]/60 font-medium">
                                            <Clock size={14} className="text-[#Dd1764]" />
                                            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div className={`pl-3 pr-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border ${
                                        booking.status === "CONFIRMED" ? "bg-green-50 text-green-700 border-green-100" : 
                                        booking.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-100" : 
                                        "bg-red-50 text-red-700 border-red-100"
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${
                                            booking.status === "CONFIRMED" ? "bg-green-500" : 
                                            booking.status === "PENDING" ? "bg-amber-500 animate-pulse" : 
                                            "bg-red-500"
                                        }`} />
                                        {booking.status}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9F6FF] border border-[#3F2965]/5 text-xs font-bold text-[#3F2965]">
                                            <MapPin size={14} className="text-[#3F2965]/40" /> {booking.slot.mode}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9F6FF] border border-[#3F2965]/5 text-xs font-bold text-[#3F2965]">
                                            <BrainCircuit size={14} className="text-[#3F2965]/40" /> {booking.therapyType || "General"}
                                        </div>

                                        {/* ✅ ADDED: Payment Type Display */}
                                        {booking.paymentType && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9F6FF] border border-[#3F2965]/5 text-xs font-bold text-[#3F2965]">
                                                <Banknote size={14} className="text-[#3F2965]/40" /> {booking.paymentType}
                                            </div>
                                        )}
                                    </div>

                                    {/* NEW: Cash/Offline Payment Note in Card */}
                                    {booking.slot.mode === "OFFLINE" && (
                                        <div className="flex items-start gap-2 text-[10px] text-[#3F2965]/60 font-medium bg-[#F9F6FF] p-2 rounded-lg border border-[#3F2965]/5">
                                            <Banknote size={12} className="mt-0.5 shrink-0 text-[#3F2965]/40" />
                                            <span>
                                                Note: Cash payment is available for this session (only available in offline mode).
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full md:w-[180px] flex flex-col gap-3">
                                {booking.status === "CONFIRMED" && booking.slot.mode === "ONLINE" && !isSessionOver && (
                                    <>
                                        {isJoinable ? (
                                            <a 
                                                href={booking.meetingLink} target="_blank" rel="noopener noreferrer"
                                                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg text-white ${
                                                    booking.meetingLink 
                                                    ? "bg-[#Dd1764] hover:bg-[#b01350] shadow-[#Dd1764]/30 animate-pulse" 
                                                    : "bg-gray-300 cursor-not-allowed"
                                                }`}
                                            >
                                                <Video size={16} /> Join Session
                                            </a>
                                        ) : isTooEarly && (
                                            <div className="w-full py-3 bg-[#F9F6FF] border border-[#3F2965]/10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#3F2965]/40 cursor-default">
                                                <Clock size={14} /> Starts soon
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="flex gap-2">
                                    {booking.status === "CONFIRMED" && !isSessionOver && (
                                        <a href={getGoogleCalendarUrl(booking)} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-[#3F2965] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#513681] transition-all shadow-sm" title="Add to Calendar">
                                            <Calendar size={14} /> <span className="hidden xl:inline">Calendar</span>
                                        </a>
                                    )}
                                    
                                    {!isSessionOver && booking.status !== "REJECTED" && (
                                        <button onClick={() => initiateCancel(booking)} className="flex-1 py-2.5 bg-white border border-red-100 text-red-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all" title="Cancel">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                      </motion.div>
                    );
                 })
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}