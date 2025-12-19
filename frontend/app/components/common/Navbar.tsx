"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="max-w-[1440px] mx-auto px-6 md:px-8 flex items-center justify-between">
       
{/* LOGO */}
<Link href="/" className="flex items-center gap-3 group">
  
  {/* 1. Increased container to w-12 h-12 (48px) for better visibility */}
  <div className="relative rounded-xl bg-[#F9F6FF] flex items-center justify-center transition-colors group-hover:bg-[#Dd1764] overflow-hidden py-2 px-3">
    
    {/* 2. Increased Image size to 32px (was 24px) */}
    <Image 
      src="/assets/Mindsettler-logo.png" 
      alt="MindSettler Logo"
      width={170} 
      height={1}
      className="object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
    />
  </div>
</Link>

        {/* NAV LINKS (Desktop) */}
        <ul className="hidden md:flex items-center gap-2 bg-[#F9F6FF] p-1.5 rounded-full border border-[#3F2965]/5">
          <NavLink href="/" active={pathname === "/"}>Home</NavLink>
          <NavLink href="/about" active={pathname === "/about"}>About</NavLink>
          <NavLink href="/services" active={pathname === "/services"}>Services</NavLink>
          <NavLink href="/resources" active={pathname === "/resources"}>Resources</NavLink>
          <NavLink href="/contact" active={pathname === "/contact"}>Contact</NavLink>
        </ul>

        {/* CTA BUTTON: Velvet Slash Effect (Mini Version) */}
        <Link href="/book">
          <button className="relative px-6 py-3 rounded-full bg-[#Dd1764] text-white text-sm font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5">
            {/* Left Curtain */}
            <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
            
            {/* Right Curtain */}
            <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
            
            {/* Text */}
            <span className="relative z-10 flex items-center gap-2">
              Book Session
            </span>
          </button>
        </Link>

      </nav>
    </header>
  );
}

/* Nav Link Component: Soft Pill Style */
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