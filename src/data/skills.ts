export interface SkillCategory {
  title: string;
  type: "leadership" | "technical" | "frameworks";
  icon: string;
  skills: string[];
}

export const skills: SkillCategory[] = [
  {
    title: "Leadership",
    type: "leadership",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    skills: [
      "Engineering Management",
      "Team Building & Mentorship",
      "Technical Strategy",
      "Stakeholder Management",
      "Roadmap Planning",
      "Hiring & Retention",
    ],
  },
  {
    title: "Technical",
    type: "technical",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    skills: [
      "Front-End Architecture",
      "Performance Optimization",
      "Core Web Vitals",
      "System Design",
      "CI/CD Pipelines",
      "Platform Migrations",
    ],
  },
  {
    title: "Frameworks",
    type: "frameworks",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
    skills: [
      "React / Next.js",
      "Angular",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "GraphQL",
    ],
  },
];
