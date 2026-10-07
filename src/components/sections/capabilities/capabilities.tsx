import { getSection } from "@/content/sections";
import { Section, SectionHeader } from "@/components/ui/section";
import { Rule } from "@/components/ui/rule";
import { Reveal } from "@/components/motion/reveal";
import { StackExplorer } from "./stack-explorer";

const section = getSection("capabilities");

export function Capabilities() {
  return (
    <Section id={section.id}>
      <Rule className="mb-16 md:mb-20" />
      <SectionHeader
        id={section.id}
        index={section.index}
        eyebrow={section.label}
        title={section.title}
        description={section.description}
      />
      <Reveal className="mt-14 lg:mt-20">
        <StackExplorer />
      </Reveal>
    </Section>
  );
}
