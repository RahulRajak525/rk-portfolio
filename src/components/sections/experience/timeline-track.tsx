"use client";

import { useRef, type ReactNode } from "react";
import { useScroll } from "motion/react";
import * as m from "motion/react-m";

/**
 * Timeline rail. The accent line fills as the reader scrolls through the
 * entries — a progress cue for "how far along this career am I reading".
 * Fully drawn when motion is reduced ([data-scroll-linked] in CSS).
 */
export function TimelineTrack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        data-decorative
        className="absolute top-2 bottom-2 left-[7px] w-px bg-line"
      >
        <m.div
          data-scroll-linked=""
          style={{ scaleY: scrollYProgress }}
          className="h-full w-full origin-top bg-linear-to-b from-ion-300 via-ion-400 to-plasma-400 shadow-[0_0_12px_var(--color-ion-400)]"
        />
      </div>
      {children}
    </div>
  );
}
