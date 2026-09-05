import type { HelpDashboardLink, HelpDomainId } from "./types";

/** Shared structural defs; locale strings filled in en/zh modules in Task 7+. */
export type HelpArticleDef = {
  slug: string;
  domain: HelpDomainId;
  published: boolean;
  order: number;
  relatedSlugs: string[];
  dashboardLinks?: HelpDashboardLink[];
  marketingPath?: string | null;
  developerPath?: string | null;
  /** ISO date for sitemap; omit rather than inventing "now". */
  updatedAt?: string;
};

export const HELP_ARTICLE_DEFS: HelpArticleDef[] = [
  {
    slug: "getting-started/merchant-setup",
    domain: "getting-started",
    published: true,
    order: 10,
    relatedSlugs: [],
    dashboardLinks: [
      {
        path: "/dashboard/onboarding/status",
        labelKey: "open_onboarding_status",
        primary: true,
      },
      {
        path: "/dashboard/onboarding/apply",
        labelKey: "open_onboarding_apply",
      },
    ],
  },
  {
    slug: "getting-started/payment-channel",
    domain: "getting-started",
    published: true,
    order: 20,
    relatedSlugs: ["developers/payment-channels"],
    dashboardLinks: [
      {
        path: "/dashboard/configs",
        labelKey: "open_configs",
      },
    ],
  },
  {
    slug: "getting-started/create-product",
    domain: "getting-started",
    published: true,
    order: 30,
    relatedSlugs: [],
    dashboardLinks: [
      {
        path: "/dashboard/commerce/products/new",
        labelKey: "open_products_new",
        primary: true,
      },
    ],
  },
  {
    slug: "getting-started/publish-product",
    domain: "getting-started",
    published: true,
    order: 40,
    relatedSlugs: [],
    dashboardLinks: [
      {
        path: "/dashboard/commerce/products",
        labelKey: "open_products",
        primary: true,
      },
    ],
  },
  {
    slug: "payments/orders",
    domain: "payments",
    published: true,
    order: 10,
    relatedSlugs: ["payments/customers", "payments/payment-splits"],
    dashboardLinks: [
      {
        path: "/dashboard/orders",
        labelKey: "open_orders",
        primary: true,
      },
    ],
  },
  {
    slug: "payments/offline-collection",
    domain: "payments",
    published: true,
    order: 20,
    relatedSlugs: [],
    dashboardLinks: [
      {
        path: "/dashboard/transfers",
        labelKey: "open_transfers",
        primary: true,
      },
      {
        path: "/dashboard/reviews",
        labelKey: "open_reviews",
      },
    ],
  },
  {
    slug: "payments/customers",
    domain: "payments",
    published: true,
    order: 30,
    relatedSlugs: ["payments/orders"],
    dashboardLinks: [
      {
        path: "/dashboard/customers",
        labelKey: "open_customers",
        primary: true,
      },
    ],
  },
  {
    slug: "payments/payment-splits",
    domain: "payments",
    published: true,
    order: 40,
    relatedSlugs: ["payments/orders"],
    dashboardLinks: [
      {
        path: "/dashboard/payment-splits",
        labelKey: "open_payment_splits",
        primary: true,
      },
    ],
  },
  {
    slug: "payments/checkouts",
    domain: "payments",
    published: false,
    order: 99,
    relatedSlugs: [],
  },
  {
    slug: "funds/balance",
    domain: "funds",
    published: true,
    order: 10,
    relatedSlugs: [],
    dashboardLinks: [
      {
        path: "/dashboard/money/balance",
        labelKey: "open_balance",
        primary: true,
      },
      {
        path: "/dashboard/money/activity",
        labelKey: "open_activity",
      },
    ],
  },
  {
    slug: "funds/money-in",
    domain: "funds",
    published: true,
    order: 20,
    relatedSlugs: ["funds/crypto"],
    dashboardLinks: [
      {
        path: "/dashboard/money/money-in",
        labelKey: "open_money_in",
        primary: true,
      },
    ],
  },
  {
    slug: "funds/payouts",
    domain: "funds",
    published: true,
    order: 30,
    relatedSlugs: ["funds/external-accounts"],
    dashboardLinks: [
      {
        path: "/dashboard/money/payouts",
        labelKey: "open_payouts",
        primary: true,
      },
    ],
  },
  {
    slug: "funds/settlements",
    domain: "funds",
    published: true,
    order: 40,
    relatedSlugs: [],
    dashboardLinks: [
      {
        path: "/dashboard/money/settlements",
        labelKey: "open_settlements",
        primary: true,
      },
    ],
  },
  {
    slug: "funds/reconciliation",
    domain: "funds",
    published: true,
    order: 50,
    relatedSlugs: [],
    dashboardLinks: [
      {
        path: "/dashboard/money/transaction-reconciliation",
        labelKey: "open_reconciliation",
        primary: true,
      },
    ],
  },
  {
    slug: "funds/external-accounts",
    domain: "funds",
    published: true,
    order: 60,
    relatedSlugs: ["funds/payouts"],
    dashboardLinks: [
      {
        path: "/dashboard/money/external-accounts",
        labelKey: "open_external_accounts",
        primary: true,
      },
    ],
  },
  {
    slug: "funds/crypto",
    domain: "funds",
    published: true,
    order: 70,
    relatedSlugs: ["funds/money-in"],
    dashboardLinks: [
      {
        path: "/dashboard/money/crypto",
        labelKey: "open_crypto",
        primary: true,
      },
    ],
  },
  {
    slug: "risk/refunds",
    domain: "risk",
    published: true,
    order: 10,
    relatedSlugs: ["risk/controls"],
    dashboardLinks: [
      {
        path: "/dashboard/refunds",
        labelKey: "open_refunds",
        primary: true,
      },
    ],
  },
  {
    slug: "risk/disputes",
    domain: "risk",
    published: true,
    order: 20,
    relatedSlugs: ["risk/controls"],
    dashboardLinks: [
      {
        path: "/dashboard/disputes",
        labelKey: "open_disputes",
        primary: true,
      },
    ],
  },
  {
    slug: "risk/controls",
    domain: "risk",
    published: true,
    order: 30,
    relatedSlugs: ["risk/disputes", "risk/refunds"],
    dashboardLinks: [
      {
        path: "/dashboard/fraud",
        labelKey: "open_fraud",
        primary: true,
      },
      {
        path: "/dashboard/risk-reviews",
        labelKey: "open_risk_reviews",
      },
      {
        path: "/dashboard/risk-rules",
        labelKey: "open_risk_rules",
      },
    ],
  },
  {
    slug: "commerce/products",
    domain: "commerce",
    published: true,
    order: 10,
    relatedSlugs: [
      "commerce/products/create",
      "commerce/products/publish",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/commerce/products",
        labelKey: "open_products",
        primary: true,
      },
    ],
  },
  {
    slug: "commerce/products/create",
    domain: "commerce",
    published: true,
    order: 20,
    relatedSlugs: [
      "commerce/products/publish",
      "commerce/products",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/commerce/products/new",
        labelKey: "open_products_new",
        primary: true,
      },
    ],
  },
  {
    slug: "commerce/products/publish",
    domain: "commerce",
    published: true,
    order: 30,
    relatedSlugs: [
      "commerce/products/create",
      "commerce/products",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/commerce/products",
        labelKey: "open_products",
        primary: true,
      },
    ],
  },
  {
    slug: "developers/developer-center",
    domain: "developers",
    published: true,
    order: 10,
    relatedSlugs: [
      "developers/webhooks",
      "developers/payment-channels",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/developer",
        labelKey: "open_developer_center",
        primary: true,
      },
    ],
    marketingPath: "/developers",
  },
  {
    slug: "developers/webhooks",
    domain: "developers",
    published: true,
    order: 20,
    relatedSlugs: ["developers/developer-center"],
    dashboardLinks: [
      {
        path: "/dashboard/developer/webhook-verification",
        labelKey: "open_webhook_verification",
        primary: true,
      },
      {
        path: "/dashboard/developer",
        labelKey: "open_developer_center",
      },
    ],
    marketingPath: "/developers",
  },
  {
    slug: "developers/payment-channels",
    domain: "developers",
    published: true,
    order: 30,
    relatedSlugs: [
      "getting-started/payment-channel",
      "developers/developer-center",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/configs",
        labelKey: "open_configs",
        primary: true,
      },
    ],
    marketingPath: "/developers",
  },
];
