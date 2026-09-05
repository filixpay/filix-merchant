import type { HelpContentLocale } from "@/lib/help/content-locales";

export type HelpDomainId =
  | "getting-started"
  | "merchant"
  | "payments"
  | "funds"
  | "risk"
  | "commerce"
  | "credit"
  | "developers"
  | "account";

export type HelpDashboardLink = {
  path: string;
  /** Key under `Help.dashboardLinks.*` in messages — never a hard-coded display string. */
  labelKey: string;
  primary?: boolean;
};

export type HelpBodyBlock =
  | { type: "paragraph"; text: string }
  | { type: "steps"; items: string[] }
  | { type: "fields"; rows: { field: string; description: string }[] }
  | { type: "issues"; items: { problem: string; solution: string }[] }
  | { type: "heading"; text: string; anchor?: string };

export type HelpBody = {
  whoFor: string;
  whenToUse: string;
  beforeYouStart: string[];
  blocks: HelpBodyBlock[];
  nextStep?: { label: string; href: string };
};

export type HelpArticle = {
  slug: string;
  domain: HelpDomainId;
  locale: HelpContentLocale;
  published: boolean;
  title: string;
  description: string;
  keywords: string[];
  order: number;
  relatedSlugs: string[];
  dashboardLinks?: HelpDashboardLink[];
  marketingPath?: string | null;
  developerPath?: string | null;
  /** Optional ISO date for sitemap lastModified; omit rather than inventing "now". */
  updatedAt?: string;
  body?: HelpBody;
};
