import Script from "next/script";
import "./globals.css";
import Navbar from "./components/common/Navbar";
import { Chatbot } from './components/shared/Chatbot';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Script
          type="module"
          src="https://unpkg.com/@google/model-viewer@latest/dist/model-viewer.min.js"
          strategy="beforeInteractive"
        />
        {children}
        <Chatbot />
      </body>
    </html>
  );
}