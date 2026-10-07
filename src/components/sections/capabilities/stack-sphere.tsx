"use client";

import { useEffect, useLayoutEffect, useRef, type PointerEvent } from "react";
import { useReducedMotion, useScroll } from "motion/react";
import { skillGroups } from "@/content/skills";
import type { EvidenceId } from "@/content/types";

/**
 * STACK SPHERE — the technology stack as an object you can hold.
 * Each domain is a hub on a sphere; its skills cluster around it.
 *
 * Reacts to: cursor (tilt + nearest-skill highlight), drag (spin with
 * inertia), scroll (turns as the section passes), selection (a hovered
 * domain card rotates to the front; the evidence filter lights skills).
 *
 * Rendering: plain SVG updated from one rAF loop that only runs while the
 * sphere is on screen — no second WebGL context, crisp text, ~200 attribute
 * writes per frame. Decorative mirror of the accessible cards.
 */

type Filter = EvidenceId | "all";
type Vec = { x: number; y: number; z: number };

const RADIUS = 205;
const FOCAL = 3.2;
const TAU = Math.PI * 2;
const AUTO_SPIN = 0.16; // rad/s
const BASE_PITCH = -0.32;
const RING_POINTS = 64;

const shortLabels: Record<string, string> = {
  languages: "Languages",
  frameworks: "Frameworks",
  ui: "UI",
  state: "State",
  backend: "Backend",
  integrations: "Integrations",
  delivery: "Delivery",
  ai: "AI",
};

/* ---- Geometry (pure, computed once) ------------------------------------ */

const normalize = (v: Vec): Vec => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};
const cross = (a: Vec, b: Vec): Vec => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

/** Evenly spread directions (Fibonacci sphere). */
function fibonacci(n: number, i: number): Vec {
  const y = 1 - ((i + 0.5) / n) * 2;
  const r = Math.sqrt(1 - y * y);
  const phi = i * Math.PI * (3 - Math.sqrt(5));
  return { x: Math.cos(phi) * r, y, z: Math.sin(phi) * r };
}

/** A direction at angular distance `spread` from `c`, at azimuth `az` around it. */
function around(c: Vec, spread: number, az: number): Vec {
  const ref = Math.abs(c.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
  const u = normalize(cross(c, ref));
  const v = cross(c, u);
  const s = Math.sin(spread);
  const k = Math.cos(spread);
  return normalize({
    x: c.x * k + (u.x * Math.cos(az) + v.x * Math.sin(az)) * s,
    y: c.y * k + (u.y * Math.cos(az) + v.y * Math.sin(az)) * s,
    z: c.z * k + (u.z * Math.cos(az) + v.z * Math.sin(az)) * s,
  });
}

const hubs = skillGroups.map((group, i) => ({
  group,
  pos: fibonacci(skillGroups.length, i),
}));
const nodes = hubs.flatMap((hub, gi) =>
  hub.group.skills.map((skill, si) => ({
    skill,
    groupId: hub.group.id,
    gi,
    pos: around(hub.pos, 0.44, (si / hub.group.skills.length) * TAU + gi),
  })),
);

function rotate(p: Vec, yaw: number, pitch: number): Vec {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return { x: x1, y: p.y * cp - z1 * sp, z: p.y * sp + z1 * cp };
}

function project(p: Vec) {
  const s = FOCAL / (FOCAL - p.z);
  return { x: p.x * RADIUS * s, y: -p.y * RADIUS * s, s, depth: (p.z + 1) / 2 };
}

/** Yaw/pitch that bring direction `c` to face the viewer. */
function facing(c: Vec) {
  return {
    yaw: -Math.atan2(c.x, c.z),
    pitch: Math.atan2(c.y, Math.hypot(c.x, c.z)),
  };
}

const damp = (a: number, b: number, lambda: number, dt: number) =>
  a + (b - a) * (1 - Math.exp(-lambda * dt));
const dampAngle = (a: number, b: number, lambda: number, dt: number) => {
  const delta = ((((b - a) % TAU) + TAU * 1.5) % TAU) - Math.PI;
  return a + delta * (1 - Math.exp(-lambda * dt));
};
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* ---- Component ---------------------------------------------------------- */

type StackSphereProps = {
  filter: Filter;
  focus: string | null;
  /** Called with the domain of the skill nearest the pointer (or null). */
  onHoverGroup: (groupId: string | null) => void;
};

export function StackSphere({ filter, focus, onHoverGroup }: StackSphereProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const nodeLayer = useRef<SVGGElement>(null);
  const nodeEls = useRef<(SVGGElement | null)[]>([]);
  const lineEls = useRef<(SVGLineElement | null)[]>([]);
  const labelEls = useRef<(SVGTextElement | null)[]>([]);
  const hubEls = useRef<(SVGGElement | null)[]>([]);
  const rings = useRef<(SVGPolylineElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wrapper,
    offset: ["start end", "end start"],
  });

  const latest = useRef({ filter, focus, reduced: false, onHoverGroup });
  const sim = useRef({
    yaw: 0.4,
    pitch: BASE_PITCH,
    vyaw: 0,
    tiltX: 0,
    tiltY: 0,
    pointerX: 0,
    pointerY: 0,
    hovering: false,
    dragging: false,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    hoverNode: -1,
    hoverGroup: null as string | null,
    frame: 0,
    screen: new Float32Array(nodes.length * 3), // x, y, depth per node
  });

  // Props → refs (read by the loop) and → data attributes (read by CSS).
  useLayoutEffect(() => {
    latest.current = {
      filter,
      focus,
      reduced: Boolean(reducedMotion),
      onHoverGroup,
    };
    nodes.forEach((node, i) => {
      const el = nodeEls.current[i];
      const label = labelEls.current[i];
      const used = filter !== "all" && node.skill.usedIn.includes(filter);
      const off = filter !== "all" && !used;
      for (const target of [el, label]) {
        if (!target) continue;
        target.dataset.lit = String(used);
        target.dataset.off = String(off);
        target.dataset.focus = String(focus === node.groupId);
      }
    });
    hubs.forEach((hub, i) => {
      const el = hubEls.current[i];
      if (el) el.dataset.focus = String(focus === hub.group.id);
    });
  }, [filter, focus, reducedMotion, onHoverGroup]);

  // The render loop — only while on screen and the tab is visible.
  useEffect(() => {
    const root = svg.current;
    if (!root) return;
    const labelsEnabled = window.matchMedia("(min-width: 64rem)").matches;
    let raf = 0;
    let last = 0;
    let visible = false;

    const step = (dt: number) => {
      const s = sim.current;
      const { focus: focused, reduced } = latest.current;
      const hub = focused
        ? hubs.find((h) => h.group.id === focused)
        : undefined;

      if (s.dragging) {
        // yaw/pitch are driven by the pointer handlers
      } else if (hub) {
        const goal = facing(hub.pos);
        const rate = reduced ? 30 : 5;
        s.yaw = dampAngle(s.yaw, goal.yaw, rate, dt);
        s.pitch = damp(s.pitch, goal.pitch, rate, dt);
        s.vyaw = 0;
      } else {
        s.yaw += ((reduced ? 0 : AUTO_SPIN) + s.vyaw) * dt;
        s.vyaw *= Math.exp(-2.4 * dt);
      }
      const tiltOn = s.hovering && !s.dragging && !reduced;
      s.tiltX = damp(s.tiltX, tiltOn ? s.pointerY * 0.28 : 0, 4, dt);
      s.tiltY = damp(s.tiltY, tiltOn ? s.pointerX * 0.36 : 0, 4, dt);
    };

    const draw = () => {
      const s = sim.current;
      const { reduced } = latest.current;
      const scrollYaw = reduced ? 0 : (scrollYProgress.get() - 0.5) * 1.4;
      const yaw = s.yaw + s.tiltY + scrollYaw;
      const pitch = clamp(s.pitch + s.tiltX, -1.25, 1.25);

      const hubScreen = hubs.map((hub, i) => {
        const p = project(rotate(hub.pos, yaw, pitch));
        const el = hubEls.current[i];
        if (el) {
          el.setAttribute(
            "transform",
            `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`,
          );
          el.style.opacity = (0.15 + 0.85 * Math.pow(p.depth, 1.4)).toFixed(3);
        }
        return p;
      });

      nodes.forEach((node, i) => {
        const p = project(rotate(node.pos, yaw, pitch));
        s.screen[i * 3] = p.x;
        s.screen[i * 3 + 1] = p.y;
        s.screen[i * 3 + 2] = p.depth;

        const depthAlpha = 0.12 + 0.88 * Math.pow(p.depth, 1.6);
        const el = nodeEls.current[i];
        if (el) {
          el.setAttribute(
            "transform",
            `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${(0.55 + 0.65 * p.depth).toFixed(3)})`,
          );
          el.style.opacity = depthAlpha.toFixed(3);
        }

        const h = hubScreen[node.gi];
        const line = lineEls.current[i];
        if (line && h) {
          line.setAttribute("x1", h.x.toFixed(1));
          line.setAttribute("y1", h.y.toFixed(1));
          line.setAttribute("x2", p.x.toFixed(1));
          line.setAttribute("y2", p.y.toFixed(1));
          line.style.opacity = (depthAlpha * 0.6).toFixed(3);
        }

        const label = labelsEnabled ? labelEls.current[i] : null;
        if (label) {
          const focused = latest.current.focus === node.groupId;
          const threshold = latest.current.focus ? (focused ? 0.3 : 2) : 0.66;
          const show =
            i === s.hoverNode ? 1 : clamp((p.depth - threshold) / 0.12, 0, 1);
          label.setAttribute("x", (p.x + 10 * p.s).toFixed(1));
          label.setAttribute("y", (p.y + 4).toFixed(1));
          label.style.opacity = show.toFixed(3);
        }
      });

      // Two great circles give the sphere its volume.
      rings.current.forEach((ring, r) => {
        if (!ring) return;
        let points = "";
        for (let k = 0; k <= RING_POINTS; k++) {
          const a = (k / RING_POINTS) * TAU;
          const v =
            r === 0
              ? { x: Math.cos(a), y: 0, z: Math.sin(a) }
              : { x: 0, y: Math.cos(a), z: Math.sin(a) };
          const p = project(rotate(v, yaw, pitch));
          points += `${p.x.toFixed(1)},${p.y.toFixed(1)} `;
        }
        ring.setAttribute("points", points);
      });

      // Paint order follows depth (every few frames is plenty).
      if (s.frame++ % 6 === 0 && nodeLayer.current) {
        const order = nodes
          .map((_, i) => i)
          .sort((a, b) => s.screen[a * 3 + 2]! - s.screen[b * 3 + 2]!);
        for (const i of order) {
          const el = nodeEls.current[i];
          if (el) nodeLayer.current.appendChild(el);
        }
      }
    };

    const frame = (now: number) => {
      if (!visible || document.hidden) {
        raf = 0;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        start();
      },
      { rootMargin: "120px" },
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", start);
    draw(); // initial pose, even before the loop starts

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, [scrollYProgress]);

  /* ---- Pointer: tilt, nearest-skill hover, drag-to-spin ----------------- */

  const toLocal = (event: PointerEvent<SVGSVGElement>) => {
    const matrix = event.currentTarget.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    return { x: point.x, y: point.y };
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const s = sim.current;
    const local = toLocal(event);
    if (!local) return;

    if (s.dragging) {
      const now = performance.now();
      const dx = event.clientX - s.lastX;
      const dy = event.clientY - s.lastY;
      const dt = Math.max((now - s.lastT) / 1000, 0.008);
      s.yaw += dx * 0.009;
      s.pitch = clamp(s.pitch + dy * 0.006, -1.1, 1.1);
      s.vyaw = (dx * 0.009) / dt;
      s.lastX = event.clientX;
      s.lastY = event.clientY;
      s.lastT = now;
      return;
    }

    if (event.pointerType !== "mouse") return;
    s.hovering = true;
    s.pointerX = clamp(local.x / RADIUS, -1, 1);
    s.pointerY = clamp(local.y / RADIUS, -1, 1);

    // Nearest front-facing skill within reach.
    let best = -1;
    let bestDistance = 22;
    for (let i = 0; i < nodes.length; i++) {
      if (s.screen[i * 3 + 2]! < 0.5) continue;
      const d = Math.hypot(
        s.screen[i * 3]! - local.x,
        s.screen[i * 3 + 1]! - local.y,
      );
      if (d < bestDistance) {
        bestDistance = d;
        best = i;
      }
    }
    if (best !== s.hoverNode) {
      s.hoverNode = best;
      const group = best >= 0 ? (nodes[best]?.groupId ?? null) : null;
      if (group !== s.hoverGroup) {
        s.hoverGroup = group;
        latest.current.onHoverGroup(group);
      }
    }
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    const s = sim.current;
    s.dragging = true;
    s.lastX = event.clientX;
    s.lastY = event.clientY;
    s.lastT = performance.now();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const endDrag = (event: PointerEvent<SVGSVGElement>) => {
    sim.current.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerLeave = () => {
    const s = sim.current;
    s.hovering = false;
    if (s.hoverNode !== -1 || s.hoverGroup !== null) {
      s.hoverNode = -1;
      s.hoverGroup = null;
      latest.current.onHoverGroup(null);
    }
  };

  return (
    <div
      ref={wrapper}
      data-cursor="label"
      data-cursor-label="Drag"
      className="relative"
    >
      <svg
        ref={svg}
        viewBox="-262 -244 524 488"
        aria-hidden="true"
        focusable="false"
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={onPointerLeave}
        className="mx-auto h-auto w-full max-w-[22rem] touch-pan-y select-none lg:max-w-none"
      >
        <defs>
          <radialGradient id="sphere-volume" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="oklch(0.81 0.14 206 / 0.12)" />
            <stop offset="0.7" stopColor="oklch(0.6 0.22 295 / 0.04)" />
            <stop offset="1" stopColor="oklch(0.12 0.014 266 / 0)" />
          </radialGradient>
        </defs>

        <circle
          r={RADIUS * 1.05}
          fill="url(#sphere-volume)"
          className="stroke-line"
        />
        {[0, 1].map((r) => (
          <polyline
            key={r}
            ref={(el) => {
              rings.current[r] = el;
            }}
            className="fill-none stroke-line [stroke-dasharray:2_5]"
          />
        ))}

        <g>
          {nodes.map((node, i) => (
            <line
              key={node.skill.name}
              ref={(el) => {
                lineEls.current[i] = el;
              }}
              className="stroke-line-strong"
            />
          ))}
        </g>

        <g ref={nodeLayer}>
          {nodes.map((node, i) => (
            <g
              key={node.skill.name}
              ref={(el) => {
                nodeEls.current[i] = el;
              }}
              className="group/node"
            >
              <circle
                r={11}
                className="fill-ion-400/0 transition-[fill] duration-500 group-data-[focus=true]/node:fill-ion-400/14 group-data-[lit=true]/node:fill-ion-400/18"
              />
              <circle
                r={4.5}
                className="fill-ink-400 transition-[fill,opacity] duration-500 group-data-[focus=true]/node:fill-ion-200 group-data-[lit=true]/node:fill-accent group-data-[off=true]/node:opacity-25"
              />
            </g>
          ))}
        </g>

        <g>
          {hubs.map((hub, i) => (
            <g
              key={hub.group.id}
              ref={(el) => {
                hubEls.current[i] = el;
              }}
              className="group/hub"
            >
              <circle
                r={7}
                className="fill-canvas stroke-line-strong transition-[stroke] duration-500 group-data-[focus=true]/hub:stroke-accent"
              />
              <text
                y={-14}
                textAnchor="middle"
                fontSize={11}
                letterSpacing={1.4}
                className="fill-fg-subtle font-mono uppercase transition-[fill] duration-500 group-data-[focus=true]/hub:fill-accent"
              >
                {shortLabels[hub.group.id] ?? hub.group.label}
              </text>
            </g>
          ))}
        </g>

        <g className="max-lg:hidden">
          {nodes.map((node, i) => (
            <text
              key={node.skill.name}
              ref={(el) => {
                labelEls.current[i] = el;
              }}
              fontSize={12}
              className="fill-fg-muted transition-[fill] duration-500 data-[focus=true]:fill-fg data-[lit=true]:fill-ion-100 data-[off=true]:fill-fg-faint"
            >
              {node.skill.name}
            </text>
          ))}
        </g>

        <polygon
          points="0,-15 13,-7.5 13,7.5 0,15 -13,7.5 -13,-7.5"
          className="fill-canvas stroke-line-accent"
        />
        <circle r={4.5} className="fill-accent" />
      </svg>
    </div>
  );
}
