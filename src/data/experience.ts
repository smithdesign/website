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
      "Leading a multi-year digital transformation of Zappos.com's legacy frontend to a modern Next.js architecture, improving development velocity, reducing technical debt, and enhancing scalability across multiple marketplaces. Driving Core Web Vitals optimization and site performance improvements to elevate customer experience for millions of users. Partnering with product, design, and platform teams to align engineering roadmaps with strategic business priorities.",
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
      "Led a team of developers and was responsible for all of Koddi's UI applications. Grew and mentored a team of UI developers and led a major replatforming of the main UI application.",
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
      "Architected, built and maintained UI for Criteo's travel ad platform.",
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
      "Led and implemented the replatforming of HookLogic's travel and retail UIs from .NET to Angular. This improved application performance by over 400%.",
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
    id: "gnetworks",
    role: "Project Manager",
    company: "gNetworks",
    logo: "/logos/gnetworks.svg",
    startDate: "December 2007",
    endDate: "March 2008",
    location: "Grand Rapids, Michigan",
    description:
      "Managed web development projects and coordinated cross-functional teams to deliver client solutions on time and within budget.",
    isCurrent: false,
  },
  {
    id: "meijer",
    role: "Web Designer/Developer",
    company: "Meijer",
    logo: "/logos/meijer_logo.jpeg",
    startDate: "November 2006",
    endDate: "November 2007",
    location: "Grand Rapids, Michigan",
    description:
      "Designed and developed content for Meijer's major marketing events. Advised and assisted with the transition to new ecommerce platform. Managed email marketing platform with over 500,000 subscribers.",
    isCurrent: false,
  },
  {
    id: "smith-design",
    role: "Web Designer",
    company: "Smith Design Services",
    logo: "/logos/smith-design.svg",
    startDate: "April 2002",
    endDate: "October 2006",
    location: "Grand Rapids, Michigan",
    description:
      "Founded and operated a freelance web design studio, delivering custom websites and branding solutions for small businesses and local organizations.",
    isCurrent: false,
  },
];

export const education: Education[] = [
  { institution: "Davenport University", years: "2004-2006" },
];

export const awards: Award[] = [
  { title: "Web Developer of the Month" },
];
