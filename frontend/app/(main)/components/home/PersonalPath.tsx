"use client";
import Link from "next/link";
import Image from "next/image";
import { CharReveal, SlideUp, ImageWipeReveal } from "../common/RevealComponent";

export default function PersonalPathSection() {
  return (
    // UPDATED: Full width White background, No inner box
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-[#F9F6FF] relative overflow-hidden">
        
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20 items-center">

           {/* LEFT: IMAGE */}
            <SlideUp>
              <div className="relative group">
                <ImageWipeReveal delay={0.1}>
                  {/* Changed border-white to border-[#F9F6FF] (very subtle) or just relied on shadow since bg is white */}
                  <div className="relative rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-[#3F2965]/10 h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] w-full border-4 border-[#F9F6FF]">

                    <Image
                      src="/assets/new_journey.jpeg" 
                      alt="Person walking on a peaceful path"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-[#3F2965]/10 group-hover:bg-transparent transition-colors duration-500" />

                  </div>
                </ImageWipeReveal>
              </div>
            </SlideUp>

            {/* RIGHT: TEXT */}
            <div className="max-w-xl mx-auto lg:mx-0">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <SlideUp>
                        <span className="block text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3 uppercase">
                            Your Personal Path
                        </span>
                    </SlideUp>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3F2965] leading-tight space-y-1">
                        <div>
                            <CharReveal delay={0.1}>
                                Every journey is unique.
                            </CharReveal>
                        </div>
                        {/* Italic Pink Serif Style */}
                        <div className="text-[#Dd1764] italic font-serif mt-1">
                            <CharReveal delay={0.1}>
                                Your care should be too.
                            </CharReveal>
                        </div>
                    </div>
                </div>

                <SlideUp delay={0.2} className="mb-6 sm:mb-8">
                    <p className="text-base sm:text-lg md:text-xl text-[#3F2965]/70 leading-relaxed font-medium">
                    At MindSettler, we walk alongside you. We focus on psycho-education to empower you with knowledge — helping you understand your experiences rather than feeling overwhelmed by them.
                    </p>
                </SlideUp>

                <SlideUp delay={0.3} className="mb-8 sm:mb-10 md:mb-12">
                    <p className="text-sm sm:text-base md:text-lg text-[#3F2965]/70 leading-relaxed">
                    Whether you need structured therapy or a listening ear, our approach is tailored to fit your life, your needs, and your pace.
                    </p>
                </SlideUp>

                <SlideUp delay={0.4}>
                  <Link href="/services">
                    <button className="w-full sm:w-auto relative px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-[#Dd1764] text-white font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
                        <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#3F2965] to-[#513681] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                        <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#3F2965] to-[#513681] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                        <span className="relative z-10 flex items-center justify-center gap-2">Discover Our Services</span>
                    </button>
                    </Link>
                </SlideUp>
            </div>

        </div>
    </section>
  );
}