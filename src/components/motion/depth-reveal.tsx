"use client";

import { useRef, type ReactNode } from "react";
import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { cn } from "@/lib/cn";

/**
 * Scroll-scrubbed 3D entrance: content tilts up out of depth into the
 * reading plane as it crosses the lower viewport — and reverses on the way
 * back up. Transform/opacity only; neutralised under reduced motion by CSS
 * ([data-scroll-linked]).
 */
export function DepthReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 98%", "start 60%"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const z = useTransform(scrollYProgress, [0, 1], [-120, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [0, 1]);

  return (
    <div ref={ref} className={cn("[perspective:1400px]", className)}>
      <m.div
        data-reveal=""
        data-scroll-linked=""
        style={{ rotateX, z, y, opacity, transformOrigin: "50% 0%" }}
      >
        {children}
      </m.div>
    </div>
  );
}
