import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { awarenessContent } from "./awarenessData";
import { CharReveal, SlideUp, StaggerContainer, StaggerItem, ImageWipeReveal } from "../../components/common/RevealComponent";
import { 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Brain, 
  Activity, 
  Quote,
  CalendarCheck,
  Sparkles
} from "lucide-react";
// Add this function to generate SEO tags based on the slug
export async function generateMetadata({ params }: AwarenessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = awarenessContent[slug as keyof typeof awarenessContent];

  if (!content) {
    return {
      title: "Topic Not Found",
    };
  }

  return {
    title: content.title, // Becomes "Anxiety | Mindsettler" thanks to template
    description: content.intro.slice(0, 160), // Search engines prefer < 160 chars
    openGraph: {
      title: `${content.title} - Mental Health Awareness`,
      description: content.intro,
      images: [
        {
          url: content.heroImage, // Uses the specific image for this topic
          width: 1200,
          height: 630,
          alt: content.title,
        },
      ],
    },
  };
}
interface AwarenessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all awareness pages at build time
export async function generateStaticParams() {
  return Object.keys(awarenessContent).map((slug) => ({
    slug: slug,
  }));
}

export default async function AwarenessDetailPage(props: AwarenessPageProps) {
  const params = await props.params;
  const { slug } = params;
  
  const content = awarenessContent[slug as keyof typeof awarenessContent];

  // Fallback if slug doesn't match
  if (!content) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3F2965] mb-4">Topic Not Found</h1>
          <p className="text-[#3F2965]/60 mb-8 text-lg">The requested awareness page could not be found.</p>
          <Link href="/awareness" className="inline-flex items-center gap-2 px-6 py-3 bg-[#Dd1764] text-white font-bold rounded-xl hover:bg-[#c01255] transition-colors">
            <ArrowRight className="rotate-180" size={20} />
            Back to Awareness Hub
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-24 overflow-hidden bg-[#F9F6FF]">
        {/* Simple Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
            
            {/* Left: Content */}
            <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
               
               
               <div className="space-y-4">
                 <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-[#3F2965] leading-[1.1]">
                   <span className="block text-[#3F2965]/50 text-xl sm:text-2xl lg:text-4xl font-medium mb-2">
                    <CharReveal delay={0.1}>Understanding</CharReveal> 
                   </span>
                   <CharReveal delay={0.2}>{content.title}</CharReveal>
                 </h1>
                 <SlideUp delay={0.3}>
                   <div className="relative pl-4 md:pl-6 border-l-4 border-[#Dd1764]">
                     <p className="text-base sm:text-lg lg:text-2xl text-[#3F2965]/80 leading-relaxed max-w-xl">
                       {content.intro}
                     </p>
                   </div>
                 </SlideUp>
               </div>

               <StaggerContainer delay={0.4}>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {content.keyPoints.map((point, idx) => (
                      <StaggerItem key={idx}>
                        <span className="group inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl bg-white border border-[#3F2965]/10 shadow-sm text-xs md:text-sm font-semibold text-[#3F2965] hover:border-[#Dd1764] transition-colors cursor-default">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#Dd1764]" />
                          {point}
                        </span>
                      </StaggerItem>
                    ))}
                  </div>
               </StaggerContainer>
            </div>

            {/* Right: Image */}
            <div className="order-1 lg:order-2">
              <ImageWipeReveal>
                <div className="relative aspect-[16/10] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-xl md:shadow-2xl shadow-[#3F2965]/5 border-4 border-white">
                  <Image
                    src={content.heroImage}
                    alt={content.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </ImageWipeReveal>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. WHAT IS IT? --- */}
      <section className="py-12 md:py-20 bg-white relative">

        <div className="pointer-events-none absolute left-2 top-115 -translate-y-1/2 hidden lg:block">
                  <Image
                    src="/icons/Thinking face-cuate.svg"
                    alt="Decorative awareness illustration"
                    width={260}
                    height={260}
                    className="max-w-none"
                  />
                </div>


        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <SlideUp>
            <div className="relative bg-[#F9F6FF] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-16 border border-[#3F2965]/5 text-center group">
              <Quote className="absolute top-6 left-6 md:top-10 md:left-10 text-[#Dd1764]/10 rotate-180 w-12 h-12 md:w-20 md:h-20" />
              
                <div className="relative z-10 space-y-6 md:space-y-8">
                
                
                <h2 className="text-2xl md:text-5xl font-bold text-[#3F2965]">
                  What is {content.title}?
                </h2>
                
                <div className="mx-auto w-16 md:w-24 h-1.5 rounded-full bg-[#Dd1764]" />
                
                <p className="text-lg md:text-2xl text-[#3F2965]/80 leading-relaxed max-w-3xl mx-auto font-medium">
                  {content.whatIs}
                </p>
                
                {content.whatIsExtended && (
                   <p className="text-sm md:text-lg text-[#3F2965]/60 leading-relaxed max-w-3xl mx-auto">
                     {content.whatIsExtended}
                   </p>
                )}
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* --- 3. SYMPTOMS --- */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-12 gap-10 md:gap-16">
          {/* Header Column */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#Dd1764]/10 text-[#Dd1764] font-bold uppercase tracking-widest text-[10px] md:text-sm">
              <AlertCircle size={16} /> 
              Recognition
            </div> */}
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#3F2965] leading-tight">
              Signs & <br/> Symptoms
            </h2>
            
            <div className="space-y-4">
              <p className="text-[#3F2965]/70 text-base md:text-lg leading-relaxed">
                Recognizing these signs is the first step towards feeling better.
              </p>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F9F6FF] border border-[#3F2965]/10">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-[#3F2965]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={18} className="text-[#Dd1764]" />
                </div>
                <p className="text-xs md:text-sm text-[#3F2965]/70 font-medium">
                  Each experience is unique and valid
                </p>
              </div>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-8">
            <StaggerContainer>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {content.symptoms.map((symptom, idx) => (
                  <StaggerItem key={idx}>
                    <div className="group relative overflow-hidden rounded-2xl p-5 md:p-6 bg-white border border-[#3F2965]/10 transition-all duration-300 shadow-sm hover:shadow-xl hover:border-[#3F2965]/20">
                      
                      <div className="absolute inset-0 bg-[#F9F6FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#Dd1764] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                      
                      <div className="relative z-10 flex gap-4 items-start">
                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#F9F6FF] flex items-center justify-center text-[#Dd1764] mt-1 group-hover:bg-white transition-colors border border-[#3F2965]/5 group-hover:border-[#3F2965]/10">
                          <CheckCircle2 size={18} />
                        </div>
                        <div className="flex-1 space-y-1 md:space-y-2">
                          <h3 className="font-bold text-[#3F2965] text-base md:text-lg">
                            {symptom.title}
                          </h3>
                          <p className="text-xs md:text-sm text-[#3F2965]/60 leading-relaxed">
                            {symptom.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* --- 4. CAUSES --- */}
      {content.causes && content.causes.length > 0 && (
        <section className="py-16 md:py-24 bg-[#3F2965] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <div className="mb-10 md:mb-16 space-y-4">
              {/* <SlideUp>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest">
                  <Brain size={12} />
                  Understanding
                </div>
              </SlideUp> */}
              
              <SlideUp delay={0.1}>
                <h2 className="text-3xl md:text-5xl font-bold">Common Triggers</h2>
              </SlideUp>
              
              <SlideUp delay={0.2}>
                <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg">
                  Understanding the root causes can help in managing the condition effectively.
                </p>
              </SlideUp>
            </div>

            <StaggerContainer delay={0.3}>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {content.causes.map((cause, idx) => (
                  <StaggerItem key={idx}>
                    <div className="group px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-[#3F2965] transition-all duration-300 cursor-default shadow-lg hover:-translate-y-1">
                      <span className="text-sm md:text-lg font-semibold">
                        {cause}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* --- 5. STATISTICS --- */}
      {content.statistics && (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-10 md:mb-16 space-y-4">
            {/* <SlideUp>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9F6FF] border border-[#3F2965]/10 text-[#Dd1764] font-bold text-[10px] md:text-xs uppercase tracking-widest">
                <Activity size={12} />
                Insights
              </div>
            </SlideUp> */}
            
            <SlideUp delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold text-[#3F2965]">Did You Know?</h2>
            </SlideUp>
          </div>
           
          <StaggerContainer>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {content.statistics.map((stat, idx) => (
                <StaggerItem key={idx}>
                  <div className="group relative overflow-hidden bg-[#F9F6FF] rounded-[2rem] p-8 md:p-12 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border border-[#3F2965]/5">
                    <div className="absolute inset-0 bg-[#3F2965] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
                    
                    <div className="relative z-10 space-y-2 md:space-y-4">
                      <div className="text-4xl md:text-7xl font-black text-[#Dd1764] group-hover:text-white transition-colors duration-500">
                        {stat.value}
                      </div>
                      <p className="text-base md:text-xl text-[#3F2965]/70 group-hover:text-white/90 font-medium transition-colors duration-500 leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>
      )}

      {/* --- 6. HOW WE HELP --- */}
      <section className="py-16 md:py-24 bg-[#F9F6FF] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          <div className="text-center mb-12 md:mb-20 space-y-4 md:space-y-6">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#3F2965]/10 text-[#3F2965] font-bold text-[10px] md:text-xs uppercase tracking-widest">
              <Sparkles size={12} />
              Our Approach
            </div> */}
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#3F2965]">
              How MindSettler Helps
            </h2>
            
            <p className="text-[#3F2965]/60 max-w-2xl mx-auto text-base md:text-xl">
              A personalized journey designed for your healing and growth.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-0.5 bg-[#3F2965]/20 md:-translate-x-1/2 hidden md:block" />

            <StaggerContainer>
              <div className="space-y-10 md:space-y-16">
                {content.treatmentApproach.map((approach, idx) => (
                  <StaggerItem key={idx}>
                    <div className={`flex flex-col md:flex-row gap-6 md:gap-8 items-center ${idx % 2 === 0 ? 'md:text-right' : 'md:flex-row-reverse md:text-left'}`}>
                      
                      <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#Dd1764] text-white flex items-center justify-center text-lg md:text-2xl font-bold shadow-lg shadow-[#Dd1764]/20 shrink-0 md:mx-auto border-4 border-white">
                        {idx + 1}
                      </div>

                      <div className="flex-1 w-full group relative">
                        <div className="relative bg-white p-6 md:p-10 rounded-[2rem] border border-[#3F2965]/10 shadow-lg shadow-[#3F2965]/5 hover:shadow-xl hover:shadow-[#3F2965]/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                          <div className="absolute inset-0 bg-[#3F2965] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-out" />
                          
                          <div className="relative z-10 space-y-2 md:space-y-3">
                            <h3 className="text-lg md:text-2xl font-bold text-[#3F2965] group-hover:text-white transition-colors">
                              {approach.title}
                            </h3>
                            <p className="text-[#3F2965]/70 group-hover:text-white/80 leading-relaxed text-sm md:text-lg transition-colors">
                              {approach.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 hidden md:block" />
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>

        </div>
      </section>

      {/* --- 7. CTA SECTION --- */}
      <section className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto relative z-10">
          <StaggerContainer>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              
              {/* Awareness Card */}
              <StaggerItem>
                <div className="group h-full bg-[#F9F6FF] rounded-[2.5rem] p-8 md:p-12 flex flex-col items-start border border-[#3F2965]/10 relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className="absolute inset-0 bg-[#3F2965] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-out" />
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center text-[#3F2965] shadow-sm border border-[#3F2965]/10 mb-6 transition-all group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg">
                      <Brain size={24} className="md:w-8 md:h-8" />
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-[#3F2965] group-hover:text-white mb-4 transition-colors">
                      Awareness Sessions
                    </h3>
                    
                    <p className="text-[#3F2965]/70 group-hover:text-white/80 mb-8 leading-relaxed flex-1 transition-colors text-base md:text-lg">
                      Structured psycho-education to help you understand patterns, triggers, and build coping strategies.
                    </p>
                    
                    <Link href="/awareness" className="inline-flex">
                      <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[#3F2965] group-hover:text-white bg-white border border-[#3F2965]/10 group-hover:bg-white/20 group-hover:border-white/30 backdrop-blur-sm transition-all hover:gap-4">
                        Learn More 
                        <ArrowRight className="transition-transform" size={20} />
                      </button>
                    </Link>
                  </div>
                </div>
              </StaggerItem>

             {/* Booking Card */}
             <StaggerItem>
                <div className="h-full bg-[#3F2965] rounded-[2.5rem] p-8 md:p-12 flex flex-col items-start text-white shadow-xl shadow-[#3F2965]/20 border border-[#3F2965] relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  
                  <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none" />
                  
                  <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white mb-6 border border-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <CalendarCheck size={24} className="md:w-8 md:h-8" />
                  </div>
                  
                  <h3 className="relative z-10 text-2xl md:text-3xl font-bold mb-4">Personalized Guidance</h3>
                  <p className="relative z-10 text-white/80 mb-8 leading-relaxed flex-1 text-base md:text-lg">
                    One-on-one sessions tailored to your unique challenges. Start your journey in a safe, confidential space.
                  </p>
                  
                  <Link href="/book" className="relative z-10 w-full sm:w-auto">
                    <button className="relative w-full sm:w-auto px-8 py-4 rounded-xl font-bold shadow-lg shadow-[#Dd1764]/30 overflow-hidden group/btn bg-[#Dd1764] text-white transition-all hover:shadow-xl">
                      <span className="relative z-10 group-hover/btn:text-[#Dd1764] transition-colors duration-300">Book a Session</span>
                      <div className="absolute inset-0 bg-white scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left ease-out" />
                    </button>
                  </Link>
                </div>
              </StaggerItem>

            </div>
          </StaggerContainer>
        </div>
      </section>

    </main>
  );
}