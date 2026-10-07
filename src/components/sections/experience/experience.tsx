import Link from "next/link";
import type { Route } from "next";
import { experienceStats, timeline } from "@/content/experience";
import { getSection } from "@/content/sections";
import type { TimelineEntry } from "@/content/types";
import { cn } from "@/lib/cn";
import { Section, SectionHeader } from "@/components/ui/section";
import { Panel } from "@/components/ui/panel";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Text } from "@/components/ui/typography";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import { TimelineTrack } from "./timeline-track";

const section = getSection("experience");

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
                    <span className="block font-display text-heading-lg text-fg tabular-nums">
                      {stat.value}
                    </span>
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
      {/* Node on the rail */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1 left-0 grid size-[15px] place-items-center rounded-full border bg-canvas",
          entry.current
            ? "border-ion-400 shadow-[0_0_14px_var(--color-ion-400)]"
            : "border-line-strong",
        )}
      >
        {entry.current ? (
          <StatusDot tone="accent" pulse className="size-1.5" />
        ) : (
          <span className="size-1.5 rounded-full bg-fg-faint" />
        )}
      </span>

      <Reveal>
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
            {entry.highlights.map((highlight, i) => (
              <li key={highlight.text} className="flex gap-4 py-4">
                <span
                  aria-hidden="true"
                  className="pt-0.5 type-label text-fg-faint tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-body-sm text-fg-muted">
                  {highlight.text}
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
            ))}
          </ul>
        ) : null}

        {entry.stack.length > 0 ? (
          <ul aria-label="Technologies" className="mt-6 flex flex-wrap gap-2">
            {entry.stack.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </Reveal>
    </li>
  );
}
