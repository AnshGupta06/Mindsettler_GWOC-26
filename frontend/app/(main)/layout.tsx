import Script from "next/script";
import Navbar from "./components/common/Navbar";
import { Chatbot } from '../components/shared/Chatbot';
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Import the font here
import ToastProvider from "./components/common/ToastProvider";
import Footer from "./components/common/Footer";
import SessionTimeout from "../(auth)/login/components/SessionTimeout";
import "../globals.css";

export const metadata: Metadata = {
  // 1. Base URL for resolving relative links (CRITICAL for OG images)
  metadataBase: new URL('https://mindsettler-bypb.vercel.app'), // Replace with your actual domain
  
  // 2. Default Title & Template
  title: {
    default: "Mindsettler | Heal Your Mind and Soul",
    template: "%s | Mindsettler" // Child pages will look like: "About Us | Mindsettler"
  },
  description: "A personalized journey designed for your healing and growth. Bridge the gap between professional therapy and self-understanding.",
  
  // 3. Keywords
  keywords: ["Mental Health", "Therapy", "Healing", "Psychology", "Mindfulness", "Trauma Recovery"],
  
  verification: {
    google: "BOgPVkaVqQRx3eiwW7UEw9Gw0mcVfdN6yg4n-xLngFA",
  },

  // 4. Open Graph (Facebook, LinkedIn, Discord)
  openGraph: {
    title: "Mindsettler | Heal Your Mind and Soul",
    description: "A personalized journey designed for your healing and growth.",
    url: 'https://mindsettler-bypb.vercel.app',
    siteName: 'Mindsettler',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/Mindsettler.png', // Add a 1200x630px image to your public folder
        width: 1200,
        height: 630,
        alt: 'Mindsettler Preview',
      },
    ],
  },

  // 5. Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: "Mindsettler | Heal Your Mind and Soul",
    description: "A personalized journey designed for your healing and growth.",
    images: ['/og-image.jpg'],
  },

  // 6. Robots (Ensure Google can see you)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Configure the font
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta", // Create a CSS variable
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "Mindsettler",
    "url": "https://mindsettler-bypb.vercel.app", // Update with your actual domain
    "logo": "https://www.mindsettler.com/logo.png", // Update with your actual logo URL
    "sameAs": [
      "https://instagram.com/yourprofile", // Update these links
      "https://linkedin.com/company/yourprofile"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX", // Update phone number
      "contactType": "customer service"
    }
  };

  return (
    <html lang="en">
      {/* Apply the font variable and className to body */}
      <body className={`${jakarta.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <Navbar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer@latest/dist/model-viewer.min.js"
          strategy="beforeInteractive"
        />
        <SessionTimeout />
        <ToastProvider />
        {children}
        <Chatbot />
        <Footer />
      </body>
    </html>
  );
}