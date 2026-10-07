import { ImageResponse } from "next/og";
import { person } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = `${person.name} — ${person.role}`;

/** Social card in the site's visual language. Rendered at build time. */
export function renderOgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#04060b",
        backgroundImage:
          "radial-gradient(circle at 78% 45%, rgba(0,218,237,0.28), transparent 42%), radial-gradient(circle at 10% 100%, rgba(142,88,242,0.25), transparent 45%)",
        color: "#f5f7fa",
        fontFamily: "sans-serif",
      }}
    >
      <svg
        width="460"
        height="460"
        viewBox="-3 -3 6 6"
        style={{ position: "absolute", right: 70, top: 85 }}
      >
        <ellipse
          rx="2.05"
          ry="0.62"
          transform="rotate(-12)"
          fill="none"
          stroke="#00daed"
          strokeOpacity="0.6"
          strokeWidth="0.015"
        />
        <ellipse
          rx="2.6"
          ry="1.1"
          transform="rotate(-34)"
          fill="none"
          stroke="#ae7fff"
          strokeOpacity="0.4"
          strokeWidth="0.012"
        />
        <polygon
          points="0,-1.55 1.34,-0.78 1.34,0.78 0,1.55 -1.34,0.78 -1.34,-0.78"
          fill="none"
          stroke="#cbaaff"
          strokeOpacity="0.45"
          strokeWidth="0.015"
        />
        <polygon
          points="0,0.62 -0.54,-0.31 0.54,-0.31"
          fill="none"
          stroke="#60ecf6"
          strokeWidth="0.02"
        />
        <circle r="0.3" fill="#a3f5fa" />
      </svg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            color: "#00daed",
            textTransform: "uppercase",
          }}
        >
          Portfolio
        </div>
        <div style={{ fontSize: 40, marginTop: 28, color: "#b0b4bd" }}>
          {person.name}
        </div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1,
            marginTop: 12,
          }}
        >
          {person.role}
        </div>
      </div>
    </div>,
    ogSize,
  );
}
