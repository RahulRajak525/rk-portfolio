import Link from "next/link";
import type { Route } from "next";
import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Buttons are pills: the one soft shape in an otherwise angular, HUD-like
 * system, so actions are recognisable at a glance.
 *
 * - primary   — the single most important action in a view (max one).
 * - secondary — glass; supporting actions.
 * - ghost     — low emphasis, toolbars and dense UI.
 */
export const buttonVariants = cva(
  [
    "group/button relative isolate inline-flex shrink-0 items-center justify-center gap-2",
    "rounded-full font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,box-shadow,translate,transform]",
    "duration-(--dur-fast) ease-out-quart",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-accent text-on-accent shadow-glow",
          "hover:bg-accent-strong hover:shadow-[0_0_0_1px_var(--color-ion-300),0_12px_48px_-8px_oklch(0.81_0.14_206/0.7)]",
        ],
        secondary: [
          "border border-line-strong glass text-fg",
          "hover:border-line-accent hover:bg-surface-strong",
        ],
        ghost: "text-fg-muted hover:bg-white/5 hover:text-fg",
      },
      size: {
        sm: "h-9 px-4 text-body-sm",
        md: "h-11 px-5 text-body-sm",
        lg: "h-13 px-7 text-body",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants> & {
  /** Drifts toward the pointer; the custom cursor wraps it (fine pointers). */
  magnetic?: boolean;
};

/** Light sweep across the primary button on hover — affordance, not decoration. */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
    >
      <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,oklch(1_0_0/0.55)_50%,transparent_65%)] bg-size-[250%_100%] bg-position-[160%_0] motion-reduce:hidden pointer-fine:group-hover/button:animate-sheen" />
    </span>
  );
}

function Content({
  variant,
  children,
}: {
  variant: ButtonVariantProps["variant"];
  children: ReactNode;
}) {
  return (
    <>
      {(variant ?? "primary") === "primary" && <Sheen />}
      {children}
    </>
  );
}

export type ButtonProps = ComponentProps<"button"> & ButtonVariantProps;

export function Button({
  variant,
  size,
  magnetic,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-magnetic={magnetic || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <Content variant={variant}>{children}</Content>
    </button>
  );
}

type InternalLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: Route;
  external?: false;
};

type ExternalLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  /** Opens in a new tab with safe rel attributes (not for mailto:). */
  external: true;
};

export type ButtonLinkProps = (InternalLinkProps | ExternalLinkProps) &
  ButtonVariantProps;

/** A link styled as a button. Internal routes are type-checked. */
export function ButtonLink(props: ButtonLinkProps) {
  if (props.external) {
    const {
      variant,
      size,
      magnetic,
      className,
      children,
      external: _external,
      href,
      ...rest
    } = props;
    const isWeb = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        data-magnetic={magnetic || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        <Content variant={variant}>{children}</Content>
      </a>
    );
  }

  const {
    variant,
    size,
    magnetic,
    className,
    children,
    external: _external,
    ...rest
  } = props;
  return (
    <Link
      data-magnetic={magnetic || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      <Content variant={variant}>{children}</Content>
    </Link>
  );
}
