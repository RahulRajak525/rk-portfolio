export type ContentStatus = "draft" | "published";

export type SocialPlatform = "github" | "linkedin" | "x" | "website";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface Person {
  name: string;
  role: string;
  /** Strongest technologies, shown in the hero. */
  coreStack: readonly string[];
  /** One-paragraph positioning statement shown in the hero. */
  tagline: string;
  location: string;
  workMode: string | null;
  /** e.g. "Open to senior frontend roles". Hidden when null. */
  availability: string | null;
  email: string | null;
  phone: string | null;
  /** Path under /public or absolute URL. CTA hidden when null. */
  resumeUrl: string | null;
  socials: SocialLink[];
}

/** A recruiter-scannable fact shown in the hero HUD. */
export interface Fact {
  label: string;
  value: string;
}

export interface SectionDefinition {
  /** DOM id and URL fragment. */
  id: string;
  /** Two-digit index used throughout the HUD language. */
  index: string;
  /** Short navigation label. */
  label: string;
  /** Section heading. */
  title: string;
  /** Lede shown beside the heading. */
  description: string;
}

/* ---- Experience -------------------------------------------------------- */

export interface Highlight {
  text: string;
  /** Links the highlight to its case study (`#project-<id>`). */
  projectId?: string;
  /** Phrases given visual emphasis (must appear verbatim in `text`). */
  emphasis?: readonly string[];
}

export interface TimelineEntry {
  id: string;
  kind: "work" | "education";
  organization: string;
  role: string;
  /** "Remote", "Internship"… */
  mode: string | null;
  start: string;
  end: string;
  current: boolean;
  summary: string | null;
  highlights: readonly Highlight[];
  stack: readonly string[];
}

/* ---- Projects ---------------------------------------------------------- */

export type CaseVisualKind =
  "migration" | "agent" | "communication" | "commerce";

export interface CaseStudy {
  id: string;
  title: string;
  kind: "Production" | "Personal project";
  context: string;
  role: string;
  /** What it is and why it exists. */
  purpose: string;
  built: readonly string[];
  challenge: string;
  /** Only stated results — null when the résumé gives none. */
  outcome: string | null;
  /** Figure taken verbatim from the résumé, if any. */
  metric: { value: string; label: string } | null;
  stack: readonly string[];
  links: readonly { label: string; href: string }[];
  visual: CaseVisualKind;
}

/* ---- Capabilities ------------------------------------------------------ */

export type EvidenceId = "treeroot" | "kora" | "sharpener" | "portfolio";

export interface Skill {
  name: string;
  /** Where the résumé shows it in use. Empty = listed skill only. */
  usedIn: readonly EvidenceId[];
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: readonly Skill[];
}
