export const GITHUB_ORG_URL = "https://github.com/filixpay";

export const OPEN_SOURCE_PROJECTS = {
  checkout: {
    slug: "checkout",
    path: "/open-source/checkout",
    github: "https://github.com/filixpay/filix-checkout",
    repoName: "filix-checkout",
  },
  saleor: {
    slug: "saleor",
    path: "/open-source/saleor",
    github: "https://github.com/filixpay/filixpay-saleor",
    repoName: "filixpay-saleor",
  },
  merchant: {
    slug: "merchant-portal",
    path: "/open-source/merchant-portal",
    github: "https://github.com/filixpay/filix-merchant",
    repoName: "filix-merchant",
  },
} as const;

export type OpenSourceProjectKey = keyof typeof OPEN_SOURCE_PROJECTS;
