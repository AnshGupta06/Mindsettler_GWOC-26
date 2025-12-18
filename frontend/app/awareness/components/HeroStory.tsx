"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const slides = [
  {
    image: "/awareness_hero/brain-1.jpeg",
    title: "It's okay to feel tired, sad, or anxious.",
    subtitle: "It's human.",
  },
  {
    image: "/awareness_hero/rbrain-1.png",
    title: "Mental well-being begins with awareness.",
    subtitle: "Not judgment.",
  },
  {
    image: "/awareness_hero/brain-3.jpeg",
    title: "Support is not weakness.",
    subtitle: "It's self-care.",
  },
  {
    image: "/awareness_hero/brain-4.jpeg",
    title: "Your journey matters.",
    subtitle: "Every step forward counts.",
  },
];

// Separate component for each image slide to properly use hooks
function ImageSlide({ 
  slide, 
  index, 
  scrollYProgress, 
  total 
}: { 
  slide: typeof slides[0]; 
  index: number; 
  scrollYProgress: MotionValue<number>;
  total: number;
}) {
  // Calculate slide position in scroll progress (0 to 1)
  // Each slide occupies an equal portion of the scroll
  const slideStart = index / total;
  const slideEnd = (index + 1) / total;
  const slideCenter = (slideStart + slideEnd) / 2;

  const opacity = useTransform(
    scrollYProgress,
    [slideStart, slideCenter, slideEnd],
    [0, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [slideStart, slideCenter, slideEnd],
    [0.9, 1, 0.9]
  );

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <Image
        src={slide.image}
        alt="Mental health illustration"
        width={500}
        height={500}
        priority={index === 0}
        className="object-contain w-full h-full"
        unoptimized
      />
    </motion.div>
  );
}

// Separate component for each text slide to properly use hooks
function TextSlide({ 
  slide, 
  index, 
  scrollYProgress, 
  total 
}: { 
  slide: typeof slides[0]; 
  index: number; 
  scrollYProgress: MotionValue<number>;
  total: number;
}) {
  // Calculate slide position in scroll progress (0 to 1)
  // Each slide occupies an equal portion of the scroll
  const slideStart = index / total;
  const slideEnd = (index + 1) / total;
  const slideCenter = (slideStart + slideEnd) / 2;

  const opacity = useTransform(
    scrollYProgress,
    [slideStart, slideCenter, slideEnd],
    [0, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [slideStart, slideCenter, slideEnd],
    [30, 0, -30]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center w-full"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
        {slide.title}
        <br />
        <span className="text-accent">{slide.subtitle}</span>
      </h1>
    </motion.div>
  );
}

// Hero Image component - must be outside render
function HeroImage({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="relative w-full h-[420px] md:h-[500px] flex items-center justify-center">
      {slides.map((slide, index) => (
        <ImageSlide
          key={slide.image}
          slide={slide}
          index={index}
          scrollYProgress={scrollYProgress}
          total={slides.length}
        />
      ))}
    </div>
  );
}

// Hero Text component - must be outside render
function HeroText({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="relative h-[240px] md:h-[300px] flex items-center w-full">
      {slides.map((slide, index) => (
        <TextSlide
          key={slide.title}
          slide={slide}
          index={index}
          scrollYProgress={scrollYProgress}
          total={slides.length}
        />
      ))}
    </div>
  );
}

export default function HeroStory() {


  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-lightBg"
      style={{ height: `${(slides.length + 1) * 100}vh` }}
    >
      {/* Sticky Hero */}
      <div className="sticky top-0 min-h-screen flex items-center py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto px-6 w-full">
          {/* Image */}
          <div className="w-full flex justify-center">
            <HeroImage scrollYProgress={scrollYProgress} />
          </div>

          {/* Text */}
          <div className="w-full">
            <HeroText scrollYProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
