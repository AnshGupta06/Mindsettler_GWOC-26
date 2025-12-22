"use client";

import Link from "next/link";
import Reveal from "../common/Reveal"; 
import { CharReveal, SlideUp } from "../common/RevealComponent";

export default function HeroSection() {
  const ModelViewer: any = "model-viewer";

  return (
    <section className="min-h-screen flex items-center pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 md:px-8 bg-white">
      
      <div className="max-w-[1440px] mx-auto w-full bg-[#F9F6FF] rounded-2xl sm:rounded-3xl md:rounded-[3rem] px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 relative overflow-visible grid md:grid-cols-[1.6fr_0.6fr] gap-8 sm:gap-10 md:gap-12 items-center">
        
        {/* LEFT: Text Content */}
        <div className="max-w-3xl relative z-10 min-w-0 flex flex-col justify-center items-center text-center md:items-start md:text-left">  
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white shadow-sm text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-[#Dd1764]" />
              <span className="whitespace-nowrap">Mental Well-Being & Psycho-Education</span>
            </div>
          </Reveal>

          {/* Heading - Fixed for mobile */}
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] leading-tight sm:leading-[1.1] font-bold text-[#3F2965] tracking-tight mb-4 sm:mb-6 md:mb-8 w-full">
            <div className="mb-1 sm:mb-2">
              <CharReveal delay={0}>
                Understanding
              </CharReveal>
            </div>
            <div className="mb-1 sm:mb-2">
              <CharReveal delay={0.3}>
                Your Mind.
              </CharReveal>
            </div>
            <div className="text-[#Dd1764]">
              <CharReveal delay={0.6}>
                Supporting Your Healing.
              </CharReveal>
            </div>
          </div>

          {/* Paragraph */}
          <SlideUp delay={0.8} className="mb-6 sm:mb-8 md:mb-10 w-full">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-[#3F2965]/70 max-w-lg font-medium">
              A structured path to mental clarity. We combine professional psychotherapy with psycho-education to help you navigate life's challenges.
            </p>
          </SlideUp>

          {/* Buttons */}
          <SlideUp delay={1.0} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto">
          <Link href="/book">
            <button className="w-full sm:w-auto relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full bg-[#Dd1764] text-white font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
              <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
              <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
              <span className="relative z-10">Book Appointment</span>
            </button>
          </Link>
            <button className="w-full sm:w-auto relative px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:border-[#3F2965] hover:-translate-y-1">
              <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
              <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                How It Works
              </span>
            </button>
          </SlideUp>
        </div>

        {/* RIGHT: 3D Model */}
        <Reveal delay={0.2}>
          <div className="relative w-full h-[280px] sm:h-[320px] md:h-[380px] lg:h-[480px] flex items-center justify-center min-w-0">
            <div className="absolute w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] rounded-full bg-white/40 blur-[60px] sm:blur-[80px]" />
            <ModelViewer
              src="/assets/heart+with+brain+3d+model.glb"
              alt="MindSettler 3D model"
              style={{
                width: "100%",
                height: "100%",
                zIndex: 10,
                transform: "scale(1.3)",
              }}
              camera-orbit="90deg 75deg 2.5m"
              field-of-view="30deg"
              exposure="1.2"
              shadow-intensity="1"
              camera-controls
              disable-zoom
              interaction-prompt="none"
              auto-rotate
              auto-rotate-delay="0"
              rotation-per-second="10deg"
              suppressHydrationWarning
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}