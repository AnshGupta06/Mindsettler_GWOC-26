import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3F2965] text-white/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-24 py-16 lg:py-20">
        {/* Top CTA / Brand Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
                MS
              </div>
              <span className="text-lg font-semibold text-white tracking-wide">
                MindSettler
              </span>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-white/70">
              A psycho-education and mental well-being practice helping you understand your mind,
              build emotional clarity, and access structured, ethical care.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-xs uppercase tracking-[0.18em] text-white/60">
              Ready to begin?
            </span>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#3F2965] text-sm font-medium px-6 py-2 shadow-[0_14px_30px_rgba(0,0,0,0.35)] hover:bg-[#ffe4f1] hover:text-[#26173f] transition-colors"
            >
              Book a Session
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 pt-12">

          {/* Explore */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-[0.14em] uppercase mb-4">
              Navigate
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#journey" className="hover:text-white transition-colors">
                  Journey
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-[0.14em] uppercase mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/confidentiality" className="hover:text-white transition-colors">
                  Confidentiality Policy
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-white transition-colors">
                  Non‑Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-[0.14em] uppercase mb-4">
              Contact
            </h4>
            <p className="text-sm text-white/70 mb-4">
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
            <p className="text-xs text-white/50">
              Not for crisis or emergency use. If you are in immediate danger,
              please contact your local emergency services or a trusted helpline.
            </p>
          </div>

          {/* Location / Practice Info */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-[0.14em] uppercase mb-4">
              Practice
            </h4>
            <p className="text-sm text-white/70 mb-3">
              Based in India • Serving individuals and organizations seeking
              structured, ethical mental health support.
            </p>
            <p className="text-xs text-white/50">
              Practice led by psychotherapist Parnika Bajaj, specialising in
              psycho-education and trauma‑informed care.
            </p>
          </div>

        </div>

        {/* Bottom line */}
        <div className="mt-12 border-t border-white/15 pt-6 text-xs sm:text-sm flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center justify-between text-white/50">
          <span>© {new Date().getFullYear()} MindSettler. All rights reserved.</span>
          <span>Designed for clarity, not for crisis support.</span>
        </div>

      </div>
    </footer>
  );
}
