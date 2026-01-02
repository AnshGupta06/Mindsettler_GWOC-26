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

    // 1. Center Line Animation (Kept 'Old' visual, but slightly faster start)
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%", // Kept original start point
          end: "bottom 40%",
          scrub: true,
        },
      }
    );

    // 2. Cards Animation (Improved 'New' reveal time)
    cardsRef.current.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6, // Faster duration
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 75%", // ✨ UPDATED: Triggers sooner (was 85%)
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // 3. Floating Decor Parallax
    decorRef.current.forEach((el, i) => {
        gsap.to(el, {
            y: -40, 
            rotation: i % 2 === 0 ? 10 : -10,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
            }
        })
    });

  }, []);

  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 bg-white" id="journey">
      
      {/* Container */}
      <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-2xl sm:rounded-3xl md:rounded-[3rem] px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 relative z-10 flex flex-col items-center">
          <SlideUp>
            <span className="block text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3 uppercase">
                Your Journey
            </span>
          </SlideUp>
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3F2965] space-y-1">
            <div>
                <CharReveal delay={0.1} className="justify-center">
                    A guided path
                </CharReveal>
            </div>
            <div className="text-[#Dd1764]">
                <CharReveal delay={0.1} className="justify-center">
                    toward healing
                </CharReveal>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto z-10">
          
          {/* Center Line - (Restored to Old Style) */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full hidden md:block">
            <div className="w-[2px] h-full bg-[#3F2965]/10">
              <div
                ref={lineRef}
                className="w-full h-full origin-top bg-gradient-to-b from-[#3F2965] via-[#Dd1764] to-[#3F2965]"
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-10 sm:space-y-12 md:space-y-16 lg:space-y-32">
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

                  {/* TEXT SIDE (Card) */}
                  <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-8 lg:pr-16" : "md:pl-8 lg:pl-16"} z-10`}>
                    <div
                      ref={(el) => { if (el) cardsRef.current[index] = el; }}
                      // ✨ RESTORED: Old Hover Classes (translate-y-2, shadow logic)
                      // ✨ ADDED: Relative positioning for watermark
                      className="group relative bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-xl shadow-[#3F2965]/5 border border-[#3F2965]/5 hover:border-[#Dd1764]/20 hover:shadow-2xl hover:shadow-[#3F2965]/10 transition-all duration-500 hover:-translate-y-2 cursor-default"
                    >
                      {/* ✨ NEW: Step Number Watermark */}
                      <span className="absolute top-4 right-6 text-6xl font-black text-[#3F2965]/5 pointer-events-none group-hover:text-[#Dd1764]/5 transition-colors">
                        {stepNumber}
                      </span>

                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#F9F6FF] text-[#3F2965] flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#Dd1764] group-hover:text-white transition-all duration-300 relative z-10">
                        {step.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3F2965] mb-2 sm:mb-3 relative z-10">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#3F2965]/70 leading-relaxed font-medium relative z-10">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* CENTER DOT (Restored to Old Style) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-4 border-[#F9F6FF] shadow-sm z-20">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#Dd1764]" />
                  </div>

                  {/* EMPTY SIDE (Decor Placement) - Hidden on mobile */}
                  <div className={`w-full md:w-1/2 hidden md:flex ${isLeft ? "justify-end pr-8 lg:pr-12" : "justify-start pl-8 lg:pl-12"}`}>
                      <div 
                        ref={(el) => { if (el) decorRef.current[index] = el; }}
                        className={`flex flex-col items-center gap-3 sm:gap-4 ${step.colorClass}`}
                      >
                         <div className="opacity-10 scale-75 sm:scale-90 lg:scale-100">
                             {step.decor}
                         </div>
                         <span className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-30">
                            {step.decorLabel}
                         </span>
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
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
    icon: <CalendarCheck size={24} strokeWidth={1.5} />,
    decor: <Clock size={160} strokeWidth={0.5} />,
    decorLabel: "Your Time",
    colorClass: "text-[#Dd1764]"
  },
  {
    title: "Initial Understanding",
    description: "Your concerns are listened to with care in a supportive, non-judgmental environment.",
    icon: <Ear size={24} strokeWidth={1.5} />,
    decor: <MessageCircleHeart size={160} strokeWidth={0.5} />,
    decorLabel: "Safe Space",
    colorClass: "text-[#3F2965]"
  },
  {
    title: "Assessment & Diagnosis",
    description: "Professional diagnosis conducted with clinical responsibility and ethical care.",
    icon: <ClipboardList size={24} strokeWidth={1.5} />,
    decor: <FileSearch size={160} strokeWidth={0.5} />,
    decorLabel: "Clarity",
    colorClass: "text-[#Dd1764]"
  },
  {
    title: "Structured Sessions",
    description: "Therapy and psycho-education sessions designed around your mental health needs.",
    icon: <Layers size={24} strokeWidth={1.5} />,
    decor: <Puzzle size={160} strokeWidth={0.5} />,
    decorLabel: "Structure",
    colorClass: "text-[#3F2965]"
  },
  {
    title: "Growth & Healing",
    description: "Develop awareness, coping strategies, and emotional resilience over time.",
    icon: <HeartHandshake size={24} strokeWidth={1.5} />,
    decor: <Flower2 size={160} strokeWidth={0.5} />,
    decorLabel: "Bloom",
    colorClass: "text-[#Dd1764]"
  },
];