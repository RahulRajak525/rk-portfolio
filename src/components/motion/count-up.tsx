"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * Counts every number inside a string up from zero when it scrolls into
 * view ("40 / 10" animates both figures). The server renders the final
 * value (SEO, no-JS). The zero state is swapped in only while the element is
 * still below the fold, so there is never a visible flash; the observer's
 * first callback supplies that geometry without forcing a layout.
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
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion || !/\d/.test(value)) return;

    let primed = false;
    let controls: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        if (entry.intersectionRatio >= 0.8) {
          observer.disconnect();
          if (!primed) return; // already on screen at load: keep the final value
          controls = animate(0, 1, {
            duration,
            ease: ease.outExpo,
            onUpdate: (p) => {
              el.textContent = value.replace(/\d+/g, (n) =>
                String(Math.round(Number(n) * p)),
              );
            },
          });
        } else if (
          !primed &&
          !entry.isIntersecting &&
          entry.boundingClientRect.top > 0
        ) {
          el.textContent = value.replace(/\d+/g, "0");
          primed = true;
        }
      },
      { threshold: [0, 0.8] },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      controls?.stop();
      el.textContent = value;
    };
  }, [reducedMotion, value, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
