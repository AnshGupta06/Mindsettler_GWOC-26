"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

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

  const fetchBookings = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        // This catches "Admin access only" from the backend
        throw new Error(data.error || "Failed to fetch bookings");
      }

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response");
      }

      setBookings(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      const token = await user.getIdToken();
      await fetchBookings(token);
      // Note: We don't set loading(false) here because fetchBookings does it
    });

    return () => unsub();
  }, [router]);

  const updateStatus = async (id: string, status: "CONFIRMED" | "REJECTED") => {
    const token = await auth.currentUser?.getIdToken();

    await fetch(`http://localhost:5000/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    await fetchBookings(token!);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#3F2965]">
        Loading admin dashboard...
      </div>
    );
  }

  // 🔥 NEW: Check for Access Denied specifically
  if (error === "Admin access only") {
    return (
      <div className="min-h-screen bg-[#F9F6FF] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-[#Dd1764] mb-2">Access Denied</h1>
          <p className="text-[#3F2965]/70 mb-6">
            You do not have permission to view this page. This area is for administrators only.
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-3 bg-[#3F2965] text-white rounded-full font-bold hover:bg-[#3F2965]/90 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6FF] px-4 py-24 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold text-[#3F2965]">Admin – Booking Requests</h1>
  <button
    onClick={() => router.push("/admin/slots")}
    className="px-5 py-2 bg-[#3F2965] text-white rounded-full font-bold text-sm hover:bg-[#3F2965]/90"
  >
    Manage Slots →
  </button>
</div>  

        {/* Generic error display for other issues (like network errors) */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <p className="text-[#3F2965]/60">No bookings yet.</p>
        )}

        <div className="space-y-4">
          {bookings.map((b) => {
            const date = new Date(b.slot.date).toDateString();
            const start = new Date(b.slot.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const end = new Date(b.slot.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={b.id}
                className="border border-[#3F2965]/10 rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#3F2965]">
                      {b.user.name || "User"} • {b.user.email}
                    </p>
                    <p className="text-sm text-[#3F2965]/80">
                      {date} • {start} – {end} • {b.slot.mode}
                    </p>
                    <p className="text-xs text-[#3F2965]/60 mt-1">
                      {b.type === "FIRST" ? "First Session" : "Follow-up"}
                      {b.reason && ` • ${b.reason}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : b.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status}
                    </span>

                    {b.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(b.id, "CONFIRMED")}
                          className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, "REJECTED")}
                          className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}