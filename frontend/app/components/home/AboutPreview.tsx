"use client";

import Reveal from "../common/Reveal";
import { CharReveal, SlideUp, StaggerContainer, StaggerItem } from "../common/RevealComponent";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
        
        {/* LEFT: TEXT */}
        <div className="max-w-xl">
            
            {/* Heading Construction */}
            <div className="mb-6">
                <SlideUp>
                    <span className="block text-[#Dd1764] font-bold text-sm tracking-wide mb-3 uppercase">
                        About MindSettler
                    </span>
                </SlideUp>
                <div className="text-3xl md:text-4xl font-bold text-[#3F2965] leading-tight">
                    <CharReveal delay={0.1}>
                        Bridging mental health
                    </CharReveal>
                    <CharReveal delay={0.1}>
                        awareness with
                    </CharReveal>
                    <CharReveal delay={0.1} className="text-[#Dd1764]">
                        professional care
                    </CharReveal>
                </div>
            </div>
            
            <SlideUp delay={0.2} className="mb-8">
                <p className="text-xl text-[#3F2965]/70 leading-relaxed font-medium">
                MindSettler was created to bridge the gap between mental health awareness and professional care. We believe that understanding your mind is the first step toward healing.
                </p>
            </SlideUp>

            {/* Checklist Stagger */}
            <StaggerContainer className="space-y-4 mb-10">
              {[
                "Recognize emotional patterns",
                "Understand mental health conditions",
                "Develop healthier coping mechanisms",
                "Experience safe & confidential care"
              ].map((item, i) => (
                <StaggerItem key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#Dd1764]" size={24} />
                  <span className="text-lg text-[#3F2965] font-semibold">{item}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <SlideUp delay={0.4}>
                <button className="relative px-8 py-3.5 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:border-[#3F2965] hover:-translate-y-1">
                    <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                    <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">More About Us</span>
                </button>
            </SlideUp>
        </div>

        {/* RIGHT: IMAGE */}
       <Reveal delay={0.2}>
  <div className="relative">
    {/* Decorative Background Shape */}
    <div className="absolute inset-0 bg-[#F9F6FF] rounded-[3rem] rotate-3 scale-95" />
    
    {/* Main Card Container */}
    <div className="relative bg-[#3F2965] rounded-[3rem] overflow-hidden shadow-2xl h-[500px] flex items-center justify-center group">
        
        {/* 1. THE IMAGE (Background) */}
        <Image 
            src="/assets/therapy.png" // <--- Make sure file matches this path
            alt="Compassionate therapy session"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* 2. THE OVERLAY (Dark Gradient to make text readable) */}
        {/* I lowered opacity to 0.6 so the image shows through better */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3F2965]/90 to-[#2a1b45]/50 mix-blend-multiply" />

        {/* 3. THE TEXT */}
        <h3 className="relative z-10 text-white text-3xl font-bold text-center px-8 leading-snug">
          "Compassion is the heart of <br/> 
          <span className="text-[#Dd1764]">Healing.</span>"
        </h3>
    </div>
  </div>
</Reveal>

      </div>
    </section>
  );
}