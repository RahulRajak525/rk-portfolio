import type { EvidenceId, SkillGroup } from "./types";

export const evidence: readonly { id: EvidenceId; label: string }[] = [
  { id: "treeroot", label: "Treeroot Informatics" },
  { id: "kora", label: "Kora" },
  { id: "lowkey", label: "LowKey" },
  { id: "curtaksh", label: "Curtaksh" },
  { id: "sharpener", label: "Sharpener.tech" },
  { id: "portfolio", label: "This portfolio" },
];

/**
 * Technologies from the résumé's skills section, plus tools its experience
 * and project entries name explicitly. `usedIn` lists only usage stated in the
 * résumé or confirmed by Rahul (STEP 2 review); skills listed without context
 * have an empty `usedIn`.
 */
export const skillGroups: readonly SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "JavaScript (ES6+)", usedIn: [] },
      {
        name: "TypeScript",
        usedIn: ["kora", "lowkey", "curtaksh", "portfolio"],
      },
      { name: "HTML5", usedIn: [] },
      { name: "CSS3", usedIn: [] },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    skills: [
      {
        name: "React.js",
        usedIn: [
          "treeroot",
          "kora",
          "lowkey",
          "curtaksh",
          "sharpener",
          "portfolio",
        ],
      },
      { name: "Next.js", usedIn: ["kora", "portfolio"] },
      { name: "React Native · Expo", usedIn: ["treeroot", "lowkey"] },
      { name: "Vue.js 3", usedIn: ["treeroot"] },
      { name: "React Router", usedIn: ["kora", "sharpener"] },
    ],
  },
  {
    id: "ui",
    label: "UI & Styling",
    skills: [
      {
        name: "Tailwind CSS",
        usedIn: ["kora", "lowkey", "curtaksh", "portfolio"],
      },
      { name: "Vuetify 3", usedIn: ["treeroot"] },
      { name: "Material-UI", usedIn: [] },
      { name: "TipTap", usedIn: ["treeroot"] },
      { name: "Leaflet", usedIn: ["treeroot"] },
      { name: "ApexCharts", usedIn: [] },
      { name: "Three.js · R3F", usedIn: ["curtaksh", "portfolio"] },
      { name: "GSAP", usedIn: ["curtaksh"] },
      { name: "Framer Motion", usedIn: ["lowkey", "curtaksh", "portfolio"] },
    ],
  },
  {
    id: "state",
    label: "State & Data",
    skills: [
      { name: "Redux", usedIn: ["treeroot", "sharpener"] },
      { name: "Pinia", usedIn: ["treeroot"] },
      { name: "React Hook Form", usedIn: [] },
      { name: "Zustand", usedIn: ["curtaksh"] },
      { name: "TanStack Query", usedIn: ["lowkey"] },
      { name: "Socket.io", usedIn: ["treeroot", "lowkey"] },
      { name: "REST APIs", usedIn: ["kora"] },
    ],
  },
  {
    id: "backend",
    label: "Backend & Database",
    skills: [
      { name: "Node.js", usedIn: ["kora"] },
      { name: "Bun", usedIn: ["lowkey"] },
      { name: "Express.js", usedIn: ["kora", "lowkey"] },
      { name: "MongoDB", usedIn: ["kora", "lowkey"] },
      { name: "Mongoose", usedIn: ["kora"] },
      { name: "JWT · bcrypt", usedIn: ["kora"] },
    ],
  },
  {
    id: "integrations",
    label: "Product & Integrations",
    skills: [
      { name: "LaunchDarkly", usedIn: ["treeroot"] },
      { name: "Sentry", usedIn: ["treeroot"] },
      { name: "Product Fruits", usedIn: ["treeroot"] },
      { name: "CASL", usedIn: ["treeroot"] },
      { name: "Stripe", usedIn: ["kora"] },
      { name: "Razorpay", usedIn: ["kora"] },
      { name: "Cloudinary", usedIn: ["kora"] },
      { name: "Clerk", usedIn: ["lowkey"] },
    ],
  },
  {
    id: "delivery",
    label: "Delivery & Tooling",
    skills: [
      { name: "Vite", usedIn: ["kora", "curtaksh"] },
      { name: "Git", usedIn: ["treeroot"] },
      { name: "GitLab CI/CD", usedIn: ["treeroot"] },
      { name: "Docker", usedIn: ["treeroot"] },
      { name: "GKE", usedIn: ["treeroot"] },
      { name: "Shortcut", usedIn: ["treeroot"] },
      { name: "Figma", usedIn: ["treeroot"] },
    ],
  },
  {
    id: "ai",
    label: "AI-Assisted Development",
    skills: [
      { name: "Claude Code", usedIn: ["treeroot"] },
      { name: "Cursor AI", usedIn: [] },
      { name: "Codex", usedIn: [] },
      { name: "Lovable", usedIn: [] },
      { name: "Grok", usedIn: [] },
      { name: "Gemini", usedIn: [] },
    ],
  },
];
