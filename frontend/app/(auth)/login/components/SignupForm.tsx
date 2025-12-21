"use client";

import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
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
  const [waitingVerification, setWaitingVerification] = useState(false);

  // 👀 Watch for verification & auto-sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      if (!user.emailVerified) {
        setWaitingVerification(true);

        const interval = setInterval(async () => {
          await user.reload();
          const refreshed = auth.currentUser;

          if (refreshed?.emailVerified) {
            clearInterval(interval);

            const token = await refreshed.getIdToken();
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
        }, 3000);

        return;
      }

      // Edge case: already verified
      const token = await user.getIdToken();
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
    });

    return () => unsubscribe();
  }, [router, firstName, lastName, phone]);

  const handleSignup = async () => {
    setError("");

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
      await sendEmailVerification(cred.user);

      setWaitingVerification(true);
      setError("Verification email sent. Please check your inbox.");

    } catch (err: any) {
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

      {waitingVerification && (
        <div className="mt-4 text-sm text-[#3F2965] bg-[#3F2965]/10 p-3 rounded-lg">
          Waiting for email verification… Once verified, you’ll be redirected ✨
        </div>
      )}

      <div className="mt-5 space-y-3">
        {/* Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-[#3F2965]">
              First Name
            </label>
            <input
              className="w-full mt-1 px-4 py-2.5 border border-[#3F2965]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#3F2965]">
              Last Name
            </label>
            <input
              className="w-full mt-1 px-4 py-2.5 border border-[#3F2965]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-[#3F2965]">
            Phone (optional)
          </label>
          <input
            type="tel"
            placeholder="+91 9XXXXXXXXX"
            className="w-full mt-1 px-4 py-2.5 border border-[#3F2965]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-[#3F2965]">Email</label>
          <input
            type="email"
            className="w-full mt-1 px-4 py-2.5 border border-[#3F2965]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-[#3F2965]">
            Password
          </label>
          <input
            type="password"
            className="w-full mt-1 px-4 py-2.5 border border-[#3F2965]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm */}
        <div>
          <label className="text-sm font-medium text-[#3F2965]">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full mt-1 px-4 py-2.5 border border-[#3F2965]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Dd1764]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading || waitingVerification}
          className="w-full mt-3 py-2.5 rounded-full bg-[#Dd1764] text-white font-bold tracking-wide transition hover:shadow-lg hover:shadow-[#3F2965]/30 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </div>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-[#3F2965]/20" />
        <span className="text-xs text-[#3F2965]/50">OR</span>
        <div className="flex-1 h-px bg-[#3F2965]/20" />
      </div>

      <GoogleButton />

      <p className="mt-5 text-sm text-center text-[#3F2965]/70">
        Already have an account?{" "}
        <Link href="/login" className="text-[#Dd1764] font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  );
}
