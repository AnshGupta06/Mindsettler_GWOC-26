"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
import styles from "../styles/signup-form.module.css";

export default function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully 🎉");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <>
      <h2 className={styles.title}>Mindsettler</h2>
      <p className={styles.subtitle}>Create your account</p>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.nameRow}>
        <div>
          <label className={styles.label}>First Name</label>
          <input
            className={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label className={styles.label}>Last Name</label>
          <input
            className={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <label className={styles.label}>Email</label>
      <input
        className={styles.input}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className={styles.label}>Password</label>
      <input
        className={styles.input}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className={styles.label}>Confirm Password</label>
      <input
        className={styles.input}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className={styles.button} onClick={handleSignup}>
        Sign Up
      </button>

      <div className={styles.divider}>Or continue with</div>

      <GoogleButton />

      <p className={styles.footer}>
        Already have an account?{" "}
        <Link href="/login" className={styles.link}>
          Sign in
        </Link>
      </p>
    </>
  );
}
