"use client";

import { motion } from "framer-motion";

export default function ContactForm() {
  const inputStyles = "w-full px-5 py-4 rounded-2xl bg-white border border-softPurple/30 focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all duration-300 placeholder:text-gray-400 text-primary shadow-sm";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-softPurple/10 border border-white relative overflow-hidden"
    >
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-primary mb-2">Send a Message</h3>
        <p className="text-gray-500 mb-10">We usually respond within 24 hours.</p>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
              <input type="text" placeholder="John Doe" className={inputStyles} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <input type="email" placeholder="john@example.com" className={inputStyles} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Subject</label>
            <input type="text" placeholder="How can we help you?" className={inputStyles} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
            <textarea
              rows={5}
              placeholder="Tell us more about what's on your mind..."
              className={`${inputStyles} resize-none`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-accent/25 text-lg"
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}