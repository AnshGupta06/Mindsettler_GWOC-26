"use client";

import { motion } from "framer-motion";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import { CharReveal } from "@/app/(main)/components/common/RevealComponent";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-[#fafafa] pb-20 pt-32 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-softPurple/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />

      <section className="container mx-auto px-6 mb-16 text-center">
        <div className="flex justify-center">
          <CharReveal 
            delay={0.1} 
            className="text-4xl md:text-6xl font-extrabold text-primary leading-tight tracking-tight"
          >
            We&apos;d Love to Hear From You
          </CharReveal>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
        >
          Have questions or just want to chat? We are here to listen and help you on your journey to mental wellness.
        </motion.p>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-10">
            <ContactInfo />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-softPurple/20 shadow-sm"
            >
              <h4 className="font-bold text-primary text-xl mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Need immediate support?
              </h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                If you or someone you know is in crisis, please reach out to our emergency services immediately.
              </p>
              <a 
                href="/services" 
                className="inline-flex items-center text-accent font-bold hover:gap-3 transition-all group"
              >
                View Services 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </a>
            </motion.div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}