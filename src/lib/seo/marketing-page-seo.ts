export type MarketingPageSeoEntry = {
  path: string;
  en: { title: string; description: string; keywords: string[] };
  zh: { title: string; description: string; keywords: string[] };
};

export const MARKETING_PAGE_SEO: Record<string, MarketingPageSeoEntry> = {
  payment_platform: {
    path: "/products/payment-platform",
    en: {
      title: "FilixPay - Enterprise Payment Infrastructure Platform",
      description:
        "FilixPay provides enterprise payment infrastructure for global businesses with payment APIs, transaction management, merchant operations and settlement capabilities.",
      keywords: [
        "enterprise payment platform",
        "payment infrastructure",
        "payment API",
        "transaction management",
        "settlement",
        "FilixPay",
      ],
    },
    zh: {
      title: "FilixPay - 企业支付基础设施平台 | 支付接入、交易管理与结算",
      description:
        "FilixPay 提供企业级支付基础设施，帮助企业统一接入全球支付渠道，管理交易、结算、商户和开发者 API。",
      keywords: ["企业支付平台", "支付基础设施", "支付 API", "交易管理", "结算", "FilixPay"],
    },
  },
  merchant_center: {
    path: "/products/merchant-center",
    en: {
      title: "Merchant Management Platform | FilixPay Merchant Center",
      description:
        "FilixPay Merchant Center is a payment operations platform for account management, permissions, API credentials, webhooks, and transaction monitoring.",
      keywords: [
        "merchant management",
        "payment operations platform",
        "merchant center",
        "webhook",
        "FilixPay",
      ],
    },
    zh: {
      title: "商户管理平台 | FilixPay 商户中心",
      description:
        "FilixPay 商户中心是面向企业的商户运营管理平台，提供账户、权限、API 凭证、Webhook 与交易查询能力。",
      keywords: ["商户管理系统", "商户管理平台", "支付运营", "Webhook", "FilixPay"],
    },
  },
  developers: {
    path: "/developers",
    en: {
      title: "Payment API & Developer Platform | FilixPay",
      description:
        "Integrate FilixPay with payment APIs, SDKs, webhooks, sandbox, and developer documentation for enterprise payment connectivity.",
      keywords: [
        "payment API",
        "payment SDK",
        "webhook",
        "developer platform",
        "FilixPay",
      ],
    },
    zh: {
      title: "支付 API 与开发者平台 | FilixPay",
      description:
        "FilixPay 开发者平台提供支付 API、SDK、Webhook、沙箱与文档，快速集成企业支付能力。",
      keywords: ["支付 API", "支付 SDK", "Webhook", "开发者平台", "FilixPay"],
    },
  },
  for_enterprise: {
    path: "/for-enterprise",
    en: {
      title: "Enterprise Payment Governance | Multi-Merchant & RBAC | FilixPay",
      description:
        "Enterprise payment governance with multi-merchant management, RBAC, organization isolation, and private deployment for regulated businesses.",
      keywords: [
        "enterprise payment",
        "payment governance",
        "multi merchant",
        "RBAC",
        "FilixPay",
      ],
    },
    zh: {
      title: "企业支付方案与治理 | 多商户与权限 | FilixPay",
      description:
        "FilixPay 企业支付治理方案：多商户管理、RBAC 权限、组织隔离与私有化部署，满足集团型企业合规需求。",
      keywords: ["企业支付平台", "支付治理", "多商户", "RBAC", "FilixPay"],
    },
  },
  products: {
    path: "/products",
    en: {
      title: "FilixPay Products | Aggregated Payments, Credit, Crypto & Split Settlement",
      description:
        "Explore FilixPay payment products: aggregated checkout, credit payment, crypto payment, payment splitting, and private deployment for global commerce.",
      keywords: ["FilixPay products", "payment gateway", "hosted checkout", "crypto payment", "payment splitting"],
    },
    zh: {
      title: "FilixPay 产品 | 聚合支付 · 信用支付 · 加密货币 · 分账",
      description:
        "了解 FilixPay 产品矩阵：聚合收银台、信用支付、加密货币支付、分账支付与私有化部署，覆盖跨境与平台型业务。",
      keywords: ["FilixPay 产品", "聚合支付", "信用支付", "加密货币支付", "分账支付"],
    },
  },
  credit_payment: {
    path: "/products/credit-payment",
    en: {
      title: "Credit Payment | B2B BNPL & Installment Solutions | FilixPay",
      description:
        "Enable credit lines, installment plans, and deferred B2B payments with enterprise-grade risk control and automated reconciliation.",
      keywords: ["credit payment", "BNPL", "installment payment", "B2B credit", "FilixPay"],
    },
    zh: {
      title: "信用支付 | B2B 赊销与分期方案 | FilixPay",
      description:
        "FilixPay 信用支付支持授信额度、分期计划与延迟付款，提供企业级风控与自动对账能力。",
      keywords: ["信用支付", "赊销", "分期付款", "B2B 授信", "FilixPay"],
    },
  },
  crypto_payment: {
    path: "/products/crypto-payment",
    en: {
      title: "TRON USDT Crypto Payment | Native Blockchain Gateway | FilixPay",
      description:
        "Collect TRC20 USDT with merchant-managed deposit addresses, unique-amount matching, and FilixPay blockchain gateway confirmation. Optional NowPayments extension for additional assets.",
      keywords: [
        "TRON USDT payment",
        "TRC20 USDT checkout",
        "crypto payment gateway",
        "NowPayments integration",
        "FilixPay",
      ],
    },
    zh: {
      title: "TRON USDT 加密货币支付 | 区块链网关原生收款 | FilixPay",
      description:
        "FilixPay 原生 TRON USDT（TRC20）链上收款：商户配置收款地址、唯一金额匹配、区块链网关到账确认。可选接入 NowPayments 扩展更多数字资产。",
      keywords: ["TRON USDT 收款", "TRC20 支付", "加密货币支付", "NowPayments", "FilixPay"],
    },
  },
  payment_splitting: {
    path: "/products/payment-splitting",
    en: {
      title: "Payment Splitting for Platforms and Multi-Merchant Settlement | FilixPay",
      description:
        "FilixPay payment splitting helps marketplaces, SaaS platforms, and multi-merchant businesses automate split payments, settlement bills, reconciliation, APIs, and webhooks.",
      keywords: [
        "payment splitting",
        "split payment",
        "marketplace settlement",
        "multi merchant settlement",
        "platform payment splitting",
      ],
    },
    zh: {
      title: "分账支付 - 面向平台与多商户场景的自动分账能力 | FilixPay",
      description:
        "FilixPay 分账支付支持平台、电商、SaaS、连锁门店等多商户场景，提供自动分账、结算账单、分账对账、失败处理、API 与 Webhook 回调能力。",
      keywords: ["分账支付", "平台分账", "多商户结算", "自动分账", "FilixPay"],
    },
  },
  risk_control: {
    path: "/products/risk-control",
    en: {
      title: "All-in-One Payment Risk Control & Chargeback Protection | FilixPay",
      description:
        "Protect revenue with integrated Signifyd, Riskified, and Forter chargeback insurance—self-configure provider credentials or subscribe to platform-hosted coverage.",
      keywords: [
        "payment risk management",
        "chargeback protection",
        "Signifyd integration",
        "Riskified integration",
        "Forter integration",
        "fraud prevention",
        "FilixPay",
      ],
    },
    zh: {
      title: "全链路支付风控与拒付保障 | FilixPay",
      description:
        "FilixPay 原生集成 Signifyd、Riskified、Forter 拒付保障服务商，支持商户自配凭证或订阅平台托管保障。",
      keywords: ["支付风控", "拒付保障", "Signifyd", "Riskified", "Forter", "保险风控", "FilixPay"],
    },
  },
  private_deployment: {
    path: "/products/private-deployment",
    en: {
      title: "Private Deployment | Self-Hosted Enterprise Payment Platform | FilixPay",
      description: "Deploy FilixPay on your own infrastructure. Full data sovereignty, Docker-based setup, source code licensing, and 30-minute deployment for banks, payment providers, and enterprise groups.",
      keywords: ["private deployment", "self-hosted payment", "enterprise payment platform", "source code licensing", "data sovereignty", "FilixPay"],
    },
    zh: {
      title: "独立部署版 | 企业级私有化支付平台 | FilixPay",
      description: "FilixPay 独立部署方案：全栈掌控、数据主权、Docker 容器化部署，30分钟完成生产环境搭建。适用于银行、支付服务商及大型集团企业。",
      keywords: ["独立部署", "私有化部署", "企业支付平台", "源码授权", "数据主权", "FilixPay"],
    },
  },
  deployment: {
    path: "/deployment",
    en: {
      title: "Private Deployment | Self-Hosted FilixPay Platform | FilixPay",
      description:
        "Deploy FilixPay on your own infrastructure with Docker-based containerized setup, source code licensing, and full data sovereignty.",
      keywords: ["private deployment", "self-hosted payment", "payment platform deployment", "FilixPay"],
    },
    zh: {
      title: "私有化部署 | FilixPay 独立部署方案 | FilixPay",
      description:
        "FilixPay 私有化部署基于 Docker 容器化架构，支持源码授权与数据主权，快速搭建商户支付平台。",
      keywords: ["私有化部署", "独立部署", "支付平台部署", "源码授权", "FilixPay"],
    },
  },
  solutions: {
    path: "/solutions",
    en: {
      title: "FilixPay Solutions | Cross-Border & Group Enterprise Payments",
      description:
        "Industry payment solutions for cross-border e-commerce and group enterprise unified acquiring and settlement.",
      keywords: ["payment solutions", "cross-border ecommerce", "group enterprise payments", "FilixPay"],
    },
    zh: {
      title: "FilixPay 解决方案 | 跨境电商 · 企业集团",
      description:
        "FilixPay 为跨境电商与企业集团提供统一收单、分账与结算的端到端支付解决方案。",
      keywords: ["支付解决方案", "跨境电商", "企业集团支付", "FilixPay"],
    },
  },
  cross_border: {
    path: "/solutions/cross-border-ecommerce",
    en: {
      title: "Cross-Border E-Commerce Payments | Sell Globally | FilixPay",
      description:
        "Integrate Shopify, WooCommerce and custom stores. Accept local payment methods in 50+ countries with automatic currency conversion.",
      keywords: ["cross-border ecommerce", "international payments", "Shopify payments", "FilixPay"],
    },
    zh: {
      title: "跨境电商支付 | 全球收款本地化 | FilixPay",
      description:
        "FilixPay 跨境电商方案对接 Shopify、WooCommerce 与自建站，支持 50+ 国家本地支付方式与自动换汇。",
      keywords: ["跨境电商支付", "国际收款", "Shopify 支付", "FilixPay"],
    },
  },
  group_enterprise: {
    path: "/solutions/group-enterprise",
    en: {
      title: "Group Enterprise Payments | Transparent Acquiring for Conglomerates | FilixPay",
      description:
        "Unified payment platform for group companies: break fund silos, automate smart split payments, and achieve full-link compliance.",
      keywords: ["group enterprise payments", "conglomerate payments", "smart split payment", "FilixPay"],
    },
    zh: {
      title: "企业集团支付 | 透明收单与智能分账 | FilixPay",
      description:
        "FilixPay 企业集团方案打破子公司资金孤岛，智能分账、统一收单，实现全链路合规管控。",
      keywords: ["企业集团支付", "集团收单", "智能分账", "FilixPay"],
    },
  },
  technology: {
    path: "/technology",
    en: {
      title: "FilixPay Technology | Architecture, Performance & Security",
      description:
        "Explore FilixPay technical capabilities: microservices architecture, OpenAPI performance benchmarks, Keycloak identity, and blockchain integration.",
      keywords: ["payment architecture", "payment API performance", "Keycloak IAM", "FilixPay"],
    },
    zh: {
      title: "FilixPay 技术 | 架构 · 性能 · 安全",
      description:
        "了解 FilixPay 技术能力：微服务架构、OpenAPI 性能基准、Keycloak 身份认证与区块链集成。",
      keywords: ["支付架构", "API 性能", "Keycloak 认证", "FilixPay"],
    },
  },
  architecture: {
    path: "/technology/architecture",
    en: {
      title: "Payment Architecture | Microservices & Kubernetes | FilixPay",
      description:
        "Enterprise-grade distributed payment architecture on Kubernetes with event-driven processing, 99.99% uptime, and horizontal scalability.",
      keywords: ["payment microservices", "Kubernetes payments", "high concurrency", "FilixPay"],
    },
    zh: {
      title: "支付架构 | 微服务与 Kubernetes | FilixPay",
      description:
        "FilixPay 企业级分布式支付架构，基于 Kubernetes 与事件驱动，保障 99.99% 可用性与水平扩展。",
      keywords: ["支付微服务", "Kubernetes", "高并发", "FilixPay"],
    },
  },
  performance: {
    path: "/technology/performance",
    en: {
      title: "OpenAPI Performance Benchmark | Create Order Load Test | FilixPay",
      description:
        "FilixPay OpenAPI create-order load test report: stepped k6 benchmark, TPS, P95/P99 latency, and daily capacity estimates for production planning.",
      keywords: ["OpenAPI performance", "payment API benchmark", "k6 load test", "TPS", "FilixPay"],
    },
    zh: {
      title: "OpenAPI 性能基准 | 创建订单压测报告 | FilixPay",
      description:
        "FilixPay OpenAPI 创建订单压测报告：k6 阶梯压测、TPS、P95/P99 延迟与日订单容量估算，供生产容量规划参考。",
      keywords: ["OpenAPI 性能", "支付 API 压测", "k6 压测", "TPS", "FilixPay"],
    },
  },
  identity: {
    path: "/technology/identity",
    en: {
      title: "Identity & Auth | Keycloak IAM for Payment Systems | FilixPay",
      description:
        "Financial-grade identity with Keycloak: OIDC, OAuth 2.0, SAML, MFA, RBAC, and compliance-ready IAM for payment platforms.",
      keywords: ["Keycloak", "payment IAM", "OIDC", "financial-grade auth", "FilixPay"],
    },
    zh: {
      title: "身份认证 | Keycloak 金融级 IAM | FilixPay",
      description:
        "FilixPay 采用 Keycloak 构建金融级身份认证：OIDC、OAuth 2.0、SAML、MFA、RBAC 与合规就绪的 IAM 能力。",
      keywords: ["Keycloak", "支付 IAM", "OIDC", "金融级认证", "FilixPay"],
    },
  },
  blockchain: {
    path: "/technology/blockchain",
    en: {
      title: "Blockchain Integration | Multi-Chain Payment Trust | FilixPay",
      description:
        "Native support for major consortium blockchains with cross-chain verification and compliance-ready audit trails.",
      keywords: ["blockchain payments", "multi-chain", "cross-chain", "FilixPay"],
    },
    zh: {
      title: "区块链集成 | 多链支付与跨链互信 | FilixPay",
      description:
        "FilixPay 原生支持主流联盟链，提供跨链验证与合规审计追踪能力。",
      keywords: ["区块链支付", "多链", "跨链", "FilixPay"],
    },
  },
  resources: {
    path: "/resources",
    en: {
      title: "FilixPay Resources | Case Studies, Compliance & Downloads",
      description:
        "Customer case studies, compliance guides, reconciliation docs, blog articles, and deployment downloads for FilixPay integrators.",
      keywords: ["FilixPay resources", "payment case studies", "compliance guide", "FilixPay"],
    },
    zh: {
      title: "FilixPay 资源 | 案例 · 合规 · 下载",
      description:
        "FilixPay 客户案例、合规指南、对账结算说明、技术博客与部署文档下载。",
      keywords: ["FilixPay 资源", "支付案例", "合规指南", "FilixPay"],
    },
  },
  case_studies: {
    path: "/resources/case-studies",
    en: {
      title: "Customer Case Studies | FilixPay Success Stories",
      description:
        "See how businesses worldwide succeed with FilixPay — cross-border e-commerce, platform payments, and global checkout integration.",
      keywords: ["FilixPay case studies", "payment success stories", "customer stories", "FilixPay"],
    },
    zh: {
      title: "客户案例 | FilixPay 成功故事",
      description:
        "了解全球企业如何借助 FilixPay 实现跨境电商、平台支付与全球收银集成。",
      keywords: ["FilixPay 案例", "支付成功案例", "客户故事", "FilixPay"],
    },
  },
  micselect: {
    path: "/resources/case-studies/micselect",
    en: {
      title: "MicSelect Case Study | Saleor + FilixPay Cross-Border Payments",
      description:
        "How MicSelect built a global e-commerce payment system on Saleor and FilixPay with Stripe, PayPal, webhooks, and unified checkout.",
      keywords: ["MicSelect", "Saleor payments", "cross-border case study", "FilixPay"],
    },
    zh: {
      title: "MicSelect 案例 | Saleor + FilixPay 跨境支付",
      description:
        "MicSelect 基于 Saleor 与 FilixPay 构建全球电商支付体系，集成 Stripe、PayPal、Webhook 与统一收银。",
      keywords: ["MicSelect", "Saleor 支付", "跨境案例", "FilixPay"],
    },
  },
  compliance: {
    path: "/resources/compliance",
    en: {
      title: "Payment Compliance Guide | GDPR, PCI-DSS & Regulations | FilixPay",
      description:
        "Navigate global payment regulations with guides covering GDPR, PCI-DSS, FATF Travel Rule, and regional compliance requirements.",
      keywords: ["payment compliance", "PCI-DSS", "GDPR payments", "FilixPay"],
    },
    zh: {
      title: "支付合规指南 | GDPR · PCI-DSS | FilixPay",
      description:
        "FilixPay 合规指南涵盖 GDPR、PCI-DSS、FATF Travel Rule 及各地支付监管要求。",
      keywords: ["支付合规", "PCI-DSS", "GDPR", "FilixPay"],
    },
  },
  reconciliation_settlement: {
    path: "/resources/reconciliation-settlement",
    en: {
      title: "Reconciliation & Settlement | FilixPay Finance Workflow",
      description:
        "How FilixPay manages reconciliation workflows, settlement controls, automated billing, and end-to-end fund traceability.",
      keywords: ["reconciliation", "settlement", "payment reconciliation", "FilixPay"],
    },
    zh: {
      title: "对账与结算 | FilixPay 财务闭环",
      description:
        "FilixPay 对账与结算体系：灵活结算机制、自动化对账工作流、账单获取与全链路资金追踪。",
      keywords: ["对账", "结算", "支付对账", "FilixPay"],
    },
  },
  blog: {
    path: "/resources/blog",
    en: {
      title: "FilixPay Blog | Technical Insights & Product Updates",
      description:
        "Technical insights, industry analysis, and product updates from the FilixPay team — checkout, merchant platform, and payment APIs.",
      keywords: ["FilixPay blog", "payment technology", "checkout", "FilixPay"],
    },
    zh: {
      title: "FilixPay 博客 | 技术洞察与产品动态",
      description:
        "FilixPay 团队的技术洞察、行业分析与产品更新——收银台、商户平台与支付 API。",
      keywords: ["FilixPay 博客", "支付技术", "收银台", "FilixPay"],
    },
  },
  downloads: {
    path: "/resources/downloads",
    en: {
      title: "Download Center | Deployment Docs & API Specs | FilixPay",
      description:
        "Download FilixPay deployment guides, license agreement samples, and OpenAPI specification files.",
      keywords: ["FilixPay downloads", "deployment guide", "OpenAPI spec", "FilixPay"],
    },
    zh: {
      title: "下载中心 | 部署文档与 API 规范 | FilixPay",
      description:
        "下载 FilixPay 部署指南、源码授权协议样本与 OpenAPI 规范文件。",
      keywords: ["FilixPay 下载", "部署文档", "OpenAPI", "FilixPay"],
    },
  },
  whitepaper: {
    path: "/whitepaper",
    en: {
      title: "FilixPay Whitepaper | Merchant Platform System Overview",
      description:
        "Comprehensive overview of FilixPay aggregated payment platform: features, business models, architecture, and technical capabilities.",
      keywords: ["FilixPay whitepaper", "payment platform", "merchant platform", "FilixPay"],
    },
    zh: {
      title: "FilixPay 白皮书 | 商户管控平台系统概览",
      description:
        "全面了解 FilixPay 聚合支付平台的功能架构、业务模式与技术能力。",
      keywords: ["FilixPay 白皮书", "支付平台", "商户平台", "FilixPay"],
    },
  },
};

export function getMarketingPageSeo(pageKey: string, locale: string) {
  const entry = MARKETING_PAGE_SEO[pageKey];
  if (!entry) {
    throw new Error(`Unknown marketing page SEO key: ${pageKey}`);
  }

  const content = locale === "zh" ? entry.zh : entry.en;

  return {
    path: entry.path,
    title: content.title,
    description: content.description,
    keywords: content.keywords,
  };
}
