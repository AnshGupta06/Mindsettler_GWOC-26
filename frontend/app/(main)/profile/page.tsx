"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

type Profile = {
  name: string;
  email: string;
  phone: string | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#3F2965]">
        Loading profile...
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#F9F6FF] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-[#3F2965] text-center">
          Your Profile
        </h1>
        <p className="text-sm text-[#3F2965]/70 text-center mt-1">
          Your safe space in MindSettler
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Name" value={profile.name || "—"} />
          <Field label="Email" value={profile.email} />
          <Field label="Phone" value={profile.phone || "Not provided"} />
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={async () => {
              await signOut(auth);
              router.push("/login");
            }}
            className="flex-1 py-2.5 rounded-full border border-[#3F2965]/30 text-[#3F2965] font-bold hover:bg-[#F9F6FF] transition"
          >
            Logout
          </button>

          <button
            onClick={() => alert("Edit profile coming soon 👀")}
            className="flex-1 py-2.5 rounded-full bg-[#Dd1764] text-white font-bold hover:shadow-lg hover:shadow-[#3F2965]/30 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-[#3F2965]/60">{label}</p>
      <p className="mt-1 font-semibold text-[#3F2965]">{value}</p>
    </div>
  );
}
