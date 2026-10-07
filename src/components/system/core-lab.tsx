"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CanvasBoundary } from "@/components/three/canvas-boundary";
import { CorePoster } from "@/components/three/core-poster";
import { useWebGLCapability } from "@/components/three/use-webgl-capability";

const CoreCanvas = dynamic(() => import("@/components/three/core-canvas"), {
  ssr: false,
});

/** Experiment: the core's layers separate ("anatomy view"). */
export function CoreLab() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px" });
  const capability = useWebGLCapability();
  const reducedMotion = useReducedMotion() ?? false;
  const [exploded, setExploded] = useState(false);

  return (
    <div>
      <div
        ref={ref}
        aria-hidden="true"
        className="relative aspect-square overflow-hidden rounded-lg border border-line bg-canvas-deep/60 sm:aspect-video"
      >
        {capability === "webgl" ? (
          <CanvasBoundary
            fallback={
              <CorePoster className="top-1/2 left-1/2 w-[80%] sm:w-[50%]" />
            }
          >
            <CoreCanvas
              placement="center"
              reducedMotion={reducedMotion}
              active={inView}
              explode={exploded ? 1 : 0}
            />
          </CanvasBoundary>
        ) : (
          <CorePoster className="top-1/2 left-1/2 w-[80%] sm:w-[50%]" />
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          aria-pressed={exploded}
          onClick={() => setExploded((v) => !v)}
        >
          {exploded ? "Assemble layers" : "Separate layers"}
        </Button>
        <p className="type-label text-fg-subtle" aria-live="polite">
          View: {exploded ? "anatomy" : "assembled"}
        </p>
      </div>
    </div>
  );
}
