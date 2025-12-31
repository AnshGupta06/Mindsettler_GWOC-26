"use client";

import { CharReveal, SlideUp } from "./RevealComponent";

export default function SectionHeading({
  label,
  title,
  align = "left",
}: {
  label: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={`mb-20 ${
        align === "center" ? "text-center mx-auto" : ""
      } max-w-3xl`}
    >
      {/* Label: Slides up smoothly */}
      <SlideUp>
        <p className="text-xs tracking-widest uppercase text-[#Dd1764] font-semibold mb-4">
          {label}
        </p>
      </SlideUp>

      {/* Title: Uses the new fast, right-to-left CharReveal */}
      <h2 className="text-[2.75rem] leading-[1.15] font-semibold text-[#3F2965]">
        <CharReveal delay={0.1}>
          {title}
        </CharReveal>
      </h2>

      {/* Underline: Slides up with a slight delay */}
      <SlideUp delay={0.2}>
        <div
          className={`mt-6 h-[3px] w-16 bg-[#3F2965]/20 rounded ${
            align === "center" ? "mx-auto" : ""
          }`}
        />
      </SlideUp>
    </div>
  );
}