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
    relatedSlugs: [],
    dashboardLinks: [
      {
        path: "/dashboard/configs",
        labelKey: "open_configs",
        primary: true,
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
    relatedSlugs: [],
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
    relatedSlugs: [],
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
    relatedSlugs: [],
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
    slug: "risk/refunds",
    domain: "risk",
    published: true,
    order: 10,
    relatedSlugs: [],
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
    relatedSlugs: [],
    dashboardLinks: [
      {
        path: "/dashboard/disputes",
        labelKey: "open_disputes",
        primary: true,
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
];
