import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/* --------------------------------------------------------------------------
   Heading — decouples semantics (`as`) from visual size (`size`), so the
   document outline stays correct whatever the design calls for.
   -------------------------------------------------------------------------- */
const headingVariants = cva("text-fg", {
  variants: {
    size: {
      "display-2xl": "font-display text-display-2xl",
      "display-xl": "font-display text-display-xl",
      "display-lg": "font-display text-display-lg",
      "heading-lg": "text-heading-lg",
      "heading-md": "text-heading-md",
      "heading-sm": "text-heading-sm",
    },
  },
  defaultVariants: { size: "heading-lg" },
});

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "p";

type HeadingProps = ComponentProps<"h2"> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingLevel;
  };

export function Heading({
  as: Tag = "h2",
  size,
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn(headingVariants({ size }), className)} {...props} />
  );
}

/* --------------------------------------------------------------------------
   Text — body copy. Muted by default: primary white is reserved for
   headings and key values so hierarchy comes from colour as well as size.
   -------------------------------------------------------------------------- */
const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-body-lg",
      md: "text-body",
      sm: "text-body-sm",
    },
    tone: {
      default: "text-fg",
      muted: "text-fg-muted",
      subtle: "text-fg-subtle",
    },
  },
  defaultVariants: { size: "md", tone: "muted" },
});

type TextProps = ComponentProps<"p"> &
  VariantProps<typeof textVariants> & {
    as?: "p" | "span" | "div";
  };

export function Text({
  as: Tag = "p",
  size,
  tone,
  className,
  ...props
}: TextProps) {
  return (
    <Tag className={cn(textVariants({ size, tone }), className)} {...props} />
  );
}

/* --------------------------------------------------------------------------
   Eyebrow — the HUD index label that precedes a heading: "01 —— Experience".
   -------------------------------------------------------------------------- */
type EyebrowProps = {
  index?: string;
  children: ReactNode;
  as?: "p" | "span" | "div";
  className?: string;
};

export function Eyebrow({
  index,
  children,
  as: Tag = "p",
  className,
}: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "flex items-center gap-3 type-label text-fg-subtle",
        className,
      )}
    >
      {index ? <span className="text-accent tabular-nums">{index}</span> : null}
      <span
        aria-hidden="true"
        className="h-px w-8 bg-line-strong"
        data-decorative
      />
      <span>{children}</span>
    </Tag>
  );
}
