import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know the custom design tokens; otherwise it cannot tell
 * that `text-body-sm` (size) and `text-fg-muted` (colour) are different
 * groups, or that `px-gutter` conflicts with `px-4`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display-2xl",
        "display-xl",
        "display-lg",
        "heading-lg",
        "heading-md",
        "heading-sm",
        "body-lg",
        "body",
        "body-sm",
        "label",
        "micro",
      ],
      spacing: ["gutter", "grid", "section", "header"],
      container: ["narrow", "content", "wide"],
      shadow: ["panel", "lift", "glow", "glow-plasma"],
      ease: ["out-expo", "out-quart", "in-out-quart", "standard"],
      animate: ["pulse-ring", "scroll-cue", "sheen", "dash-flow"],
      font: ["display"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
