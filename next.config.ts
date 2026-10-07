import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Static-first rendering: the whole site is prerendered (see `ensureStatic`
  // in src/app/layout.tsx). Both flags are required together in Next 16.4.
  cacheComponents: true,
  partialPrefetching: true,

  // Internal links are type-checked against the route tree.
  typedRoutes: true,

  poweredByHeader: false,

  experimental: {
    // Atomic CSS is small (~17 KB): inlining it removes the render-blocking
    // stylesheet request for first-time visitors — the portfolio's audience.
    inlineCss: true,
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // The résumé is for people, not search results (it carries contact details).
        source: "/rahul-kumar-rajak-resume.pdf",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
