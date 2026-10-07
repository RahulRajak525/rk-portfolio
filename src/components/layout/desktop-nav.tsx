"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as m from "motion/react-m";
import { sectionHref, sectionIds, sections } from "@/content/sections";
import { useActiveSection } from "@/hooks/use-active-section";
import { spring } from "@/lib/motion";

/**
 * Primary navigation (≥ lg). Two shared-element indicators glide between
 * items: a soft pill follows hover/focus, an accent rule marks the section
 * currently in view.
 */
export function DesktopNav() {
  const pathname = usePathname();
  const active = useActiveSection(sectionIds, pathname === "/");
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center" onPointerLeave={() => setHovered(null)}>
        {sections.map((section) => (
          <li key={section.id} className="relative">
            {hovered === section.id ? (
              <m.span
                layoutId="nav-hover"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-white/6"
                transition={spring.snappy}
              />
            ) : null}
            <Link
              href={sectionHref(section.id)}
              aria-current={active === section.id ? "true" : undefined}
              onPointerEnter={() => setHovered(section.id)}
              onFocus={() => setHovered(section.id)}
              onBlur={() => setHovered(null)}
              className="group/link relative flex items-center gap-2 rounded-full px-3.5 py-2.5 type-label text-fg-subtle transition-colors duration-(--dur-fast) hover:text-fg aria-current:text-fg"
            >
              <span className="text-fg-faint tabular-nums transition-colors group-hover/link:text-accent group-aria-current/link:text-accent">
                {section.index}
              </span>
              {section.label}
            </Link>
            {active === section.id ? (
              <m.span
                layoutId="nav-active"
                aria-hidden="true"
                className="absolute inset-x-3.5 bottom-1 h-px bg-accent shadow-[0_0_8px_var(--color-ion-400)]"
                transition={spring.snappy}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}
