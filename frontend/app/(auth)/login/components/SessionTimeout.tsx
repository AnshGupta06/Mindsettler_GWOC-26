"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ⏳ TIMEOUT SETTING: 30 Minutes (in milliseconds)
// 30 * 60 * 1000 = 1,800,000 ms
const SESSION_TIMEOUT = 30 * 60 * 1000; 

export default function SessionTimeout() {
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    // 1. Define the event handler that resets the timer
    const updateActivity = () => {
      setLastActivity(Date.now());
      // Optional: Store in localStorage if you want to sync across tabs
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    // 2. Events to listen for (User is "active")
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    // 3. Attach listeners (Throttled slightly by React state nature, but efficient enough)
    events.forEach((event) => window.addEventListener(event, updateActivity));

    // 4. Check for timeout every minute
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        // 🚨 TIMEOUT REACHED!
        handleLogout();
      }
    }, 60 * 1000); // Check every 1 minute

    // Cleanup
    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      clearInterval(intervalId);
    };
  }, [lastActivity]);

  const handleLogout = async () => {
    try {
      if (!auth.currentUser) return; // Already logged out

      await signOut(auth);
      
      // 🔔 Show a friendly security message
      toast.error("Session expired due to inactivity. Please log in again.", {
        duration: 5000,
        icon: "🛡️",
        style: {
            background: "#F9F6FF",
            color: "#3F2965",
            border: "1px solid #3F2965",
        }
      });
      
      router.push("/login");
    } catch (error) {
      console.error("Auto-logout failed", error);
    }
  };

  // This component doesn't render anything visible
  return null;
}