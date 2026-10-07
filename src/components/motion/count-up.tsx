"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * Counts every number inside a string up from zero when it scrolls into
 * view ("40 / 10" animates both figures). The server renders the final
 * value (SEO, no-JS); the zero state is only swapped in while the element
 * is still off-screen, so there is never a visible flash.
 */
export function CountUp({
  value,
  className,
  duration = 1.6,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const primed = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion || primed.current || !/\d/.test(value)) return;
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.textContent = value.replace(/\d+/g, "0");
      primed.current = true;
    }
  }, [reducedMotion, value]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || !primed.current) return;
    const controls = animate(0, 1, {
      duration,
      ease: ease.outExpo,
      onUpdate: (p) => {
        el.textContent = value.replace(/\d+/g, (n) =>
          String(Math.round(Number(n) * p)),
        );
      },
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
