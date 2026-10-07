import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Horizontal layout boundary. All page content sits inside a Container so
 * gutters and max-widths stay consistent.
 *
 * - narrow  44rem — long-form reading (≈ 70ch)
 * - content 80rem — default section width
 * - wide    92rem — header, hero, full-bleed compositions
 */
const containerVariants = cva("mx-auto w-full px-gutter", {
  variants: {
    size: {
      narrow: "max-w-narrow",
      content: "max-w-content",
      wide: "max-w-wide",
    },
  },
  defaultVariants: { size: "content" },
});

type ContainerProps = ComponentProps<"div"> &
  VariantProps<typeof containerVariants>;

export function Container({ size, className, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size }), className)} {...props} />
  );
}
