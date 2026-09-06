import type { HelpArticleContent } from "../article-content";

export const zhMerchant: Record<string, HelpArticleContent> = {
  "merchant/organization": {
    title: "管理组织、成员与角色",
    description:
      "在 FilixPay 商户中心「账户与设置 → 组织」管理业务账户、邀请成员、团队与自定义角色。",
    keywords: ["组织管理", "业务账户", "邀请成员", "团队角色", "商户组织"],
    body: {
      whoFor: "需要管理组织下业务账户、成员、团队与角色的所有者与管理员。",
      whenToUse:
        "打开「账户与设置 → 组织」创建业务账户、邀请成员，或编辑团队与角色时使用本说明。",
      beforeYouStart: [
        "使用具备组织管理权限的账号登录。",
        "准备被邀请人邮箱（例如 ops@example.com）。",
        "确认新业务账户结算模式为 PLATFORM 还是 DIRECT。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "组织管理含四个页签：业务账户、成员、团队、角色。此处的业务账户是组织作用域商户，不等于「收单设置 → 子商户」。本说明只覆盖组织页。",
        },
        {
          type: "heading",
          text: "打开组织",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "打开「账户与设置 → 所属组织 / 组织管理」。",
            "确认页面标题并可见四个页签。",
          ],
        },
        {
          type: "heading",
          text: "业务账户",
          anchor: "business-accounts",
        },
        {
          type: "steps",
          items: [
            "打开「业务账户」页签。",
            "查看名称、编码、结算模式与状态。",
            "需要时创建业务账户并选择结算模式（PLATFORM 或 DIRECT）。",
            "在行上切换账户或打开商户资料（若显示）。",
          ],
        },
        {
          type: "heading",
          text: "成员、团队与角色",
          anchor: "members-teams-roles",
        },
        {
          type: "steps",
          items: [
            "在「成员」中按邮箱邀请并指定组织角色（可选团队与团队角色），再搜索、编辑或移除成员（所有者受保护）。",
            "在「团队」中创建/编辑/归档团队，并管理团队成员（OWNER / MANAGER / LEAD / MEMBER）。",
            "在「角色」中创建或编辑自定义角色、配置权限矩阵与商户范围，并在允许时删除未使用角色。",
          ],
        },
        {
          type: "heading",
          text: "常见问题",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "业务账户和子商户是一回事吗？",
              solution:
                "不是。业务账户在组织下；子商户在「交易 → 收单设置」，参见 /help/merchant/locations。",
            },
            {
              problem: "无法移除所有者。",
              solution:
                "所有者成员在本页受保护。如需转移所有权，请按内部流程处理，Help 不写页面上不存在的操作。",
            },
            {
              problem: "法定名称或联系邮箱在哪里改？",
              solution:
                "请使用商户资料 / 联系方式 / 资料变更，参见 /help/account/maintenance。",
            },
          ],
        },
      ],
      nextStep: {
        label: "经营场所与子商户",
        href: "/help/merchant/locations",
      },
    },
  },
  "merchant/locations": {
    title: "配置子商户与经营场所",
    description:
      "在 FilixPay 商户中心「交易 → 收单设置」下创建子商户收款单位与经营场所。",
    keywords: ["经营场所", "子商户", "收单设置", "场所二维码", "结算别名"],
    body: {
      whoFor: "需要配置收单收款单位及其经营场所的运营人员。",
      whenToUse:
        "打开收单设置下的子商户或经营场所，添加实体、绑定门店，或查看场所二维码/防伪码时使用本说明。",
      beforeYouStart: [
        "使用可访问「交易 → 收单设置」的账号登录。",
        "先创建子商户再创建场所——场所创建需要选择 subMerchantId。",
        "准备联系方式（测试请用虚构样例，如 store@example.com 或 13800138000）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "收单配置使用两个页面：子商户定义收款单位；经营场所把门店挂到子商户，并可查看二维码/防伪码。这与组织下的业务账户不是同一概念。",
        },
        {
          type: "heading",
          text: "是什么 / 在哪里 / 何时用",
          anchor: "map",
        },
        {
          type: "fields",
          rows: [
            {
              field: "子商户",
              description:
                "打开「交易 → 收单设置 → 子商户」添加或编辑收款单位（名称、结算别名、状态）。",
            },
            {
              field: "经营场所",
              description:
                "打开「交易 → 收单设置 → 经营场所」添加关联子商户的门店、设置默认并打开二维码。",
            },
          ],
        },
        {
          type: "heading",
          text: "管理子商户",
          anchor: "sub-merchants",
        },
        {
          type: "steps",
          items: [
            "打开子商户管理。",
            "选择添加，填写名称与结算别名。",
            "需要时在表格中编辑或删除。",
            "在列表确认状态与创建时间。",
          ],
        },
        {
          type: "heading",
          text: "管理经营场所",
          anchor: "locations",
        },
        {
          type: "steps",
          items: [
            "打开经营场所。",
            "选择添加场所：先选子商户，再填写名称、地址、国家/地区与联系电话/邮箱。",
            "编辑行可改状态（启用/停用）或设为默认。",
            "需要时使用二维码/防伪操作查看场所码。",
          ],
        },
        {
          type: "heading",
          text: "常见问题",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "无法创建经营场所。",
              solution: "请先至少创建一个子商户，再打开添加场所并选择它。",
            },
            {
              problem: "和组织里的业务账户搞混了。",
              solution:
                "业务账户在「账户与设置 → 组织」，参见 /help/merchant/organization。",
            },
            {
              problem: "支付渠道在哪里配？",
              solution:
                "请到支付配置 / 开发者渠道设置，参见 /help/developers/payment-channels。",
            },
          ],
        },
      ],
      nextStep: {
        label: "管理订单",
        href: "/help/payments/orders",
      },
    },
  },
};
