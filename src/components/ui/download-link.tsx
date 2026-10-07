import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { DownloadIcon } from "./icons";

/**
 * A file download as a pill: an ion icon well, the label and the file type.
 * It ranks below `secondary` in the action hierarchy but carries its own
 * affordance — on hover or keyboard focus the well lights up and the arrow
 * drops into the tray (effects.css), so it reads as "download" before the
 * click does.
 *
 * - sm — borderless and compact, for dense UI (header).
 * - lg — outlined, with a file-type tag; sits beside `lg` buttons.
 */
const downloadLinkVariants = cva(
  [
    "group/download relative isolate inline-flex shrink-0 items-center rounded-full",
    "font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,translate,transform]",
    "duration-(--dur-fast) ease-out-quart active:translate-y-px",
  ],
  {
    variants: {
      size: {
        sm: "h-9 gap-2 pr-3.5 pl-1 text-body-sm text-fg-muted hover:bg-white/5 hover:text-fg",
        lg: [
          "h-13 gap-3 border border-line-strong bg-canvas/40 pr-5 pl-1.5 text-body text-fg",
          "hover:border-line-accent hover:bg-surface",
        ],
      },
    },
    defaultVariants: { size: "lg" },
  },
);

const wellVariants = cva(
  [
    "grid shrink-0 place-items-center overflow-hidden rounded-full",
    "bg-accent/10 text-accent ring-1 ring-line-accent ring-inset",
    "transition-[background-color,color,box-shadow] duration-(--dur-base) ease-out-quart",
    "group-hover/download:bg-accent group-hover/download:text-on-accent",
    "group-hover/download:shadow-[0_0_24px_-4px_oklch(0.81_0.14_206/0.7)]",
  ],
  {
    variants: {
      size: {
        sm: "size-7 [&_svg]:size-3.5",
        lg: "size-10 [&_svg]:size-4.5",
      },
    },
    defaultVariants: { size: "lg" },
  },
);

export type DownloadLinkProps = Omit<ComponentProps<"a">, "href" | "download"> &
  VariantProps<typeof downloadLinkVariants> & {
    href: string;
    /** Drifts toward the pointer; the custom cursor wraps it (fine pointers). */
    magnetic?: boolean;
  };

/** "pdf" from "/file.pdf?v=2" — shown as the file-type tag. */
function fileType(href: string) {
  return /\.([a-z0-9]+)(?:[?#]|$)/i.exec(href)?.[1]?.toUpperCase();
}

export function DownloadLink({
  href,
  size,
  magnetic,
  className,
  children,
  ...props
}: DownloadLinkProps) {
  const type = (size ?? "lg") === "lg" ? fileType(href) : undefined;

  return (
    <a
      href={href}
      download
      data-download=""
      data-magnetic={magnetic || undefined}
      className={cn(downloadLinkVariants({ size }), className)}
      {...props}
    >
      <span aria-hidden="true" className={wellVariants({ size })}>
        <DownloadIcon />
      </span>
      <span>
        <span className="sr-only">Download </span>
        {children}
      </span>
      {type ? (
        <>
          <span aria-hidden="true" className="h-4 w-px bg-line-strong" />
          <span className="type-label text-fg-faint transition-colors duration-(--dur-base) group-hover/download:text-accent">
            <span className="sr-only">(</span>
            {type}
            <span className="sr-only">)</span>
          </span>
        </>
      ) : null}
    </a>
  );
}
