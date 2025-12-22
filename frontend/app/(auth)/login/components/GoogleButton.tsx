"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";

export default function GoogleButton() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      
      // 1. Login with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2. Get Token for backend auth
      const token = await user.getIdToken();

      // 3. 🔥 Sync to Backend immediately with Name
      // We send 'name' from Google. Phone is left blank for now.
      await fetch("http://localhost:5000/api/auth/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.displayName, 
          // phone: undefined (Google doesn't share this, user adds it in Profile)
        }),
      });

      // 4. Redirect to Home
      router.push("/");

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