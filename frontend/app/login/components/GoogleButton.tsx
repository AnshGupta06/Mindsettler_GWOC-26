"use client";

import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../lib/firebase";
import styles from "../styles/google-button.module.css";

export default function GoogleButton() {
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    signInWithRedirect(auth, provider);
  };

  return (
    <button className={styles.googleButton} onClick={handleGoogleLogin}>
      <img
        src="/assets/google-icon.png"
        alt="Google"
        className={styles.icon}
      />
      Sign in with Google
    </button>
  );
}
