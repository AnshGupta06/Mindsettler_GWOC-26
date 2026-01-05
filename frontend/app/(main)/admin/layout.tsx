"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase"; 
import Loader from "../components/common/Loader"; 
import { ShieldAlert } from "lucide-react";
import { isUserAdmin } from "@/app/lib/admin"; 
import toast from "react-hot-toast";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // 1. Check if user is logged in AND is an admin
      if (user && isUserAdmin(user.email)) {
        setIsAuthorized(true);
      } else {
        // 2. If not, kick them out
        toast.error("Unauthorized access: admin access only!")
        if (user) {
             router.replace("/"); // Logged in regular users -> Home
        } else {
             router.replace("/login"); // Guests -> Login
        }
      }
      setChecking(false);
    });

    return () => unsub();
  }, [router]);

  if (checking) return <Loader fullScreen={true} message="Verifying Access..." />;

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Access Restricted</h1>
      </div>
    );
  }

  return <>{children}</>;
}