import type { Metadata, Viewport } from "next";
import { Martian_Mono, Mona_Sans } from "next/font/google";
import { person, seo, status } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Atmosphere } from "@/components/layout/atmosphere";
import { BackToTop } from "@/components/layout/back-to-top";
import { PointerSpotlight } from "@/components/layout/pointer-spotlight";
import { SectionObserver } from "@/components/layout/section-observer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { Cursor } from "@/components/cursor/cursor";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import "./globals.css";

/** Every route is fully prerendered; the build fails if that ever regresses. */
export const ensureStatic = "navigation";

// One variable family for display + body: the width axis (wdth 75–125) gives
// the expanded display cut; the same file serves normal-width body text.
const monaSans = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mona-sans",
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
  display: "swap",
});

const isDraft = status === "draft";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: seo.title, template: `%s · ${person.name}` },
  description: seo.description,
  applicationName: person.name,
  authors: [{ name: person.name }],
  creator: person.name,
  alternates: { canonical: "/" },
  // Placeholder content must never be indexed.
  robots: isDraft
    ? { index: false, follow: false }
    : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: seo.locale,
    url: "/",
    siteName: person.name,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#04060b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${monaSans.variable} ${martianMono.variable}`}
    >
      <body>
        {/* Without JavaScript, scroll reveals must never hide content. */}
        <noscript>
          <style>
            {
              "[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}"
            }
          </style>
        </noscript>
        <SkipLink />
        <Atmosphere />
        <MotionProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <BackToTop />
          <Cursor />
        </MotionProvider>
        <PointerSpotlight />
        <SmoothScroll />
        <SectionObserver />
      </body>
    </html>
  );
}
