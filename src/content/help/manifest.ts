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
    relatedSlugs: ["payments/customers", "payments/payment-splits", "payments/transaction-reports"],
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
    slug: "payments/transaction-reports",
    domain: "payments",
    published: true,
    order: 50,
    relatedSlugs: ["payments/orders", "funds/reconciliation"],
    dashboardLinks: [
      {
        path: "/dashboard/reporting/transactions",
        labelKey: "open_transaction_reports",
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
    slug: "merchant/organization",
    domain: "merchant",
    published: true,
    order: 10,
    relatedSlugs: [
      "getting-started/merchant-setup",
      "account/maintenance",
      "merchant/locations",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/organization",
        labelKey: "open_organization",
        primary: true,
      },
    ],
  },
  {
    slug: "merchant/locations",
    domain: "merchant",
    published: true,
    order: 20,
    relatedSlugs: [
      "merchant/organization",
      "developers/payment-channels",
      "payments/orders",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/locations",
        labelKey: "open_locations",
        primary: true,
      },
      {
        path: "/dashboard/sub-merchants",
        labelKey: "open_sub_merchants",
      },
    ],
  },
  {
    slug: "funds/balance",
    domain: "funds",
    published: true,
    order: 10,
    relatedSlugs: ["funds/transfers"],
    dashboardLinks: [
      {
        path: "/dashboard/money/balance",
        labelKey: "open_balance",
        primary: true,
      },
      {
        path: "/dashboard/money/activity",
        labelKey: "open_activity",
        hash: "activity",
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
    relatedSlugs: ["funds/external-accounts", "funds/transfers"],
    dashboardLinks: [
      {
        path: "/dashboard/money/payouts",
        labelKey: "open_payouts",
        primary: true,
      },
    ],
  },
  {
    slug: "funds/transfers",
    domain: "funds",
    published: true,
    order: 35,
    relatedSlugs: ["funds/balance", "account/security", "funds/payouts"],
    dashboardLinks: [
      {
        path: "/dashboard/money/transfers",
        labelKey: "open_money_transfers",
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
      {
        path: "/dashboard/money/settlements/statements",
        labelKey: "open_settlement_statements",
        hash: "statements",
      },
    ],
  },
  {
    slug: "funds/reconciliation",
    domain: "funds",
    published: true,
    order: 50,
    relatedSlugs: ["funds/settlements", "payments/transaction-reports"],
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
      {
        path: "/dashboard/refunds/settings",
        labelKey: "open_refund_settings",
        hash: "settings",
      },
      {
        path: "/dashboard/refunds/approvals",
        labelKey: "open_refund_approvals",
        hash: "approvals",
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
    relatedSlugs: ["risk/disputes", "risk/refunds", "risk/coverage"],
    dashboardLinks: [
      {
        path: "/dashboard/fraud",
        labelKey: "open_fraud",
        primary: true,
        hash: "fraud",
      },
      {
        path: "/dashboard/risk-reviews",
        labelKey: "open_risk_reviews",
        hash: "reviews",
      },
      {
        path: "/dashboard/risk-rules",
        labelKey: "open_risk_rules",
        hash: "rules",
      },
    ],
  },
  {
    slug: "risk/coverage",
    domain: "risk",
    published: true,
    order: 40,
    relatedSlugs: ["risk/disputes", "risk/controls"],
    dashboardLinks: [
      {
        path: "/dashboard/coverage-insurance",
        labelKey: "open_coverage_insurance",
        primary: true,
        hash: "insurance",
      },
      {
        path: "/dashboard/coverage-config",
        labelKey: "open_coverage_config",
        hash: "config",
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
  {
    slug: "credit/limit",
    domain: "credit",
    published: true,
    order: 10,
    relatedSlugs: ["credit/available-credit"],
    dashboardLinks: [
      {
        path: "/dashboard/credit/limit",
        labelKey: "open_credit_limit",
        primary: true,
      },
    ],
  },
  {
    slug: "credit/available-credit",
    domain: "credit",
    published: true,
    order: 20,
    relatedSlugs: ["credit/limit"],
    dashboardLinks: [
      {
        path: "/dashboard/member-credit/available-credit",
        labelKey: "open_available_credit",
        primary: true,
      },
    ],
  },
  {
    slug: "account/notifications",
    domain: "account",
    published: true,
    order: 10,
    relatedSlugs: ["account/audit-logs", "account/maintenance", "account/security"],
    dashboardLinks: [
      {
        path: "/dashboard/notifications",
        labelKey: "open_notifications",
        primary: true,
      },
    ],
  },
  {
    slug: "account/audit-logs",
    domain: "account",
    published: true,
    order: 20,
    relatedSlugs: [
      "account/notifications",
      "account/security",
      "developers/developer-center",
      "risk/controls",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/audit-logs",
        labelKey: "open_audit_logs",
        primary: true,
      },
    ],
  },
  {
    slug: "account/security",
    domain: "account",
    published: true,
    order: 25,
    relatedSlugs: [
      "account/maintenance",
      "account/audit-logs",
      "funds/payouts",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/security-settings/transaction-password",
        labelKey: "open_transaction_password",
        primary: true,
      },
    ],
  },
  {
    slug: "account/maintenance",
    domain: "account",
    published: true,
    order: 30,
    relatedSlugs: [
      "account/close-account",
      "account/security",
      "funds/external-accounts",
      "getting-started/merchant-setup",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/maintenance/profile",
        labelKey: "open_maintenance_profile",
        primary: true,
      },
      {
        path: "/dashboard/maintenance/changes",
        labelKey: "open_maintenance_changes",
      },
      {
        path: "/dashboard/maintenance/contact",
        labelKey: "open_maintenance_contact",
      },
    ],
  },
  {
    slug: "account/service-plan",
    domain: "account",
    published: true,
    order: 35,
    relatedSlugs: ["payments/orders", "account/close-account"],
    dashboardLinks: [
      {
        path: "/dashboard/service-plan",
        labelKey: "open_service_plan",
        primary: true,
      },
    ],
  },
  {
    slug: "account/close-account",
    domain: "account",
    published: true,
    order: 40,
    relatedSlugs: [
      "account/maintenance",
      "account/service-plan",
      "funds/balance",
    ],
    dashboardLinks: [
      {
        path: "/dashboard/settings/close-account",
        labelKey: "open_close_account",
        primary: true,
      },
    ],
  },
];
