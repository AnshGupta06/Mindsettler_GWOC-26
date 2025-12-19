"use client";

import Reveal from "../common/Reveal"; 
import { CharReveal, SlideUp } from "../common/RevealComponent";

export default function HeroSection() {
  const ModelViewer: any = "model-viewer";

  return (
    <section className="min-h-screen flex items-center pt-24 pb-12 px-4 md:px-8 bg-white">
      
      {/* Container */}
      <div className="max-w-[1440px] mx-auto w-full bg-[#F9F6FF] rounded-[3rem] px-6 md:px-20 py-20 relative overflow-hidden grid md:grid-cols-2 gap-12 items-center">
        
        {/* Decor */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#3F2965]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* LEFT: Text Content */}
        <div className="max-w-2xl relative z-10">
            
            <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-[#Dd1764] font-bold text-sm tracking-wide mb-6">
                <span className="w-2 h-2 rounded-full bg-[#Dd1764]" />
                Mental Well-Being & Psycho-Education
                </div>
            </Reveal>

            {/* THE ALPHABET REVEAL */}
            {/* We stack them in a flex-col to handle the line breaks cleanly */}
            <div className="flex flex-col text-5xl md:text-[4rem] leading-[1.1] font-bold text-[#3F2965] tracking-tight mb-8">
                
                {/* Line 1 */}
                <CharReveal delay={0}>
                   Understanding
                </CharReveal>
                
                {/* Line 2 */}
                <CharReveal delay={0.3}>
                   Your Mind.
                </CharReveal>

                {/* Line 3 (Pink) */}
                <CharReveal delay={0.6} className="text-[#Dd1764]">
                   Supporting Your Healing.
                </CharReveal>
            </div>

            {/* Paragraph (Standard Slide) */}
            <SlideUp delay={0.8} className="mb-10">
                <p className="text-xl leading-relaxed text-[#3F2965]/70 max-w-lg font-medium">
                A structured path to mental clarity. We combine professional psychotherapy with psycho-education to help you navigate life's challenges.
                </p>
            </SlideUp>

            {/* Buttons (Standard Slide) */}
            <SlideUp delay={1.0} className="flex flex-wrap items-center gap-5">
              <button className="relative px-10 py-4 rounded-full bg-[#Dd1764] text-white font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
                <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                <span className="relative z-10 flex items-center gap-2">Book Appointment</span>
              </button>

              <button className="relative px-10 py-4 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:border-[#3F2965] hover:-translate-y-1">
                <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="absolute top-0 right-[-25%] w-[75%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">How It Works</span>
              </button>
            </SlideUp>
        </div>

        {/* RIGHT: 3D Model */}
        <Reveal delay={0.2}>
          <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center">
            <div className="absolute w-[450px] h-[450px] rounded-full bg-white/40 blur-[80px]" />
            <ModelViewer
              src="/assets/heart+with+brain+3d+model.glb"
              alt="MindSettler 3D model"
              style={{ width: "100%", height: "100%", zIndex: 10 }}
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