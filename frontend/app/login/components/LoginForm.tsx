"use client";

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, getRedirectResult } from "firebase/auth";
import { auth } from "../../lib/firebase";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
import styles from "../styles/login-form.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <h2 className={styles.title}>Mindsettler</h2>
      <p className={styles.subtitle}>Sign in to your account</p>

      {error && <div className={styles.error}>{error}</div>}

      <label className={styles.label}>Email</label>
      <input
        className={styles.input}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className={styles.label}>Password</label>
      <input
        className={styles.input}
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className={styles.button} onClick={handleLogin}>
        Sign In
      </button>

      <div className={styles.divider}>Or continue with</div>

      <GoogleButton />

      <p className={styles.footer}>
        Don’t have an account?{" "}
        <Link href="/login/signup" className={styles.link}>
          Sign up
        </Link>
      </p>
    </>
  );
}
