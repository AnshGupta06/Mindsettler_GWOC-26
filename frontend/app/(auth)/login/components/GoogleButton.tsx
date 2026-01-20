"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/lib/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function GoogleButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (isLoading) return; 
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      
      const result = await signInWithPopup(auth, provider);

      setIsLoading(true);

      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);
      const isNewUser = additionalInfo?.isNewUser;

      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          name: user.displayName, 
          email: user.email,
          sendWelcome: isNewUser 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to sync user data with server");
      }

      router.push("/");
      
    } catch (err: any) {
      console.error("Google sign-in/sync failed:", err);
      
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error("Login failed. Please try again.");
      }
      
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className={`flex items-center justify-center gap-3 w-full border border-gray-200 rounded-lg py-3.5 hover:bg-gray-50 transition-colors bg-white shadow-sm ${isLoading ? "opacity-80 cursor-not-allowed bg-gray-50" : ""}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-[#3F2965]" />
          <span className="text-sm font-bold text-[#3F2965]">
            Signing in...
          </span>
        </>
      ) : (
        <>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-sm font-bold text-gray-700">
            Continue with Google
          </span>
        </>
      )}
    </button>
  );
}