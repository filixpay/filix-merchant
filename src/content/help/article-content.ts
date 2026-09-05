import type { HelpBody } from "./types";
import type { HelpContentLocale } from "@/lib/help/content-locales";
import { enGettingStarted } from "./en/getting-started";
import { enPayments } from "./en/payments";
import { enFunds } from "./en/funds";
import { enRisk } from "./en/risk";
import { enCommerce } from "./en/commerce";
import { enDevelopers } from "./en/developers";
import { zhGettingStarted } from "./zh/getting-started";
import { zhPayments } from "./zh/payments";
import { zhFunds } from "./zh/funds";
import { zhRisk } from "./zh/risk";
import { zhCommerce } from "./zh/commerce";

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
    ...enDevelopers,
  },
  zh: {
    ...zhGettingStarted,
    ...zhPayments,
    ...zhFunds,
    ...zhRisk,
    ...zhCommerce,
  },
};
