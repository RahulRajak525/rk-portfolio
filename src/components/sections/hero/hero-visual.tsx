"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import {
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import type { RootState } from "@react-three/fiber";
import { cn } from "@/lib/cn";
import { createStore, type Store } from "@/lib/store";
import { CorePoster } from "@/components/three/core-poster";
import { useWebGLCapability } from "@/components/three/use-webgl-capability";
import type { CoreTelemetry } from "@/components/three/core-canvas";

// three.js + R3F live in their own chunk, never in the initial bundle.
const CoreCanvas = dynamic(() => import("@/components/three/core-canvas"), {
  ssr: false,
});

/** Wait for the main thread to go idle so 3D never competes with LCP/hydration. */
function whenIdle(callback: () => void) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 300);
  return () => clearTimeout(id);
}

export function HeroVisual() {
  const container = useRef<HTMLDivElement>(null);
  const root = useRef<RootState | null>(null);
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
    return whenIdle(() => setArmed(true));
  }, [capability]);

  // Next.js keeps visited routes mounted-but-hidden (<Activity>). R3F's loop
  // is outside React, so stop it explicitly when this page is hidden.
  useLayoutEffect(() => () => root.current?.setFrameloop("never"), []);

  // Cinematic exit: the core recedes as the hero scrolls away.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <div
      ref={container}
      aria-hidden="true"
      data-decorative
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <m.div
        style={reducedMotion ? undefined : { opacity, y, scale }}
        className="absolute inset-0"
      >
        <CorePoster
          className={cn(
            "top-[29%] left-1/2 w-[min(90vw,58svh)] transition-opacity duration-1000",
            "aspect-wide:top-[49%] aspect-wide:left-[72%] aspect-wide:w-[min(76svh,48vw)]",
            ready && "opacity-0",
          )}
        />
        {capability === "webgl" && armed ? (
          <CoreCanvas
            placement="hero"
            reducedMotion={reducedMotion}
            active={inView}
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
        ) : null}
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
