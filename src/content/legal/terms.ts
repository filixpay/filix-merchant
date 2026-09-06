import type { LegalContentLocale } from "@/lib/legal/content-locales";
import type { LegalDocument } from "./types";

/**
 * Terms of Service V1 — formal production copy.
 * ZH and EN share the same legal structure; do not replace with machine translation.
 * Pending legal confirmation: legal entity name, address, governing law / dispute mechanism.
 */
const TERMS_ZH: LegalDocument = {
  slug: "terms",
  status: "draft",
  title: "服务条款",
  lastUpdated: "2026-09-06",
  notice: null,
  sections: [
    {
      id: "intro",
      title: "",
      paragraphs: [
        "欢迎使用 FilixPay。",
        "本《服务条款》（以下简称“本条款”）由您与 FilixPay 之间订立，并适用于您访问或使用 FilixPay 提供的网站、商户中心、API、SDK、Checkout、Sandbox、支付基础设施以及其他相关产品和服务（统称“服务”）。",
        "请在使用服务前仔细阅读本条款。通过注册账户、访问或使用服务，或在相关页面明确接受本条款，即表示您已阅读、理解并同意受本条款约束。",
        "如果您代表企业、商户、平台或其他组织使用服务，您声明并保证您具有代表该组织接受本条款的必要授权。在这种情况下，“您”及“您的”包括您本人以及您所代表的该组织。",
        "如您不同意本条款，请勿访问或使用服务。",
      ],
    },
    {
      id: "overview",
      title: "1. 服务概述",
      paragraphs: [
        "FilixPay 是面向企业、商户、平台及其他业务组织的支付基础设施平台。",
        "FilixPay 的服务可能包括支付处理、支付渠道接入、交易处理、支付路由、资金流转相关能力、结算支持、商户运营工具、API、Webhook、开发者工具以及其他相关技术服务。",
        "具体服务内容取决于您所使用的产品、账户类型、地区、商业安排以及适用的服务协议。",
        "FilixPay 可以根据业务、技术、法律或安全需要增加、修改、暂停或停止部分服务或功能。",
        "除非相关书面协议另有明确约定，FilixPay 不保证任何特定服务、支付渠道或功能在所有地区、所有时间或所有账户中均可用。",
      ],
    },
    {
      id: "definitions",
      title: "2. 定义",
      paragraphs: ["在本条款中："],
      definitions: [
        {
          term: "“FilixPay”",
          text: "指提供本服务的 FilixPay 运营主体及其在相关服务中适用的关联实体。",
        },
        {
          term: "“服务”",
          text: "指 FilixPay 提供的网站、商户中心、API、SDK、Checkout、Sandbox、支付基础设施、开发者工具以及其他相关产品和服务。",
        },
        {
          term: "“商户”",
          text: "指使用服务开展商业活动、收款、支付处理或相关业务运营的企业、组织或其他合法经营主体。",
        },
        {
          term: "“账户”",
          text: "指为访问或使用服务而创建的账户以及与该账户相关的组织、权限和配置。",
        },
        {
          term: "“授权用户”",
          text: "指经您授权代表您或您的组织访问或使用服务的个人。",
        },
        {
          term: "“支付渠道”",
          text: "指银行、支付服务提供商、卡组织、本地支付网络、数字资产或其他第三方支付及资金服务渠道。",
        },
        {
          term: "“交易”",
          text: "指通过服务发起、处理、记录或跟踪的支付、退款、资金流转或其他相关业务活动。",
        },
        {
          term: "“内容”",
          text: "指您通过服务提交、上传、传输或展示的数据、资料、文本、图像以及其他信息。",
        },
      ],
    },
    {
      id: "account-eligibility",
      title: "3. 账户与资格",
      subsections: [
        {
          id: "eligibility",
          title: "3.1 账户资格",
          paragraphs: [
            "您只能在具有订立具有法律约束力协议的能力，并且使用服务不违反适用法律的情况下使用服务。",
            "如果您代表企业或其他组织使用服务，您必须具有代表该组织接受本条款以及使用相关服务的授权。",
          ],
        },
        {
          id: "registration",
          title: "3.2 注册信息",
          paragraphs: [
            "您应提供真实、准确、完整且最新的账户和业务信息。",
            "如果您的信息发生重大变化，您应及时更新相关信息。",
            "FilixPay 可以根据服务性质及适用法律要求您提供额外的身份、业务、所有权、控制权或合规信息。",
          ],
        },
        {
          id: "account-security",
          title: "3.3 账户安全",
          paragraphs: ["您应妥善保护："],
          bullets: [
            "登录凭证；",
            "API 密钥；",
            "Access Token；",
            "Webhook 配置；",
            "管理员权限；",
            "其他用于访问服务的安全凭证。",
          ],
          subsections: [
            {
              id: "account-security-close",
              title: "",
              paragraphs: [
                "您应对通过您的账户、授权用户或您的安全凭证进行的活动承担相应责任。",
                "如果您发现账户存在未经授权的访问、凭证泄露或其他安全事件，应立即采取措施并通过适当渠道通知 FilixPay。",
              ],
            },
          ],
        },
        {
          id: "authorized-users",
          title: "3.4 授权用户",
          paragraphs: [
            "您可以根据服务支持的组织和权限功能向授权用户授予访问权限。",
            "您应确保授权用户：",
          ],
          bullets: [
            "具有适当的授权；",
            "遵守本条款；",
            "遵守适用法律；",
            "按照您建立的内部权限和安全控制使用服务。",
          ],
          subsections: [
            {
              id: "authorized-users-close",
              title: "",
              paragraphs: ["授权用户的行为可能被视为您的行为。"],
            },
          ],
        },
      ],
    },
    {
      id: "merchant-responsibilities",
      title: "4. 商户及组织责任",
      paragraphs: [
        "如果您以商户、企业或其他组织身份使用服务，您负责：",
      ],
      bullets: [
        "您提供的商品和服务的合法性；",
        "您的商业活动；",
        "面向客户提供的商品、服务及相关说明；",
        "价格、税费及其他商业披露；",
        "客户服务及订单履行；",
        "您使用服务所提交的数据的准确性；",
        "您的账户、授权用户及内部权限管理；",
        "API 密钥和其他访问凭证的安全；",
        "遵守适用法律、法规以及相关支付渠道的规则。",
      ],
      subsections: [
        {
          id: "merchant-responsibilities-close",
          title: "",
          paragraphs: [
            "除非相关书面协议另有明确约定，FilixPay 不负责您与您的客户之间的商品、服务、订单履行或其他商业争议。",
          ],
        },
      ],
    },
    {
      id: "payments-money-movement",
      title: "5. 支付与资金流转",
      paragraphs: [
        "FilixPay 可以根据您所配置的服务和支付渠道提供支付及资金流转相关技术能力。",
        "具体支付和资金服务可能涉及：",
      ],
      bullets: [
        "支付发起；",
        "支付处理；",
        "支付状态查询；",
        "支付路由；",
        "退款；",
        "交易通知；",
        "结算相关处理；",
        "对账及交易记录；",
        "其他相关资金流程。",
      ],
      subsections: [
        {
          id: "payments-money-movement-close",
          title: "",
          paragraphs: [
            "实际可用的支付方式、币种、地区、处理时间及功能取决于相关支付渠道、金融机构、合作方、风险控制措施以及适用法律。",
            "支付交易可能受到第三方支付服务商、银行、卡组织、支付网络或其他合作方的规则约束。",
            "因此，除非相关书面协议明确约定，FilixPay 不保证：",
          ],
          bullets: [
            "所有支付均会成功；",
            "某一支付渠道始终可用；",
            "特定交易在固定时间内完成；",
            "特定币种或地区始终可用；",
            "第三方支付渠道不会发生延迟、中断或拒绝。",
          ],
          subsections: [
            {
              id: "payments-third-party-terms",
              title: "",
              paragraphs: [
                "如果某项服务由第三方支付或金融服务提供商直接提供，您还可能需要接受该第三方的服务条款和隐私政策。",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "fees",
      title: "6. 费用与付款",
      paragraphs: [
        "您应按照适用于您账户或服务的价格、订单、商业协议或其他约定支付相关费用。",
        "具体费用可能根据：",
      ],
      bullets: [
        "服务类型；",
        "交易类型；",
        "支付渠道；",
        "地区；",
        "币种；",
        "交易量；",
        "商业合作安排；",
      ],
      subsections: [
        {
          id: "fees-close",
          title: "",
          paragraphs: [
            "而有所不同。",
            "除非相关协议另有约定，您负责因使用服务而产生的适用税费以及您自身经营活动产生的税务义务。",
            "如果您未按照约定支付应付款项，FilixPay 可以在适用法律及相关协议允许的范围内限制或暂停相关服务。",
          ],
        },
      ],
    },
    {
      id: "prohibited-use",
      title: "7. 禁止使用",
      paragraphs: [
        "您不得使用服务从事违法、欺诈、误导、滥用或危害他人及系统安全的活动。",
        "禁止行为包括但不限于：",
      ],
      orderedBullets: [
        "违反适用法律或法规；",
        "进行欺诈、洗钱或其他金融犯罪；",
        "违反适用的制裁或出口管制要求；",
        "侵犯他人的知识产权或其他合法权益；",
        "提交虚假、误导性或未经授权的信息；",
        "绕过身份验证、风控、权限或安全控制；",
        "未经授权访问其他账户、系统或数据；",
        "干扰服务正常运行；",
        "传播恶意代码、病毒或其他有害程序；",
        "对服务进行未经授权的扫描、测试或攻击；",
        "将服务用于 FilixPay 或相关支付渠道明确禁止的业务；",
        "协助第三方实施上述行为。",
      ],
      subsections: [
        {
          id: "prohibited-use-close",
          title: "",
          paragraphs: [
            "FilixPay 可以根据风险、法律要求、合作方规则或安全需要调查涉嫌违规行为，并采取适当措施。",
          ],
        },
      ],
    },
    {
      id: "compliance",
      title: "8. 合规、身份验证与风险控制",
      paragraphs: [
        "为提供服务以及履行适用法律和合作方要求，FilixPay 可能实施或协助实施：",
      ],
      bullets: [
        "身份验证；",
        "企业及业务验证；",
        "所有权及控制权验证；",
        "客户尽职调查；",
        "反洗钱控制；",
        "制裁筛查；",
        "欺诈及风险检测；",
        "交易监控；",
        "其他适用的合规措施。",
      ],
      subsections: [
        {
          id: "compliance-close",
          title: "",
          paragraphs: [
            "您同意根据合理要求提供与上述流程有关的信息和文件。",
            "如果您未能提供必要信息，或者相关信息无法通过验证，FilixPay 可以在适用法律允许的范围内拒绝、限制、暂停或终止相关服务。",
            "FilixPay 提供的具体服务和合规能力可能因地区、产品和合作安排而不同。",
            "除非 FilixPay 另行以书面方式明确说明，本条款不构成 FilixPay 已取得特定司法辖区的特定金融牌照、监管批准或合规认证的声明。",
          ],
        },
      ],
    },
    {
      id: "third-party-services",
      title: "9. 第三方服务",
      paragraphs: [
        "服务可能依赖或集成第三方提供的服务，包括：",
      ],
      bullets: [
        "支付服务；",
        "银行及金融基础设施；",
        "支付网络；",
        "云基础设施；",
        "身份验证服务；",
        "通信服务；",
        "数据存储；",
        "安全及监控服务；",
        "其他技术或业务服务。",
      ],
      subsections: [
        {
          id: "third-party-services-close",
          title: "",
          paragraphs: [
            "第三方服务可能受其自身的条款、隐私政策和其他规则约束。",
            "对于由第三方独立提供和控制的服务，FilixPay 不对该第三方服务的持续可用性、准确性或性能承担超出适用协议和法律要求范围的责任。",
          ],
        },
      ],
    },
    {
      id: "data-privacy",
      title: "10. 数据与隐私",
      paragraphs: [
        "FilixPay 对个人信息的收集和使用受《隐私政策》约束。",
        "您使用服务时，应遵守适用于您业务的数据保护和隐私法律。",
        "如果您向 FilixPay 提供或通过 FilixPay 处理其他个人的信息，您应确保：",
      ],
      bullets: [
        "您具有合法处理相关信息的依据；",
        "您已经依法向相关个人提供必要的隐私告知；",
        "您有权按照相关服务所需的方式向 FilixPay 提供这些信息；",
        "您遵守适用的数据保护法律。",
      ],
      subsections: [
        {
          id: "data-privacy-close",
          title: "",
          paragraphs: [
            "如果相关服务涉及 FilixPay 代表您处理个人信息，双方可能另行签订数据处理协议或其他数据保护文件。",
          ],
        },
      ],
    },
    {
      id: "your-content",
      title: "11. 您的内容与数据",
      paragraphs: [
        "您保留对您合法拥有并提交至服务的内容和数据的相应权利。",
        "您授予 FilixPay 一项非独占的、在全球范围内有效的许可，使 FilixPay 可以在提供、维护、保护和改进服务所必要的范围内：",
      ],
      bullets: ["存储；", "复制；", "处理；", "传输；", "展示；"],
      subsections: [
        {
          id: "your-content-close",
          title: "",
          paragraphs: [
            "相关内容和数据。",
            "FilixPay 不会将您的内容用于超出适用隐私政策、相关协议或法律允许范围的目的。",
            "您应确保向服务提交的内容和数据不会：",
          ],
          bullets: [
            "违反法律；",
            "侵犯第三方权利；",
            "包含未经授权披露的个人信息；",
            "包含恶意代码；",
            "违反您与第三方之间的义务。",
          ],
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "12. 知识产权",
      paragraphs: [
        "服务及其相关软件、API、文档、设计、界面、商标、标识以及其他材料中的知识产权归 FilixPay 或其许可方所有。",
        "除非本条款或其他书面协议明确允许，您不得：",
      ],
      bullets: [
        "复制服务；",
        "出售、出租或再许可服务；",
        "未经授权分发服务；",
        "反向工程或试图提取源代码；",
        "移除版权、商标或其他权利声明；",
        "使用 FilixPay 的品牌或标识造成来源混淆。",
      ],
      subsections: [
        {
          id: "intellectual-property-close",
          title: "",
          paragraphs: [
            "如果某些 FilixPay 软件或组件根据单独的开源许可证发布，则相关组件受适用的开源许可证约束。",
            "本条款不会限制您依据适用开源许可证所享有的权利。",
          ],
        },
      ],
    },
    {
      id: "confidentiality",
      title: "13. 保密",
      paragraphs: [
        "如果双方因使用服务而获得对方明确标识为保密或根据其性质合理应被理解为保密的信息，接收方应采取合理措施保护该信息，并仅在履行相关服务或法律允许的范围内使用。",
        "保密义务不适用于接收方能够证明：",
      ],
      bullets: [
        "已公开且并非因违反本条款而公开；",
        "在披露前已经合法持有；",
        "从有权披露的第三方合法获得；",
        "独立开发且未使用保密信息；",
      ],
      subsections: [
        {
          id: "confidentiality-close",
          title: "",
          paragraphs: [
            "的信息。",
            "如果法律、法院或监管机构要求披露保密信息，接收方可以在法律允许的范围内进行披露。",
          ],
        },
      ],
    },
    {
      id: "availability",
      title: "14. 服务可用性与变更",
      paragraphs: [
        "FilixPay 会在合理范围内维护服务的可用性和安全性，但不保证服务始终：",
      ],
      bullets: [
        "不间断；",
        "无错误；",
        "完全安全；",
        "不受第三方故障影响。",
      ],
      subsections: [
        {
          id: "availability-close",
          title: "",
          paragraphs: [
            "服务可能受到维护、升级、网络故障、支付渠道中断、第三方服务故障、不可抗力或其他超出 FilixPay 合理控制范围的事件影响。",
            "FilixPay 可以根据技术、业务、安全或法律要求对服务进行修改、升级或停止部分功能。",
            "对于重大且持续性的服务变更，FilixPay 将在适用法律及相关协议要求的范围内提供合理通知。",
          ],
        },
      ],
    },
    {
      id: "suspension-termination",
      title: "15. 暂停与终止",
      paragraphs: [
        "FilixPay 可以在以下情形下暂停或限制您的全部或部分服务：",
      ],
      bullets: [
        "您违反本条款；",
        "存在欺诈、滥用或安全风险；",
        "存在法律或监管要求；",
        "您未支付应付款项；",
        "支付渠道或合作方要求限制服务；",
        "账户信息无法验证；",
        "继续提供服务可能使 FilixPay、其他用户或第三方承担重大风险。",
      ],
      subsections: [
        {
          id: "suspension-termination-close",
          title: "",
          paragraphs: [
            "在法律允许且实际可行的情况下，FilixPay 会根据具体情况提供相应通知。",
            "您可以按照适用的账户功能或商业协议停止使用服务。",
            "服务终止后：",
          ],
          bullets: [
            "您对服务的访问权限可能被关闭；",
            "未完成的交易和相关资金流程可能根据适用规则继续处理；",
            "双方在终止前已经产生的付款、责任和其他义务不会因此自动消失；",
            "根据性质应在终止后继续有效的条款仍然有效。",
          ],
        },
      ],
    },
    {
      id: "disclaimers",
      title: "16. 免责声明",
      paragraphs: [
        "在适用法律允许的最大范围内，除本条款或双方另行签订的书面协议明确约定外，服务按其现有状态和可用状态提供。",
        "FilixPay 不对以下事项作出未经明确约定的保证：",
      ],
      bullets: [
        "服务完全符合您的特定业务需求；",
        "服务持续、不间断或无错误；",
        "所有支付交易均会成功；",
        "第三方支付渠道始终可用；",
        "特定交易将在指定时间完成；",
        "服务不会发生安全事件；",
        "第三方提供的信息或服务始终准确、完整或及时。",
      ],
      subsections: [
        {
          id: "disclaimers-close",
          title: "",
          paragraphs: [
            "本条不排除适用法律不得排除或限制的任何保证或责任。",
          ],
        },
      ],
    },
    {
      id: "limitation-of-liability",
      title: "17. 责任限制",
      paragraphs: [
        "在适用法律允许的最大范围内，FilixPay 不对因您使用或无法使用服务而产生的间接、附带、特殊、惩罚性或后果性损失承担责任，包括但不限于利润损失、收入损失、商誉损失、数据损失或业务中断。",
        "对于由第三方支付渠道、银行、支付网络、基础设施服务商或其他第三方直接造成的损失，FilixPay 的责任范围受适用法律以及相关协议约束。",
        "如果适用的商业协议对责任范围、责任上限或特定损失作出了约定，则以该协议为准。",
        "本条不限制适用法律明确禁止限制或排除的责任。",
      ],
    },
    {
      id: "indemnification",
      title: "18. 赔偿",
      paragraphs: [
        "在适用法律允许的范围内，如果因您：",
      ],
      bullets: [
        "违反本条款；",
        "违反适用法律；",
        "侵犯第三方权利；",
        "违反您与客户之间的义务；",
        "不当使用服务；",
        "您的授权用户实施相关行为；",
      ],
      subsections: [
        {
          id: "indemnification-close",
          title: "",
          paragraphs: [
            "而导致第三方向 FilixPay 提出索赔、调查或诉讼，您应在适用法律及相关协议规定的范围内承担相应责任，并配合 FilixPay 进行合理的抗辩和处理。",
            "具体赔偿范围、程序和限制，如双方另有书面协议，以该协议为准。",
          ],
        },
      ],
    },
    {
      id: "changes",
      title: "19. 条款变更",
      paragraphs: [
        "FilixPay 可以根据业务、技术、法律或监管要求更新本条款。",
        "更新后的版本将发布在本页面，并更新页面顶部的“最后更新”日期。",
        "如果法律要求对重大变更进行额外通知，FilixPay 将按照适用法律采取相应措施。",
        "在适用法律允许的范围内，您在变更生效后继续使用服务，即表示接受更新后的条款。",
        "如果您不同意更新后的条款，应停止使用受影响的服务。",
      ],
    },
    {
      id: "governing-law",
      title: "20. 适用法律与争议解决",
      paragraphs: [
        "本条款的适用法律、管辖地以及争议解决方式，应根据您与 FilixPay 之间适用的商业协议、订单或其他合同文件确定。",
        "如果双方之间不存在另行约定适用法律和争议解决方式的书面协议，相关事项将根据适用法律确定。",
        "FilixPay 将在确定适用的法律主体、司法辖区及正式争议解决机制后，在本条款中补充相应的法律条款。",
      ],
    },
    {
      id: "notices",
      title: "21. 通知",
      paragraphs: [
        "FilixPay 可以通过以下方式向您发送与服务有关的通知：",
      ],
      bullets: [
        "账户中的通知；",
        "电子邮件；",
        "服务内消息；",
        "网站公告；",
        "其他合理的电子方式。",
      ],
      subsections: [
        {
          id: "notices-close",
          title: "",
          paragraphs: [
            "您应确保账户中保存的联系方式真实、有效并能够接收相关通知。",
            "需要向 FilixPay 发送正式法律通知的，应按照相关商业协议或 FilixPay 公布的正式联系渠道进行。",
          ],
        },
      ],
    },
    {
      id: "general",
      title: "22. 一般条款",
      subsections: [
        {
          id: "entire-agreement",
          title: "22.1 完整协议",
          paragraphs: [
            "本条款以及适用于特定服务的订单、商业协议、服务协议、数据处理协议及其他书面文件，共同构成双方就相关服务达成的协议。",
            "如果不同文件之间存在冲突，应按照相关文件中规定的优先顺序确定。",
          ],
        },
        {
          id: "severability",
          title: "22.2 可分割性",
          paragraphs: [
            "如果本条款的任何条款被认定为无效或不可执行，其余条款仍然有效。",
          ],
        },
        {
          id: "no-waiver",
          title: "22.3 不弃权",
          paragraphs: [
            "任何一方未行使或延迟行使本条款项下的权利，不构成对该权利的放弃。",
          ],
        },
        {
          id: "assignment",
          title: "22.4 转让",
          paragraphs: [
            "未经另一方同意，您不得转让本条款或其项下的主要权利义务，但适用法律允许的企业重组、合并或资产转让除外。",
            "FilixPay 可以将本条款转让给其关联实体或因企业重组、合并、收购或资产转让而承接相关业务的主体。",
          ],
        },
        {
          id: "no-agency",
          title: "22.5 不构成代理关系",
          paragraphs: [
            "除非双方另有明确书面约定，本条款不构成双方之间的合伙、代理、雇佣、特许经营或合资关系。",
          ],
        },
        {
          id: "force-majeure",
          title: "22.6 不可抗力",
          paragraphs: [
            "对于因合理控制范围之外的事件导致的服务延迟或无法履行，包括自然灾害、战争、政府行为、网络故障、重大基础设施故障、公共卫生事件或其他类似事件，FilixPay 在适用法律允许的范围内不承担由此产生的责任。",
          ],
        },
      ],
    },
    {
      id: "contact",
      title: "23. 联系我们",
      paragraphs: [
        "如果您对本条款、服务或相关合同安排有疑问，请通过 FilixPay 网站公布的联系方式与我们联系。",
        "如需发送正式法律通知，请使用适用于您账户或商业协议的正式通知渠道。",
        "FilixPay 的正式法律主体名称、法律地址及专用法律通知联系方式，将根据适用服务及合同安排确定。",
      ],
    },
  ],
};

const TERMS_EN: LegalDocument = {
  slug: "terms",
  status: "draft",
  title: "Terms of Service",
  lastUpdated: "2026-09-06",
  notice: null,
  sections: [
    {
      id: "intro",
      title: "",
      paragraphs: [
        "Welcome to FilixPay.",
        "These Terms of Service (the “Terms”) are entered into between you and FilixPay and apply to your access to or use of FilixPay websites, Merchant Center, APIs, SDKs, Checkout, Sandbox, payment infrastructure, and other related products and services (collectively, the “Services”).",
        "Please read these Terms carefully before using the Services. By registering an account, accessing or using the Services, or expressly accepting these Terms on a relevant page, you acknowledge that you have read, understood, and agreed to be bound by these Terms.",
        "If you use the Services on behalf of an enterprise, merchant, platform, or other organization, you represent and warrant that you have authority to accept these Terms on behalf of that organization. In that case, “you” and “your” include both you personally and the organization you represent.",
        "If you do not agree to these Terms, do not access or use the Services.",
      ],
    },
    {
      id: "overview",
      title: "1. Overview of the Services",
      paragraphs: [
        "FilixPay is a payment infrastructure platform for enterprises, merchants, platforms, and other business organizations.",
        "FilixPay Services may include payment processing, payment-channel connectivity, transaction processing, payment routing, money-movement capabilities, settlement support, merchant operations tools, APIs, webhooks, developer tooling, and other related technical services.",
        "The specific Services available to you depend on the products you use, account type, region, commercial arrangements, and applicable service agreements.",
        "FilixPay may add, modify, suspend, or discontinue certain Services or features for business, technical, legal, or security reasons.",
        "Unless a written agreement expressly provides otherwise, FilixPay does not guarantee that any particular Service, payment channel, or feature will be available in all regions, at all times, or for all accounts.",
      ],
    },
    {
      id: "definitions",
      title: "2. Definitions",
      paragraphs: ["In these Terms:"],
      definitions: [
        {
          term: "“FilixPay”",
          text: "means the FilixPay operating entity providing the Services and its applicable affiliates involved in the relevant Services.",
        },
        {
          term: "“Services”",
          text: "means FilixPay websites, Merchant Center, APIs, SDKs, Checkout, Sandbox, payment infrastructure, developer tools, and other related products and services.",
        },
        {
          term: "“Merchant”",
          text: "means an enterprise, organization, or other lawful business that uses the Services for commercial activity, collection, payment processing, or related operations.",
        },
        {
          term: "“Account”",
          text: "means an account created to access or use the Services, together with related organization, permission, and configuration settings.",
        },
        {
          term: "“Authorized User”",
          text: "means an individual authorized by you to access or use the Services on behalf of you or your organization.",
        },
        {
          term: "“Payment Channel”",
          text: "means a bank, payment service provider, card network, local payment network, digital-asset service, or other third-party payment or funds channel.",
        },
        {
          term: "“Transaction”",
          text: "means a payment, refund, money movement, or other related business activity initiated, processed, recorded, or tracked through the Services.",
        },
        {
          term: "“Content”",
          text: "means data, materials, text, images, and other information you submit, upload, transmit, or display through the Services.",
        },
      ],
    },
    {
      id: "account-eligibility",
      title: "3. Accounts and Eligibility",
      subsections: [
        {
          id: "eligibility",
          title: "3.1 Eligibility",
          paragraphs: [
            "You may use the Services only if you have the legal capacity to enter into a binding agreement and your use does not violate applicable law.",
            "If you use the Services on behalf of an enterprise or other organization, you must have authority to accept these Terms and use the relevant Services for that organization.",
          ],
        },
        {
          id: "registration",
          title: "3.2 Registration Information",
          paragraphs: [
            "You must provide true, accurate, complete, and up-to-date account and business information.",
            "If your information materially changes, you must update it promptly.",
            "FilixPay may require additional identity, business, ownership, control, or compliance information based on the nature of the Services and applicable law.",
          ],
        },
        {
          id: "account-security",
          title: "3.3 Account Security",
          paragraphs: ["You must properly protect:"],
          bullets: [
            "Login credentials;",
            "API keys;",
            "Access tokens;",
            "Webhook configurations;",
            "Administrator privileges;",
            "Other security credentials used to access the Services.",
          ],
          subsections: [
            {
              id: "account-security-close",
              title: "",
              paragraphs: [
                "You are responsible for activity conducted through your Account, Authorized Users, or your security credentials.",
                "If you become aware of unauthorized access, credential compromise, or another security incident, you must take immediate action and notify FilixPay through appropriate channels.",
              ],
            },
          ],
        },
        {
          id: "authorized-users",
          title: "3.4 Authorized Users",
          paragraphs: [
            "You may grant access to Authorized Users through the organization and permission features supported by the Services.",
            "You must ensure that Authorized Users:",
          ],
          bullets: [
            "Have appropriate authorization;",
            "Comply with these Terms;",
            "Comply with applicable law;",
            "Use the Services in accordance with your internal permission and security controls.",
          ],
          subsections: [
            {
              id: "authorized-users-close",
              title: "",
              paragraphs: [
                "Acts of Authorized Users may be treated as your acts.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "merchant-responsibilities",
      title: "4. Merchant and Organization Responsibilities",
      paragraphs: [
        "If you use the Services as a merchant, enterprise, or other organization, you are responsible for:",
      ],
      bullets: [
        "The legality of the goods and services you offer;",
        "Your commercial activities;",
        "Customer-facing goods, services, and related descriptions;",
        "Pricing, taxes, and other commercial disclosures;",
        "Customer service and order fulfillment;",
        "The accuracy of data you submit through the Services;",
        "Your Account, Authorized Users, and internal permission management;",
        "The security of API keys and other access credentials;",
        "Compliance with applicable laws, regulations, and Payment Channel rules.",
      ],
      subsections: [
        {
          id: "merchant-responsibilities-close",
          title: "",
          paragraphs: [
            "Unless a written agreement expressly provides otherwise, FilixPay is not responsible for goods, services, order fulfillment, or other commercial disputes between you and your customers.",
          ],
        },
      ],
    },
    {
      id: "payments-money-movement",
      title: "5. Payments and Money Movement",
      paragraphs: [
        "FilixPay may provide payment and money-movement technical capabilities based on the Services and Payment Channels you configure.",
        "Payment and funds Services may involve:",
      ],
      bullets: [
        "Payment initiation;",
        "Payment processing;",
        "Payment status queries;",
        "Payment routing;",
        "Refunds;",
        "Transaction notifications;",
        "Settlement-related processing;",
        "Reconciliation and transaction records;",
        "Other related funds workflows.",
      ],
      subsections: [
        {
          id: "payments-money-movement-close",
          title: "",
          paragraphs: [
            "Available payment methods, currencies, regions, processing times, and features depend on the relevant Payment Channels, financial institutions, partners, risk controls, and applicable law.",
            "Payment Transactions may be subject to rules of third-party payment providers, banks, card networks, payment networks, or other partners.",
            "Accordingly, unless a written agreement expressly provides otherwise, FilixPay does not guarantee that:",
          ],
          bullets: [
            "All payments will succeed;",
            "Any particular Payment Channel will always be available;",
            "A specific Transaction will complete within a fixed time;",
            "A specific currency or region will always be available;",
            "Third-party Payment Channels will not experience delay, interruption, or decline.",
          ],
          subsections: [
            {
              id: "payments-third-party-terms",
              title: "",
              paragraphs: [
                "If a Service is provided directly by a third-party payment or financial service provider, you may also need to accept that third party’s terms of service and privacy policy.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "fees",
      title: "6. Fees and Payment",
      paragraphs: [
        "You must pay applicable fees according to the pricing, order forms, commercial agreements, or other arrangements applicable to your Account or Services.",
        "Fees may vary based on:",
      ],
      bullets: [
        "Service type;",
        "Transaction type;",
        "Payment Channel;",
        "Region;",
        "Currency;",
        "Transaction volume;",
        "Commercial partnership arrangements.",
      ],
      subsections: [
        {
          id: "fees-close",
          title: "",
          paragraphs: [
            "Unless otherwise agreed, you are responsible for applicable taxes arising from your use of the Services and for tax obligations arising from your own business activities.",
            "If you fail to pay amounts due, FilixPay may restrict or suspend relevant Services to the extent permitted by applicable law and related agreements.",
          ],
        },
      ],
    },
    {
      id: "prohibited-use",
      title: "7. Prohibited Use",
      paragraphs: [
        "You may not use the Services for unlawful, fraudulent, misleading, abusive, or harmful activities, or activities that endanger others or system security.",
        "Prohibited conduct includes, without limitation:",
      ],
      orderedBullets: [
        "Violating applicable laws or regulations;",
        "Engaging in fraud, money laundering, or other financial crime;",
        "Violating applicable sanctions or export-control requirements;",
        "Infringing intellectual property or other legal rights of others;",
        "Submitting false, misleading, or unauthorized information;",
        "Bypassing authentication, risk controls, permissions, or security controls;",
        "Accessing other accounts, systems, or data without authorization;",
        "Interfering with normal operation of the Services;",
        "Distributing malware, viruses, or other harmful code;",
        "Conducting unauthorized scanning, testing, or attacks against the Services;",
        "Using the Services for businesses expressly prohibited by FilixPay or relevant Payment Channels;",
        "Assisting any third party in any of the above.",
      ],
      subsections: [
        {
          id: "prohibited-use-close",
          title: "",
          paragraphs: [
            "FilixPay may investigate suspected violations and take appropriate measures based on risk, legal requirements, partner rules, or security needs.",
          ],
        },
      ],
    },
    {
      id: "compliance",
      title: "8. Compliance, Identity Verification, and Risk Control",
      paragraphs: [
        "To provide the Services and meet applicable legal and partner requirements, FilixPay may implement or assist with:",
      ],
      bullets: [
        "Identity verification;",
        "Enterprise and business verification;",
        "Ownership and control verification;",
        "Customer due diligence;",
        "Anti-money-laundering controls;",
        "Sanctions screening;",
        "Fraud and risk detection;",
        "Transaction monitoring;",
        "Other applicable compliance measures.",
      ],
      subsections: [
        {
          id: "compliance-close",
          title: "",
          paragraphs: [
            "You agree to provide information and documents reasonably requested in connection with these processes.",
            "If you fail to provide necessary information, or if information cannot be verified, FilixPay may refuse, restrict, suspend, or terminate relevant Services to the extent permitted by applicable law.",
            "Specific Services and compliance capabilities may differ by region, product, and partnership arrangement.",
            "Unless FilixPay expressly states otherwise in writing, these Terms do not constitute a representation that FilixPay holds any particular financial license, regulatory approval, or compliance certification in any jurisdiction.",
          ],
        },
      ],
    },
    {
      id: "third-party-services",
      title: "9. Third-Party Services",
      paragraphs: [
        "The Services may rely on or integrate third-party services, including:",
      ],
      bullets: [
        "Payment services;",
        "Banking and financial infrastructure;",
        "Payment networks;",
        "Cloud infrastructure;",
        "Identity verification services;",
        "Communications services;",
        "Data storage;",
        "Security and monitoring services;",
        "Other technical or business services.",
      ],
      subsections: [
        {
          id: "third-party-services-close",
          title: "",
          paragraphs: [
            "Third-party services may be subject to their own terms, privacy policies, and other rules.",
            "For services independently provided and controlled by third parties, FilixPay is not responsible for their continued availability, accuracy, or performance beyond the scope required by applicable agreements and law.",
          ],
        },
      ],
    },
    {
      id: "data-privacy",
      title: "10. Data and Privacy",
      paragraphs: [
        "FilixPay’s collection and use of personal information is governed by the Privacy Policy.",
        "When using the Services, you must comply with data-protection and privacy laws applicable to your business.",
        "If you provide FilixPay with, or process through FilixPay, information relating to other individuals, you must ensure that:",
      ],
      bullets: [
        "You have a lawful basis to process the information;",
        "You have provided required privacy notices to the relevant individuals under applicable law;",
        "You are authorized to provide the information to FilixPay as needed for the relevant Services;",
        "You comply with applicable data-protection laws.",
      ],
      subsections: [
        {
          id: "data-privacy-close",
          title: "",
          paragraphs: [
            "Where the Services involve FilixPay processing personal information on your behalf, the parties may enter into a separate data processing agreement or other data-protection documentation.",
          ],
        },
      ],
    },
    {
      id: "your-content",
      title: "11. Your Content and Data",
      paragraphs: [
        "You retain your rights in Content and data that you lawfully own and submit to the Services.",
        "You grant FilixPay a non-exclusive, worldwide license to, solely as necessary to provide, maintain, protect, and improve the Services:",
      ],
      bullets: [
        "Store;",
        "Reproduce;",
        "Process;",
        "Transmit;",
        "Display;",
      ],
      subsections: [
        {
          id: "your-content-close",
          title: "",
          paragraphs: [
            "such Content and data.",
            "FilixPay will not use your Content for purposes beyond those permitted by the applicable Privacy Policy, related agreements, or law.",
            "You must ensure that Content and data submitted to the Services do not:",
          ],
          bullets: [
            "Violate law;",
            "Infringe third-party rights;",
            "Contain unauthorized disclosures of personal information;",
            "Contain malicious code;",
            "Breach your obligations to third parties.",
          ],
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "12. Intellectual Property",
      paragraphs: [
        "Intellectual property rights in the Services and related software, APIs, documentation, designs, interfaces, trademarks, logos, and other materials belong to FilixPay or its licensors.",
        "Except as expressly permitted by these Terms or another written agreement, you may not:",
      ],
      bullets: [
        "Copy the Services;",
        "Sell, lease, or sublicense the Services;",
        "Distribute the Services without authorization;",
        "Reverse engineer or attempt to extract source code;",
        "Remove copyright, trademark, or other rights notices;",
        "Use FilixPay brands or logos in a manner that creates confusion as to source.",
      ],
      subsections: [
        {
          id: "intellectual-property-close",
          title: "",
          paragraphs: [
            "If certain FilixPay software or components are released under separate open-source licenses, those components are governed by the applicable open-source licenses.",
            "These Terms do not limit rights you have under applicable open-source licenses.",
          ],
        },
      ],
    },
    {
      id: "confidentiality",
      title: "13. Confidentiality",
      paragraphs: [
        "If either party receives information that is expressly marked confidential or that should reasonably be understood as confidential given its nature, the receiving party must take reasonable measures to protect it and use it only as needed to perform related Services or as permitted by law.",
        "Confidentiality obligations do not apply to information the receiving party can demonstrate:",
      ],
      bullets: [
        "Is or becomes public other than through breach of these Terms;",
        "Was lawfully in its possession before disclosure;",
        "Was lawfully obtained from a third party authorized to disclose it;",
        "Was independently developed without use of the confidential information.",
      ],
      subsections: [
        {
          id: "confidentiality-close",
          title: "",
          paragraphs: [
            "If law, a court, or a regulator requires disclosure of confidential information, the receiving party may disclose it to the extent permitted by law.",
          ],
        },
      ],
    },
    {
      id: "availability",
      title: "14. Service Availability and Changes",
      paragraphs: [
        "FilixPay will maintain the availability and security of the Services within a reasonable scope, but does not guarantee that the Services will always be:",
      ],
      bullets: [
        "Uninterrupted;",
        "Error-free;",
        "Fully secure;",
        "Unaffected by third-party failures.",
      ],
      subsections: [
        {
          id: "availability-close",
          title: "",
          paragraphs: [
            "The Services may be affected by maintenance, upgrades, network failures, Payment Channel outages, third-party service failures, force majeure, or other events beyond FilixPay’s reasonable control.",
            "FilixPay may modify, upgrade, or discontinue certain features for technical, business, security, or legal reasons.",
            "For material and continuing Service changes, FilixPay will provide reasonable notice to the extent required by applicable law and related agreements.",
          ],
        },
      ],
    },
    {
      id: "suspension-termination",
      title: "15. Suspension and Termination",
      paragraphs: [
        "FilixPay may suspend or restrict all or part of your Services if:",
      ],
      bullets: [
        "You breach these Terms;",
        "There is fraud, abuse, or security risk;",
        "Legal or regulatory requirements apply;",
        "You fail to pay amounts due;",
        "A Payment Channel or partner requires restriction of the Services;",
        "Account information cannot be verified;",
        "Continuing to provide the Services may create material risk for FilixPay, other users, or third parties.",
      ],
      subsections: [
        {
          id: "suspension-termination-close",
          title: "",
          paragraphs: [
            "Where legally permitted and practically feasible, FilixPay will provide notice based on the circumstances.",
            "You may stop using the Services through applicable account features or commercial agreements.",
            "After termination:",
          ],
          bullets: [
            "Your access to the Services may be closed;",
            "Incomplete Transactions and related funds workflows may continue to be processed under applicable rules;",
            "Payment, liability, and other obligations arising before termination are not automatically extinguished;",
            "Provisions that by their nature should survive termination remain in effect.",
          ],
        },
      ],
    },
    {
      id: "disclaimers",
      title: "16. Disclaimers",
      paragraphs: [
        "To the maximum extent permitted by applicable law, except as expressly set out in these Terms or a separate written agreement between the parties, the Services are provided on an “as is” and “as available” basis.",
        "FilixPay makes no warranties beyond those expressly agreed regarding:",
      ],
      bullets: [
        "Fitness of the Services for your particular business needs;",
        "Continuous, uninterrupted, or error-free operation;",
        "Successful completion of all payment Transactions;",
        "Continuous availability of third-party Payment Channels;",
        "Completion of specific Transactions within a stated time;",
        "Absence of security incidents;",
        "Accuracy, completeness, or timeliness of information or services provided by third parties.",
      ],
      subsections: [
        {
          id: "disclaimers-close",
          title: "",
          paragraphs: [
            "Nothing in this section excludes any warranty or liability that applicable law does not permit to be excluded or limited.",
          ],
        },
      ],
    },
    {
      id: "limitation-of-liability",
      title: "17. Limitation of Liability",
      paragraphs: [
        "To the maximum extent permitted by applicable law, FilixPay is not liable for indirect, incidental, special, punitive, or consequential damages arising from your use of or inability to use the Services, including without limitation loss of profits, revenue, goodwill, data, or business interruption.",
        "For losses caused directly by third-party Payment Channels, banks, payment networks, infrastructure providers, or other third parties, FilixPay’s liability is subject to applicable law and related agreements.",
        "If an applicable commercial agreement sets liability scope, caps, or specific loss allocations, that agreement controls.",
        "Nothing in this section limits liability that applicable law expressly prohibits limiting or excluding.",
      ],
    },
    {
      id: "indemnification",
      title: "18. Indemnification",
      paragraphs: [
        "To the extent permitted by applicable law, if a third party brings a claim, investigation, or proceeding against FilixPay arising from your:",
      ],
      bullets: [
        "Breach of these Terms;",
        "Violation of applicable law;",
        "Infringement of third-party rights;",
        "Breach of obligations to your customers;",
        "Improper use of the Services;",
        "Acts of your Authorized Users;",
      ],
      subsections: [
        {
          id: "indemnification-close",
          title: "",
          paragraphs: [
            "you will bear corresponding responsibility within the scope required by applicable law and related agreements, and reasonably cooperate with FilixPay in defense and handling.",
            "If the parties have a separate written agreement on indemnification scope, process, or limits, that agreement controls.",
          ],
        },
      ],
    },
    {
      id: "changes",
      title: "19. Changes to These Terms",
      paragraphs: [
        "FilixPay may update these Terms for business, technical, legal, or regulatory reasons.",
        "Updated versions will be posted on this page, and the “Last Updated” date at the top of the page will be revised.",
        "If applicable law requires additional notice for material changes, FilixPay will provide such notice as required.",
        "To the extent permitted by applicable law, your continued use of the Services after a change takes effect constitutes acceptance of the updated Terms.",
        "If you do not agree to the updated Terms, you must stop using the affected Services.",
      ],
    },
    {
      id: "governing-law",
      title: "20. Governing Law and Dispute Resolution",
      paragraphs: [
        "Governing law, venue, and dispute-resolution procedures for these Terms are determined by the commercial agreement, order form, or other contract documents applicable between you and FilixPay.",
        "If the parties have no separate written agreement specifying governing law and dispute resolution, those matters will be determined under applicable law.",
        "FilixPay will supplement these Terms with corresponding legal provisions after confirming the applicable legal entity, jurisdiction, and formal dispute-resolution mechanism.",
      ],
    },
    {
      id: "notices",
      title: "21. Notices",
      paragraphs: [
        "FilixPay may send Service-related notices to you by:",
      ],
      bullets: [
        "In-account notices;",
        "Email;",
        "In-product messages;",
        "Website announcements;",
        "Other reasonable electronic means.",
      ],
      subsections: [
        {
          id: "notices-close",
          title: "",
          paragraphs: [
            "You must keep contact details in your Account accurate, valid, and able to receive notices.",
            "Formal legal notices to FilixPay must be sent through the formal notice channels specified in the applicable commercial agreement or published by FilixPay.",
          ],
        },
      ],
    },
    {
      id: "general",
      title: "22. General Terms",
      subsections: [
        {
          id: "entire-agreement",
          title: "22.1 Entire Agreement",
          paragraphs: [
            "These Terms, together with order forms, commercial agreements, service agreements, data processing agreements, and other written documents applicable to specific Services, constitute the agreement between the parties regarding the relevant Services.",
            "If documents conflict, the order of precedence set out in those documents controls.",
          ],
        },
        {
          id: "severability",
          title: "22.2 Severability",
          paragraphs: [
            "If any provision of these Terms is held invalid or unenforceable, the remaining provisions remain in effect.",
          ],
        },
        {
          id: "no-waiver",
          title: "22.3 No Waiver",
          paragraphs: [
            "Failure or delay by either party in exercising any right under these Terms does not constitute a waiver of that right.",
          ],
        },
        {
          id: "assignment",
          title: "22.4 Assignment",
          paragraphs: [
            "Without the other party’s consent, you may not assign these Terms or your primary rights and obligations under them, except for corporate reorganizations, mergers, or asset transfers permitted by applicable law.",
            "FilixPay may assign these Terms to an affiliate or to a successor that assumes the relevant business through reorganization, merger, acquisition, or asset transfer.",
          ],
        },
        {
          id: "no-agency",
          title: "22.5 No Agency",
          paragraphs: [
            "Unless the parties expressly agree otherwise in writing, these Terms do not create a partnership, agency, employment, franchise, or joint-venture relationship between the parties.",
          ],
        },
        {
          id: "force-majeure",
          title: "22.6 Force Majeure",
          paragraphs: [
            "To the extent permitted by applicable law, FilixPay is not liable for delay or failure to perform caused by events beyond its reasonable control, including natural disasters, war, government actions, network failures, major infrastructure failures, public-health events, or similar events.",
          ],
        },
      ],
    },
    {
      id: "contact",
      title: "23. Contact Us",
      paragraphs: [
        "If you have questions about these Terms, the Services, or related contractual arrangements, contact us through the public contact channels published on the FilixPay website.",
        "For formal legal notices, use the formal notice channels applicable to your Account or commercial agreement.",
        "FilixPay’s formal legal entity name, legal address, and dedicated legal-notice contact details will be determined according to the applicable Services and contractual arrangements.",
      ],
    },
  ],
};

export const TERMS_BY_LOCALE: Record<LegalContentLocale, LegalDocument> = {
  en: TERMS_EN,
  zh: TERMS_ZH,
};
