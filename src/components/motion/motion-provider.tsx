"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () =>
  import("./motion-features").then((mod) => mod.default);

/**
 * App-wide motion context.
 * - LazyMotion + `m` components keep the initial bundle small (`strict`
 *   forbids accidentally importing the full `motion` component).
 * - reducedMotion="user" honours the OS setting everywhere: transform
 *   animations are skipped, opacity is kept so state changes still read.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
