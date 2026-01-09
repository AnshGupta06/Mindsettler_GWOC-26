"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";
import { CharReveal, SlideUp } from "../common/RevealComponent";

export default function FAQSection() {
  const faqs = [
    {
      question: "What is the difference between therapy and psycho-education?",
      answer: "Therapy focuses on treating mental health conditions and deep emotional healing. Psycho-education is about teaching you how your mind works, giving you the tools and knowledge to understand your own patterns."
    },
    {
      question: "Are the sessions confidential?",
      answer: "Absolutely. We adhere to strict ethical guidelines. Everything shared in a session remains 100% confidential, except in cases where there is a risk of harm to self or others."
    },
    {
      question: "Can I switch between online and offline sessions?",
      answer: "Yes! We offer a hybrid model. You can book an in-person session one week and an online session the next, depending on your schedule and comfort."
    },
    {
      question: "How do I know if I need therapy?",
      answer: "If you are feeling overwhelmed, stuck, or finding it hard to cope with daily life, therapy can help. You don't need to be in a crisis to seek support; it's also great for personal growth."
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-[#F9F6FF] relative overflow-hidden">
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 relative z-10">

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">

          {/* LEFT: Header */}
          <div className="lg:col-span-4 text-center lg:text-left">
            <SlideUp>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#3F2965]/10 shadow-sm text-[#Dd1764] font-bold text-xs uppercase tracking-widest mb-6">
                <HelpCircle size={14} /> Common Questions
              </div>
            </SlideUp>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3F2965] leading-tight mb-6">
              <div>
                <CharReveal delay={0.1}>
                  Clarity Before
                </CharReveal>
              </div>
              <div className="text-[#Dd1764] italic font-serif mt-1">
                <CharReveal delay={0.2}>
                  Commitment
                </CharReveal>
              </div>
            </h2>

            <SlideUp delay={0.3}>
              <p className="text-lg text-[#3F2965]/70 mb-8 font-medium">
                We know starting therapy can bring up a lot of questions. Here are clear answers to help you feel ready.
              </p>
            </SlideUp>
          </div>

          {/* RIGHT: Accordion & Button */}
          <div className="lg:col-span-8">
            <div className="space-y-4 mb-8">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </div>

            {/* View All Button */}
            <SlideUp delay={0.5} className="flex justify-center lg:justify-start">
              <Link href="/faqs">
                <button className="group flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] font-bold text-sm hover:bg-[#3F2965] hover:text-white hover:border-[#3F2965] transition-all duration-300">
                  View All FAQs
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </SlideUp>
          </div>

        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, index }: { faq: { question: string; answer: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SlideUp delay={0.1 * index} className="w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${
          isOpen 
            ? "bg-white border-[#Dd1764]/30 shadow-lg shadow-[#3F2965]/5" 
            : "bg-white border-[#3F2965]/10 hover:border-[#3F2965]/30 hover:shadow-md"
        }`}
      >
        <div className="p-6 flex items-start justify-between gap-4">
          <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
            isOpen ? "text-[#Dd1764]" : "text-[#3F2965]"
          }`}>
            {faq.question}
          </h3>
          <div className={`flex-shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? "bg-[#Dd1764] text-white rotate-180" : "bg-[#F9F6FF] text-[#3F2965] group-hover:bg-[#3F2965] group-hover:text-white"
          }`}>
            {isOpen ? <Minus size={18} /> : <Plus size={18} />}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-6 pb-6 text-[#3F2965]/70 leading-relaxed font-medium">
                {faq.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SlideUp>
  );
}