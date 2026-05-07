export interface SkillCategory {
  title: string;
  type: "leadership" | "technical";
  skills: string[];
}

export const skills: SkillCategory[] = [
  {
    title: "Leadership",
    type: "leadership",
    skills: [
      "Engineering Management",
      "Team Building & Mentorship",
      "Technical Strategy",
      "Stakeholder Management",
    ],
  },
  {
    title: "Technical",
    type: "technical",
    skills: [
      "Front-End Architecture",
      "React/Next.js",
      "Angular",
      "JavaScript/TypeScript",
      "HTML/CSS",
      "Core Web Vitals",
      "Performance Optimization",
    ],
  },
];
