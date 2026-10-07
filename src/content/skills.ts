import type { EvidenceId, SkillGroup } from "./types";

export const evidence: readonly { id: EvidenceId; label: string }[] = [
  { id: "treeroot", label: "Treeroot Informatics" },
  { id: "kora", label: "Kora" },
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
      { name: "TypeScript", usedIn: ["kora", "portfolio"] },
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
        usedIn: ["treeroot", "kora", "sharpener", "portfolio"],
      },
      { name: "Next.js", usedIn: ["kora", "portfolio"] },
      { name: "Vue.js 3", usedIn: ["treeroot"] },
      { name: "React Router", usedIn: ["kora", "sharpener"] },
    ],
  },
  {
    id: "ui",
    label: "UI & Styling",
    skills: [
      { name: "Tailwind CSS", usedIn: ["kora", "portfolio"] },
      { name: "Vuetify 3", usedIn: ["treeroot"] },
      { name: "Material-UI", usedIn: [] },
      { name: "TipTap", usedIn: ["treeroot"] },
      { name: "Leaflet", usedIn: ["treeroot"] },
      { name: "ApexCharts", usedIn: [] },
    ],
  },
  {
    id: "state",
    label: "State & Data",
    skills: [
      { name: "Redux", usedIn: ["treeroot", "sharpener"] },
      { name: "Pinia", usedIn: ["treeroot"] },
      { name: "React Hook Form", usedIn: [] },
      { name: "Socket.io", usedIn: ["treeroot"] },
      { name: "REST APIs", usedIn: ["kora"] },
    ],
  },
  {
    id: "backend",
    label: "Backend & Database",
    skills: [
      { name: "Node.js", usedIn: ["kora"] },
      { name: "Express.js", usedIn: ["kora"] },
      { name: "MongoDB", usedIn: ["kora"] },
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
      { name: "Stripe", usedIn: ["kora"] },
      { name: "Razorpay", usedIn: ["kora"] },
      { name: "Cloudinary", usedIn: ["kora"] },
    ],
  },
  {
    id: "delivery",
    label: "Delivery & Tooling",
    skills: [
      { name: "Vite", usedIn: ["kora"] },
      { name: "Git", usedIn: ["treeroot"] },
      { name: "GitLab CI/CD", usedIn: ["treeroot"] },
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
