"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
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
} from "lucide-react";

// ... (lines 19-71 are unchanged, but I need to make sure I don't break the file structure by replacing huge chunks inappropriately. The tool works by replacing chunks.)

// I will use replace_file_content to just replace the imports and then another call/chunk for the menuItems and logic.
// Actually, I can do it in one go with multi_replace if I am careful, or just replace the whole file? No, replace_file_content is better for contiguous blocks.
// I will use multi_replace for imports + menuItems + Desktop Nav.

import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const ADMIN_EMAILS = ["shsheth2006@gmail.com"];

  // 🔤 Helper to get Initials (e.g., "Siddharth Sheth" -> "SS")
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "Profile";
    const parts = name.trim().split(" ");
    if (parts.length === 0) return "Profile";

    const firstInitial = parts[0][0];
    const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";

    return (firstInitial + lastInitial).toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && u.email && ADMIN_EMAILS.includes(u.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    router.push("/login");
  };

  const menuItems = [
    { href: "/", label: "Home", icon: <Home size={24} /> },
    { href: "/about", label: "About", icon: <Info size={24} /> },
    { href: "/awareness", label: "Awareness", icon: <Briefcase size={24} /> },
    { href: "/resource", label: "Resources", icon: <Library size={24} /> },
    { href: "/services", label: "Services", icon: <BookOpen size={24} /> },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
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
          <ul className="hidden md:flex items-center gap-2 bg-[#F9F6FF] p-1.5 rounded-full border border-[#3F2965]/5">
            <NavLink href="/" active={pathname === "/"}>Home</NavLink>
            <NavLink href="/about" active={pathname === "/about"}>About</NavLink>
            <NavLink href="/awareness" active={pathname === "/awareness"}>Awareness</NavLink>
            <NavLink href="/resource" active={pathname.startsWith("/resource")}>Resources</NavLink>
            <NavLink href="/services" active={pathname === "/services"}>Services</NavLink>
            <NavLink href="/contact" active={pathname === "/contact"}>Contact</NavLink>
          </ul>

          {/* DESKTOP CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/login">
                  <button className="px-5 py-2 rounded-full border border-[#3F2965]/30 text-[#3F2965] text-sm font-bold hover:bg-[#F9F6FF] transition">
                    Login
                  </button>
                </Link>
                <Link href="/login/signup">
                  <button className="px-5 py-2 rounded-full bg-[#3F2965] text-white text-sm font-bold hover:bg-[#513681] transition">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <button className="px-5 py-2 rounded-full bg-[#3F2965] text-white text-sm font-bold hover:bg-[#513681] transition flex items-center gap-2">
                      <ShieldCheck size={16} />
                      Dashboard
                    </button>
                  </Link>
                )}

                {/* 👤 User Initials Button */}
                <Link href="/profile">
                  <button className="px-4 py-2 rounded-full border border-[#3F2965]/30 text-[#3F2965] text-sm font-bold hover:bg-[#3F2965] hover:text-white transition flex items-center gap-2">
                    <UserIcon size={16} />
                    {getInitials(user.displayName)}
                  </button>
                </Link>

                {!isAdmin && (
                  <Link href="/book">
                    <button className="px-6 py-3 rounded-full bg-[#Dd1764] text-white text-sm font-bold tracking-wide hover:shadow-lg hover:shadow-[#3F2965]/20 transition">
                      Book Session
                    </button>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-full border border-[#Dd1764]/40 text-[#Dd1764] text-sm font-bold hover:bg-[#Dd1764]/10 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden z-50 text-[#3F2965] w-10 h-10 flex items-center justify-center rounded-full bg-[#F9F6FF] transition-colors hover:bg-[#Dd1764] hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-gradient-to-br from-[#F9F6FF] via-white to-[#F9F6FF] flex flex-col md:hidden transition-all duration-500 ${mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
      >
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-24 pb-8">
          <ul className="flex flex-col gap-3 w-full max-w-sm mb-8">
            {menuItems.map((item) => (
              <li key={item.href} onClick={() => setMobileMenuOpen(false)}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl transition ${pathname === item.href
                      ? "bg-gradient-to-r from-[#3F2965] to-[#513681] text-white"
                      : "bg-white text-[#3F2965]"
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
          {!user ? (
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 rounded-xl border border-[#3F2965]/30 text-[#3F2965] font-bold">
                  Login
                </button>
              </Link>
              <Link href="/login/signup" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 rounded-xl bg-[#3F2965] text-white font-bold">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-3 rounded-xl border border-[#3F2965]/30 text-[#3F2965] font-bold flex items-center justify-center gap-2">
                  <UserIcon size={18} />
                  {getInitials(user.displayName)}
                </button>
              </Link>

              {!isAdmin && (
                <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-4 rounded-2xl bg-[#Dd1764] text-white font-bold text-lg">
                    Book Your Session
                  </button>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl border border-[#Dd1764]/40 text-[#Dd1764] font-bold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`block px-5 py-2 rounded-full text-sm font-bold transition ${active
          ? "bg-white text-[#3F2965] shadow-sm"
          : "text-[#3F2965]/70 hover:bg-white/50 hover:text-[#3F2965]"
          }`}
      >
        {children}
      </Link>
    </li>
  );
}