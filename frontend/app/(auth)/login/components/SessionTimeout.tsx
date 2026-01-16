"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";



const SESSION_TIMEOUT = 30 * 60 * 1000; 

export default function SessionTimeout() {
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    
    const updateActivity = () => {
      setLastActivity(Date.now());
      
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    
    events.forEach((event) => window.addEventListener(event, updateActivity));

    
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        
        handleLogout();
      }
    }, 60 * 1000); 

    
    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      clearInterval(intervalId);
    };
  }, [lastActivity]);

  const handleLogout = async () => {
    try {
      if (!auth.currentUser) return; 

      await signOut(auth);
      
      
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

  
  return null;
}