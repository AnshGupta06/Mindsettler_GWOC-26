"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function GoogleButton() {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition"
    >
      <img src="/assets/google-icon.png" alt="Google" className="w-5 h-5" />
      <span className="text-sm font-medium text-gray-700">
        Continue with Google
      </span>
    </button>
  );
}
