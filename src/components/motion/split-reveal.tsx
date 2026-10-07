"use client";

import { Fragment } from "react";
import * as m from "motion/react-m";
import { cn } from "@/lib/cn";
import { ease, stagger } from "@/lib/motion";

const group = {
  hidden: {},
  visible: (delay: number = 0) => ({
    transition: { staggerChildren: stagger.base, delayChildren: delay },
  }),
};

const word = {
  hidden: { y: "112%" },
  visible: { y: "0%", transition: { duration: 0.95, ease: ease.outExpo } },
};

/**
 * Titles rise word by word out of a mask when they enter the viewport —
 * the section-level echo of the hero headline. Words stay whole (kerning
 * intact); assistive tech reads the sr-only sentence.
 */
export function SplitReveal({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** Applied to each word (e.g. text-gradient, which cannot span transformed children). */
  wordClassName?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <m.span
      className={cn("block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={group}
      custom={delay}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            <span className="-mb-[0.14em] inline-block overflow-clip pb-[0.14em] align-bottom">
              <m.span
                data-reveal=""
                className={cn("inline-block", wordClassName)}
                variants={word}
              >
                {w}
              </m.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </m.span>
  );
}
