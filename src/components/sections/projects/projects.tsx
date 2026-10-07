import { projects } from "@/content/projects";
import { getSection } from "@/content/sections";
import { Section, SectionHeader } from "@/components/ui/section";
import { Rule } from "@/components/ui/rule";
import { ProjectChapter } from "./project-chapter";
import { ProjectShowcase } from "./project-showcase";

const section = getSection("projects");

export function Projects() {
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
      <ProjectShowcase projects={projects}>
        {projects.map((project, i) => (
          <ProjectChapter key={project.id} project={project} index={i + 1} />
        ))}
      </ProjectShowcase>
    </Section>
  );
}
