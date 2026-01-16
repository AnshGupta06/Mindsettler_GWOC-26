"use client";

import Link from "next/link";
import { CharReveal, SlideUp } from "../common/RevealComponent";
import { Building2, Users, TrendingUp, HeartHandshake } from "lucide-react";

export default function WorkplaceWellnessSection() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-[#F9F6FF] relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        
        {}
        <div className="mb-8 sm:mb-12 flex flex-col items-center">
          <SlideUp>
            <span className="inline-block text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-4 uppercase border border-[#Dd1764]/20 px-3 py-1 rounded-full bg-white shadow-sm">
              Corporate Wellness
            </span>
          </SlideUp>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3F2965] leading-tight tracking-tight mb-6">
            <div>
              <CharReveal delay={0.1}>
                Healthy Minds,
              </CharReveal>
            </div>
            <div className="text-[#Dd1764] italic font-serif mt-1">
              <CharReveal delay={0.2}>
                Thriving Workplaces
              </CharReveal>
            </div>
          </h2>

          <SlideUp delay={0.3}>
            <p className="text-lg sm:text-xl text-[#3F2965]/70 leading-relaxed font-medium max-w-2xl mx-auto">
              We partner with organizations to build mentally resilient teams. From workshops to confidential counseling, we create cultures where employees feel safe, valued, and productive.
            </p>
          </SlideUp>
        </div>

        {}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Users, text: "Team Workshops" },
            { icon: HeartHandshake, text: "1-on-1 Support" },
            { icon: TrendingUp, text: "Productivity Boost" },
            { icon: Building2, text: "Culture Building" }
          ].map((item, i) => (
            <SlideUp key={i} delay={0.4 + (i * 0.1)}>
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-[#3F2965]/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full justify-center">
                <div className="w-12 h-12 rounded-full bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] mb-1">
                  <item.icon size={22} />
                </div>
                <span className="text-[#3F2965] font-bold text-sm">{item.text}</span>
              </div>
            </SlideUp>
          ))}
        </div>

        <SlideUp delay={0.6}>
          <Link href="/corporate">
            {}
              {}
              <button className="w-full sm:w-auto relative px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-[#3F2965] text-white font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3F2965]/20 hover:-translate-y-1">
                <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-[#Dd1764] to-[#Dd1764] -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
                <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-[#Dd1764] to-[#Dd1764] -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
                        
              <span className="relative z-10 flex items-center gap-2">
                Partner With Us
              </span>
            </button>
          </Link>
        </SlideUp>

      </div>
    </section>
  );
}