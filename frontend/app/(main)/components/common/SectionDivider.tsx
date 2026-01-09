"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export default function SectionDivider() {
  return (
    <div className="relative w-full h-32 sm:h-40 overflow-hidden flex items-center justify-center -my-2 z-20 pointer-events-none">
      
      {/* Main Gradient Wave Lines */}
      <svg
        className="w-full h-full absolute top-0 left-0"
        viewBox="0 0 1440 160"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* PRIMARY WAVE (PINK)
            Direction: Left -> Right
            Shape: Starts by going DOWN
        */}
        <motion.path
          d="M0,80 C320,120 420,40 720,80 C1020,120 1120,40 1440,80 C1760,120 1860,40 2160,80 C2460,120 2560,40 2880,80"
          stroke="#Dd1764"
          strokeWidth="2.5"
          strokeOpacity="0.4"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0, x: -1440 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0 }} // Starts IMMEDIATELY upon entering screen
          animate={{ 
            x: [-1440, 0] 
          }} 
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut" }, // Snappy Reveal
            x: { duration: 10, repeat: Infinity, ease: "linear" } // Synced Flow
          }}
        />
        
        {/* SECONDARY WAVE (PURPLE)
            Direction: Left -> Right
            Shape: OPPOSITE (Starts by going UP)
        */}
        <motion.path
          d="M0,80 C320,40 420,120 720,80 C1020,40 1120,120 1440,80 C1760,40 1860,120 2160,80 C2460,40 2560,120 2880,80"
          stroke="#3F2965"
          strokeWidth="1.5"
          strokeOpacity="0.3"
          strokeDasharray="10 10" 
          initial={{ pathLength: 0, opacity: 0, x: -1440 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0 }} // Starts IMMEDIATELY upon entering screen
          animate={{
            x: [-1440, 0],
            strokeDashoffset: [0, -20]
          }}
          transition={{ 
            pathLength: { duration: 3, ease: "easeInOut" }, // Slightly slower than pink for depth
            x: { duration: 10, repeat: Infinity, ease: "linear" }, // Synced Flow (Same as pink)
            strokeDashoffset: { duration: 0.5, repeat: Infinity, ease: "linear" }
          }}
        />
        
        {/* Accent Dots */}
        {[20, 50, 80].map((percent, i) => (
          <motion.circle
            key={percent}
            cx={`${percent}%`}
            cy="80"
            r="3"
            fill="#Dd1764"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.8 }}
            viewport={{ once: true, amount: 0 }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              delay: 0.5 + (i * 0.2), // Reduced delay for faster appearance
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ))}
      </svg>

      {/* Enhanced Central Icon */}
      <motion.div 
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }} // Reduced delay
        className="relative z-10 w-12 h-12 sm:w-14 sm:h-14"
      >
        <div className="absolute inset-0 rounded-full bg-[#Dd1764]/10 animate-spin-slow" />
        <div className="absolute inset-1 rounded-full bg-white/95 backdrop-blur-sm border border-[#3F2965]/10 shadow-lg flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[#Dd1764]/20"
          />
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[#Dd1764]" />
        </div>
      </motion.div>

    </div>
  );
}