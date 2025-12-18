"use client";

import Reveal from "../common/Reveal";

export default function HeroSection() {
  const ModelViewer: any = "model-viewer";

  return (
    <section className="min-h-screen flex items-center px-24">
      <div className="grid grid-cols-2 gap-20 w-full items-center">

        {/* TEXT AREA */}
        <Reveal>
          <div className="max-w-xl">

            {/* Accent label (optional but classy) */}
            <p className="text-sm tracking-wide text-[#Dd1764] font-medium mb-6">
              Mental Well-Being & Psycho-Education
            </p>

            {/* Main Heading */}
            <h1 className="text-5xl leading-tight font-semibold text-[#3F2965] mb-6">
              Understanding Your Mind.{" "}
              <span className="block font-normal">
                Supporting Your Healing.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="text-lg leading-relaxed text-[#3F2965]/80 mb-10">
              MindSettler is a psycho-education and mental well-being platform
              offering structured online and offline psychotherapy consultations
              to help individuals understand their mental health and navigate
              life’s challenges with clarity and care.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-6">
              <button className="px-7 py-3 rounded-lg bg-[#Dd1764] text-white font-medium hover:bg-[#c8155c] transition">
                Book a Consultation
              </button>

              <button className="px-7 py-3 rounded-lg border border-[#3F2965]/40 text-[#3F2965] font-medium hover:bg-[#3F2965]/5 transition">
                Explore How It Works
              </button>
            </div>
          </div>
        </Reveal>

        {/* GLB AREA */}
        {/* GLB */}
<Reveal delay={0.15}>
  <div className="relative flex items-center justify-center">

    {/* Soft background card */}
    <div
      className="
        absolute
        w-[520px]
        h-[520px]
        rounded-[40px]
        bg-[#3F2965]/10
        blur-[0.5px]
      "
    />

    {/* Subtle glow */}
    <div
      className="
        absolute
        w-[420px]
        h-[420px]
        rounded-full
        bg-[#Dd1764]/2
        blur-[80px]
      "
    />

    {/* Optional outline ring */}
    <div
      className="
        absolute
        w-[460px]
        h-[460px]
        rounded-full
        border
        border-[#3F2965]/10
      "
    />

    {/* Actual GLB */}
    <ModelViewer
      src="/assets/heart+with+brain+3d+model.glb"
      alt="MindSettler 3D model"

      style={{
        width: "420px",
        height: "420px",
        zIndex: 2,
      }}

      camera-orbit="90deg 75deg 2.5m"
      field-of-view="30deg"
      exposure="1"

      camera-controls
      disable-zoom
      interaction-prompt="none"

      auto-rotate
      auto-rotate-delay="0"
      rotation-per-second="10deg"
    />
  </div>
</Reveal>

      </div>
    </section>
  );
}
