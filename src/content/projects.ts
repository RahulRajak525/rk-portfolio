import type { CaseStudy } from "./types";

/**
 * Case studies. Every field restates the résumé; nothing is extrapolated.
 * `outcome` / `metric` are null where the résumé states no result.
 */
export const projects: readonly CaseStudy[] = [
  {
    id: "stakeholder-communication",
    title: "PCA — project communication platform",
    kind: "Production",
    context: "Treeroot Informatics · QFact · Dec 2024 – present",
    role: "Frontend developer — built the Letters module end to end, leading the React migration",
    purpose:
      "A SaaS platform that municipalities and infrastructure contractors use to talk to residents and stakeholders during public projects — shared inbox, letters, tasks, maps and reports — moving from Vue 3 to React, module by module, while it stays in production.",
    built: [
      "Letters, end to end: draw areas on a Leaflet map to pick recipient addresses, review and correct them, add a signature, create envelopes and download the letter as a PDF",
      "A map view of the project area showing stakeholders, house-number layers and each stakeholder's contact history — calls, emails and chats",
      "Project Updates with image and video posts, pinning and drag-and-drop ordering, plus a Reports page with editable statistics and filters",
      "Inbox and real-time chat (Socket.IO): a Tiptap rich-text editor with @mentions and file and image upload, filters, search and pagination — and no more unneeded API calls",
      "Role-based access (CASL), login for invited external users and LaunchDarkly feature flags; led the navigation-menu redesign",
      "Module-by-module Vue 3 → React migration in production, with React shipped as a Git submodule so legacy and migrated modules ship side by side",
      "Scoped the stakeholder detail page by identifying 15 functional gaps — LaunchDarkly gating, permission-based UI and merge dialogs",
    ],
    challenge:
      "Every change ships to a live product — through GitLab CI to Docker and Kubernetes on GCP, across separate test, acceptance and production environments — while two frameworks run side by side and each migrated module has to reach parity before it replaces the legacy one.",
    outcome:
      "Legacy and migrated modules ship side by side in production, without disrupting live users.",
    metric: { value: "480+", label: "commits to the production app" },
    stack: [
      "Vue 3",
      "React",
      "Vuetify",
      "Pinia",
      "CASL",
      "Socket.IO",
      "Leaflet",
      "Tiptap",
      "LaunchDarkly",
      "Git submodules",
      "Docker",
      "Kubernetes (GCP)",
    ],
    links: [],
    visual: "communication",
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
      {
        label: "Source code",
        href: "https://github.com/RahulRajak525/fullstack-ecommerce",
      },
    ],
    visual: "commerce",
  },
  {
    id: "lowkey",
    title: "LowKey — private real-time messenger",
    kind: "Personal project",
    context: "Independent build · 2026",
    role: "Solo — API, web and mobile apps",
    purpose:
      "A 1:1 messenger for web and mobile, built to feel instant and stay private. There's no public directory: people reach you only by your exact email.",
    built: [
      "Live messages, online status, typing indicators and unread markers over Socket.IO",
      "Instant sends over the socket, confirmed by the server and kept in sync through TanStack Query's cache",
      "Delete a message for yourself or for everyone; clear or hide a chat without touching the other person's copy",
      "One Bun + Express + MongoDB API shared by a React web app and an Expo mobile app",
      "Dark-first design system: three panels on desktop, a native list-to-chat flow on phones, ⌘K search",
    ],
    challenge:
      "A live connection that stays secure: the socket authenticates with Clerk session tokens, refreshes them on every reconnect and rejoins open chats.",
    outcome:
      "Live on Render's free tier, and it tells users when the server is waking up instead of hanging on a spinner.",
    metric: null,
    stack: [
      "React 19",
      "React Native (Expo)",
      "TypeScript",
      "Bun",
      "Express",
      "MongoDB",
      "Socket.IO",
      "Clerk",
      "TanStack Query",
      "Tailwind CSS",
      "Framer Motion",
    ],
    links: [
      { label: "Live demo", href: "https://lowkey-chatapp.onrender.com/" },
      {
        label: "Source code",
        href: "https://github.com/RahulRajak525/lowkey",
      },
    ],
    visual: "messenger",
  },
  {
    id: "curtaksh",
    title: "Curtaksh — premium curtains storefront",
    kind: "Personal project",
    context: "Independent build · 2026",
    role: "Design and frontend development",
    purpose:
      "A premium, India-first curtains storefront where the whole site re-lights from dawn to night.",
    built: [
      "Light Engine: one slider re-themes the entire site, with automatic WCAG AA contrast at every step",
      "Living hero: real-time cloth-simulated curtains that billow with the cursor",
      "Curtain transitions: panels part to reveal every new page",
      "Made-to-measure configurator — fabric, size, header and lining — with live ₹ pricing",
    ],
    challenge:
      "One slider re-lights every surface from dawn to night, and contrast has to hold WCAG AA at every step.",
    outcome:
      "Fast and accessible: 3D is lazy-loaded and paused off screen, with full reduced-motion support.",
    metric: null,
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "three.js",
      "React Three Fiber",
      "GSAP",
      "Framer Motion",
      "Zustand",
    ],
    links: [
      { label: "Live demo", href: "https://curtaksh.vercel.app/" },
      {
        label: "Source code",
        href: "https://github.com/RahulRajak525/CURTAKSH",
      },
    ],
    visual: "curtains",
  },
];
