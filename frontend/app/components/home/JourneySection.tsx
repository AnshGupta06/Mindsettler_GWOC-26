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
import SectionHeading from "../common/HeadingSection";
import { CharReveal, SlideUp } from "../common/RevealComponent";

gsap.registerPlugin(ScrollTrigger);

export default function JourneySection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!timelineRef.current) return;

    // 1. Center Line Animation
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
          end: "bottom 40%",
          scrub: true,
        },
      }
    );

    // 2. Cards Animation
    cardsRef.current.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // 3. Floating Decor Parallax
    decorRef.current.forEach((el, i) => {
        gsap.to(el, {
            y: -40, 
            rotation: i % 2 === 0 ? 10 : -10, // Slight rotation for natural feel
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
    <section className="py-12 px-4 md:px-8 bg-white">
      
      {/* Container */}
      <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-[3rem] px-6 md:px-20 py-24 relative overflow-hidden">
        
        {/* Background Blurs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3F2965]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#Dd1764]/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-24 relative z-10 flex flex-col items-center">
          <SlideUp>
            <span className="block text-[#Dd1764] font-bold text-sm tracking-wide mb-3 uppercase">
                Your Journey
            </span>
          </SlideUp>
          <div className="flex flex-wrap justify-center text-3xl md:text-5xl font-bold text-[#3F2965]">
             <CharReveal delay={0.1}>
                 A guided path
             </CharReveal>
             <CharReveal delay={0.1} className="text-[#Dd1764] ml-2">
                 toward healing
             </CharReveal>
          </div>
        </div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto z-10">
          
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full hidden md:block">
            <div className="w-[2px] h-full bg-[#3F2965]/10">
              <div
                ref={lineRef}
                className="w-full h-full origin-top bg-gradient-to-b from-[#3F2965] via-[#Dd1764] to-[#3F2965]"
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-16 md:space-y-32">
            {journeySteps.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* TEXT SIDE (Card) */}
                  <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-16" : "md:pl-16"} z-10`}>
                    <div
                      ref={(el) => { if (el) cardsRef.current[index] = el; }}
                      // ADDED HOVER EFFECTS HERE (Same as Differentiators)
                      className="group bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-[#3F2965]/5 border border-[#3F2965]/5 hover:border-[#Dd1764]/20 hover:shadow-2xl hover:shadow-[#3F2965]/10 transition-all duration-500 hover:-translate-y-2 cursor-default"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#F9F6FF] text-[#3F2965] flex items-center justify-center mb-6 group-hover:bg-[#Dd1764] group-hover:text-white transition-all duration-300">
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-[#3F2965] mb-3">
                        {step.title}
                      </h3>
                      <p className="text-[#3F2965]/70 leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* CENTER DOT */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-8 h-8 rounded-full bg-white border-4 border-[#F9F6FF] shadow-sm z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#Dd1764]" />
                  </div>

                  {/* EMPTY SIDE (Decor Placement) */}
                  <div className={`w-full md:w-1/2 hidden md:flex ${isLeft ? "justify-end pr-12" : "justify-start pl-12"}`}>
                      {/* Floating Element Container */}
                      <div 
                        ref={(el) => { if (el) decorRef.current[index] = el; }}
                        className={`flex flex-col items-center gap-4 ${step.colorClass}`}
                      >
                         {/* Large Icon */}
                         <div className="opacity-10 scale-100">
                             {step.decor}
                         </div>
                         {/* Optional Label for "Linking" context */}
                         <span className="text-sm font-bold uppercase tracking-widest opacity-30">
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
    icon: <CalendarCheck size={28} strokeWidth={1.5} />,
    // Concept: Time/Scheduling
    decor: <Clock size={160} strokeWidth={0.5} />,
    decorLabel: "Your Time",
    colorClass: "text-[#Dd1764]" // Pink
  },
  {
    title: "Initial Understanding",
    description: "Your concerns are listened to with care in a supportive, non-judgmental environment.",
    icon: <Ear size={28} strokeWidth={1.5} />,
    // Concept: Listening/Connection
    decor: <MessageCircleHeart size={160} strokeWidth={0.5} />,
    decorLabel: "Safe Space",
    colorClass: "text-[#3F2965]" // Purple
  },
  {
    title: "Assessment & Diagnosis",
    description: "Professional diagnosis conducted with clinical responsibility and ethical care.",
    icon: <ClipboardList size={28} strokeWidth={1.5} />,
    // Concept: Analysis/Clarity
    decor: <FileSearch size={160} strokeWidth={0.5} />,
    decorLabel: "Clarity",
    colorClass: "text-[#Dd1764]" // Pink
  },
  {
    title: "Structured Sessions",
    description: "Therapy and psycho-education sessions designed around your mental health needs.",
    icon: <Layers size={28} strokeWidth={1.5} />,
    // Concept: Building Blocks/Structure
    decor: <Puzzle size={160} strokeWidth={0.5} />,
    decorLabel: "Structure",
    colorClass: "text-[#3F2965]" // Purple
  },
  {
    title: "Growth & Healing",
    description: "Develop awareness, coping strategies, and emotional resilience over time.",
    icon: <HeartHandshake size={28} strokeWidth={1.5} />,
    // Concept: Blooming/Growth
    decor: <Flower2 size={160} strokeWidth={0.5} />,
    decorLabel: "Bloom",
    colorClass: "text-[#Dd1764]" // Pink
  },
];