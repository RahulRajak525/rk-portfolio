import type { CSSProperties } from "react";
import { heroFacts, person } from "@/content/site";
import { sectionHref } from "@/content/sections";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { DownloadLink } from "@/components/ui/download-link";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Eyebrow, Text } from "@/components/ui/typography";
import { ArrowRightIcon } from "@/components/ui/icons";
import { HeroCopy, HeroScene } from "./hero-scene";
import { HeroVisual } from "./hero-visual";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

/**
 * Hero — answers "who, what, what level, which stack" in one glance, then
 * offers the projects (primary) and contact/résumé. The 3D core sits beside
 * the copy on wide screens and above it on tall ones.
 *
 * Entrance choreography is CSS-only (data-enter) so it starts on first
 * paint, independent of JavaScript. Scroll choreography (copy lifts away,
 * the core separates into its anatomy) lives in HeroScene/HeroVisual.
 */
export function Hero() {
  const roleLines = person.role.split(" ");

  return (
    <HeroScene
      id="top"
      aria-labelledby="hero-title"
      data-cursor-zone="minimal"
      className="relative isolate flex min-h-svh flex-col"
    >
      {/* Laboratory floor: a hairline grid focused on the core. */}
      <div
        aria-hidden="true"
        data-decorative
        className="absolute inset-0 -z-20 bg-grid [mask-image:radial-gradient(ellipse_70%_55%_at_50%_30%,#000_15%,transparent_75%)] [--grid-size:4.5rem] aspect-wide:[mask-image:radial-gradient(ellipse_55%_75%_at_72%_48%,#000_15%,transparent_75%)]"
      />

      <HeroVisual />

      {/* Readability scrim behind the copy. */}
      <div
        aria-hidden="true"
        data-decorative
        className="absolute inset-0 -z-10 bg-linear-to-b from-transparent via-canvas/40 via-45% to-canvas/90 aspect-wide:bg-linear-to-r aspect-wide:from-canvas/85 aspect-wide:via-canvas/30 aspect-wide:via-50% aspect-wide:to-transparent"
      />

      <Container
        size="wide"
        className="flex flex-1 flex-col pt-[53svh] pb-8 aspect-wide:pt-[calc(var(--header-h)+2.5rem)]"
      >
        <HeroCopy className="flex flex-1 flex-col justify-end aspect-wide:justify-center">
          <div className="max-w-3xl">
            <div
              data-enter=""
              style={delay(0)}
              className="flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              <Eyebrow index="00">Portfolio · {person.location}</Eyebrow>
              {person.availability ? (
                <Badge tone="positive">
                  <StatusDot pulse />
                  {person.availability}
                </Badge>
              ) : null}
            </div>

            <h1 id="hero-title" className="mt-7">
              <span
                data-enter=""
                style={delay(80)}
                className="block text-heading-lg font-medium text-fg"
              >
                {person.name}
              </span>
              <span className="sr-only"> — </span>
              <span className="mt-3 block font-display text-display-2xl">
                {roleLines.map((line, i) => (
                  <span key={line} className="block">
                    <span
                      data-enter="lift-stretch"
                      style={delay(140 + i * 90)}
                      className={
                        i === roleLines.length - 1 ? "text-gradient" : undefined
                      }
                    >
                      {line}
                    </span>{" "}
                  </span>
                ))}
              </span>
            </h1>

            <Text
              size="lg"
              data-enter=""
              style={delay(420)}
              className="mt-7 max-w-2xl"
            >
              {person.tagline}
            </Text>

            <ul
              data-enter=""
              style={delay(500)}
              aria-label="Core technologies"
              className="mt-6 flex flex-wrap gap-2"
            >
              {person.coreStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-xs border border-line-strong bg-canvas/40 px-2.5 py-1 type-label text-fg-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <div
              data-enter=""
              style={delay(580)}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <ButtonLink href={sectionHref("projects")} size="lg" magnetic>
                View projects
                <ArrowRightIcon className="transition-transform duration-(--dur-base) ease-out-expo group-hover/button:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink
                href={sectionHref("contact")}
                variant="secondary"
                size="lg"
                magnetic
              >
                Get in touch
              </ButtonLink>
              {person.resumeUrl ? (
                <DownloadLink href={person.resumeUrl} magnetic>
                  Résumé
                </DownloadLink>
              ) : null}
            </div>
          </div>

          <HeroFacts />
        </HeroCopy>
      </Container>
    </HeroScene>
  );
}

/** The recruiter's 6-second scan. */
function HeroFacts() {
  return (
    <div
      data-enter="fade"
      style={delay(800)}
      className="mt-12 flex items-end gap-8 aspect-wide:mt-16"
    >
      <dl className="grid flex-1 grid-cols-2 border-t border-line lg:grid-cols-4">
        {heroFacts.map((fact, i) => (
          <div
            key={fact.label}
            className="border-line py-4 pr-4 max-lg:even:border-l max-lg:even:pl-4 max-lg:nth-[n+3]:border-t lg:px-6 lg:not-first:border-l lg:first:pl-0"
          >
            <dt className="type-label text-fg-subtle">
              <span className="text-fg-faint tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              {fact.label}
            </dt>
            <dd className="mt-2 text-body-sm text-fg">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <a
        href={sectionHref("experience")}
        className="group/cue hidden shrink-0 flex-col items-center gap-3 pb-4 type-label text-fg-subtle transition-colors hover:text-fg lg:flex"
      >
        Scroll
        <span
          aria-hidden="true"
          className="relative h-12 w-px overflow-hidden bg-line"
        >
          <span className="absolute inset-x-0 top-0 h-1/3 animate-scroll-cue bg-accent motion-reduce:animate-none" />
        </span>
      </a>
    </div>
  );
}
