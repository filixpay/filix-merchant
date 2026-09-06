import type { LegalSlug } from "@/lib/legal/content-locales";

export type LegalPublicationStatus = "draft" | "final";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type LegalDocument = {
  slug: LegalSlug;
  status: LegalPublicationStatus;
  title: string;
  effectiveDate: string | null;
  lastUpdated: string | null;
  notice: string;
  sections: LegalSection[];
};
