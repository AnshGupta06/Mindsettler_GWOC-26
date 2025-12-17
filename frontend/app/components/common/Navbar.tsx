"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-[#3F2965]/10">
      <nav className="max-w-7xl mx-auto px-24 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-xl font-semibold text-[#3F2965]">
          MindSettler
        </div>

        {/* Links */}
        <div className="flex items-center gap-10 text-sm text-[#3F2965]/80">
          <Link href="#">About</Link>
          <Link href="#">Journey</Link>
          <Link href="#">Sessions</Link>
          <Link href="#">Resources</Link>
          <Link href="#">Contact</Link>
        </div>

      </nav>
    </header>
  );
}
