import { projects } from "@/content/projects";
import { getSection } from "@/content/sections";
import type { CaseStudy } from "@/content/types";
import { cn } from "@/lib/cn";
import { Section, SectionHeader } from "@/components/ui/section";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Rule } from "@/components/ui/rule";
import { Text } from "@/components/ui/typography";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import { CaseVisual } from "./case-visual";

const section = getSection("projects");

export function Projects() {
  const [featured, ...rest] = projects;

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

      <div className="mt-14 space-y-grid lg:mt-20">
        {featured ? <CaseCard project={featured} index={1} featured /> : null}
        <div className="grid gap-grid lg:grid-cols-2">
          {rest.map((project, i) => {
            // An odd card out spans the row in the wide layout — no orphans.
            const wide = rest.length % 2 === 1 && i === rest.length - 1;
            return (
              <div
                key={project.id}
                className={wide ? "lg:col-span-2" : undefined}
              >
                <CaseCard project={project} index={i + 2} featured={wide} />
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function CaseCard({
  project,
  index,
  featured = false,
}: {
  project: CaseStudy;
  index: number;
  featured?: boolean;
}) {
  const titleId = `project-${project.id}-title`;

  return (
    <Reveal className="h-full">
      <Panel
        as="article"
        id={`project-${project.id}`}
        aria-labelledby={titleId}
        variant="solid"
        padding="none"
        spotlight
        className="group/case h-full scroll-mt-[calc(var(--header-h)+2rem)] overflow-hidden"
      >
        <div className={cn("grid h-full", featured && "lg:grid-cols-12")}>
          {/* Schematic */}
          <div
            className={cn(
              "relative isolate flex flex-col justify-between gap-4 border-b border-line bg-canvas-deep/50 p-6 md:p-8",
              featured && "lg:col-span-5 lg:border-r lg:border-b-0",
            )}
          >
            <div className="absolute inset-0 -z-10 bg-grid opacity-60 [--grid-size:1.25rem]" />
            <p className="flex items-center justify-between type-label text-fg-faint">
              <span className="text-accent tabular-nums">
                P{String(index).padStart(2, "0")}
              </span>
              <span>Schematic</span>
            </p>
            <CaseVisual kind={project.visual} />
            {project.metric ? (
              <p className="flex items-baseline gap-3">
                <span className="font-display text-heading-lg text-fg tabular-nums">
                  {project.metric.value}
                </span>
                <span className="type-label text-fg-subtle">
                  {project.metric.label}
                </span>
              </p>
            ) : null}
          </div>

          {/* Story */}
          <div
            className={cn(
              "flex flex-col p-6 md:p-8",
              featured && "lg:col-span-7 lg:p-10",
            )}
          >
            <p className="flex flex-wrap items-center gap-2">
              <Badge tone={project.kind === "Production" ? "accent" : "plasma"}>
                {project.kind}
              </Badge>
              <span className="type-label text-fg-subtle">
                {project.context}
              </span>
            </p>

            <h3
              id={titleId}
              className={cn(
                "mt-5 text-fg",
                featured ? "font-display text-display-lg" : "text-heading-lg",
              )}
            >
              {project.title}
            </h3>
            <Text className="mt-4 max-w-2xl">{project.purpose}</Text>

            <dl className="mt-7 space-y-6">
              <div>
                <dt className="type-label text-fg-faint">Role</dt>
                <dd className="mt-1.5 text-body-sm text-fg">{project.role}</dd>
              </div>
              <div>
                <dt className="type-label text-fg-faint">What I built</dt>
                <dd className="mt-2">
                  <ul className="space-y-2">
                    {project.built.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-body-sm text-fg-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1 shrink-0 rotate-45 bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div
                className={cn(
                  "grid gap-6",
                  project.outcome && "sm:grid-cols-2",
                )}
              >
                <div>
                  <dt className="type-label text-fg-faint">Challenge</dt>
                  <dd className="mt-1.5 text-body-sm text-fg-muted">
                    {project.challenge}
                  </dd>
                </div>
                {project.outcome ? (
                  <div>
                    <dt className="type-label text-fg-faint">Outcome</dt>
                    <dd className="mt-1.5 text-body-sm text-fg">
                      {project.outcome}
                    </dd>
                  </div>
                ) : null}
              </div>
            </dl>

            <div className="mt-auto pt-8">
              <ul aria-label="Technologies" className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Badge>{tech}</Badge>
                  </li>
                ))}
              </ul>
              {project.links.length > 0 ? (
                <div className="mt-7 flex flex-wrap gap-3">
                  {project.links.map((link, i) => (
                    <ButtonLink
                      key={link.href}
                      href={link.href}
                      external
                      size="sm"
                      variant={i === 0 ? "primary" : "secondary"}
                      aria-label={`${link.label}: ${project.title} (opens in a new tab)`}
                    >
                      {link.label}
                      <ArrowUpRightIcon className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
                    </ButtonLink>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Panel>
    </Reveal>
  );
}
