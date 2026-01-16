"use client";

import SignupForm from "../components/SignupForm";
import { Brain, Heart, Sparkles, ShieldCheck } from "lucide-react";
import { CharReveal, SlideUp, ImageWipeReveal } from "../../../(main)/components/common/RevealComponent";

const imagesColumn1 = [
    "/login_images/mental_health6.webp", 
  "/login_images/mental_health5.webp", 
  "/login_images/mental_health4.webp",  
  "/login_images/mental_health8.webp",  
];

const imagesColumn2 = [
  "/login_images/mental_health9.webp",
  "/login_images/mental_health10.webp",
  "/login_images/mental_health11.webp",
  "/login_images/mental_health12.webp",
];

export default function SignupPage() {
  const quadColumn1 = [...imagesColumn1, ...imagesColumn1, ...imagesColumn1, ...imagesColumn1];
  const quadColumn2 = [...imagesColumn2, ...imagesColumn2, ...imagesColumn2, ...imagesColumn2];

  return (
    <div className="h-screen w-full bg-[#F2F4F8] p-4 lg:p-6 flex items-center justify-center overflow-hidden font-sans">
      
      <style jsx global>{`
        @keyframes scroll-vertical-25 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-25%); }
        }
        @keyframes scroll-vertical-reverse-25 {
          0% { transform: translateY(-25%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scroll-vertical-25 30s linear infinite;
          will-change: transform;
        }
        .animate-scroll-down {
          animation: scroll-vertical-reverse-25 30s linear infinite;
          will-change: transform;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(#3F2965 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="w-full h-full max-w-[1600px] bg-white rounded-[30px] shadow-2xl overflow-hidden flex relative ring-1 ring-black/5">
        
        {}
        {}
        <ImageWipeReveal className="hidden lg:flex w-[45%] h-full relative bg-[#3F2965] overflow-hidden flex-row gap-3 p-3">
           <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#3F2965] via-transparent to-[#3F2965]/80 pointer-events-none" />
           
           <div className="w-1/2 relative h-full overflow-hidden">
             <div className="flex flex-col animate-scroll-up">
                {quadColumn1.map((img, i) => (
                  
                  <div key={i} className="w-full aspect-[3/4] rounded-xl bg-cover bg-center shrink-0 shadow-sm mb-3" style={{backgroundImage: `url(${img})`}} />
                ))}
             </div>
           </div>
           
           <div className="w-1/2 relative h-full overflow-hidden">
             <div className="flex flex-col animate-scroll-down">
                {quadColumn2.map((img, i) => (
                  
                  <div key={i} className="w-full aspect-[3/4] rounded-xl bg-cover bg-center shrink-0 shadow-sm mb-3" style={{backgroundImage: `url(${img})`}} />
                ))}
             </div>
           </div>
           
           <div className="absolute bottom-10 left-10 z-30">
              <SlideUp delay={1}>
                <div className="w-12 h-12 bg-[#Dd1764] rounded-xl flex items-center justify-center text-white shadow-lg mb-6">
                    <Brain size={24} />
                </div>
              </SlideUp>
              <h1 className="text-4xl font-bold text-white leading-tight drop-shadow-lg">
                <CharReveal delay={1.2}>Accelerate your growth journey.</CharReveal>
              </h1>
           </div>
        </ImageWipeReveal>

        {}
        <div className="flex-1 h-full bg-white flex flex-col bg-grid-pattern relative overflow-hidden">
           <SlideUp delay={0.2} className="absolute top-0 left-0 flex justify-between items-center w-full px-4 pt-4 z-30 pointer-events-none">
              <img 
                src="/assets/Mindsettler-logo.webp" 
                alt="Mindsettler" 
                fetchPriority="high"
                decoding="async"
                className="h-10 w-auto object-contain pointer-events-auto"
              />
        
           </SlideUp>

           <div className="flex-grow flex items-center justify-center p-6 relative">
               <div className="absolute top-10 right-10 text-[#3F2965]/5 rotate-12 animate-pulse pointer-events-none"><Sparkles size={120} /></div>
               <div className="absolute bottom-10 left-10 text-[#Dd1764]/5 -rotate-12 pointer-events-none"><Heart size={100} /></div>
               
               <div className="w-full max-w-[480px] bg-white p-8 lg:p-10 rounded-[32px] border-2 border-[#3F2965] shadow-[0_0_0_5px_rgba(221,23,100,0.15)] relative z-20">
                  <SignupForm />
               </div>
           </div>

        </div>

      </div>
    </div>
  );
}