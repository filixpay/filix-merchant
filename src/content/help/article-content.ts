import type { HelpBody } from "./types";
import type { HelpContentLocale } from "@/lib/help/content-locales";
import { enGettingStarted } from "./en/getting-started";
import { enPayments } from "./en/payments";
import { enFunds } from "./en/funds";
import { enRisk } from "./en/risk";
import { enCommerce } from "./en/commerce";
import { enCredit } from "./en/credit";
import { enDevelopers } from "./en/developers";
import { enAccount } from "./en/account";
import { enMerchant } from "./en/merchant";
import { zhGettingStarted } from "./zh/getting-started";
import { zhPayments } from "./zh/payments";
import { zhFunds } from "./zh/funds";
import { zhRisk } from "./zh/risk";
import { zhCommerce } from "./zh/commerce";
import { zhCredit } from "./zh/credit";
import { zhDevelopers } from "./zh/developers";
import { zhAccount } from "./zh/account";
import { zhMerchant } from "./zh/merchant";

export type HelpArticleContent = {
  title: string;
  description: string;
  keywords: string[];
  body?: HelpBody;
};

export const HELP_ARTICLE_CONTENT: Record<
  HelpContentLocale,
  Record<string, HelpArticleContent>
> = {
  en: {
    ...enGettingStarted,
    ...enPayments,
    ...enFunds,
    ...enRisk,
    ...enCommerce,
    ...enCredit,
    ...enDevelopers,
    ...enAccount,
    ...enMerchant,
  },
  zh: {
    ...zhGettingStarted,
    ...zhPayments,
    ...zhFunds,
    ...zhRisk,
    ...zhCommerce,
    ...zhCredit,
    ...zhDevelopers,
    ...zhAccount,
    ...zhMerchant,
  },
};
