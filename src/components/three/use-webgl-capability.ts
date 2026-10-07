"use client";

import { useSyncExternalStore } from "react";

export type VisualCapability = "pending" | "webgl" | "static";

let cached: Exclude<VisualCapability, "pending"> | null = null;

/** Software rasterisers: WebGL "works" but every frame blocks the main thread. */
const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|softpipe|software|basic render/i;

/** Detect once; release the probe context immediately. */
function detect(): Exclude<VisualCapability, "pending"> {
  if (cached) return cached;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return (cached = "static");
  try {
    // Fails instead of silently falling back to software rendering
    // (no GPU, blocklisted driver, hardware acceleration disabled).
    const gl = document
      .createElement("canvas")
      .getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return (cached = "static");
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return (cached = SOFTWARE_RENDERER.test(renderer) ? "static" : "webgl");
  } catch {
    return (cached = "static");
  }
}

const subscribe = () => () => {};

/**
 * "pending" during SSR/hydration (render the poster), then "webgl" or
 * "static". Static — the poster stays — for missing WebGL2, software-only
 * rendering, or the Save-Data hint.
 */
export function useWebGLCapability(): VisualCapability {
  return useSyncExternalStore(subscribe, detect, () => "pending");
}
