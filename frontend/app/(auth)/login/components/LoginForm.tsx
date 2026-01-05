"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import GoogleButton from "./GoogleButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast"; 

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Signing you in...");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const token = await user.getIdToken();

      // Sync user to backend
      await fetch(`${API_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email }),
      });

      toast.success("Welcome back!", { id: toastId });

      // 🛡️ ADMIN CHECK (From ENV)
      const allowedAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
        .split(",")
        .map((e) => e.trim().toLowerCase());

      if (user.email && allowedAdmins.includes(user.email.toLowerCase())) {
        router.push("/admin"); 
      } else {
        router.push("/profile");
      }

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Login failed", { id: toastId });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 🏠 Back to Home - Positioned Absolute Top Left */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-sm font-bold text-[#3F2965]/40 hover:text-[#3F2965] transition-colors z-20"
      >
         <ArrowLeft size={16} /> Back to Home
      </Link>

      {/* Header */}
      <div className="text-center mb-8 mt-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F9F6FF] text-[#Dd1764] mb-4 shadow-inner">
          <Lock size={28} />
        </div>
        <h1 className="text-3xl font-bold text-[#3F2965]">Welcome Back</h1>
        <p className="text-[#3F2965]/60 mt-2 text-sm">Sign in to continue your journey</p>
      </div>

      <div className="space-y-5">
        
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#3F2965]/60 uppercase ml-1">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/30 group-focus-within:text-[#Dd1764] transition-colors" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#F9F6FF] border border-[#3F2965]/5 rounded-xl outline-none focus:bg-white focus:border-[#Dd1764]/20 focus:ring-4 focus:ring-[#Dd1764]/5 transition-all font-medium text-[#3F2965]"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-bold text-[#3F2965]/60 uppercase">Password</label>
            <button 
              onClick={handleForgotPassword}
              disabled={resetLoading}
              className="text-xs font-bold text-[#Dd1764] hover:underline disabled:opacity-50"
            >
              {resetLoading ? "Sending..." : "Forgot Password?"}
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/30 group-focus-within:text-[#Dd1764] transition-colors" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#F9F6FF] border border-[#3F2965]/5 rounded-xl outline-none focus:bg-white focus:border-[#Dd1764]/20 focus:ring-4 focus:ring-[#Dd1764]/5 transition-all font-medium text-[#3F2965]"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full relative py-4 rounded-xl bg-[#Dd1764] text-white font-bold text-lg tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
        > 
          <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
          <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing In...</> : "Sign In"}
          </span>
        </button>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3F2965]/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#Fdfcff] text-[#3F2965]/40 font-bold uppercase text-xs tracking-wider">Or continue with</span>
        </div>
      </div>

      <GoogleButton />
    </div>
  );
}