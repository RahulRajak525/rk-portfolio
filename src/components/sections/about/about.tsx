import { education, languages, story, strengths } from "@/content/about";
import { getSection } from "@/content/sections";
import { Section, SectionHeader } from "@/components/ui/section";
import { Panel } from "@/components/ui/panel";
import { Rule } from "@/components/ui/rule";
import { Text } from "@/components/ui/typography";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const section = getSection("about");

export function About() {
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

      <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-grid">
        <div className="lg:col-span-6">
          <Reveal className="space-y-6">
            {story.map((paragraph, i) => (
              <Text
                key={paragraph}
                size={i === 0 ? "lg" : "md"}
                tone={i === 0 ? "default" : "muted"}
              >
                {paragraph}
              </Text>
            ))}
          </Reveal>

          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <Panel variant="outline" padding="sm">
              <p className="type-label text-fg-faint">Education</p>
              <p className="mt-3 text-body-sm font-medium text-fg">
                {education.degree}
              </p>
              <p className="mt-1 text-body-sm text-fg-subtle">
                {education.school}
              </p>
              <p className="mt-3 type-label text-fg-subtle tabular-nums">
                {education.period}
              </p>
            </Panel>
            <Panel variant="outline" padding="sm">
              <p className="type-label text-fg-faint">Languages</p>
              <dl className="mt-3 space-y-3">
                {languages.map((language) => (
                  <div key={language.name}>
                    <dt className="text-body-sm font-medium text-fg">
                      {language.name}
                    </dt>
                    <dd className="text-body-sm text-fg-subtle">
                      {language.level}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="type-label text-fg-subtle">What I bring</p>
          <RevealGroup as="ol" className="mt-5 border-t border-line">
            {strengths.map((strength, i) => (
              <RevealItem
                as="li"
                key={strength.title}
                className="flex gap-5 border-b border-line py-5"
              >
                <span
                  aria-hidden="true"
                  className="pt-1 type-label text-accent tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-heading-sm text-fg">{strength.title}</h3>
                  <p className="mt-1 text-body-sm text-fg-muted">
                    {strength.detail}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
