/**
 * Deterministic PRNG (mulberry32). Generated visuals (particle fields, poster
 * dots) must be identical on every render and every device: no layout
 * jitter, no hydration mismatch, and pure render functions.
 */
export function createRandom(seed: number) {
  let state = seed >>> 0;
  return function random(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
