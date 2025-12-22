"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";
import GoogleButton from "./GoogleButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const handleSignup = async () => {
    setError("");
    setInfo("");

    if (!firstName || !lastName) {
      setError("Please enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 🔔 Send verification mail
      await sendEmailVerification(cred.user);
      setInfo("Verification email sent. Please verify to continue.");

      // 🔁 Poll until user verifies email
      const interval = setInterval(async () => {
        await cred.user.reload();

        if (cred.user.emailVerified) {
          clearInterval(interval);

          const token = await cred.user.getIdToken();

          // 🔥 Sync to Supabase once verified
          await fetch("http://localhost:5000/api/auth/sync-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: `${firstName} ${lastName}`,
              phone,
            }),
          });

          router.push("/");
        }
      }, 3000); // check every 3s
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Signup failed.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-7">
      <h2 className="text-2xl font-bold text-[#3F2965] text-center">
        Create your account
      </h2>
      <p className="text-sm text-[#3F2965]/70 text-center mt-1">
        Begin your MindSettler journey
      </p>

      {error && (
        <div className="mt-4 text-sm text-[#Dd1764] bg-[#Dd1764]/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      {info && (
        <div className="mt-4 text-sm text-green-700 bg-green-100 p-3 rounded-lg">
          {info}
        </div>
      )}

      <div className="mt-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="First name"
            className="px-4 py-2.5 border rounded-lg"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            placeholder="Last name"
            className="px-4 py-2.5 border rounded-lg"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <input
          placeholder="Phone (optional)"
          className="px-4 py-2.5 border rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2.5 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2.5 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="px-4 py-2.5 border rounded-lg"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full mt-3 py-2.5 rounded-full bg-[#Dd1764] text-white font-bold disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <GoogleButton />

      <p className="mt-5 text-sm text-center text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-[#Dd1764] font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
