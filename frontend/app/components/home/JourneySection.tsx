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
} from "lucide-react";
import SectionHeading from "../common/HeadingSection";
gsap.registerPlugin(ScrollTrigger);

export default function JourneySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate center timeline when the journey steps enter view
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
          ease: "none",
        } as any,
      }
    );

    // Animate each journey card with a lift + fade-in effect
    cardsRef.current.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60, scale: 0.9, boxShadow: "0 0 0 rgba(0,0,0,0)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          boxShadow: "0 18px 45px rgba(63,41,101,0.18)",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          } as any,
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-24 bg-gradient-to-b from-[#f3ecff] via-[#ffeaf5] to-[#f7f0ff]"
    >
      <div className="max-w-6xl mx-auto rounded-3xl border border-white/70 bg-white/80 backdrop-blur-sm px-16 py-20 shadow-[0_18px_45px_rgba(63,41,101,0.04)]">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-28">
          <SectionHeading
            label="Your Journey With MindSettler"
            title="A guided path toward understanding, growth, and healing"
            align="center"
          />
        </div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full flex items-stretch">
            <div className="w-[4px] rounded-full bg-[#3F2965]/10 overflow-hidden">
              <div
                ref={lineRef}
                className="w-full h-full origin-top scale-y-0 bg-gradient-to-b from-[#3F2965] via-[#dd1764] to-[#3F2965] shadow-[0_0_18px_rgba(221,23,100,0.4)]"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-28">
            {journeySteps.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex ${
                    isLeft ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-8 w-5 h-5 rounded-full bg-white shadow-[0_0_0_4px_rgba(63,41,101,0.08)] flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-[#3F2965] via-[#dd1764] to-[#3F2965]" />
                  </div>

                  {/* Card */}
                  <div
                    ref={(el) => {
                      if (el) cardsRef.current[index] = el;
                    }}
                    className="w-[420px] bg-white rounded-2xl p-8 shadow-[0_12px_30px_rgba(63,41,101,0.12)]"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-[#3F2965]/10 text-[#3F2965]">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-medium text-[#3F2965]">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-[#3F2965]/80 leading-relaxed">
                      {step.description}
                    </p>
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

/* Journey Content */
const journeySteps = [
  {
    title: "Book a Session",
    description:
      "Choose an online or offline consultation at a time that feels right for you.",
    icon: <CalendarCheck size={22} />,
  },
  {
    title: "Initial Understanding",
    description:
      "Your concerns are listened to with care in a supportive, non-judgmental environment.",
    icon: <Ear size={22} />,
  },
  {
    title: "Assessment & Diagnosis",
    description:
      "If required, professional diagnosis is conducted with clinical responsibility and ethical care.",
    icon: <ClipboardList size={22} />,
  },
  {
    title: "Structured Sessions",
    description:
      "Therapy and psycho-education sessions designed around your mental health needs.",
    icon: <Layers size={22} />,
  },
  {
    title: "Growth & Healing",
    description:
      "Develop awareness, coping strategies, and emotional resilience over time.",
    icon: <HeartHandshake size={22} />,
  },
];
