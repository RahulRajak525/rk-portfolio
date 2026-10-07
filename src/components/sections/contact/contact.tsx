import type { ComponentType, SVGProps } from "react";
import { person } from "@/content/site";
import { getSection } from "@/content/sections";
import { Section } from "@/components/ui/section";
import { Panel } from "@/components/ui/panel";
import { ButtonLink } from "@/components/ui/button";
import { Badge, StatusDot } from "@/components/ui/badge";
import { Eyebrow, Text } from "@/components/ui/typography";
import {
  DownloadIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
} from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import { CopyButton } from "./copy-button";

const section = getSection("contact");

type Channel = {
  label: string;
  value: string;
  href?: string;
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
              value: social.href.replace(/^https?:\/\/(www\.)?/, ""),
              href: social.href,
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
            Let&apos;s build the{" "}
            <span className="text-gradient">next interface.</span>
          </h2>
          <Text size="lg" className="mt-6 max-w-xl">
            {section.description} I&apos;m based in Ghaziabad, India, and
            currently work remotely.
          </Text>

          {person.email ? (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href={`mailto:${person.email}`} external size="lg">
                <MailIcon />
                Send an email
              </ButtonLink>
              <CopyButton value={person.email} label="Copy address" />
              {person.resumeUrl ? (
                <ButtonLink
                  href={person.resumeUrl}
                  external
                  variant="ghost"
                  size="lg"
                  download
                >
                  <DownloadIcon />
                  Résumé
                </ButtonLink>
              ) : null}
            </div>
          ) : null}

          <ul className="mt-14 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const body = (
                <>
                  <span className="flex items-center gap-2 type-label text-fg-faint">
                    <Icon className="size-4" />
                    {channel.label}
                  </span>
                  <span className="mt-2 block text-body break-all text-fg">
                    {channel.value}
                  </span>
                </>
              );
              return (
                <li key={channel.label} className="bg-canvas/85">
                  {channel.href ? (
                    <a
                      href={channel.href}
                      {...(channel.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="block p-5 transition-colors hover:bg-white/3 md:p-6"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="p-5 md:p-6">{body}</div>
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
