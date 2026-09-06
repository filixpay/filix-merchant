import type { LegalSlug } from "@/lib/legal/content-locales";

export type LegalPublicationStatus = "draft" | "final";

/** One numbered section or subsection (e.g. 2.1). */
export type LegalBlock = {
  id: string;
  title: string;
  paragraphs?: string[];
  /** Definition list entries (term + explanation). */
  definitions?: { term: string; text: string }[];
  bullets?: string[];
  /** Numbered list items (1., 2., …). */
  orderedBullets?: string[];
  subsections?: LegalBlock[];
};

export type LegalSection = LegalBlock;

export type LegalDocument = {
  slug: LegalSlug;
  status: LegalPublicationStatus;
  title: string;
  /** ISO YYYY-MM-DD. Omit until legal confirms when the version takes effect. */
  effectiveDate?: string;
  /** ISO YYYY-MM-DD — when this page was last revised. */
  lastUpdated: string;
  /** Empty/null = no draft banner (production copy). */
  notice: string | null;
  sections: LegalSection[];
};
