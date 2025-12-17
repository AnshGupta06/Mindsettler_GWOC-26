import Section from "../common/Section"
import Reveal from "../common/Reveal"

export default function AboutPreview() {
  return (
    <Section className="bg-[#f3edf6]">
      <Reveal>
        <div className="h-6 w-40 bg-[#Dd1764]/30 rounded mb-6" />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="h-16 w-3/4 bg-[#3F2965]/20 rounded mb-4" />
      </Reveal>

      <Reveal delay={0.2}>
        <div className="h-10 w-2/3 bg-[#3F2965]/10 rounded" />
      </Reveal>
    </Section>
  );
}
