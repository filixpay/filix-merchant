import type { HelpArticleContent } from "../article-content";

export const zhCredit: Record<string, HelpArticleContent> = {
  "credit/limit": {
    title: "在信用额度管理中维护授信额度",
    description:
      "在 FilixPay 商户中心「信用中心 → 授信管理 → 信用额度管理」创建信用额度、调整额度，并打开调整记录或交易流水抽屉。",
    keywords: [
      "信用额度管理",
      "创建信用额度",
      "调整额度",
      "调整记录",
      "交易流水",
    ],
    body: {
      whoFor: "需要在商户中心向用信方授予并维护授信额度的运营人员。",
      whenToUse:
        "打开「信用中心 → 授信管理 → 信用额度管理」创建额度、调整额度，或查看调整与用信历史时使用本说明。",
      beforeYouStart: [
        "使用可访问「信用中心 → 授信管理 → 信用额度管理」的账号登录。",
        "准备好用信方客户号（例如 10001）。",
        "确定初始授信额度与付款条款（例如 30 天账期）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "信用额度管理列出你授予的信用额度。你可以创建信用额度、用正负金额调整上限，并从每行打开调整记录或交易流水抽屉。本说明只覆盖该页面；不写会员侧「我的可用额度」、征信审批，也不写独立的历史菜单页。",
        },
        {
          type: "heading",
          text: "打开信用额度管理",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "打开「信用中心 → 授信管理 → 信用额度管理」。",
            "确认页面标题为「信用额度管理」，并可见「创建信用额度」。",
          ],
        },
        {
          type: "heading",
          text: "阅读授信列表",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            {
              field: "额度来源",
              description: "平台授信或银行授信。",
            },
            {
              field: "授信方 / 用信方",
              description: "各方显示名称，必要时带次要编码。",
            },
            {
              field: "总额度 / 已用额度 / 可用额度",
              description: "总额度、已用金额与剩余可用（界面按 USD 格式展示）。",
            },
            {
              field: "付款条款",
              description:
                "固定天数账期时显示「{days} 天账期」；其他条款类型在本列表显示为「即时支付」。",
            },
            {
              field: "状态",
              description: "已激活或未激活。",
            },
          ],
        },
        {
          type: "heading",
          text: "创建信用额度",
          anchor: "create-credit-line",
        },
        {
          type: "steps",
          items: [
            "选择「创建信用额度」。",
            "填写用信方客户号（例如 10001）。",
            "填写授信额度（例如 100000）。",
            "选择付款条款（即时付款、固定天数账期、月末结清、货到付款或按阶段付款）。",
            "若付款条款为固定天数账期，再填写账期天数（例如 30）。",
            "提交并确认列表出现新行。",
          ],
        },
        {
          type: "heading",
          text: "调整额度",
          anchor: "adjust-limit",
        },
        {
          type: "steps",
          items: [
            "在某行选择「调整额度」。",
            "在弹窗中确认用信方与当前额度。",
            "填写调整金额：正数增加、负数减少（例如 5000 或 -5000）。",
            "提交调整，并确认列表中的总额度/可用额度已更新。",
          ],
        },
        {
          type: "heading",
          text: "打开调整记录与交易流水",
          anchor: "history",
        },
        {
          type: "steps",
          items: [
            "在某行选择「调整记录」。抽屉标题可能为「额度调整记录」；查看用信方、操作人、旧/新额度、调整金额与时间。",
            "在某行选择「交易流水」。抽屉标题可能为「信用交易历史」；查看客户、业务单号、类型（额度使用、信用还款、额度调整、退款返还）、金额及用信前/后余额。",
            "查看完毕后关闭抽屉。这些历史是本页抽屉，不是独立 Dashboard 路由。",
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
              problem: "创建后无法修改付款条款。",
              solution:
                "本页列表与调整流程只改额度金额。付款条款在创建时设定。Help 不写页面上不存在的「编辑付款条款」操作。",
            },
            {
              problem: "「我的可用额度」在哪里？",
              solution:
                "那是用信方视图，路径为「信用中心 → 用信管理 → 我的额度」。参见 /help/credit/available-credit。",
            },
            {
              problem: "左侧菜单没有调整记录。",
              solution:
                "请从信用额度管理行内操作打开「调整记录」或「交易流水」。线上菜单没有独立历史页。若列表看起来过期，可用页头「刷新」。",
            },
          ],
        },
      ],
      nextStep: {
        label: "我的可用额度",
        href: "/help/credit/available-credit",
      },
    },
  },
  "credit/available-credit": {
    title: "查看我的可用额度",
    description:
      "在「信用中心 → 用信管理 → 我的额度」查看已分配给你的授信额度、已用与可用金额，并打开历史抽屉。",
    keywords: [
      "我的可用额度",
      "我的额度",
      "会员授信",
      "用信管理",
      "可用额度余额",
    ],
    body: {
      whoFor: "需要查看已授予自己的授信额度与历史记录的用信方（会员）。",
      whenToUse:
        "打开「信用中心 → 用信管理 → 我的额度」核对总额度、已用金额与可用金额时使用本说明。",
      beforeYouStart: [
        "使用可访问「信用中心 → 用信管理 → 我的额度」的账号登录。",
        "本页为只读列表：不能在此创建或调整额度。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "「我的可用额度」展示分配给你账户的授信额度。你可以从每行打开调整记录与交易流水抽屉。本说明只覆盖会员视图；创建或调整额度由授信方在「信用额度管理」完成，参见 /help/credit/limit。",
        },
        {
          type: "heading",
          text: "打开我的可用额度",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "打开「信用中心 → 用信管理 → 我的额度」。",
            "确认页面标题为「我的可用额度」。",
          ],
        },
        {
          type: "heading",
          text: "阅读我的授信列表",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            {
              field: "授信人",
              description: "授予额度的一方，必要时带次要编码。",
            },
            {
              field: "总额度",
              description: "该行当前授信上限（界面金额按 USD 展示）。",
            },
            {
              field: "已用额度 / 可用额度",
              description: "已使用多少以及还剩多少可用（USD 展示）。",
            },
            {
              field: "付款条款",
              description: "适用时显示「{days} 天账期」；否则显示「即时支付」。",
            },
            {
              field: "状态",
              description: "已激活或未激活。",
            },
          ],
        },
        {
          type: "heading",
          text: "打开历史抽屉",
          anchor: "history",
        },
        {
          type: "steps",
          items: [
            "在某行选择「调整记录」。抽屉标题可能为「额度变动记录」；查看原额度、新额度、金额、操作人与时间。",
            "在某行选择「交易流水」。抽屉标题可能为「信用支付记录」；查看额度使用、信用还款、额度调整、退款返还及用信前/后金额。",
            "查看完毕后关闭抽屉。",
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
              problem: "列表为空。",
              solution:
                "尚未有授信额度分配给你。请授信方在信用额度管理中创建，或确认当前业务账户正确。",
            },
            {
              problem: "无法在此创建或调整额度。",
              solution:
                "「我的可用额度」对会员只读。授信方请使用「信用中心 → 授信管理 → 信用额度管理」，参见 /help/credit/limit。",
            },
            {
              problem: "能否在本页发起付款？",
              solution: "不能。本页只展示余额与历史，不发起付款或还款。",
            },
          ],
        },
      ],
      nextStep: {
        label: "信用额度管理",
        href: "/help/credit/limit",
      },
    },
  },
};
