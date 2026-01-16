"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast";

import { CharReveal, StaggerContainer, StaggerItem, SlideUp} from "../../../(main)/components/common/RevealComponent";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please fill in all fields");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      await fetch(`${API_URL}/api/auth/sync-user`, {
         method: "POST", 
         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
         body: JSON.stringify({ email: cred.user.email }) 
      });
    } catch (err: any) {
      toast.error("Login failed");
      setLoading(false);
    }
  };

  return (
    
    <StaggerContainer className="w-full" delay={0.2}>
      
      {}
      <StaggerItem className="flex justify-start mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#3F2965] transition-colors">
           <ArrowLeft size={12} /> Return Home
        </Link>
      </StaggerItem>

      <div className="mb-8">
        {}
        <h2 className="text-3xl font-bold text-[#3F2965] tracking-tight">
          <CharReveal delay={0.4}>Welcome Back</CharReveal>
        </h2>
        <SlideUp delay={0.6}>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1">Sign in to continue your journey</p>
        </SlideUp>
      </div>

      <div className="space-y-4">
        <StaggerItem className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#3F2965] transition-all text-sm font-medium text-[#3F2965]"
            placeholder="john@example.com"
          />
        </StaggerItem>

        <StaggerItem className="space-y-1">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
            <button className="text-[10px] font-bold text-[#Dd1764] hover:underline uppercase tracking-wide">
              Forgot?
            </button>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#3F2965] transition-all text-sm font-medium text-[#3F2965]"
            placeholder="••••••••"
          />
        </StaggerItem>

        <StaggerItem>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-[#3F2965] text-white font-bold text-sm tracking-wide hover:bg-[#2d1d49] transition-all shadow-md shadow-[#3F2965]/20 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "SIGN IN"}
          </button>
        </StaggerItem>
      </div>

      <StaggerItem className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
        <div className="relative flex justify-center text-[9px] uppercase tracking-widest text-gray-300 font-bold">
          <span className="bg-white px-3">Or continue with</span>
        </div>
      </StaggerItem>

      <StaggerItem>
        <GoogleButton />
      </StaggerItem>

      <StaggerItem className="mt-8 text-center">
        <p className="text-[11px] font-medium text-gray-400">
          No account? <Link href="/login/signup" className="text-[#Dd1764] font-bold hover:underline">Register now</Link>
        </p>
      </StaggerItem>
    </StaggerContainer>
  );
}