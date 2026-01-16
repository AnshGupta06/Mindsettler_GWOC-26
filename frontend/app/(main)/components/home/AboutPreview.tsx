"use client";
import { useState, useEffect, useRef } from "react";
import Reveal from "../common/Reveal";
import { SlideUp, StaggerContainer, StaggerItem } from "../common/RevealComponent";
import Image from "next/image";
import Link from "next/link";


const RevealOnScrollImage = ({ src, alt, className, ...props }: any) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold: 0.2 } 
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className || ''}`}>
      {isVisible && (
        <Image
          src={src}
          alt={alt}
          className="animate-in fade-in duration-700 slide-in-from-bottom-4 w-full h-auto object-contain drop-shadow-md"
          {...props}
        />
      )}
    </div>
  );
};

export default function AboutPreview() {
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  const handleFlip = (index: number) => {
    setFlippedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const features = [
    { title: "Patterns", text: "Recognize emotional patterns" },
    { title: "Conditions", text: "Understand mental health conditions" },
    { title: "Mechanisms", text: "Develop healthier coping mechanisms" },
    { title: "Safe Care", text: "Experience safe & confidential care" }
  ];

  return (
    <section className="relative py-8 lg:py-20 px-4 sm:px-6 md:px-8 bg-[#F9F6FF] overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full relative z-10">

        {}
        <div className="lg:hidden flex flex-col">
          
          {}
          <div className="flex items-center justify-between gap-2 mb-6">
            
            {}
            <div className="flex-1 flex flex-col items-start pr-2">
               <Reveal>
                <div className="inline-block py-1 px-3 rounded-full bg-white border border-[#3F2965]/10 text-[#3F2965] font-bold text-[10px] uppercase tracking-widest shadow-sm mb-3">
                  Our Mission
                </div>
              </Reveal>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3F2965] leading-[1.1] tracking-tight text-left">
                Bridging awareness with <span className="text-[#Dd1764] italic font-serif">professional care.</span>
              </h2>
            </div>

            {}
            <div className="w-[110px] sm:w-[140px] shrink-0">
               <PeaceOfMindIllustration />
            </div>
          </div>

          {}
          <div className="mb-8">
             <Reveal delay={0.1}>
                <div className="mb-4 pl-4 border-l-4 border-[#Dd1764]">
                   <p className="text-lg font-medium text-[#3F2965]/90 italic leading-relaxed">
                    "Compassion is the heart of Healing."
                   </p>
                </div>
              </Reveal>

              <SlideUp delay={0.2}>
                <p className="text-base text-[#3F2965]/70 leading-relaxed font-medium">
                  MindSettler bridges the gap between mental health awareness and professional help. We believe that understanding your mind is the first step toward healing.
                </p>
              </SlideUp>
          </div>

          {}
          <div className="w-full mb-8">
              <StaggerContainer className="grid grid-cols-2 gap-3 justify-items-center">
                {features.map((item, i) => (
                  <StaggerItem key={i} className="w-full">
                    <Card item={item} i={i} flippedIndices={flippedIndices} handleFlip={handleFlip} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
          </div>

          {}
          <div className="flex items-end justify-between">
             <div className="mb-4">
                <Link href="/about">
                  <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#3F2965] text-white font-bold text-sm tracking-wide shadow-lg active:scale-95 transition-transform">
                    More About Us
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </Link>
             </div>
             {}
             <div className="w-[120px] sm:w-[150px] -mr-4 -mb-4 opacity-90">
                <MindIllustration />
             </div>
          </div>

        </div>

        {}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
          
          {}
          <div className="col-span-3 flex justify-start">
             <div className="w-full max-w-[350px]">
                <MindIllustration />
             </div>
          </div>

          {}
          <div className="col-span-6 flex flex-col items-center text-center px-4">
            <Reveal>
              <div className="inline-block py-1.5 px-5 rounded-full bg-white border border-[#3F2965]/10 text-[#3F2965] font-bold text-xs uppercase tracking-widest shadow-sm mb-6">
                Our Mission
              </div>
            </Reveal>

            <div className="mb-6">
              <h2 className="text-5xl xl:text-6xl font-extrabold text-[#3F2965] leading-[1.1] tracking-tight">
                Bridging awareness with <span className="text-[#Dd1764] italic font-serif block mt-2">professional care.</span>
              </h2>
            </div>

            <Reveal delay={0.1}>
              <div className="mb-6 relative inline-block">
                 <p className="text-2xl font-medium text-[#3F2965]/90 italic leading-relaxed">
                  "Compassion is the heart of <span className="text-[#Dd1764] font-serif font-bold">Healing</span>."
                 </p>
              </div>
            </Reveal>

            <SlideUp delay={0.2} className="max-w-2xl mx-auto mb-10">
              <p className="text-lg text-[#3F2965]/70 leading-relaxed font-medium">
                MindSettler bridges the gap between mental health awareness and professional help. We believe that understanding your mind is the first step toward healing.
              </p>
            </SlideUp>

            <div className="w-full max-w-5xl mx-auto mb-10">
              <StaggerContainer className="grid grid-cols-4 gap-6 justify-items-center">
                {features.map((item, i) => (
                  <StaggerItem key={i} className="w-full">
                    <Card item={item} i={i} flippedIndices={flippedIndices} handleFlip={handleFlip} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            <SlideUp delay={0.4}>
              <Link href="/about">
                {}
                  
                  <button className="flex items-center gap-3 w-full relative px-8 py-4 md:px-10 md:py-4 rounded-full bg-[#3F2965] text-white border-[#3F2965]/10 text-lg font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/30 hover:-translate-y-0.5">
                <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#Dd1764] to-[#Dd1764] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#Dd1764] to-[#Dd1764] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                
                <span className="relative z-10 group-hover:text-white">More About Us</span>
                  
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </SlideUp>
          </div>

          {}
          <div className="col-span-3 flex justify-end">
             <div className="w-full max-w-[350px]">
                <PeaceOfMindIllustration />
             </div>
          </div>

        </div>

      </div>
    </section>
  );
}


function Card({ item, i, flippedIndices, handleFlip }: { item: any, i: number, flippedIndices: number[], handleFlip: (i:number)=>void }) {
  return (
    <div
      className="group w-full aspect-square max-w-[180px] perspective-1000 cursor-pointer mx-auto"
      onClick={() => handleFlip(i)}
    >
      <div className={`relative w-full h-full duration-500 transform-style-3d ${flippedIndices.includes(i) ? 'rotate-y-180' : 'lg:group-hover:rotate-y-180'}`}>
        
        {}
        <div className="absolute inset-0 backface-hidden bg-white hover:bg-white rounded-2xl shadow-md border border-[#3F2965]/10 flex flex-col items-center justify-center p-3 transition-all duration-300 hover:border-[#3F2965] hover:shadow-lg">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-2">
            <Image
              src="/assets/heart-brain-icon.png"
              alt="Icon"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[#3F2965] font-bold uppercase tracking-wider text-[10px] sm:text-xs text-center leading-tight">
            {item.title}
          </span>
        </div>

        {}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#3F2965] rounded-2xl shadow-lg flex items-center justify-center text-center p-3 border border-[#3F2965]">
          <p className="text-white font-medium text-[11px] sm:text-sm leading-tight">
            {item.text}
          </p>
        </div>

      </div>
    </div>
  )
}

function PeaceOfMindIllustration() {
  return (
    <RevealOnScrollImage
      src="/assets/about1.svg"
      alt="Peace of Mind"
      width={400}
      height={400}
    />
  );
}

function MindIllustration() {
  return (
    <RevealOnScrollImage
      src="/assets/about2.svg"
      alt="Mind Awareness"
      width={400}
      height={400}
    />
  );
}