import Section from "../common/Section";
import Reveal from "../common/Reveal";
import { motion } from "framer-motion";
import HoverCard from "../common/HoverCard"

export default function JourneySection() {
  return (
    <Section className="relative">
      
      {/* Vertical line */}
      <motion.div
        className="absolute left-12 top-0 w-[2px] bg-[#3F2965]/20"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ transformOrigin: "top", height: "100%" }}
      />

      {/* Heading */}
      <Reveal>
        <div className="h-6 w-40 bg-[#Dd1764]/30 rounded mb-16 ml-24" />
      </Reveal>

      {/* Steps */}
      <div className="space-y-24 ml-24">

        <Reveal>
          <JourneyStep />
        </Reveal>

        <Reveal delay={0.1}>
          <JourneyStep />
        </Reveal>

        <Reveal delay={0.2}>
          <JourneyStep />
        </Reveal>

        <Reveal delay={0.3}>
          <JourneyStep />
        </Reveal>

      </div>
    </Section>
  );
}

/* STEP COMPONENT */
function JourneyStep() {
  return (
    <div className="flex items-start gap-12">
      <div className="w-4 h-4 rounded-full bg-[#3F2965]" />

      <HoverCard>
        <div className="h-24 w-3/4 bg-[#3F2965]/10 rounded-xl" />
      </HoverCard>
    </div>
  );
}