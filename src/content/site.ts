import type { ContentStatus, Fact, Person } from "./types";

/**
 * Identity & SEO. Source of truth: the résumé (STEP 2). Nothing here is
 * inferred — fields the résumé does not provide stay null and their UI is
 * hidden.
 */
export const status: ContentStatus = "published";

export const person: Person = {
  name: "Rahul Kumar Rajak",
  role: "Frontend Developer",
  coreStack: ["React.js", "Next.js", "Vue.js", "JavaScript", "TypeScript"],
  tagline:
    "3+ years building production interfaces in React and Vue. Sole frontend developer on an enterprise SaaS platform for Dutch municipalities — leading its Vue 3 → React migration in production, without disrupting live users.",
  location: "Ghaziabad, Uttar Pradesh",
  workMode: "Remote",
  availability: "Open to roles",
  email: "rahulrajak525@gmail.com",
  // Hidden by choice: email is the public contact channel.
  phone: null,
  // TODO: add the résumé PDF to /public and set e.g. "/rahul-kumar-rajak-resume.pdf".
  resumeUrl: null,
  // TODO: the résumé links LinkedIn and GitHub — add the profile URLs here.
  socials: [],
};

export const seo = {
  title: `${person.name} — ${person.role} (React, Next.js, Vue)`,
  description:
    "Frontend developer with 3+ years building production interfaces in React.js and Vue.js — leading a Vue 3 to React migration for an enterprise civic-communication SaaS platform, building AI-assisted tooling, and shipping full-stack MERN applications.",
  locale: "en_US",
} as const;

/** Hero HUD: the 6-second recruiter scan. */
export const heroFacts: Fact[] = [
  { label: "Experience", value: "3+ years · React & Vue" },
  { label: "Currently", value: "Treeroot Informatics" },
  { label: "Focus", value: "Production UI · Migrations · AI tooling" },
  { label: "Based in", value: "Ghaziabad, India · Remote" },
];
