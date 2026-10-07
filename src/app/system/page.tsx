import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { Rule } from "@/components/ui/rule";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { ArrowRightIcon, DownloadIcon } from "@/components/ui/icons";
import { CoreLab } from "@/components/system/core-lab";
import { MotionDemo } from "@/components/system/motion-demo";

export const metadata: Metadata = {
  title: "Design system",
  description:
    "Foundations of the portfolio: tokens, typography, layout, components, motion and 3D.",
  robots: { index: false },
};

const palette = [
  {
    name: "Ink",
    note: "Neutral surfaces & text",
    steps: [
      "ink-1000",
      "ink-950",
      "ink-900",
      "ink-800",
      "ink-700",
      "ink-500",
      "ink-400",
      "ink-300",
      "ink-50",
    ],
  },
  {
    name: "Ion",
    note: "Primary accent — light, focus, action",
    steps: [
      "ion-900",
      "ion-700",
      "ion-600",
      "ion-500",
      "ion-400",
      "ion-300",
      "ion-200",
    ],
  },
  {
    name: "Plasma",
    note: "Secondary accent — depth, gradients",
    steps: [
      "plasma-900",
      "plasma-800",
      "plasma-600",
      "plasma-500",
      "plasma-400",
      "plasma-300",
      "plasma-200",
    ],
  },
  {
    name: "Status",
    note: "Meaning only, never decoration",
    steps: ["signal-400", "flare-400", "danger-400"],
  },
];

const roles = [
  ["canvas", "Page background"],
  ["surface", "Glass panels"],
  ["surface-solid", "Opaque panels"],
  ["line", "Hairlines"],
  ["fg", "Primary text · 18.9:1"],
  ["fg-muted", "Body text · 9.8:1"],
  ["fg-subtle", "Secondary text · 6.3:1"],
  ["fg-faint", "Decoration only · 3.7:1"],
  ["accent", "Action / focus"],
  ["accent-2", "Secondary emphasis"],
] as const;

const typeScale = [
  {
    token: "display-2xl",
    className: "font-display text-display-2xl",
    sample: "Interface",
  },
  {
    token: "display-xl",
    className: "font-display text-display-xl",
    sample: "Interface",
  },
  {
    token: "display-lg",
    className: "font-display text-display-lg",
    sample: "Section title",
  },
  {
    token: "heading-lg",
    className: "text-heading-lg",
    sample: "Heading large",
  },
  {
    token: "heading-md",
    className: "text-heading-md",
    sample: "Heading medium",
  },
  {
    token: "heading-sm",
    className: "text-heading-sm",
    sample: "Heading small",
  },
  {
    token: "body-lg",
    className: "text-body-lg text-fg-muted",
    sample: "Lede paragraph for introductions and summaries.",
  },
  {
    token: "body",
    className: "text-body text-fg-muted",
    sample:
      "Default body copy, tuned for long-form reading at 1.65 line height.",
  },
  {
    token: "body-sm",
    className: "text-body-sm text-fg-muted",
    sample: "Supporting copy, captions and dense UI.",
  },
  {
    token: "label",
    className: "type-label text-fg-subtle",
    sample: "Technical label · 01",
  },
];

const spacing = [
  ["1", "0.25rem"],
  ["2", "0.5rem"],
  ["4", "1rem"],
  ["6", "1.5rem"],
  ["8", "2rem"],
  ["12", "3rem"],
  ["16", "4rem"],
  ["24", "6rem"],
];

const easings = [
  [
    "out-expo",
    "cubic-bezier(0.16, 1, 0.3, 1)",
    "Entrances — the signature curve",
    "M0 100 C16 0 30 0 100 0",
  ],
  [
    "out-quart",
    "cubic-bezier(0.25, 1, 0.5, 1)",
    "Hover & UI feedback",
    "M0 100 C25 0 50 0 100 0",
  ],
  [
    "in-out-quart",
    "cubic-bezier(0.76, 0, 0.24, 1)",
    "Symmetric state changes",
    "M0 100 C76 100 24 0 100 0",
  ],
  [
    "standard",
    "cubic-bezier(0.65, 0, 0.35, 1)",
    "Ambient loops",
    "M0 100 C65 100 35 0 100 0",
  ],
] as const;

const durations = [
  ["instant", "100ms", "Press feedback"],
  ["fast", "180ms", "Hover, colour"],
  ["base", "320ms", "State changes"],
  ["slow", "600ms", "Surfaces"],
  ["cinematic", "1100ms", "Entrances"],
];

const coreLayers = [
  ["Nucleus", "State & logic", "Emits the signal pulse"],
  ["Lattice", "Structure", "Components — the wireframe"],
  ["Shell", "Interface", "Faceted surface users touch"],
  ["Orbits", "Interaction", "Data packets in motion"],
  ["Particles", "Signal", "Noise converging into structure"],
];

export default function SystemPage() {
  return (
    <div className="pt-[calc(var(--header-h)+4rem)] pb-section">
      <Container>
        <Eyebrow index="DS">Foundation · v0.1</Eyebrow>
        <Heading as="h1" size="display-xl" className="mt-6 max-w-4xl">
          Design <span className="text-gradient">system</span>
        </Heading>
        <Text size="lg" className="mt-6 max-w-2xl">
          The building blocks behind every page: tokens, typography, layout,
          surfaces, components, motion and the 3D core. Documented in{" "}
          <code className="font-mono text-body-sm text-fg">
            docs/design-system.md
          </code>
          .
        </Text>

        <Block
          index="01"
          title="Colour"
          description="OKLCH tokens. Raw palette for reference; components use semantic roles only."
        >
          <div className="space-y-8">
            {palette.map((group) => (
              <div key={group.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-heading-sm">{group.name}</p>
                  <p className="text-body-sm text-fg-subtle">{group.note}</p>
                </div>
                <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
                  {group.steps.map((step) => (
                    <li key={step}>
                      <div
                        className="h-14 rounded-md border border-line"
                        style={{ background: `var(--color-${step})` }}
                      />
                      <p className="mt-2 type-micro text-fg-subtle">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-heading-sm">Semantic roles</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {roles.map(([role, use]) => (
                  <li
                    key={role}
                    className="flex items-center gap-3 rounded-md border border-line p-3"
                  >
                    <span
                      className="size-8 shrink-0 rounded-sm border border-line-strong"
                      style={{ background: `var(--color-${role})` }}
                    />
                    <span className="min-w-0">
                      <span className="block type-label text-fg">{role}</span>
                      <span className="block truncate text-body-sm text-fg-subtle">
                        {use}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Block>

        <Block
          index="02"
          title="Typography"
          description="Mona Sans (variable: width + weight) for display and text; Martian Mono for technical labels. Sizes are fluid between 360px and 1440px."
        >
          <ul className="divide-y divide-line border-y border-line">
            {typeScale.map((item) => (
              <li
                key={item.token}
                className="grid gap-2 py-5 md:grid-cols-[10rem_1fr] md:items-baseline"
              >
                <span className="type-label text-fg-faint">{item.token}</span>
                <span className={`${item.className} min-w-0 truncate`}>
                  {item.sample}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block
          index="03"
          title="Spacing & layout"
          description="4px base unit. Named fluid tokens: gutter (16→40px), grid gap (16→28px), section rhythm (96→176px). 12-column grid from lg, containers: narrow 44rem · content 80rem · wide 92rem."
        >
          <ul className="space-y-2">
            {spacing.map(([step, value]) => (
              <li key={step} className="flex items-center gap-4">
                <span className="w-10 type-label text-fg-faint">{step}</span>
                <span
                  className="h-2 rounded-xs bg-accent/70"
                  style={{ width: value }}
                />
                <span className="type-micro text-fg-subtle">{value}</span>
              </li>
            ))}
          </ul>
          <div
            className="mt-10 grid grid-cols-4 gap-grid md:grid-cols-8 lg:grid-cols-12"
            aria-hidden="true"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="h-16 rounded-xs border border-dashed border-line-accent/50 bg-ion-400/5 max-lg:nth-[n+9]:hidden max-md:nth-[n+5]:hidden"
              />
            ))}
          </div>
        </Block>

        <Block
          index="04"
          title="Surfaces & depth"
          description="Layering is the primary depth cue: atmosphere → grid → 3D → glass → content. Spotlight and HUD corners are reserved for focal modules."
        >
          <div className="grid gap-grid md:grid-cols-2 lg:grid-cols-4">
            <Panel variant="glass" spotlight>
              <p className="type-label text-fg-subtle">Glass</p>
              <Text size="sm" className="mt-3">
                Floating over atmosphere or 3D. Hover for spotlight.
              </Text>
            </Panel>
            <Panel variant="solid">
              <p className="type-label text-fg-subtle">Solid</p>
              <Text size="sm" className="mt-3">
                Dense content and long reading.
              </Text>
            </Panel>
            <Panel variant="outline" corners>
              <p className="type-label text-fg-subtle">Outline + corners</p>
              <Text size="sm" className="mt-3">
                Structure without weight; one focal module.
              </Text>
            </Panel>
            <Panel variant="blueprint">
              <p className="type-label text-fg-subtle">Blueprint</p>
              <Text size="sm" className="mt-3">
                Planned or empty states.
              </Text>
            </Panel>
          </div>
        </Block>

        <Block
          index="05"
          title="Components"
          description="Pills are actions; sharp tags are data. One primary action per view."
        >
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Button>
                Primary action <ArrowRightIcon />
              </Button>
              <Button variant="secondary">
                Secondary <DownloadIcon />
              </Button>
              <Button variant="ghost">Ghost</Button>
              <Button size="sm" variant="secondary">
                Small
              </Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Neutral tag</Badge>
              <Badge tone="accent">Accent</Badge>
              <Badge tone="plasma">Plasma</Badge>
              <Badge tone="positive">
                <StatusDot pulse /> Available
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Eyebrow index="01">Eyebrow label</Eyebrow>
              <span className="inline-flex items-center gap-2 text-body-sm text-fg-muted">
                <StatusDot tone="accent" /> Status with label
              </span>
              <ButtonLink href="/" variant="ghost" size="sm">
                Link as button
              </ButtonLink>
            </div>
            <Rule />
          </div>
        </Block>

        <Block
          index="06"
          title="Motion"
          description="Motion explains — it never decorates. Transform/opacity only; ≤ 24px travel; reduced motion removes travel and loops but keeps meaning."
        >
          <div className="grid gap-grid lg:grid-cols-2">
            <ul className="grid grid-cols-2 gap-3">
              {easings.map(([name, value, use, path]) => (
                <li key={name} className="rounded-md border border-line p-4">
                  <svg
                    viewBox="-4 -4 108 108"
                    className="h-16 w-16 overflow-visible"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 100H100M0 100V0"
                      className="stroke-line-strong"
                      fill="none"
                    />
                    <path
                      d={path}
                      className="stroke-accent"
                      fill="none"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <p className="mt-3 type-label text-fg">{name}</p>
                  <p className="mt-1 text-body-sm text-fg-subtle">{use}</p>
                  <p className="sr-only">{value}</p>
                </li>
              ))}
            </ul>
            <div className="space-y-6">
              <ul className="divide-y divide-line border-y border-line">
                {durations.map(([name, value, use]) => (
                  <li
                    key={name}
                    className="grid grid-cols-[6rem_5rem_1fr] gap-3 py-3 text-body-sm"
                  >
                    <span className="type-label text-fg">{name}</span>
                    <span className="text-fg-muted tabular-nums">{value}</span>
                    <span className="text-fg-subtle">{use}</span>
                  </li>
                ))}
              </ul>
              <MotionDemo />
            </div>
          </div>
        </Block>

        <Block
          index="07"
          title="3D — the Interface Core"
          description="One object, five layers, each mapping to how interfaces are built. Lazy-loaded, paused off-screen, adaptive quality, static under reduced motion."
        >
          <div className="grid gap-grid lg:grid-cols-[1fr_20rem]">
            <CoreLab />
            <ul className="divide-y divide-line border-y border-line">
              {coreLayers.map(([layer, meaning, role]) => (
                <li key={layer} className="py-4">
                  <p className="flex items-baseline justify-between gap-3">
                    <span className="text-heading-sm">{layer}</span>
                    <span className="type-label text-accent">{meaning}</span>
                  </p>
                  <p className="mt-1 text-body-sm text-fg-subtle">{role}</p>
                </li>
              ))}
            </ul>
          </div>
        </Block>
      </Container>
    </div>
  );
}

function Block({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const id = `system-${index}`;
  return (
    <section aria-labelledby={id} className="mt-24 md:mt-32">
      <Rule className="mb-10" />
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow index={index}>{title}</Eyebrow>
          <Heading as="h2" id={id} size="heading-lg" className="mt-4">
            {title}
          </Heading>
        </div>
        <Text className="lg:col-span-6 lg:col-start-7">{description}</Text>
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
