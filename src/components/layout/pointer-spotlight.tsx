"use client";

import { useEffect } from "react";

/**
 * One delegated pointer listener for every [data-spotlight] surface.
 * Writes --spot-x / --spot-y on the hovered element (rAF-throttled, no React
 * re-renders), so Server Components get the effect without client code.
 */
export function PointerSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    let frame = 0;
    let last: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      if (!last || !(last.target instanceof Element)) return;
      const surface = last.target.closest<HTMLElement>("[data-spotlight]");
      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty("--spot-x", `${last.clientX - rect.left}px`);
      surface.style.setProperty("--spot-y", `${last.clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
