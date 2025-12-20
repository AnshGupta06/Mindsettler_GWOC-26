"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import GoogleButton from "./GoogleButton";

export default function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    if (!firstName || !lastName) {
      setError("Please enter your full name");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully 🎉");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "6px",
    display: "block",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #d0d5dd",
    fontSize: "15px",
    marginBottom: "18px",
    outline: "none",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "6px" }}>
        Mindsettler
      </h2>

      <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "14px" }}>
        Create your account
      </p>

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

      {/* First & Last Name */}
      <div style={{ display: "flex", gap: "14px", textAlign: "left" }}>
        <div style={{ width: "50%" }}>
          <label style={labelStyle}>First Name</label>
          <input
            style={inputStyle}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div style={{ width: "50%" }}>
          <label style={labelStyle}>Last Name</label>
          <input
            style={inputStyle}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      {/* Email */}
      <div style={{ textAlign: "left" }}>
        <label style={labelStyle}>Email</label>
        <input
          style={inputStyle}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={labelStyle}>Password</label>
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label style={labelStyle}>Confirm Password</label>
        <input
          style={inputStyle}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Sign Up */}
      <button
        onClick={handleSignup}
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
          marginTop: "4px",
        }}
      >
        Sign Up
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
        Already have an account?{" "}
        <a
          href="/login"
          style={{
            color: "#0b2343",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
