"use client";

import { useRef } from "react";
import { useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";

/**
 * Reading-paced text: each word brightens as the paragraph scrolls through
 * the viewport, so the eye is led line by line. Always legible (dimmed
 * words stay at 30% opacity); fully lit under reduced motion via CSS.
 */
export function ScrollWords({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "end 55%"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word
            key={`${w}-${i}`}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          >
            {w}
          </Word>
        ))}
      </span>
    </p>
  );
}

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.3, 1]);
  return (
    <>
      <m.span data-reveal="" data-scroll-linked="" style={{ opacity }}>
        {children}
      </m.span>{" "}
    </>
  );
}
