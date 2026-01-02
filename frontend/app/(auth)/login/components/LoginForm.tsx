"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import GoogleButton from "./GoogleButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast"; // 🔔 IMPORT TOAST

// 🛡️ ADMIN LIST
const ADMIN_EMAILS = ["shsheth2006@gmail.com"];

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
    // 🔔 1. Start Loading Toast
    const toastId = toast.loading("Signing you in...");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const token = await user.getIdToken();

      // Sync user to backend
      await fetch(`${API_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // 🔔 2. Success Toast
      toast.success("Welcome back! ✨", { id: toastId });

      // 🔀 REDIRECT LOGIC
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        router.push("/admin");   // Go to Admin Dashboard
      } else {
        router.push("/profile"); // Go to User Profile
      }

    } catch (err: any) {
      console.error(err);
      
      // 🔔 3. Error Toast (Customized messages)
      let msg = "Failed to login";
      if (err.code === "auth/invalid-credential") msg = "Invalid email or password";
      if (err.code === "auth/user-not-found") msg = "User not found";
      if (err.code === "auth/wrong-password") msg = "Incorrect password";
      if (err.code === "auth/too-many-requests") msg = "Too many failed attempts. Try later.";

      toast.error(msg, { id: toastId });
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    setResetLoading(true);
    const toastId = toast.loading("Sending reset link...");

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent! Check your inbox.", { id: toastId });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        toast.error("No account found with this email.", { id: toastId });
      } else {
        toast.error("Failed to send reset email. Try again later.", { id: toastId });
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
            {resetLoading ? "Sending..." : "Forgot Password?"}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full relative py-4 rounded-xl bg-[#Dd1764] text-white font-bold text-lg tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
        > 
          <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
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