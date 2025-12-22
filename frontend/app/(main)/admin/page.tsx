"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Filter, 
  AlertCircle,
  MapPin,
  LayoutDashboard
} from "lucide-react";

type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  type: "FIRST" | "FOLLOW_UP";
  reason?: string;
  user: {
    name?: string;
    email: string;
    phone?: string;
  };
  slot: {
    date: string;
    startTime: string;
    endTime: string;
    mode: "ONLINE" | "OFFLINE";
  };
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "REJECTED">("ALL");

  const fetchBookings = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch bookings");
      
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace("/login"); return; }
      const token = await user.getIdToken();
      await fetchBookings(token);
    });
    return () => unsub();
  }, [router]);

  const updateStatus = async (id: string, status: "CONFIRMED" | "REJECTED") => {
    const token = await auth.currentUser?.getIdToken();
    // Optimistic UI update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

    try {
      await fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      // Refresh to ensure sync
      const refreshedToken = await auth.currentUser?.getIdToken();
      if(refreshedToken) await fetchBookings(refreshedToken);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Stats Calculation
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    confirmed: bookings.filter(b => b.status === "CONFIRMED").length,
  };

  // Filter Logic
  const filteredBookings = bookings.filter(b => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  // 🔒 ACCESS DENIED UI
  if (error === "Admin access only") {
    return (
      <div className="min-h-screen bg-[#F9F6FF] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-[#Dd1764] mb-2">Access Denied</h1>
          <p className="text-[#3F2965]/70 mb-6">Administrators only.</p>
          <button onClick={() => router.push("/")} className="px-6 py-3 bg-[#3F2965] text-white rounded-full font-bold">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6FF] px-6 md:px-12 pt-24 pb-12 text-[#3F2965]">
      
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="text-[#Dd1764]" />
            Admin Dashboard
          </h1>
          <p className="text-[#3F2965]/60 mt-1">Manage appointments and schedules</p>
        </div>
        
        <button
          onClick={() => router.push("/admin/slots")}
          className="px-6 py-3 bg-[#3F2965] text-white rounded-full font-bold shadow-lg hover:shadow-[#3F2965]/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Calendar size={18} />
          Manage Slots
        </button>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Total Requests" value={stats.total} color="bg-white" textColor="text-[#3F2965]" />
        <StatCard label="Pending Action" value={stats.pending} color="bg-yellow-50" textColor="text-yellow-700" />
        <StatCard label="Confirmed Sessions" value={stats.confirmed} color="bg-green-50" textColor="text-green-700" />
      </div>

      {/* 3. FILTERS */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[#3F2965]/10 pb-4">
        {["ALL", "PENDING", "CONFIRMED", "REJECTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === f 
                ? "bg-[#3F2965] text-white shadow-md" 
                : "bg-white text-[#3F2965]/60 hover:bg-white hover:text-[#3F2965]"
            }`}
          >
            {f === "ALL" ? "All Bookings" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* 4. BOOKINGS GRID */}
      {loading ? (
        <div className="text-center py-20 text-[#3F2965]/50 animate-pulse">Loading dashboard data...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#3F2965]/20">
          <p className="text-[#3F2965]/40">No bookings found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredBookings.map((b) => (
            <BookingCard key={b.id} booking={b} onUpdate={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- SUB-COMPONENTS ---------------- //

function StatCard({ label, value, color, textColor }: { label: string, value: number, color: string, textColor: string }) {
  return (
    <div className={`${color} p-6 rounded-2xl border border-black/5 shadow-sm`}>
      <p className="text-sm font-bold opacity-60 mb-1">{label}</p>
      <p className={`text-4xl font-extrabold ${textColor}`}>{value}</p>
    </div>
  );
}

function BookingCard({ booking, onUpdate }: { booking: Booking, onUpdate: (id: string, status: any) => void }) {
  const date = new Date(booking.slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = `${new Date(booking.slot.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - ${new Date(booking.slot.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#3F2965]/5 hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
      
      {/* Date Badge */}
      <div className="flex flex-col items-center justify-center bg-[#F9F6FF] text-[#3F2965] rounded-xl p-4 min-w-[100px] text-center border border-[#3F2965]/5">
        <span className="text-xs font-bold uppercase opacity-60">Session</span>
        <span className="text-xl font-bold mt-1">{date}</span>
        <span className="text-xs font-medium mt-1">{time}</span>
        <span className={`mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${booking.slot.mode === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {booking.slot.mode}
        </span>
      </div>

      {/* Info & Actions */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* User Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#3F2965]">{booking.user.name || "Unknown User"}</h3>
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-sm text-[#3F2965]/60 flex items-center gap-2">
                  <Mail size={14} /> {booking.user.email}
                </p>
                {booking.user.phone && (
                  <p className="text-sm text-[#3F2965]/60 flex items-center gap-2">
                    <Phone size={14} /> {booking.user.phone}
                  </p>
                )}
              </div>
            </div>
            
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
              booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
              'bg-yellow-100 text-yellow-700'
            }`}>
              {booking.status}
            </span>
          </div>

          {/* Reason / Type */}
          <div className="bg-[#F9F6FF] p-3 rounded-lg border border-[#3F2965]/5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold bg-[#3F2965] text-white px-2 py-0.5 rounded">
                {booking.type === "FIRST" ? "First Session" : "Follow-up"}
              </span>
            </div>
            {booking.reason ? (
              <p className="text-sm text-[#3F2965]/80 italic">"{booking.reason}"</p>
            ) : (
              <p className="text-sm text-[#3F2965]/40 italic">No specific reason provided.</p>
            )}
          </div>
        </div>

        {/* Action Buttons (Only for Pending) */}
        {booking.status === "PENDING" && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-[#3F2965]/5">
            <button
              onClick={() => onUpdate(booking.id, "CONFIRMED")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} /> Confirm
            </button>
            <button
              onClick={() => onUpdate(booking.id, "REJECTED")}
              className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <XCircle size={16} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}