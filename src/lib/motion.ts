import type { Transition, Variants } from "motion/react";

/**
 * Motion tokens — the JS mirror of the CSS motion tokens in
 * src/styles/tokens.css. Keep both in sync.
 *
 * Principles (see docs/design-system.md#motion):
 * 1. Motion explains: hierarchy, causality, spatial relationships, state.
 * 2. Enter with confidence (expo-out), exit quietly (fast, no travel).
 * 3. Short distances: content travels ≤ 24px; the eye follows opacity.
 * 4. Feedback < 100ms, state changes ≤ 320ms, choreography ≤ 1.2s total.
 * 5. Transform / opacity / filter only. Never animate layout properties.
 * 6. prefers-reduced-motion removes travel and loops, keeps meaning.
 */

/** Seconds. */
export const duration = {
  instant: 0.1,
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
  cinematic: 1.1,
} as const;

/** Cubic-bézier control points. */
export const ease = {
  /** Entrances: fast start, long soft landing. The signature curve. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Hover / UI feedback. */
  outQuart: [0.25, 1, 0.5, 1],
  /** Symmetric state changes and loops. */
  inOutQuart: [0.76, 0, 0.24, 1],
  /** Neutral ambient motion. */
  standard: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export const spring = {
  /** Toggles, presses, small UI. */
  snappy: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 },
  /** Larger surfaces, panels. */
  gentle: { type: "spring", stiffness: 140, damping: 22 },
} as const satisfies Record<string, Transition>;

/** Seconds between siblings in a choreographed group. */
export const stagger = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
} as const;

/**
 * Default in-view entrance: a short rise that resolves from a soft blur —
 * content "comes into focus" rather than sliding in. `custom` = delay (s).
 */
export const revealVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: ease.outExpo, delay },
  }),
} satisfies Variants;

/** Parent variant that only orchestrates its children. */
export const revealGroupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger.base } },
} satisfies Variants;

/** Small UI tokens (badges, chips) arriving: a quick springy pop. */
export const popVariants = {
  hidden: { opacity: 0, scale: 0.82, y: 6 },
  visible: { opacity: 1, scale: 1, y: 0, transition: spring.snappy },
} satisfies Variants;
