"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { API_URL } from "@/app/lib/api";
import { 
  Calendar, Clock, MapPin, Phone, User as UserIcon, 
  AlertCircle, XCircle, ExternalLink 
} from "lucide-react";
import AlertModal from "../components/common/AlertModal";
import toast from "react-hot-toast";

// --- Types ---
type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  type: "FIRST" | "FOLLOW_UP";
  reason?: string;
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await fetchProfileData(currentUser);
      } else {
        setLoading(false);
        // Trigger Auth Modal immediately if not logged in
        setModalState({ isOpen: true, type: "AUTH" });
      }
    });
    return () => unsub();
  }, []);

  const fetchProfileData = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();
      const userRes = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setDbUser(userData);

      const bookingRes = await fetch(`${API_URL}/api/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookingData = await bookingRes.json();
      setBookings(bookingData);
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
      // ✅ Toast for small success
      toast.success("Phone number updated!");
      setNewPhone("");
    } catch (err) {
     // ❌ Toast for error
      toast.error("Failed to update phone.");
    } finally {
      setUpdatingPhone(false);
    }
  };

  // --- MODAL HANDLERS ---

  // 1. Handle Closing (Redirects if it was an Auth check)
  const closeModal = () => {
    if (modalState.type === "AUTH") {
      router.push("/"); // 🚀 Redirect unlogged users to Home
    }
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  // 2. Trigger Confirmation
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

  // 3. Perform Cancellation
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
      
      // Show Success Modal
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
    const details = `Type: ${booking.type} | Reason: ${booking.reason || "N/A"}`;
    const location = booking.slot.mode === "ONLINE" ? "Online (Link will be shared)" : "MindSettler Studio";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  };

  // --- LOADING VIEW ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="animate-spin w-12 h-12 border-[5px] border-[#F9F6FF] border-t-[#Dd1764] rounded-full" />
        <p className="text-[#3F2965] font-bold text-lg animate-pulse">
          Loading your space...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 relative">
      
      <AlertModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        actionLabel={modalState.actionLabel}
        // 🚀 FIX: Only run cancel logic if in CONFIRM mode. Otherwise, just close.
        onAction={modalState.type === "CONFIRM" ? handleConfirmCancel : closeModal}
        isLoading={actionLoading}
        page="profile" 
      />

      <div className={`transition-all duration-500 ${!user ? 'blur-md pointer-events-none opacity-50 select-none grayscale-[0.5]' : ''}`}>
        
        {/* Inner Container */}
        <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-[2.5rem] p-6 md:p-12 shadow-sm min-h-[80vh] flex flex-col md:flex-row gap-8 text-[#3F2965]">
        
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#3F2965]/5 h-fit sticky top-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-24 h-24 bg-[#3F2965]/10 rounded-full flex items-center justify-center text-[#3F2965] mb-4">
                  <UserIcon size={40} />
                </div>
                <h1 className="text-2xl font-bold text-[#3F2965]">
                  {dbUser?.name || user?.displayName || "Welcome"}
                </h1>
                <p className="text-sm text-[#3F2965]/60 mt-1">{dbUser?.email || user?.email}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-[#3F2965]">
                  <div className="bg-[#F9F6FF] p-3 rounded-xl">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#3F2965]/50 font-bold uppercase tracking-wider">Phone</p>
                    <p className="font-medium">{dbUser?.phone || "Not set"}</p>
                  </div>
                </div>

                {!dbUser?.phone && (
                  <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <AlertCircle size={16} />
                      <p className="text-xs font-bold">Action Required</p>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter phone..."
                        className="w-full px-3 py-1.5 text-xs border rounded-lg"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                      />
                      <button 
                        onClick={handleUpdatePhone}
                        disabled={updatingPhone}
                        className="px-3 py-1.5 bg-yellow-600 text-white text-xs font-bold rounded-lg hover:bg-yellow-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT: Bookings */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-3xl shadow-sm border border-[#3F2965]/5 p-8 min-h-[500px]">
              <h2 className="text-xl font-bold text-[#3F2965] mb-6 flex items-center gap-3">
                <Calendar className="text-[#Dd1764]" />
                Your Sessions
              </h2>

              {bookings.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#3F2965]/10 rounded-2xl">
                  <p className="text-[#3F2965]/40 font-medium">No sessions booked yet.</p>
                  <button 
                    onClick={() => router.push('/book')}
                    className="mt-4 px-6 py-2 bg-[#F9F6FF] text-[#3F2965] font-bold rounded-full hover:bg-[#3F2965]/5 transition"
                  >
                    Book a Session
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {bookings.map((b) => {
                    const date = new Date(b.slot.date).toDateString();
                    const start = new Date(b.slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    const end = new Date(b.slot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    const isPast = new Date(b.slot.startTime) < new Date();
                    const statusStyles = {
                      CONFIRMED: "bg-green-100 text-green-700 border-green-200",
                      REJECTED: "bg-red-50 text-red-600 border-red-100",
                      PENDING: "bg-yellow-50 text-yellow-700 border-yellow-100",
                    };

                    return (
                      <div key={b.id} className="group border border-[#3F2965]/10 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          <div className="flex items-start gap-4">
                            <div className="bg-[#F9F6FF] p-4 rounded-2xl group-hover:bg-[#3F2965] group-hover:text-white transition-colors duration-300">
                              <Calendar size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-[#3F2965] text-lg">{date}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-[#3F2965]/70">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} /> {start} - {end}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={14} /> {b.slot.mode}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-[#Dd1764] mt-2 uppercase tracking-wide">
                                {b.type === "FIRST" ? "First Session" : "Follow-up"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusStyles[b.status]}`}>
                              {b.status}
                            </span>

                            <div className="flex items-center gap-3">
                              {!isPast && b.status === "CONFIRMED" && (
                                <a
                                  href={getGoogleCalendarUrl(b)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                                >
                                  <ExternalLink size={12} /> Google Cal
                                </a>
                              )}

                              {!isPast && (
                                <button
                                  onClick={() => initiateCancel(b)}
                                  className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                                >
                                  <XCircle size={12} /> Cancel
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}