"use client";

import { Building2 } from "lucide-react";
import { CharReveal, SlideUp } from "../common/RevealComponent";

export default function WorkplaceWellnessSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

        {/* Icon: Slide Up */}
        <SlideUp>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#F9F6FF] text-[#Dd1764] mb-8 shadow-sm">
            <Building2 size={48} strokeWidth={1.5} />
          </div>
        </SlideUp>

        {/* Heading Area */}
        <div className="mb-6 flex flex-col items-center">
            {/* Label */}
            <SlideUp delay={0.1}>
                <span className="block text-[#Dd1764] font-bold text-sm tracking-wide mb-3 uppercase">
                    Corporate & Organizational Care
                </span>
            </SlideUp>
            
            {/* Title: Alphabet Reveal */}
            <div className="flex flex-wrap justify-center gap-x-2 text-3xl md:text-5xl font-bold text-[#3F2965]">
                <CharReveal delay={0.2}>
                    Wellness solutions for
                </CharReveal>
                <CharReveal delay={0.2} className="text-[#Dd1764]">
                    healthier workplaces
                </CharReveal>
            </div>
        </div>

        {/* Paragraph */}
        <SlideUp delay={0.3} className="mb-12">
          <p className="text-xl text-[#3F2965]/70 leading-relaxed max-w-2xl mx-auto font-medium">
            We partner with organizations to foster mentally healthy and productive work environments through workshops, group sessions, and collaborative programs.
          </p>
        </SlideUp>

        {/* Button */}
        <SlideUp delay={0.4}>
          <button className="relative px-10 py-4 rounded-full bg-[#Dd1764] text-white font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
                <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                <span className="relative z-10 flex items-center gap-2">Explore Corporate Services</span>
          </button>
        </SlideUp>
      </div>
    </section>
  );
}