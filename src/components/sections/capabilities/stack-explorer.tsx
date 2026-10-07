"use client";

import { useState } from "react";
import { evidence, skillGroups } from "@/content/skills";
import type { EvidenceId, Skill } from "@/content/types";
import { cn } from "@/lib/cn";

type Filter = EvidenceId | "all";

const TAU = Math.PI * 2;
const totalSkills = skillGroups.reduce(
  (sum, group) => sum + group.skills.length,
  0,
);

/** Short labels keep the constellation legible at its size. */
const shortLabels: Record<string, string> = {
  languages: "Languages",
  frameworks: "Frameworks",
  ui: "UI",
  state: "State",
  backend: "Backend",
  integrations: "Integrations",
  delivery: "Delivery",
  ai: "AI",
};

/** Radial layout, computed once: domains orbit the core, skills orbit domains. */
const layout = skillGroups.map((group, gi) => {
  const angle = -Math.PI / 2 + (gi / skillGroups.length) * TAU;
  const cx = Math.cos(angle) * 140;
  const cy = Math.sin(angle) * 140;
  const spread = 0.5;
  const nodes = group.skills.map((skill, si) => {
    const a = angle + (si - (group.skills.length - 1) / 2) * spread;
    return {
      skill,
      x: +(cx + Math.cos(a) * 62).toFixed(2),
      y: +(cy + Math.sin(a) * 62).toFixed(2),
      a,
    };
  });
  const cos = Math.cos(angle);
  return {
    group,
    cx: +cx.toFixed(2),
    cy: +cy.toFixed(2),
    nodes,
    label: {
      x: +(Math.cos(angle) * 236).toFixed(2),
      y: +(Math.sin(angle) * 236 + 3).toFixed(2),
      anchor: cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle",
    } as const,
  };
});

const isLit = (skill: Skill, filter: Filter) =>
  filter === "all" || skill.usedIn.includes(filter);

/**
 * Capabilities explorer. The cards are the accessible source of truth; the
 * constellation (desktop) mirrors them visually. Filtering by evidence
 * answers the recruiter's real question: "where did you actually use this?"
 */
export function StackExplorer() {
  const [filter, setFilter] = useState<Filter>("all");
  const [focus, setFocus] = useState<string | null>(null);

  const lit = skillGroups.reduce(
    (sum, group) =>
      sum + group.skills.filter((skill) => isLit(skill, filter)).length,
    0,
  );
  const activeLabel = evidence.find((item) => item.id === filter)?.label;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          role="group"
          aria-label="Show technologies used at"
          className="flex flex-wrap gap-2"
        >
          {[{ id: "all" as const, label: "All" }, ...evidence].map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
              className="rounded-full border border-line-strong px-4 py-2 text-body-sm text-fg-muted transition-[background-color,border-color,color] duration-(--dur-fast) hover:border-line-accent hover:text-fg aria-pressed:border-ion-400/60 aria-pressed:bg-ion-400/12 aria-pressed:text-fg"
            >
              {option.label}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="type-label text-fg-subtle">
          {filter === "all"
            ? `${totalSkills} technologies · ${skillGroups.length} domains`
            : `${lit} of ${totalSkills} used at ${activeLabel}`}
        </p>
      </div>

      <div className="mt-10 grid gap-grid lg:grid-cols-12">
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-[calc(var(--header-h)+2rem)]">
            <Constellation filter={filter} focus={focus} />
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
          {skillGroups.map((group) => {
            const groupLit = group.skills.filter((skill) =>
              isLit(skill, filter),
            ).length;
            return (
              <li
                key={group.id}
                onMouseEnter={() => setFocus(group.id)}
                onMouseLeave={() => setFocus(null)}
                className={cn(
                  "rounded-lg border bg-surface-solid/80 p-5 transition-colors duration-(--dur-base)",
                  focus === group.id ? "border-line-accent" : "border-line",
                )}
              >
                <h3 className="flex items-center justify-between gap-3 type-label text-fg">
                  {group.label}
                  <span className="text-fg-faint tabular-nums">
                    {filter === "all"
                      ? group.skills.length
                      : `${groupLit}/${group.skills.length}`}
                  </span>
                </h3>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.skills.map((skill) => {
                    const on = isLit(skill, filter);
                    return (
                      <li
                        key={skill.name}
                        className={cn(
                          "rounded-xs border px-2 py-1 text-body-sm transition-[opacity,background-color,border-color,color] duration-(--dur-base)",
                          filter !== "all" && on
                            ? "border-ion-400/45 bg-ion-400/10 text-ion-100"
                            : "border-line-strong text-fg-muted",
                          !on && "opacity-35",
                        )}
                      >
                        {skill.name}
                        {!on ? (
                          <span className="sr-only"> (not used here)</span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Constellation({
  filter,
  focus,
}: {
  filter: Filter;
  focus: string | null;
}) {
  return (
    <svg
      viewBox="-320 -270 640 540"
      aria-hidden="true"
      focusable="false"
      className="h-auto w-full"
    >
      <circle
        r={140}
        className="fill-none stroke-line [stroke-dasharray:2_6]"
      />
      <circle r={202} className="fill-none stroke-line" />

      {layout.map(({ group, cx, cy, nodes, label }) => {
        const dimmed = focus !== null && focus !== group.id;
        const focused = focus === group.id;
        return (
          <g
            key={group.id}
            className={cn(
              "transition-opacity duration-(--dur-base)",
              dimmed && "opacity-25",
            )}
          >
            <line
              x1={0}
              y1={0}
              x2={cx}
              y2={cy}
              className={focused ? "stroke-accent" : "stroke-line-strong"}
            />
            {nodes.map(({ skill, x, y, a }) => {
              const on = isLit(skill, filter);
              const highlight = on && (filter !== "all" || focused);
              return (
                <g key={skill.name}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    className={highlight ? "stroke-accent/70" : "stroke-line"}
                  />
                  {highlight ? (
                    <circle cx={x} cy={y} r={11} className="fill-ion-400/15" />
                  ) : null}
                  <circle
                    cx={x}
                    cy={y}
                    r={highlight ? 5 : 4}
                    className={cn(
                      "transition-[fill,opacity] duration-(--dur-base)",
                      highlight ? "fill-accent" : "fill-ink-500",
                      !on && "opacity-30",
                    )}
                  />
                  {focused ? (
                    <text
                      x={x + Math.cos(a) * 10}
                      y={y + Math.sin(a) * 10 + 3}
                      textAnchor={
                        Math.cos(a) > 0.2
                          ? "start"
                          : Math.cos(a) < -0.2
                            ? "end"
                            : "middle"
                      }
                      fontSize={10}
                      className="fill-fg"
                    >
                      {skill.name}
                    </text>
                  ) : null}
                </g>
              );
            })}
            <circle
              cx={cx}
              cy={cy}
              r={6}
              className={cn(
                "stroke-1",
                focused
                  ? "fill-canvas stroke-accent"
                  : "fill-canvas stroke-line-strong",
              )}
            />
            {!focused ? (
              <text
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
                fontSize={10}
                letterSpacing={1.4}
                className="fill-fg-subtle font-mono uppercase"
              >
                {shortLabels[group.id] ?? group.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* The core: same mark as the brand and the 3D object. */}
      <polygon
        points="0,-24 20.8,-12 20.8,12 0,24 -20.8,12 -20.8,-12"
        className="fill-canvas stroke-line-accent"
      />
      <circle r={16} className="fill-ion-400/15" />
      <circle r={6} className="fill-accent" />
    </svg>
  );
}
