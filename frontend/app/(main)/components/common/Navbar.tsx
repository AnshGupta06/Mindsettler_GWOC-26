"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  LayoutDashboard,
  Calendar
} from "lucide-react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔤 Helper to get Initials
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length > 1 
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() 
      : parts[0][0].toUpperCase();
  };

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click Outside Dropdown Listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && u.email) {
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

  // Lock Body Scroll on Mobile Menu
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await signOut(auth);
      setIsAdmin(false);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      toast.success("Logged out", { id: toastId });
      router.push("/");
    } catch (error) {
      toast.error("Failed to log out", { id: toastId });
    }
  };

  const menuItems = [
    { href: "/", label: "Home", icon: <Home size={20} /> },
    { href: "/about", label: "About", icon: <Info size={20} /> },
    { href: "/awareness", label: "Awareness", icon: <Briefcase size={20} /> },
    { href: "/services", label: "Services", icon: <BookOpen size={20} /> },
    { href: "/resource", label: "Resources", icon: <Library size={20} /> },
    { href: "/contact", label: "Contact", icon: <Mail size={20} /> },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled || mobileMenuOpen
            ? "bg-white/80 backdrop-blur-xl border-[#3F2965]/5 py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <nav className="max-w-[1440px] mx-auto px-6 md:px-8 flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/" className="relative z-50 group">
            <div className="relative rounded-xl bg-white/50 backdrop-blur-sm border border-white/20 px-3 py-1.5 transition-all duration-300 group-hover:scale-105">
              <Image
                src="/assets/Mindsettler-logo.png"
                alt="MindSettler Logo"
                width={140}
                height={40}
                className="w-[120px] md:w-[150px] object-contain"
                priority
              />
            </div>
          </Link>

          {/* DESKTOP NAV (Pill Design) */}
          <ul className="hidden xl:flex items-center gap-1 bg-white/60 backdrop-blur-md p-1.5 rounded-full border border-[#3F2965]/5 shadow-sm">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={`relative z-10 block px-5 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${
                      isActive ? "text-[#3F2965]" : "text-[#3F2965]/60 hover:text-[#3F2965]"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-full shadow-sm border border-[#3F2965]/5"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <button className="px-6 py-2.5 rounded-full font-bold text-[#3F2965] hover:bg-[#F9F6FF] transition-all text-sm">
                    Login
                  </button>
                </Link>
                <Link href="/login/signup">
                  <button className="px-6 py-2.5 rounded-full bg-[#3F2965] text-white font-bold hover:bg-[#513681] transition-all shadow-lg shadow-[#3F2965]/20 hover:-translate-y-0.5 text-sm">
                    Get Started
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                
                {/* Book Session CTA (Non-Admins) */}
                {!isAdmin && (
                  <Link href="/book">
                    <button className="hidden lg:flex px-5 py-2.5 rounded-full bg-[#Dd1764] text-white text-xs font-bold tracking-wide hover:shadow-lg hover:shadow-[#Dd1764]/30 transition hover:-translate-y-0.5 items-center gap-2">
                       <Calendar size={16} /> Book Session
                    </button>
                  </Link>
                )}

                {/* USER DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white border border-[#3F2965]/10 rounded-full hover:shadow-md transition-all group"
                  >
                    <div className="w-9 h-9 bg-[#F9F6FF] rounded-full flex items-center justify-center text-[#Dd1764] font-bold border border-[#Dd1764]/10">
                      {getInitials(user.displayName)}
                    </div>
                    <div className="text-left hidden lg:block">
                        <p className="text-xs font-bold text-[#3F2965] leading-tight">
                            {user.displayName?.split(" ")[0]}
                        </p>
                        <p className="text-[10px] text-[#3F2965]/50 font-medium leading-tight">
                            {isAdmin ? "Administrator" : "Member"}
                        </p>
                    </div>
                    <ChevronDown size={14} className={`text-[#3F2965]/40 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#3F2965]/5 overflow-hidden p-2 z-50"
                      >
                         <div className="px-4 py-3 border-b border-gray-100 mb-2">
                            <p className="text-sm font-bold text-[#3F2965] truncate">{user.displayName || "User"}</p>
                            <p className="text-xs text-[#3F2965]/50 truncate">{user.email}</p>
                         </div>

                         {isAdmin && (
                            <Link href="/admin" onClick={() => setDropdownOpen(false)}>
                              <div className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#3F2965] hover:bg-[#F9F6FF] rounded-xl transition-colors mb-1">
                                <ShieldCheck size={16} className="text-[#Dd1764]" /> Admin Dashboard
                              </div>
                            </Link>
                         )}

                         <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#3F2965] hover:bg-[#F9F6FF] rounded-xl transition-colors mb-1">
                               <UserIcon size={16} /> My Profile
                            </div>
                         </Link>

                         <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut size={16} /> Sign Out
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="xl:hidden z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#3F2965]/10 text-[#3F2965] active:scale-90 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col xl:hidden"
          >
            <div className="flex-1 px-6 pt-24 pb-8 overflow-y-auto">
              
              {/* User Info (Mobile) */}
              {user && (
                  <div className="mb-8 p-4 bg-[#F9F6FF] rounded-2xl flex items-center gap-4 border border-[#3F2965]/5">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#Dd1764] font-bold text-lg shadow-sm">
                          {getInitials(user.displayName)}
                      </div>
                      <div>
                          <p className="font-bold text-[#3F2965]">{user.displayName || "User"}</p>
                          <p className="text-xs text-[#3F2965]/60 truncate max-w-[180px]">{user.email}</p>
                      </div>
                  </div>
              )}

              <ul className="flex flex-col gap-2 mb-8">
                {menuItems.map((item, i) => (
                  <motion.li 
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <div className={`flex items-center justify-between px-5 py-4 rounded-xl transition-all ${
                          pathname === item.href
                            ? "bg-[#3F2965] text-white shadow-lg shadow-[#3F2965]/20"
                            : "bg-gray-50 text-[#3F2965]/70 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-4 font-bold">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        <ArrowRight size={18} className="opacity-50" />
                      </div>
                    </Link>
                  </motion.li>
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
                    {isAdmin && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full py-4 rounded-xl bg-[#3F2965] text-white font-bold flex items-center justify-center gap-2 shadow-lg">
                            <ShieldCheck size={20} /> Admin Dashboard
                        </button>
                        </Link>
                    )}

                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full py-4 rounded-xl bg-white border border-[#3F2965]/10 text-[#3F2965] font-bold flex items-center justify-center gap-3">
                        <UserIcon size={20} /> My Profile
                      </button>
                    </Link>

                    {!isAdmin && (
                      <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full py-4 rounded-xl bg-[#Dd1764] text-white font-bold text-lg shadow-xl shadow-[#Dd1764]/20 flex items-center justify-center gap-2">
                           <Calendar size={20} /> Book Session
                        </button>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full py-4 rounded-xl border border-red-100 text-red-500 font-bold bg-red-50/50 flex items-center justify-center gap-2"
                    >
                      <LogOut size={20} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}