import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="relative bg-[#3F2965] text-white/80 overflow-hidden">

      {/* Curved top shape */}
      <div className="absolute top-0 left-0 w-full h-24 bg-white rounded-b-[100%] translate-y-[-50%]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 pt-28 pb-16 lg:pb-20">

        {/* Brand + CTA */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 z-50">
              <div className="relative rounded-xl flex items-center justify-center overflow-hidden py-2 px-3">
                <Image
                  src="/assets/Mindsettler-logo.png"
                  alt="MindSettler Logo"
                  width={140}
                  height={1}
                  className="object-contain w-[120px] md:w-[170px] invert"
                />
              </div>
            </Link>
            <p className="max-w-xl text-sm leading-relaxed text-white/70">
              A psycho-education and mental well-being practice dedicated to helping
              you understand your mind, build emotional clarity, and access structured,
              ethical care in a safe and compassionate space.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">
              Ready to begin?
            </span>
            <Link
              href="/book"
              className="inline-flex items-center rounded-full bg-white text-[#3F2965] text-sm font-semibold px-7 py-3 shadow-lg hover:bg-[#f3ecff] transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a Session
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pt-12">

          {/* Navigate */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-[0.14em] uppercase mb-5">
              Navigate
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              {[
                { href: "/about", label: "About" },
                { href: "/#journey", label: "Journey" },
                { href: "/services", label: "Services" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-[0.14em] uppercase mb-5">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/confidentiality", label: "Confidentiality Policy" },
                { href: "/refunds", label: "Non-Refund Policy" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-[0.14em] uppercase mb-5">
              Contact
            </h4>
            <p className="text-sm text-white/70 mb-4 leading-relaxed">
              Email:{" "}
              <a
                href="mailto:support@mindsettler.in"
                className="hover:text-white underline underline-offset-4 decoration-white/40"
              >
                support@mindsettler.in
              </a>
              <br />
              Sessions available online & offline.
            </p>
            <p className="text-xs text-white/50 leading-relaxed">
              Not for crisis or emergency use. If you are in immediate danger,
              please contact local emergency services or a trusted helpline.
            </p>
          </div>

          {/* Practice */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-[0.14em] uppercase mb-5">
              Practice
            </h4>
            <p className="text-sm text-white/70 mb-3 leading-relaxed">
              Based in India • Supporting individuals and organizations seeking
              structured, ethical mental health care.
            </p>
            <p className="text-xs text-white/50 leading-relaxed">
              Led by psychotherapist Parnika Bajaj, specialising in psycho-education
              and trauma-informed care.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-white/15 pt-6 text-xs sm:text-sm flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between text-white/50">
          <span>© {new Date().getFullYear()} MindSettler. All rights reserved.</span>
          <span>Designed for clarity, not for crisis support.</span>
        </div>

      </div>
    </footer>
  );
}
