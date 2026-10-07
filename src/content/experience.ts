import type { TimelineEntry } from "./types";

/** Career timeline, newest first. Wording condensed from the résumé only. */
export const timeline: readonly TimelineEntry[] = [
  {
    id: "treeroot",
    kind: "work",
    organization: "Treeroot Informatics",
    role: "Frontend Developer",
    mode: "Remote",
    start: "Jun 2023",
    end: "Present",
    current: true,
    summary:
      "Sole frontend developer on an enterprise civic-communication SaaS platform for Dutch municipalities.",
    highlights: [
      {
        text: "Leading a module-by-module Vue 3 → React migration in production, with React shipped as a Git submodule so legacy and migrated modules run side by side.",
        projectId: "migration",
        emphasis: ["Vue 3 → React migration in production", "Git submodule"],
      },
      {
        text: "Engineered a map-based stakeholder-communication module that sends physical letters to recipients selected from groups or interactive map regions.",
        projectId: "stakeholder-communication",
        emphasis: [
          "map-based stakeholder-communication module",
          "physical letters",
        ],
      },
      {
        text: "Specified and built Updates V2, a drag-and-drop block editor (40 tickets across 10 epics from Figma analysis), plus a React Kanban board.",
        projectId: "stakeholder-communication",
        emphasis: ["Updates V2", "40 tickets across 10 epics"],
      },
      {
        text: "Built an internal Claude Code agent that regenerates the Expo / React Native app whenever the React web codebase changes.",
        projectId: "native-sync",
        emphasis: ["internal Claude Code agent"],
      },
      {
        text: "Integrated LaunchDarkly, Sentry and Product Fruits; delivered through GitLab merge requests and CI/CD to GKE, tracked in Shortcut.",
        emphasis: ["CI/CD to GKE"],
      },
      {
        text: "Previously built React and Redux financial dashboards for a Credit Management System serving Dutch enterprise clients.",
        emphasis: ["financial dashboards"],
      },
    ],
    stack: [
      "Vue 3",
      "Vuetify 3",
      "Leaflet",
      "TipTap",
      "Pinia",
      "Socket.io",
      "React",
      "Redux",
      "Claude Code",
      "LaunchDarkly",
      "Sentry",
      "GitLab CI/CD",
      "GKE",
    ],
  },
  {
    id: "sharpener",
    kind: "work",
    organization: "Sharpener.tech",
    role: "Frontend Developer",
    mode: "Internship",
    start: "Jul 2022",
    end: "Mar 2023",
    current: false,
    summary:
      "The move from a mechanical engineering background into professional software development, through structured, project-based training.",
    highlights: [
      {
        text: "Built and shipped frontend features with React.js, Redux and React Router.",
      },
    ],
    stack: ["React.js", "Redux", "React Router"],
  },
  {
    id: "abes",
    kind: "education",
    organization: "ABES Engineering College, Ghaziabad",
    role: "B.Tech, Mechanical Engineering",
    mode: null,
    start: "2014",
    end: "2018",
    current: false,
    summary: null,
    highlights: [],
    stack: [],
  },
];

/** Figures stated in the résumé, used as the timeline's at-a-glance panel. */
export const experienceStats = [
  { value: "3+", label: "Years building production interfaces" },
  { value: "Sole", label: "Frontend developer on an enterprise SaaS platform" },
  { value: "15", label: "Functional gaps scoped for a migrated page" },
  { value: "40 / 10", label: "Tickets / epics specified for Updates V2" },
] as const;
