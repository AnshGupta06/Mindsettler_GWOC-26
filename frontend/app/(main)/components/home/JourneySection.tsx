"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CalendarCheck,
  Ear,
  ClipboardList,
  Layers,
  HeartHandshake,
  Clock,
  MessageCircleHeart,
  FileSearch,
  Puzzle,
  Flower2,
} from "lucide-react";
import { CharReveal, SlideUp } from "../common/RevealComponent";

gsap.registerPlugin(ScrollTrigger);

export default function JourneySection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!timelineRef.current) return;

    // 1. Center Line Animation (Reveals faster now)
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%", // ⚡ Changed from 70% to 80% (Starts earlier)
          end: "bottom 50%",
          scrub: true,
        },
      }
    );

    // 2. Cards Animation (Snappier reveal)
    cardsRef.current.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6, // ⚡ Faster duration for snappiness
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 75%", // ⚡ Changed from 85% to 75% (Reveals sooner)
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // 3. Floating Decor Parallax
    decorRef.current.forEach((el, i) => {
        gsap.to(el, {
            y: -50, 
            rotation: i % 2 === 0 ? 10 : -10,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            }
        })
    });

  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-white overflow-hidden">
      
      {/* Container */}
      <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-3xl sm:rounded-[3rem] px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 relative">
        
        {/* ✨ Aesthetic Background Blurs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3F2965]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#Dd1764]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-24 relative z-10 flex flex-col items-center">
          <SlideUp>
            <span className="inline-block py-1 px-3 rounded-full bg-[#Dd1764]/10 text-[#Dd1764] font-bold text-xs tracking-wider uppercase mb-4">
                Your Roadmap
            </span>
          </SlideUp>
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#3F2965] leading-tight">
            <div>
                <CharReveal delay={0.1} className="justify-center">
                    A guided path
                </CharReveal>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#Dd1764] to-[#ff6b9d]">
                <CharReveal delay={0.1} className="justify-center">
                    toward healing
                </CharReveal>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative max-w-6xl mx-auto z-10">
          
          {/* 📏 Center Line (Desktop) */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full hidden md:block w-[2px] bg-[#3F2965]/5">
            <div
              ref={lineRef}
              className="w-full h-full origin-top bg-gradient-to-b from-[#3F2965] via-[#Dd1764] to-[#3F2965] shadow-[0_0_10px_rgba(221,23,100,0.5)]"
            />
          </div>

          {/* 📏 Left Line (Mobile) */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-[#3F2965]/10 md:hidden"></div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {journeySteps.map((step, index) => {
              const isLeft = index % 2 === 0;
              const stepNumber = (index + 1).toString().padStart(2, '0');

              return (
                <div
                  key={index}
                  className="relative flex flex-col md:flex-row items-center md:items-center"
                  style={{
                    flexDirection: isLeft ? 'row' : 'row-reverse'
                  }}
                >
                  
                  {/* 🔗 CONNECTOR LINE (Desktop Only) */}
                  {/* This draws a line from the center dot to the card */}
                  <div className={`hidden md:block absolute top-1/2 w-1/2 h-[2px] ${isLeft ? "right-1/2 pr-12" : "left-1/2 pl-12"}`}>
                      <div className={`w-full h-full border-t-2 border-dashed border-[#3F2965]/20 ${isLeft ? "origin-right" : "origin-left"}`} />
                  </div>

                  {/* 🃏 CARD SIDE */}
                  <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-16" : "md:pl-16"} z-10 pl-12 md:pl-0`}>
                    <div
                      ref={(el) => { if (el) cardsRef.current[index] = el; }}
                      className="group relative bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl md:rounded-[2rem] border border-[#3F2965]/5 shadow-xl shadow-[#3F2965]/5 hover:shadow-2xl hover:shadow-[#Dd1764]/10 hover:border-[#Dd1764]/20 hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Step Number Watermark */}
                      <span className="absolute top-4 right-6 text-6xl font-black text-[#3F2965]/5 pointer-events-none group-hover:text-[#Dd1764]/5 transition-colors">
                        {stepNumber}
                      </span>

                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 shadow-md ${step.bgClass} text-white group-hover:scale-110`}>
                        {step.icon}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-[#3F2965] mb-3 group-hover:text-[#Dd1764] transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-[#3F2965]/70 leading-relaxed font-medium">
                        {step.description}
                      </p>

                      {/* Mobile Connector Dot (Absolute Left) */}
                      <div className="md:hidden absolute top-8 -left-[2.85rem] w-5 h-5 rounded-full bg-white border-4 border-[#F9F6FF] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#Dd1764]" />
                      </div>
                    </div>
                  </div>

                  {/* 🎯 CENTER DOT (Desktop) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-10 h-10 rounded-full bg-[#F9F6FF] border border-[#3F2965]/10 shadow-sm z-20">
                    <div className="w-3 h-3 rounded-full bg-[#Dd1764] shadow-[0_0_10px_#Dd1764]" />
                  </div>

                  {/* 🖼️ DECOR SIDE (Hidden on mobile) */}
                  <div className={`w-full md:w-1/2 hidden md:flex ${isLeft ? "justify-end pr-12 lg:pr-20" : "justify-start pl-12 lg:pl-20"}`}>
                      <div 
                        ref={(el) => { if (el) decorRef.current[index] = el; }}
                        className={`flex flex-col items-center gap-4 ${step.colorClass}`}
                      >
                         <div className="opacity-20 scale-90 lg:scale-100 hover:opacity-40 transition-opacity duration-500">
                             {step.decor}
                         </div>
                         <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-40">
                            {step.decorLabel}
                         </span>
                      </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* End cap */}
          <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-[#3F2965] rounded-full" />
        </div>
      </div>
    </section>
  );
}

// Data Array with Thematic Icons
const journeySteps = [
  {
    title: "Book a Session",
    description: "Choose an online or offline consultation at a time that feels right for you.",
    icon: <CalendarCheck size={28} strokeWidth={1.5} />,
    decor: <Clock size={180} strokeWidth={0.5} />,
    decorLabel: "Your Time",
    colorClass: "text-[#Dd1764]",
    bgClass: "bg-[#Dd1764]"
  },
  {
    title: "Initial Understanding",
    description: "Your concerns are listened to with care in a supportive, non-judgmental environment.",
    icon: <Ear size={28} strokeWidth={1.5} />,
    decor: <MessageCircleHeart size={180} strokeWidth={0.5} />,
    decorLabel: "Safe Space",
    colorClass: "text-[#3F2965]",
    bgClass: "bg-[#3F2965]"
  },
  {
    title: "Assessment & Diagnosis",
    description: "Professional diagnosis conducted with clinical responsibility and ethical care.",
    icon: <ClipboardList size={28} strokeWidth={1.5} />,
    decor: <FileSearch size={180} strokeWidth={0.5} />,
    decorLabel: "Clarity",
    colorClass: "text-[#Dd1764]",
    bgClass: "bg-[#Dd1764]"
  },
  {
    title: "Structured Sessions",
    description: "Therapy and psycho-education sessions designed around your mental health needs.",
    icon: <Layers size={28} strokeWidth={1.5} />,
    decor: <Puzzle size={180} strokeWidth={0.5} />,
    decorLabel: "Structure",
    colorClass: "text-[#3F2965]",
    bgClass: "bg-[#3F2965]"
  },
  {
    title: "Growth & Healing",
    description: "Develop awareness, coping strategies, and emotional resilience over time.",
    icon: <HeartHandshake size={28} strokeWidth={1.5} />,
    decor: <Flower2 size={180} strokeWidth={0.5} />,
    decorLabel: "Bloom",
    colorClass: "text-[#Dd1764]",
    bgClass: "bg-[#Dd1764]"
  },
];