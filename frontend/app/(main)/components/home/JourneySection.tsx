"use client";

import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const decorRef = useRef<HTMLDivElement[]>([]);
  const riverRef = useRef<SVGPathElement>(null);
  const [pathd, setPathd] = useState("");

  // Function to generate the wavy river path
  const generateRiverPath = (width: number, height: number) => {
    const points = [];
    const amplitude = 30; // How wide the river swings
    const frequency = 0.015; // How frequent the curves are
    const centerX = width / 2;

    for (let y = 0; y <= height; y += 10) {
      const x = centerX + Math.sin(y * frequency) * amplitude;
      points.push(`${x},${y}`);
    }

    // Construct SVG path "M x0,y0 L x1,y1 ..." 
    // Using simple line segments is often enough for high resolution, 
    // but we can smooth it if needed. With 10px steps, L is fine.
    if (points.length === 0) return "";
    return `M ${points[0]} L ` + points.slice(1).join(" ");
  };

  useEffect(() => {
    // Resize Observer to regenerate path on window resize
    const updatePath = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        // Adjust height to cover the full potential scroll area
        setPathd(generateRiverPath(offsetWidth, offsetHeight));
      }
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, []);

  useEffect(() => {
    if (!riverRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. River Drawing Animation (Scroll-linked)
      const length = riverRef.current?.getTotalLength() || 0;

      gsap.fromTo(
        riverRef.current,
        {
          strokeDasharray: length,
          strokeDashoffset: length
        },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center", // Start drawing when container hits center
            end: "bottom bottom", // Finish drawing when container bottom hits viewport bottom
            scrub: 1,
            // markers: true, // Uncomment for debugging
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
              start: "top 85%", // Slightly later start to ensure visibility
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
    }, containerRef); // Scope to container

    return () => ctx.revert(); // Cleanup on unmount/update

  }, [pathd]); // Re-run effect when path changes

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
        <div ref={containerRef} className="relative max-w-5xl mx-auto z-10">

          {/* RIVER SVG BACKGROUND (Replaces straight line) */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
            <svg className="w-full h-full overflow-visible">
              <defs>
                {/* Gradient 1: The 'Main' Drawing River */}
                <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3F2965" stopOpacity="0" />
                  <stop offset="10%" stopColor="#Dd1764" />
                  <stop offset="50%" stopColor="#9333ea" /> {/* Purple-ish middle */}
                  <stop offset="90%" stopColor="#3F2965" />
                  <stop offset="100%" stopColor="#3F2965" stopOpacity="0" />
                </linearGradient>

                {/* Gradient 2: A faint 'bed' for the river (optional backing) */}
                <linearGradient id="riverBedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3F2965" stopOpacity="0" />
                  <stop offset="50%" stopColor="#3F2965" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#3F2965" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* River Bed (Backing) - Static */}
              <path
                d={pathd}
                stroke="url(#riverBedGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                className="opacity-50"
              />

              {/* The Flowing River - Animated */}
              <path
                ref={riverRef}
                d={pathd}
                stroke="url(#riverGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Steps */}
          <div className="space-y-10 sm:space-y-12 md:space-y-16 lg:space-y-32 pt-12 pb-12">
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
                  <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-10 lg:pr-20" : "md:pl-10 lg:pl-20"} z-10`}>
                    <div
                      ref={(el) => { if (el) cardsRef.current[index] = el; }}
                      className="group relative bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-xl shadow-[#3F2965]/5 border border-[#3F2965]/5 hover:border-[#Dd1764]/20 hover:shadow-2xl hover:shadow-[#3F2965]/10 transition-all duration-500 hover:-translate-y-2 cursor-default"
                    >
                      {/* Step Number Watermark */}
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

                  {/* CENTER DOT - now integrated with the river visual slightly better? 
                      Actually, let's keep it simple. The dot sits ON the river. 
                  */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center w-4 h-4 rounded-full bg-[#Dd1764] shadow-[0_0_15px_#Dd1764] z-20" />

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
