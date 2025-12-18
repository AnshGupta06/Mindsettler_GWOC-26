"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header
      className="w-full px-24 py-5 bg-gradient-to-b from-[#f0e7ff] via-[#ffe3f1] to-[#f5ecff] border-b border-[#3F2965]/10"
    >
      <nav
        className="flex items-center justify-between max-w-7xl mx-auto rounded-2xl border border-white/70 bg-white/80 backdrop-blur-md px-8 py-3 shadow-[0_18px_45px_rgba(63,41,101,0.06)]"
      >

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3F2965]/10 flex items-center justify-center">
            {/* Logo Placeholder */}
            <span className="text-[#3F2965] font-semibold">
              MS
            </span>
          </div>
          <span className="text-xl font-semibold text-[#3F2965]">
            MindSettler
          </span>
        </div>

        {/* NAV LINKS */}
        <ul className="flex items-center gap-10 text-[#3F2965]/80 font-medium">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/services">Services</NavLink>
          <NavLink href="/resources">Resources</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </ul>

        {/* CTA */}
        <Link
          href="/book"
          className="px-6 py-2.5 rounded-lg bg-[#dd1764] text-white font-medium shadow-sm hover:bg-[white] hover:text-[#3f2965] hover:shadow-md transition"
        >
          Book Session
        </Link>
      </nav>
    </header>
  );
}

/* Nav Link Component */
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative group">
      <Link href={href} className="transition-colors group-hover:text-[#3F2965]">
        {children}
      </Link>

      {/* Hover underline */}
      <span
        className="
          absolute
          left-0
          -bottom-1
          h-[2px]
          w-0
          bg-[#dd1764]
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </li>
  );
}
