"use client";

import { motion } from "framer-motion";
import { CalendarCheck, ShieldCheck, Video, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      icon: CalendarCheck,
      step: "01",
      title: "Book Your Slot",
      desc: "Browse available times and choose between Online or In-Person sessions based on your comfort.",
    },
    {
      icon: ShieldCheck,
      step: "02",
      title: "Secure Your Spot",
      desc: "Confirm your booking securely via UPI. Your privacy and data are 100% protected.",
    },
    {
      icon: Video,
      step: "03",
      title: "Join the Session",
      desc: "Receive a Google Meet link for online calls, or visit our calm studio for offline therapy.",
    },
    {
      icon: Sparkles,
      step: "04",
      title: "Begin Healing",
      desc: "Step into a non-judgmental space designed to help you find clarity, peace, and growth.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    
    <section className="pt-20 pb-24 relative overflow-hidden bg-[#F9F6FF]" id="howitworks">
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 relative">

        {}
        <div className="text-center mb-16 md:mb-20">
          

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-[#3F2965]"
          >
            Your Journey to 
            {}
            <span className="text-[#Dd1764] italic font-serif ml-2">Wellness</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-[#3F2965]/60 max-w-2xl mx-auto text-lg"
          >
            We've made starting therapy as easy as possible. Four simple steps to reclaim your peace of mind.
          </motion.p>
        </div>

        {}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
        >
          {}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 border-t-2 border-dashed border-[#3F2965]/10 -z-10 mt-8" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              {}
              <div className="bg-white rounded-[2rem] p-8 border border-[#3F2965]/5 shadow-lg shadow-[#3F2965]/5 hover:shadow-xl hover:shadow-[#3F2965]/10 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center text-center">

                {}
                <div className="absolute top-6 right-6 text-4xl font-black text-[#F9F6FF] group-hover:text-[#3F2965]/5 transition-colors select-none">
                  {step.step}
                </div>

                {}
                <div className="w-20 h-20 rounded-2xl bg-[#F9F6FF] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#3F2965] group-hover:text-white transition-all duration-300 text-[#3F2965] shadow-inner">
                  <step.icon size={32} strokeWidth={1.5} />
                </div>

                {}
                <h3 className="text-xl font-bold text-[#3F2965] mb-3 group-hover:text-[#Dd1764] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[#3F2965]/60 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link href="/book" className="inline-flex">
          <button
            className="relative inline-flex items-center gap-2 px-8 py-4 rounded-xl 
                      bg-[#Dd1764] text-white font-bold text-lg tracking-wide 
                      overflow-hidden group transition-all duration-300 
                      hover:-translate-y-1 hover:shadow-lg hover:shadow-[#3F2965]/20"
          >
            {}
            <span
              className="absolute top-0 left-[-25%] w-[80%] h-full 
                        bg-gradient-to-r from-[#3F2965] to-[#513681] 
                        -skew-x-12 -translate-x-full 
                        group-hover:translate-x-0 
                        transition-transform duration-500 ease-out origin-left"
            />

            {}
            <span
              className="absolute top-0 right-[-25%] w-[80%] h-full 
                        bg-gradient-to-l from-[#3F2965] to-[#513681] 
                        -skew-x-12 translate-x-full 
                        group-hover:translate-x-0 
                        transition-transform duration-500 ease-out origin-right"
            />

            {}
            <span className="relative z-10 flex items-center gap-2">
              Book Your Session Now
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </Link>

          
          <p className="mt-4 text-xs font-medium text-[#3F2965]/40 uppercase tracking-wider">
            No Hidden Fees • Instant Confirmation
          </p>
        </motion.div>

      </div>
    </section>
  );
}