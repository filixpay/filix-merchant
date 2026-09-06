import type { HelpDomainId } from "./types";

export type HelpDomainMeta = {
  id: HelpDomainId;
  order: number;
  /** true only for getting-started funnel section */
  isGettingStarted: boolean;
  /** Short label for Help home category cards and in-page nav. */
  title: { en: string; zh: string };
  /**
   * Branded H1 on `/{locale}/help/{domain}` (and base for document title).
   * Keep FilixPay + Merchant Center intent explicit for SEO.
   */
  heading: { en: string; zh: string };
  description: { en: string; zh: string };
};

export const HELP_DOMAINS: HelpDomainMeta[] = [
  {
    id: "getting-started",
    order: 0,
    isGettingStarted: true,
    title: { en: "Getting Started", zh: "快速开始" },
    heading: {
      en: "FilixPay Merchant Getting Started",
      zh: "FilixPay 商户快速开始",
    },
    description: {
      en: "Set up FilixPay Merchant Center: complete merchant onboarding, configure your first payment channel, and create and publish your first product.",
      zh: "完成 FilixPay 商户中心入驻设置、配置首个支付通道，并创建与发布第一个商品。",
    },
  },
  {
    id: "merchant",
    order: 1,
    isGettingStarted: false,
    title: { en: "Merchant & Organization", zh: "商户与组织" },
    heading: {
      en: "FilixPay Merchant & Organization",
      zh: "FilixPay 商户与组织",
    },
    description: {
      en: "Manage FilixPay organization business accounts, members, teams, roles, sub-merchants, and operating locations.",
      zh: "管理 FilixPay 组织业务账户、成员、团队、角色，以及子商户与经营场所。",
    },
  },
  {
    id: "payments",
    order: 2,
    isGettingStarted: false,
    title: { en: "Payments & Transactions", zh: "支付与交易" },
    heading: {
      en: "FilixPay Payments & Transactions",
      zh: "FilixPay 支付与交易",
    },
    description: {
      en: "Manage FilixPay orders, customers, payment splits, offline collection, and transaction reports in Merchant Center.",
      zh: "在 FilixPay 商户中心管理订单、客户、分账、线下归集与交易报表。",
    },
  },
  {
    id: "funds",
    order: 3,
    isGettingStarted: false,
    title: { en: "Funds", zh: "资金" },
    heading: {
      en: "FilixPay Funds & Settlements",
      zh: "FilixPay 资金与结算",
    },
    description: {
      en: "Learn FilixPay balance, money-in, payouts, transfers, external accounts, crypto deposits, settlements, and reconciliation.",
      zh: "了解 FilixPay 余额、入金、出金、转账、外部账户、数字货币入金、结算与对账。",
    },
  },
  {
    id: "risk",
    order: 4,
    isGettingStarted: false,
    title: { en: "After-Sales & Risk", zh: "售后与风控" },
    heading: {
      en: "FilixPay After-Sales & Risk",
      zh: "FilixPay 售后与风控",
    },
    description: {
      en: "Handle FilixPay refunds, disputes, fraud events, risk reviews, risk rules, and chargeback coverage.",
      zh: "处理 FilixPay 退款、争议、欺诈事件、风险审核、风险规则与拒付保障。",
    },
  },
  {
    id: "commerce",
    order: 5,
    isGettingStarted: false,
    title: { en: "Commerce", zh: "商务" },
    heading: {
      en: "FilixPay Product Management",
      zh: "FilixPay 商品管理",
    },
    description: {
      en: "Create, manage, and publish products in FilixPay Merchant Center.",
      zh: "在 FilixPay 商户中心创建、管理并发布商品。",
    },
  },
  {
    id: "credit",
    order: 6,
    isGettingStarted: false,
    title: { en: "Credit", zh: "授信" },
    heading: {
      en: "FilixPay Credit",
      zh: "FilixPay 授信",
    },
    description: {
      en: "Manage FilixPay credit lines and view member available credit in Merchant Center.",
      zh: "在 FilixPay 商户中心管理授信额度并查看会员可用额度。",
    },
  },
  {
    id: "developers",
    order: 7,
    isGettingStarted: false,
    title: { en: "Developers", zh: "开发者" },
    heading: {
      en: "FilixPay Developer Features",
      zh: "FilixPay 开发者功能",
    },
    description: {
      en: "Use FilixPay Developer Center, webhook verification, and payment channel configuration in Merchant Center.",
      zh: "在 FilixPay 商户中心使用开发者中心、Webhook 验签与支付通道配置。",
    },
  },
  {
    id: "account",
    order: 8,
    isGettingStarted: false,
    title: { en: "Account & Security", zh: "账户与安全" },
    heading: {
      en: "FilixPay Merchant Account & Security",
      zh: "FilixPay 商户账户与安全",
    },
    description: {
      en: "Learn FilixPay Merchant Center account security, transaction password, audit logs, notifications, merchant profile, service plan, and account closure.",
      zh: "了解 FilixPay 商户中心的账户安全、交易密码、审计日志、通知、商户资料、服务计划及账户关闭操作。",
    },
  },
  {
    id: "enterprise",
    order: 9,
    isGettingStarted: false,
    title: { en: "Enterprise Governance", zh: "集团治理" },
    heading: {
      en: "FilixPay Enterprise Governance",
      zh: "FilixPay 集团治理",
    },
    description: {
      en: "Select an enterprise, manage the organization directory and enterprise members, and review governance audit events in FilixPay Enterprise Portal.",
      zh: "在 FilixPay 集团门户中选择集团、管理组织目录与集团成员，并查看治理审计事件。",
    },
  },
];

export function getHelpDomain(id: string): HelpDomainMeta | undefined {
  return HELP_DOMAINS.find((d) => d.id === id);
}
