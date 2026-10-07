/** About — a professional story built only from résumé facts. */
export const story = [
  "I came to software from mechanical engineering. After a B.Tech at ABES Engineering College, I moved into frontend development through project-based training at Sharpener.tech, building with React, Redux and React Router.",
  "Since June 2023 I've worked remotely at Treeroot Informatics as the sole frontend developer on an enterprise civic-communication SaaS platform for Dutch municipalities — building its product modules, leading its Vue 3 → React migration in production, and shipping through GitLab CI/CD to GKE.",
  "AI is part of how I engineer: I built an internal Claude Code agent that keeps the Expo / React Native app in sync with the React web codebase. Outside work, I built Kora, a full-stack MERN commerce platform, end to end.",
] as const;

export const strengths = [
  {
    title: "Ownership",
    detail:
      "Sole frontend developer on a production enterprise platform since 2023.",
  },
  {
    title: "Migration in production",
    detail: "Vue 3 → React, module by module, without disrupting live users.",
  },
  {
    title: "Complex product UI",
    detail:
      "Map-based targeting, a mailing pipeline, a block editor, a Kanban board and financial dashboards.",
  },
  {
    title: "AI-augmented engineering",
    detail:
      "An internal Claude Code agent that replaced a manual web → native conversion step.",
  },
  {
    title: "Full-stack range",
    detail:
      "Kora: React 19, Express 5, MongoDB and three payment paths — built solo.",
  },
] as const;

export const education = {
  degree: "B.Tech, Mechanical Engineering",
  school: "ABES Engineering College, Ghaziabad",
  period: "2014 – 2018",
} as const;

export const languages = [
  { name: "Hindi", level: "Native" },
  { name: "English", level: "Fluent — speaking, reading, writing" },
] as const;
