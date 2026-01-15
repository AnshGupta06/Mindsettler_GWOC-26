"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/lib/api";

export default function GoogleButton() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      await fetch(`${API_URL}/api/auth/sync-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: user.displayName }),
      });

      router.push("/");
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-lg py-3.5 hover:bg-gray-50 transition-colors bg-white shadow-sm"
    >
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
      <span className="text-sm font-bold text-gray-700">
        Continue with Google
      </span>
    </button>
  );
}