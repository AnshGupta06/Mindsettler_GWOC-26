"use client";

import Reveal from "../common/Reveal";

export default function HeroSection() {
  const ModelViewer: any = "model-viewer";

  return (
    <section className="min-h-screen flex items-center px-24">
      <div className="grid grid-cols-2 gap-16 w-full">
        
        {/* Text Area */}
        <Reveal>
          <div>
            <div className="h-6 w-32 bg-[#Dd1764]/20 rounded mb-6" />
            <div className="h-16 w-full bg-[#3F2965]/20 rounded mb-4" />
            <div className="h-10 w-3/4 bg-[#3F2965]/10 rounded" />
          </div>
        </Reveal>

        {/* GLB */}
        <Reveal delay={0.15}>
          <div className="flex items-center justify-center">
            <ModelViewer
  src="/assets/heart+with+brain+3d+model.glb"
  alt="MindSettler 3D model"

  /* VISIBILITY */
  style={{
    width: "420px",
    height: "420px",
  }}

  /* CAMERA */
  camera-orbit="90deg 75deg 2.5m"
  field-of-view="30deg"
  exposure="1"

  /* INTERACTION */
  camera-controls
  disable-zoom
  interaction-prompt="none"

  /* MOTION */
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
