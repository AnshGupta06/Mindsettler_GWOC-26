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

  // Ref pointers for animations
  const cardsEntranceRef = useRef<HTMLDivElement[]>([]); // For Scroll Entrance (Opacity/Slide)
  const cardsFloatRef = useRef<HTMLDivElement[]>([]);    // For Continuous Floating

  const decorParallaxRef = useRef<HTMLDivElement[]>([]); // For Scroll Parallax
  const decorFloatRef = useRef<HTMLDivElement[]>([]);    // For Continuous Floating

  const riverRef = useRef<SVGPathElement>(null);
  const [pathd, setPathd] = useState("");

  // Function to generate the wavy river path connecting card centers
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
        // Calculate center relative to container
        const x = cardRect.left + cardRect.width / 2 - containerRect.left;
        const y = cardRect.top + cardRect.height / 2 - containerRect.top;
        points.push({ x, y });
      }
    });

    // 3. End Point (Bottom Center)
    points.push({ x: containerRect.width / 2, y: containerRect.height });

    // Generate Smooth Path (Cubic Bezier)
    if (points.length < 2) return;

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      // Vertical control point distance (adjust for curvature)
      // If it's the start or end, we might want a straighter entry/exit
      const distY = (p2.y - p1.y) * 0.5;

      // Control Points
      // CP1: Below p1
      const cp1x = p1.x;
      const cp1y = p1.y + distY;

      // CP2: Above p2
      const cp2x = p2.x;
      const cp2y = p2.y - distY;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    setPathd(d);
  };

  useEffect(() => {
    // Initial calculation
    // Slight delay to ensure layout is settled (though ResizeObserver usually handles it)
    setTimeout(updateRiverPath, 100);

    const resizeObserver = new ResizeObserver(() => {
      updateRiverPath();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also observe the cards themselves in case they shift
    cardsFloatRef.current.forEach(card => {
      if (card) resizeObserver.observe(card);
    })

    window.addEventListener('resize', updateRiverPath);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateRiverPath);
    };
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
            start: "top center",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // 2. Cards Entrance Animation (Scroll-linked)
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

      // 3. Decor Parallax (Scroll-linked)
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

      // 4. ✨ NEW: Continuous "Floating in Water" Animation
      // Applied to the inner elements so it doesn't conflict with scroll transforms

      // Floating Cards
      cardsFloatRef.current.forEach((el, i) => {
        gsap.to(el, {
          y: -25, // Increased from -15 to -25
          duration: 3 + Math.random() * 1.5, // Slower, deeper float
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2
        });
      });

      // Floating Decor
      decorFloatRef.current.forEach((el, i) => {
        gsap.to(el, {
          y: -20, // Increased from -10 to -20
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
                  {/* WRAPPER: Handles Scroll Entrance (Opacity/Slide) */}
                  <div
                    ref={(el) => { if (el) cardsEntranceRef.current[index] = el; }}
                    className={`w-full md:w-1/2 ${isLeft ? "md:pr-10 lg:pr-20" : "md:pl-10 lg:pl-20"} z-10`}
                  >
                    {/* INNER: Handles Floating Animation */}
                    <div
                      ref={(el) => { if (el) cardsFloatRef.current[index] = el; }}
                      className="group relative bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-xl shadow-[#3F2965]/5 border border-[#3F2965]/5 hover:border-[#Dd1764]/20 hover:shadow-2xl hover:shadow-[#3F2965]/10 transition-all duration-300 cursor-default"
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

                  {/* EMPTY SIDE (Decor Placement) */}
                  <div className={`w-full md:w-1/2 hidden md:flex ${isLeft ? "justify-end pr-8 lg:pr-12" : "justify-start pl-8 lg:pl-12"}`}>
                    {/* WRAPPER: Handles Parallax */}
                    <div
                      ref={(el) => { if (el) decorParallaxRef.current[index] = el; }}
                      className={`flex flex-col items-center gap-3 sm:gap-4 ${step.colorClass}`}
                    >
                      {/* INNER: Handles Floating */}
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
