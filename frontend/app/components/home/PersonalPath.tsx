"use client";

import Reveal from "../common/Reveal";
import Image from "next/image";
import SectionHeading from "../common/HeadingSection";

export default function PersonalPathSection() {
  return (
    <section className="py-32 px-24 bg-gradient-to-b from-[#f3ecff] via-[#ffeaf5] to-[#f7f0ff]">
      <div className="grid grid-cols-2 gap-20 items-center max-w-6xl mx-auto rounded-3xl border border-white/70 bg-white/80 backdrop-blur-sm p-12 shadow-[0_18px_45px_rgba(63,41,101,0.04)]">

        {/* TEXT */}
        <Reveal>
          <div className="max-w-xl">
            <SectionHeading
  label="Your Personal Path to Wellness"
  title="Every journey is unique. Your care should be too."
/>

            <p className="text-lg leading-relaxed text-[#3F2965]/80 mb-8">
              At MindSettler, we walk alongside you, providing the tools,
              understanding, and professional support you need to navigate your
              mental health journey with confidence.
            </p>

            <p className="text-lg leading-relaxed text-[#3F2965]/80 mb-10">
              Our focus on psycho-education empowers you with knowledge — helping
              you understand your experiences, emotions, and patterns rather
              than feeling overwhelmed by them.
            </p>

            <button className="px-7 py-3 rounded-lg bg-[#Dd1764] text-white font-medium hover:bg-[#c8155c] transition">
              Discover Our Approach
            </button>
          </div>
        </Reveal>

        {/* IMAGE */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl overflow-hidden shadow-[0_12px_30px_rgba(63,41,101,0.12)]">
            <Image
              src="/images/personal-path.jpg" 
              alt="A calm path symbolizing personal growth and healing"
              width={600}
              height={420}
              className="object-cover w-full h-full"
            />
          </div>
        </Reveal>

      </div>
    </section>
  );
}
