"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import GoogleButton from "./GoogleButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State for errors and success messages
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();

      await fetch("http://localhost:5000/api/auth/sync-user", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setInfo("");

    if (!email) {
      setError("Please enter your email address first to reset your password.");
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("Password reset link sent! Check your inbox.");
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else {
        setError("Failed to send reset email. Try again later.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-lg border border-white/50 rounded-3xl shadow-2xl p-8 sm:p-10 relative">
      
      {/* 🏠 Back to Home */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 text-gray-400 hover:text-[#3F2965] transition-colors p-2 hover:bg-purple-50 rounded-full"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="text-center mb-8 mt-4">
        <h2 className="text-3xl font-bold text-[#3F2965]">Welcome Back</h2>
        <p className="text-[#3F2965]/60 mt-2">
          Continue your journey to mindfulness
        </p>
      </div>

      {/* 🔴 Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
          ⚠️ {error}
        </div>
      )}

      {/* 🟢 Success Message (For Password Reset) */}
      {info && (
        <div className="mb-6 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-xl border border-green-100 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" /> {info}
        </div>
      )}

      <div className="space-y-5">
        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#3F2965]/40 group-focus-within:text-[#Dd1764] transition-colors" />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/20 focus:border-[#Dd1764] transition-all outline-none text-[#3F2965] placeholder:text-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#3F2965]/40 group-focus-within:text-[#Dd1764] transition-colors" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/20 focus:border-[#Dd1764] transition-all outline-none text-[#3F2965] placeholder:text-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 🔄 Forgot Password Button */}
        <div className="flex justify-end">
          <button 
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="text-sm font-medium text-[#3F2965]/60 hover:text-[#Dd1764] transition-colors flex items-center gap-2"
          >
            {resetLoading && <Loader2 className="w-3 h-3 animate-spin" />}
            {resetLoading ? "Sending Link..." : "Forgot Password?"}
          </button>
        </div>

        <button
  onClick={handleLogin}
  disabled={loading}
  className="w-full relative py-4 rounded-xl bg-[#Dd1764] text-white font-bold text-lg tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
>  <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
  <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
  <span className="relative z-10 flex items-center justify-center gap-2">
    {loading ? (
      <>
        <Loader2 className="w-5 h-5 animate-spin" /> Signing In...
      </>
    ) : (
      "Sign In"
    )}
  </span>
</button>
      </div>

      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Or continue with
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <GoogleButton />
    </div>
  );
}