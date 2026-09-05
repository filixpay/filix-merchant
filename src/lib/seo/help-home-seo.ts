import type { HelpContentLocale } from "@/lib/help/content-locales";
import { isHelpContentLocale } from "@/lib/help/content-locales";

/** Brand+Help SEO for `/help` home (not Marketing payment-infra keywords). */
const HELP_HOME_SEO: Record<
  HelpContentLocale,
  { title: string; description: string; keywords: string[] }
> = {
  en: {
    title: "FilixPay Help — Merchant Center guides",
    description:
      "Learn how to use FilixPay Merchant Center: set up your merchant, create products, manage payments, funds, and more.",
    keywords: [
      "FilixPay Help",
      "FilixPay Merchant Center",
      "merchant guide",
      "how to use FilixPay",
    ],
  },
  zh: {
    title: "FilixPay 帮助 — 商户中心使用指南",
    description:
      "了解如何使用 FilixPay 商户中心：完成商户开通、创建商品、管理支付与资金等。",
    keywords: [
      "FilixPay 帮助",
      "FilixPay 商户中心",
      "商户指南",
      "如何使用 FilixPay",
    ],
  },
};

export function getHelpHomeSeo(locale: string) {
  const key: HelpContentLocale = isHelpContentLocale(locale) ? locale : "en";
  return HELP_HOME_SEO[key];
}
