"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import GoogleButton from "./GoogleButton";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const token = await cred.user.getIdToken();

      // 🔥 Always sync on login
      await fetch("http://localhost:5000/api/auth/sync-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-[#3F2965] text-center">
        Welcome back
      </h2>
      <p className="text-sm text-[#3F2965]/70 text-center mt-1">
        Continue your MindSettler journey
      </p>

      {error && (
        <div className="mt-4 text-sm text-[#Dd1764] bg-[#Dd1764]/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-[#3F2965]">Email</label>
          <input
            type="email"
            className="w-full mt-1 px-4 py-2.5 border border-[#3F2965]/20 rounded-lg focus:ring-2 focus:ring-[#Dd1764]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#3F2965]">Password</label>
          <input
            type="password"
            className="w-full mt-1 px-4 py-2.5 border border-[#3F2965]/20 rounded-lg focus:ring-2 focus:ring-[#Dd1764]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2.5 rounded-full bg-[#Dd1764] text-white font-bold hover:shadow-lg disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-[#3F2965]/20" />
        <span className="text-xs text-[#3F2965]/50">OR</span>
        <div className="flex-1 h-px bg-[#3F2965]/20" />
      </div>

      <GoogleButton />
    </div>
  );
}
