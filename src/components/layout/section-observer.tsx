"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sectionIds } from "@/content/sections";
import { useActiveSection } from "@/hooks/use-active-section";

/**
 * Publishes the section in view as html[data-section] so pure CSS can
 * respond (the atmosphere re-lights per section) without React re-renders
 * anywhere else.
 */
export function SectionObserver() {
  const pathname = usePathname();
  const active = useActiveSection(sectionIds, pathname === "/");

  useEffect(() => {
    document.documentElement.dataset.section = active ?? "top";
  }, [active]);

  return null;
}
