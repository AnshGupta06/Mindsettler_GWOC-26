"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MessageCircle,
  Lightbulb,
  Shield,
  GitMerge,
  Sprout,
  Wind,
  Fingerprint,
  Anchor,
  Compass,
  Sun,
} from "lucide-react";
import { CharReveal, SlideUp } from "../common/RevealComponent";

gsap.registerPlugin(ScrollTrigger);

export default function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref pointers for animations
  const cardsEntranceRef = useRef<HTMLDivElement[]>([]); 
  const cardsFloatRef = useRef<HTMLDivElement[]>([]);    

  const decorParallaxRef = useRef<HTMLDivElement[]>([]); 
  const decorFloatRef = useRef<HTMLDivElement[]>([]);    

  const riverRef = useRef<SVGPathElement>(null);
  const [pathd, setPathd] = useState("");

  const updateRiverPath = () => {
    if (!containerRef.current || cardsFloatRef.current.length === 0) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const points: { x: number; y: number }[] = [];

    // 1. Start Point (Top Center)
    points.push({ x: containerRect.width / 2, y: 0 });

    // 2. Card Centers
    cardsFloatRef.current.forEach((card) => {
      if (card) {
        const cardRect = card.getBoundingClientRect();
        const x = cardRect.left + cardRect.width / 2 - containerRect.left;
        const y = cardRect.top + cardRect.height / 2 - containerRect.top;
        points.push({ x, y });
      }
    });

    // 3. End Point (Bottom Center)
    points.push({ x: containerRect.width / 2, y: containerRect.height });

    if (points.length < 2) return;

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const distY = (p2.y - p1.y) * 0.5;
      const cp1x = p1.x;
      const cp1y = p1.y + distY;
      const cp2x = p2.x;
      const cp2y = p2.y - distY;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    setPathd(d);
  };

  useEffect(() => {
    setTimeout(updateRiverPath, 100);
    const resizeObserver = new ResizeObserver(() => updateRiverPath());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    window.addEventListener('resize', updateRiverPath);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateRiverPath);
    };
  }, []);

  useEffect(() => {
    if (!riverRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const length = riverRef.current?.getTotalLength() || 0;

      gsap.fromTo(
        riverRef.current,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      cardsEntranceRef.current.forEach((card) => {
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

      decorParallaxRef.current.forEach((el, i) => {
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

      cardsFloatRef.current.forEach((el, i) => {
        gsap.to(el, {
          y: -25,
          duration: 3 + Math.random() * 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2
        });
      });

      decorFloatRef.current.forEach((el, i) => {
        gsap.to(el, {
          y: -20,
          duration: 3.5 + Math.random() * 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [pathd]);

  return (
    // UPDATED: Full Width White Background
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-white" id="journey">

      {/* Container for content (no inner box style) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 relative overflow-hidden">

        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 relative z-10 flex flex-col items-center">
          <SlideUp>
            <span className="block text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3 uppercase">
              The Therapeutic Arc
            </span>
          </SlideUp>
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3F2965] space-y-1">
            <div>
              <CharReveal delay={0.1} className="justify-center">
                Your Path to
              </CharReveal>
            </div>
            {/* UPDATED: Italic Pink Serif Style */}
            <div className="text-[#Dd1764] italic font-serif">
              <CharReveal delay={0.1} className="justify-center">
                Inner Transformation
              </CharReveal>
            </div>
          </div>
          <SlideUp delay={0.2}>
            <p className="mt-6 text-[#3F2965]/70 text-lg max-w-2xl text-center">
              Therapy is more than just talking—it's a structured journey of discovery, equipping, and growth. Here is what that journey feels like.
            </p>
          </SlideUp>
        </div>

        {/* Timeline Content */}
        {/* We attach the Ref here so the River draws inside this area */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto z-10">

          {/* RIVER SVG BACKGROUND */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
            <svg className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3F2965" stopOpacity="0" />
                  <stop offset="10%" stopColor="#Dd1764" />
                  <stop offset="50%" stopColor="#9333ea" />
                  <stop offset="90%" stopColor="#3F2965" />
                  <stop offset="100%" stopColor="#3F2965" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="riverBedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3F2965" stopOpacity="0" />
                  <stop offset="50%" stopColor="#3F2965" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#3F2965" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d={pathd}
                stroke="url(#riverBedGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                className="opacity-50"
              />

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
                  <div
                    ref={(el) => { if (el) cardsEntranceRef.current[index] = el; }}
                    className={`w-full md:w-1/2 ${isLeft ? "md:pr-10 lg:pr-20" : "md:pl-10 lg:pl-20"} z-10`}
                  >
                    {/* Shadow/Border adjustments for White Background context */}
                    <div
                      ref={(el) => { if (el) cardsFloatRef.current[index] = el; }}
                      className="group relative bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-2xl shadow-[#3F2965]/10 border border-[#3F2965]/5 hover:border-[#Dd1764]/20 hover:shadow-2xl hover:shadow-[#3F2965]/20 transition-all duration-300 cursor-default"
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

                  {/* DECOR SIDE */}
                  <div className={`w-full md:w-1/2 hidden md:flex ${isLeft ? "justify-end pr-8 lg:pr-12" : "justify-start pl-8 lg:pl-12"}`}>
                    <div
                      ref={(el) => { if (el) decorParallaxRef.current[index] = el; }}
                      className={`flex flex-col items-center gap-3 sm:gap-4 ${step.colorClass}`}
                    >
                      <div ref={(el) => { if (el) decorFloatRef.current[index] = el; }}>
                        <div className="opacity-10 scale-75 sm:scale-90 lg:scale-100">
                          {step.decor}
                        </div>
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest opacity-30 block text-center mt-2">
                          {step.decorLabel}
                        </span>
                      </div>
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

// Data Array
const journeySteps = [
  {
    title: "The Safe Release",
    description: "A confidential space to unburden your thoughts, express emotions freely, and be truly heard without judgment.",
    icon: <MessageCircle size={24} strokeWidth={1.5} />,
    decor: <Wind size={160} strokeWidth={0.5} />,
    decorLabel: "Exhale",
    colorClass: "text-[#Dd1764]"
  },
  {
    title: "Deep Discovery",
    description: "We work together to uncover root causes, identify triggers, and understand the 'why' behind your patterns.",
    icon: <Lightbulb size={24} strokeWidth={1.5} />,
    decor: <Fingerprint size={160} strokeWidth={0.5} />,
    decorLabel: "Identity",
    colorClass: "text-[#3F2965]"
  },
  {
    title: "Equipping & Resilience",
    description: "Acquiring practical tools, coping mechanisms, and emotional strategies to navigate life's challenges.",
    icon: <Shield size={24} strokeWidth={1.5} />,
    decor: <Anchor size={160} strokeWidth={0.5} />,
    decorLabel: "Stability",
    colorClass: "text-[#Dd1764]"
  },
  {
    title: "Mindful Integration",
    description: "Applying new insights to real-world situations, rewiring responses, and shifting your perspective.",
    icon: <GitMerge size={24} strokeWidth={1.5} />,
    decor: <Compass size={160} strokeWidth={0.5} />,
    decorLabel: "Direction",
    colorClass: "text-[#3F2965]"
  },
  {
    title: "Sustainable Growth",
    description: "Achieving emotional independence, where you no longer just survive, but thrive with renewed purpose.",
    icon: <Sprout size={24} strokeWidth={1.5} />,
    decor: <Sun size={160} strokeWidth={0.5} />,
    decorLabel: "Thrive",
    colorClass: "text-[#Dd1764]"
  },
];