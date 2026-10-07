"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { pointer, trackPointer } from "@/lib/pointer";

/** px: transparent bar → floating capsule. */
const FLOAT_AT = 40;
/** px: never hide near the top of the page. */
const HIDE_AFTER = 360;
/** px of continuous downward scroll before hiding / upward before showing. */
const HIDE_DISTANCE = 72;
const SHOW_DISTANCE = 24;
/** px: the pointer approaching the top edge reveals the bar. */
const REVEAL_ZONE = 80;

type Track = { prev: number; dir: number; anchor: number; hidden: boolean };

function sync(el: HTMLElement | null, track: Track, y: number) {
  if (!el) return;
  const dir = y > track.prev ? 1 : y < track.prev ? -1 : track.dir;
  if (dir !== track.dir) {
    track.dir = dir;
    track.anchor = track.prev;
  }
  track.prev = y;

  if (y < HIDE_AFTER) track.hidden = false;
  else if (dir === 1 && y - track.anchor > HIDE_DISTANCE) track.hidden = true;
  else if (dir === -1 && track.anchor - y > SHOW_DISTANCE) track.hidden = false;

  el.dataset.floating = String(y > FLOAT_AT);
  el.dataset.hidden = String(track.hidden);
}

/**
 * Scroll-aware header. At the top it is a transparent full-width bar; once
 * the page scrolls it condenses into a floating glass capsule. Scrolling
 * down hides it; scrolling up, moving the pointer to the top edge, or
 * keyboard focus brings it back. All state lives in data attributes —
 * scrolling never re-renders React.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<Track>({ prev: 0, dir: 0, anchor: 0, hidden: false });
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) =>
    sync(ref.current, track.current, y),
  );

  useEffect(() => {
    // Reloads can restore a scrolled position.
    sync(ref.current, track.current, scrollY.get());

    trackPointer();
    return pointer.y.on("change", (y) => {
      const el = ref.current;
      if (y < REVEAL_ZONE && track.current.hidden && el) {
        track.current.hidden = false;
        el.dataset.hidden = "false";
      }
    });
  }, [scrollY]);

  return (
    <header
      ref={ref}
      data-floating="false"
      data-hidden="false"
      className="group/header pointer-events-none fixed inset-x-0 top-0 z-(--z-header) transition-[translate] duration-700 ease-out-expo data-[hidden=true]:not-focus-within:translate-y-[-140%]"
    >
      <div className="pointer-events-auto relative mx-auto flex h-header w-full max-w-wide items-center justify-between gap-6 border border-transparent px-gutter transition-[max-width,margin,padding,height,border-radius,background-color,border-color,box-shadow] duration-700 ease-out-expo group-data-[floating=true]/header:mt-3 group-data-[floating=true]/header:h-14 group-data-[floating=true]/header:max-w-[min(66rem,calc(100%-1.5rem))] group-data-[floating=true]/header:rounded-full group-data-[floating=true]/header:border-line group-data-[floating=true]/header:glass group-data-[floating=true]/header:pr-2 group-data-[floating=true]/header:pl-4 group-data-[floating=true]/header:shadow-lift">
        {children}

        {/* Reading progress: scroll-linked orientation on a long page. */}
        <span
          aria-hidden="true"
          data-decorative
          className="pointer-events-none absolute inset-x-8 -bottom-px h-px overflow-hidden opacity-0 transition-opacity duration-700 group-data-[floating=true]/header:opacity-100"
        >
          <m.span
            style={{ scaleX: scrollYProgress }}
            className="block h-full origin-left bg-linear-to-r from-ion-400 via-ion-300 to-plasma-400"
          />
        </span>
      </div>
    </header>
  );
}
