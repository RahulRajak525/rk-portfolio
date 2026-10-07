import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static-first rendering: the whole site is prerendered (see `ensureStatic`
  // in src/app/layout.tsx). Both flags are required together in Next 16.4.
  cacheComponents: true,
  partialPrefetching: true,

  // Internal links are type-checked against the route tree.
  typedRoutes: true,

  poweredByHeader: false,

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
