import type { LegalContentLocale } from "@/lib/legal/content-locales";
import type { LegalDocument } from "./types";

const PRIVACY_EN: LegalDocument = {
  slug: "privacy",
  status: "draft",
  title: "Privacy Policy",
  effectiveDate: null,
  lastUpdated: null,
  notice:
    "This page is a preliminary publication-ready framework. The final Privacy Policy will supersede this version upon legal approval.",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      paragraphs: [
        "This Privacy Policy framework describes how FilixPay may collect, use, and share information in connection with its merchant and payment infrastructure platform and related services.",
        "This document is a structural draft for publication and review. It does not replace a final, legally approved privacy notice. Product-specific disclosures may apply once finalized.",
      ],
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      paragraphs: [
        "Depending on how you interact with FilixPay, we may collect account and profile information, business onboarding details, operator identity data, and contact information.",
        "We may process technical and usage data such as device information, IP address, logs, and security events related to Platform access.",
        "Payment and operations workflows may involve transaction metadata, settlement-related records, and configuration data necessary to operate the Services.",
      ],
    },
    {
      id: "how-we-use-information",
      title: "How We Use Information",
      paragraphs: [
        "Information may be used to provide and operate the Services, authenticate users, process payments and money-movement workflows, and support merchant operations.",
        "We may use information for security monitoring, fraud prevention, customer support, product improvement, and communications related to the Services.",
        "We may also use information to meet legal, regulatory, and partner compliance obligations where applicable.",
      ],
    },
    {
      id: "legal-bases-purposes",
      title: "Legal Bases / Purposes",
      paragraphs: [
        "Where required by applicable law, processing will be based on one or more lawful bases such as contract performance, legitimate interests, legal obligation, or consent.",
        "The specific legal bases and purposes for each processing activity will be confirmed in the final approved Privacy Policy for relevant jurisdictions.",
        "This draft does not assert that a particular privacy regime (for example, a specific GDPR role or transfer mechanism) already applies in every region.",
      ],
    },
    {
      id: "sharing-and-disclosure",
      title: "Sharing and Disclosure",
      paragraphs: [
        "We may share information with service providers, payment channels, banking or infrastructure partners, and affiliates as needed to operate the Services.",
        "We may disclose information when required by law, legal process, or to protect rights, safety, and security.",
        "We do not sell personal information as a consumer data brokerage practice. Any future commercial data practices would be disclosed in an approved policy if applicable.",
      ],
    },
    {
      id: "international-data-transfers",
      title: "International Data Transfers",
      paragraphs: [
        "FilixPay and its partners may process information in multiple regions depending on service configuration and infrastructure.",
        "Where cross-border transfers occur, appropriate safeguards will be described in the final approved Privacy Policy.",
        "This draft does not name a specific transfer mechanism as already finalized.",
      ],
    },
    {
      id: "data-retention",
      title: "Data Retention",
      paragraphs: [
        "We retain information for as long as needed to provide the Services, meet legal and accounting requirements, resolve disputes, and enforce agreements.",
        "Retention periods will vary by data category and jurisdiction. Final retention schedules will be confirmed upon legal approval.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "FilixPay applies administrative, technical, and organizational measures designed to protect information against unauthorized access, loss, or misuse.",
        "No method of transmission or storage is completely secure. Merchants should also protect credentials, API keys, and operator access within their organizations.",
      ],
    },
    {
      id: "cookies-similar-technologies",
      title: "Cookies / Similar Technologies",
      paragraphs: [
        "We may use cookies and similar technologies for authentication, security, preferences, and analytics related to Platform use.",
        "Details about cookie categories and controls will be expanded in the final policy or a dedicated cookies notice if required.",
      ],
    },
    {
      id: "user-rights",
      title: "User Rights",
      paragraphs: [
        "Depending on applicable law, individuals may have rights to access, correct, delete, restrict, or object to certain processing, or to withdraw consent where processing is consent-based.",
        "How to exercise rights, verification steps, and response timelines will be specified in the final approved Privacy Policy.",
        "Merchant operators may also need to route certain requests through their organization when FilixPay processes data on a merchant’s instructions.",
      ],
    },
    {
      id: "childrens-privacy",
      title: "Children’s Privacy",
      paragraphs: [
        "The Services are directed to businesses and authorized operators, not to children.",
        "We do not knowingly collect personal information from children for Platform account use. If you believe such information was provided, contact us through the channels below once a legal contact is confirmed.",
      ],
    },
    {
      id: "changes-to-privacy-policy",
      title: "Changes to Privacy Policy",
      paragraphs: [
        "FilixPay may update this page as the framework evolves. Material changes to a final approved version will be communicated through appropriate channels once that process is defined.",
        "The final Privacy Policy will supersede this preliminary framework upon legal approval.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "Legal Contact: To be confirmed.",
        "For general product or partnership inquiries, use the public contact channels published elsewhere on the FilixPay website. Do not treat marketing contact addresses as a confirmed privacy or legal notice address unless expressly designated in a final policy.",
      ],
    },
  ],
};

const PRIVACY_ZH: LegalDocument = {
  slug: "privacy",
  status: "draft",
  title: "隐私政策",
  effectiveDate: null,
  lastUpdated: null,
  notice:
    "本页面为当前版本的基础条款框架，内容正在进行法务审核。正式法律文本经批准后将替换本版本。",
  sections: [
    {
      id: "introduction",
      title: "引言",
      paragraphs: [
        "本《隐私政策》框架用于说明 FilixPay 在运营商户与支付基础设施平台及相关服务过程中，可能如何收集、使用与共享信息。",
        "本文档为可发布的结构草稿，供审阅与后续定稿使用，并不替代经法务批准的最终隐私说明。产品专项披露可能在定稿后另行适用。",
      ],
    },
    {
      id: "information-we-collect",
      title: "我们收集的信息",
      paragraphs: [
        "视您与 FilixPay 的交互方式，我们可能收集账户与资料信息、业务入驻信息、操作员身份数据及联系方式。",
        "我们可能处理与平台访问相关的技术与使用数据，例如设备信息、IP 地址、日志与安全事件。",
        "支付与运营流程可能涉及交易元数据、结算相关记录，以及运营服务所需的配置数据。",
      ],
    },
    {
      id: "how-we-use-information",
      title: "我们如何使用信息",
      paragraphs: [
        "信息可用于提供与运营服务、验证用户、处理支付与资金流转流程，以及支持商户运营。",
        "我们可能将信息用于安全监控、欺诈防范、客户支持、产品改进，以及与服务相关的沟通。",
        "在适用情形下，我们亦可能为履行法律、监管与合作方合规义务而使用信息。",
      ],
    },
    {
      id: "legal-bases-purposes",
      title: "合法基础 / 处理目的",
      paragraphs: [
        "在适用法律要求时，处理活动将基于合同履行、合法利益、法定义务或同意等一项或多项合法基础。",
        "各处理活动的具体合法基础与目的，将在面向相关司法辖区的最终批准隐私政策中确认。",
        "本草稿不主张某一特定隐私制度（例如特定 GDPR 角色或传输机制）已在所有地区适用。",
      ],
    },
    {
      id: "sharing-and-disclosure",
      title: "共享与披露",
      paragraphs: [
        "为运营服务，我们可能与服务提供商、支付渠道、银行或基础设施合作方及关联方共享信息。",
        "在法律、法律程序要求，或为保护权利、安全时，我们可能披露信息。",
        "我们不以消费者数据经纪方式出售个人信息。如未来存在需披露的商业数据实践，将在经批准的政策中说明。",
      ],
    },
    {
      id: "international-data-transfers",
      title: "国际数据传输",
      paragraphs: [
        "视服务配置与基础设施情况，FilixPay 及其合作方可能在多个地区处理信息。",
        "如发生跨境传输，最终批准的隐私政策将说明适当保障措施。",
        "本草稿不将某一具体传输机制声明为已定稿。",
      ],
    },
    {
      id: "data-retention",
      title: "数据保留",
      paragraphs: [
        "我们会在提供服务、满足法律与会计要求、解决争议及执行协议所需的期限内保留信息。",
        "保留期限因数据类别与司法辖区而异。最终保留安排将在法务批准后确认。",
      ],
    },
    {
      id: "security",
      title: "安全",
      paragraphs: [
        "FilixPay 采取旨在防止未经授权访问、丢失或滥用的管理、技术与组织措施。",
        "任何传输或存储方式都无法保证绝对安全。商户亦应在组织内保护凭证、API 密钥与操作员访问权限。",
      ],
    },
    {
      id: "cookies-similar-technologies",
      title: "Cookie / 类似技术",
      paragraphs: [
        "我们可能使用 Cookie 及类似技术用于身份验证、安全、偏好设置及与平台使用相关的分析。",
        "Cookie 类别与控制方式将在最终政策或（如需要）独立 Cookie 说明中进一步展开。",
      ],
    },
    {
      id: "user-rights",
      title: "用户权利",
      paragraphs: [
        "视适用法律，个人可能享有访问、更正、删除、限制或反对特定处理的权利，或在基于同意的处理中撤回同意。",
        "行使权利的方式、核验步骤与响应时限将在最终批准的隐私政策中规定。",
        "当 FilixPay 按商户指示处理数据时，部分请求可能需通过商户组织进行转递。",
      ],
    },
    {
      id: "childrens-privacy",
      title: "儿童隐私",
      paragraphs: [
        "服务面向企业与授权操作员，而非儿童。",
        "我们不会在知情情况下为平台账户用途收集儿童的个人信息。如认为发生此类情况，请在法务联系方式确认后通过指定渠道联系我们。",
      ],
    },
    {
      id: "changes-to-privacy-policy",
      title: "隐私政策变更",
      paragraphs: [
        "FilixPay 可随框架演进更新本页。最终批准版本的重大变更将在流程确定后通过适当渠道告知。",
        "正式《隐私政策》经法务批准后将替换本初步框架。",
      ],
    },
    {
      id: "contact",
      title: "联系方式",
      paragraphs: [
        "法务联系方式：待确认。",
        "一般产品或商务咨询请使用 FilixPay 网站已公示的公开渠道。除非最终政策明确指定，请勿将营销联系邮箱视为已确认的隐私或法务通知地址。",
      ],
    },
  ],
};

export const PRIVACY_BY_LOCALE: Record<LegalContentLocale, LegalDocument> = {
  en: PRIVACY_EN,
  zh: PRIVACY_ZH,
};
