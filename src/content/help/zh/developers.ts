import type { HelpArticleContent } from "../article-content";

export const zhDevelopers: Record<string, HelpArticleContent> = {
  "developers/developer-center": {
    title: "在商户中心使用开发者中心",
    description:
      "了解 FilixPay 开发者中心各页签（应用、沙箱、Explorer、生产权限、Webhook、投递记录）的用途、入口与使用时机。",
    keywords: [
      "FilixPay 开发者中心",
      "商户中心开发者",
      "应用",
      "沙箱",
      "API Explorer",
      "生产权限",
      "Webhook",
    ],
    body: {
      whoFor:
        "需要在 FilixPay 商户中心定位开发者功能的技术商户与集成人员；本指南不替代 API 文档。",
      whenToUse:
        "首次打开开发者中心，或需要确认应进入哪个页签后再配置 Webhook / 支付渠道时使用。",
      beforeYouStart: [
        "使用具备开发者中心权限的账号登录商户中心。",
        "确认当前组织 / 业务账户正确。",
        "API 调用细节请前往开发者介绍或 API 文档；本指南只讲界面导航。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "开发者中心是商户中心内的集成界面入口：应用、沙箱测试、API 探索、生产权限入口、Webhook 与投递记录。本指南是地图（是什么 / 在哪里 / 何时用）。Webhook 端点的逐步操作见《管理 Webhook》；日常支付渠道配置见《管理支付渠道配置》。",
        },
        {
          type: "heading",
          text: "打开开发者中心",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "从导航中的开发者入口打开开发者中心。",
            "使用顶部页签在不同区域之间切换。",
          ],
        },
        {
          type: "heading",
          text: "页签地图",
          anchor: "tab-map",
        },
        {
          type: "fields",
          rows: [
            {
              field: "应用 — 是什么",
              description: "管理用于集成凭证的应用。",
            },
            {
              field: "应用 — 在哪里",
              description: "开发者中心 → 应用",
            },
            {
              field: "应用 — 何时用",
              description: "创建或管理应用，以便进行沙箱或生产相关操作。",
            },
            {
              field: "沙箱 — 是什么",
              description: "用于联调试验的测试环境。",
            },
            {
              field: "沙箱 — 在哪里",
              description: "开发者中心 → 沙箱",
            },
            {
              field: "沙箱 — 何时用",
              description: "使用沙箱凭证做集成测试时。",
            },
            {
              field: "Explorer — 是什么",
              description: "在界面中探索并尝试 API 调用。",
            },
            {
              field: "Explorer — 在哪里",
              description: "开发者中心 → Explorer",
            },
            {
              field: "Explorer — 何时用",
              description: "调试或探索 API、且希望留在商户中心时。",
            },
            {
              field: "生产权限 — 是什么",
              description:
                "开发者中心中生产权限的入口与状态展示（不是政策说明文档）。",
            },
            {
              field: "生产权限 — 在哪里",
              description: "开发者中心 → 生产权限",
            },
            {
              field: "生产权限 — 何时用",
              description:
                "准备上线时，打开入口、查看界面展示的状态，并按界面提示的下一步操作。",
            },
            {
              field: "Webhooks — 是什么",
              description:
                "Webhook 管理概览。创建、查看、启用/停用和删除的完整步骤见 Webhook 指南。",
            },
            {
              field: "Webhooks — 在哪里",
              description: "开发者中心 → Webhooks",
            },
            {
              field: "Webhooks — 何时用",
              description: "需要配置事件通知到你的接收地址时。",
            },
            {
              field: "投递记录 — 是什么",
              description: "Webhook 投递历史概览。排障步骤见 Webhook 指南。",
            },
            {
              field: "投递记录 — 在哪里",
              description: "开发者中心 → 投递记录",
            },
            {
              field: "投递记录 — 何时用",
              description: "需要确认事件是否投递成功时。",
            },
          ],
        },
        {
          type: "heading",
          text: "生产权限边界",
          anchor: "production-access",
        },
        {
          type: "paragraph",
          text: "在「生产权限」中，请使用界面找到入口、阅读展示的状态，并跟随商户中心给出的下一步。Help 不描述审核条件、审核时效或资格规则——这些可能变化，并以产品内展示为准。",
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
              problem: "看不到开发者中心或部分页签。",
              solution:
                "确认已登录正确组织，且角色具备开发者权限。切换账户后刷新页面。",
            },
            {
              problem: "我需要 API 字段或 SDK 示例。",
              solution:
                "本指南只覆盖界面导航。产品介绍请看「FilixPay 开发者介绍」；API 文档就绪后再查阅，不要期望 Help 替代开发者文档。",
            },
          ],
        },
      ],
      nextStep: {
        label: "在商户中心管理 Webhook",
        href: "/help/developers/webhooks",
      },
    },
  },

  "developers/webhooks": {
    title: "在商户中心管理并验证 Webhook",
    description:
      "在 FilixPay 商户中心创建、查看、启用/停用和删除 Webhook Endpoint，查看投递记录，并使用验签说明页。",
    keywords: [
      "FilixPay Webhook 商户中心",
      "Webhook Endpoint",
      "Webhook 投递",
      "Webhook 验签",
      "启用停用 Webhook",
    ],
    body: {
      whoFor: "需要在 FilixPay 商户中心配置 Webhook Endpoint 并查看投递记录的运营与开发人员。",
      whenToUse:
        "新增或变更 Endpoint、检查投递、重新投递，或打开 Webhook 验签说明页时使用。",
      beforeYouStart: [
        "打开开发者中心，确认可访问 Webhooks 与投递记录页签。",
        "准备好 HTTPS 接收地址（示例仅使用 https://api.example.com/webhook）。",
        "将 Webhook secret 保存在自有安全位置——不要把真实 secret 写进工单或公开仓库。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "本指南覆盖商户中心内 Endpoint、投递记录与验签说明页的界面操作。不写事件 schema、签名算法或签名实现细节，也不提供除虚构占位 URL（例如 https://api.example.com/webhook）以外的示例代码。",
        },
        {
          type: "heading",
          text: "创建、查看、启用/停用和删除 Endpoint",
          anchor: "endpoints",
        },
        {
          type: "steps",
          items: [
            "打开 开发者中心 → Webhooks。",
            "选择创建 / 添加 Endpoint，填写 HTTPS URL（演示可用 https://api.example.com/webhook）。",
            "保存并确认列表中出现该 Endpoint 及其状态。",
            "打开 Endpoint 查看详情。",
            "需要暂停或恢复通知时，在界面中启用或停用，而不必删除。",
            "不再需要该 URL 时再删除，并确认提示。",
          ],
        },
        {
          type: "heading",
          text: "投递记录与重新投递",
          anchor: "deliveries",
        },
        {
          type: "steps",
          items: [
            "打开 开发者中心 → 投递记录。",
            "查看近期投递尝试与状态。",
            "排障时打开单条投递详情。",
            "修复接收端后，若界面提供重新投递，再执行重新投递。",
          ],
        },
        {
          type: "heading",
          text: "Webhook 验签说明页",
          anchor: "verification",
        },
        {
          type: "steps",
          items: [
            "从开发者中心打开 Webhook 验签说明（或使用本指南的「在商户中心打开」）。",
            "按页面清单在自有服务中实现验签。",
            "按该页指引完成集成。Help 不写签名实现细节。",
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
              problem: "Endpoint 显示未启用或已停用。",
              solution:
                "在 Webhooks 中打开该 Endpoint 并启用。确认 URL 为 HTTPS 且公网可访问。",
            },
            {
              problem: "我这边验签失败。",
              solution:
                "对照 Webhook 验签说明页检查实现。如果仍然验签失败，请根据开发者文档进一步检查你的集成实现。Help 不写签名实现细节。",
            },
            {
              problem: "投递多次失败。",
              solution:
                "在投递记录中查看状态，修复接收端后重新投递，并确认 Endpoint 已启用。",
            },
          ],
        },
      ],
      nextStep: {
        label: "返回开发者中心地图",
        href: "/help/developers/developer-center",
      },
    },
  },

  "developers/payment-channels": {
    title: "在商户中心管理支付渠道配置",
    description:
      "打开 FilixPay 商户中心支付配置，添加、编辑与查看支付渠道，用于日常运维。",
    keywords: [
      "FilixPay 支付渠道配置",
      "支付配置",
      "收单设置",
      "管理支付渠道",
      "商户中心 configs",
    ],
    body: {
      whoFor:
        "已经完成（或正在维护）支付渠道、需要日常管理界面说明的商户——不只是首次开通。",
      whenToUse:
        "回到支付配置以添加、编辑、开启/关闭或查看渠道配置时使用。",
      beforeYouStart: [
        "确认可访问 交易 → 收单设置 → 支付配置。",
        "准备好渠道方凭证（示例可用 sk_test_placeholder —— 切勿提交真实密钥）。",
        "若从未添加过渠道，先阅读快速开始中的「配置第一个支付渠道」，再回到本文做日常管理。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "支付配置是商户中心管理渠道的界面。本文覆盖日常管理；首次开通步骤保留在快速开始，请勿把本文当成重复的入驻清单。",
        },
        {
          type: "heading",
          text: "打开支付配置",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "进入 交易 → 收单设置 → 支付配置（或使用「在商户中心打开」）。",
            "先查看场景卡片与已有渠道行，再做变更。",
          ],
        },
        {
          type: "heading",
          text: "添加、编辑与查看渠道配置",
          anchor: "manage",
        },
        {
          type: "steps",
          items: [
            "选择添加配置（或在场景卡片上添加渠道）。",
            "按表单要求选择支付品牌、渠道、场景与子商户。",
            "填入从渠道方获取的凭证并保存。向渠道方控制台索取凭证即可；Help 不逐步讲解第三方后台。",
            "打开已有行以查看或编辑。",
            "需要控制是否参与路由时，使用开启/关闭，而不必删除配置。",
          ],
        },
        {
          type: "heading",
          text: "关键字段（界面级）",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "支付品牌 / 渠道",
              description: "该配置对应的收单通道。",
            },
            {
              field: "场景 / 子商户",
              description: "配置在商户中心的作用范围。",
            },
            {
              field: "凭证",
              description:
                "表单中的密钥类字段。非生产环境使用测试占位；切勿公开真实密钥。",
            },
            {
              field: "开启 / 关闭",
              description: "渠道是否可用于路由。",
            },
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
              problem: "保存失败或校验无法提交。",
              solution: "按表单提示补全必填项，确认场景与子商户选择后重试。",
            },
            {
              problem: "缺少凭证或无法开启渠道。",
              solution:
                "从支付服务商获取凭证，仔细粘贴后保存，再将渠道设为开启。",
            },
            {
              problem: "仍需要首次开通指引。",
              solution:
                "打开相关指南中的快速开始支付渠道文章完成首次配置，再回到本文做日常变更。",
            },
          ],
        },
      ],
      nextStep: {
        label: "首次配置支付渠道",
        href: "/help/getting-started/payment-channel",
      },
    },
  },
};
