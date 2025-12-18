"use client";
import SectionHeading from "../common/HeadingSection";
import Reveal from "../common/Reveal";
import {
  UserCheck,
  BookOpen,
  Globe,
  ShieldCheck,
  Heart,
} from "lucide-react";

export default function DifferentiatorsSection() {
  return (
    <section className="py-32 px-24 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="max-w-3xl mb-20">
          <Reveal>
           <SectionHeading
  label="What Makes MindSettler Different"
  title="Thoughtful care, guided by ethics, empathy, and understanding"
/>
          </Reveal>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 gap-10">

          <Reveal>
            <Card
              icon={<UserCheck size={22} />}
              title="Founder-Led Practice"
              description="Sessions are guided by the vision and expertise of psychotherapist Parnika Bajaj, ensuring consistency and clinical responsibility."
            />
          </Reveal>

          <Reveal delay={0.05}>
            <Card
              icon={<BookOpen size={22} />}
              title="Structured Psycho-Education"
              description="Not just therapy, but a clear understanding of why you feel what you feel — empowering informed healing."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <Card
              icon={<Globe size={22} />}
              title="Online & Offline Accessibility"
              description="Access support in a way that fits your lifestyle, comfort, and availability."
            />
          </Reveal>

          <Reveal delay={0.15}>
            <Card
              icon={<ShieldCheck size={22} />}
              title="Ethical Diagnosis"
              description="Professional assessments conducted with responsibility, clarity, and clinical ethics."
            />
          </Reveal>

          <Reveal delay={0.2}>
            <Card
              icon={<Heart size={22} />}
              title="Human-First Approach"
              description="Empathy before labels, understanding before conclusions — every individual is treated with care."
            />
          </Reveal>

        </div>
      </div>
    </section>
  );
}

/* Card Component */
function Card({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#faf7fb] rounded-2xl p-8 h-full">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#3F2965]/10 text-[#3F2965] mb-6">
        {icon}
      </div>

      <h3 className="text-xl font-medium text-[#3F2965] mb-3">
        {title}
      </h3>

      <p className="text-[#3F2965]/80 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
