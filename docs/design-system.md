# Design system

Live reference: **`/system`** (noindex). Source of truth: `src/styles/tokens.css` (CSS) and `src/lib/motion.ts` (JS mirror of motion tokens).

## Direction

A premium technology laboratory: deep-space canvas, one luminous accent, instrument-like typography, and one 3D object that carries the identity. Effects stay in the background layers; content stays readable.

**Depth stack, back to front:** atmosphere (aurora, grain, vignette) → hero grid → 3D core → readability scrim → glass surfaces → content.

## Colour

All colours are OKLCH. Tailwind's default palette is removed, so only system colours can be used.

| Role       | Token                                                | Use                                     |
| ---------- | ---------------------------------------------------- | --------------------------------------- |
| Canvas     | `canvas`, `canvas-deep`                              | Page background                         |
| Surfaces   | `surface` (glass), `surface-strong`, `surface-solid` | Panels                                  |
| Lines      | `line`, `line-strong`, `line-accent`                 | Hairlines, dividers, HUD                |
| Text       | `fg` 18.9:1 · `fg-muted` 9.8:1 · `fg-subtle` 6.3:1   | Headings · body · secondary             |
| Decoration | `fg-faint` 3.7:1                                     | HUD ornament only, never essential text |
| Accent     | `accent` (ion), `accent-strong`                      | Action, focus, the single highlight     |
| Accent 2   | `accent-2` (plasma)                                  | Depth, gradients, secondary emphasis    |
| Status     | `positive`, `warning`, `negative`                    | Meaning only                            |

Rules: one primary action per view. Gradient text (`text-gradient`) on at most one phrase per view. Contrast ratios above were measured against `canvas`; every text token passes WCAG AA.

## Typography

- **Mona Sans** (variable: `wdth` 75–125, `wght` 200–900) is the single family. `font-display` uses the expanded width (125%) for display sizes; body text uses normal width.
- **Martian Mono** is for technical labels (`type-label` at 12px, `type-micro` at 11px for decoration only).
- The scale is fluid (`clamp`, 360 → 1440px): `display-2xl/xl/lg`, `heading-lg/md/sm`, `body-lg/body/body-sm`, `label`, `micro`. Each token bundles size, line-height, tracking and weight.
- `<Heading as size>` decouples semantics from visual size. Headings use `text-wrap: balance` and paragraphs use `text-wrap: pretty`.

## Spacing & layout

- Base unit 4px (Tailwind spacing scale).
- Fluid named tokens: `gutter` (16→40px side padding), `grid` (16→28px gaps), `section` (96→176px vertical rhythm), `header` (64/72px).
- Containers: `narrow` 44rem (reading) · `content` 80rem (default) · `wide` 92rem (header, hero).
- Grid: 4 columns on mobile, 8 on tablet, 12 from `lg` (64rem). Breakpoints are Tailwind defaults. The custom `aspect-wide` variant (aspect ratio ≥ 1.15) drives the hero's side-by-side composition.
- Shape: buttons are pills (actions); tags are sharp (data); panels use `rounded-lg`.

## Components (`src/components/ui`)

| Component                    | Notes                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`, `ButtonLink`       | `primary` / `secondary` / `ghost`; `sm` / `md` / `lg` / `icon`. Internal links are type-checked (typed routes); `external` adds safe `rel`. |
| `Panel`                      | `glass` / `solid` / `outline` / `blueprint`; `spotlight` (pointer light), `corners` (HUD brackets).                                         |
| `Badge`, `StatusDot`         | Tags and live-state indicators. A dot is always paired with text.                                                                           |
| `Heading`, `Text`, `Eyebrow` | Typography primitives.                                                                                                                      |
| `Section`, `SectionHeader`   | Semantic `<section aria-labelledby>` with rhythm and an indexed header.                                                                     |
| `Container`, `Rule`          | Layout boundary and measured divider.                                                                                                       |

## Motion

**Principle:** motion explains (hierarchy, causality, state); it never decorates.

| Token               | Value                          | Use                                      |
| ------------------- | ------------------------------ | ---------------------------------------- |
| `ease-out-expo`     | `cubic-bezier(.16,1,.3,1)`     | Entrances (signature)                    |
| `ease-out-quart`    | `cubic-bezier(.25,1,.5,1)`     | Hover / feedback                         |
| `ease-in-out-quart` | `cubic-bezier(.76,0,.24,1)`    | State changes                            |
| `--dur-*`           | 100 / 180 / 320 / 600 / 1100ms | instant / fast / base / slow / cinematic |

- **Load choreography:** CSS-only (`data-enter`). It starts on first paint, never waits for JavaScript, and never blocks LCP.
- **Scroll reveals:** `<Reveal>`, `<RevealGroup>` and `<RevealItem>` (Motion `whileInView`, once). They use a ≤ 24px rise that resolves from a soft blur, with a 70ms stagger. Content is server-rendered; a `<noscript>` rule un-hides it without JavaScript.
- **Scroll-linked:** header glass state and progress line; the hero core recedes on exit.
- **Micro-interactions:** primary-button light sweep, arrow nudge, pointer spotlight, nav underline.
- **Reduced motion:** `MotionConfig reducedMotion="user"`, CSS media queries, and a static 3D frame. Travel and loops are removed; meaning is kept.
- **Budget:** animate transform, opacity and filter only. No scroll hijacking, and no smooth-scroll library.
- **GSAP:** intentionally not installed. Reserved for a pinned, timeline-driven sequence (for example the core's anatomy walkthrough) if one is needed later.

## 3D — the Interface Core

One object whose layers map to how interfaces are built:

| Layer     | Meaning       | Behaviour                                         |
| --------- | ------------- | ------------------------------------------------- |
| Nucleus   | State & logic | Emits a signal pulse every 4.2s                   |
| Lattice   | Structure     | Wireframe + nodes; lights up as the pulse passes  |
| Shell     | Interface     | Faceted fresnel glass with a scan band            |
| Orbits    | Interaction   | Dashed rings carrying "data packet" comets        |
| Particles | Signal        | 1.4k–5.2k points that converge into place on load |

On load, the particle field converges ("signal → structure"). The `explode` prop separates the layers into an anatomy view, which is the hook for scroll storytelling in later steps (try it on `/system`).

**Performance contract:**

- Lazy chunk, loaded on idle and never in the initial bundle.
- A server-rendered SVG poster paints first.
- The render loop is paused when the core is off-screen or the page is hidden.
- Adaptive quality tiers (DPR and particle count) are driven by `PerformanceMonitor`.
- All animation runs on the GPU; there is no post-processing.
- Fallbacks: no WebGL2 or Save-Data → static poster; reduced motion → single static frame.

## Interaction system (Step 3)

One rule: **the minimum technology for each effect.** CSS first, Motion where physics or pointer data are needed, WebGL only for the core. GSAP is intentionally absent — Motion + CSS sticky cover every effect, so adding it would duplicate ~70 KB.

| Effect            | Technique                                                                                                                                                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Smooth scrolling  | Lenis on the native scroll position, wheel/trackpad only. A capture-phase click handler smooth-scrolls in-page links, updates the hash and moves focus to the target.                                                                                                        |
| Pointer           | One global listener writes `pointer` motion values (`src/lib/pointer.ts`), shared by the cursor, parallax and the 3D scene.                                                                                                                                                  |
| Custom cursor     | A dot plus a spring-trailing ring. States: default, minimal (hero), link, morph (wraps `[data-magnetic]` controls), and label (`data-cursor="label" data-cursor-label="Drag"`). Moving the pointer never re-renders React.                                                   |
| Magnetic controls | `magnetic` prop → `[data-magnetic]`. The cursor writes `--magnet-x/y` and CSS transitions the transform.                                                                                                                                                                     |
| Header            | Transparent bar → floating glass capsule. Hides on scroll-down; returns on scroll-up, when the pointer nears the top edge, or on keyboard focus. Shared-element hover and active pills (Motion `layoutId`).                                                                  |
| Hero              | CSS-only load choreography, and a headline that expands along the variable width axis. The 3D stage is fixed while the hero scrolls: the core glides to centre and separates into layers with DOM callouts projected every frame. Camera parallax and a cursor-driven light. |
| Section entrances | The index decodes (`ScrambleText`), the title rises word by word (`SplitReveal`), and rules and key-phrase underlines draw via CSS `animation-timeline: view()`.                                                                                                             |
| Ambient           | `html[data-section]` re-lights the atmosphere per section (CSS transitions on two compositor layers).                                                                                                                                                                        |
| Experience        | Rail fill and node ignition (scroll-linked), 3D card entrance (`DepthReveal`), badge pop stagger, and stat count-up.                                                                                                                                                         |
| Projects          | Scroll-driven chapters with a sticky tilt stage (preserve-3d depth layers and glare). Morphs between projects.                                                                                                                                                               |
| Capabilities      | The SVG stack sphere: drag with inertia, cursor tilt, scroll turn, card-hover focus, filter lighting. The rAF loop runs only while on screen.                                                                                                                                |

**Mobile strategy.** Touch devices keep native momentum scrolling and get no custom cursor, magnetism or tilt. The scroll choreography stays because it is input-agnostic. Hover effects become in-view effects: schematics animate while visible. The sphere spins on horizontal swipes (`touch-action: pan-y` keeps vertical scrolling native) and hides skill labels.

**Reduced motion.** The cursor and smooth scrolling are disabled. Scroll-scrubbed elements carry `[data-scroll-linked]` and are neutralised by one CSS rule, so server and client render identical markup and nothing branches in JS. The 3D core renders a single static frame, and the sphere stops auto-rotating.
