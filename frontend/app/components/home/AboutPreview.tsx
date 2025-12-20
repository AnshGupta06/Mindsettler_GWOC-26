"use client";

import Reveal from "../common/Reveal";
import { CharReveal, SlideUp, StaggerContainer, StaggerItem, ImageWipeReveal } from "../common/RevealComponent";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">
        
        {/* LEFT: TEXT */}
        <div className="max-w-xl mx-auto lg:mx-0">
            
            {/* Heading Construction */}
            <div className="mb-6">
                <SlideUp>
                    <span className="block text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3 uppercase">
                        About MindSettler
                    </span>
                </SlideUp>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3F2965] leading-tight space-y-1">
                    <div>
                        <CharReveal delay={0.1}>
                            Bridging mental health
                        </CharReveal>
                    </div>
                    <div>
                        <CharReveal delay={0.1}>
                            awareness with
                        </CharReveal>
                    </div>
                    <div className="text-[#Dd1764]">
                        <CharReveal delay={0.1}>
                            professional care
                        </CharReveal>
                    </div>
                </div>
            </div>
            
            <SlideUp delay={0.2} className="mb-6 sm:mb-8">
                <p className="text-base sm:text-lg md:text-xl text-[#3F2965]/70 leading-relaxed font-medium">
                MindSettler was created to bridge the gap between mental health awareness and professional care. We believe that understanding your mind is the first step toward healing.
                </p>
            </SlideUp>

            {/* Checklist Stagger */}
            <StaggerContainer className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
              {[
                "Recognize emotional patterns",
                "Understand mental health conditions",
                "Develop healthier coping mechanisms",
                "Experience safe & confidential care"
              ].map((item, i) => (
                <StaggerItem key={i} className="flex items-start sm:items-center gap-2 sm:gap-3">
                  <CheckCircle2 className="text-[#Dd1764] flex-shrink-0 mt-0.5 sm:mt-0" size={20} />
                  <span className="text-sm sm:text-base md:text-lg text-[#3F2965] font-semibold">{item}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <SlideUp delay={0.4}>
                <button className="w-full sm:w-auto relative px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:border-[#3F2965] hover:-translate-y-1">
                    <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                    <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">More About Us</span>
                </button>
            </SlideUp>
        </div>

        {/* RIGHT: IMAGE */}
      <Reveal delay={0.2}>
  <div className="relative px-4 sm:px-0">
    {/* Decorative Background Shape */}
    <div className="absolute inset-0 bg-[#F9F6FF] rounded-2xl sm:rounded-3xl md:rounded-[3rem] rotate-3 scale-95" />

    {/* Main Card Container */}
    <ImageWipeReveal delay={0.1}>
      <div className="relative bg-[#3F2965] rounded-2xl sm:rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] flex items-center justify-center group">

        {/* 1. THE IMAGE */}
        <Image 
          src="/assets/therapy.png"
          alt="Compassionate therapy session"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* 2. OVERLAY */}
        <div className="absolute inset-0 bg-[#3F2965]/60 mix-blend-multiply" />

        {/* 3. TEXT */}
        <h3 className="relative z-10 text-white text-xl sm:text-2xl md:text-3xl font-bold text-center px-6 sm:px-8 leading-snug">
          "Compassion is the heart of <br className="hidden sm:block" /> 
          <span className="text-[#Dd1764]">Healing.</span>"
        </h3>

      </div>
    </ImageWipeReveal>
  </div>
</Reveal>


      </div>
    </section>
  );
}