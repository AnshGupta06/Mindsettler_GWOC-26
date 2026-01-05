"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import LoginForm from "./components/LoginForm";
import Link from "next/link";
import { isUserAdmin } from "@/app/lib/admin";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 🚀 Auto-redirect based on role if they visit /login
        if (isUserAdmin(user.email)) {
          router.replace("/admin");
        } else {
          router.replace("/profile");
        }
      }
    });
    return () => unsub();
  }, [router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9F6FF] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#3F2965]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#Dd1764]/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md z-10 px-4">
        <LoginForm />
        <p className="mt-6 text-center text-[#3F2965]/60 text-sm">
          Don't have an account?{" "}
          <Link href="/login/signup" className="text-[#Dd1764] font-semibold hover:underline">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}