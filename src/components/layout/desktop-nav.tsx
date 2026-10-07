"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sectionHref, sectionIds, sections } from "@/content/sections";
import { useActiveSection } from "@/hooks/use-active-section";

/** Primary navigation (≥ lg). Highlights the section currently in view. */
export function DesktopNav() {
  const pathname = usePathname();
  const active = useActiveSection(sectionIds, pathname === "/");

  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              href={sectionHref(section.id)}
              aria-current={active === section.id ? "true" : undefined}
              className="group/link relative flex items-center gap-2 px-3.5 py-2.5 type-label text-fg-subtle transition-colors duration-(--dur-fast) hover:text-fg aria-[current=true]:text-fg"
            >
              <span className="text-fg-faint tabular-nums transition-colors group-hover/link:text-accent group-aria-[current=true]/link:text-accent">
                {section.index}
              </span>
              {section.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-(--dur-base) ease-out-expo group-aria-[current=true]/link:scale-x-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
