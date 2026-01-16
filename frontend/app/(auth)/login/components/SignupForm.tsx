"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Mail, AlertCircle } from "lucide-react";
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast";

import { CharReveal, StaggerContainer, StaggerItem, SlideUp} from "../../../(main)/components/common/RevealComponent";

export default function SignupForm() {
  const router = useRouter();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validatePassword = (pwd: string) => {
    const checks = [
      { regex: /.{6,}/, label: "At least 6 characters" },
      { regex: /[a-z]/, label: "Lowercase letter" },
      { regex: /[0-9]/, label: "Number" },
      { regex: /[^a-zA-Z0-9]/, label: "Special character" },
    ];
    const missing = checks.filter((c) => !c.regex.test(pwd)).map((c) => c.label);
    return missing;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // --- Validation ---
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrors((prev) => ({ ...prev, general: "Please fill in all required fields." }));
      return;
    }
    const missingRequirements = validatePassword(password);
    if (missingRequirements.length > 0) {
      setErrors((prev) => ({ ...prev, password: `Missing: ${missingRequirements.join(", ")}` }));
      return;
    }
    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, password: "Passwords do not match." }));
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      const token = await cred.user.getIdToken();
      await fetch(`${API_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          name: `${firstName} ${lastName}`, 
          phone, 
          email 
        }),
      });

      // 3. Send Verification Email
      await sendEmailVerification(cred.user);
      
      toast.success("Account created!", { id: toastId });
      setInfo(true);

      // 4. Poll for Email Verification (Redirect Only)
      const interval = setInterval(async () => {
        try {
          await cred.user.reload();
          if (cred.user.emailVerified) {
            clearInterval(interval);
            toast.success("Verified! Logging in...");
            router.push("/");
          }
        } catch (e) { 
          console.error("Verification poll error", e); 
        }
      }, 3000);

    } catch (err: any) {
      setLoading(false);
      toast.dismiss(toastId);
      
      if (err.code === "auth/email-already-in-use") {
        setErrors((prev) => ({ ...prev, email: "This email is already registered." }));
      } else if (err.code === "auth/weak-password") {
        setErrors((prev) => ({ ...prev, password: "Password does not meet requirements." }));
      } else if (err.code === "auth/invalid-email") {
        setErrors((prev) => ({ ...prev, email: "Invalid email address format." }));
      } else {
        setErrors((prev) => ({ ...prev, general: err.message || "Something went wrong." }));
      }
    }
  };

  if (info) {
    return (
      <SlideUp className="text-center w-full py-8">
        <div className="w-20 h-20 bg-[#3F2965]/5 text-[#3F2965] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#3F2965]/10">
          <Mail size={36} />
        </div>
        <h3 className="text-2xl font-black text-[#3F2965] mb-4 tracking-tight">Verify your Email</h3>
        <p className="text-gray-500 mb-2 leading-relaxed text-sm">
          We've sent a secure link to <br/>
          <span className="font-bold text-[#3F2965] text-base">{email}</span>
        </p>
        <p className="text-xs text-gray-400 font-medium mb-8">
          (Check your <span className="text-[#Dd1764]">Spam</span> or <span className="text-[#Dd1764]">Junk</span> folder)
        </p>
        <div className="flex items-center justify-center gap-3 text-xs font-bold text-[#3F2965] bg-[#3F2965]/5 p-4 rounded-xl border border-[#3F2965]/10">
          <Loader2 className="w-4 h-4 animate-spin text-[#Dd1764]" /> 
          Waiting for verification...
        </div>
        <button onClick={() => window.location.reload()} className="mt-6 text-[10px] font-bold text-gray-400 hover:text-[#3F2965] uppercase tracking-widest transition-colors">
          Incorrect Email?
        </button>
      </SlideUp>
    );
  }

  return (
    <StaggerContainer className="w-full" delay={0.2}>
      <StaggerItem className="flex justify-start mb-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#3F2965] transition-colors">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </StaggerItem>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-[#3F2965] tracking-tight">
          <CharReveal delay={0.4}>Create Account</CharReveal>
        </h2>
        <SlideUp delay={0.6}>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Begin your professional wellness journey</p>
        </SlideUp>
      </div>

      <form onSubmit={handleSignup} className="space-y-3">
        {errors.general && (
          <SlideUp>
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-xs font-bold text-red-600 mb-2">
              <AlertCircle size={14} /> {errors.general}
            </div>
          </SlideUp>
        )}

        <StaggerItem className="grid grid-cols-2 gap-3">
           <div className="space-y-1 text-left">
             <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">First Name</label>
             <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#Dd1764] transition-all text-sm font-bold text-[#3F2965]" placeholder="First Name" />
           </div>
           <div className="space-y-1 text-left">
             <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
             <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#Dd1764] transition-all text-sm font-bold text-[#3F2965]" placeholder="Last Name" />
           </div>
        </StaggerItem>

        <StaggerItem className="space-y-1 text-left">
           <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone (Optional)</label>
           <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#Dd1764] transition-all text-sm font-bold text-[#3F2965]" placeholder="Phone Number" />
        </StaggerItem>

        <StaggerItem className="space-y-1 text-left">
           <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-bold text-[#3F2965] ${errors.email ? 'border-red-300 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-[#Dd1764]'}`} placeholder="Email Address" />
           {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
        </StaggerItem>

        <StaggerItem className="grid grid-cols-2 gap-3">
           <div className="space-y-1 text-left">
             <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-bold text-[#3F2965] ${errors.password ? 'border-red-300 focus:border-red-500 bg-red-50/50' : 'border-gray-200 focus:border-[#Dd1764]'}`} placeholder="••••••••" />
           </div>
           <div className="space-y-1 text-left">
             <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider ml-1">Confirm</label>
             <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-[#Dd1764] transition-all text-sm font-bold text-[#3F2965]" placeholder="••••••••" />
           </div>
        </StaggerItem>
        
        {errors.password && (
            <StaggerItem>
              <p className="text-[10px] font-bold text-red-500 ml-1 mt-0 flex items-start gap-1 leading-snug">
                  <AlertCircle size={10} className="mt-0.5 shrink-0" /> {errors.password}
              </p>
            </StaggerItem>
        )}

        <StaggerItem>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-[#Dd1764] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#b01350] transition-all shadow-md shadow-[#Dd1764]/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Account"}
          </button>
        </StaggerItem>
      </form>

      <StaggerItem className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
        <div className="relative flex justify-center text-[9px] uppercase tracking-widest text-gray-300 font-bold">
          <span className="bg-white px-2">Or continue with</span>
        </div>
      </StaggerItem>

      <StaggerItem>
        <GoogleButton />
      </StaggerItem>
    </StaggerContainer>
  );
}