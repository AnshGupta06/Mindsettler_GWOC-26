"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CharReveal } from "../../components/common/RevealComponent";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
  const [direction, setDirection] = useState(0);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      goNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const goNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <section className="relative bg-[#F9F6FF] rounded-[2.5rem] overflow-hidden border border-[#3F2965]/5 shadow-sm">
    
      {/* Page Heading */}
      <div className="relative z-10 pt-10 pb-4 text-center">
        
        <div className="text-3xl md:text-5xl font-extrabold text-[#3F2965] tracking-tight">
            <CharReveal delay={0.1}>
                Mental Health Awareness
            </CharReveal>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* IMAGE AREA */}
          <div className="relative h-[350px] md:h-[500px] w-full flex items-center justify-center order-2 md:order-1">
            <div className="relative w-full h-full max-w-[500px] aspect-[4/5] md:aspect-square">
               <AnimatePresence mode="popLayout" custom={direction}>
                 <motion.div
                   key={activeIndex}
                   custom={direction}
                   initial={{ opacity: 0, scale: 0.9, rotate: direction * 2 }}
                   animate={{ opacity: 1, scale: 1, rotate: 0 }}
                   exit={{ opacity: 0, scale: 0.9, rotate: direction * -2 }}
                   transition={{ duration: 0.6, ease: "anticipate" }}
                   className="absolute inset-0"
                 >
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl shadow-[#3F2965]/20 border-[6px] border-white">
                      <Image
                        src={slides[activeIndex].image}
                        alt="Awareness"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                 </motion.div>
               </AnimatePresence>
            </div>

            {/* Navigation Buttons (Absolute on Mobile, Relative on Desktop) */}
            <div className="absolute md:hidden inset-0 flex items-center justify-between pointer-events-none px-2">
               <button
                  onClick={goPrev}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 shadow-lg text-[#3F2965] flex items-center justify-center backdrop-blur-sm active:scale-90 transition-all"
               >
                 <ChevronLeft size={20} />
               </button>
               <button
                  onClick={goNext}
                  className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 shadow-lg text-[#3F2965] flex items-center justify-center backdrop-blur-sm active:scale-90 transition-all"
               >
                 <ChevronRight size={20} />
               </button>
            </div>
          </div>

          {/* TEXT AREA */}
          <div className="order-1 md:order-2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative h-[160px] md:h-[200px] w-full flex items-center">
               <AnimatePresence mode="wait" custom={direction}>
                 <motion.div
                   key={activeIndex}
                   custom={direction}
                   variants={variants}
                   initial="enter"
                   animate="center"
                   exit="exit"
                   transition={{ duration: 0.4, ease: "easeOut" }}
                   className="absolute w-full"
                 >
                   <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#3F2965] leading-[1.1]">
                     {slides[activeIndex].title}
                   </h2>
                   <p className="mt-4 text-2xl md:text-4xl font-serif italic text-[#Dd1764]">
                     {slides[activeIndex].highlight}
                   </p>
                 </motion.div>
               </AnimatePresence>
            </div>

            {/* Desktop Controls & Indicators */}
            <div className="mt-8 flex flex-col md:flex-row items-center gap-8">
              {/* Dots */}
              <div className="flex gap-2 bg-white p-2 rounded-full border border-[#3F2965]/5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${
                      activeIndex === i 
                        ? "w-8 bg-[#Dd1764]" 
                        : "w-2 bg-[#3F2965]/20 hover:bg-[#3F2965]/40"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Desktop Arrows */}
              <div className="hidden md:flex gap-3">
                 <button
                    onClick={goPrev}
                    className="w-12 h-12 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] flex items-center justify-center hover:bg-[#3F2965] hover:text-white hover:border-[#3F2965] transition-all duration-300"
                 >
                   <ChevronLeft size={24} />
                 </button>
                 <button
                    onClick={goNext}
                    className="w-12 h-12 rounded-full border-2 border-[#3F2965]/10 text-[#3F2965] flex items-center justify-center hover:bg-[#3F2965] hover:text-white hover:border-[#3F2965] transition-all duration-300"
                 >
                   <ChevronRight size={24} />
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}