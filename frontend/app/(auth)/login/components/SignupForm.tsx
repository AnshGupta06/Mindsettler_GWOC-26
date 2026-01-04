"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import GoogleButton from "./GoogleButton";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"; 
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast";

export default function SignupForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const handleSignup = async () => {
    setInfo("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      
      setInfo("Verification email sent! Please check your inbox.");
      toast.success("Account created successfully!", { id: toastId });

      // Polling for email verification
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
      toast.error(err.message || "Signup failed.", { id: toastId });
      setLoading(false);
    }
  };

  if (info) {
    return (
      <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 text-center animate-in fade-in zoom-in duration-300 relative max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Mail className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-[#3F2965] mb-2">Verify your Email</h3>
        <p className="text-[#3F2965]/60 mb-8 leading-relaxed">
          We've sent a verification link to <br/><span className="font-bold text-[#3F2965]">{email}</span>.
        </p>
        <div className="flex items-center justify-center gap-3 text-sm font-bold text-[#3F2965] bg-[#F9F6FF] p-4 rounded-2xl border border-[#3F2965]/5">
          <Loader2 className="w-5 h-5 animate-spin text-[#Dd1764]" /> 
          Waiting for verification...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/50 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#3F2965]">Create Account</h1>
        <p className="text-[#3F2965]/60 mt-2 text-sm">Begin your journey to better mental health</p>
      </div>

      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/30 group-focus-within:text-[#Dd1764] transition-colors" size={18} />
              <input
                placeholder="First Name"
                className="w-full pl-10 pr-3 py-3.5 bg-[#F9F6FF] border border-[#3F2965]/5 rounded-xl outline-none focus:bg-white focus:border-[#Dd1764]/20 focus:ring-4 focus:ring-[#Dd1764]/5 transition-all font-medium text-[#3F2965]"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="relative group">
              <input
                placeholder="Last Name"
                className="w-full px-4 py-3.5 bg-[#F9F6FF] border border-[#3F2965]/5 rounded-xl outline-none focus:bg-white focus:border-[#Dd1764]/20 focus:ring-4 focus:ring-[#Dd1764]/5 transition-all font-medium text-[#3F2965]"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact Fields */}
        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/30 group-focus-within:text-[#Dd1764] transition-colors" size={20} />
          <input
            placeholder="Phone Number (Optional)"
            className="w-full pl-12 pr-4 py-3.5 bg-[#F9F6FF] border border-[#3F2965]/5 rounded-xl outline-none focus:bg-white focus:border-[#Dd1764]/20 focus:ring-4 focus:ring-[#Dd1764]/5 transition-all font-medium text-[#3F2965]"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/30 group-focus-within:text-[#Dd1764] transition-colors" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-3.5 bg-[#F9F6FF] border border-[#3F2965]/5 rounded-xl outline-none focus:bg-white focus:border-[#Dd1764]/20 focus:ring-4 focus:ring-[#Dd1764]/5 transition-all font-medium text-[#3F2965]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/30 group-focus-within:text-[#Dd1764] transition-colors" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-3.5 bg-[#F9F6FF] border border-[#3F2965]/5 rounded-xl outline-none focus:bg-white focus:border-[#Dd1764]/20 focus:ring-4 focus:ring-[#Dd1764]/5 transition-all font-medium text-[#3F2965]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="relative group">
            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/30 group-focus-within:text-[#Dd1764] transition-colors" size={18} />
            <input
              type="password"
              placeholder="Confirm"
              className="w-full pl-10 pr-3 py-3.5 bg-[#F9F6FF] border border-[#3F2965]/5 rounded-xl outline-none focus:bg-white focus:border-[#Dd1764]/20 focus:ring-4 focus:ring-[#Dd1764]/5 transition-all font-medium text-[#3F2965]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full relative py-4 rounded-xl bg-[#Dd1764] text-white font-bold text-lg tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-[#Dd1764]/20 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
          <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</> : "Create Account"}
          </span>
        </button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#3F2965]/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#Fdfcff] text-[#3F2965]/40 font-bold uppercase text-xs tracking-wider">Or sign up with</span>
        </div>
      </div>

      <GoogleButton />
      
      <div className="mt-6 text-center">
         <p className="text-[#3F2965]/60 text-sm mb-2">Already have an account?</p>
         <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-[#Dd1764] hover:text-[#b01350] transition-colors">
            <ArrowLeft size={16} /> Back to Login
         </Link>
      </div>
    </div>
  );
}