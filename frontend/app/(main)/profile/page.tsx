"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Calendar, Clock, MapPin, Phone, User as UserIcon, AlertCircle } from "lucide-react";

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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);
      await fetchProfileData(currentUser);
    });
    return () => unsub();
  }, [router]);

  const fetchProfileData = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken();

      // 1. Fetch User Details (for phone check)
      const userRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setDbUser(userData);

      // 2. Fetch Bookings
      const bookingRes = await fetch("http://localhost:5000/api/bookings/my", {
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
      
      await fetch("http://localhost:5000/api/auth/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: newPhone }),
      });

      // Refresh data
      if (user) await fetchProfileData(user);
      setNewPhone("");
    } catch (err) {
      console.error(err);
      alert("Failed to update phone");
    } finally {
      setUpdatingPhone(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#3F2965] bg-[#F9F6FF]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-[#3F2965]/20 rounded-full mb-4"></div>
          <p className="font-medium">Loading your space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6FF] pt-24 pb-12 px-6 md:px-12 flex flex-col md:flex-row gap-8">
      
      {/* LEFT SIDEBAR: User Info */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#3F2965]/5 h-fit sticky top-28">
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 bg-[#3F2965]/10 rounded-full flex items-center justify-center text-[#3F2965] mb-4">
              <UserIcon size={40} />
            </div>
            <h1 className="text-2xl font-bold text-[#3F2965]">
              {dbUser?.name || "Welcome"}
            </h1>
            <p className="text-sm text-[#3F2965]/60 mt-1">{dbUser?.email}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-[#3F2965]">
              <div className="bg-[#F9F6FF] p-3 rounded-xl">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-xs text-[#3F2965]/50 font-bold uppercase tracking-wider">Phone</p>
                <p className="font-medium">
                  {dbUser?.phone || "Not set"}
                </p>
              </div>
            </div>

            {/* Missing Phone Warning */}
            {!dbUser?.phone && (
              <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertCircle size={16} />
                  <p className="text-xs font-bold">Action Required</p>
                </div>
                <p className="text-xs text-yellow-700 mb-3 leading-relaxed">
                  Please add your phone number so counselors can reach you.
                </p>
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

                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusStyles[b.status]}`}>
                          {b.status}
                        </span>
                        {b.status === "PENDING" && (
                          <span className="text-xs text-[#3F2965]/40">Awaiting approval</span>
                        )}
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
  );
}