import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#3F2965] text-white/80">
      <div className="max-w-7xl mx-auto px-24 py-24">

        <div className="grid grid-cols-4 gap-16">

          {/* Brand */}
          <div>
            <div className="text-xl font-semibold text-white mb-4">
              MindSettler
            </div>
            <p className="text-sm leading-relaxed">
              A psycho-education and mental well-being platform focused on
              awareness, understanding, and guided support.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white mb-4">Navigate</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Journey</Link></li>
              <li><Link href="#">Sessions</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Confidentiality Policy</Link></li>
              <li><Link href="#">Non-Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Contact</h4>
            <p className="text-sm">
              Email: support@mindsettler.in<br />
              Sessions: Online & Offline
            </p>
          </div>

        </div>

        {/* Bottom line */}
        <div className="mt-20 border-t border-white/20 pt-8 text-sm flex justify-between">
          <span>© {new Date().getFullYear()} MindSettler</span>
          <span>All rights reserved</span>
        </div>

      </div>
    </footer>
  );
}
