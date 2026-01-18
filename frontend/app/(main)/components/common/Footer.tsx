import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Shield, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#3F2965] text-white/80 overflow-hidden font-sans">

      <div className="absolute top-0 left-0 w-full h-16 sm:h-24 bg-[#F9F6FF] rounded-b-[100%] translate-y-[-50%]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 pt-20 sm:pt-24 lg:pt-28 pb-10 sm:pb-12">

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-10 pb-12 sm:pb-16 border-b border-white/10">

          <div className="max-w-lg w-full sm:w-auto">
            <Link href="/" className="inline-block mb-5 sm:mb-6">
              <div className="relative rounded-xl flex items-center justify-start overflow-hidden py-2 pr-4">
                <Image
                  src="/assets/Mindsettler-logo.webp"
                  alt="MindSettler Logo"
                  width={180}
                  height={50}
                  className="object-contain w-[130px] sm:w-[140px] md:w-[180px] invert opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/70 font-medium pr-4 sm:pr-0">
              A psycho-education and mental well-being practice dedicated to helping
              you understand your mind, build emotional clarity, and access structured,
              ethical care in a safe and compassionate space.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
            <div className="space-y-1">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/50 font-bold">
                Ready to begin?
                </span>
                <p className="text-white font-bold text-base sm:text-lg">Start your journey today.</p>
            </div>
            <Link
              href="/book"
              className="w-full sm:w-auto whitespace-nowrap inline-flex justify-center items-center gap-2 rounded-full bg-white text-[#3F2965] text-sm font-bold px-6 sm:px-8 py-3 sm:py-3.5 shadow-xl hover:bg-[#f3ecff] transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a Session <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 lg:gap-12 pt-12 sm:pt-16">

          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-4 sm:mb-6 opacity-90">
              Company
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-sm text-white/60">
              {[
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Our Services" },
                { href: "/corporate", label: "Corporate Wellness" },
                { href: "/contact", label: "Contact Us" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white hover:translate-x-1 transition-all inline-block py-0.5">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-4 sm:mb-6 opacity-90">
              Resources
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-sm text-white/60">
              {[
                { href: "/awareness", label: "Awareness Blog" },
                { href: "/resource", label: "Resource Library" },
                { href: "/faqs", label: "Freq. Questions" },
                { href: "/#journey", label: "Your Journey" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white hover:translate-x-1 transition-all inline-block py-0.5">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-4 sm:mb-6 opacity-90">
              Legal
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-sm text-white/60">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/confidentiality", label: "Confidentiality" },
                { href: "/refund-policy", label: "Refund Policy" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white hover:translate-x-1 transition-all inline-block py-0.5">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.2em] uppercase mb-4 sm:mb-6 opacity-90">
              The Practice
            </h4>
            <div className="space-y-4 sm:space-y-5 text-sm text-white/60">
                
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-1 text-[#Dd1764] shrink-0" />
                <a
                    href="mailto:support@mindsettler.in"
                    className="hover:text-white transition-colors leading-relaxed break-all"
                >
                    support@mindsettler.in
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-[#Dd1764] shrink-0" />
                <p className="leading-relaxed">
                    Based in India.<br/>
                    <span className="text-xs opacity-70">Online & Offline.</span>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Shield size={16} className="mt-1 text-[#Dd1764] shrink-0" />
                <p className="leading-relaxed text-xs">
                    Led by <strong>Parnika Bajaj</strong><br/>
                    Psychotherapist & Trauma-Informed Practitioner.
                </p>
              </div>
              
              <div className="flex items-center gap-3 pt-3">
                <a 
                  href="https://www.instagram.com/mindsettlerbypb/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#Dd1764] hover:text-white transition-all hover:-translate-y-1"
                  aria-label="Instagram"
                >
                    <Instagram size={20} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/parnika-bajaj-190719195" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#0077b5] hover:text-white transition-all hover:-translate-y-1"
                  aria-label="LinkedIn"
                >
                    <Linkedin size={20} />
                </a>
              </div>

            </div>
          </div>

        </div>

        <div className="mt-16 sm:mt-20 pt-8 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-4 sm:p-5 mb-8 text-center sm:text-left">
                <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed max-w-4xl mx-auto sm:mx-0">
                    <strong className="text-white/80">Crisis Disclaimer:</strong> This platform is designed for psycho-education and structured counseling. 
                    It is <span className="text-[#Dd1764] font-bold">not</span> intended for crisis or emergency support. 
                    If you are in immediate danger or experiencing a medical emergency, please contact your local emergency services 
                    (112 in India) or visit the nearest hospital immediately.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs font-medium text-white/40">
                <p>© {new Date().getFullYear()} MindSettler. All rights reserved.</p>
                <div className="flex items-center gap-4 sm:gap-6">
                    <span>Designed for clarity.</span>
                    <span>Built with care.</span>
                </div>
            </div>
        </div>

      </div>
    </footer>
  );
}