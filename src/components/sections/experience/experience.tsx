import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { experienceStats, timeline } from "@/content/experience";
import { getSection } from "@/content/sections";
import type { Highlight, TimelineEntry } from "@/content/types";
import { cn } from "@/lib/cn";
import { Section, SectionHeader } from "@/components/ui/section";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/typography";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CountUp } from "@/components/motion/count-up";
import { DepthReveal } from "@/components/motion/depth-reveal";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TimelineNode } from "./timeline-node";
import { TimelineTrack } from "./timeline-track";

const section = getSection("experience");

/** Wraps the highlight's key phrases in <em class="emph"> (CSS draws the underline on scroll). */
function withEmphasis({ text, emphasis = [] }: Highlight): ReactNode {
  if (emphasis.length === 0) return text;
  const pattern = new RegExp(
    `(${emphasis.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  );
  return text.split(pattern).map((part, i) =>
    emphasis.includes(part) ? (
      <em key={i} className="emph not-italic">
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function Experience() {
  return (
    <Section id={section.id}>
      <SectionHeader
        id={section.id}
        index={section.index}
        eyebrow={section.label}
        title={section.title}
        description={section.description}
      />

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-grid">
        <aside aria-label="Experience at a glance" className="lg:col-span-4">
          <Panel
            variant="glass"
            corners
            className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
          >
            <p className="type-label text-fg-subtle">At a glance</p>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-1">
              {experienceStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <CountUp
                      value={stat.value}
                      className="block font-display text-heading-lg text-fg tabular-nums"
                    />
                    <span className="mt-1 block text-body-sm text-fg-subtle">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </aside>

        <div className="lg:col-span-8">
          <TimelineTrack>
            <ol className="space-y-14 md:space-y-16">
              {timeline.map((entry) => (
                <TimelineItem key={entry.id} entry={entry} />
              ))}
            </ol>
          </TimelineTrack>
        </div>
      </div>
    </Section>
  );
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  const isEducation = entry.kind === "education";

  return (
    <li className="relative pl-10 md:pl-14">
      <TimelineNode current={entry.current} />

      <DepthReveal>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 type-label text-fg-subtle">
          <span className="tabular-nums">
            {entry.start} — {entry.end}
          </span>
          {entry.mode ? <Badge>{entry.mode}</Badge> : null}
          {isEducation ? <Badge tone="plasma">Education</Badge> : null}
          {entry.current ? <Badge tone="accent">Current</Badge> : null}
        </p>

        <h3 className="mt-4 text-heading-lg">
          {entry.role}
          <span className="text-fg-faint"> · </span>
          <span className={isEducation ? "text-fg-muted" : "text-accent"}>
            {entry.organization}
          </span>
        </h3>

        {entry.summary ? (
          <Text size="lg" className="mt-3 max-w-2xl">
            {entry.summary}
          </Text>
        ) : null}

        {entry.highlights.length > 0 ? (
          <ul className="mt-7 divide-y divide-line border-y border-line">
            {entry.highlights.map((highlight, i) => {
              const featured = Boolean(highlight.projectId);
              return (
                <li key={highlight.text} className="relative flex gap-4 py-4">
                  {featured ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-4 bottom-4 -left-3 w-px bg-linear-to-b from-accent to-transparent"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pt-0.5 type-label tabular-nums",
                      featured ? "text-accent" : "text-fg-faint",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-body-sm text-fg-muted">
                    {withEmphasis(highlight)}
                    {highlight.projectId ? (
                      <Link
                        href={`/#project-${highlight.projectId}` as Route}
                        className="group/case ml-2 inline-flex items-center gap-1 whitespace-nowrap text-accent transition-colors hover:text-accent-strong"
                      >
                        Case study
                        <ArrowRightIcon className="size-3.5 transition-transform group-hover/case:translate-x-0.5" />
                      </Link>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        {entry.stack.length > 0 ? (
          <RevealGroup as="ul" className="mt-6 flex flex-wrap gap-2">
            {entry.stack.map((tech) => (
              <RevealItem as="li" key={tech} variant="pop">
                <Badge>{tech}</Badge>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}
      </DepthReveal>
    </li>
  );
}
