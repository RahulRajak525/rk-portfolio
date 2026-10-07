"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Smooth scrolling — wheel/trackpad only.
 *
 * Lenis drives the *native* scroll position (no transformed wrapper), so
 * sticky positioning, scroll-linked animation, find-in-page and the
 * scrollbar keep working. Touch devices keep native momentum scrolling;
 * reduced-motion users keep native scrolling entirely.
 */

let lenis: Lenis | null = null;

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

    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      // Pauses itself while the page is scroll-locked (e.g. modal dialog).
      autoToggle: true,
      // Lets nested scrollers (menus, code blocks) scroll natively.
      allowNestedScroll: true,
    });

    // Same-page fragment links: cancel the instant jump (and Next's router
    // scroll) in the capture phase, then glide there and update the hash.
    const onClick = (event: MouseEvent) => {
      if (
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

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      lenis?.destroy();
      lenis = null;
    };
  }, [enabled]);

  return null;
}
