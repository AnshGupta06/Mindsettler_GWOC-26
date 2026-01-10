"use client";

import { motion } from 'framer-motion';
import Link from "next/link";
import HeroCarousel from "./components/HeroCarousel";
import Image from "next/image";
import { awarenessAreas } from "./awarenessCardsData";
import { CharReveal, SlideUp, StaggerContainer, StaggerItem } from "../components/common/RevealComponent";
import { ArrowRight, BrainCircuit, Sparkles, Video } from "lucide-react";

export default function AwarenessPage() {
  return (
    <main className="min-h-screen bg-[#F9F6FF] relative overflow-hidden">

      {/* Background Decor (Matching Home Page style) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-[#3F2965]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-15%] w-[500px] h-[500px] bg-[#3F2965]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-[#3F2965]/3 rounded-full blur-[80px]" />
      </div>

      <HeroCarousel />

      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden py-12 lg:py-12">

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <SlideUp>
            <div className="text-center relative overflow-hidden">

              {/* Decorative Icon */}
              <div className="absolute top-0 left-6 opacity-10 rotate-12 hidden md:block">
                <BrainCircuit size={100} className="text-[#3F2965]" />
              </div>

              <h1 className="text-3xl sm:text-4xl bg-[#3F2965]md:text-5xl lg:text-6xl font-bold text-[#3F2965] leading-tight tracking-tight">
                <div className="mb-1">
                  <CharReveal delay={0.1}>
                    Understanding Your Mind
                  </CharReveal>
                </div>
                <div className="text-[#Dd1764] italic font-serif">
                  <CharReveal delay={0.2}>
                    Is the First Step Toward Healing
                  </CharReveal>
                </div>
              </h1>

              <SlideUp delay={0.3}>
                <p className="mt-6 text-base sm:text-lg md:text-xl text-[#3F2965]/70 max-w-3xl mx-auto leading-relaxed font-medium">
                  MindSettler is a psycho-education and mental well-being platform
                  that helps individuals understand their mental health and navigate
                  life’s challenges through awareness, guidance, and personalized
                  support in a safe and confidential environment.
                </p>
              </SlideUp>

              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 relative z-10">
                <SlideUp delay={0.4}>
                  <Link href="/resource" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto relative px-8 py-4 rounded-full bg-[#Dd1764] text-white font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#Dd1764]/30 hover:-translate-y-1 flex items-center justify-center gap-2">
                      <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-[#3F2965]/20 -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                      Explore Resources <ArrowRight size={18} />
                    </button>
                  </Link>
                </SlideUp>

                <SlideUp delay={0.5}>
                  <Link href="/services" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto relative px-8 py-4 rounded-full border-2 border-[#3F2965]/10 bg-white text-[#3F2965] font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:border-[#3F2965] hover:text-[#3F2965] hover:-translate-y-1">
                      Our Programs
                    </button>
                  </Link>
                </SlideUp>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Awareness Categories */}
      <section className="relative py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">



          <div className="text-center mb-12 md:mb-16">
            {/* <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F9F6FF] border border-[#3F2965]/10 text-[#Dd1764] font-bold text-xs uppercase tracking-widest mb-4"
            >
              <Sparkles size={12} /> Key Topics
            </motion.div> */}



            {/* Left Decorative SVG */}
            <div className="pointer-events-none absolute left-45 top-25 -translate-y-1/2 hidden lg:block">
              <Image
                src="/icons/overwhelmed-animate.svg"
                alt="Decorative awareness illustration"
                width={260}
                height={260}
                className="max-w-none"
              />
            </div>


            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3F2965]">
              <CharReveal delay={0.2}>
                Areas of Awareness
              </CharReveal>
            </h2>

            <div className="pointer-events-none absolute right-35 top-25 -translate-y-1/2 hidden lg:block">
              <Image
                src="/icons/Overwhelmed-bro.svg"
                alt="Decorative awareness illustration"
                width={260}
                height={260}
                className="max-w-none"
              />
            </div>


            <SlideUp delay={0.3}>
              <p className="mt-4 text-[#3F2965]/60 max-w-2xl mx-auto text-lg">
                Explore common mental health concerns and find the clarity you need to move forward.
              </p>
            </SlideUp>
          </div>

          <StaggerContainer delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {awarenessAreas.map((item) => (
                <StaggerItem key={item.slug}>
                  <Link href={`/awareness/${item.slug}`} className="block h-full">
                    <div className="group h-full bg-white rounded-[2rem] overflow-hidden border border-[#3F2965]/5 shadow-sm hover:shadow-xl hover:shadow-[#3F2965]/10 transition-all duration-500 cursor-pointer flex flex-col">

                      {/* Image Container */}
                      <div className="relative h-56 sm:h-64 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Hover Action */}
                        <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-white text-[#3F2965] p-3 rounded-full shadow-lg border border-[#3F2965]/10">
                          <ArrowRight size={20} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 flex-1 flex flex-col relative">
                        <h3 className="text-xl md:text-2xl font-bold text-[#3F2965] mb-3 group-hover:text-[#Dd1764] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[#3F2965]/60 text-sm leading-relaxed line-clamp-3">
                          {item.description}
                        </p>

                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>
    </main>
  );
}