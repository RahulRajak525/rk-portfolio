import { useId } from "react";
import { cn } from "@/lib/cn";

/** The R monogram, centred on 16,16 — strokes, so it needs no font. */
const R =
  "M13.75 19.67v-7.34h2.33a1.835 1.835 0 0 1 0 3.67h-2.33M15.75 16l2.5 3.67";

/**
 * The mark is a flat projection of the 3D "Interface Core": the hexagonal
 * silhouette of the icosahedral shell and the inner lattice triangle, with
 * the R monogram (Rahul) as its nucleus. Same concept at 16px and at
 * full-screen 3D.
 *
 * `spin` turns the core while the R stays upright; a mask keeps a clear gap
 * around the letter so the lattice passes behind it, never through it.
 */
export function BrandMark({
  className,
  spin = false,
}: {
  className?: string;
  spin?: boolean;
}) {
  const cut = `${useId()}-cut`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <mask
        id={cut}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="32"
        height="32"
      >
        <rect width="32" height="32" fill="white" />
        <path
          d={R}
          stroke="black"
          strokeWidth={3.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>

      <g mask={`url(#${cut})`}>
        <g
          className={cn(spin && "origin-center motion-safe:animate-mark-spin")}
        >
          <path
            d="M16 3 27.26 9.5v13L16 29 4.74 22.5v-13L16 3Z"
            className="stroke-accent"
            strokeOpacity={0.7}
            strokeWidth={1.25}
            strokeLinejoin="round"
          />
          <path
            d="M16 25.1 8.12 11.45h15.76L16 25.1Z"
            stroke="currentColor"
            strokeOpacity={0.55}
            strokeWidth={1.25}
            strokeLinejoin="round"
          />
          <path
            d="M8.12 11.45 16 3M8.12 11.45 4.74 9.5M8.12 11.45 4.74 22.5M23.88 11.45 16 3M23.88 11.45 27.26 9.5M23.88 11.45 27.26 22.5M16 25.1 4.74 22.5M16 25.1V29M16 25.1l11.26-2.6"
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1}
            strokeLinecap="round"
          />
        </g>
      </g>

      <path
        d={R}
        className="stroke-accent"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
