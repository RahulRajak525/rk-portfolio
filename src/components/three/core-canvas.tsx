"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { MotionValue } from "motion/react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import type { Store } from "@/lib/store";
import { initialTier, tierOrder, tiers, type QualityTier } from "./config";
import { InterfaceCore, type CorePlacement } from "./interface-core";
import { Meteor } from "./meteor";

export type CoreTelemetry = {
  fps: number;
  dpr: number;
  /** "still": the device could not sustain animation; one static frame. */
  tier: QualityTier | "still";
};

type CoreCanvasProps = {
  placement: CorePlacement;
  reducedMotion: boolean;
  /** false pauses the render loop entirely (e.g. scrolled out of view). */
  active: boolean;
  explode?: number;
  /** Hero scroll-out progress (0 → 1) driving the anatomy transformation. */
  progress?: MotionValue<number>;
  /** DOM labels the scene positions over its layers each frame. */
  callouts?: RefObject<(HTMLDivElement | null)[]>;
  telemetry?: Store<CoreTelemetry>;
  onReady?: () => void;
  onCreated?: (state: RootState) => void;
  className?: string;
};

/** Below this frame rate at the lowest tier, animation is not worth its cost. */
const STARVED_FPS = 22;

const step = (tier: QualityTier, direction: 1 | -1): QualityTier => {
  const index = tierOrder.indexOf(tier) + direction;
  return tierOrder[Math.min(tierOrder.length - 1, Math.max(0, index))] ?? tier;
};

/**
 * WebGL host for the Interface Core. Loaded lazily (never in the initial
 * bundle) and only on capable devices.
 *
 * Performance contract:
 * - shaders compile asynchronously (KHR_parallel_shader_compile) before the
 *   first frame, so program linking never stalls the main thread;
 * - frameloop "never" when off-screen, "demand" (single frame) when motion
 *   is reduced, "always" otherwise;
 * - DPR and particle count follow a quality tier that PerformanceMonitor
 *   adjusts from measured frame rate; a device that cannot hold
 *   STARVED_FPS even at the lowest tier gets one still frame instead;
 * - no post-processing: glow is additive shading, not a bloom pass.
 */
export default function CoreCanvas({
  placement,
  reducedMotion,
  active,
  explode = 0,
  progress,
  callouts,
  telemetry,
  onReady,
  onCreated,
  className,
}: CoreCanvasProps) {
  const [tier, setTier] = useState<QualityTier>(initialTier);
  const [compiled, setCompiled] = useState(false);
  const [starved, setStarved] = useState(false);

  const frameloop = !compiled
    ? "never"
    : reducedMotion || starved
      ? "demand"
      : active
        ? "always"
        : "never";

  return (
    <Canvas
      className={className}
      frameloop={frameloop}
      dpr={tiers[tier].dpr}
      flat
      camera={{ position: [0, 0, 11], fov: 35, near: 0.1, far: 60 }}
      gl={{
        antialias: tier !== "low",
        alpha: true,
        stencil: false,
        powerPreference: "high-performance",
      }}
      onCreated={(state) => {
        onCreated?.(state);
        // Parallel compile where the GPU supports it; otherwise compile once
        // up front (what the first frame would have done anyway).
        if (state.gl.extensions.has("KHR_parallel_shader_compile")) {
          state.gl
            .compileAsync(state.scene, state.camera)
            .catch(() => {})
            .finally(() => setCompiled(true));
        } else {
          state.gl.compile(state.scene, state.camera);
          setCompiled(true);
        }
      }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setTier((current) => step(current, -1))}
        onIncline={() => setTier((current) => step(current, 1))}
        onFallback={() => setTier("low")}
      />
      <InterfaceCore
        tier={tier}
        reducedMotion={reducedMotion || starved}
        placement={placement}
        explode={explode}
        progress={progress}
        callouts={callouts}
      />
      {placement === "hero" && !reducedMotion && !starved ? <Meteor /> : null}
      <Probe
        tier={tier}
        telemetry={telemetry}
        onReady={onReady}
        onStarved={() => setStarved(true)}
      />
      <RenderOnce deps={[compiled, starved]} />
    </Canvas>
  );
}

/** In on-demand mode, render a frame whenever the inputs change. */
function RenderOnce({ deps }: { deps: unknown[] }) {
  const invalidate = useThree((state) => state.invalidate);
  const key = deps.join("|");
  useEffect(() => invalidate(), [key, invalidate]);
  return null;
}

/**
 * Reports first-frame readiness and live frame rate (2 Hz) to the DOM, and
 * flags starvation: three consecutive low samples at the lowest tier.
 */
function Probe({
  tier,
  telemetry,
  onReady,
  onStarved,
}: {
  tier: QualityTier;
  telemetry?: Store<CoreTelemetry>;
  onReady?: () => void;
  onStarved: () => void;
}) {
  const sample = useRef({ frames: 0, elapsed: 0, ready: false, lowStreak: 0 });

  useFrame((state, delta) => {
    const s = sample.current;
    if (!s.ready) {
      s.ready = true;
      onReady?.();
    }
    s.frames += 1;
    s.elapsed += delta;
    if (s.elapsed < 0.5) return;

    const fps = Math.round(s.frames / s.elapsed);
    s.frames = 0;
    s.elapsed = 0;
    s.lowStreak = tier === "low" && fps < STARVED_FPS ? s.lowStreak + 1 : 0;

    if (s.lowStreak >= 3) {
      telemetry?.set({ fps, dpr: state.gl.getPixelRatio(), tier: "still" });
      onStarved();
      return;
    }
    telemetry?.set({ fps, dpr: state.gl.getPixelRatio(), tier });
  });

  return null;
}
