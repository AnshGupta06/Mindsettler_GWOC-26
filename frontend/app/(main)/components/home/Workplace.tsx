"use client";

import Link from "next/link";
import { CharReveal, SlideUp } from "../common/RevealComponent";
import { Building2, Users, TrendingUp, HeartHandshake } from "lucide-react";

export default function WorkplaceWellnessSection() {
  return (
    // UPDATED: Full width Purple background (#F9F6FF), No inner box
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-[#F9F6FF] relative overflow-hidden">

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 relative z-10">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: TEXT */}
          <div className="order-2 lg:order-1">
            
            {/* Header */}
            <div className="mb-6 sm:mb-8 text-center lg:text-left">
              <SlideUp>
                <span className="inline-block text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-3 uppercase border border-[#Dd1764]/20 px-3 py-1 rounded-full bg-white">
                  Corporate Wellness
                </span>
              </SlideUp>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3F2965] leading-tight tracking-tight">
                <div>
                  <CharReveal delay={0.1}>
                    Healthy Minds,
                  </CharReveal>
                </div>
                {/* UPDATED: Italic Pink Serif Style */}
                <div className="text-[#Dd1764] italic font-serif mt-1">
                  <CharReveal delay={0.2}>
                    Thriving Workplaces
                  </CharReveal>
                </div>
              </h2>
            </div>

            <SlideUp delay={0.3} className="mb-8 sm:mb-10 text-center lg:text-left">
              <p className="text-lg sm:text-xl text-[#3F2965]/70 leading-relaxed font-medium">
                We partner with organizations to build mentally resilient teams. From workshops to confidential counseling, we create cultures where employees feel safe, valued, and productive.
              </p>
            </SlideUp>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {[
                { icon: Users, text: "Team Workshops" },
                { icon: HeartHandshake, text: "1-on-1 Support" },
                { icon: TrendingUp, text: "Productivity Boost" },
                { icon: Building2, text: "Culture Building" }
              ].map((item, i) => (
                <SlideUp key={i} delay={0.4 + (i * 0.1)}>
                  {/* Cards remain White to stand out against Purple BG */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#3F2965]/5 shadow-sm hover:shadow-md transition-all">
                    <item.icon className="text-[#Dd1764]" size={20} />
                    <span className="text-[#3F2965] font-semibold">{item.text}</span>
                  </div>
                </SlideUp>
              ))}
            </div>

            <SlideUp delay={0.6} className="text-center lg:text-left">
              <Link href="/corporate">
                <button className="relative px-8 py-3.5 rounded-full bg-[#3F2965] text-white font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
                  <span className="absolute top-0 left-[-25%] w-[75%] h-full bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                  <span className="relative z-10 flex items-center gap-2">
                    Partner With Us
                  </span>
                </button>
              </Link>
            </SlideUp>
          </div>

          {/* RIGHT: VISUAL */}
          <div className="order-1 lg:order-2 flex justify-center">
            <SlideUp delay={0.2} className="relative w-full max-w-md aspect-square">
                {/* Decorative Circles */}
                <div className="absolute inset-0 bg-[#Dd1764]/5 rounded-full blur-3xl scale-90 animate-pulse" />
                
                {/* Card Container remains White */}
                <div className="relative w-full h-full bg-white rounded-[2.5rem] shadow-2xl shadow-[#3F2965]/10 border border-[#3F2965]/5 p-8 flex flex-col items-center justify-center text-center overflow-hidden group">
                   
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3F2965] to-[#Dd1764]" />
                   
                   <Building2 size={64} strokeWidth={1} className="text-[#3F2965] mb-6 group-hover:scale-110 transition-transform duration-500" />
                   
                   <h3 className="text-2xl font-bold text-[#3F2965] mb-2">MindSettler Corporate</h3>
                   <p className="text-[#3F2965]/60 text-sm mb-6">Empowering organizations through<br/>mental wellness.</p>
                   
                   <div className="w-full h-px bg-[#3F2965]/10 mb-6" />
                   
                   <div className="flex -space-x-3">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-[#F9F6FF] flex items-center justify-center text-xs font-bold text-[#3F2965]">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-[#Dd1764] flex items-center justify-center text-xs font-bold text-white">
                        +
                      </div>
                   </div>
                </div>
            </SlideUp>
          </div>

        </div>
      </div>
    </section>
  );
}