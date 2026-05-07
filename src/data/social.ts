export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  { platform: "LinkedIn", url: "https://linkedin.com/in/tobby/", icon: "linkedin", label: "Connect on LinkedIn" },
  { platform: "GitHub", url: "https://github.com/smithdesign", icon: "github", label: "View GitHub profile" },
  { platform: "Twitter", url: "https://twitter.com/tobbysmith", icon: "twitter", label: "Follow on Twitter" },
  { platform: "Facebook", url: "https://facebook.com/tobbysmith", icon: "facebook", label: "Connect on Facebook" },
];
