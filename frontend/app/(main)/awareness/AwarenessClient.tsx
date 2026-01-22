"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import HeroCarousel from "./components/HeroCarousel";
import Image from "next/image";
import { awarenessAreas } from "./awarenessCardsData";
import { CharReveal, SlideUp } from "../components/common/RevealComponent"; // Removed Stagger imports
import { ArrowRight, BrainCircuit, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion directly

export default function AwarenessPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAreas = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return awarenessAreas;

    return awarenessAreas.filter((item) => {
      if (item.title.toLowerCase().includes(query)) return true;
      if (item.description.toLowerCase().includes(query)) return true;
      if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) return true;
      return false;
    });
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-[#F9F6FF] relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] bg-[#3F2965]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-15%] w-[500px] h-[500px] bg-[#3F2965]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-[#3F2965]/3 rounded-full blur-[80px]" />
      </div>

      <HeroCarousel />

      <section className="relative z-10 overflow-hidden py-12 lg:py-12">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <SlideUp>
            <div className="text-center relative overflow-hidden">
              <div className="absolute top-0 left-6 opacity-10 rotate-12 hidden md:block">
                <BrainCircuit size={100} className="text-[#3F2965]" />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#3F2965] leading-tight tracking-tight">
                <div className="mb-1">
                  <CharReveal delay={0.1}>Understanding Your Mind</CharReveal>
                </div>
                <div className="text-[#Dd1764] italic font-serif">
                  <CharReveal delay={0.2}>Is the First Step Toward Healing</CharReveal>
                </div>
              </h1>

              <SlideUp delay={0.3}>
                <p className="mt-6 text-base sm:text-lg md:text-xl text-[#3F2965]/70 max-w-3xl mx-auto leading-relaxed font-medium">
                  MindSettler is a psycho-education and mental well-being platform...
                </p>
              </SlideUp>

              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 relative z-10">
                 <SlideUp delay={0.4}>
                  <Link href="/resource" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto relative px-8 py-4 rounded-full bg-[#Dd1764] text-white text-lg font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5">
                      <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                      <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                      <span className="relative z-10 group-hover:text-white">Explore Resources</span>
                    </button>
                  </Link>
                </SlideUp>

                <SlideUp delay={0.5}>
                  <Link href="/services" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto relative px-8 py-4 rounded-full bg-white text-[#3F2965] border-2 border-[#3F2965]/10 text-lg font-bold tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-[#3F2965]/20 hover:-translate-y-0.5">
                      <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                      <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                      <span className="relative z-10 group-hover:text-white">Our Programs</span>
                    </button>
                  </Link>
                </SlideUp>
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      <section className="relative py-12 lg:py-16 min-h-[50vh]"> {/* Added min-h to prevent scroll jumping */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-12">
            
            <div className="pointer-events-none absolute left-45 top-25 -translate-y-1/2 hidden lg:block">
              <Image src="/icons/overwhelmed-animate.svg" alt="Decorative" width={260} height={260} className="max-w-none"/>
            </div>
            <div className="pointer-events-none absolute right-35 top-25 -translate-y-1/2 hidden lg:block">
              <Image src="/icons/Overwhelmed-bro.svg" alt="Decorative" width={260} height={260} className="max-w-none"/>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3F2965]">
              <CharReveal delay={0.2}>Areas of Awareness</CharReveal>
            </h2>

            <SlideUp delay={0.3}>
              <p className="mt-4 text-[#3F2965]/60 max-w-2xl mx-auto text-lg mb-8">
                Explore common mental health concerns and find the clarity you need to move forward.
              </p>
            </SlideUp>

            <SlideUp delay={0.4}>
              <div className="max-w-lg mx-auto relative z-20">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#Dd1764]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#3F2965]/40" size={20} />
                    
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search feeling (e.g. 'panic', 'sad', 'sleep')..."
                      className="w-full pl-12 pr-12 py-4 rounded-full bg-white border border-[#3F2965]/10 text-[#3F2965] placeholder:text-[#3F2965]/40 font-medium focus:outline-none focus:ring-2 focus:ring-[#Dd1764]/20 focus:border-[#Dd1764]/50 shadow-sm hover:shadow-md transition-all duration-300"
                    />

                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-[#3F2965]/40 hover:text-[#3F2965] transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </SlideUp>

          </div>

          {/* FIX: Removed StaggerContainer. 
            Using direct motion.div with 'layout' prop for smooth filtering animations. 
          */}
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout"> 
              {filteredAreas.length > 0 ? (
                filteredAreas.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={item.slug}
                  >
                    <Link href={`/awareness/${item.slug}`} className="block h-full">
                      <div className="group h-full bg-white rounded-[2rem] overflow-hidden border border-[#3F2965]/5 shadow-sm hover:shadow-xl hover:shadow-[#3F2965]/10 transition-all duration-500 cursor-pointer flex flex-col">
                        <div className="relative h-56 sm:h-64 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-white text-[#3F2965] p-3 rounded-full shadow-lg border border-[#3F2965]/10">
                            <ArrowRight size={20} />
                          </div>
                        </div>
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
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full text-center py-12"
                  key="empty-state"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F9F6FF] mb-4">
                    <Search className="text-[#3F2965]/30" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#3F2965] mb-2">No matches found</h3>
                  <p className="text-[#3F2965]/60">
                    Try searching for a different symptom or feeling.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
        </div>
      </section>
    </main>
  );
}