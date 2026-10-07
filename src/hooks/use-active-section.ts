"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy: returns the id of the section crossing the middle band of the
 * viewport, or null (e.g. while the hero is in view).
 */
export function useActiveSection(
  ids: readonly string[],
  enabled = true,
): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const intersecting = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          intersecting.set(entry.target.id, entry.isIntersecting);
        setActive(ids.find((id) => intersecting.get(id)) ?? null);
      },
      // A thin band just above the vertical centre of the viewport.
      { rootMargin: "-40% 0px -55% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, enabled]);

  return enabled ? active : null;
}
