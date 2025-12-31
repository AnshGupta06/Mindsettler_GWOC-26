"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import GoogleButton from "./GoogleButton";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, Loader2, CheckCircle2, ArrowLeft } from "lucide-react"; 
import { API_URL } from "@/app/lib/api";
export default function SignupForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const handleSignup = async () => {
    // ... (Keep existing logic exactly the same) ...
    setError("");
    setInfo("");

    if (!firstName || !lastName) {
      setError("Please enter your full name.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      setInfo("Verification email sent! Please check your inbox.");

      const interval = setInterval(async () => {
        await cred.user.reload();
        if (cred.user.emailVerified) {
          clearInterval(interval);
          const token = await cred.user.getIdToken();

          await fetch(`${API_URL}/api/auth/sync-user`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: `${firstName} ${lastName}`,
              phone,
            }),
          });
          router.push("/");
        }
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Signup failed.");
      setLoading(false);
    }
  };

  if (info) {
    return (
      <div className="w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center animate-in fade-in zoom-in duration-300 relative">
        <Link 
          href="/" 
          className="absolute top-6 left-6 text-gray-400 hover:text-[#3F2965] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-[#3F2965] mb-2">Verify your Email</h3>
        <p className="text-gray-500 mb-6">
          We've sent a verification link to <span className="font-semibold text-[#3F2965]">{email}</span>.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-[#3F2965]/70 bg-purple-50 p-3 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin" /> Waiting for verification...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/80 backdrop-blur-lg border border-white/50 rounded-3xl shadow-2xl p-8 sm:p-10 relative">
      
      {/* 🏠 Back to Home Option */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 text-gray-400 hover:text-[#3F2965] transition-colors p-2 hover:bg-purple-50 rounded-full"
        title="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="text-center mb-8 mt-4">
        <h2 className="text-3xl font-bold text-[#3F2965]">Create Account</h2>
        <p className="text-[#3F2965]/60 mt-2">Start your wellness journey today</p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-[#3F2965]/40" />
            <input
              placeholder="First name"
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/20 focus:border-[#Dd1764] transition-all outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="relative group">
            <input
              placeholder="Last name"
              className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/20 focus:border-[#Dd1764] transition-all outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="relative group">
          <Phone className="absolute left-4 top-3.5 w-5 h-5 text-[#3F2965]/40" />
          <input
            placeholder="Phone (optional)"
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/20 focus:border-[#Dd1764] transition-all outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#3F2965]/40" />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/20 focus:border-[#Dd1764] transition-all outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#3F2965]/40" />
          <input
            type="password"
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/20 focus:border-[#Dd1764] transition-all outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="relative group">
          <CheckCircle2 className="absolute left-4 top-3.5 w-5 h-5 text-[#3F2965]/40" />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#Dd1764]/20 focus:border-[#Dd1764] transition-all outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
  onClick={handleSignup}
  disabled={loading}
  className="w-full relative py-4 rounded-xl bg-[#Dd1764] text-white font-bold text-lg tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
>
  <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
  <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
  <span className="relative z-10 flex items-center justify-center gap-2">
    {loading ? (
      <>
        <Loader2 className="w-5 h-5 animate-spin" /> Creating...
      </>
    ) : (
      "Create Account"
    )}
  </span>
</button>
      </div>

      <div className="my-8 flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Or sign up with
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <GoogleButton />
    </div>
  );
}