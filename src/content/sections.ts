import type { Route } from "next";
import type { SectionDefinition } from "./types";

/**
 * Information architecture — recruiter-first ordering. The order of this
 * array is the order of the page, the navigation and the index numbers.
 */
export const sections = [
  {
    id: "experience",
    index: "01",
    label: "Experience",
    title: "Experience",
    description:
      "From mechanical engineering to sole frontend developer on an enterprise platform — where I've worked and what I owned.",
  },
  {
    id: "projects",
    index: "02",
    label: "Projects",
    title: "Selected projects",
    description:
      "Production systems and an end-to-end build: the purpose, what I built, the hard part, and what changed.",
  },
  {
    id: "capabilities",
    index: "03",
    label: "Capabilities",
    title: "Capabilities",
    description:
      "The stack behind the work, grouped by domain — filter by where each technology was used.",
  },
  {
    id: "about",
    index: "04",
    label: "About",
    title: "About",
    description: "How I got here, and what I bring to a frontend team.",
  },
  {
    id: "contact",
    index: "05",
    label: "Contact",
    title: "Contact",
    description: "Email is the fastest way to reach me.",
  },
] as const satisfies readonly SectionDefinition[];

export type SectionId = (typeof sections)[number]["id"];

export const sectionIds: readonly SectionId[] = sections.map(
  (section) => section.id,
);

export function getSection(id: SectionId) {
  return sections.find((section) => section.id === id)!;
}

/** Fragment links resolve from any route back to the home page section. */
export function sectionHref(id: SectionId): Route {
  return `/#${id}` as Route;
}
