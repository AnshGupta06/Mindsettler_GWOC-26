"use client";

import Reveal from "../common/Reveal";
import { SlideUp, StaggerContainer, StaggerItem } from "../common/RevealComponent";
import Image from "next/image";
import Link from "next/link";

export default function AboutPreview() {
  return (
    // UPDATED: Full width White background
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-white overflow-hidden relative">

      {/* Background Decor - Adjusted for White BG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#3F2965]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-[#Dd1764]/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-[1440px] mx-auto w-full relative overflow-visible flex flex-col items-center text-center">

        <div className="relative z-10 w-full flex flex-col items-center">
          
          {/* Heading */}
          <div className="mb-6 md:mb-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-[#3F2965] leading-[1.1] tracking-tight">
              <span className="block">Bridging mental health</span>
              <span className="block text-[#3F2965]">awareness with</span>
              <span className="block text-[#Dd1764] italic font-serif mt-2">professional care</span>
            </h2>
          </div>

          {/* Quote */}
          <div className="mb-8 md:mb-12">
            <Reveal delay={0.2}>
              <div className="relative inline-block">
                <div className="text-xl sm:text-2xl md:text-3xl font-medium text-[#3F2965]/90 italic max-w-2xl leading-relaxed relative z-10">
                  "Compassion is the heart of <span className="text-[#Dd1764] font-bold font-serif italic">Healing</span>."
                </div>
              </div>
            </Reveal>
          </div>

          {/* Description */}
          <SlideUp delay={0.3} className="max-w-2xl mb-10 md:mb-14">
            <p className="text-lg sm:text-xl text-[#3F2965]/70 leading-relaxed font-medium">
              MindSettler was created to bridge the gap between mental health awareness and professional care. We believe that understanding your mind is the first step toward healing.
            </p>
          </SlideUp>

          {/* FLIPPY CIRCLE TILES GRID */}
          <div className="w-full mb-10 md:mb-14">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 justify-items-center">
              {[
                { title: "Patterns", text: "Recognize emotional patterns" },
                { title: "Conditions", text: "Understand mental health conditions" },
                { title: "Mechanisms", text: "Develop healthier coping mechanisms" },
                { title: "Safe Care", text: "Experience safe & confidential care" }
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="group w-48 h-48 sm:w-56 sm:h-56 perspective-1000 cursor-pointer">
                    <div className="relative w-full h-full duration-500 transform-style-3d group-hover:rotate-y-180">

                      {/* FRONT FACE (Logo) */}
                      <div className="absolute w-full h-full backface-hidden bg-white hover:bg-[#F9F6FF] rounded-full shadow-xl shadow-[#3F2965]/10 border border-[#3F2965]/5 flex flex-col items-center justify-center p-6 transition-colors duration-300">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
                          <Image
                            src="/assets/heart-brain-icon.png"
                            alt="MindSettler Icon"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[#3F2965] font-bold uppercase tracking-wider text-xs sm:text-sm">{item.title}</span>
                      </div>

                      {/* BACK FACE (Content) */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#3F2965] rounded-full shadow-2xl flex items-center justify-center text-center p-6 border border-[#3F2965]">
                        <p className="text-white font-medium text-sm sm:text-base leading-snug">
                          {item.text}
                        </p>
                      </div>

                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* CTA Button */}
          <SlideUp delay={0.5}>
            <Link href="/about">
              <button className="relative px-8 md:px-10 py-3.5 md:py-4 rounded-full bg-[#3F2965] text-white font-bold text-base tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
                <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-[#F9F6FF]/20 -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="relative z-10 flex items-center gap-2">
                  More About Us
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </button>
            </Link>
          </SlideUp>
        </div>

      </div>
    </section>
  );
}