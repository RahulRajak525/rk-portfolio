import { cn } from "@/lib/cn";

/**
 * Measured rule — a hairline with ruler ticks. Separates major regions and
 * reinforces the "instrument" language. Purely decorative.
 */
export function Rule({
  className,
  ticks = true,
}: {
  className?: string;
  ticks?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      data-decorative
      className={cn("rule-draw relative h-px bg-line", className)}
    >
      {ticks ? (
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[repeating-linear-gradient(to_right,var(--color-line-strong)_0_1px,transparent_1px_2rem)] mask-r-from-60% mask-l-from-90%" />
      ) : null}
    </div>
  );
}
