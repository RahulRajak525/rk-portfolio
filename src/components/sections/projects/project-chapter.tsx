import type { CaseStudy } from "@/content/types";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { InViewFlag } from "@/components/motion/in-view-flag";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { CaseVisual } from "./case-visual";

/**
 * One case study, fully server-rendered. On desktop the sticky stage shows
 * its schematic; on touch screens the schematic sits inline and animates
 * while on screen (the stand-in for hover).
 */
export function ProjectChapter({
  project,
  index,
}: {
  project: CaseStudy;
  index: number;
}) {
  const titleId = `project-${project.id}-title`;

  return (
    <article
      id={`project-${project.id}`}
      data-chapter={project.id}
      aria-labelledby={titleId}
      className="group/chapter relative scroll-mt-[calc(var(--header-h)+2rem)] lg:flex lg:min-h-[72svh] lg:flex-col lg:justify-center lg:py-14"
    >
      {/* Focus marker: grows when this chapter is the one on stage. */}
      <span
        aria-hidden="true"
        className="absolute top-14 bottom-14 -left-5 hidden w-px origin-top scale-y-[0.25] bg-linear-to-b from-accent via-accent/40 to-transparent opacity-40 transition-[scale,opacity] duration-700 ease-out-expo group-data-[active=true]/chapter:scale-y-100 group-data-[active=true]/chapter:opacity-100 lg:block"
      />

      <InViewFlag className="relative isolate mb-8 overflow-hidden rounded-lg border border-line bg-canvas-deep/60 p-5 lg:hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-grid opacity-60 [--grid-size:1.25rem]"
        />
        <CaseVisual kind={project.visual} flow="inview" />
        {project.metric ? (
          <p className="mt-3 flex items-baseline gap-3">
            <span className="font-display text-heading-md text-fg tabular-nums">
              {project.metric.value}
            </span>
            <span className="type-label text-fg-subtle">
              {project.metric.label}
            </span>
          </p>
        ) : null}
      </InViewFlag>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="type-label text-accent tabular-nums">
          P{String(index).padStart(2, "0")}
        </span>
        <Badge tone={project.kind === "Production" ? "accent" : "plasma"}>
          {project.kind}
        </Badge>
        <span className="type-label text-fg-subtle">{project.context}</span>
      </p>

      <h3 id={titleId} className="mt-5 font-display text-display-lg text-fg">
        <SplitReveal text={project.title} />
      </h3>
      <Text size="lg" className="mt-5 max-w-xl">
        {project.purpose}
      </Text>

      <dl className="mt-8 space-y-6">
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
        <div className={cn("grid gap-6", project.outcome && "sm:grid-cols-2")}>
          <div>
            <dt className="type-label text-fg-faint">Challenge</dt>
            <dd className="mt-1.5 text-body-sm text-fg-muted">
              {project.challenge}
            </dd>
          </div>
          {project.outcome ? (
            <div>
              <dt className="type-label text-fg-faint">Outcome</dt>
              <dd className="mt-1.5 text-body-sm text-fg">{project.outcome}</dd>
            </div>
          ) : null}
        </div>
      </dl>

      <RevealGroup as="ul" className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <RevealItem as="li" key={tech} variant="pop">
            <Badge>{tech}</Badge>
          </RevealItem>
        ))}
      </RevealGroup>

      {project.links.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {project.links.map((link, i) => (
            <ButtonLink
              key={link.href}
              href={link.href}
              external
              magnetic
              size="md"
              variant={i === 0 ? "primary" : "secondary"}
              aria-label={`${link.label}: ${project.title} (opens in a new tab)`}
            >
              {link.label}
              <ArrowUpRightIcon className="transition-transform group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5" />
            </ButtonLink>
          ))}
        </div>
      ) : null}
    </article>
  );
}
