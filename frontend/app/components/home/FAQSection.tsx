"use client";

import { useState } from "react";
import Reveal from "../common/Reveal";
import { ChevronDown } from "lucide-react";
import SectionHeading from "../common/HeadingSection";

export default function FAQSection() {
  return (
    <section className="py-32 px-24 bg-[#faf7fb]">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-20">
          <Reveal>
           <SectionHeading
  label="FAQs"
  title="Common questions, answered with clarity"
  align="center"
/>
          </Reveal>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 0.05}>
              <FAQItem question={faq.question} answer={faq.answer} />
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.2}>
          <div className="mt-16 text-center">
            <button className="px-8 py-3 rounded-lg border border-[#3F2965]/40 text-[#3F2965] font-medium hover:bg-[#3F2965]/5 transition">
              Explore More FAQs
            </button>
          </div>
        </Reveal>

      </div>
    </section>
  );
}

/* FAQ Item */
function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#3F2965]/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-lg font-medium text-[#3F2965]">
          {question}
        </span>

        <ChevronDown
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
          size={20}
          color="#3F2965"
        />
      </button>

      {open && (
        <div className="px-6 pb-6 text-[#3F2965]/80 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

/* Top 3 FAQs */
const faqs = [
  {
    question: "How do I book a session with MindSettler?",
    answer:
      "You can book a session by selecting an available online or offline consultation slot through our booking page. Once submitted, your appointment will be confirmed by our team.",
  },
  {
    question: "Are online therapy sessions as effective as offline sessions?",
    answer:
      "Yes. Online therapy sessions are structured to provide the same level of professional care and confidentiality as offline sessions, allowing flexibility without compromising quality.",
  },
  {
    question: "Is my information and session data kept confidential?",
    answer:
      "Absolutely. All sessions are conducted in a safe and confidential environment, following ethical guidelines and respecting your privacy at every step.",
  },
];
