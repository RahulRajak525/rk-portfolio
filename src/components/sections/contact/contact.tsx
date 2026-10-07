import type { ComponentType, SVGProps } from "react";
import { person } from "@/content/site";
import { getSection } from "@/content/sections";
import { Section } from "@/components/ui/section";
import { Panel } from "@/components/ui/panel";
import { ButtonLink } from "@/components/ui/button";
import { DownloadLink } from "@/components/ui/download-link";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Eyebrow, Text } from "@/components/ui/typography";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
} from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { CopyButton } from "./copy-button";

const section = getSection("contact");

type Channel = {
  label: string;
  value: string;
  href?: string;
  /** Custom cursor state on hover (see Cursor). */
  cursor?: "hand";
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const socialIcons = { github: GitHubIcon, linkedin: LinkedInIcon } as const;

export function Contact() {
  const channels: Channel[] = [
    ...(person.email
      ? [
          {
            label: "Email",
            value: person.email,
            href: `mailto:${person.email}`,
            icon: MailIcon,
          },
        ]
      : []),
    ...(person.phone
      ? [
          {
            label: "Phone",
            value: person.phone,
            href: `tel:${person.phone.replace(/\s/g, "")}`,
            icon: PhoneIcon,
          },
        ]
      : []),
    {
      label: "Location",
      value: [person.location, person.workMode].filter(Boolean).join(" · "),
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(person.location)}`,
      icon: PinIcon,
    },
    ...person.socials.flatMap((social) => {
      const icon =
        social.platform in socialIcons
          ? socialIcons[social.platform as keyof typeof socialIcons]
          : null;
      return icon
        ? [
            {
              label: social.label,
              value: social.href
                .replace(/^https?:\/\/(www\.)?/, "")
                .replace(/\/$/, ""),
              href: social.href,
              cursor: "hand" as const,
              icon,
            },
          ]
        : [];
    }),
  ];

  return (
    <Section id={section.id} className="pb-section">
      <Reveal>
        <Panel
          variant="glass"
          padding="lg"
          corners
          className="relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            data-decorative
            className="pointer-events-none absolute -top-1/2 -right-1/4 -z-10 size-[42rem] rounded-full bg-[radial-gradient(closest-side,oklch(0.81_0.14_206/0.16),transparent)]"
          />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Eyebrow index={section.index}>{section.label}</Eyebrow>
            {person.availability ? (
              <Badge tone="positive">
                <StatusDot pulse />
                {person.availability}
              </Badge>
            ) : null}
          </div>
          <h2
            id={`${section.id}-title`}
            className="mt-6 max-w-4xl font-display text-display-xl text-fg"
          >
            <SplitReveal text="Let’s build the" />
            <SplitReveal
              text="next interface."
              wordClassName="text-gradient"
              delay={0.12}
            />
          </h2>
          <Text size="lg" className="mt-6 max-w-xl">
            {section.description} I&apos;m based in Ghaziabad, India, and
            currently work remotely.
          </Text>

          {person.email ? (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink
                href={`mailto:${person.email}`}
                external
                magnetic
                size="lg"
              >
                <MailIcon />
                Send an email
              </ButtonLink>
              <CopyButton value={person.email} label="Copy address" />
              {person.resumeUrl ? (
                <DownloadLink href={person.resumeUrl} magnetic>
                  Résumé
                </DownloadLink>
              ) : null}
            </div>
          ) : null}

          {/* Two columns keep the four channels a uniform 2×2; an odd last
              channel spans the row instead of leaving an empty cell. */}
          <ul className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const body = (
                <>
                  <span className="flex items-center gap-2 type-label text-fg-faint">
                    <Icon className="size-4" />
                    {channel.label}
                  </span>
                  <span className="mt-2 block text-body wrap-anywhere text-fg">
                    {channel.value}
                  </span>
                </>
              );
              return (
                <li
                  key={channel.label}
                  className="bg-canvas/85 sm:odd:last:col-span-2"
                >
                  {channel.href ? (
                    <a
                      href={channel.href}
                      {...(channel.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      data-cursor={channel.cursor}
                      className="block h-full p-5 transition-colors hover:bg-white/3 md:p-6"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="h-full p-5 md:p-6">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      </Reveal>
    </Section>
  );
}
