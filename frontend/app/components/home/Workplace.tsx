"use client";

import Reveal from "../common/Reveal";
import { Building2 } from "lucide-react";
import SectionHeading from "../common/HeadingSection";

export default function WorkplaceWellnessSection() {
  return (
    <section className="py-32 px-24 bg-gradient-to-b from-[#f3ecff] via-[#ffeaf5] to-[#f7f0ff]">
      <div className="max-w-3xl mx-auto text-center rounded-3xl border border-white/70 bg-white/80 backdrop-blur-sm p-12 shadow-[0_18px_45px_rgba(63,41,101,0.04)]">

        <Reveal>
          <div className="flex justify-center mb-6 text-[#3F2965]">
            <div className="w-14 h-14 rounded-2xl bg-[#3F2965]/10 flex items-center justify-center">
              <Building2 size={26} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <SectionHeading
  label="Corporate & Organizational Care"
  title="Wellness solutions designed for healthier workplaces"
  align="center"
/>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-[#3F2965]/80 mb-10">
            We partner with organizations to foster mentally healthy and
            productive work environments through workshops, group sessions, and
            collaborative programs designed for real workplace challenges.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <button className="px-8 py-3 rounded-lg bg-[#Dd1764] text-white font-medium hover:bg-[#c8155c] transition">
            Explore Corporate Services
          </button>
        </Reveal>

      </div>
    </section>
  );
}
