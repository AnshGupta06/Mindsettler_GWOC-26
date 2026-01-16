"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LoaderProps {
  fullScreen?: boolean;
  message?: string; 
}

export default function Loader({ fullScreen = true, message = "Loading..." }: LoaderProps) {
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-white z-[9999] ${
        fullScreen ? "fixed inset-0" : "w-full h-full min-h-[300px]"
      }`}
    >
      <div className="relative flex items-center justify-center w-32 h-32">
        
        {}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3F2965]/10 to-[#Dd1764]/10 rounded-full blur-xl animate-pulse" />

        {}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-[3px] border-t-[#3F2965] border-r-[#3F2965]/20 border-b-[#3F2965]/5 border-l-[#3F2965]/20"
        />

        {}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border-[3px] border-t-transparent border-r-[#Dd1764] border-b-transparent border-l-transparent"
        />

        {}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-16 h-16 flex items-center justify-center"
        >
          <Image 
            src="/assets/logo.png" 
            alt="Loading..." 
            width={64} 
            height={64} 
            className="object-contain w-full h-full drop-shadow-sm"
            priority 
          />
        </motion.div>
      </div>

      {}
      <motion.p 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 text-xs font-bold text-[#3F2965] tracking-[0.2em] uppercase"
      >
        {message}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          ...
        </motion.span>
      </motion.p>
    </div>
  );
}