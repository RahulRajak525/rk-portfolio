"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { pointer, trackPointer } from "@/lib/pointer";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Custom cursor — fine pointers only. Off for touch, reduced motion and
 * forced colors (the native cursor is restored).
 *
 * States, chosen by event delegation on whatever is under the pointer:
 * - default  dot + trailing ring
 * - minimal  dot only (hero: the meteor is the trail there)
 * - link     ring expands, accent tint
 * - morph    ring wraps a [data-magnetic] control, which drifts toward the
 *            pointer (CSS reads --magnet-x/y; no React involved)
 * - label    ring becomes a filled disc with a verb: data-cursor="label"
 *            data-cursor-label="Drag"
 * Movement never re-renders React: positions are motion values.
 */

const ENABLED =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)";
const INTERACTIVE =
  "a[href], button, [role='button'], [data-cursor], label[for], summary";
const SIZE = { default: 34, link: 56, label: 88 } as const;
const MAGNET = 0.22;
const MAGNET_MAX = 10;

type Variant = "hidden" | "default" | "minimal" | "link" | "morph" | "label";

const clamp = (value: number, max: number) =>
  Math.max(-max, Math.min(max, value));

export function Cursor() {
  const enabled = useMediaQuery(ENABLED);
  return enabled ? <CursorLayer /> : null;
}

function CursorLayer() {
  const [variant, setVariant] = useState<Variant>("hidden");
  const [label, setLabel] = useState("");
  const ring = useRef<HTMLDivElement>(null);
  const current = useRef<{ variant: Variant; label: string }>({
    variant: "hidden",
    label: "",
  });
  const magnet = useRef<{ el: HTMLElement; radius: number } | null>(null);

  const tx = useMotionValue(-100);
  const ty = useMotionValue(-100);
  const w = useMotionValue<number>(SIZE.default);
  const h = useMotionValue<number>(SIZE.default);
  const r = useMotionValue<number>(SIZE.default / 2);
  const follow = { stiffness: 520, damping: 40, mass: 0.55 };
  const shape = { stiffness: 380, damping: 32, mass: 0.7 };
  const x = useSpring(tx, follow);
  const y = useSpring(ty, follow);
  const width = useSpring(w, shape);
  const height = useSpring(h, shape);
  const radius = useSpring(r, shape);

  useEffect(() => {
    trackPointer();
    const root = document.documentElement;
    root.classList.add("cursor-custom");

    const set = (next: Variant, nextLabel = "") => {
      const c = current.current;
      if (c.variant === next && c.label === nextLabel) return;
      c.variant = next;
      c.label = nextLabel;
      setVariant(next);
      setLabel(nextLabel);
      if (next !== "morph") {
        const size =
          next === "label"
            ? SIZE.label
            : next === "link"
              ? SIZE.link
              : SIZE.default;
        w.set(size);
        h.set(size);
        r.set(size / 2);
      }
    };

    const release = () => {
      const target = magnet.current;
      if (!target) return;
      target.el.style.removeProperty("--magnet-x");
      target.el.style.removeProperty("--magnet-y");
      magnet.current = null;
    };

    /** Ring follows the pointer — or wraps (and pulls) a magnetic control. */
    const update = () => {
      const px = pointer.x.get();
      const py = pointer.y.get();
      const target = magnet.current;
      if (target && current.current.variant === "morph") {
        if (!target.el.isConnected) {
          release();
          set("default");
        } else {
          const rect = target.el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          target.el.style.setProperty(
            "--magnet-x",
            `${clamp((px - cx) * MAGNET, MAGNET_MAX)}px`,
          );
          target.el.style.setProperty(
            "--magnet-y",
            `${clamp((py - cy) * MAGNET, MAGNET_MAX)}px`,
          );
          tx.set(cx + (px - cx) * 0.08);
          ty.set(cy + (py - cy) * 0.08);
          w.set(rect.width + 12);
          h.set(rect.height + 12);
          r.set(target.radius + 6);
          return;
        }
      }
      tx.set(px);
      ty.set(py);
    };

    const onOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !(event.target instanceof Element))
        return;
      const el = event.target.closest<HTMLElement>(INTERACTIVE);
      if (magnet.current && magnet.current.el !== el) release();

      if (!el) {
        set(
          event.target.closest("[data-cursor-zone='minimal']")
            ? "minimal"
            : "default",
        );
      } else if (el.dataset.cursor === "label") {
        set("label", el.dataset.cursorLabel ?? "");
      } else if (el.hasAttribute("data-magnetic")) {
        if (magnet.current?.el !== el) {
          magnet.current = {
            el,
            radius: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 8,
          };
        }
        set("morph");
      } else {
        set("link");
      }
      update();
    };

    const onDown = () => ring.current?.setAttribute("data-pressed", "true");
    const onUp = () => ring.current?.removeAttribute("data-pressed");

    const offMove = pointer.lastMove.on("change", () => {
      if (current.current.variant === "hidden") set("default");
      update();
    });
    const offInside = pointer.inside.on("change", (inside) => {
      if (!inside) {
        release();
        set("hidden");
      }
    });

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      offMove();
      offInside();
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", update);
      release();
      root.classList.remove("cursor-custom");
    };
  }, [tx, ty, w, h, r]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-(--z-cursor)"
    >
      <m.div
        ref={ring}
        data-variant={variant}
        className="cursor-ring"
        style={{ x, y, width, height, borderRadius: radius }}
      >
        <span className="cursor-label">{label}</span>
      </m.div>
      <m.div
        data-variant={variant}
        className="cursor-dot"
        style={{ x: pointer.x, y: pointer.y }}
      />
    </div>
  );
}
