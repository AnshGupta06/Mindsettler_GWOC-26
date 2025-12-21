"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { CharReveal, SlideUp, StaggerContainer, StaggerItem } from "../common/RevealComponent";

export default function FAQSection() {
  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 bg-white">
      
      {/* Container */}
      <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-2xl sm:rounded-3xl md:rounded-[3rem] px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#3F2965]/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
            
            {/* Header */}
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
                 <SlideUp>
                    <span className="block text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3 uppercase">
                        FAQs
                    </span>
                 </SlideUp>
                 <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3F2965]">
                    <CharReveal delay={0.1} className="justify-center">
                        Common questions, answered
                    </CharReveal>
                 </div>
            </div>

            {/* STAGGERED LIST */}
            <StaggerContainer className="space-y-4 sm:space-y-6">
                {faqs.map((faq, index) => (
                    <StaggerItem key={index}>
                        <FAQItem question={faq.question} answer={faq.answer} />
                    </StaggerItem>
                ))}
            </StaggerContainer>

            <SlideUp delay={0.4} className="mt-10 sm:mt-12 md:mt-16 text-center">
                <button className="w-full sm:w-auto relative px-8 sm:px-10 py-3 sm:py-4 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:border-[#3F2965] hover:-translate-y-1">
                    <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                    <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">View All FAQs</span>
                </button>
            </SlideUp>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-2xl sm:rounded-[20px] transition-all duration-300 ${open ? "bg-white shadow-xl shadow-[#3F2965]/5" : "bg-white/50 hover:bg-white"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start sm:items-center justify-between gap-4 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-left"
      >
        <span className={`text-base sm:text-lg md:text-xl font-bold transition-colors ${open ? "text-[#Dd1764]" : "text-[#3F2965]"}`}>
          {question}
        </span>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open ? "bg-[#Dd1764] text-white" : "bg-[#3F2965]/5 text-[#3F2965]"}`}>
            {open ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 text-[#3F2965]/70 text-sm sm:text-base md:text-lg leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    question: "How do I book a session with MindSettler?",
    answer: "You can book a session by selecting an available online or offline consultation slot through our booking page. Once submitted, your appointment will be confirmed by our team.",
  },
  {
    question: "Are online therapy sessions as effective?",
    answer: "Yes. Online therapy sessions are structured to provide the same level of professional care and confidentiality as offline sessions, allowing flexibility without compromising quality.",
  },
  {
    question: "Is my information kept confidential?",
    answer: "Absolutely. All sessions are conducted in a safe and confidential environment, following ethical guidelines and respecting your privacy at every step.",
  },
];