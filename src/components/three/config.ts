/**
 * Scene constants. Colours are the sRGB equivalents of the OKLCH design
 * tokens (src/styles/tokens.css) so 3D and DOM share one palette.
 */
export const palette = {
  ion200: "#a3f5fa",
  ion300: "#60ecf6",
  ion400: "#00daed",
  ion600: "#008aa9",
  plasma300: "#cbaaff",
  plasma400: "#ae7fff",
  plasma500: "#8e58f2",
  white: "#f5f7fa",
  // Meteor: the one warm element — heat reads as motion and energy.
  emberHot: "#fff4e2",
  emberMid: "#ffb15c",
  emberCool: "#e2553f",
} as const;

/** Radii of the concentric layers — the "anatomy" of the core. */
export const layers = {
  nucleus: 0.36,
  lattice: 1.0,
  shell: 1.55,
  orbits: [2.05, 2.4, 2.75],
} as const;

/** Seconds between signal pulses emitted by the nucleus. */
export const PULSE_PERIOD = 4.2;
/** How far (world units) a pulse travels before fading. */
export const PULSE_RANGE = 7.5;

export type QualityTier = "high" | "medium" | "low";

export const tiers: Record<
  QualityTier,
  { dpr: [number, number]; particles: number }
> = {
  high: { dpr: [1, 2], particles: 5200 },
  medium: { dpr: [1, 1.5], particles: 2800 },
  low: { dpr: [1, 1], particles: 1400 },
};

export const MAX_PARTICLES = tiers.high.particles;

export const tierOrder: QualityTier[] = ["low", "medium", "high"];

/** Conservative first guess; PerformanceMonitor corrects it at runtime. */
export function initialTier(): QualityTier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  if (cores <= 4 || memory <= 2) return "low";
  if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768)
    return "medium";
  return "high";
}

/** Signal pulse radius & strength at time t (shared by every layer). */
export function pulseAt(t: number) {
  const phase = (t % PULSE_PERIOD) / PULSE_PERIOD;
  return { radius: phase * PULSE_RANGE, strength: 1 - phase };
}

/** Gaussian falloff of a pulse wavefront around a given layer radius. */
export function pulseBoost(t: number, layerRadius: number) {
  const { radius, strength } = pulseAt(t);
  const d = (radius - layerRadius) * 2.2;
  return Math.exp(-d * d) * strength;
}

/**
 * Anatomy labels revealed as the core separates on scroll. Each layer maps
 * to the part of the stack it stands for (résumé technologies only).
 * Order matches the anchors in interface-core.tsx.
 */
export const CALLOUTS = [
  {
    layer: "Nucleus",
    index: "01",
    meaning: "State & logic",
    stack: "Redux · Pinia",
  },
  {
    layer: "Lattice",
    index: "02",
    meaning: "Structure",
    stack: "React · Vue · Next.js",
  },
  {
    layer: "Shell",
    index: "03",
    meaning: "Interface",
    stack: "Tailwind · Vuetify · MUI",
  },
  {
    layer: "Orbits",
    index: "04",
    meaning: "Interaction",
    stack: "Socket.io · React Hook Form",
  },
  {
    layer: "Field",
    index: "05",
    meaning: "Data",
    stack: "REST · Node.js · MongoDB",
  },
] as const;
