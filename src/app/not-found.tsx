import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="flex min-h-svh items-center"
    >
      <Container>
        <Eyebrow index="404">Signal lost</Eyebrow>
        <Heading
          as="h1"
          id="not-found-title"
          size="display-xl"
          className="mt-6"
        >
          Nothing renders <span className="text-gradient">here.</span>
        </Heading>
        <Text size="lg" className="mt-6 max-w-md">
          The page you requested does not exist or has moved.
        </Text>
        <ButtonLink href="/" size="lg" className="mt-10">
          Back to home
          <ArrowRightIcon />
        </ButtonLink>
      </Container>
    </section>
  );
}
