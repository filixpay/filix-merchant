export type PublicRoute = {
  path: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

export const PUBLIC_ROUTES: PublicRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/products", changeFrequency: "monthly", priority: 0.8 },
  { path: "/products/payment-platform", changeFrequency: "monthly", priority: 0.9 },
  { path: "/products/merchant-center", changeFrequency: "monthly", priority: 0.9 },
  { path: "/developers", changeFrequency: "monthly", priority: 0.9 },
  { path: "/for-enterprise", changeFrequency: "monthly", priority: 0.85 },
  { path: "/products/payment-splitting", changeFrequency: "monthly", priority: 0.8 },
  { path: "/products/risk-control", changeFrequency: "monthly", priority: 0.8 },
  { path: "/products/credit-payment", changeFrequency: "monthly", priority: 0.8 },
  { path: "/products/crypto-payment", changeFrequency: "monthly", priority: 0.8 },
  { path: "/products/private-deployment", changeFrequency: "monthly", priority: 0.85 },
  { path: "/deployment", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions", changeFrequency: "monthly", priority: 0.8 },
  { path: "/solutions/cross-border-ecommerce", changeFrequency: "monthly", priority: 0.8 },
  { path: "/technology", changeFrequency: "monthly", priority: 0.8 },
  { path: "/technology/architecture", changeFrequency: "monthly", priority: 0.8 },
  { path: "/technology/identity", changeFrequency: "monthly", priority: 0.8 },
  { path: "/technology/performance", changeFrequency: "monthly", priority: 0.8 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.6 },
  { path: "/resources/case-studies", changeFrequency: "monthly", priority: 0.6 },
  { path: "/resources/case-studies/micselect", changeFrequency: "monthly", priority: 0.6 },
  { path: "/resources/compliance", changeFrequency: "monthly", priority: 0.6 },
  { path: "/resources/reconciliation-settlement", changeFrequency: "monthly", priority: 0.6 },
  { path: "/resources/blog", changeFrequency: "monthly", priority: 0.6 },
  { path: "/resources/downloads", changeFrequency: "monthly", priority: 0.6 },
  { path: "/whitepaper", changeFrequency: "monthly", priority: 0.6 },
];
