"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ArrowRight, Home, Info, Briefcase, BookOpen, Mail } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  const menuItems = [
    { href: "/", label: "Home", icon: <Home size={24} /> },
    { href: "/about", label: "About", icon: <Info size={24} /> },
    { href: "/services", label: "Services", icon: <Briefcase size={24} /> },
    { href: "/resources", label: "Resources", icon: <BookOpen size={24} /> },
    { href: "/contact", label: "Contact", icon: <Mail size={24} /> },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
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

          {/* DESKTOP NAV LINKS */}
          <ul className="hidden md:flex items-center gap-2 bg-[#F9F6FF] p-1.5 rounded-full border border-[#3F2965]/5">
            <NavLink href="/" active={pathname === "/"}>Home</NavLink>
            <NavLink href="/about" active={pathname === "/about"}>About</NavLink>
            <NavLink href="/services" active={pathname === "/services"}>Services</NavLink>
            <NavLink href="/resources" active={pathname === "/resources"}>Resources</NavLink>
            <NavLink href="/contact" active={pathname === "/contact"}>Contact</NavLink>
          </ul>

          {/* CTA BUTTON (Desktop) */}
          <div className="hidden md:block">
            <Link href="/book">
              <button className="relative px-6 py-3 rounded-full bg-[#Dd1764] text-white text-sm font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5">
                <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                <span className="relative z-10 flex items-center gap-2">Book Session</span>
              </button>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden z-50 text-[#3F2965] w-10 h-10 flex items-center justify-center rounded-full bg-[#F9F6FF] transition-colors hover:bg-[#Dd1764] hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-gradient-to-br from-[#F9F6FF] via-white to-[#F9F6FF] flex flex-col md:hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-10 w-40 h-40 bg-[#Dd1764]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-[#3F2965]/5 rounded-full blur-3xl" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-24 pb-8">
          
          {/* Menu Items */}
          <ul className="flex flex-col items-stretch gap-3 w-full max-w-sm mb-10">
            {menuItems.map((item, index) => (
              <li
                key={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="transform transition-all duration-300"
                style={{
                  animation: mobileMenuOpen ? `slideInRight 0.5s ease-out ${index * 0.1}s both` : 'none'
                }}
              >
                <Link href={item.href}>
                  <div className={`group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-[#3F2965] to-[#513681] text-white shadow-lg"
                      : "bg-white text-[#3F2965] hover:bg-[#F9F6FF] hover:shadow-md"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        pathname === item.href
                          ? "bg-white/20"
                          : "bg-[#F9F6FF] group-hover:bg-[#Dd1764] group-hover:text-white"
                      }`}>
                        {item.icon}
                      </div>
                      <span className="text-lg font-bold">{item.label}</span>
                    </div>
                    <ArrowRight 
                      size={20} 
                      className={`transition-transform duration-300 ${
                        pathname === item.href ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      } group-hover:translate-x-1`}
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <div 
            className="w-full max-w-sm"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              animation: mobileMenuOpen ? 'slideInRight 0.5s ease-out 0.5s both' : 'none'
            }}
          >
            <Link href="/book">
              <button className="w-full relative px-8 py-4 rounded-2xl bg-gradient-to-r from-[#Dd1764] to-[#ff1f7a] text-white font-bold text-lg tracking-wide overflow-hidden group shadow-lg shadow-[#Dd1764]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#Dd1764]/40 active:scale-95">
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#3F2965] to-[#513681] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>Book Your Session</span>
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </span>
              </button>
            </Link>
          </div>

          {/* Footer Text */}
          <div 
            className="mt-8 text-center"
            style={{
              animation: mobileMenuOpen ? 'fadeIn 0.5s ease-out 0.6s both' : 'none'
            }}
          >
            <p className="text-sm text-[#3F2965]/60 font-medium">
              Your path to mental wellness starts here
            </p>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className={`block px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
          active
            ? "bg-white text-[#3F2965] shadow-sm"
            : "text-[#3F2965]/70 hover:bg-white/50 hover:text-[#3F2965]"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}