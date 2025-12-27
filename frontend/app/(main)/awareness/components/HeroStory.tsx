"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "/awareness_hero/brain-1.jpeg",
    title: "It’s okay to feel tired, sad, or anxious.",
    highlight: "It’s human.",
  },
  {
    image: "/awareness_hero/brain-2.jpeg",
    title: "Mental well-being begins with awareness.",
    highlight: "Not judgment.",
  },
  {
    image: "/awareness_hero/brain-3.jpeg",
    title: "Support is not weakness.",
    highlight: "It’s self-care.",
  },
  {
    image: "/awareness_hero/brain-4.jpeg",
    title: "Healing doesn’t follow a straight line.",
    highlight: "Take your time.",
  },
  {
    image: "/awareness_hero/brain-5.jpeg",
    title: "Asking for help shows strength.",
    highlight: "Never weakness.",
  },
];

export default function HeroStory() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Simple auto-play carousel (can be adjusted or removed if you prefer manual only)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative bg-[#f9f6ff] rounded-2xl">
      {/* Page Heading */}
<div className="relative max-w-7xl mx-auto px-6 pt-8 pb-2 text-center overflow-hidden">

  {/* Title */}
  <h1 className="relative text-4xl md:text-5xl font-extrabold text-primary leading-tight">
    Mental Health Awareness
  </h1>

</div>


      <div className="container mx-auto px-6 py-16 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* IMAGE AREA */}
          <div className="relative h-[320px] md:h-[460px] w-full flex items-center justify-center">
            {slides.map((slide, index) => (
              <motion.div
                key={`img-${index}`}
                initial={false}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.9,
                  zIndex: activeIndex === index ? 10 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute w-full h-full max-w-[460px]"
              >
                <div className="relative w-full h-full border-4 border-white shadow-2xl rounded-3xl overflow-hidden">
                  <Image
                    src={slide.image}
                    alt="Awareness"
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </motion.div>
            ))}

            {/* Arrow controls */}
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow-md px-3 py-2 text-sm font-semibold text-primary"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow-md px-3 py-2 text-sm font-semibold text-primary"
            >
              ›
            </button>
          </div>

          {/* TEXT AREA */}
          <div className="relative min-h-[180px] flex items-center">
            {slides.map((slide, index) => (
              <motion.div
                key={`text-${index}`}
                initial={false}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  y: activeIndex === index ? 0 : 20,
                }}
                transition={{ duration: 0.4 }}
                className="absolute"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-primary leading-tight">
                  {slide.title}
                  <br />
                  <span className="text-accent">{slide.highlight}</span>
                </h1>
              </motion.div>
            ))}
          </div>
        </div>

        {/* INDICATOR DOTS */}
        <div className="mt-8 flex justify-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                activeIndex === i ? "w-8 bg-accent" : "w-2 bg-softPurple"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}