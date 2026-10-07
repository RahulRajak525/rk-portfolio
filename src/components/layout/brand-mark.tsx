import { cn } from "@/lib/cn";

/**
 * The mark is a flat projection of the 3D "Interface Core": the hexagonal
 * silhouette of the icosahedral shell, the inner lattice triangle and the
 * nucleus. Same concept at 16px and at full-screen 3D.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <path
        d="M16 3 27.26 9.5v13L16 29 4.74 22.5v-13L16 3Z"
        stroke="currentColor"
        strokeOpacity={0.55}
        strokeWidth={1.25}
        strokeLinejoin="round"
      />
      <path
        d="M16 23 9.94 12.5h12.12L16 23Z"
        className="stroke-accent"
        strokeWidth={1.25}
        strokeLinejoin="round"
      />
      <path
        d="M9.94 12.5 16 3M9.94 12.5 4.74 9.5M9.94 12.5 4.74 22.5M22.06 12.5 16 3M22.06 12.5 27.26 9.5M22.06 12.5 27.26 22.5M16 23 4.74 22.5M16 23v6M16 23l11.26-.5"
        stroke="currentColor"
        strokeOpacity={0.3}
        strokeWidth={1}
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2" className="fill-accent" />
    </svg>
  );
}
