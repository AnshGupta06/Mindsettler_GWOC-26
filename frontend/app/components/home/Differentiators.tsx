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
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-[1440px] mx-auto">

        {/* Heading Area */}
        <div className="text-center mb-20 max-w-3xl mx-auto flex flex-col items-center">
             <SlideUp>
                <span className="block text-[#Dd1764] font-bold text-sm tracking-wide mb-3 uppercase">
                    Why Choose Us
                </span>
             </SlideUp>
             <div className="flex flex-wrap justify-center text-3xl md:text-5xl font-bold text-[#3F2965]">
                <CharReveal delay={0.1}>
                    Thoughtful care, guided by
                </CharReveal>
                <CharReveal delay={0.1} className="text-[#Dd1764] ml-2">
                     ethics & empathy
                </CharReveal>
             </div>
        </div>

        {/* Staggered Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <StaggerItem>
            <Card
              icon={<UserCheck size={32} strokeWidth={1.5} />}
              title="Founder-Led Practice"
              description="Guided by the vision of psychotherapist Parnika Bajaj, ensuring clinical responsibility."
            />
          </StaggerItem>

          <StaggerItem>
            <Card
              icon={<BookOpen size={32} strokeWidth={1.5} />}
              title="Structured Psycho-Education"
              description="Understanding why you feel what you feel — empowering informed healing."
            />
          </StaggerItem>

          <StaggerItem>
            <Card
              icon={<Globe size={32} strokeWidth={1.5} />}
              title="Online & Offline Access"
              description="Access support in a way that fits your lifestyle, comfort, and availability."
            />
          </StaggerItem>

           {/* Bottom Row Logic (Centered) */}
           {/* We wrap these two in a StaggerItem wrapper to keep layout, 
               but we can also just let them be items 4 and 5 in the flow. 
               Here I use a div to center them in the grid context. */}
           <div className="lg:col-span-3 grid md:grid-cols-2 gap-8 lg:w-2/3 mx-auto">
               <StaggerItem>
                    <Card
                        icon={<ShieldCheck size={32} strokeWidth={1.5} />}
                        title="Ethical Diagnosis"
                        description="Professional assessments conducted with responsibility and clarity."
                    />
               </StaggerItem>

               <StaggerItem>
                    <Card
                        icon={<Heart size={32} strokeWidth={1.5} />}
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
    <div className="group h-full p-10 rounded-[2rem] bg-[#F9F6FF] border border-[#3F2965]/5 hover:border-[#Dd1764]/20 hover:shadow-2xl hover:shadow-[#3F2965]/10 transition-all duration-500 hover:-translate-y-2">
      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white text-[#3F2965] mb-8 group-hover:bg-[#Dd1764] group-hover:text-white transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-[#3F2965] mb-4">{title}</h3>
      <p className="text-[#3F2965]/70 text-lg leading-relaxed font-medium">{description}</p>
    </div>
  );
}