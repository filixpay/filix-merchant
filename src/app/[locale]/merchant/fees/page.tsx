import type { Metadata } from "next";
import LegalDocumentView from "@/components/legal/LegalDocumentView";
import { getMerchantFees } from "@/content/legal/loaders";
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
  return generateLegalMetadata({ locale, slug: "merchant-fees" });
}

export default async function MerchantFeesPage({ params }: PageProps) {
  const { locale } = await params;
  ensureLegalLocale(locale, "merchant-fees");

  const contentLocale: LegalContentLocale = isLegalContentLocale(locale)
    ? locale
    : "en";
  const document = getMerchantFees(contentLocale);

  return <LegalDocumentView document={document} locale={contentLocale} />;
}
