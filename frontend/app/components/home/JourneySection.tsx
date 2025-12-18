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

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate center timeline
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 70%",
          scrub: true,
        },
      }
    );

    // Animate cards
    cardsRef.current.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-24 bg-[#faf7fb]"
    >
      {/* Heading */}
      <div className="max-w-3xl mx-auto text-center mb-28">
       <SectionHeading
  label="Your Journey With MindSettler"
  title="A guided path toward understanding, growth, and healing"
  align="center"
/>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-5xl mx-auto">

        {/* Center Line */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full">
          <div
            ref={lineRef}
            className="w-[2px] bg-[#3F2965]/30 h-full"
          />
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
                <div className="absolute left-1/2 -translate-x-1/2 top-8 w-4 h-4 rounded-full bg-[#3F2965]" />

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
