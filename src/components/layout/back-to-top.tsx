"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { ArrowUpIcon } from "@/components/ui/icons";

/** Page progress (0–1): appears once a third of the page has been read. */
const SHOW_AFTER = 1 / 3;

function sync(el: HTMLElement | null, progress: number) {
  if (el) el.dataset.visible = String(progress > SHOW_AFTER);
}

/**
 * Floating "back to top" control. A link to #main, so SmoothScroll glides
 * there and moves focus to the content. A ring around it fills with reading
 * progress, echoing the header's progress line. Visibility lives in a data
 * attribute — scrolling never re-renders React.
 */
export function BackToTop() {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (p) => sync(ref.current, p));
  // Reloads can restore a scrolled position.
  useEffect(() => sync(ref.current, scrollYProgress.get()), [scrollYProgress]);

  return (
    <a
      ref={ref}
      href="#main"
      aria-label="Back to top"
      data-visible="false"
      data-magnetic=""
      className="group/top fixed right-gutter bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-(--z-header) grid size-12 place-items-center rounded-full border border-line-strong bg-canvas/80 text-fg-muted shadow-lift backdrop-blur-[18px] backdrop-saturate-140 transition-[opacity,translate,visibility,transform,border-color,color] duration-(--dur-base) ease-out-expo hover:border-line-accent hover:text-accent data-[visible=false]:invisible data-[visible=false]:opacity-0 motion-safe:data-[visible=false]:translate-y-4"
    >
      {/* Reading progress, drawn over the border from 12 o'clock. */}
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="absolute -inset-px -rotate-90 overflow-visible"
      >
        <m.circle
          cx="24"
          cy="24"
          r="23.5"
          fill="none"
          className="stroke-accent"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>
      <ArrowUpIcon className="size-5 transition-transform duration-(--dur-base) ease-out-expo group-hover/top:-translate-y-0.5" />
    </a>
  );
}
