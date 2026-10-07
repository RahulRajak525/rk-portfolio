"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";

/**
 * Publishes visibility as data-inview so CSS can run an effect only while
 * it is on screen — the touch-device stand-in for hover (e.g. schematic
 * data-flow animates while visible instead of on hover).
 */
export function InViewFlag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  return (
    <div ref={ref} data-inview={inView} className={className}>
      {children}
    </div>
  );
}
