import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "./container";
import { Eyebrow, Heading, Text } from "./typography";

type SectionProps = ComponentProps<"section"> & {
  id: string;
  /** Rendered inside a Container. Pass `bare` to opt out. */
  bare?: boolean;
};

/**
 * Page section. Owns vertical rhythm (py-section) and labels itself with its
 * heading for assistive tech (aria-labelledby → `${id}-title`).
 */
export function Section({
  id,
  bare = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("relative py-section", className)}
      {...props}
    >
      {bare ? children : <Container>{children}</Container>}
    </section>
  );
}

type SectionHeaderProps = {
  /** Section id — the heading receives `${id}-title`. */
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

/** Index + eyebrow + display title, with an optional lede aligned right. */
export function SectionHeader({
  id,
  index,
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-grid",
        className,
      )}
    >
      <Reveal className="lg:col-span-7">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <Heading as="h2" id={`${id}-title`} size="display-lg" className="mt-5">
          {title}
        </Heading>
      </Reveal>
      {description ? (
        <Reveal delay={0.1} className="lg:col-span-5 lg:justify-self-end">
          <Text size="lg" className="max-w-md">
            {description}
          </Text>
        </Reveal>
      ) : null}
    </header>
  );
}
