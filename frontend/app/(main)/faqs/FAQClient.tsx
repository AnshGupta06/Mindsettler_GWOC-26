"use client";

import { useState } from "react";
import { Plus, Minus, Search } from "lucide-react";
import { CharReveal, SlideUp, StaggerContainer, StaggerItem } from "../components/common/RevealComponent";

// --- DATA ---
const faqs = [
  {
    category: "General",
    items: [
      {
        question: "How do I book a session with MindSettler?",
        answer: "You can book a session by selecting an available online or offline consultation slot through our booking page. Once submitted, your appointment will be confirmed by our team.",
      },
      {
        question: "Are online therapy sessions as effective as offline?",
        answer: "Yes. Research shows that online therapy is just as effective as in-person sessions for many mental health concerns. We use secure video platforms to ensure a private and comfortable environment.",
      },
      {
        question: "Is my data and privacy secure?",
        answer: "Absolutely. We adhere to strict confidentiality protocols. Your personal information and session details are encrypted and never shared without your consent.",
      },
    ]
  },
  {
    category: "Services & Pricing",
    items: [
      {
        question: "What types of therapy do you offer?",
        answer: "We offer a wide range of services including Cognitive Behavioral Therapy (CBT), stress management, career counseling, relationship therapy, and corporate wellness workshops.",
      },
      {
        question: "Do you offer packages or student discounts?",
        answer: "Yes, we have special packages for long-term therapy and discounted rates for students. Please contact our support team for the latest pricing details.",
      },
    ]
  },
  {
    category: "Technical Support",
    items: [
      {
        question: "What if I get disconnected during an online session?",
        answer: "Don't worry. If technical issues arise, your therapist will try to reconnect immediately or reschedule the remaining time for a later slot at no extra cost.",
      },
      {
        question: "How do I cancel or reschedule?",
        answer: "You can manage your appointments from your Profile Dashboard. Cancellations made 24 hours in advance are eligible for a full refund or rescheduling.",
      },
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("General-0");
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 md:px-8">
      
      {/* 🟣 Main Container */}
      <div className="max-w-[1440px] mx-auto bg-[#F9F6FF] rounded-[2.5rem] sm:rounded-[3rem] px-6 sm:px-12 lg:px-20 py-16 sm:py-20 relative overflow-hidden min-h-[80vh]">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3F2965]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#Dd1764]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
            
            {/* Header */}
            <div className="text-center mb-12">
                 <SlideUp>
                    <span className="block text-[#Dd1764] font-bold tracking-widest uppercase text-sm mb-3">
                      Got Questions?
                    </span>
                 </SlideUp>
                 
                 {/* 🛠️ FIX: Pass text as Children, not prop */}
                 <CharReveal className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3F2965] leading-tight mb-6">
                   Frequently Asked Questions
                 </CharReveal>

                 <SlideUp delay={0.2}>
                   <p className="text-[#3F2965]/60 text-lg max-w-2xl mx-auto">
                     Find clarity on your journey. Here are the answers to the most common questions about our services and process.
                   </p>
                 </SlideUp>

                 {/* 🔍 Search Bar */}
                 <SlideUp delay={0.3}>
                   <div className="mt-8 relative max-w-md mx-auto">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F2965]/40" size={20} />
                     <input 
                       type="text"
                       placeholder="Search for answers..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-12 pr-4 py-4 rounded-full bg-white border border-[#3F2965]/10 focus:border-[#Dd1764]/50 focus:ring-4 focus:ring-[#Dd1764]/10 outline-none transition-all text-[#3F2965] font-medium shadow-sm"
                     />
                   </div>
                 </SlideUp>
            </div>

            {/* Content */}
            <div className="space-y-10">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((category) => (
                  <StaggerContainer key={category.category} className="space-y-4">
                    
                    {/* Category Title */}
                    <StaggerItem>
                      <h3 className="text-xl font-bold text-[#3F2965] mb-4 flex items-center gap-3">
                        <span className="w-2 h-8 bg-[#Dd1764] rounded-full" />
                        {category.category}
                      </h3>
                    </StaggerItem>

                    {/* Questions */}
                    <div className="space-y-4">
                      {category.items.map((faq, index) => {
                        const id = `${category.category}-${index}`;
                        return (
                          <StaggerItem key={index}>
                            <FAQItem 
                              question={faq.question} 
                              answer={faq.answer} 
                              open={openIndex === id}
                              onToggle={() => handleToggle(id)}
                            />
                          </StaggerItem>
                        );
                      })}
                    </div>
                  </StaggerContainer>
                ))
              ) : (
                <div className="text-center py-12">
                   <p className="text-[#3F2965]/50 font-bold">No results found for "{searchQuery}"</p>
                   <button 
                     onClick={() => setSearchQuery("")}
                     className="mt-2 text-[#Dd1764] hover:underline font-bold text-sm"
                   >
                     Clear Search
                   </button>
                </div>
              )}
            </div>

            {/* Contact CTA */}
            <div className="mt-20 text-center border-t border-[#3F2965]/10 pt-10">
               <p className="text-[#3F2965] font-bold text-lg mb-4">Still have questions?</p>
               <a href="/contact">
                 <SlideUp delay={0.4} className="mt-10 sm:mt-12 md:mt-16 text-center">
             <button className="w-full sm:w-auto relative px-8 sm:px-10 py-3 sm:py-4 rounded-full border-2 border-[#3F2965] bg-[#3F2965] text-white font-bold text-sm sm:text-base tracking-wide overflow-hidden group transition-all duration-300 hover:bg-transparent hover:text-[#3F2965] hover:-translate-y-1">
  <span className="absolute top-0 left-[-25%] w-[80%] h-full bg-gradient-to-r from-white to-white/80 -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-left" />
  <span className="absolute top-0 right-[-25%] w-[80%] h-full bg-gradient-to-l from-white to-white/80 -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out origin-right" />
  <span className="relative z-10 transition-colors duration-300">
    Contact Support
  </span>
</button>

            </SlideUp>
               </a>
            </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer, open, onToggle }: { question: string, answer: string, open: boolean, onToggle: () => void }) {
  return (
    <div 
      className={`bg-white rounded-2xl transition-all duration-300 border ${
        open ? "border-[#Dd1764]/20 shadow-lg shadow-[#Dd1764]/5" : "border-transparent hover:border-[#3F2965]/10 hover:shadow-md"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left group"
      >
        <span className={`text-lg sm:text-xl font-bold transition-colors ${open ? "text-[#Dd1764]" : "text-[#3F2965] group-hover:text-[#3F2965]"}`}>
          {question}
        </span>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open ? "bg-[#Dd1764] text-white" : "bg-[#3F2965]/5 text-[#3F2965]"}`}>
            {open ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 sm:px-6 pb-6 text-[#3F2965]/70 text-base leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}