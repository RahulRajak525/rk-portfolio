"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion, useTransform } from "motion/react";
import * as m from "motion/react-m";
import type { RootState } from "@react-three/fiber";
import { cn } from "@/lib/cn";
import { createStore, type Store } from "@/lib/store";
import { CanvasBoundary } from "@/components/three/canvas-boundary";
import { CorePoster } from "@/components/three/core-poster";
import { useWebGLCapability } from "@/components/three/use-webgl-capability";
import type { CoreTelemetry } from "@/components/three/core-canvas";
import { CALLOUTS } from "@/components/three/config";
import { useHeroProgress } from "./hero-scene";

// three.js + R3F live in their own chunk, never in the initial bundle.
const CoreCanvas = dynamic(() => import("@/components/three/core-canvas"), {
  ssr: false,
});

/**
 * Start the 3D only once the page has fully loaded and the main thread is
 * idle: it never competes with LCP, hydration or the first interaction.
 */
function whenSettled(callback: () => void) {
  let cancelIdle = () => {};
  const idle = () => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(callback, { timeout: 2000 });
      cancelIdle = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(callback, 400);
      cancelIdle = () => clearTimeout(id);
    }
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  return () => {
    window.removeEventListener("load", idle);
    cancelIdle();
  };
}

/**
 * The hero's 3D stage. Fixed to the viewport while the hero scrolls away:
 * the copy leaves, the core glides to centre and separates into its layers
 * — each labelled with the part of the stack it stands for — then the stage
 * dissolves into the next section. Paused the moment the hero is gone.
 */
export function HeroVisual() {
  const container = useRef<HTMLDivElement>(null);
  const root = useRef<RootState | null>(null);
  const callouts = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useHeroProgress();
  const capability = useWebGLCapability();
  const reducedMotion = useReducedMotion() ?? false;
  const inView = useInView(container);

  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const [telemetry] = useState(() =>
    createStore<CoreTelemetry>({ fps: 0, dpr: 1, tier: "high" }),
  );

  useEffect(() => {
    if (capability !== "webgl") return;
    return whenSettled(() => setArmed(true));
  }, [capability]);

  // Next.js keeps visited routes mounted-but-hidden (<Activity>). R3F's loop
  // is outside React, so stop it explicitly when this page is hidden.
  useLayoutEffect(() => () => root.current?.setFrameloop("never"), []);

  const opacity = useTransform(progress, [0.55, 0.92], [1, 0]);
  const visibility = useTransform(progress, (v) =>
    v >= 0.999 ? "hidden" : "visible",
  );

  return (
    <div
      ref={container}
      aria-hidden="true"
      data-decorative
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <m.div style={{ opacity, visibility }} className="fixed inset-0">
        <CorePoster
          className={cn(
            "top-[29%] left-1/2 w-[min(90vw,58svh)] transition-opacity duration-1000",
            "aspect-wide:top-[49%] aspect-wide:left-[72%] aspect-wide:w-[min(76svh,48vw)]",
            ready && "opacity-0",
          )}
        />
        {capability === "webgl" && armed ? (
          <CanvasBoundary>
            <CoreCanvas
              placement="hero"
              reducedMotion={reducedMotion}
              active={inView}
              progress={progress}
              callouts={callouts}
              telemetry={telemetry}
              onCreated={(state) => {
                root.current = state;
              }}
              onReady={() => setReady(true)}
              className={cn(
                "opacity-0 transition-opacity duration-1500",
                ready && "opacity-100",
              )}
            />
          </CanvasBoundary>
        ) : null}

        {/* Holographic anatomy labels — positioned every frame by the scene. */}
        <div className="absolute inset-0 hidden lg:block">
          {CALLOUTS.map((callout, i) => (
            <div
              key={callout.layer}
              ref={(el) => {
                callouts.current[i] = el;
              }}
              data-side="right"
              className="group/callout absolute top-0 left-0 opacity-0 will-change-transform"
            >
              <span className="absolute size-2 -translate-1/2 rounded-full border border-accent bg-canvas shadow-[0_0_10px_var(--color-ion-400)]" />
              <span className="absolute top-0 left-1.5 h-px w-12 bg-linear-to-r from-accent/80 to-transparent group-data-[side=left]/callout:right-1.5 group-data-[side=left]/callout:left-auto group-data-[side=left]/callout:bg-linear-to-l" />
              <span className="absolute top-0 left-16 -translate-y-1/2 whitespace-nowrap group-data-[side=left]/callout:right-16 group-data-[side=left]/callout:left-auto group-data-[side=left]/callout:text-right">
                <span className="block type-micro text-accent">
                  {callout.index} · {callout.layer}
                </span>
                <span className="mt-0.5 block text-body-sm font-medium text-fg">
                  {callout.meaning}
                </span>
                <span className="block type-micro text-fg-subtle">
                  {callout.stack}
                </span>
              </span>
            </div>
          ))}
        </div>
      </m.div>
      {ready ? <Telemetry store={telemetry} /> : null}
    </div>
  );
}

/**
 * Live render telemetry. A deliberate signal of performance awareness: the
 * scene reports real frame rate, pixel ratio and its adaptive quality tier.
 */
function Telemetry({ store }: { store: Store<CoreTelemetry> }) {
  const { fps, dpr, tier } = useSyncExternalStore(
    store.subscribe,
    store.get,
    store.get,
  );
  return (
    <dl className="absolute top-[calc(var(--header-h)+1.75rem)] right-gutter hidden grid-cols-[auto_auto] gap-x-4 gap-y-1.5 type-micro text-fg-faint lg:grid">
      <dt>Render</dt>
      <dd className="text-right text-fg-subtle">WebGL 2</dd>
      <dt>Frame rate</dt>
      <dd className="text-right text-fg-subtle tabular-nums">
        {fps ? `${fps} fps` : "—"}
      </dd>
      <dt>Pixel ratio</dt>
      <dd className="text-right text-fg-subtle tabular-nums">
        {dpr.toFixed(2)}
      </dd>
      <dt>Quality</dt>
      <dd className="text-right text-accent">{tier}</dd>
    </dl>
  );
}
