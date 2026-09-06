import type { HelpDomainId } from "./types";

export type HelpDomainMeta = {
  id: HelpDomainId;
  order: number;
  /** true only for getting-started funnel section */
  isGettingStarted: boolean;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
};

export const HELP_DOMAINS: HelpDomainMeta[] = [
  {
    id: "getting-started",
    order: 0,
    isGettingStarted: true,
    title: { en: "Getting Started", zh: "快速开始" },
    description: {
      en: "Set up your merchant account and publish your first product.",
      zh: "完成商户开通并发布第一个商品。",
    },
  },
  {
    id: "merchant",
    order: 1,
    isGettingStarted: false,
    title: { en: "Merchant & Organization", zh: "商户与组织" },
    description: {
      en: "Organization, locations, sub-merchants, and maintenance.",
      zh: "组织、门店、子商户与资料维护。",
    },
  },
  {
    id: "payments",
    order: 2,
    isGettingStarted: false,
    title: { en: "Payments & Transactions", zh: "支付与交易" },
    description: {
      en: "Orders, customers, payment splits, and offline collection.",
      zh: "订单、客户、分账与线下归集。",
    },
  },
  {
    id: "funds",
    order: 3,
    isGettingStarted: false,
    title: { en: "Funds", zh: "资金" },
    description: {
      en: "Balance, money-in, payouts, settlements, and reconciliation.",
      zh: "余额、入金、出金、结算与对账。",
    },
  },
  {
    id: "risk",
    order: 4,
    isGettingStarted: false,
    title: { en: "After-Sales & Risk", zh: "售后与风控" },
    description: {
      en: "Refunds, disputes, fraud controls, and coverage.",
      zh: "退款、争议、欺诈风控与保障服务。",
    },
  },
  {
    id: "commerce",
    order: 5,
    isGettingStarted: false,
    title: { en: "Commerce", zh: "商务" },
    description: {
      en: "Create and publish products in Merchant Center.",
      zh: "在商户中心创建并发布商品。",
    },
  },
  {
    id: "credit",
    order: 6,
    isGettingStarted: false,
    title: { en: "Credit", zh: "授信" },
    description: {
      en: "Credit limits and member credit.",
      zh: "授信额度与会员可用额度。",
    },
  },
  {
    id: "developers",
    order: 7,
    isGettingStarted: false,
    title: { en: "Developers", zh: "开发者" },
    description: {
      en: "Developer Center and channel settings in Merchant Center.",
      zh: "商户中心内的开发者与渠道配置。",
    },
  },
  {
    id: "account",
    order: 8,
    isGettingStarted: false,
    title: { en: "Account & Security", zh: "账户与安全" },
    description: {
      en: "Security, notifications, audit logs, maintenance, service plan, close account, and account settings.",
      zh: "安全、通知、审计、资料维护、服务计划、关闭账户与账户设置。",
    },
  },
];

export function getHelpDomain(id: string): HelpDomainMeta | undefined {
  return HELP_DOMAINS.find((d) => d.id === id);
}
