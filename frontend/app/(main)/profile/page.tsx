"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { API_URL } from "@/app/lib/api";
import { 
  Calendar, Clock, MapPin, Phone, User as UserIcon, 
  AlertCircle, XCircle, ExternalLink, BrainCircuit, Video, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AlertModal from "../components/common/AlertModal";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";

// --- Types ---
type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  type: "FIRST" | "FOLLOW_UP";
  therapyType?: string;
  reason?: string;
  meetingLink?: string;
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
  
  // Phone Update State
  const [newPhone, setNewPhone] = useState("");
  const [updatingPhone, setUpdatingPhone] = useState(false);

  // --- MODAL STATE ---
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "AUTH" | "CONFIRM" | "SUCCESS" | "ERROR";
    title?: string;
    message?: string;
    actionLabel?: string;
    bookingId?: string; 
  }>({
    isOpen: false,
    type: "AUTH",
  });
  
  const [actionLoading, setActionLoading] = useState(false);

  // Force re-render every minute to update "Join Button" availability
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

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
      setDbUser(userData);

      const bookingData = await bookingRes.json();
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone) return;
    setUpdatingPhone(true);
    try {
      const token = await user?.getIdToken();
      await fetch(`${API_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: newPhone }),
      });
      if (user) await fetchProfileData(user);
      toast.success("Phone number updated!");
      setNewPhone("");
    } catch (err) {
      toast.error("Failed to update phone.");
    } finally {
      setUpdatingPhone(false);
    }
  };

  const closeModal = () => {
    if (modalState.type === "AUTH") {
      router.push("/"); 
    }
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const initiateCancel = (booking: Booking) => {
    const isConfirmed = booking.status === "CONFIRMED";
    
    setModalState({
      isOpen: true,
      type: "CONFIRM",
      bookingId: booking.id,
      title: isConfirmed ? "Cancel Confirmed Session?" : "Cancel Session?",
      message: isConfirmed 
        ? "⚠️ Since this session is confirmed, cancelling will initiate a manual refund request.\n\nOur team will process the refund within 24-48 hours. Do you want to proceed?" 
        : "Are you sure you want to cancel this session? This action cannot be undone.",
      actionLabel: isConfirmed ? "Yes, Request Refund" : "Yes, Cancel Session"
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
        message: "Your booking has been successfully cancelled. If a refund is due, our team has been notified.",
      });

    } catch (err) {
      console.error(err);
      setModalState({
        isOpen: true,
        type: "ERROR",
        title: "Cancellation Failed",
        message: "Something went wrong while cancelling. Please try again or contact support.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getGoogleCalendarUrl = (booking: Booking) => {
    const formatTime = (dateString: string) => {
      return new Date(dateString).toISOString().replace(/-|:|\.\d+/g, "");
    };
    
    const start = formatTime(booking.slot.startTime);
    const end = formatTime(booking.slot.endTime);
    const title = "MindSettler Therapy Session";
    const details = `Type: ${booking.type}\nMode: ${booking.slot.mode}\nLink: ${booking.meetingLink || "N/A"}\nReason: ${booking.reason || "N/A"}`;
    const location = booking.slot.mode === "ONLINE" ? (booking.meetingLink || "Online") : "MindSettler Studio";
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  if (loading) {
    return <Loader fullScreen={true} message={"Loading your space..."} />; 
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-5%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#Dd1764]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-5%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-[#3F2965]/5 rounded-full blur-3xl" />
      </div>

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

      <div className={`transition-all duration-500 relative z-10 ${!user ? 'blur-md pointer-events-none opacity-50 select-none grayscale-[0.5]' : ''}`}>
        
        <div className="max-w-[1440px] mx-auto bg-[#F9F6FF]/60 backdrop-blur-xl border border-[#3F2965]/5 rounded-[2.5rem] p-6 md:p-12 shadow-sm min-h-[80vh] flex flex-col md:flex-row gap-8 lg:gap-12 text-[#3F2965] relative overflow-hidden">
        
          <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

          {/* LEFT SIDEBAR */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6 relative z-10"
          >
            <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-lg shadow-[#3F2965]/5 border border-[#3F2965]/10 h-fit md:sticky md:top-8">
              <div className="flex flex-col items-center text-center mb-6 md:mb-8">
                <div className="w-24 h-24 bg-[#3F2965]/10 rounded-full flex items-center justify-center text-[#3F2965] mb-4 shadow-inner">
                  <UserIcon size={40} />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-[#3F2965] break-words w-full">
                  {dbUser?.name || user?.displayName || "Welcome"}
                </h1>
                <p className="text-sm text-[#3F2965]/60 mt-1 truncate w-full">{dbUser?.email || user?.email}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-[#3F2965]">
                  <div className="bg-[#F9F6FF] p-3 rounded-xl shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-[#3F2965]/50 font-bold uppercase tracking-wider">Phone</p>
                    <p className="font-medium truncate">{dbUser?.phone || "Not set"}</p>
                  </div>
                </div>

                {!dbUser?.phone && (
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-amber-800 mb-2">
                      <AlertCircle size={16} />
                      <p className="text-xs font-bold">Action Required</p>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Phone number"
                        className="w-full px-3 py-1.5 text-xs border rounded-lg bg-white"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                      />
                      <button 
                        onClick={handleUpdatePhone}
                        disabled={updatingPhone}
                        className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 shrink-0"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT CONTENT */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="w-full md:w-2/3 lg:w-3/4 relative z-10"
          >
            <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-[#3F2965]/5 p-6 md:p-8 min-h-[500px]">
              <h2 className="text-xl md:text-2xl font-bold text-[#3F2965] mb-6 md:mb-8 flex items-center gap-3">
                <span className="p-2 bg-[#Dd1764]/10 rounded-xl text-[#Dd1764] shrink-0">
                    <Calendar size={24} />
                </span>
                Your Sessions
              </h2>

              {bookings.length === 0 ? (
                <div className="bg-white/50 rounded-3xl p-8 md:p-12 text-center border-2 border-dashed border-[#3F2965]/10 flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 bg-[#3F2965]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={28} className="text-[#3F2965]/40" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#3F2965] mb-2">No sessions yet</h3>
                  <button 
                    onClick={() => router.push("/book")}
                    className="bg-[#3F2965] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#513681] transition-all"
                  >
                    Book Your First Session
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  <AnimatePresence>
                  {bookings.map((booking, i) => {
                    // Logic: Button visible 10 mins before start until end time
                    const now = new Date();
                    const startTime = new Date(booking.slot.startTime);
                    const endTime = new Date(booking.slot.endTime);
                    const joinWindowStart = new Date(startTime.getTime() - 10 * 60000); // 10 mins before
                    
                    const isJoinable = now >= joinWindowStart && now <= endTime;
                    const isSessionOver = now > endTime;
                    const isTooEarly = now < joinWindowStart;

                    return (
                      <motion.div 
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-3xl p-5 md:p-6 border border-[#3F2965]/10 hover:shadow-lg transition-all"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          
                          {/* Info Section */}
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-lg font-bold text-[#3F2965]">
                                    {new Date(booking.slot.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border ${
                                    booking.status === "CONFIRMED" ? "bg-green-50 text-green-700 border-green-100" : 
                                    booking.status === "PENDING" ? "bg-amber-50 text-amber-700 border-amber-100" : 
                                    "bg-red-50 text-red-700 border-red-100"
                                }`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 text-sm text-[#3F2965]/70">
                                <span className="flex items-center gap-1.5 bg-[#F9F6FF] px-2.5 py-1 rounded-lg">
                                    <Clock size={14} className="text-[#Dd1764]" /> 
                                    {startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <span className="flex items-center gap-1.5 bg-[#F9F6FF] px-2.5 py-1 rounded-lg">
                                    <MapPin size={14} className="text-[#Dd1764]" /> 
                                    {booking.slot.mode === "ONLINE" ? "Online" : "Studio"}
                                </span>
                                {booking.therapyType && (
                                    <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg font-bold text-xs border border-purple-100">
                                        <BrainCircuit size={12} /> {booking.therapyType}
                                    </span>
                                )}
                            </div>

                            {/* ✨ SMART JOIN BUTTON LOGIC */}
                            {booking.status === "CONFIRMED" && booking.slot.mode === "ONLINE" && !isSessionOver && (
                                <div className="mt-2">
                                    {isJoinable ? (
                                        <a 
                                            href={booking.meetingLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center justify-center gap-2 px-5 py-3 w-full md:w-auto text-white rounded-xl font-bold text-sm shadow-md transition-all ${
                                                booking.meetingLink 
                                                ? "bg-[#Dd1764] hover:bg-[#b01350] shadow-[#Dd1764]/20 animate-pulse" 
                                                : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                            onClick={(e) => !booking.meetingLink && e.preventDefault()}
                                        >
                                            <Video size={18} /> 
                                            {booking.meetingLink ? "Join Video Session" : "Link Pending..."}
                                        </a>
                                    ) : isTooEarly ? (
                                        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F9F6FF] border border-[#3F2965]/10 rounded-xl text-xs text-[#3F2965]/60 font-medium">
                                            <Info size={14} />
                                            Link active 10 mins before session
                                        </div>
                                    ) : null}
                                </div>
                            )}

                            {booking.reason && (
                              <div className="pt-3 mt-1 border-t border-[#3F2965]/5">
                                <p className="text-xs font-bold text-[#3F2965]/40 uppercase tracking-widest mb-1">Your Note</p>
                                <p className="text-sm text-[#3F2965] italic">"{booking.reason}"</p>
                              </div>
                            )}
                          </div>

                          {/* Actions Section */}
                          <div className="flex flex-row lg:flex-col gap-3 justify-end border-t lg:border-t-0 lg:border-l border-[#3F2965]/5 pt-4 lg:pt-0 lg:pl-6">
                            {!isSessionOver && booking.status === "CONFIRMED" && (
                              <a
                                href={getGoogleCalendarUrl(booking)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3F2965] text-white rounded-xl hover:bg-[#513681] transition-colors font-bold text-xs shadow-sm hover:shadow-md"
                              >
                                <ExternalLink size={14} />
                                <span className="hidden sm:inline lg:inline">Add to Calendar</span>
                                <span className="sm:hidden lg:hidden">Calendar</span>
                              </a>
                            )}
                            
                            {!isSessionOver && (
                              <button
                                onClick={() => initiateCancel(booking)}
                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-100 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-bold text-xs"
                              >
                                <XCircle size={14} />
                                <span className="hidden sm:inline lg:inline">Cancel Session</span>
                                <span className="sm:hidden lg:hidden">Cancel</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}