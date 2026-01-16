"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebase";
import LoginForm from "./components/LoginForm";
import { isUserAdmin } from "@/app/lib/admin";
import { Quote, Activity } from "lucide-react";
import { CharReveal, SlideUp, ImageWipeReveal } from "../../(main)/components/common/RevealComponent";

const imagesColumn1 = [ 
  "/login_images/mental_health13.webp", 
  "/login_images/mental_health14.webp", 
  "/login_images/mental_health15.webp", 
];

const imagesColumn2 = [
   "/login_images/mental_health7.webp",
  "/login_images/mental_health.webp", 
  "/login_images/mental_health2.webp", 
  "/login_images/mental_health3.webp", 
];

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (isUserAdmin(user.email)) router.replace("/admin");
        else router.replace("/profile");
      }
    });
    return () => unsub();
  }, [router]);

  const quadColumn1 = [...imagesColumn1, ...imagesColumn1, ...imagesColumn1, ...imagesColumn1];
  const quadColumn2 = [...imagesColumn2, ...imagesColumn2, ...imagesColumn2, ...imagesColumn2];

  return (
    <div className="h-screen w-full bg-[#F2F4F8] p-0 lg:p-6 flex items-center justify-center overflow-hidden font-sans">
      
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
          animation: scroll-vertical-25 40s linear infinite;
          will-change: transform;
        }
        .animate-scroll-down {
          animation: scroll-vertical-reverse-25 40s linear infinite;
          will-change: transform;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(#3F2965 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      {/* Main Container: Full screen on mobile (rounded-none, shadow-none), Boxed on desktop */}
      <div className="w-full h-full max-w-[1600px] bg-white rounded-none lg:rounded-[30px] shadow-none lg:shadow-2xl overflow-hidden flex flex-col lg:flex-row relative ring-0 lg:ring-1 ring-black/5">

        {/* Left Side (Form) */}
        <div className="flex-1 h-full bg-white flex flex-col bg-grid-pattern relative order-2 lg:order-1 overflow-hidden">
           
           <SlideUp delay={0.2} className="absolute top-0 left-0 flex justify-between items-start w-full z-30 p-6 lg:px-8 lg:pt-8 pointer-events-none">
               <img 
                src="/assets/Mindsettler-logo.webp" 
                alt="Mindsettler" 
                fetchPriority="high"
                decoding="async"
                className="h-9 w-auto object-contain pointer-events-auto"
              />
            
           </SlideUp>

           <div className="flex-1 flex items-center justify-center relative w-full z-20 px-6 pb-6">
               <div className="absolute top-[-5%] left-[-5%] text-[#3F2965]/5 rotate-45 animate-pulse pointer-events-none"><Activity size={200} /></div>
               <div className="absolute bottom-10 right-10 text-[#Dd1764]/5 rotate-12 pointer-events-none"><Quote size={120} /></div>

               {/* Inner Form Card: Border and Rounded corners RESTORED for all screens */}
               <div className="w-full max-w-[440px] bg-white p-6 lg:p-10 rounded-[32px] border-2 border-[#3F2965] shadow-[0_0_0_5px_rgba(221,23,100,0.15)] relative z-20">
                  <LoginForm />
               </div>
           </div>
        </div>

        {/* Right Side (Images) */}
        <ImageWipeReveal className="hidden lg:flex w-[45%] h-full relative bg-[#3F2965] overflow-hidden flex-row gap-3 p-3 order-1 lg:order-2">
           <div className="absolute inset-0 z-20 bg-gradient-to-b from-[#3F2965]/90 via-transparent to-[#3F2965]/90 pointer-events-none" />

           <div className="w-1/2 relative h-full overflow-hidden">
             <div className="flex flex-col animate-scroll-down w-full">
                {quadColumn1.map((img, i) => (
                  <div key={i} className="w-full aspect-[3/4] rounded-xl bg-cover bg-center shrink-0 shadow-sm mb-3" style={{backgroundImage: `url(${img})`}} />
                ))}
             </div>
           </div>

           <div className="w-1/2 relative h-full overflow-hidden">
             <div className="flex flex-col animate-scroll-up w-full">
                {quadColumn2.map((img, i) => (
                  <div key={i} className="w-full aspect-[3/4] rounded-xl bg-cover bg-center shrink-0 shadow-sm mb-3" style={{backgroundImage: `url(${img})`}} />
                ))}
             </div>
           </div>

           <div className="absolute top-10 right-10 z-30 text-right">
              <h2 className="text-4xl font-bold text-white leading-[1.1]">
                 <CharReveal delay={0.8}>Focus on what matters most.</CharReveal>
              </h2>
              <SlideUp delay={1.2}>
                <p className="text-white/80 text-sm font-medium mt-4 max-w-[260px] ml-auto leading-relaxed">
                   Access your personalized therapy sessions and track your mental wellness journey in one secure space.
                </p>
              </SlideUp>
           </div>
        </ImageWipeReveal>

      </div>
    </div>
  );
}