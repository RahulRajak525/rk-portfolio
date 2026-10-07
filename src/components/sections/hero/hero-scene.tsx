"use client";

import {
  createContext,
  use,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";
import { useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";

const HeroProgress = createContext<MotionValue<number> | null>(null);

/**
 * The hero <section>. Measures its own scroll-out progress once (0 at the
 * top → 1 when it has left the viewport) and shares it with the 3D stage
 * and the copy layer, which choreograph the transition to the next section.
 */
export function HeroScene({ children, ...props }: ComponentProps<"section">) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section ref={ref} {...props}>
      <HeroProgress value={scrollYProgress}>{children}</HeroProgress>
    </section>
  );
}

export function useHeroProgress(): MotionValue<number> {
  const progress = use(HeroProgress);
  if (!progress)
    throw new Error("useHeroProgress must be used inside <HeroScene>");
  return progress;
}

/**
 * Copy layer: lifts and fades as the hero scrolls away — but holds full
 * brightness for the first stretch, so a small scroll never dims the
 * headline mid-read. It never follows
 * the pointer — text stays perfectly still while reading; the 3D core alone
 * carries the cursor interaction. Neutralised under reduced motion by CSS.
 */
export function HeroCopy({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const progress = useHeroProgress();
  const y = useTransform(progress, [0, 1], [0, -150]);
  const opacity = useTransform(progress, [0.1, 0.4], [1, 0]);

  return (
    <m.div data-scroll-linked="" style={{ y, opacity }} className={className}>
      {children}
    </m.div>
  );
}
