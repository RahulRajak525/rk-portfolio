"use client";

import type { ReactNode } from "react";
import * as m from "motion/react-m";
import { revealGroupVariants, revealVariants } from "@/lib/motion";

/**
 * Scroll-triggered entrances. Purpose: pace information as it arrives so
 * the reader's eye lands on one thing at a time.
 *
 * Content is server-rendered and always present in the DOM (SEO-safe); a
 * <noscript> rule in the root layout un-hides it if JavaScript never runs.
 */

const viewport = { once: true, amount: 0.2 } as const;

const tags = {
  div: m.div,
  section: m.section,
  header: m.header,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
} as const;

type Tag = keyof typeof tags;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  as?: Tag;
};

/** A single element that enters when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const Component = tags[as];
  return (
    <Component
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={revealVariants}
      custom={delay}
    >
      {children}
    </Component>
  );
}

/** Orchestrates RevealItem children with a stagger. */
export function RevealGroup({
  children,
  className,
  as = "div",
}: Omit<RevealProps, "delay">) {
  const Component = tags[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={revealGroupVariants}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: Omit<RevealProps, "delay">) {
  const Component = tags[as];
  return (
    <Component data-reveal="" className={className} variants={revealVariants}>
      {children}
    </Component>
  );
}
