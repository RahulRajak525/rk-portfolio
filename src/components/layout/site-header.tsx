import Link from "next/link";
import { person } from "@/content/site";
import { sectionHref } from "@/content/sections";
import { ButtonLink } from "@/components/ui/button";
import { BrandMark } from "./brand-mark";
import { DesktopNav } from "./desktop-nav";
import { HeaderShell } from "./header-shell";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <HeaderShell>
      <Link
        href="/"
        className="group/brand -m-2 flex items-center gap-3 rounded-full p-2"
        aria-label={`${person.name}, home`}
      >
        <BrandMark className="size-7 text-fg transition-transform duration-(--dur-slow) ease-out-expo group-hover/brand:rotate-60" />
        <span className="hidden flex-col leading-none sm:flex">
          <span className="text-body-sm font-semibold tracking-tight text-fg">
            {person.name}
          </span>
          <span className="mt-1 type-micro text-fg-subtle transition-opacity duration-500 group-data-[floating=true]/header:hidden">
            {person.role}
          </span>
        </span>
      </Link>

      <DesktopNav />

      <div className="flex items-center gap-2">
        {person.resumeUrl ? (
          <ButtonLink
            href={person.resumeUrl}
            external
            download
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Résumé
          </ButtonLink>
        ) : null}
        <ButtonLink
          href={sectionHref("contact")}
          variant="secondary"
          size="sm"
          magnetic
          className="hidden sm:inline-flex"
        >
          Contact
        </ButtonLink>
        <MobileNav />
      </div>
    </HeaderShell>
  );
}
