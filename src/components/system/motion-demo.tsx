"use client";

import { useState } from "react";
import * as m from "motion/react-m";
import { Button } from "@/components/ui/button";
import { revealGroupVariants, revealVariants } from "@/lib/motion";

/** Replays the default reveal choreography (stagger + rise + de-blur). */
export function MotionDemo() {
  const [run, setRun] = useState(0);

  return (
    <div>
      <m.ul
        key={run}
        initial="hidden"
        animate="visible"
        variants={revealGroupVariants}
        className="grid grid-cols-3 gap-3"
      >
        {["Signal", "Structure", "Interface"].map((label) => (
          <m.li
            key={label}
            variants={revealVariants}
            className="rounded-md border border-line bg-surface p-5 type-label text-fg-muted"
          >
            {label}
          </m.li>
        ))}
      </m.ul>
      <Button
        variant="ghost"
        size="sm"
        className="mt-4"
        onClick={() => setRun((n) => n + 1)}
      >
        Replay reveal
      </Button>
    </div>
  );
}
