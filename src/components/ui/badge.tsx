import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/** Technical tag (stack items, metadata). Sharp corners = data, not action. */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-xs border px-2 py-1 type-label whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-line-strong text-fg-muted",
        accent: "border-ion-400/30 bg-ion-400/10 text-ion-300",
        plasma: "border-plasma-400/30 bg-plasma-400/10 text-plasma-300",
        positive: "border-signal-400/30 bg-signal-400/10 text-signal-400",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

/* -------------------------------------------------------------------------- */

const dotTones = {
  accent: "text-accent",
  plasma: "text-accent-2",
  positive: "text-positive",
  neutral: "text-fg-subtle",
} as const;

type StatusDotProps = {
  tone?: keyof typeof dotTones;
  /** Ambient pulse — only for genuinely live states (e.g. availability). */
  pulse?: boolean;
  className?: string;
};

/** Status indicator. Decorative: always pair it with a text label. */
export function StatusDot({
  tone = "positive",
  pulse = false,
  className,
}: StatusDotProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-2 shrink-0",
        dotTones[tone],
        className,
      )}
    >
      {pulse ? (
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-current motion-reduce:hidden" />
      ) : null}
      <span className="relative size-2 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
    </span>
  );
}
