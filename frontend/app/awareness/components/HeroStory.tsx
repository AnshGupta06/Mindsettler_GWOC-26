"use client";

import { motion, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

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
];

export default function HeroStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // This updates the active index as the user scrolls through the 300vh height
    return scrollYProgress.on("change", (latest) => {
      const index = Math.min(
        slides.length - 1,
        Math.floor(latest * slides.length)
      );
      setActiveIndex(index);
    });
  }, [scrollYProgress]);

  return (
    // 1. We use 300vh so there is enough "room" to scroll for 3 messages.
    <section ref={containerRef} className="relative h-[300vh] bg-lightBg">
      
      {/* 2. Sticky container: Stay on screen for the duration of the 300vh scroll */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 items-center">
          
          {/* IMAGE AREA */}
          <div className="relative h-[350px] md:h-[500px] w-full flex items-center justify-center">
            {slides.map((slide, index) => (
              <motion.div
                key={`img-${index}`}
                initial={false}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.8,
                  zIndex: activeIndex === index ? 10 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute w-full h-full max-w-[450px]"
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
          </div>

          {/* TEXT AREA */}
          <div className="relative h-[250px] flex items-center">
            {slides.map((slide, index) => (
              <motion.div
                key={`text-${index}`}
                initial={false}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  y: activeIndex === index ? 0 : 30,
                  filter: activeIndex === index ? "blur(0px)" : "blur(10px)",
                }}
                transition={{ duration: 0.5 }}
                className="absolute"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
                  {slide.title}
                  <br />
                  <span className="text-accent">
                    {slide.highlight}
                  </span>
                </h1>
              </motion.div>
            ))}
          </div>

        </div>

        {/* INDICATOR DOTS (Visual cue for the user) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 transition-all duration-500 rounded-full ${activeIndex === i ? 'w-8 bg-accent' : 'w-2 bg-softPurple'}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}