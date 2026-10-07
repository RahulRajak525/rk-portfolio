# Rahul Kumar Rajak — Portfolio

A premium, futuristic portfolio built as a production-grade frontend codebase.

> **Status: Step 2 of 4 — content.** All content comes from the résumé (`src/content/`). Missing links (LinkedIn, GitHub, Kora demo/source, résumé PDF) are marked `TODO` and their UI stays hidden until filled.

## Stack

Next.js 16.4 (App Router, Turbopack, Cache Components) · React 19.3 · TypeScript (strict) · Tailwind CSS 4.3 · Motion 14 · three.js r186 + React Three Fiber 9 + drei

## Scripts

```bash
npm run dev         # development server
npm run build       # production build (fails if any route stops being static)
npm start           # serve the production build
npm run check       # lint + typecheck + format check
npm run format      # Prettier (with Tailwind class sorting)
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` for production.

## Structure

```
src/
├─ app/                  routes, metadata, OG image, robots, sitemap, manifest
│  └─ system/            living design-system reference (/system)
├─ content/              typed content — the only place personal data lives
│  ├─ site.ts            identity, SEO, hero facts (placeholders in Step 1)
│  └─ sections.ts        information architecture: order = page = nav
├─ components/
│  ├─ ui/                design-system primitives (Button, Panel, Heading…)
│  ├─ layout/            header, mobile nav, footer, atmosphere, skip link
│  ├─ motion/            MotionProvider, Reveal primitives
│  ├─ sections/          hero + section blueprints (replaced in Step 2)
│  ├─ three/             Interface Core scene, shaders, quality tiers, poster
│  ├─ seo/               JSON-LD
│  └─ system/            /system demos
├─ hooks/                media query, scroll-spy
├─ lib/                  cn, motion tokens, PRNG, store, site URL, OG renderer
└─ styles/               tokens.css · base.css · utilities.css · effects.css
docs/design-system.md    tokens, rules and principles
```

## Engineering notes

- **Static by contract:** `ensureStatic = "navigation"` on the root layout. The build fails if any route needs request-time rendering.
- **Performance:** Server Components by default. three.js is a lazy chunk loaded on idle, behind a server-rendered SVG poster. The render loop pauses off-screen. Quality is adaptive.
- **Accessibility:** skip link, semantic landmarks, `aria-labelledby` sections, native `<dialog>` menu, visible focus, AA contrast (measured), `prefers-reduced-motion`, `prefers-contrast` and `forced-colors` support.
- **SEO:** Metadata API, canonical URLs, generated OG/Twitter images, sitemap, robots, and JSON-LD (Person + WebSite, emitted once content is published).

## Roadmap

1. ✅ Foundation — architecture, design system, shell, hero, 3D experiment
2. ✅ Content — résumé data; Experience timeline, project case studies, capabilities explorer, About, Contact
3. Depth — case-study detail, scroll storytelling with the core
4. Polish — performance and accessibility audit, deployment
