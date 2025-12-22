"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  mode: "ONLINE" | "OFFLINE";
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
      } catch (err) {
        console.error(err);
        setError("Failed to load slots.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleSubmit = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      // 🔥 Always ensure sync
      await fetch("http://localhost:5000/api/auth/sync-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        }),
      });

      if (!res.ok) {
  const errData = await res.json();
  throw new Error(errData.error || "Booking failed");
}


      // ✅ Immediately remove booked slot from UI
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
    <div className="min-h-screen bg-[#F9F6FF] px-4 py-24 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#3F2965] text-center">
          Book a Session
        </h1>
        <p className="text-sm text-[#3F2965]/70 text-center mt-2">
          Choose a calm moment for yourself 🌿
        </p>

        {error && (
          <div className="mt-5 text-sm text-[#Dd1764] bg-[#Dd1764]/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Slots */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[#3F2965] mb-3">
            Available Time Slots
          </h2>

          {loading && (
            <p className="text-center text-[#3F2965]/60">
              Loading slots...
            </p>
          )}

          {!loading && slots.length === 0 && (
            <p className="text-center text-[#3F2965]/60">
              No slots available right now. Please check back later.
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {slots.map((slot) => {
              const start = new Date(slot.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const end = new Date(slot.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const date = new Date(slot.date).toDateString();

              const selected = selectedSlot?.id === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-5 rounded-2xl border text-left transition ${
                    selected
                      ? "border-[#Dd1764] bg-[#Dd1764]/10 shadow-md"
                      : "border-[#3F2965]/20 hover:bg-[#F9F6FF]"
                  }`}
                >
                  <p className="font-semibold text-[#3F2965]">{date}</p>
                  <p className="text-sm text-[#3F2965]/80 mt-1">
                    {start} – {end}
                  </p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full ${
                      slot.mode === "ONLINE"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {slot.mode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Type */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-[#3F2965] mb-2">
            Session Type
          </p>
          <div className="flex gap-3">
            {["FIRST", "FOLLOW_UP"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t as any)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                  type === t
                    ? "bg-[#3F2965] text-white"
                    : "border border-[#3F2965]/30 text-[#3F2965] hover:bg-[#F9F6FF]"
                }`}
              >
                {t === "FIRST" ? "First Session" : "Follow-up"}
              </button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="mt-8">
          <label className="text-sm font-semibold text-[#3F2965]">
            Reason (optional)
          </label>
          <textarea
            className="w-full mt-2 px-4 py-3 border border-[#3F2965]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Share anything you'd like the counselor to know..."
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !selectedSlot}
          className="w-full mt-10 py-3 rounded-full bg-[#Dd1764] text-white font-bold tracking-wide transition hover:shadow-lg hover:shadow-[#3F2965]/30 disabled:opacity-60"
        >
          {submitting ? "Requesting..." : "Request Booking"}
        </button>
      </div>
    </div>
  );
}
