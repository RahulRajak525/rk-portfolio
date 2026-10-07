import { createRandom } from "@/lib/random";
import { cn } from "@/lib/cn";
import { palette } from "./config";

/**
 * Static 2D projection of the Interface Core. Server-rendered, so the hero
 * has its visual identity on first paint; the WebGL scene cross-fades over
 * it when ready. Also the permanent fallback (no WebGL, Save-Data).
 * Coordinates are in scene units (viewBox ±3).
 */

const dots = (() => {
  const random = createRandom(7);
  return Array.from({ length: 140 }, () => {
    const r = 1.9 + Math.pow(random(), 1.4) * 1.1;
    const a = random() * Math.PI * 2;
    return {
      cx: +(Math.cos(a) * r).toFixed(3),
      cy: +(Math.sin(a) * r * 0.42 + (random() - 0.5) * 0.25).toFixed(3),
      r: +(0.008 + random() * 0.02).toFixed(3),
      o: +(0.25 + random() * 0.6).toFixed(2),
    };
  });
})();

const hex = (r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(Math.cos(a) * r).toFixed(3)},${(Math.sin(a) * r).toFixed(3)}`;
  }).join(" ");

export function CorePoster({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-3 -3 6 6"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "pointer-events-none absolute aspect-square -translate-1/2",
        className,
      )}
    >
      <defs>
        <radialGradient id="core-glow">
          <stop offset="0" stopColor={palette.ion400} stopOpacity="0.5" />
          <stop offset="1" stopColor={palette.ion400} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="core-nucleus">
          <stop offset="0" stopColor={palette.white} />
          <stop offset="0.55" stopColor={palette.ion300} />
          <stop offset="1" stopColor={palette.ion600} />
        </radialGradient>
      </defs>

      <circle r="1.9" fill="url(#core-glow)" />

      <g fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <ellipse
          rx="2.05"
          ry="0.62"
          transform="rotate(-12)"
          stroke={palette.ion400}
          strokeOpacity="0.55"
          vectorEffect="non-scaling-stroke"
        />
        <ellipse
          rx="2.4"
          ry="0.36"
          transform="rotate(18)"
          stroke={palette.plasma400}
          strokeOpacity="0.45"
          strokeDasharray="2 4"
          vectorEffect="non-scaling-stroke"
        />
        <ellipse
          rx="2.75"
          ry="1.25"
          transform="rotate(-34)"
          stroke={palette.ion300}
          strokeOpacity="0.25"
          strokeDasharray="1 5"
          vectorEffect="non-scaling-stroke"
        />
        <polygon
          points={hex(1.55)}
          stroke={palette.plasma300}
          strokeOpacity="0.35"
          vectorEffect="non-scaling-stroke"
        />
        <polygon
          points={hex(1)}
          stroke={palette.ion300}
          strokeOpacity="0.6"
          vectorEffect="non-scaling-stroke"
        />
        <polygon
          points="0,0.62 -0.54,-0.31 0.54,-0.31"
          stroke={palette.ion300}
          strokeOpacity="0.8"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      <g fill={palette.ion200}>
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} opacity={dot.o} />
        ))}
      </g>

      <circle r="0.36" fill="url(#core-nucleus)" />
    </svg>
  );
}
