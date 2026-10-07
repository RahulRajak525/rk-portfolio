"use client";

import { useState } from "react";
import * as m from "motion/react-m";
import { evidence, skillGroups } from "@/content/skills";
import type { EvidenceId, Skill } from "@/content/types";
import { cn } from "@/lib/cn";
import { spring } from "@/lib/motion";
import { StackSphere } from "./stack-sphere";

type Filter = EvidenceId | "all";

const totalSkills = skillGroups.reduce(
  (sum, group) => sum + group.skills.length,
  0,
);

const isLit = (skill: Skill, filter: Filter) =>
  filter === "all" || skill.usedIn.includes(filter);

/**
 * Capabilities explorer. The cards are the accessible source of truth; the
 * stack sphere mirrors them as an object you can turn. Filtering by evidence
 * answers the recruiter's real question: "where did you actually use this?"
 *
 * Coupling: hovering a card rotates the sphere to that domain; hovering the
 * sphere highlights the matching card (it never rotates itself toward the
 * pointer — that would chase the cursor).
 */
export function StackExplorer() {
  const [filter, setFilter] = useState<Filter>("all");
  const [cardFocus, setCardFocus] = useState<string | null>(null);
  const [sphereHover, setSphereHover] = useState<string | null>(null);
  const highlighted = cardFocus ?? sphereHover;

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
              className="relative rounded-full border border-line-strong px-4 py-2 text-body-sm text-fg-muted transition-colors duration-(--dur-fast) hover:border-line-accent hover:text-fg aria-pressed:text-fg"
            >
              {filter === option.id ? (
                <m.span
                  layoutId="evidence-pill"
                  aria-hidden="true"
                  className="absolute -inset-px rounded-full border border-ion-400/60 bg-ion-400/12"
                  transition={spring.snappy}
                />
              ) : null}
              <span className="relative">{option.label}</span>
            </button>
          ))}
        </div>
        <p aria-live="polite" className="type-label text-fg-subtle">
          {filter === "all"
            ? `${totalSkills} technologies · ${skillGroups.length} domains`
            : `${lit} of ${totalSkills} used at ${activeLabel}`}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-grid">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <StackSphere
              filter={filter}
              focus={cardFocus}
              onHoverGroup={setSphereHover}
            />
            <p className="mt-2 hidden text-center type-micro text-fg-faint lg:block">
              Drag to rotate · hover a domain to bring it forward
            </p>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
          {skillGroups.map((group) => {
            const groupLit = group.skills.filter((skill) =>
              isLit(skill, filter),
            ).length;
            const active = highlighted === group.id;
            return (
              <li
                key={group.id}
                onMouseEnter={() => setCardFocus(group.id)}
                onMouseLeave={() => setCardFocus(null)}
                className={cn(
                  "rounded-lg border bg-surface-solid/80 p-5 transition-[border-color,translate,box-shadow] duration-(--dur-base) ease-out-quart",
                  active
                    ? "-translate-y-0.5 border-line-accent shadow-[0_18px_40px_-24px_oklch(0.81_0.14_206/0.5)]"
                    : "border-line",
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
