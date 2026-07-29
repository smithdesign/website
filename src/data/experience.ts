export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  logo: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  isCurrent: boolean;
}

export interface Education {
  institution: string;
  years: string;
}

export interface Award {
  title: string;
}

export const experience: ExperienceEntry[] = [
  {
    id: "amazon-zappos",
    role: "Software Development Manager III",
    company: "Amazon/Zappos",
    logo: "/logos/amazon_logo.jpeg",
    startDate: "July 2022",
    endDate: "Present",
    location: "Las Vegas Metropolitan Area",
    description:
      "Managing 8–16 engineers through a full-scale migration of Zappos.com from a legacy platform to Next.js — delivering 20% faster page loads, 40% improvement in Core Web Vitals, and 5x faster builds (100x for incremental). The migration unlocked 35% faster feature development (saving 145 SDE-hours/week), cut developer onboarding time by 50%, and resolved multi-marketplace scalability limitations that had constrained growth.",
    isCurrent: true,
  },
  {
    id: "koddi",
    role: "Software Engineering Manager",
    company: "Koddi",
    logo: "/logos/koddi_logo.jpeg",
    startDate: "January 2018",
    endDate: "July 2022",
    location: "Fort Worth, Texas (Remote)",
    description:
      "Led a team of 5 engineers owning the front end across all Koddi products. Evolved the Koddi Demand platform for travel advertisers and built the Koddi Ads platform for retailers from the ground up using React and Go. Grew and mentored the team while driving a major replatforming of the core UI application.",
    isCurrent: false,
  },
  {
    id: "criteo",
    role: "Sr. Software Engineer",
    company: "Criteo",
    logo: "/logos/criteo_logo.jpeg",
    startDate: "January 2017",
    endDate: "January 2018",
    location: "New York, New York",
    description:
      "Continued evolving the TravelAds platform post-acquisition, completing the full migration from .NET to C# and Angular. Improved application performance and maintainability across Criteo's travel advertising suite.",
    isCurrent: false,
  },
  {
    id: "hooklogic",
    role: "Senior Software Developer I - UX Tech Lead",
    company: "HookLogic",
    logo: "/logos/hook.jpeg",
    startDate: "October 2014",
    endDate: "December 2016",
    location: "New York, New York",
    description:
      "Led and implemented the replatforming of HookLogic's travel and retail UIs from .NET to Angular, improving application performance by over 400%. HookLogic was successfully acquired by Criteo in 2016.",
    isCurrent: false,
  },
  {
    id: "centurion",
    role: "User Interface Engineer",
    company: "Centurion Medical Products",
    logo: "/logos/centurion.jpeg",
    startDate: "July 2013",
    endDate: "October 2014",
    location: "Williamston, Michigan",
    description:
      "Led Marketing and IT teams to develop coding and mobile standards, cutting development time in half. Implemented a Digital Asset Management system, saving the company over $250,000. Built an iPad Instrument Catalog for outside sales reps, integrating real-time SAP data.",
    isCurrent: false,
  },
  {
    id: "jackson-interactive",
    role: "Interactive Web Developer",
    company: "Jackson National Life",
    logo: "/logos/jackson_logo.jpeg",
    startDate: "November 2012",
    endDate: "July 2013",
    location: "Lansing, Michigan",
    description:
      "Developed interactive web applications and rich media experiences for Jackson's financial services platforms, enhancing user engagement and client-facing tools.",
    isCurrent: false,
  },
  {
    id: "ibm",
    role: "Senior Web Developer",
    company: "IBM Global Business Services",
    logo: "/logos/ibm_logo.jpeg",
    startDate: "May 2012",
    endDate: "November 2012",
    location: "Lansing, Michigan",
    description:
      "Instrumental in developing a cash management application for a Fortune 500 company with a development budget of over a million dollars.",
    isCurrent: false,
  },
  {
    id: "jackson",
    role: "Web Developer",
    company: "Jackson National Life",
    logo: "/logos/jackson_logo.jpeg",
    startDate: "November 2008",
    endDate: "May 2012",
    location: "Lansing, Michigan",
    description:
      "Designed and built front-end web applications for Jackson's broker-dealer subsidiary companies.",
    isCurrent: false,
  },
  {
    id: "earlier-career",
    role: "Earlier Career",
    company: "Meijer, gNetworks, Smith Design Services",
    logo: "",
    startDate: "April 2002",
    endDate: "November 2007",
    location: "Grand Rapids, Michigan",
    description:
      "Web development and project management roles including e-commerce platform development at Meijer (500K+ email subscribers), cross-functional project delivery at gNetworks, and founding a freelance web design studio serving local businesses.",
    isCurrent: false,
  },
];

export const education: Education[] = [
  { institution: "Davenport University", years: "2004-2006" },
];

export const awards: Award[] = [
  { title: "Web Developer of the Month" },
];
