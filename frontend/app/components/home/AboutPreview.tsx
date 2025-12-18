"use client";

import Reveal from "../common/Reveal";
import SectionHeading from "../common/HeadingSection";
import {
  Brain,
  HeartPulse,
  Puzzle,
  ShieldCheck,
} from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-32 px-24 bg-gradient-to-b from-[#f3ecff] via-[#ffeaf5] to-[#f7f0ff]">
      <Reveal>
        <div className="max-w-6xl mx-auto rounded-3xl border border-[#3F2965]/8 bg-white/85 backdrop-blur-sm p-12 shadow-[0_22px_55px_rgba(63,41,101,0.12)]">

        {/* Heading */}
        <SectionHeading
          label="About MindSettler"
          title="Bridging mental health awareness with professional care"
        />

        <div className="grid grid-cols-2 gap-20 items-start">

          {/* LEFT: TEXT */}
          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-[#3F2965]/80 mb-6">
                MindSettler was created to bridge the gap between mental health
                awareness and professional care. We believe that understanding
                your mind is the first step toward healing.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-[#3F2965]/80">
                Through structured psycho-education and personalized
                psychotherapy sessions, MindSettler supports individuals in
                navigating their mental health with clarity and care.
              </p>
            </Reveal>
          </div>

          {/* RIGHT: HIGHLIGHTS */}
          <Reveal delay={0.05}>
            <div className="bg-[#faf7fb] rounded-2xl p-10 space-y-6 border border-[#3F2965]/10 shadow-[0_18px_45px_rgba(63,41,101,0.10)]">

              <Feature
                icon={<Brain size={22} />}
                title="Recognize emotional patterns"
                description="Develop awareness of recurring thoughts, emotions, and behaviors."
              />
            <Reveal delay={0.05}>
              <Feature
                icon={<Puzzle size={22} />}
                title="Understand mental health conditions"
                description="Gain clarity through simple, structured psycho-education."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <Feature
                icon={<HeartPulse size={22} />}
                title="Develop healthier coping mechanisms"
                description="Learn practical strategies to manage stress and emotional challenges."
              />
            </Reveal>

            <Reveal delay={0.15}>
              <Feature
                icon={<ShieldCheck size={22} />}
                title="Experience safe & confidential care"
                description="All sessions are conducted ethically in a non-judgmental space."
              />
            </Reveal>
          </div>
          </Reveal>
        </div>
        </div>
      </Reveal>
    </section>
  );
}

/* Feature Row */
function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-xl bg-[#3F2965]/10 text-[#3F2965] flex items-center justify-center">
        {icon}
      </div>

      <div>
        <h4 className="text-lg font-medium text-[#3F2965] mb-1">
          {title}
        </h4>
        <p className="text-[#3F2965]/70 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
