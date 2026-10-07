import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Panel — the system's surface primitive (cards, callouts, HUD modules).
 *
 * - glass     frosted, for content floating over the atmosphere or 3D
 * - solid     opaque, for dense content and long text
 * - outline   structure without weight
 * - blueprint dashed + grid — "planned / not yet populated" states
 *
 * `spotlight` adds the pointer-following light (fine pointers only).
 * `corners` adds HUD brackets — use for at most one focal module per view.
 */
const panelVariants = cva("relative rounded-lg", {
  variants: {
    variant: {
      glass: "border border-line glass shadow-panel",
      solid: "border border-line bg-surface-solid shadow-panel",
      outline: "border border-line",
      blueprint:
        "border border-dashed border-line-strong bg-grid [--grid-color:oklch(0.92_0.02_266/0.045)] [--grid-size:1.5rem]",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6 md:p-8",
      lg: "p-8 md:p-12",
    },
  },
  defaultVariants: { variant: "glass", padding: "md" },
});

type PanelProps = Omit<ComponentProps<"div">, "ref"> &
  VariantProps<typeof panelVariants> & {
    as?: "div" | "article" | "section" | "li" | "aside";
    spotlight?: boolean;
    corners?: boolean;
  };

export function Panel({
  as: Tag = "div",
  variant,
  padding,
  spotlight = false,
  corners = false,
  className,
  children,
  ...props
}: PanelProps) {
  // Element-specific handler types differ only nominally; div props are the contract.
  const Component = Tag as "div";
  return (
    <Component
      className={cn(panelVariants({ variant, padding }), className)}
      data-spotlight={spotlight || undefined}
      {...props}
    >
      {corners ? <HudCorners /> : null}
      {children}
    </Component>
  );
}

/** Corner brackets framing a module, drawn just outside its edge. */
export function HudCorners({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-decorative
      className={cn(
        "pointer-events-none absolute -inset-1.5 hud-corners",
        className,
      )}
    />
  );
}
