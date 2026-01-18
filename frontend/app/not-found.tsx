"use client";
import "./globals.css"; 
import Link from "next/link";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9F6FF] relative overflow-hidden px-6">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#3F2965]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#Dd1764]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-lg w-full text-center">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-[#3F2965]/5 flex items-center justify-center mx-auto mb-8 border border-[#3F2965]/10"
        >
          <FileQuestion size={48} className="text-[#Dd1764] stroke-[1.5]" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-6xl font-black text-[#3F2965] mb-2 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-[#3F2965]/80 mb-4">Page Not Found</h2>
          <p className="text-[#3F2965]/60 mb-8 leading-relaxed">
            Mindfulness is about being present, but it seems the page you are looking for is absent. Let's guide you back to a safe space.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button onClick={() => window.history.back()} className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#3F2965]/10 text-[#3F2965] font-bold text-sm hover:bg-[#3F2965]/5 transition-all flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Go Back
          </button>
          
          <Link href="/" className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#3F2965] text-white font-bold text-sm shadow-lg shadow-[#3F2965]/20 hover:bg-[#2a1b45] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
            <Home size={16} /> Return Home
          </Link>
        </motion.div>

      </div>

      <div className="absolute bottom-8 text-center w-full text-[10px] text-[#3F2965]/30 font-bold tracking-widest uppercase">
        MindSettler © {new Date().getFullYear()}
      </div>
    </div>
  );
}