import Link from "next/link";
import { cacheLife } from "next/cache";
import { person } from "@/content/site";
import { sectionHref, sections } from "@/content/sections";
import { Container } from "@/components/ui/container";
import { Rule } from "@/components/ui/rule";
import { Text } from "@/components/ui/typography";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";
import { BrandMark } from "./brand-mark";

/**
 * Cache Components treats `new Date()` as non-deterministic. Capturing it in a
 * cached scope keeps the footer part of the static shell; it refreshes with
 * each deploy (or the `max` profile's revalidation window).
 */
async function getBuildYear() {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  x: null,
  website: null,
} as const;

export async function SiteFooter() {
  const year = await getBuildYear();
  const hasLinks = person.socials.length > 0 || person.email !== null;

  return (
    <footer className="relative border-t border-line">
      <Container size="wide" className="py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label={`${person.name}, home`}
            >
              <BrandMark className="size-8 text-fg" />
              <span className="flex flex-col leading-none">
                <span className="text-body font-semibold tracking-tight text-fg">
                  {person.name}
                </span>
                <span className="mt-1.5 type-micro text-fg-subtle">
                  {person.role}
                </span>
              </span>
            </Link>
            <Text size="sm" className="mt-6 max-w-sm">
              {person.tagline}
            </Text>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 lg:col-start-8">
            <p className="type-label text-fg-faint">Index</p>
            <ul className="mt-5 space-y-3">
              {sections.map((section) => (
                <li key={section.id}>
                  <Link
                    href={sectionHref(section.id)}
                    className="group/link inline-flex items-baseline gap-3 text-body-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    <span className="type-label text-fg-faint tabular-nums group-hover/link:text-accent">
                      {section.index}
                    </span>
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {hasLinks ? (
            <div className="md:col-span-3 lg:col-span-2">
              <p className="type-label text-fg-faint">Elsewhere</p>
              <ul className="mt-5 space-y-3">
                {person.email ? (
                  <li>
                    <a
                      href={`mailto:${person.email}`}
                      className="inline-flex items-center gap-2.5 text-body-sm text-fg-muted transition-colors hover:text-fg"
                    >
                      <MailIcon className="size-4" />
                      Email
                    </a>
                  </li>
                ) : null}
                {person.socials.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <li key={social.href}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 text-body-sm text-fg-muted transition-colors hover:text-fg"
                      >
                        {Icon ? <Icon className="size-4" /> : null}
                        {social.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        <Rule className="my-12" />

        <div className="flex flex-col gap-5 type-label text-fg-subtle lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {person.name}
          </p>
          <p>Next.js · React Three Fiber · Motion · Tailwind CSS</p>
          <div className="flex gap-6">
            <Link href="/system" className="transition-colors hover:text-fg">
              Design system
            </Link>
            <a href="#main" className="transition-colors hover:text-fg">
              Back to top ↑
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
