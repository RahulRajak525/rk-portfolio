import type { ReactNode } from "react";
import type { CaseVisualKind } from "@/content/types";

/**
 * Blueprint schematics — one per case study. They show the *shape* of each
 * system (what talks to what) rather than decorative imagery. Decorative for
 * assistive tech: the card text carries the same information.
 */

const line = "fill-none stroke-line-strong";
const accent = "fill-none stroke-accent";
/** Data-flow paths; whether they animate is decided by data-flow (CSS). */
const flow = "flow-path fill-none stroke-accent";
const faint = "fill-none stroke-line-strong [stroke-dasharray:3_3]";

function Label({
  x,
  y,
  children,
  anchor = "middle",
  tone = "subtle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  tone?: "subtle" | "accent";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={7}
      letterSpacing={1.2}
      className={`font-mono uppercase ${tone === "accent" ? "fill-accent" : "fill-fg-subtle"}`}
    >
      {children}
    </text>
  );
}

function Migration() {
  const rows = [36, 58, 80, 102, 124];
  return (
    <>
      <Label x={70} y={22}>
        Vue 3 · legacy
      </Label>
      <Label x={250} y={22} tone="accent">
        React · submodule
      </Label>
      {rows.map((y, i) => (
        <g key={y}>
          <rect
            x={30}
            y={y}
            width={80}
            height={14}
            rx={2}
            className={i < 3 ? faint : line}
          />
          <rect
            x={210}
            y={y}
            width={80}
            height={14}
            rx={2}
            className={i < 3 ? `${accent} fill-ion-400/10` : faint}
          />
          {i < 3 ? (
            <path
              d={`M112 ${y + 7} C 160 ${y + 7}, 160 ${y + 7}, 208 ${y + 7}`}
              className={flow}
            />
          ) : null}
        </g>
      ))}
      <Label x={160} y={160}>
        Ships side by side · live users
      </Label>
    </>
  );
}

function Agent() {
  return (
    <>
      <rect x={24} y={42} width={92} height={84} rx={4} className={line} />
      <path d="M24 54h92" className={line} />
      <circle cx={31} cy={48} r={1.6} className="fill-fg-faint" />
      <circle cx={37} cy={48} r={1.6} className="fill-fg-faint" />
      <path d="M34 66h50M34 76h66M34 86h40M34 96h58" className={faint} />
      <Label x={70} y={142}>
        Web · React
      </Label>

      <polygon
        points="160,62 177,72 177,92 160,102 143,92 143,72"
        className={`${accent} fill-ion-400/10`}
      />
      <circle cx={160} cy={82} r={4} className="fill-accent" />
      <Label x={160} y={120} tone="accent">
        Claude Code agent
      </Label>

      <rect x={226} y={34} width={58} height={102} rx={10} className={line} />
      <path d="M248 40h14" className={line} />
      <path d="M236 58h38M236 70h28M236 82h38M236 94h22" className={faint} />
      <Label x={255} y={152}>
        Native · Expo
      </Label>

      <path d="M118 82h22" className={flow} />
      <path d="M180 82h44" className={flow} />
      <Label x={160} y={160}>
        Routes ✓ · Styles ✓
      </Label>
    </>
  );
}

function Communication() {
  return (
    <>
      {/* Compose: Updates V2 block editor */}
      {[30, 52, 96, 118].map((y) => (
        <rect
          key={y}
          x={16}
          y={y}
          width={76}
          height={14}
          rx={2}
          className={line}
        />
      ))}
      <rect
        x={26}
        y={74}
        width={76}
        height={14}
        rx={2}
        className={`${accent} fill-ion-400/10`}
      />
      <path d="M20 78v6M23 78v6" className="stroke-accent" />
      <Label x={56} y={152}>
        Compose · blocks
      </Label>

      <path d="M106 81h14" className={flow} />

      {/* Target: stakeholder groups or map regions */}
      <path d="M126 44l34-8 20 16-8 26-32 4-14-18z" className={line} />
      <path
        d="M180 52l22 10-2 30-30 4-6-18z"
        className={`${accent} fill-ion-400/10`}
      />
      <path d="M146 92l26-4 6 14-6 24-28-6z" className={line} />
      <circle cx={186} cy={70} r={2.6} className="fill-accent" />
      <circle cx={190} cy={84} r={2.6} className="fill-accent" />
      <circle cx={176} cy={86} r={2.6} className="fill-accent" />
      <circle cx={146} cy={58} r={2.2} className="fill-fg-faint" />
      <circle cx={160} cy={110} r={2.2} className="fill-fg-faint" />
      <Label x={164} y={152}>
        Target · map
      </Label>

      <path d="M208 81h14" className={flow} />

      {/* Deliver: validated envelope → print & post */}
      <rect x={228} y={48} width={58} height={36} rx={2} className={accent} />
      <path d="M228 48l29 22 29-22" className={accent} />
      <path d="M257 88v12" className={flow} />
      <rect x={236} y={104} width={42} height={22} rx={3} className={line} />
      <path d="M244 126v8h26v-8" className={line} />
      <Label x={257} y={152}>
        Print & deliver
      </Label>
    </>
  );
}

function Commerce() {
  return (
    <>
      <rect x={24} y={30} width={84} height={34} rx={3} className={line} />
      <Label x={66} y={50}>
        Storefront
      </Label>
      <rect x={24} y={96} width={84} height={34} rx={3} className={line} />
      <Label x={66} y={116}>
        Admin
      </Label>

      <rect
        x={150}
        y={62}
        width={64}
        height={36}
        rx={3}
        className={`${accent} fill-ion-400/10`}
      />
      <Label x={182} y={83} tone="accent">
        REST API
      </Label>

      <ellipse cx={268} cy={66} rx={24} ry={7} className={line} />
      <path d="M244 66v28c0 4 11 7 24 7s24-3 24-7V66" className={line} />
      <Label x={268} y={118}>
        MongoDB
      </Label>

      <path d="M110 47 C 130 47, 130 72, 148 72" className={flow} />
      <path d="M110 113 C 130 113, 130 88, 148 88" className={flow} />
      <path d="M216 80h26" className={flow} />

      {["Stripe", "Razorpay", "COD"].map((pay, i) => (
        <g key={pay}>
          <rect
            x={120 + i * 52}
            y={138}
            width={46}
            height={14}
            rx={2}
            className={faint}
          />
          <Label x={143 + i * 52} y={148}>
            {pay}
          </Label>
        </g>
      ))}
    </>
  );
}

const visuals: Record<CaseVisualKind, () => ReactNode> = {
  migration: Migration,
  agent: Agent,
  communication: Communication,
  commerce: Commerce,
};

/**
 * flow: when the data-flow dashes animate —
 * "hover" (inside a [data-flow-host] being hovered), "always" (focal stage),
 * "inview" (inside an InViewFlag — the touch-device stand-in for hover).
 */
export function CaseVisual({
  kind,
  flow: mode = "hover",
}: {
  kind: CaseVisualKind;
  flow?: "hover" | "always" | "inview";
}) {
  const Visual = visuals[kind];
  return (
    <svg
      viewBox="0 0 320 170"
      aria-hidden="true"
      focusable="false"
      data-flow={mode}
      className="h-auto w-full"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
    >
      <Visual />
    </svg>
  );
}
