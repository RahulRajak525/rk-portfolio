"use client";

import { useSyncExternalStore } from "react";

export type VisualCapability = "pending" | "webgl" | "static";

let cached: Exclude<VisualCapability, "pending"> | null = null;

/** Detect once; release the probe context immediately. */
function detect(): Exclude<VisualCapability, "pending"> {
  if (cached) return cached;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return (cached = "static");
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return (cached = "static");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return (cached = "webgl");
  } catch {
    return (cached = "static");
  }
}

const subscribe = () => () => {};

/**
 * "pending" during SSR/hydration (render the poster), then "webgl" or
 * "static". Static is chosen for missing WebGL2 or the Save-Data hint.
 */
export function useWebGLCapability(): VisualCapability {
  return useSyncExternalStore(subscribe, detect, () => "pending");
}
