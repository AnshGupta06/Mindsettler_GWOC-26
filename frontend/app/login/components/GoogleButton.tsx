"use client";

import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../lib/firebase";

export default function GoogleButton() {
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    signInWithRedirect(auth, provider);
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        background: "#fff",
        cursor: "pointer",
        fontSize: "15px",
      }}
    >
      Sign in with Google
    </button>
  );
}
