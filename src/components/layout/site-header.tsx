import Link from "next/link";
import { person } from "@/content/site";
import { sectionHref } from "@/content/sections";
import { ButtonLink } from "@/components/ui/button";
import { DownloadLink } from "@/components/ui/download-link";
import { BrandMark } from "./brand-mark";
import { DesktopNav } from "./desktop-nav";
import { HeaderShell } from "./header-shell";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <HeaderShell>
      <Link
        href="/"
        data-cursor="hand"
        className="-m-2 flex items-center gap-3 rounded-full p-2"
      >
        <BrandMark spin className="size-11 text-fg" />
        <span className="sr-only sm:hidden">{person.name}</span>
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
          <DownloadLink
            href={person.resumeUrl}
            size="sm"
            data-cursor="hand"
            className="hidden sm:inline-flex"
          >
            Résumé
          </DownloadLink>
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
