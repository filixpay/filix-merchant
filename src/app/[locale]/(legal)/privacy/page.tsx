import type { Metadata } from "next";
import LegalDocumentView from "@/components/legal/LegalDocumentView";
import { getPrivacy } from "@/content/legal/loaders";
import {
  isLegalContentLocale,
  type LegalContentLocale,
} from "@/lib/legal/content-locales";
import { ensureLegalLocale } from "@/lib/legal/ensure-legal-locale";
import { generateLegalMetadata } from "@/lib/seo/generate-legal-metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateLegalMetadata({ locale, slug: "privacy" });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  ensureLegalLocale(locale, "privacy");

  const contentLocale: LegalContentLocale = isLegalContentLocale(locale)
    ? locale
    : "en";
  const document = getPrivacy(contentLocale);

  return <LegalDocumentView document={document} locale={contentLocale} />;
}
