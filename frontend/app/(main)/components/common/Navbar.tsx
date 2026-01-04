"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Menu,
  X,
  ArrowRight,
  Home,
  Info,
  Briefcase,
  BookOpen,
  Mail,
  ShieldCheck,
  User as UserIcon,
  Library,
  LogOut,
} from "lucide-react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 🔤 Helper to get Initials (e.g., "Siddharth Sheth" -> "SS")
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "User";
    const parts = name.trim().split(" ");
    if (parts.length === 0) return "User";
    const firstInitial = parts[0][0];
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔐 Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && u.email) {
        // ✅ SECURE CHECK: Read from Environment Variable
        const adminList = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
          .split(",")
          .map((e) => e.trim().toLowerCase());
        
        setIsAdmin(adminList.includes(u.email.toLowerCase()));
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  // 🚪 Logout Handler (Fixed Redirect)
  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await signOut(auth);
      setIsAdmin(false); // Clear admin state immediately
      toast.success("Logged out successfully", { id: toastId });
      setMobileMenuOpen(false);
      
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to log out", { id: toastId });
    }
  };

  const menuItems = [
    { href: "/", label: "Home", icon: <Home size={24} /> },
    { href: "/about", label: "About", icon: <Info size={24} /> },
    { href: "/awareness", label: "Awareness", icon: <Briefcase size={24} /> },
    { href: "/services", label: "Services", icon: <BookOpen size={24} /> },
    { href: "/resource", label: "Resources", icon: <Library size={24} /> },
    { href: "/contact", label: "Contact", icon: <Mail size={24} /> },
  ];

  if (isAdmin) {
    menuItems.push({
      href: "/admin",
      label: "Admin Dashboard",
      icon: <ShieldCheck size={24} className="text-[#Dd1764]" />,
    });
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3 md:py-4"
            : "bg-transparent py-4 md:py-6"
        }`}
      >
        <nav className="max-w-[1440px] mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="relative rounded-xl bg-[#F9F6FF] flex items-center justify-center transition-colors group-hover:bg-[#Dd1764] overflow-hidden py-2 px-3">
              <Image
                src="/assets/Mindsettler-logo.png"
                alt="MindSettler Logo"
                width={140}
                height={1}
                className="object-contain w-[120px] md:w-[170px] transition-all duration-300 group-hover:brightness-0 group-hover:invert"
              />
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden xl:flex items-center gap-1 bg-[#F9F6FF] p-1.5 rounded-full border border-[#3F2965]/5 shadow-sm">
            <NavLink href="/" active={pathname === "/"}>Home</NavLink>
            <NavLink href="/about" active={pathname === "/about"}>About</NavLink>
            <NavLink href="/awareness" active={pathname === "/awareness"}>Awareness</NavLink>
            <NavLink href="/services" active={pathname === "/services"}>Services</NavLink>
            <NavLink href="/resource" active={pathname.startsWith("/resource")}>Resources</NavLink>
            <NavLink href="/contact" active={pathname === "/contact"}>Contact</NavLink>
          </ul>

          {/* DESKTOP CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/login">
                  <button className="px-6 py-2.5 rounded-full border border-[#3F2965]/10 text-[#3F2965] text-sm font-bold hover:bg-[#F9F6FF] transition hover:shadow-sm">
                    Login
                  </button>
                </Link>
                <Link href="/login/signup">
                  <button className="px-6 py-2.5 rounded-full bg-[#3F2965] text-white text-sm font-bold hover:bg-[#513681] transition shadow-lg shadow-[#3F2965]/20 hover:-translate-y-0.5">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <button className="px-5 py-2.5 rounded-full bg-[#3F2965] text-white text-sm font-bold hover:bg-[#513681] transition flex items-center gap-2 shadow-lg shadow-[#3F2965]/20">
                      <ShieldCheck size={16} />
                      Dashboard
                    </button>
                  </Link>
                )}

                <Link href="/profile">
                  <button className="pl-3 pr-5 py-2 rounded-full border border-[#3F2965]/10 bg-white text-[#3F2965] text-sm font-bold hover:border-[#3F2965] transition flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#F9F6FF] rounded-full flex items-center justify-center text-[#Dd1764]">
                      <UserIcon size={14} />
                    </div>
                    {/* 👇 This correctly renders "SS" for Siddharth Sheth */}
                    {getInitials(user.displayName)}
                  </button>
                </Link>

                {!isAdmin && (
                  <Link href="/book">
                    <button className="px-6 py-2.5 rounded-full bg-[#Dd1764] text-white text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-[#Dd1764]/30 transition hover:-translate-y-0.5">
                      Book Session
                    </button>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full border border-red-100 text-red-500 hover:bg-red-50 transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="xl:hidden z-50 text-[#3F2965] w-12 h-12 flex items-center justify-center rounded-full bg-[#F9F6FF] transition-colors hover:bg-[#Dd1764] hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-white flex flex-col xl:hidden transition-all duration-500 ${
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="relative z-10 flex flex-col flex-1 px-6 pt-28 pb-8 overflow-y-auto">
          <ul className="flex flex-col gap-2 mb-8">
            {menuItems.map((item) => (
              <li key={item.href} onClick={() => setMobileMenuOpen(false)}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl transition border ${
                      pathname === item.href
                        ? "bg-[#3F2965] text-white border-[#3F2965] shadow-lg shadow-[#3F2965]/20"
                        : "bg-white text-[#3F2965] border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon}
                      <span className="text-lg font-bold">{item.label}</span>
                    </div>
                    <ArrowRight size={20} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* MOBILE CTA */}
          <div className="mt-auto space-y-3">
            {!user ? (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-4 rounded-xl border border-[#3F2965]/20 text-[#3F2965] font-bold">
                    Login
                  </button>
                </Link>
                <Link href="/login/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-4 rounded-xl bg-[#3F2965] text-white font-bold shadow-xl shadow-[#3F2965]/20">
                    Sign Up Now
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-4 rounded-xl bg-[#F9F6FF] text-[#3F2965] font-bold flex items-center justify-center gap-3">
                    <UserIcon size={20} />
                    My Profile
                  </button>
                </Link>

                {!isAdmin && (
                  <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full py-4 rounded-xl bg-[#Dd1764] text-white font-bold text-lg shadow-xl shadow-[#Dd1764]/20">
                      Book Your Session
                    </button>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-4 rounded-xl border border-red-100 text-red-500 font-bold bg-red-50/50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className={`block px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
          active
            ? "bg-white text-[#3F2965] shadow-sm scale-105"
            : "text-[#3F2965]/70 hover:bg-white hover:text-[#3F2965]"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}