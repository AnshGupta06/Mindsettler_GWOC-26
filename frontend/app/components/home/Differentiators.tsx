import Section from "../common/Section";
import Reveal from "../common/Reveal";
import HoverCard from "../common/HoverCard";

export default function Differentiators() {
  return (
    <Section className="bg-[#faf7fb]">
      
      {/* Heading */}
      <Reveal>
        <div className="h-6 w-56 bg-[#Dd1764]/30 rounded mb-16" />
      </Reveal>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-12">

        <Reveal>
          <HoverCard>
            <Card />
          </HoverCard>
        </Reveal>

        <Reveal delay={0.1}>
          <HoverCard>
            <Card />
          </HoverCard>
        </Reveal>

        <Reveal delay={0.2}>
          <HoverCard>
            <Card />
          </HoverCard>
        </Reveal>

      </div>
    </Section>
  );
}

/* Card placeholder */
function Card() {
  return (
    <div className="p-10 bg-white rounded-2xl">
      <div className="h-10 w-10 bg-[#3F2965]/20 rounded-full mb-6" />
      <div className="h-5 w-3/4 bg-[#3F2965]/20 rounded mb-4" />
      <div className="h-4 w-full bg-[#3F2965]/10 rounded mb-2" />
      <div className="h-4 w-5/6 bg-[#3F2965]/10 rounded" />
    </div>
  );
}
