"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { StatusDot } from "@/components/ui/badge";

/**
 * A node on the timeline rail. It ignites when the rail's glowing tip —
 * which travels near 72% of the viewport — reaches it, so progress through
 * the career reads as energy moving down the line. State is a data
 * attribute; scrolling never re-renders React.
 */
export function TimelineNode({ current }: { current: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "start 71%"],
  });

  const light = (value: number) => {
    if (ref.current) ref.current.dataset.lit = String(value > 0.5);
  };
  useMotionValueEvent(scrollYProgress, "change", light);
  useEffect(() => {
    if (ref.current)
      ref.current.dataset.lit = String(scrollYProgress.get() > 0.5);
  }, [scrollYProgress]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-lit="false"
      className="group/node absolute top-1 left-0 grid size-[15px] place-items-center rounded-full border border-line-strong bg-canvas transition-[border-color,box-shadow,scale] duration-700 ease-out-expo data-[lit=true]:scale-110 data-[lit=true]:border-ion-400 data-[lit=true]:shadow-[0_0_16px_var(--color-ion-400)]"
    >
      {current ? (
        <StatusDot tone="accent" pulse className="size-1.5" />
      ) : (
        <span className="size-1.5 rounded-full bg-fg-faint transition-colors duration-700 group-data-[lit=true]/node:bg-accent" />
      )}
    </span>
  );
}
