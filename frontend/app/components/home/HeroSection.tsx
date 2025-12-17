"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center px-24">
      <div className="grid grid-cols-2 gap-16 w-full">
        {/* Text Area */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="h-6 w-32 bg-[#Dd1764]/20 rounded mb-6" />
          <div className="h-16 w-full bg-[#3F2965]/20 rounded mb-4" />
          <div className="h-10 w-3/4 bg-[#3F2965]/10 rounded" />
        </motion.div>

        {/* GLB Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <div className="w-[420px] h-[420px] rounded-full bg-[#3F2965]/10" />
        </motion.div>
      </div>
    </section>
  );
}
