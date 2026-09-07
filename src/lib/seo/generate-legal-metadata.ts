import type { Metadata } from "next";
import { getLegalDocument } from "@/content/legal/loaders";
import {
  LEGAL_CONTENT_LOCALES,
  legalDocumentPath,
  type LegalSlug,
} from "@/lib/legal/content-locales";
import { ensureLegalLocale } from "@/lib/legal/ensure-legal-locale";
import { buildHelpAlternates, buildPageMetadata } from "@/lib/seo/metadata";

const SEO_COPY: Record<
  LegalSlug,
  Record<"en" | "zh", { title: string; description: string }>
> = {
  terms: {
    en: {
      title: "Terms of Service | FilixPay",
      description:
        "FilixPay Terms of Service framework for merchant and payment infrastructure platform use.",
    },
    zh: {
      title: "服务条款｜FilixPay",
      description:
        "FilixPay 商户与支付基础设施平台服务条款框架。",
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy | FilixPay",
      description:
        "FilixPay Privacy Policy framework describing how information may be collected and used.",
    },
    zh: {
      title: "隐私政策｜FilixPay",
      description:
        "FilixPay 隐私政策框架，说明信息可能如何被收集与使用。",
    },
  },
  "merchant-terms": {
    en: {
      title: "Merchant Service Agreement | FilixPay",
      description:
        "FilixPay Merchant Service Agreement for merchant onboarding and merchant services.",
    },
    zh: {
      title: "商户服务协议｜FilixPay",
      description: "FilixPay 商户服务协议，适用于商户入驻与商户服务。",
    },
  },
  "merchant-fees": {
    en: {
      title: "Merchant Service & Fee Rules | FilixPay",
      description:
        "FilixPay merchant service-fee rates, monthly billing, and RMB 500 payment threshold.",
    },
    zh: {
      title: "商户服务与收费规则｜FilixPay",
      description:
        "FilixPay 商户服务费率、月度账单与人民币 500 元付款阈值说明。",
    },
  },
};

export async function generateLegalMetadata(input: {
  locale: string;
  slug: LegalSlug;
}): Promise<Metadata> {
  const { locale, slug } = input;
  ensureLegalLocale(locale, slug);

  const doc = getLegalDocument(slug, locale);
  const copy = SEO_COPY[slug][locale === "zh" ? "zh" : "en"];
  const path = legalDocumentPath(slug);

  const base = buildPageMetadata({
    locale,
    path,
    title: copy.title,
    description: copy.description,
    robots:
      doc.status === "draft"
        ? { index: false, follow: true }
        : { index: true, follow: true },
  });

  const alternates = buildHelpAlternates(
    locale,
    path,
    LEGAL_CONTENT_LOCALES,
  );

  return {
    ...base,
    alternates,
    openGraph: {
      ...base.openGraph,
      url: alternates.canonical,
    },
  };
}
