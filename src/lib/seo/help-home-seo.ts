import type { HelpContentLocale } from "@/lib/help/content-locales";
import { isHelpContentLocale } from "@/lib/help/content-locales";

/** Brand+Help SEO for `/help` home (not Marketing payment-infra keywords). */
const HELP_HOME_SEO: Record<
  HelpContentLocale,
  { title: string; description: string; keywords: string[] }
> = {
  en: {
    title: "FilixPay Help Center | Merchant Center User Guide",
    description:
      "FilixPay Merchant Center Help Center with guides for merchant onboarding, payment setup, transactions, funds and settlements, product management, account security, and developer features.",
    keywords: [
      "FilixPay Help Center",
      "FilixPay Merchant Center",
      "Merchant Center user guide",
      "FilixPay merchant setup",
      "FilixPay payment configuration",
    ],
  },
  zh: {
    title: "FilixPay 帮助中心｜商户中心使用指南",
    description:
      "FilixPay 商户中心帮助中心，提供商户入驻、支付配置、交易管理、资金与结算、商品管理、账户安全及开发者功能使用指南。",
    keywords: [
      "FilixPay 帮助中心",
      "FilixPay 商户中心",
      "商户中心使用指南",
      "FilixPay 商户入驻",
      "FilixPay 支付配置",
    ],
  },
};

export function getHelpHomeSeo(locale: string) {
  const key: HelpContentLocale = isHelpContentLocale(locale) ? locale : "en";
  return HELP_HOME_SEO[key];
}
