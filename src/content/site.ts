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
  resumeUrl: "/rahul-kumar-rajak-resume.pdf",
  socials: [
    {
      platform: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/rahul-kumar-rajak-4b5a71174/",
    },
    {
      platform: "github",
      label: "GitHub",
      href: "https://github.com/RahulRajak525",
    },
  ],
};

export const seo = {
  title: `${person.name} — ${person.role} (React, Next.js, Vue)`,
  description:
    "Frontend developer with 3+ years building production React and Vue interfaces — leading a live Vue 3 to React migration and AI-assisted tooling.",
  locale: "en_US",
} as const;

/** Hero HUD: the 6-second recruiter scan. */
export const heroFacts: Fact[] = [
  { label: "Experience", value: "3+ years · React & Vue" },
  { label: "Currently", value: "Treeroot Informatics" },
  { label: "Focus", value: "Production UI · Migrations · AI tooling" },
  { label: "Based in", value: "Ghaziabad, India · Remote" },
];
