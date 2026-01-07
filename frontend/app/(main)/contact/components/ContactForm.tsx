"use client";

import { motion } from "framer-motion";

export default function ContactForm() {

  // Floating Label Input Component
  const FloatingInput = ({ label, type = "text", placeholder, rows }: any) => {
    const isTextarea = !!rows;
    return (
      <div className="relative">
        {isTextarea ? (
          <textarea
            rows={rows}
            placeholder=" "
            className="peer w-full px-5 py-4 rounded-xl bg-white/50 border border-[#3F2965]/10 outline-none focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/5 transition-all duration-300 resize-none font-medium text-[#3F2965] placeholder-transparent"
          />
        ) : (
          <input
            type={type}
            placeholder=" "
            className="peer w-full px-5 py-4 rounded-xl bg-white/50 border border-[#3F2965]/10 outline-none focus:border-[#Dd1764] focus:ring-4 focus:ring-[#Dd1764]/5 transition-all duration-300 font-medium text-[#3F2965] placeholder-transparent"
          />
        )}
        <label
          className="absolute left-5 top-4 text-gray-400 text-sm font-medium transition-all duration-300 
          peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:-translate-y-7 peer-focus:text-xs peer-focus:text-[#Dd1764] peer-focus:font-bold
          peer-[&:not(:placeholder-shown)]:-translate-y-7 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-[#Dd1764] peer-[&:not(:placeholder-shown)]:font-bold"
        >
          {label}
        </label>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="relative"
    >

      {/* Glow Effect Behind Form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-[#3F2965]/10 to-[#Dd1764]/10 blur-[80px] rounded-full -z-10" />

      <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-[#3F2965]/10 border border-white">
        <h3 className="text-2xl font-bold text-[#3F2965] mb-2">Send a Message</h3>
        <p className="text-gray-500 mb-8 text-sm">Fill out the form below and we'll get back to you shortly.</p>

        <form className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatingInput label="Full Name" />
            <FloatingInput label="Email Address" type="email" />
          </div>

          <FloatingInput label="Subject" />

          <FloatingInput label="Tell us more about what's on your mind..." rows={5} />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full relative overflow-hidden group bg-[#3F2965] text-white font-bold py-5 rounded-xl shadow-xl shadow-[#3F2965]/20 hover:shadow-[#3F2965]/40 transition-all duration-300"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#3F2965] to-[#513681] opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#Dd1764] to-[#ff4785] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Send Message
            </span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}