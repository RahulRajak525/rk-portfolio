import { motionValue } from "motion/react";

/**
 * One pointer source for the whole app: a single passive listener feeds
 * motion values that any number of consumers (cursor, parallax, 3D scene)
 * can read or transform — no per-component listeners, no React re-renders.
 */
export const pointer = {
  /** Client coordinates (px). */
  x: motionValue(-100),
  y: motionValue(-100),
  /** Normalised to the viewport: -1 (left/top) … 1 (right/bottom). */
  nx: motionValue(0),
  ny: motionValue(0),
  /** 1 while a mouse is inside the window. */
  inside: motionValue(0),
  /** performance.now() of the last movement. */
  lastMove: motionValue(0),
};

let installed = false;

/** Idempotent; call from any client effect that needs pointer data. */
export function trackPointer() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      pointer.x.set(event.clientX);
      pointer.y.set(event.clientY);
      pointer.nx.set((event.clientX / window.innerWidth) * 2 - 1);
      pointer.ny.set((event.clientY / window.innerHeight) * 2 - 1);
      pointer.inside.set(1);
      pointer.lastMove.set(performance.now());
    },
    { passive: true },
  );

  // relatedTarget === null: the pointer left the window.
  document.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) pointer.inside.set(0);
  });
}
