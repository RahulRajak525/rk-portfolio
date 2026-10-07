"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import * as m from "motion/react-m";

const SCROLLED_AT = 12;

function markScrolled(header: HTMLElement | null, y: number) {
  if (header) header.dataset.scrolled = String(y > SCROLLED_AT);
}

/**
 * Fixed header frame. Transparent over the hero, glass once the page
 * scrolls (written as a data attribute — no React re-render on scroll).
 * The 1px progress line is scroll-linked orientation on a long page.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => markScrolled(ref.current, y));
  // Covers reloads that restore a scrolled position.
  useEffect(() => markScrolled(ref.current, scrollY.get()), [scrollY]);

  return (
    <header
      ref={ref}
      data-scrolled="false"
      className="group/header fixed inset-x-0 top-0 z-(--z-header) border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-(--dur-slow) ease-out-quart data-[scrolled=true]:border-line data-[scrolled=true]:glass"
    >
      {children}
      <m.div
        aria-hidden="true"
        data-decorative
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-linear-to-r from-ion-400 via-ion-300 to-plasma-400 opacity-0 transition-opacity duration-(--dur-slow) group-data-[scrolled=true]/header:opacity-100"
      />
    </header>
  );
}
