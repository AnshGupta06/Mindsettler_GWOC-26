import Script from "next/script";
import Navbar from "./components/common/Navbar";
import { Chatbot } from '../components/shared/Chatbot';
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; 
import ToastProvider from "./components/common/ToastProvider";
import Footer from "./components/common/Footer";
import SessionTimeout from "../(auth)/login/components/SessionTimeout";
import "../globals.css";

export const metadata: Metadata = {
  
  metadataBase: new URL('https://mindsettler-bypb.vercel.app'), 
  
  
  title: {
    default: "Mindsettler | Heal Your Mind and Soul",
    template: "%s | Mindsettler" 
  },
  description: "A personalized journey designed for your healing and growth. Bridge the gap between professional therapy and self-understanding.",
  
  
  keywords: ["Mental Health", "Therapy", "Healing", "Psychology", "Mindfulness", "Trauma Recovery"],
  
  verification: {
    google: "BOgPVkaVqQRx3eiwW7UEw9Gw0mcVfdN6yg4n-xLngFA",
  },

  
  openGraph: {
    title: "Mindsettler | Heal Your Mind and Soul",
    description: "A personalized journey designed for your healing and growth.",
    url: 'https://mindsettler-bypb.vercel.app',
    siteName: 'Mindsettler',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/Mindsettler.webp', 
        width: 1200,
        height: 630,
        alt: 'Mindsettler Preview',
      },
    ],
  },

  
  twitter: {
    card: 'summary_large_image',
    title: "Mindsettler | Heal Your Mind and Soul",
    description: "A personalized journey designed for your healing and growth.",
    images: ['/og-image.webp'],
  },

  
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


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta", 
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
    "url": "https://mindsettler-bypb.vercel.app", 
    "logo": "https://www.mindsettler.com/logo.webp", 
    "sameAs": [
      "https://instagram.com/yourprofile", 
      "https://linkedin.com/company/yourprofile"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9974631313", 
      "contactType": "customer service"
    }
  };

  return (
    <html lang="en">
      {}
      <body className={`${jakarta.variable} font-sans antialiased bg-[#F9F6FF] text-slate-900`}>
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