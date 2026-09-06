import type { LegalContentLocale } from "@/lib/legal/content-locales";
import type { LegalDocument } from "./types";

/**
 * Privacy Policy V1 — formal production copy.
 * ZH and EN share the same legal structure; do not replace with machine translation.
 * Pending legal confirmation: legal entity name, registered address, privacy/legal email, governing law.
 */
const PRIVACY_ZH: LegalDocument = {
  slug: "privacy",
  status: "draft",
  title: "FilixPay 隐私政策",
  lastUpdated: "2026-09-06",
  notice: null,
  sections: [
    {
      id: "intro",
      title: "",
      paragraphs: [
        "FilixPay 重视您的隐私。本隐私政策说明 FilixPay 在您访问或使用 FilixPay 网站、商户平台、开发者服务、API、Checkout、Sandbox 及其他相关服务（统称“服务”）时，如何收集、使用、披露、保存和保护个人信息。",
        "本隐私政策适用于 FilixPay 直接收集和处理的信息。对于由 FilixPay 商户通过其自身业务向其客户收集和处理的个人信息，商户可能根据适用法律独立决定处理目的和方式，并可能对相关个人信息承担独立的数据控制或处理责任。在此类情况下，您应首先向相关商户了解其隐私政策及数据处理安排。",
      ],
    },
    {
      id: "who-we-are",
      title: "1. 我们是谁",
      paragraphs: [
        "FilixPay 是面向企业、商户、平台及其他业务组织的支付基础设施与技术服务平台。FilixPay 提供支付集成、交易处理、资金管理、结算、开发者工具、商户运营及相关技术服务。",
        "根据您使用的具体服务以及服务关系，FilixPay 对个人信息的处理角色可能不同。例如：",
      ],
      bullets: [
        "当您访问 FilixPay 官方网站或与 FilixPay 直接建立账户关系时，FilixPay 可能直接处理您的相关个人信息；",
        "当您作为商户或组织的成员、员工或授权操作员使用 FilixPay 商户平台时，FilixPay 可能代表相关组织处理您的个人信息；",
        "当您通过使用 FilixPay 服务的商户进行付款或交易时，相关商户可能是决定您个人信息处理目的和方式的主体，FilixPay 则可能作为其服务提供商或数据处理方参与相关处理。",
      ],
      subsections: [
        {
          id: "who-we-are-role",
          title: "",
          paragraphs: [
            "具体的数据处理角色取决于相关服务、合同关系以及适用法律。",
          ],
        },
      ],
    },
    {
      id: "information-we-collect",
      title: "2. 我们收集的信息",
      paragraphs: [
        "我们根据您与 FilixPay 的关系、您使用的服务以及适用法律收集不同类型的信息。",
      ],
      subsections: [
        {
          id: "account-identity",
          title: "2.1 账户与身份信息",
          paragraphs: [
            "当您注册、登录或管理 FilixPay 账户时，我们可能收集：",
          ],
          bullets: [
            "姓名；",
            "企业或组织名称；",
            "电子邮件地址；",
            "电话号码；",
            "登录凭证及账户标识；",
            "组织、角色及权限信息；",
            "账户安全相关信息。",
          ],
          subsections: [
            {
              id: "account-identity-enterprise",
              title: "",
              paragraphs: [
                "对于企业客户，我们还可能根据服务需要收集企业注册信息、业务资料及相关联系人信息。",
              ],
            },
          ],
        },
        {
          id: "merchant-business",
          title: "2.2 商户及业务信息",
          paragraphs: [
            "如果您以商户、企业或平台身份使用 FilixPay，我们可能处理：",
          ],
          bullets: [
            "企业及组织信息；",
            "商户资料；",
            "业务类型及经营信息；",
            "收款及结算配置；",
            "银行或其他外部资金账户相关信息；",
            "支付渠道配置；",
            "API、Webhook 和集成配置；",
            "与账户运营相关的文件及记录。",
          ],
          subsections: [
            {
              id: "merchant-business-scope",
              title: "",
              paragraphs: [
                "具体收集范围取决于您使用的服务及适用的业务验证要求。",
              ],
            },
          ],
        },
        {
          id: "transaction-payment",
          title: "2.3 交易及支付信息",
          paragraphs: [
            "为提供支付和资金相关服务，我们可能处理与交易有关的信息，例如：",
          ],
          bullets: [
            "订单及交易标识；",
            "支付金额、币种及时间；",
            "支付状态；",
            "退款、拒付及争议相关信息；",
            "结算及资金流转记录；",
            "支付方式及渠道信息；",
            "与交易相关的风险控制及运营记录。",
          ],
          subsections: [
            {
              id: "transaction-payment-role",
              title: "",
              paragraphs: [
                "FilixPay 不会因为提供支付基础设施服务而当然成为交易中所有个人信息的控制者。具体角色取决于相关交易和服务关系。",
              ],
            },
          ],
        },
        {
          id: "technical-device",
          title: "2.4 技术及设备信息",
          paragraphs: [
            "当您访问网站或使用服务时，我们可能自动收集：",
          ],
          bullets: [
            "IP 地址；",
            "浏览器类型和版本；",
            "操作系统；",
            "设备类型；",
            "语言及地区设置；",
            "页面访问记录；",
            "登录时间和操作时间；",
            "网络及连接信息；",
            "错误日志；",
            "安全事件及审计日志。",
          ],
          subsections: [
            {
              id: "technical-device-purpose",
              title: "",
              paragraphs: [
                "这些信息主要用于提供服务、保障安全、诊断问题和改善服务。",
              ],
            },
          ],
        },
        {
          id: "api-developer",
          title: "2.5 API、开发者及集成数据",
          paragraphs: [
            "如果您使用 FilixPay API、SDK、Webhook、Sandbox 或其他开发者服务，我们可能处理：",
          ],
          bullets: [
            "API 凭证及相关标识；",
            "请求和响应的技术元数据；",
            "Webhook 投递及状态记录；",
            "API 调用时间及来源信息；",
            "Sandbox 测试数据；",
            "集成错误和运行日志。",
          ],
          subsections: [
            {
              id: "api-developer-warning",
              title: "",
              paragraphs: [
                "您不应通过 API 或测试环境提交不必要的真实个人敏感信息。",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "how-we-use",
      title: "3. 我们如何使用个人信息",
      paragraphs: ["我们可能出于以下目的处理个人信息："],
      subsections: [
        {
          id: "use-operate",
          title: "3.1 提供和运营服务",
          paragraphs: ["包括："],
          bullets: [
            "创建和管理账户；",
            "验证用户身份及账户权限；",
            "提供支付及交易处理能力；",
            "提供商户运营功能；",
            "执行结算及相关资金流程；",
            "提供 API、Webhook、Sandbox 等技术服务；",
            "提供客户支持。",
          ],
        },
        {
          id: "use-security",
          title: "3.2 安全与风险控制",
          paragraphs: ["包括："],
          bullets: [
            "防止欺诈、滥用和未经授权的访问；",
            "检测异常交易和安全事件；",
            "保护账户、API 凭证及系统；",
            "调查安全事件；",
            "维护审计记录。",
          ],
        },
        {
          id: "use-improve",
          title: "3.3 改进服务",
          paragraphs: ["我们可能使用相关信息："],
          bullets: [
            "分析服务使用情况；",
            "发现和修复技术问题；",
            "改善产品功能和用户体验；",
            "开发和测试新功能；",
            "维护服务稳定性和性能。",
          ],
          subsections: [
            {
              id: "use-improve-protect",
              title: "",
              paragraphs: [
                "在适用法律要求的情况下，我们会对用于分析和改进的信息采取适当的去标识化、聚合或其他保护措施。",
              ],
            },
          ],
        },
        {
          id: "use-legal",
          title: "3.4 法律和合规要求",
          paragraphs: ["我们可能为："],
          bullets: [
            "遵守适用法律法规；",
            "履行法院、监管机构或执法机关的合法要求；",
            "执行合同；",
            "建立、行使或抗辩法律权利；",
            "防止违法活动；",
          ],
          subsections: [
            {
              id: "use-legal-close",
              title: "",
              paragraphs: ["而处理或披露相关信息。"],
            },
          ],
        },
      ],
    },
    {
      id: "legal-bases",
      title: "4. 处理个人信息的法律依据",
      paragraphs: [
        "如果适用法律要求我们依据特定法律基础处理个人信息，我们可能基于以下一种或多种基础：",
      ],
      bullets: [
        "履行合同或采取合同订立前措施；",
        "履行法律义务；",
        "我们或第三方的合法利益；",
        "获得您的同意；",
        "适用法律允许的其他处理基础。",
      ],
      subsections: [
        {
          id: "legal-bases-detail",
          title: "",
          paragraphs: [
            "具体法律依据取决于个人信息的类型、处理目的、服务关系以及适用的司法辖区。",
            "当我们基于同意处理个人信息时，您可以在适用法律允许的范围内撤回同意。撤回同意不会影响撤回之前基于同意进行处理的合法性。",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "5. 我们如何共享个人信息",
      paragraphs: [
        "我们不会将个人信息出售给数据经纪商，也不会为了第三方独立的营销目的出售个人信息。",
        "在提供服务所必要的情况下，我们可能与以下类别的接收方共享个人信息：",
      ],
      subsections: [
        {
          id: "sharing-payment",
          title: "5.1 支付及金融服务提供方",
          paragraphs: ["根据具体交易和服务配置，可能包括："],
          bullets: [
            "支付服务提供商；",
            "收单机构；",
            "银行；",
            "卡组织或支付网络；",
            "本地支付渠道；",
            "数字资产或区块链相关服务提供方。",
          ],
          subsections: [
            {
              id: "sharing-payment-note",
              title: "",
              paragraphs: [
                "这些第三方可能根据其自身隐私政策处理相关信息。",
              ],
            },
          ],
        },
        {
          id: "sharing-infra",
          title: "5.2 技术及基础设施服务提供商",
          paragraphs: ["例如："],
          bullets: [
            "云基础设施提供商；",
            "数据存储服务商；",
            "身份认证服务提供商；",
            "日志及监控服务商；",
            "通信服务商；",
            "客户支持工具提供商；",
            "安全服务提供商。",
          ],
          subsections: [
            {
              id: "sharing-infra-note",
              title: "",
              paragraphs: [
                "这些服务提供商仅在提供相关服务所需的范围内访问个人信息，并应承担相应的数据保护义务。",
              ],
            },
          ],
        },
        {
          id: "sharing-merchants",
          title: "5.3 商户、平台及业务合作方",
          paragraphs: [
            "如果您通过某一商户、平台或其他业务合作方使用 FilixPay 提供的支付服务，我们可能根据相关业务流程向该商户或合作方提供交易所需的信息。",
            "例如，商户可能需要获取交易状态、订单标识、支付结果或退款状态。",
          ],
        },
        {
          id: "sharing-legal",
          title: "5.4 法律及安全目的",
          paragraphs: [
            "在法律允许或要求的情况下，我们可能向：",
          ],
          bullets: [
            "法院；",
            "监管机构；",
            "执法机关；",
            "法律顾问；",
            "审计机构；",
          ],
          subsections: [
            {
              id: "sharing-legal-close",
              title: "",
              paragraphs: ["披露必要的信息。"],
            },
          ],
        },
      ],
    },
    {
      id: "international-transfers",
      title: "6. 国际数据传输",
      paragraphs: [
        "FilixPay 及其服务提供商可能在不同国家或地区处理个人信息。",
        "当个人信息从一个司法辖区传输至另一个司法辖区时，我们将根据适用法律采取适当的数据保护措施。",
        "对于适用跨境数据传输要求的个人信息，我们将在适用情况下使用法律认可的传输机制或其他适当保障措施。",
        "由于不同司法辖区对跨境数据传输的要求不同，具体机制可能根据您所在地区及相关服务关系而有所不同。",
      ],
    },
    {
      id: "retention",
      title: "7. 数据保留",
      paragraphs: [
        "我们仅在实现本隐私政策所述目的所必要的期限内保留个人信息，或者在适用法律要求或允许的期限内保留。",
        "实际保留期限取决于：",
      ],
      bullets: [
        "数据类型；",
        "数据处理目的；",
        "您与 FilixPay 的业务关系；",
        "法律、监管及会计要求；",
        "争议处理及法律权利保护需要；",
        "安全和防欺诈需要。",
      ],
      subsections: [
        {
          id: "retention-close",
          title: "",
          paragraphs: [
            "当个人信息不再需要保留时，我们会根据适用法律删除、匿名化或以其他适当方式处理。",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "8. 信息安全",
      paragraphs: [
        "FilixPay 采取合理的技术、管理和组织措施保护个人信息，包括在适用情况下：",
      ],
      bullets: [
        "访问控制；",
        "身份认证；",
        "权限管理；",
        "加密及传输保护；",
        "安全日志和审计；",
        "系统监控；",
        "安全事件检测与响应；",
        "数据备份及恢复措施。",
      ],
      subsections: [
        {
          id: "security-close",
          title: "",
          paragraphs: [
            "但是，没有任何互联网传输、电子存储或信息系统能够保证绝对安全。",
            "您也有责任保护自己的账户凭证、API 密钥和其他访问信息。如果您发现账户或凭证存在未经授权使用的情况，应及时联系我们或通过适当的账户安全渠道采取措施。",
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "9. Cookies 和类似技术",
      paragraphs: [
        "FilixPay 可能使用 Cookie、Local Storage、像素或类似技术。",
        "这些技术可能用于：",
      ],
      bullets: [
        "维持登录状态；",
        "保障账户和交易安全；",
        "保存语言及偏好设置；",
        "分析网站及服务使用情况；",
        "诊断技术问题；",
        "改善网站和服务。",
      ],
      subsections: [
        {
          id: "cookies-close",
          title: "",
          paragraphs: [
            "不同类型的 Cookie 可能具有不同的用途。",
            "在适用法律要求取得同意的情况下，我们会根据相关要求提供相应的同意和管理机制。",
            "您也可以通过浏览器设置管理部分 Cookie。但是，禁用必要 Cookie 可能导致部分服务无法正常运行。",
          ],
        },
      ],
    },
    {
      id: "rights",
      title: "10. 数据主体权利",
      paragraphs: [
        "根据您所在的司法辖区以及适用法律，您可能享有以下一项或多项权利：",
      ],
      bullets: [
        "获取有关个人信息处理的信息；",
        "访问个人信息；",
        "更正不准确或不完整的信息；",
        "删除个人信息；",
        "限制特定处理活动；",
        "反对特定处理；",
        "获取可携带的个人信息；",
        "在基于同意处理的情况下撤回同意；",
        "向相关数据保护机构提出投诉。",
      ],
      subsections: [
        {
          id: "rights-close",
          title: "",
          paragraphs: [
            "这些权利并非在所有情况下都适用，并可能受到法律规定的限制。",
            "如果您通过某个商户或企业使用 FilixPay 服务，并且该商户决定了相关个人信息的处理目的和方式，您可能需要首先向该商户提出请求。FilixPay 将在适用情况下协助相关组织履行其数据保护义务。",
            "如您直接向 FilixPay 提出隐私请求，我们可能需要验证您的身份，以保护个人信息免遭未经授权的访问。",
          ],
        },
      ],
    },
    {
      id: "children",
      title: "11. 儿童隐私",
      paragraphs: [
        "FilixPay 的服务主要面向企业、商户、平台及其授权人员，并非面向儿童。",
        "我们不会在明知的情况下，以违反适用法律的方式收集儿童个人信息。",
        "如果您认为儿童可能向我们提供了个人信息，请通过本政策所述联系方式联系我们。我们将在适用法律要求的范围内采取适当措施。",
      ],
    },
    {
      id: "third-parties",
      title: "12. 第三方网站和服务",
      paragraphs: [
        "FilixPay 的网站或服务可能包含指向第三方网站、支付服务、开发工具或其他外部服务的链接。",
        "第三方服务由相应第三方独立运营，其隐私实践不受本隐私政策控制。",
        "我们建议您在使用第三方服务前查看其隐私政策及相关条款。",
      ],
    },
    {
      id: "enterprise-accounts",
      title: "13. 企业账户及组织成员",
      paragraphs: [
        "如果您通过企业、商户或其他组织使用 FilixPay：",
      ],
      bullets: [
        "您的账户可能由该组织创建或管理；",
        "组织管理员可能能够管理您的账户、角色和权限；",
        "组织可能能够访问与您代表该组织进行的操作相关的记录；",
        "您的个人信息可能根据该组织与 FilixPay 之间的服务关系进行处理。",
      ],
      subsections: [
        {
          id: "enterprise-accounts-close",
          title: "",
          paragraphs: [
            "在这种情况下，相关组织可能对其自身的数据处理活动承担独立责任。",
          ],
        },
      ],
    },
    {
      id: "changes",
      title: "14. 隐私政策的变更",
      paragraphs: [
        "我们可能根据服务、法律法规或数据处理实践的变化更新本隐私政策。",
        "当我们更新本政策时，我们会更新页面顶部的“最后更新”日期。",
        "如果法律要求我们对重大变化采取额外通知措施，我们将按照适用法律采取相应措施。",
        "更新后的隐私政策自其载明的生效日期起适用，除非适用法律要求其他处理方式。",
      ],
    },
    {
      id: "contact",
      title: "15. 联系我们",
      paragraphs: [
        "如果您对本隐私政策、FilixPay 对个人信息的处理，或您的隐私权利有疑问，可以通过 FilixPay 网站公布的联系方式与我们联系。",
        "如您希望提出正式的隐私请求，请在请求中说明：",
      ],
      bullets: [
        "您的姓名或组织名称；",
        "与请求相关的账户或服务；",
        "请求内容；",
        "适用法律允许范围内的身份验证信息。",
      ],
      subsections: [
        {
          id: "contact-close",
          title: "",
          paragraphs: [
            "我们将在适用法律要求的期限内处理您的请求。",
            "隐私/法务联系地址：待确认。",
            "在正式隐私联系地址确定后，应在此处替换。",
          ],
        },
      ],
    },
    {
      id: "scope",
      title: "16. 适用范围",
      paragraphs: [
        "本隐私政策适用于 FilixPay 直接运营并明确受本政策约束的网站和服务。",
        "特定产品、服务、商户或合作关系可能适用额外的隐私说明、数据处理协议或其他数据保护条款。如果这些文件与本隐私政策存在差异，应根据相关服务关系和适用法律确定适用的文件。",
      ],
    },
  ],
};

const PRIVACY_EN: LegalDocument = {
  slug: "privacy",
  status: "draft",
  title: "FilixPay Privacy Policy",
  lastUpdated: "2026-09-06",
  notice: null,
  sections: [
    {
      id: "intro",
      title: "",
      paragraphs: [
        "FilixPay respects your privacy. This Privacy Policy explains how FilixPay collects, uses, discloses, retains, and protects personal information when you access or use FilixPay websites, the merchant platform, developer services, APIs, Checkout, Sandbox, and other related services (collectively, the “Services”).",
        "This Privacy Policy applies to information that FilixPay collects and processes directly. Where FilixPay merchants collect and process personal information from their own customers through their businesses, those merchants may independently determine the purposes and means of processing under applicable law and may have independent controller or processor responsibilities. In those cases, you should first review the relevant merchant’s privacy policy and data-processing arrangements.",
      ],
    },
    {
      id: "who-we-are",
      title: "1. Who We Are",
      paragraphs: [
        "FilixPay is a payment infrastructure and technology services platform for enterprises, merchants, platforms, and other business organizations. FilixPay provides payment integration, transaction processing, funds management, settlement, developer tooling, merchant operations, and related technical services.",
        "Depending on the specific Services you use and the applicable service relationship, FilixPay’s role in processing personal information may differ. For example:",
      ],
      bullets: [
        "When you visit FilixPay’s official websites or establish an account relationship directly with FilixPay, FilixPay may process your personal information as a direct party;",
        "When you use the FilixPay merchant platform as a member, employee, or authorized operator of a merchant or organization, FilixPay may process your personal information on behalf of that organization;",
        "When you make a payment or complete a transaction through a merchant that uses FilixPay Services, that merchant may determine the purposes and means of processing your personal information, and FilixPay may participate as a service provider or processor.",
      ],
      subsections: [
        {
          id: "who-we-are-role",
          title: "",
          paragraphs: [
            "The specific data-processing role depends on the relevant Services, contractual relationship, and applicable law.",
          ],
        },
      ],
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      paragraphs: [
        "We collect different categories of information depending on your relationship with FilixPay, the Services you use, and applicable law.",
      ],
      subsections: [
        {
          id: "account-identity",
          title: "2.1 Account and Identity Information",
          paragraphs: [
            "When you register for, sign in to, or manage a FilixPay account, we may collect:",
          ],
          bullets: [
            "Name;",
            "Company or organization name;",
            "Email address;",
            "Phone number;",
            "Login credentials and account identifiers;",
            "Organization, role, and permission information;",
            "Account security–related information.",
          ],
          subsections: [
            {
              id: "account-identity-enterprise",
              title: "",
              paragraphs: [
                "For enterprise customers, we may also collect business registration details, business documentation, and related contact information as needed to provide the Services.",
              ],
            },
          ],
        },
        {
          id: "merchant-business",
          title: "2.2 Merchant and Business Information",
          paragraphs: [
            "If you use FilixPay as a merchant, enterprise, or platform, we may process:",
          ],
          bullets: [
            "Enterprise and organization information;",
            "Merchant profile information;",
            "Business type and operating information;",
            "Collection and settlement configuration;",
            "Information related to bank or other external funding accounts;",
            "Payment channel configuration;",
            "API, webhook, and integration configuration;",
            "Files and records related to account operations.",
          ],
          subsections: [
            {
              id: "merchant-business-scope",
              title: "",
              paragraphs: [
                "The specific scope of collection depends on the Services you use and applicable business verification requirements.",
              ],
            },
          ],
        },
        {
          id: "transaction-payment",
          title: "2.3 Transaction and Payment Information",
          paragraphs: [
            "To provide payment and funds-related Services, we may process transaction-related information, such as:",
          ],
          bullets: [
            "Order and transaction identifiers;",
            "Payment amount, currency, and time;",
            "Payment status;",
            "Refund, chargeback, and dispute-related information;",
            "Settlement and money-movement records;",
            "Payment method and channel information;",
            "Risk-control and operational records related to transactions.",
          ],
          subsections: [
            {
              id: "transaction-payment-role",
              title: "",
              paragraphs: [
                "Providing payment infrastructure Services does not automatically make FilixPay the controller of all personal information involved in a transaction. The specific role depends on the transaction and service relationship.",
              ],
            },
          ],
        },
        {
          id: "technical-device",
          title: "2.4 Technical and Device Information",
          paragraphs: [
            "When you visit our websites or use the Services, we may automatically collect:",
          ],
          bullets: [
            "IP address;",
            "Browser type and version;",
            "Operating system;",
            "Device type;",
            "Language and locale settings;",
            "Page visit records;",
            "Sign-in and activity timestamps;",
            "Network and connection information;",
            "Error logs;",
            "Security event and audit logs.",
          ],
          subsections: [
            {
              id: "technical-device-purpose",
              title: "",
              paragraphs: [
                "This information is primarily used to provide the Services, maintain security, diagnose issues, and improve the Services.",
              ],
            },
          ],
        },
        {
          id: "api-developer",
          title: "2.5 API, Developer, and Integration Data",
          paragraphs: [
            "If you use FilixPay APIs, SDKs, webhooks, Sandbox, or other developer services, we may process:",
          ],
          bullets: [
            "API credentials and related identifiers;",
            "Technical metadata for requests and responses;",
            "Webhook delivery and status records;",
            "API call timing and source information;",
            "Sandbox test data;",
            "Integration error and runtime logs.",
          ],
          subsections: [
            {
              id: "api-developer-warning",
              title: "",
              paragraphs: [
                "You should not submit unnecessary real sensitive personal information through APIs or test environments.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "how-we-use",
      title: "3. How We Use Personal Information",
      paragraphs: [
        "We may process personal information for the following purposes:",
      ],
      subsections: [
        {
          id: "use-operate",
          title: "3.1 Providing and Operating the Services",
          paragraphs: ["Including to:"],
          bullets: [
            "Create and manage accounts;",
            "Verify user identity and account permissions;",
            "Provide payment and transaction-processing capabilities;",
            "Provide merchant operations features;",
            "Perform settlement and related funds workflows;",
            "Provide APIs, webhooks, Sandbox, and other technical services;",
            "Provide customer support.",
          ],
        },
        {
          id: "use-security",
          title: "3.2 Security and Risk Control",
          paragraphs: ["Including to:"],
          bullets: [
            "Prevent fraud, abuse, and unauthorized access;",
            "Detect anomalous transactions and security events;",
            "Protect accounts, API credentials, and systems;",
            "Investigate security incidents;",
            "Maintain audit records.",
          ],
        },
        {
          id: "use-improve",
          title: "3.3 Improving the Services",
          paragraphs: ["We may use related information to:"],
          bullets: [
            "Analyze Service usage;",
            "Identify and fix technical issues;",
            "Improve product features and user experience;",
            "Develop and test new capabilities;",
            "Maintain Service stability and performance.",
          ],
          subsections: [
            {
              id: "use-improve-protect",
              title: "",
              paragraphs: [
                "Where required by applicable law, we apply appropriate de-identification, aggregation, or other safeguards to information used for analytics and improvement.",
              ],
            },
          ],
        },
        {
          id: "use-legal",
          title: "3.4 Legal and Compliance Requirements",
          paragraphs: [
            "We may process or disclose information as needed to:",
          ],
          bullets: [
            "Comply with applicable laws and regulations;",
            "Respond to lawful requests from courts, regulators, or law enforcement;",
            "Perform contracts;",
            "Establish, exercise, or defend legal rights;",
            "Prevent unlawful activity.",
          ],
        },
      ],
    },
    {
      id: "legal-bases",
      title: "4. Legal Bases for Processing",
      paragraphs: [
        "Where applicable law requires a specific legal basis for processing personal information, we may rely on one or more of the following:",
      ],
      bullets: [
        "Performance of a contract or steps taken prior to entering into a contract;",
        "Compliance with a legal obligation;",
        "Legitimate interests of FilixPay or a third party;",
        "Your consent;",
        "Other bases permitted under applicable law.",
      ],
      subsections: [
        {
          id: "legal-bases-detail",
          title: "",
          paragraphs: [
            "The specific legal basis depends on the category of personal information, the processing purpose, the service relationship, and the applicable jurisdiction.",
            "Where we process personal information based on consent, you may withdraw consent to the extent permitted by applicable law. Withdrawal does not affect the lawfulness of processing based on consent before its withdrawal.",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "5. How We Share Personal Information",
      paragraphs: [
        "We do not sell personal information to data brokers, and we do not sell personal information for independent third-party marketing purposes.",
        "Where necessary to provide the Services, we may share personal information with the following categories of recipients:",
      ],
      subsections: [
        {
          id: "sharing-payment",
          title: "5.1 Payment and Financial Service Providers",
          paragraphs: [
            "Depending on the transaction and service configuration, this may include:",
          ],
          bullets: [
            "Payment service providers;",
            "Acquirers;",
            "Banks;",
            "Card networks or payment networks;",
            "Local payment channels;",
            "Digital-asset or blockchain-related service providers.",
          ],
          subsections: [
            {
              id: "sharing-payment-note",
              title: "",
              paragraphs: [
                "These third parties may process related information under their own privacy policies.",
              ],
            },
          ],
        },
        {
          id: "sharing-infra",
          title: "5.2 Technology and Infrastructure Providers",
          paragraphs: ["For example:"],
          bullets: [
            "Cloud infrastructure providers;",
            "Data storage providers;",
            "Identity and authentication providers;",
            "Logging and monitoring providers;",
            "Communications providers;",
            "Customer support tooling providers;",
            "Security service providers.",
          ],
          subsections: [
            {
              id: "sharing-infra-note",
              title: "",
              paragraphs: [
                "These providers access personal information only as needed to deliver their services and should be subject to appropriate data-protection obligations.",
              ],
            },
          ],
        },
        {
          id: "sharing-merchants",
          title: "5.3 Merchants, Platforms, and Business Partners",
          paragraphs: [
            "If you use payment Services provided through FilixPay via a merchant, platform, or other business partner, we may provide that merchant or partner with information needed for the relevant transaction workflow.",
            "For example, a merchant may need transaction status, order identifiers, payment results, or refund status.",
          ],
        },
        {
          id: "sharing-legal",
          title: "5.4 Legal and Security Purposes",
          paragraphs: [
            "Where permitted or required by law, we may disclose necessary information to:",
          ],
          bullets: [
            "Courts;",
            "Regulators;",
            "Law enforcement;",
            "Legal counsel;",
            "Auditors.",
          ],
        },
      ],
    },
    {
      id: "international-transfers",
      title: "6. International Data Transfers",
      paragraphs: [
        "FilixPay and its service providers may process personal information in different countries or regions.",
        "When personal information is transferred from one jurisdiction to another, we will take appropriate data-protection measures in accordance with applicable law.",
        "Where cross-border transfer requirements apply, we will use legally recognized transfer mechanisms or other appropriate safeguards as applicable.",
        "Because transfer requirements differ by jurisdiction, the specific mechanism may vary based on your location and the relevant service relationship.",
      ],
    },
    {
      id: "retention",
      title: "7. Data Retention",
      paragraphs: [
        "We retain personal information only for as long as necessary to fulfill the purposes described in this Privacy Policy, or for as long as required or permitted by applicable law.",
        "Actual retention periods depend on:",
      ],
      bullets: [
        "The type of data;",
        "The purpose of processing;",
        "Your business relationship with FilixPay;",
        "Legal, regulatory, and accounting requirements;",
        "Dispute resolution and legal rights protection needs;",
        "Security and fraud-prevention needs.",
      ],
      subsections: [
        {
          id: "retention-close",
          title: "",
          paragraphs: [
            "When personal information is no longer required, we delete, anonymize, or otherwise handle it in an appropriate manner under applicable law.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "8. Information Security",
      paragraphs: [
        "FilixPay implements reasonable technical, administrative, and organizational measures to protect personal information, including where applicable:",
      ],
      bullets: [
        "Access controls;",
        "Identity authentication;",
        "Permission management;",
        "Encryption and transmission protections;",
        "Security logging and auditing;",
        "System monitoring;",
        "Security incident detection and response;",
        "Data backup and recovery measures.",
      ],
      subsections: [
        {
          id: "security-close",
          title: "",
          paragraphs: [
            "However, no internet transmission, electronic storage, or information system can be guaranteed to be absolutely secure.",
            "You are also responsible for protecting your account credentials, API keys, and other access information. If you become aware of unauthorized use of an account or credentials, contact us promptly or take action through the appropriate account-security channels.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "9. Cookies and Similar Technologies",
      paragraphs: [
        "FilixPay may use cookies, local storage, pixels, or similar technologies.",
        "These technologies may be used to:",
      ],
      bullets: [
        "Maintain signed-in sessions;",
        "Help protect account and transaction security;",
        "Store language and preference settings;",
        "Analyze website and Service usage;",
        "Diagnose technical issues;",
        "Improve websites and Services.",
      ],
      subsections: [
        {
          id: "cookies-close",
          title: "",
          paragraphs: [
            "Different cookies may serve different purposes.",
            "Where applicable law requires consent, we will provide appropriate consent and management mechanisms.",
            "You may also manage some cookies through your browser settings. Disabling necessary cookies may prevent parts of the Services from functioning properly.",
          ],
        },
      ],
    },
    {
      id: "rights",
      title: "10. Data Subject Rights",
      paragraphs: [
        "Depending on your jurisdiction and applicable law, you may have one or more of the following rights:",
      ],
      bullets: [
        "Obtain information about the processing of personal information;",
        "Access personal information;",
        "Correct inaccurate or incomplete information;",
        "Delete personal information;",
        "Restrict certain processing activities;",
        "Object to certain processing;",
        "Receive personal information in a portable form;",
        "Withdraw consent where processing is based on consent;",
        "Lodge a complaint with a relevant data protection authority.",
      ],
      subsections: [
        {
          id: "rights-close",
          title: "",
          paragraphs: [
            "These rights are not available in all circumstances and may be subject to legal limitations.",
            "If you use FilixPay Services through a merchant or enterprise that determines the purposes and means of processing the relevant personal information, you may need to submit your request to that merchant first. FilixPay will assist the relevant organization in meeting its data-protection obligations where applicable.",
            "If you submit a privacy request directly to FilixPay, we may need to verify your identity to protect personal information from unauthorized access.",
          ],
        },
      ],
    },
    {
      id: "children",
      title: "11. Children’s Privacy",
      paragraphs: [
        "FilixPay Services are primarily intended for enterprises, merchants, platforms, and their authorized personnel, and are not directed to children.",
        "We do not knowingly collect children’s personal information in a manner that violates applicable law.",
        "If you believe a child may have provided personal information to us, please contact us using the channels described in this Policy. We will take appropriate steps as required by applicable law.",
      ],
    },
    {
      id: "third-parties",
      title: "12. Third-Party Websites and Services",
      paragraphs: [
        "FilixPay websites or Services may contain links to third-party websites, payment services, developer tools, or other external services.",
        "Third-party services are operated independently, and their privacy practices are not controlled by this Privacy Policy.",
        "We recommend reviewing the privacy policies and related terms of third-party services before using them.",
      ],
    },
    {
      id: "enterprise-accounts",
      title: "13. Enterprise Accounts and Organization Members",
      paragraphs: [
        "If you use FilixPay through an enterprise, merchant, or other organization:",
      ],
      bullets: [
        "Your account may be created or managed by that organization;",
        "Organization administrators may be able to manage your account, roles, and permissions;",
        "The organization may be able to access records related to actions you take on its behalf;",
        "Your personal information may be processed under the service relationship between that organization and FilixPay.",
      ],
      subsections: [
        {
          id: "enterprise-accounts-close",
          title: "",
          paragraphs: [
            "In these cases, the organization may have independent responsibility for its own data-processing activities.",
          ],
        },
      ],
    },
    {
      id: "changes",
      title: "14. Changes to This Privacy Policy",
      paragraphs: [
        "We may update this Privacy Policy to reflect changes in the Services, laws and regulations, or data-processing practices.",
        "When we update this Policy, we will update the “Last Updated” date at the top of the page.",
        "If applicable law requires additional notice for material changes, we will provide such notice as required.",
        "The updated Privacy Policy applies from the Effective Date stated on the page, unless applicable law requires otherwise.",
      ],
    },
    {
      id: "contact",
      title: "15. Contact Us",
      paragraphs: [
        "If you have questions about this Privacy Policy, FilixPay’s processing of personal information, or your privacy rights, you may contact us through the public contact channels published on the FilixPay website.",
        "To submit a formal privacy request, please include:",
      ],
      bullets: [
        "Your name or organization name;",
        "The account or Service related to the request;",
        "A description of the request;",
        "Identity-verification information to the extent permitted by applicable law.",
      ],
      subsections: [
        {
          id: "contact-close",
          title: "",
          paragraphs: [
            "We will handle your request within the timeframes required by applicable law.",
            "Privacy / Legal contact address: To be confirmed.",
            "This placeholder will be replaced once a dedicated privacy contact address is designated.",
          ],
        },
      ],
    },
    {
      id: "scope",
      title: "16. Scope of Application",
      paragraphs: [
        "This Privacy Policy applies to websites and Services that FilixPay operates directly and that are expressly subject to this Policy.",
        "Specific products, services, merchants, or partnership arrangements may be subject to additional privacy notices, data processing agreements, or other data-protection terms. If those documents differ from this Privacy Policy, the applicable document is determined by the relevant service relationship and applicable law.",
      ],
    },
  ],
};

export const PRIVACY_BY_LOCALE: Record<LegalContentLocale, LegalDocument> = {
  en: PRIVACY_EN,
  zh: PRIVACY_ZH,
};
