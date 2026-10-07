"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sectionHref, sections } from "@/content/sections";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, ButtonLink } from "@/components/ui/button";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";

/**
 * Mobile navigation (< lg) on the native modal <dialog>: the browser
 * provides focus containment, Escape-to-close, an inert background and
 * focus restoration. CSS handles the open/close transition.
 */
export function MobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 64rem)");

  // Rotating a tablet into desktop width should not strand an open sheet.
  useEffect(() => {
    if (isDesktop) dialogRef.current?.close();
  }, [isDesktop]);

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden [&_svg]:size-5"
        aria-label="Open menu"
        data-cursor="hand"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={show}
      >
        <MenuIcon />
      </Button>

      <dialog
        id="site-menu"
        ref={dialogRef}
        data-sheet=""
        aria-label="Site menu"
        onClose={() => setOpen(false)}
        className="m-0 h-dvh max-h-none w-full max-w-none border-0 bg-canvas/95 p-0 text-fg backdrop-blur-xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-header shrink-0 items-center justify-between px-gutter">
            <span className="type-label text-fg-subtle">Menu</span>
            <Button
              variant="ghost"
              size="icon"
              className="[&_svg]:size-5"
              aria-label="Close menu"
              onClick={close}
            >
              <CloseIcon />
            </Button>
          </div>

          <nav
            aria-label="Primary"
            className="flex-1 overflow-y-auto px-gutter pt-6 pb-10"
          >
            <ul className="border-t border-line">
              {sections.map((section) => (
                <li key={section.id} className="border-b border-line">
                  <Link
                    href={sectionHref(section.id)}
                    onClick={close}
                    className="group/item flex items-baseline gap-5 py-5 font-display text-heading-lg text-fg-muted transition-colors hover:text-fg focus-visible:text-fg"
                  >
                    <span className="type-label text-accent tabular-nums">
                      {section.index}
                    </span>
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-line px-gutter py-6">
            <ButtonLink
              href={sectionHref("contact")}
              onClick={close}
              size="lg"
              className="w-full"
            >
              Get in touch
              <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </>
  );
}
