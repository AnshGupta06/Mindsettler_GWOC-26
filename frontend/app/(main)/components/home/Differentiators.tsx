"use client";

import { CharReveal, SlideUp, StaggerContainer, StaggerItem } from "../common/RevealComponent";
import {
  UserCheck,
  BookOpen,
  Globe,
  ShieldCheck,
  Heart,
} from "lucide-react";

export default function DifferentiatorsSection() {
  return (
    // UPDATED: Full width Purple background (#F9F6FF), No inner box
    <section className="py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-[#F9F6FF] relative overflow-hidden">
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 relative z-10">

        {/* Heading Area */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto flex flex-col items-center">
             <SlideUp>
                <span className="block text-[#Dd1764] font-bold text-xs sm:text-sm tracking-wide mb-2 sm:mb-3 uppercase">
                    Why Choose Us
                </span>
             </SlideUp>
             <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3F2965] space-y-1">
                <div>
                    <CharReveal delay={0.1} className="justify-center">
                        Thoughtful care, guided by
                    </CharReveal>
                </div>
                {/* Italic Pink Serif Style */}
                <div className="text-[#Dd1764] italic font-serif mt-1">
                    <CharReveal delay={0.1} className="justify-center">
                        ethics & empathy
                    </CharReveal>
                </div>
             </div>
        </div>

        {/* Staggered Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          <StaggerItem>
            <Card
              icon={<UserCheck size={28} strokeWidth={1.5} />}
              title="Founder-Led Practice"
              description="Guided by the vision of psychotherapist Parnika Bajaj, ensuring clinical responsibility."
            />
          </StaggerItem>

          <StaggerItem>
            <Card
              icon={<BookOpen size={28} strokeWidth={1.5} />}
              title="Structured Psycho-Education"
              description="Understanding why you feel what you feel — empowering informed healing."
            />
          </StaggerItem>

          <StaggerItem>
            <Card
              icon={<Globe size={28} strokeWidth={1.5} />}
              title="Online & Offline Access"
              description="Access support in a way that fits your lifestyle, comfort, and availability."
            />
          </StaggerItem>

           {/* Bottom Row (Centered on large screens) */}
           <div className="sm:col-span-2 lg:col-span-3 grid sm:grid-cols-2 gap-6 sm:gap-8 lg:w-2/3 mx-auto">
               <StaggerItem>
                    <Card
                        icon={<ShieldCheck size={28} strokeWidth={1.5} />}
                        title="Ethical Diagnosis"
                        description="Professional assessments conducted with responsibility and clarity."
                    />
               </StaggerItem>

               <StaggerItem>
                    <Card
                        icon={<Heart size={28} strokeWidth={1.5} />}
                        title="Human-First Approach"
                        description="Empathy before labels. Every individual is treated with care."
                    />
               </StaggerItem>
           </div>

        </StaggerContainer>

      </div>
    </section>
  );
}

function Card({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) {
  return (
    // Cards remain White to pop against the Purple Section
    <div className="group h-full p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white border border-[#3F2965]/5 hover:border-[#Dd1764]/20 hover:shadow-2xl hover:shadow-[#3F2965]/10 transition-all duration-500 hover:-translate-y-2">
      {/* Icon bg is light purple */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[#F9F6FF] text-[#3F2965] mb-4 sm:mb-6 md:mb-8 group-hover:bg-[#Dd1764] group-hover:text-white transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3F2965] mb-3 sm:mb-4">{title}</h3>
      <p className="text-[#3F2965]/70 text-sm sm:text-base md:text-lg leading-relaxed font-medium">{description}</p>
    </div>
  );
}