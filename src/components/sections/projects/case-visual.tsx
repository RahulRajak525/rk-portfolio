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

function Communication() {
  return (
    <>
      {/* The whole module is moving Vue 3 → React while it stays live */}
      <Label x={135} y={16} anchor="end">
        Vue 3 · legacy
      </Label>
      <path d="M141 13h50" className={flow} />
      <Label x={197} y={16} anchor="start" tone="accent">
        React · live
      </Label>

      {/* Letters: draw an area on the map to pick recipient addresses */}
      <path d="M16 44l34-8 20 16-8 26-32 4-14-18z" className={line} />
      <path
        d="M70 52l22 10-2 30-30 4-6-18z"
        className={`${accent} fill-ion-400/10`}
      />
      <path d="M36 92l26-4 6 14-6 24-28-6z" className={line} />
      <circle cx={76} cy={70} r={2.6} className="fill-accent" />
      <circle cx={80} cy={84} r={2.6} className="fill-accent" />
      <circle cx={66} cy={86} r={2.6} className="fill-accent" />
      <circle cx={36} cy={58} r={2.2} className="fill-fg-faint" />
      <circle cx={50} cy={110} r={2.2} className="fill-fg-faint" />
      <Label x={54} y={152}>
        Draw area · map
      </Label>

      <path d="M98 81h20" className={flow} />

      {/* Review and correct the addresses, then sign */}
      {[34, 50, 66, 82].map((y) => (
        <g key={y}>
          <rect
            x={124}
            y={y}
            width={72}
            height={11}
            rx={2}
            className={y === 66 ? `${accent} fill-ion-400/10` : line}
          />
          <path d={`M130 ${y + 5.5}h36`} className={faint} />
          <path
            d={`M182 ${y + 5.5}l2.5 2.5 5-5`}
            className="fill-none stroke-accent"
          />
        </g>
      ))}
      <path
        d="M130 112c5-9 9 5 14-1s7-8 11 0 7 4 12-3"
        className="fill-none stroke-accent"
      />
      <path d="M126 118h68" className={line} />
      <Label x={160} y={152}>
        Review · sign
      </Label>

      <path d="M202 81h20" className={flow} />

      {/* Envelope → downloadable PDF */}
      <rect x={228} y={48} width={58} height={36} rx={2} className={accent} />
      <path d="M228 48l29 22 29-22" className={accent} />
      <path d="M257 88v8" className={flow} />
      <path d="M244 100h18l8 8v24h-26z" className={line} />
      <path d="M262 100v8h8" className={line} />
      <Label x={257} y={123} tone="accent">
        PDF
      </Label>
      <Label x={257} y={152}>
        Envelope · PDF
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

function Messenger() {
  return (
    <>
      {/* Web: chat list beside the open conversation */}
      <rect x={20} y={34} width={96} height={92} rx={4} className={line} />
      <path d="M20 46h96M44 46v80" className={line} />
      <circle cx={27} cy={40} r={1.6} className="fill-fg-faint" />
      <circle cx={33} cy={40} r={1.6} className="fill-fg-faint" />
      <path d="M26 56h12M26 66h12M26 76h12M26 86h12" className={faint} />
      <rect x={50} y={56} width={34} height={10} rx={3} className={line} />
      <rect
        x={74}
        y={72}
        width={36}
        height={10}
        rx={3}
        className={`${accent} fill-ion-400/10`}
      />
      <rect x={50} y={88} width={26} height={10} rx={3} className={line} />
      <rect x={50} y={108} width={60} height={10} rx={5} className={faint} />
      <Label x={68} y={142}>
        Web · React
      </Label>

      {/* One live backend: Clerk-authenticated socket over MongoDB */}
      <path d="M160 36l8 3v7c0 5-4 8-8 10c-4-2-8-5-8-10v-7z" className={line} />
      <path d="M156.5 46l2.5 2.5 5-5" className="fill-none stroke-accent" />
      <path d="M160 57v6" className={faint} />
      <Label x={160} y={28}>
        Clerk
      </Label>
      <rect
        x={130}
        y={64}
        width={60}
        height={32}
        rx={16}
        className={`${accent} fill-ion-400/10`}
      />
      <Label x={160} y={83} tone="accent">
        Socket.IO
      </Label>
      <path d="M160 98v8" className={flow} />
      <ellipse cx={160} cy={111} rx={18} ry={5} className={line} />
      <path d="M142 111v14c0 3 8 5 18 5s18-2 18-5v-14" className={line} />
      <Label x={160} y={142}>
        Bun · MongoDB
      </Label>

      <path d="M118 75h10" className={flow} />
      <path d="M128 85h-10" className={flow} />
      <path d="M192 75h32" className={flow} />
      <path d="M224 85h-32" className={flow} />

      {/* Mobile: presence in the header, the other person typing */}
      <rect x={226} y={30} width={56} height={100} rx={10} className={line} />
      <path d="M248 36h12" className={line} />
      <circle cx={238} cy={48} r={4} className={line} />
      <circle cx={241} cy={51} r={1.6} className="fill-accent" />
      <path d="M246 48h22" className={faint} />
      <path d="M232 56h44" className={line} />
      <rect x={232} y={62} width={30} height={10} rx={3} className={line} />
      <rect
        x={246}
        y={78}
        width={30}
        height={10}
        rx={3}
        className={`${accent} fill-ion-400/10`}
      />
      <rect x={232} y={94} width={20} height={10} rx={5} className={line} />
      {[238, 242, 246].map((cx) => (
        <circle key={cx} cx={cx} cy={99} r={1.2} className="fill-accent" />
      ))}
      <rect x={232} y={112} width={44} height={10} rx={5} className={faint} />
      <Label x={254} y={142}>
        Mobile · Expo
      </Label>

      <Label x={160} y={160}>
        Live · presence · typing · unread
      </Label>
    </>
  );
}

function Curtains() {
  return (
    <>
      {/* Light engine: dawn → night slider re-themes every token */}
      <path d="M28 59v2M28 69v2M23 65h2M31 65h2" className="stroke-accent" />
      <circle cx={28} cy={65} r={2.6} className={accent} />
      <path d="M40 65h24" className="stroke-accent" />
      <path d="M72 65h24" className={line} />
      <circle cx={68} cy={65} r={4} className={`${accent} fill-ion-400/10`} />
      <path d="M107 60a5 5 0 0 0 0 10a7 7 0 0 1 0-10z" className={line} />
      {[34, 57, 80].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={80}
          width={18}
          height={18}
          rx={2}
          className={i === 1 ? `${accent} fill-ion-400/10` : i ? faint : line}
        />
      ))}
      <Label x={66} y={114} tone="accent">
        AA ✓
      </Label>
      <Label x={66} y={148} tone="accent">
        Light engine
      </Label>

      <path d="M104 89h26" className={flow} />

      {/* Storefront: cloth-sim curtains part to reveal the page */}
      <rect x={134} y={30} width={158} height={106} rx={4} className={line} />
      <path d="M134 42h158" className={line} />
      <circle cx={141} cy={36} r={1.6} className="fill-fg-faint" />
      <circle cx={147} cy={36} r={1.6} className="fill-fg-faint" />
      <path d="M140 48h146" className={line} />

      <path d="M195 64h36M195 74h24M195 84h30" className={faint} />
      <rect
        x={193}
        y={94}
        width={40}
        height={14}
        rx={2}
        className={`${accent} fill-ion-400/10`}
      />
      <Label x={213} y={104} tone="accent">
        ₹ live
      </Label>

      <path
        d="M142 50h34c-6 26-10 52-8 78h-26z"
        className={`${accent} fill-ion-400/10`}
      />
      <path
        d="M151 50c-1 26 0 52-2 78M160 50c-2 26-3 52-4 78"
        className={faint}
      />
      <path
        d="M284 50h-34c6 26 10 52 8 78h26z"
        className={`${accent} fill-ion-400/10`}
      />
      <path
        d="M275 50c1 26 0 52 2 78M266 50c2 26 3 52 4 78"
        className={faint}
      />
      <path d="M198 120h-14" className={flow} />
      <path d="M228 120h14" className={flow} />
      <Label x={213} y={148}>
        Cloth-sim hero
      </Label>

      <Label x={160} y={161}>
        Dawn → night · AA at every step
      </Label>
    </>
  );
}

const visuals: Record<CaseVisualKind, () => ReactNode> = {
  communication: Communication,
  commerce: Commerce,
  messenger: Messenger,
  curtains: Curtains,
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
