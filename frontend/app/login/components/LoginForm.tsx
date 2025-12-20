"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import GoogleButton from "./GoogleButton";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔥 HANDLE GOOGLE REDIRECT RESULT
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Google user:", result.user);
          alert("Google login successful");
        }
      })
      .catch((err) => {
        console.error("Redirect error:", err);
      });
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

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    marginTop: "6px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #d0d5dd",
    fontSize: "15px",
    outline: "none",
  };

  return (
    <div style={{ textAlign: "center",paddingTop: "80px"
    }}>
      {/* Title */}
      <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "6px" }}>
        Mindsettler
      </h2>

      <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
        Sign in to your account
      </p>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#fde8e8",
            color: "#b42318",
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "18px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <div style={{ textAlign: "left" }}>
        <label style={{ fontSize: "14px", fontWeight: 500 }}>Email</label>
        <input
          style={inputStyle}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={{ fontSize: "14px", fontWeight: 500 }}>Password</label>
        <input
          style={inputStyle}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Sign In */}
      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "14px",
          background: "#0b2343",
          color: "#ffffff",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: 500,
          cursor: "pointer",
          marginTop: "6px",
        }}
      >
        Sign In
      </button>

      {/* Divider */}
      <div
        style={{
          margin: "26px 0 18px",
          fontSize: "13px",
          color: "#9ca3af",
        }}
      >
        Or continue with
      </div>

      {/* Google */}
      <GoogleButton />

      {/* Footer */}
      <p style={{ marginTop: "22px", fontSize: "14px", color: "#374151" }}>
  Don’t have an account?{" "}
  <Link
    href="/login/signup"
    style={{
      color: "#0b2343",
      fontWeight: 500,
      textDecoration: "none",
      cursor: "pointer",
    }}
  >
    Sign up
  </Link>
</p>

    </div>
  );
}

