"use client";

import {
  UserCheck,
  BookOpen,
  Globe,
  ShieldCheck,
  Heart,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function DifferentiatorsSection() {
  const differentiators = [
    {
      id: 1,
      icon: <UserCheck size={22} strokeWidth={1.5} />,
      title: "Founder-Led Practice",
      description: "Guided by the vision of psychotherapist Parnika Bajaj, ensuring clinical responsibility.",
    },
    {
      id: 2,
      icon: <BookOpen size={22} strokeWidth={1.5} />,
      title: "Structured Psycho-Education",
      description: "Understanding why you feel what you feel — empowering informed healing.",
    },
    {
      id: 3,
      icon: <Globe size={22} strokeWidth={1.5} />,
      title: "Online & Offline Access",
      description: "Access support in a way that fits your lifestyle, comfort, and availability.",
    },
    {
      id: 4,
      icon: <ShieldCheck size={22} strokeWidth={1.5} />,
      title: "Ethical Diagnosis",
      description: "Professional assessments conducted with responsibility and clarity.",
    },
    {
      id: 5,
      icon: <Sparkles size={28} strokeWidth={1.5} />,
      title: "Human-First Approach",
      description: "Empathy before labels. Every individual is treated with care.",
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 bg-[#F9F6FF] relative overflow-hidden">
      
      <div className="max-w-[1440px] mx-auto relative z-10">

        {/* Heading Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16 flex flex-col items-center"
        >
          <span className="px-4 py-1.5 rounded-full border border-[#Dd1764]/20 bg-[#Dd1764]/5 text-[#Dd1764] font-semibold text-xs uppercase tracking-wider mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#3F2965]">
            Thoughtful care, guided by <br />
            <span className="text-[#Dd1764] font-serif italic">ethics & empathy</span>
          </h2>
        </motion.div>

        {/* ================= DESKTOP VIEW (Expanded Radial Layout) ================= */}
        <div className="hidden lg:block relative w-full h-[750px]">
          
          {/* Connecting Lines Layer (Z-0: Behind everything) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1200 750" preserveAspectRatio="none">
             <defs>
               <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#Dd1764" stopOpacity="0.5" />
                 <stop offset="100%" stopColor="#3F2965" stopOpacity="0.5" />
               </linearGradient>
               <linearGradient id="branchGradientVertical" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" stopColor="#Dd1764" stopOpacity="0.5" />
                 <stop offset="100%" stopColor="#3F2965" stopOpacity="0.5" />
               </linearGradient>
             </defs>

             {/* Center Point: 600, 250 */}

             {/* Branch 1: Top Left */}
             <BranchPath 
               startPath="M 600 250 C 500 250, 400 250, 280 140"
               morphPath="M 600 250 C 500 230, 420 270, 280 140"
               delay={0.2}
             />

             {/* Branch 2: Top Right */}
             <BranchPath 
               startPath="M 600 250 C 700 250, 800 250, 920 140"
               morphPath="M 600 250 C 700 230, 780 270, 920 140"
               delay={0.3}
             />

             {/* Branch 3: Bottom Left */}
             <BranchPath 
               startPath="M 600 250 C 500 250, 400 300, 280 450"
               morphPath="M 600 250 C 500 270, 420 280, 280 450"
               delay={0.4}
             />

             {/* Branch 4: Bottom Right */}
             <BranchPath 
               startPath="M 600 250 C 700 250, 800 300, 920 450"
               morphPath="M 600 250 C 700 270, 780 280, 920 450"
               delay={0.5}
             />

             {/* Branch 5: Center Down - Curved path to Human-First card */}
             <BranchPath 
               startPath="M 600 250 C 600 350, 600 450, 600 600"
               morphPath="M 600 250 C 580 350, 620 450, 600 600"
               delay={0.6}
             />
          </svg>

          {/* Central Heart Node (Z-20: On top of lines) */}
          <div className="absolute top-[280px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
             
             {/* Centered Pulse Background */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[#Dd1764]/5 rounded-full animate-pulse blur-2xl" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#Dd1764]/10 rounded-full animate-pulse" />

             {/* Heart Circle - White BG, Pink Border */}
             <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0 }}
              className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-[#Dd1764] shadow-xl z-30 mx-auto"
            >
              <Heart className="text-[#Dd1764]" size={36} strokeWidth={2.5} fill="currentColor" />
            </motion.div>
            
            {/* Core Values Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 bg-white px-5 py-2 rounded-full border border-[#3F2965]/10 shadow-md relative z-30 mx-auto w-fit"
            >
              <span className="text-[#3F2965] font-bold text-sm tracking-wide">Core Values</span>
            </motion.div>
          </div>

          {/* --- CARDS (Z-10: On top of lines) --- */}
          
          {/* Top Left */}
          <div className="absolute top-[8%] left-[2%] xl:left-[8%] w-80 z-10">
            <BranchCard data={differentiators[0]} align="right" delay={1.2} />
          </div>

          {/* Top Right */}
          <div className="absolute top-[8%] right-[2%] xl:right-[8%] w-80 z-10">
             <BranchCard data={differentiators[1]} align="left" delay={1.4} />
          </div>

          {/* Bottom Left */}
          <div className="absolute bottom-[20%] left-[2%] xl:left-[8%] w-80 z-10">
             <BranchCard data={differentiators[2]} align="right" delay={1.6} />
          </div>

          {/* Bottom Right */}
          <div className="absolute bottom-[20%] right-[2%] xl:right-[8%] w-80 z-10">
             <BranchCard data={differentiators[3]} align="left" delay={1.8} />
          </div>

          {/* Center Bottom - Human-First Card (styled like other cards but centered) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 2, duration: 0.5, type: "spring" }}
              className="group relative flex flex-col items-center gap-6"
            >
              
              {/* Connector Dot */}
              <div className="w-3 h-3 bg-[#Dd1764] rounded-full border-2 border-white shadow-sm shrink-0 group-hover:scale-125 transition-all duration-300" />

              {/* Card Content - Larger and more prominent */}
              <div className="bg-white p-8 rounded-2xl border-2 border-[#Dd1764]/20 shadow-lg hover:shadow-2xl hover:border-[#Dd1764]/50 transition-all duration-300 hover:-translate-y-1 w-full">
                <div className="flex flex-col items-center gap-3 mb-3 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] group-hover:bg-[#Dd1764] group-hover:text-white transition-colors shadow-md">
                    {differentiators[4].icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#3F2965]">{differentiators[4].title}</h3>
                </div>
                <p className="text-[#3F2965]/70 text-sm leading-relaxed text-center">{differentiators[4].description}</p>
              </div>

            </motion.div>
          </div>

        </div>


        {/* ================= MOBILE/TABLET VIEW (Vertical Tree) ================= */}
        <div className="lg:hidden max-w-xl mx-auto pl-4">
          <div className="relative ml-4 md:ml-8 py-4">
            
            {/* Vertical Line */}
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute left-0 top-0 w-0.5 border-l-2 border-dashed border-[#3F2965]/30 h-full"
            />
            
            {/* Start Node */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="absolute -top-2 -left-[19px] md:-left-[27px] w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center border-4 border-[#Dd1764] z-10 shadow-lg"
            >
              <Heart className="text-[#Dd1764] w-4 h-4 md:w-6 md:h-6" fill="currentColor" />
            </motion.div>

            <div className="space-y-10 pt-8">
              {differentiators.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (index * 0.15) }}
                  className="relative pl-8 md:pl-12 group"
                >
                  <div className="absolute top-8 left-0 w-6 md:w-10 h-0.5 bg-[#3F2965]/30 group-hover:bg-[#Dd1764] transition-colors" />
                  <div className="absolute top-[26px] -left-[5px] w-3 h-3 bg-[#F9F6FF] border-2 border-[#3F2965] rounded-full group-hover:border-[#Dd1764] group-hover:scale-125 transition-all z-10" />

                  <div className={`bg-white rounded-2xl border border-[#3F2965]/10 shadow-sm hover:shadow-lg hover:border-[#Dd1764]/30 transition-all duration-300 ${index === 4 ? 'p-8 border-2 border-[#Dd1764]/20' : 'p-5 md:p-6'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 rounded-full flex items-center justify-center text-[#Dd1764] group-hover:bg-[#Dd1764] group-hover:text-white transition-colors duration-300 ${index === 4 ? 'w-12 h-12 bg-[#F9F6FF] shadow-sm' : 'w-10 h-10 bg-[#F9F6FF]'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className={`font-bold text-[#3F2965] mb-1.5 ${index === 4 ? 'text-xl' : 'text-lg'}`}>{item.title}</h3>
                        <p className="text-[#3F2965]/70 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Sub-component for individual desktop branches
function BranchPath({ startPath, morphPath, delay }: { startPath: string, morphPath: string, delay: number }) {
  return (
    <motion.path 
      stroke="url(#branchGradient)" 
      strokeWidth="2.5" 
      fill="none" 
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      animate={{ 
        d: [startPath, morphPath, startPath], 
      }}
      transition={{
        pathLength: { duration: 1.5, delay: delay, ease: "easeInOut" },
        opacity: { duration: 0.5, delay: delay },
        d: { duration: 6, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
}

// Helper for Desktop Cards
function BranchCard({ data, align = "left", delay }: { data: any, align?: "left" | "right", delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay, duration: 0.5, type: "spring" }}
      className={`group relative flex ${align === "right" ? "flex-row-reverse text-right" : "flex-row text-left"} items-center gap-6`}
    >
      
      {/* Connector Dot */}
      <div className={`w-3 h-3 bg-[#3F2965] rounded-full border-2 border-white shadow-sm shrink-0 group-hover:bg-[#Dd1764] group-hover:scale-125 transition-all duration-300`} />

      {/* Card Content */}
      <div className="bg-white p-6 rounded-2xl border border-[#3F2965]/10 shadow-sm hover:shadow-xl hover:border-[#Dd1764]/30 transition-all duration-300 hover:-translate-y-1 w-full">
        <div className={`flex items-center gap-3 mb-3 ${align === "right" ? "flex-row-reverse" : "flex-row"}`}>
          <div className="w-10 h-10 rounded-full bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] group-hover:bg-[#Dd1764] group-hover:text-white transition-colors shadow-sm">
            {data.icon}
          </div>
          <h3 className="text-lg font-bold text-[#3F2965]">{data.title}</h3>
        </div>
        <p className="text-[#3F2965]/70 text-sm leading-relaxed">{data.description}</p>
      </div>

    </motion.div>
  );
}