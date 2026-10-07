"use client";

import { useRef, useState, type RefObject } from "react";
import type { MotionValue } from "motion/react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import type { Store } from "@/lib/store";
import { initialTier, tierOrder, tiers, type QualityTier } from "./config";
import { InterfaceCore, type CorePlacement } from "./interface-core";
import { Meteor } from "./meteor";

export type CoreTelemetry = { fps: number; dpr: number; tier: QualityTier };

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

const step = (tier: QualityTier, direction: 1 | -1): QualityTier => {
  const index = tierOrder.indexOf(tier) + direction;
  return tierOrder[Math.min(tierOrder.length - 1, Math.max(0, index))] ?? tier;
};

/**
 * WebGL host for the Interface Core. Loaded lazily (never in the initial
 * bundle) and only on capable devices.
 *
 * Performance contract:
 * - frameloop "never" when off-screen, "demand" (single frame) when motion
 *   is reduced, "always" otherwise;
 * - DPR and particle count follow a quality tier that PerformanceMonitor
 *   adjusts from measured frame rate;
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
  const frameloop = reducedMotion ? "demand" : active ? "always" : "never";

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
      onCreated={onCreated}
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
        reducedMotion={reducedMotion}
        placement={placement}
        explode={explode}
        progress={progress}
        callouts={callouts}
      />
      {placement === "hero" && !reducedMotion ? <Meteor /> : null}
      <Probe tier={tier} telemetry={telemetry} onReady={onReady} />
    </Canvas>
  );
}

/** Reports first-frame readiness and live frame rate (2 Hz) to the DOM. */
function Probe({
  tier,
  telemetry,
  onReady,
}: {
  tier: QualityTier;
  telemetry?: Store<CoreTelemetry>;
  onReady?: () => void;
}) {
  const sample = useRef({ frames: 0, elapsed: 0, ready: false });

  useFrame((state, delta) => {
    const s = sample.current;
    if (!s.ready) {
      s.ready = true;
      onReady?.();
    }
    s.frames += 1;
    s.elapsed += delta;
    if (s.elapsed >= 0.5) {
      telemetry?.set({
        fps: Math.round(s.frames / s.elapsed),
        dpr: state.gl.getPixelRatio(),
        tier,
      });
      s.frames = 0;
      s.elapsed = 0;
    }
  });

  return null;
}
