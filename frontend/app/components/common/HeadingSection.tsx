"use client";

import Reveal from "./Reveal";

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
      <Reveal>
        <p className="text-xs tracking-widest uppercase text-[#Dd1764] font-semibold mb-4">
          {label}
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="text-[2.75rem] leading-[1.15] font-semibold text-[#3F2965]">
          {title}
        </h2>
      </Reveal>

      {/* subtle underline */}
      <Reveal delay={0.1}>
        <div
          className={`mt-6 h-[3px] w-16 bg-[#3F2965]/20 rounded ${
            align === "center" ? "mx-auto" : ""
          }`}
        />
      </Reveal>
    </div>
  );
}
