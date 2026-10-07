"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Smooth scrolling — wheel/trackpad only.
 *
 * Lenis drives the *native* scroll position (no transformed wrapper), so
 * sticky positioning, scroll-linked animation, find-in-page and the
 * scrollbar keep working. Touch devices keep native momentum scrolling and
 * never download Lenis; reduced-motion users keep native scrolling.
 *
 * The frame loop runs only while a smooth scroll is in flight — an idle
 * page schedules no animation frames at all.
 */

let lenis: Lenis | null = null;
let frame = 0;

function loop(time: number) {
  if (!lenis) {
    frame = 0;
    return;
  }
  lenis.raf(time);
  frame = lenis.isScrolling ? requestAnimationFrame(loop) : 0;
}

/** Start the loop if it is not already running. */
function wake() {
  if (!lenis || frame) return;
  // Zero the clock so the first frame after an idle gap has no time delta
  // (otherwise the stale delta would jump straight to the target).
  lenis.time = 0;
  frame = requestAnimationFrame(loop);
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Focus the target for keyboard/AT users without a second scroll jump. */
function focusTarget(target: HTMLElement) {
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/** Scroll to an element: smooth via Lenis when active, native otherwise. */
export function scrollToElement(target: HTMLElement) {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: 1.4,
      easing: easeOutExpo,
      onComplete: () => focusTarget(target),
    });
    wake();
  } else {
    target.scrollIntoView({ block: "start" });
    focusTarget(target);
  }
}

export function SmoothScroll() {
  const enabled = useMediaQuery(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    // Same-page fragment links: cancel the instant jump (and Next's router
    // scroll) in the capture phase, then glide there and update the hash.
    const onClick = (event: MouseEvent) => {
      if (
        !lenis ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href*='#']")
          : null;
      if (!link || link.target === "_blank") return;

      const url = new URL(link.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      )
        return;

      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!target) return;

      event.preventDefault();
      window.history.pushState(null, "", url.hash);
      scrollToElement(target);
    };

    import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      lenis = new LenisClass({
        lerp: 0.11,
        // Pauses itself while the page is scroll-locked (e.g. modal dialog).
        autoToggle: true,
        // Lets nested scrollers (menus, code blocks) scroll natively.
        allowNestedScroll: true,
      });
      window.addEventListener("wheel", wake, { passive: true });
      document.addEventListener("click", onClick, { capture: true });
    });

    return () => {
      cancelled = true;
      window.removeEventListener("wheel", wake);
      document.removeEventListener("click", onClick, { capture: true });
      cancelAnimationFrame(frame);
      frame = 0;
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);

  return null;
}
