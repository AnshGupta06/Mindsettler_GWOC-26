"use client";

import Link from "next/link";
import Reveal from "../common/Reveal";
import { CharReveal, SlideUp } from "../common/RevealComponent";
import { Users, Star, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  const ModelViewer: any = "model-viewer";

  return (
    <section className="min-h-[100dvh] flex flex-col justify-center pt-24 lg:pt-32 pb-12 px-4 sm:px-6 md:px-8 bg-[#F9F6FF] relative overflow-hidden">
      
      <div className="max-w-[1440px] mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">

        {/* LEFT COLUMN: 3D Model (Swapped to Left) */}
        {/* Mobile: order-2 (Bottom), Desktop: order-1 (Left) */}
        <div className="order-2 lg:order-1 relative w-full flex items-center justify-center lg:justify-end min-h-[300px] sm:min-h-[400px]">
          <SlideUp delay={0.2} className="w-full h-full flex justify-center">
            
            {/* CONTAINER FOR MODEL & ANIMATIONS */}
            <div className="relative w-full max-w-[350px] sm:max-w-[500px] aspect-square flex items-center justify-center scale-90 sm:scale-100">
              
              {/* --- ALIVE ANIMATED BACKGROUND START --- */}
              
              {/* 1. Breathing Outer Circle */}
              <div className="absolute inset-0 border border-[#3F2965] opacity-15 rounded-full animate-[ping_3s_ease-in-out_infinite]" />
              
              {/* 2. Pulsing Mid Circle */}
              <div className="absolute inset-8 border-2 border-[#Dd1764] opacity-20 rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
              
              {/* 3. Static Inner Circle */}
              <div className="absolute inset-16 border border-[#3F2965] opacity-10 rounded-full" />

              {/* 4. Fast Rotating Dashed Circle */}
              <div className="absolute inset-4 border border-dashed border-[#Dd1764] opacity-25 rounded-full animate-[spin_8s_linear_infinite]" />
              
              {/* 5. Slow Counter Rotating Dashed Circle */}
              <div className="absolute inset-12 border border-dashed border-[#3F2965] opacity-20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

              {/* 6. Pulsing Center Ring - Heartbeat effect */}
              <div className="absolute inset-[35%] border-2 border-[#Dd1764] opacity-30 rounded-full animate-[ping_1.5s_ease-in-out_infinite]" />

              {/* --- ALIVE ANIMATED BACKGROUND END --- */}

              {/* 3D Model */}
              <ModelViewer
                src="/assets/heart+with+brain+3d+model.glb"
                alt="MindSettler 3D model"
                style={{
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                  transform: "scale(1.4)",
                }}
                camera-orbit="45deg 75deg 2.5m"
                field-of-view="30deg"
                exposure="1.2"
                shadow-intensity="1"
                camera-controls
                disable-zoom
                interaction-prompt="none"
                auto-rotate
                auto-rotate-delay="0"
                rotation-per-second="15deg"
                suppressHydrationWarning
              />
            </div>
          </SlideUp>
        </div>

        {/* RIGHT COLUMN: Text Content (Swapped to Right) */}
        {/* Mobile: order-1 (Top), Desktop: order-2 (Right) */}
        <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#3F2965]/10 text-[#3F2965] font-bold text-xs uppercase tracking-widest mb-6 hover:border-[#3F2965]/20 transition-all cursor-default">
              <span className="w-2 h-2 rounded-full bg-[#Dd1764] animate-pulse" />
              <span>Mental Well-Being & Psycho-Education</span>
            </div>
          </Reveal>

          <div className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.1] font-extrabold text-[#3F2965] tracking-tight mb-6 sm:mb-8">
            <div className="mb-1">
              <CharReveal delay={0}>Understand</CharReveal>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-2 sm:gap-x-3">
              <span className="text-[#3F2965]">
                <CharReveal delay={0.1}>Your</CharReveal>
              </span>
              <span className="text-[#Dd1764] font-serif">
                <CharReveal delay={0.2}>Mind.</CharReveal>
              </span>
            </div>
            <div className="text-[#3F2965]/90 mt-1">
              <CharReveal delay={0.3}>Heal Your Life.</CharReveal>
            </div>
          </div>

          <SlideUp delay={0.4} className="mb-8 sm:mb-10 w-full">
            <p className="text-base sm:text-xl text-[#3F2965]/70 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed px-2 sm:px-0">
              We bridge the gap between professional therapy and self-understanding. A structured, compassionate path to finding your balance.
            </p>
          </SlideUp>

          <SlideUp delay={0.5} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link href="/book" className="w-full sm:w-auto">
              <button className="w-full relative px-8 py-4 rounded-xl bg-[#Dd1764] text-white font-bold text-lg tracking-wide overflow-hidden group transition-all duration-300 hover:-translate-y-1">
                <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Book Appointment
                </span>
              </button>
            </Link>
            
            <Link href="#howitworks" className="w-full sm:w-auto">
              <button className="w-full px-8 py-4 rounded-xl bg-white border border-[#3F2965]/10 text-[#3F2965] font-bold text-lg tracking-wide transition-all duration-300 hover:border-[#3F2965]/30 hover:bg-white/50 hover:-translate-y-1">
                How It Works
              </button>
            </Link>
          </SlideUp>

        </div>

      </div>

      {/* BOTTOM BAR: Trust Indicators / Stats */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full mt-12 sm:mt-16 lg:mt-24 px-4">
        <SlideUp delay={0.7}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 py-6 sm:py-8 border-t border-[#3F2965]/5">
            {[
              { label: "Lives Touched", value: "500+", icon: Users },
              { label: "Expert Therapists", value: "Certified", icon: ShieldCheck },
              { label: "Client Satisfaction", value: "4.9/5", icon: Star },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-center sm:justify-start gap-4 group">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#Dd1764] group-hover:scale-110 transition-transform duration-300">
                  <stat.icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#3F2965]">{stat.value}</div>
                  <div className="text-sm font-medium text-[#3F2965]/60 uppercase tracking-wide">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </SlideUp>
      </div>

    </section>
  );
}