import type { CaseStudy } from "./types";

/**
 * Case studies. Every field restates the résumé; nothing is extrapolated.
 * `outcome` / `metric` are null where the résumé states no result.
 */
export const projects: readonly CaseStudy[] = [
  {
    id: "migration",
    title: "Vue 3 → React, migrated live",
    kind: "Production",
    context:
      "Treeroot Informatics · civic-communication SaaS for Dutch municipalities",
    role: "Sole frontend developer — leading the migration",
    purpose:
      "Move an enterprise platform from Vue 3 to React, module by module, while it stays in production for its users.",
    built: [
      "React frontend shipped as a Git submodule, so legacy and migrated modules ship side by side",
      "Module-by-module migration executed in production",
      "Scoped the stakeholder detail page by identifying 15 functional gaps — LaunchDarkly gating, permission-based UI and merge dialogs",
    ],
    challenge:
      "Running two frameworks in one live product: every migrated module has to reach parity before it replaces the legacy one.",
    outcome:
      "Legacy and migrated modules ship side by side in production, without disrupting live users.",
    metric: { value: "15", label: "functional gaps identified on one page" },
    stack: ["Vue 3", "React", "Git submodules", "LaunchDarkly"],
    links: [],
    visual: "migration",
  },
  {
    id: "kora",
    title: "Kora — full-stack MERN commerce",
    kind: "Personal project",
    context: "Independent build · 2026",
    role: "Solo — storefront, admin and API",
    purpose:
      "A complete e-commerce platform — storefront, admin dashboard and the REST API serving both — in a single repository.",
    built: [
      "Stripe and Razorpay checkout, plus cash on delivery",
      "JWT authentication with bcrypt password hashing",
      "Optimistic-update cart",
      "Admin panel with Cloudinary uploads and order-status workflows",
    ],
    challenge:
      "Three payment paths and an optimistic-update cart, across storefront, admin and API in one codebase.",
    outcome: "Shipped end to end as a full-stack MERN application.",
    metric: null,
    stack: [
      "React 19",
      "Next.js",
      "TypeScript",
      "Vite",
      "Tailwind CSS v4",
      "React Router 7",
      "Express 5",
      "MongoDB / Mongoose",
      "JWT",
      "bcrypt",
      "Cloudinary",
      "Stripe",
      "Razorpay",
    ],
    links: [
      { label: "Live demo", href: "https://kora-ecommerce.onrender.com/" },
      // TODO: add { label: "Source code", href: "https://github.com/…" }
    ],
    visual: "commerce",
  },
  {
    id: "native-sync",
    title: "Claude Code agent: web → native sync",
    kind: "Production",
    context: "Treeroot Informatics · internal tooling",
    role: "Built it",
    purpose:
      "Keep an Expo / React Native app in step with its React web codebase.",
    built: [
      "Internal Claude Code agent that regenerates the Expo / React Native app whenever the React web codebase changes",
      "Route parity enforced between web and native",
      "Deterministic style conversion",
    ],
    challenge:
      "Making AI-driven code generation dependable: route parity and deterministic style conversion on every run.",
    outcome: "Replaced a manual per-change conversion step.",
    metric: null,
    stack: ["Claude Code", "React", "React Native", "Expo"],
    links: [],
    visual: "agent",
  },
  {
    id: "stakeholder-communication",
    title: "Stakeholder communication",
    kind: "Production",
    context: "Treeroot Informatics · stakeholder-communication module",
    role: "Engineered the module · specified and built Updates V2",
    purpose:
      "Stakeholder communication for an enterprise civic platform: a drag-and-drop block editor (Updates V2) and physical letters sent to recipients selected from stakeholder groups or interactive map regions.",
    built: [
      "Recipient targeting by stakeholder group or interactive map region",
      "Document upload, envelope configuration and postal validation",
      "Third-party mailing-service integration for automated printing and delivery",
      "Updates V2: a drag-and-drop block editor with block serialization and hydration, specified as 40 tickets across 10 epics from Figma analysis",
      "A React Kanban board with inline editing and custom hooks",
    ],
    challenge:
      "Turning an on-screen selection into physical mail — validation and an automated print-and-deliver hand-off — while keeping editor blocks serializable and hydratable.",
    outcome: null,
    metric: { value: "40 / 10", label: "tickets / epics specified" },
    stack: [
      "Vue 3",
      "Vuetify 3",
      "Pinia",
      "Leaflet",
      "Socket.io",
      "React",
      "TipTap",
      "Custom hooks",
      "Figma",
    ],
    links: [],
    visual: "communication",
  },
];
