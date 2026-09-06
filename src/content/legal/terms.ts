import type { LegalContentLocale } from "@/lib/legal/content-locales";
import type { LegalDocument } from "./types";

const TERMS_EN: LegalDocument = {
  slug: "terms",
  status: "draft",
  title: "Terms of Service",
  effectiveDate: null,
  lastUpdated: null,
  notice:
    "This page is a preliminary publication-ready framework. The final Terms of Service will supersede this version upon legal approval.",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      paragraphs: [
        "These Terms of Service (“Terms”) describe the framework under which FilixPay may provide access to its merchant and payment infrastructure platform and related services (the “Services”).",
        "This document is a structural draft for publication and review. It does not replace a final, legally approved agreement. If you use the Services, additional product-specific terms, order forms, or onboarding agreements may also apply once finalized.",
      ],
    },
    {
      id: "definitions",
      title: "Definitions",
      paragraphs: [
        "“Platform” means the FilixPay software, APIs, dashboards, and related infrastructure used to connect merchants, organizations, and payment capabilities.",
        "“Merchant” means a business entity or operator authorized to use the Services for commercial payment and operations workflows.",
        "“User” means an individual who accesses the Platform on behalf of a Merchant or organization.",
        "“Payment” and “Money Movement” mean payment initiation, collection, routing, settlement-related processing, and related operational flows supported by the Platform, subject to applicable channel and partner rules.",
      ],
    },
    {
      id: "eligibility-account",
      title: "Eligibility & Account",
      paragraphs: [
        "Access to the Services is intended for legitimate business use. FilixPay may require identity, business, and compliance information before enabling features.",
        "You are responsible for maintaining the confidentiality of credentials and for activity under your accounts, including actions by authorized operators.",
        "You agree to provide accurate information during onboarding and to keep material account details reasonably up to date.",
      ],
    },
    {
      id: "services",
      title: "Services",
      paragraphs: [
        "FilixPay provides payment infrastructure capabilities that may include merchant operations, organization management, API access, transaction visibility, and related tooling.",
        "Feature availability may vary by region, merchant status, integration method, and contractual configuration. FilixPay may modify, limit, or discontinue features with reasonable notice where practicable.",
        "The Platform is infrastructure for commercial payment operations and is not described in this draft as a consumer wallet product.",
      ],
    },
    {
      id: "payments-money-movement",
      title: "Payments and Money Movement",
      paragraphs: [
        "Payment and money-movement features depend on configured payment channels, banking or partner rails, risk controls, and applicable laws.",
        "FilixPay may facilitate order creation, payment status tracking, refunds, settlement-related workflows, and notifications through APIs and dashboards.",
        "Settlement timing, currency support, and channel behavior are subject to partner rules and operational constraints. This draft does not guarantee specific settlement times or success rates.",
      ],
    },
    {
      id: "merchant-responsibilities",
      title: "Merchant Responsibilities",
      paragraphs: [
        "Merchants are responsible for the legality of their goods and services, customer disclosures, tax obligations, and disputes arising from their commercial offerings, except where a written agreement allocates responsibility differently.",
        "Merchants must use the Services in accordance with applicable law, platform policies, and any channel or partner requirements.",
        "Merchants should implement appropriate internal controls for operators, API keys, webhooks, and access permissions.",
      ],
    },
    {
      id: "fees",
      title: "Fees",
      paragraphs: [
        "Fees, if any, will be described in applicable pricing schedules, order forms, or account configuration once commercially agreed.",
        "This draft does not set specific fee amounts. Final fee terms will be confirmed in approved commercial documentation.",
      ],
    },
    {
      id: "prohibited-activities",
      title: "Prohibited Activities",
      paragraphs: [
        "You may not use the Services for unlawful, fraudulent, deceptive, or abusive purposes.",
        "Prohibited uses include, without limitation, activities that violate sanctions, facilitate money laundering, infringe intellectual property, or attempt to bypass risk, authentication, or security controls.",
        "FilixPay may investigate suspected misuse and take operational measures described under Suspension and Termination.",
      ],
    },
    {
      id: "compliance-aml-sanctions",
      title: "Compliance / AML / Sanctions",
      paragraphs: [
        "FilixPay may apply compliance, anti-money-laundering (AML), know-your-customer (KYC), and sanctions-screening controls as required by law or partner obligations.",
        "You agree to cooperate with reasonable information requests related to compliance reviews.",
        "This draft does not assert specific regulatory licenses, certifications, or jurisdictional approvals beyond what is separately confirmed in writing.",
      ],
    },
    {
      id: "suspension-termination",
      title: "Suspension and Termination",
      paragraphs: [
        "FilixPay may suspend or limit access to the Services where reasonably necessary to address security risk, legal requirements, suspected prohibited activity, or material contractual breach.",
        "Either party may terminate access according to the terms of an approved commercial agreement once finalized.",
        "Provisions that by nature should survive termination (such as confidentiality and limitation frameworks once finalized) may continue to apply as stated in the final Terms.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      paragraphs: [
        "FilixPay and its licensors retain rights in the Platform, documentation, branding, and related materials.",
        "Merchants retain rights in their own content and customer-facing materials, subject to licenses needed for FilixPay to operate the Services.",
        "You may not copy, reverse engineer, or redistribute Platform components except as expressly permitted in writing.",
      ],
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      paragraphs: [
        "The Services are provided on an “as available” basis during this preliminary framework stage, except to the extent a final approved agreement states otherwise.",
        "FilixPay does not warrant uninterrupted operation, error-free processing, or fitness for a particular merchant use case in this draft.",
        "Channel outages, partner delays, and third-party failures may affect payment and money-movement outcomes.",
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of Liability",
      paragraphs: [
        "Liability allocation will be defined in the final legally approved Terms and related commercial agreements.",
        "Until that approval, this section is a placeholder and does not establish specific liability caps, exclusions, or remedies.",
      ],
    },
    {
      id: "indemnification",
      title: "Indemnification",
      paragraphs: [
        "Indemnification obligations between the parties will be set out in the final approved Terms where applicable.",
        "This draft does not create a finalized indemnification duty for either party.",
      ],
    },
    {
      id: "changes-to-terms",
      title: "Changes to Terms",
      paragraphs: [
        "FilixPay may update this page as the framework evolves. Material changes to a final approved version will be communicated through appropriate channels once that process is defined.",
        "The final Terms of Service will supersede this preliminary framework upon legal approval.",
      ],
    },
    {
      id: "governing-law-dispute-resolution",
      title: "Governing Law / Dispute Resolution",
      paragraphs: [
        "Governing law, venue, and dispute-resolution procedures are to be confirmed and will appear in the final approved Terms.",
        "This draft intentionally does not nominate a governing jurisdiction.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "Legal Contact: To be confirmed.",
        "For general product or partnership inquiries, use the public contact channels published elsewhere on the FilixPay website. Do not treat marketing contact addresses as a confirmed legal notice address unless expressly designated in a final agreement.",
      ],
    },
  ],
};

const TERMS_ZH: LegalDocument = {
  slug: "terms",
  status: "draft",
  title: "服务条款",
  effectiveDate: null,
  lastUpdated: null,
  notice:
    "本页面为当前版本的基础条款框架，内容正在进行法务审核。正式法律文本经批准后将替换本版本。",
  sections: [
    {
      id: "introduction",
      title: "引言",
      paragraphs: [
        "本《服务条款》（“本条款”）用于说明 FilixPay 在提供商户与支付基础设施平台及相关服务（“服务”）时可能适用的框架性约定。",
        "本文档为可发布的结构草稿，供审阅与后续定稿使用，并不替代经法务批准的最终协议。在最终文本生效前，产品专项条款、订单或入驻协议等文件亦可能另行适用。",
      ],
    },
    {
      id: "definitions",
      title: "定义",
      paragraphs: [
        "“平台”指 FilixPay 用于连接商户、组织与支付能力的软件、API、控制台及相关基础设施。",
        "“商户”指经授权使用服务开展商业支付与运营流程的企业主体或运营方。",
        "“用户”指代表商户或组织访问平台的个人。",
        "“支付”与“资金流转”指在适用渠道与合作方规则下，由平台支持的支付发起、收款、路由、结算相关处理及运营流程。",
      ],
    },
    {
      id: "eligibility-account",
      title: "资格与账户",
      paragraphs: [
        "服务面向合法商业用途。FilixPay 可能在开通功能前要求提供身份、业务与合规相关信息。",
        "您应妥善保管凭证，并对账户下的活动（含授权操作员行为）负责。",
        "您同意在入驻过程中提供准确信息，并在重大账户信息变更时合理保持更新。",
      ],
    },
    {
      id: "services",
      title: "服务",
      paragraphs: [
        "FilixPay 可提供商户运营、组织管理、API 访问、交易可见性及相关工具等支付基础设施能力。",
        "功能可用性可能因地区、商户状态、接入方式与合同配置而有所不同。FilixPay 可在合理可行时调整、限制或下线功能。",
        "平台定位为商业支付运营基础设施；本草稿不将其描述为面向消费者的钱包产品。",
      ],
    },
    {
      id: "payments-money-movement",
      title: "支付与资金流转",
      paragraphs: [
        "支付与资金流转功能取决于已配置的支付渠道、银行或合作方通道、风控措施及适用法律。",
        "FilixPay 可通过 API 与控制台协助订单创建、支付状态跟踪、退款、结算相关流程及通知。",
        "结算时效、币种支持与渠道表现受合作方规则与运营约束影响。本草稿不对特定结算时效或成功率作出保证。",
      ],
    },
    {
      id: "merchant-responsibilities",
      title: "商户责任",
      paragraphs: [
        "除非经书面协议另行分配，商户应对其商品与服务的合法性、面向客户的披露、税务义务，以及因其商业要约产生的争议负责。",
        "商户须依法、依平台政策及渠道/合作方要求使用服务。",
        "商户应就操作员、API 密钥、Webhook 与访问权限建立适当的内部控制。",
      ],
    },
    {
      id: "fees",
      title: "费用",
      paragraphs: [
        "如有费用，将在经商业确认的价格表、订单或账户配置中说明。",
        "本草稿不设定具体费用金额。最终费用条款将以经批准的商业文件为准。",
      ],
    },
    {
      id: "prohibited-activities",
      title: "禁止行为",
      paragraphs: [
        "不得将服务用于违法、欺诈、欺骗或滥用目的。",
        "禁止用途包括但不限于：违反制裁规定、协助洗钱、侵犯知识产权，或试图规避风控、认证或安全控制。",
        "FilixPay 可对可疑滥用行为进行调查，并采取“暂停与终止”一节所述运营措施。",
      ],
    },
    {
      id: "compliance-aml-sanctions",
      title: "合规 / 反洗钱 / 制裁",
      paragraphs: [
        "FilixPay 可依法律或合作方义务实施合规、反洗钱（AML）、客户尽职调查（KYC）及制裁筛查等控制。",
        "您同意配合与合规审查相关的合理信息请求。",
        "本草稿不主张超出书面另行确认范围的特定牌照、认证或司法辖区批准。",
      ],
    },
    {
      id: "suspension-termination",
      title: "暂停与终止",
      paragraphs: [
        "在合理必要情形下（如安全风险、法律要求、涉嫌禁止行为或重大违约），FilixPay 可暂停或限制对服务的访问。",
        "任一方可在最终商业协议约定的范围内终止访问。",
        "依性质应在终止后继续有效的条款（如最终文本中的保密与责任限制框架）可按最终条款继续适用。",
      ],
    },
    {
      id: "intellectual-property",
      title: "知识产权",
      paragraphs: [
        "FilixPay 及其许可方保留对平台、文档、品牌及相关材料的权利。",
        "商户保留对其自身内容与面向客户材料的权利，但须授予 FilixPay 运营服务所必要的许可。",
        "除非经书面明确允许，不得复制、反向工程或再分发平台组件。",
      ],
    },
    {
      id: "disclaimers",
      title: "免责声明",
      paragraphs: [
        "在本初步框架阶段，服务按“现状可用”提供，最终经批准协议另有约定的除外。",
        "本草稿中，FilixPay 不保证不间断运行、无差错处理，或不保证适合特定商户场景。",
        "渠道中断、合作方延迟及第三方故障可能影响支付与资金流转结果。",
      ],
    },
    {
      id: "limitation-of-liability",
      title: "责任限制",
      paragraphs: [
        "责任分配将在经法务批准的最终条款及相关商业协议中明确。",
        "在批准前，本节仅为占位说明，不设立具体责任上限、排除条款或救济措施。",
      ],
    },
    {
      id: "indemnification",
      title: "赔偿",
      paragraphs: [
        "双方之间的赔偿义务将在最终批准的条款中（如适用）予以约定。",
        "本草稿不为任一方创设已定稿的赔偿义务。",
      ],
    },
    {
      id: "changes-to-terms",
      title: "条款变更",
      paragraphs: [
        "FilixPay 可随框架演进更新本页。最终批准版本的重大变更将在流程确定后通过适当渠道告知。",
        "正式《服务条款》经法务批准后将替换本初步框架。",
      ],
    },
    {
      id: "governing-law-dispute-resolution",
      title: "适用法律 / 争议解决",
      paragraphs: [
        "适用法律、管辖地与争议解决程序待确认，并将载于最终批准的条款。",
        "本草稿有意不指定管辖司法辖区。",
      ],
    },
    {
      id: "contact",
      title: "联系方式",
      paragraphs: [
        "法务联系方式：待确认。",
        "一般产品或商务咨询请使用 FilixPay 网站已公示的公开渠道。除非最终协议明确指定，请勿将营销联系邮箱视为已确认的法务通知地址。",
      ],
    },
  ],
};

export const TERMS_BY_LOCALE: Record<LegalContentLocale, LegalDocument> = {
  en: TERMS_EN,
  zh: TERMS_ZH,
};
