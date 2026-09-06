import type { HelpArticleContent } from "../article-content";

export const zhAccount: Record<string, HelpArticleContent> = {
  "account/notifications": {
    title: "消息与待办",
    description:
      "在 FilixPay 商户中心打开「消息与待办」，阅读平台通知、全部标为已读，并处理待办任务。",
    keywords: ["消息", "待办", "全部标为已读", "未读消息", "行动中心"],
    body: {
      whoFor: "需要清理平台消息或完成商户中心待办事项的运营人员。",
      whenToUse:
        "从顶级菜单打开「消息与待办」，或看到未读/待办角标时使用本说明。",
      beforeYouStart: [
        "登录商户中心。",
        "确认需要「通知」页签还是「待办」页签（?tab=notifications 或 ?tab=tasks）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "「消息与待办」同一页有两个页签。通知用于阅读并可标为已读；待办列出未完成或已完成事项并跳转到处理页。本说明只覆盖该中心，不写页头横幅组件，也不写各跳转目标的完整流程。",
        },
        {
          type: "heading",
          text: "打开消息与待办",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "从顶级菜单打开「消息与待办」。",
            "确认页面标题为「消息与待办」，并可见通知 / 待办页签。",
          ],
        },
        {
          type: "heading",
          text: "处理通知",
          anchor: "notifications",
        },
        {
          type: "steps",
          items: [
            "停留在「通知」页签（或打开 ?tab=notifications）。",
            "筛选「全部」或「未读」；未读可能显示角标数量。",
            "需要时选择「全部标为已读」。",
            "打开一行以标为已读，并在有行动路径时跳转。",
          ],
        },
        {
          type: "heading",
          text: "处理待办",
          anchor: "tasks",
        },
        {
          type: "steps",
          items: [
            "切换到「待办」页签（?tab=tasks）。",
            "筛选「未完成」或「已完成」。",
            "查看优先级、标题、关联、详情与状态或逾期时间。",
            "在行上使用「处理」或「审核」打开对应商户中心页面。",
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
              problem: "看不到「全部标为已读」。",
              solution: "该操作仅在「通知」页签显示。若在「待办」请先切换页签。",
            },
            {
              problem: "待办会跳到其他页面而不是在此完成。",
              solution:
                "待办会深链到实际工作页（例如订单或审核）。在目标页完成后再回到本列表。",
            },
            {
              problem: "这和 Webhook 投递是一回事吗？",
              solution:
                "不是。本收件箱面向商户中心操作员；API Webhook 在开发者中心，参见 /help/developers/webhooks。",
            },
          ],
        },
      ],
      nextStep: {
        label: "审计日志",
        href: "/help/account/audit-logs",
      },
    },
  },
  "account/audit-logs": {
    title: "查看审计日志",
    description:
      "在 FilixPay 商户账户中搜索只读审计日志，核对安全相关操作记录。",
    keywords: ["审计日志", "安全审计", "谁改了", "操作类型", "访问拒绝"],
    body: {
      whoFor: "需要查看谁执行了安全敏感操作及其结果的运营与管理员。",
      whenToUse:
        "打开「账户与设置 → 安全设置 → 审计日志」调查登录、API 密钥、Webhook、角色或保障配置变更时使用本说明。",
      beforeYouStart: [
        "使用可访问审计日志的账号登录。",
        "准备大致时间范围；如有可能，准备关心的操作类型（例如 apikey.rotate）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "审计日志为只读轨迹。可按时间范围、操作类型与结果筛选，并展开行查看原因与请求标识。本说明只覆盖列表与筛选，不写如何执行这些底层操作。",
        },
        {
          type: "heading",
          text: "打开审计日志",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "打开「账户与设置 → 安全设置 → 审计日志」。",
            "确认页面标题为「审计日志」并可见筛选栏。",
          ],
        },
        {
          type: "heading",
          text: "筛选并阅读记录",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "按需设置时间范围、操作类型与结果（成功 / 失败 / 拒绝）。",
            "搜索以应用筛选；用重置清空。",
            "查看时间、操作者、操作、资源（类型 / ID）、结果，以及可用时的链接。",
            "展开行查看原因、事件 ID、请求 ID、追踪 ID 与元数据。",
          ],
        },
        {
          type: "heading",
          text: "可筛选的操作类型",
          anchor: "actions",
        },
        {
          type: "paragraph",
          text: "操作类型筛选包含 P0 动作，例如 auth.login、auth.logout、auth.password.change、MFA 启用/禁用、API 密钥创建/轮换/删除、Webhook 创建/更新/删除/重放、merchant.config.update、保障启用/禁用/更新、risk.review 通过/拒绝/分配、角色授予/撤销、permission.update，以及操作员创建/更新/停用。结果中可能出现其他类型，但不会出现在该筛选列表中。",
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
              problem: "无法编辑或删除日志行。",
              solution:
                "审计日志为只读。用链接或展开详情调查，再到相关设置页处理问题。",
            },
            {
              problem: "筛选里没有我期望的操作类型。",
              solution:
                "扩大时间范围并清空操作类型，或确认变更确实发生在本商户账户下。",
            },
            {
              problem: "在哪里管理 API 密钥或 Webhook？",
              solution:
                "请到开发者中心设置，参见 /help/developers/developer-center 与 /help/developers/webhooks。审计日志只记录它们被变更。",
            },
          ],
        },
      ],
      nextStep: {
        label: "开发者中心",
        href: "/help/developers/developer-center",
      },
    },
  },
  "account/maintenance": {
    title: "商户资料、联系方式与资料变更",
    description:
      "在 FilixPay 商户中心「账户与设置」下查看商户资料、更新联系方式，并提交法人或结算银行资料变更申请。",
    keywords: ["商户资料", "资料变更", "联系方式", "法人信息变更", "银行账户变更申请"],
    body: {
      whoFor: "需要核对身份资料、更新邮箱/手机，或申请法人/结算银行变更的正式商户。",
      whenToUse:
        "打开「账户与设置」下的商户资料、联系方式或资料变更时使用本说明。",
      beforeYouStart: [
        "使用可看到资料维护菜单的 ACTIVE 商户登录（试用商户可能看到正式开通而非资料变更）。",
        "涉及结算银行时，区分资料变更（LEGAL_INFO / BANK_ACCOUNT）与「资金 → 外部账户」出金目的地。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "账户资料维护覆盖三个页面：商户资料只读展示身份；联系方式可改通知/支持邮箱与手机；资料变更是法人信息或结算银行账户的审批流程（含草稿与提交详情页）。本说明对照三个页面，不罗列动态表单全部字段。",
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
              field: "商户资料",
              description:
                "打开「账户与设置 → 商户资料」查看身份、主体凭证与掩码后的联系/银行指引。",
            },
            {
              field: "联系方式",
              description:
                "打开「账户与设置 → 联系方式」更新通知邮箱、支持邮箱或手机。",
            },
            {
              field: "资料变更",
              description:
                "打开「账户与设置 → 资料变更」创建 LEGAL_INFO 或 BANK_ACCOUNT 申请，并跟踪草稿、已提交与退回状态。",
            },
          ],
        },
        {
          type: "heading",
          text: "阅读商户资料",
          anchor: "profile",
        },
        {
          type: "steps",
          items: [
            "打开「账户与设置 → 商户资料」。",
            "查看身份字段（法定名称、显示名、类型/层级、结算模式、商户 ID、客户号、状态）。",
            "查看主体凭证（注册国家/地区、开户状态、掩码证件号、创建/更新时间）。",
            "在显示时使用「更新联系方式」或「申请资料变更」。试用商户可能看到「开始正式开通」。",
            "页面过期时使用「刷新」。",
          ],
        },
        {
          type: "heading",
          text: "更新联系方式",
          anchor: "contact",
        },
        {
          type: "steps",
          items: [
            "打开「账户与设置 → 联系方式」。",
            "查看通知邮箱、支持邮箱与手机概览。",
            "选择联系类型，填写新值（手机可能需国家区号），然后更新联系方式。",
          ],
        },
        {
          type: "heading",
          text: "创建并跟踪资料变更",
          anchor: "changes",
        },
        {
          type: "steps",
          items: [
            "打开「账户与设置 → 资料变更」。",
            "按需筛选变更类型（法人信息或银行账户）与状态后搜索。",
            "选择「新建变更」，选择类型（法人信息还需注册国家/地区），进入详情表单。",
            "对草稿或已退回申请：继续编辑、保存草稿、提交审核，或按界面删除/取消。",
            "对已提交申请打开查看详情，阅读时间线与退回修改提示。",
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
              problem: "无法在商户资料页直接改法定名称。",
              solution:
                "资料页只读。法人/银行请走资料变更；邮箱/手机请走联系方式。",
            },
            {
              problem: "银行变更和外部账户是一回事吗？",
              solution:
                "资料变更中的 BANK_ACCOUNT 走商户资料审批流；出金目的地在「资金 → 外部账户」，参见 /help/funds/external-accounts。",
            },
            {
              problem: "看不到资料维护菜单。",
              solution:
                "商户资料/变更/联系方式面向 ACTIVE 商户。请确认状态或先完成开通，参见 /help/getting-started/merchant-setup。",
            },
          ],
        },
      ],
      nextStep: {
        label: "关闭账户",
        href: "/help/account/close-account",
      },
    },
  },
  "account/close-account": {
    title: "关闭商户账户",
    description:
      "在 FilixPay 商户中心「账户与设置 → 关闭账户」提交关闭申请，并跟踪草稿、审核与结论状态。",
    keywords: ["关闭账户", "停用商户", "关闭申请", "生命周期关闭", "撤销关闭申请"],
    body: {
      whoFor: "在结清余额与处理中事务后，打算永久关闭商户账户的商户。",
      whenToUse:
        "打开「账户与设置 → 关闭账户」保存草稿、提交平台审核或撤销待处理申请时使用本说明。",
      beforeYouStart: [
        "导出仍需保留的账单与历史——审核通过后关闭不可恢复。",
        "确认无待结算余额，且无处理中的订单、退款或纠纷。",
        "当前关闭账户页界面文案为中文；下列步骤用中文控件名描述同一操作。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "关闭账户可创建关闭申请、保存草稿、提交平台审核（通常 1–3 个工作日），并管理申请记录。审核通过后的关闭不可撤销。本说明只覆盖该页。",
        },
        {
          type: "heading",
          text: "打开关闭账户",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "打开「账户与设置 → 关闭账户」（菜单可能仅对 ACTIVE、SUSPENDED 或 RISK_FROZEN 账户显示）。",
            "阅读关于不可恢复、余额与审核时效的警告说明。",
          ],
        },
        {
          type: "heading",
          text: "新建关闭申请",
          anchor: "create",
        },
        {
          type: "steps",
          items: [
            "在「新建关闭申请」中选择关闭原因：不再经营、业务已关闭、更换服务商或其他。",
            "可选填写补充说明（最多 500 字）。",
            "选择「保存草稿」保留草稿行，或「提交审核」在确认后创建并提交。",
            "提交前确认危险提示——审核通过后账户关闭不可恢复。",
          ],
        },
        {
          type: "heading",
          text: "管理申请记录",
          anchor: "history",
        },
        {
          type: "steps",
          items: [
            "在「申请记录」中查看状态：草稿、审核中、已通过、已拒绝或已取消。",
            "对草稿行可「提交」送审。",
            "对草稿或审核中的行，在界面允许时「撤销」申请。",
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
              problem: "无法提交或审核被拒绝。",
              solution:
                "先结清余额并结束处理中的订单、退款或纠纷后再提交或新建申请。资金参见 /help/funds/balance。",
            },
            {
              problem: "只想改资料，不想关闭。",
              solution:
                "请使用商户资料 / 联系方式 / 资料变更，参见 /help/account/maintenance。",
            },
            {
              problem: "页面是中文而其他界面是英文。",
              solution:
                "这与当前 Dashboard 实现一致。按同一顺序操作：原因 → 补充说明 → 保存草稿/提交审核 → 申请记录操作。",
            },
          ],
        },
      ],
      nextStep: {
        label: "商户资料维护",
        href: "/help/account/maintenance",
      },
    },
  },
  "account/security": {
    title: "设置交易密码",
    description:
      "在 FilixPay 商户中心「账户与设置 → 安全设置 → 交易密码」绑定安全邮箱，并设置或修改 6 位交易 PIN。",
    keywords: ["交易密码", "支付 PIN", "安全邮箱", "设置交易密码", "修改支付密码"],
    body: {
      whoFor: "需要在出金或转账前设置交易 PIN，或需要修改已有 PIN 的运营人员。",
      whenToUse:
        "打开「账户与设置 → 安全设置 → 交易密码」，或在出金/转账流程提示先设置 PIN 时使用本说明。",
      beforeYouStart: [
        "使用可访问「安全设置 → 交易密码」的账号登录。",
        "准备安全邮箱——若页面显示未绑定，请先在联系方式中绑定（例如 security-ops@example.com）。",
        "选择非弱口令的 6 位 PIN（不要使用 123456 这类序列）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "交易密码用于管理资金操作（如出金、转账）所需的 6 位 PIN。页面展示安全账户绑定与交易 PIN 状态，并通过三步弹窗完成邮箱验证码校验、设置 PIN 与成功确认。本说明只覆盖该页；不写登录 MFA，也不写审计日志。",
        },
        {
          type: "heading",
          text: "打开交易密码",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "打开「账户与设置 → 安全设置 → 交易密码」。",
            "确认页面标题为「交易密码」。",
          ],
        },
        {
          type: "heading",
          text: "绑定安全邮箱",
          anchor: "bind-email",
        },
        {
          type: "steps",
          items: [
            "在「安全账户绑定」中查看商户名称与绑定邮箱。",
            "若显示未绑定，选择「立即绑定」打开联系方式并更新邮箱。",
            "绑定完成后返回交易密码页——设置密码弹窗需要已绑定邮箱。",
          ],
        },
        {
          type: "heading",
          text: "设置或修改 PIN",
          anchor: "set-pin",
        },
        {
          type: "steps",
          items: [
            "在「交易 PIN 状态」中选择「设置交易密码」或「修改密码」。",
            "验证步骤：向安全邮箱获取验证码并填写，然后继续。",
            "设置 PIN 步骤：输入并确认 6 位交易密码，然后设置密码。",
            "完成步骤：确认成功并选择完成。",
            "确认本会话成功设置后状态标签显示为已启用。",
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
              problem: "弹窗提示邮箱未设置。",
              solution:
                "请先在联系方式绑定安全邮箱，参见 /help/account/maintenance#contact，然后再返回本页。",
            },
            {
              problem: "刷新后状态仍显示未设置。",
              solution:
                "本页在当前会话成功设置后显示已启用。若需再次修改，打开「修改密码」。Help 不写超出页面展示的服务端 PIN 状态徽章。",
            },
            {
              problem: "出金提示需要先设置 PIN。",
              solution:
                "先在本页完成设置交易密码，再返回「资金 → 出金」，参见 /help/funds/payouts。",
            },
          ],
        },
      ],
      nextStep: {
        label: "出金",
        href: "/help/funds/payouts",
      },
    },
  },
  "account/service-plan": {
    title: "选择服务计划",
    description:
      "在「账户与设置 → 服务计划」选择 FilixPay 平台服务方案、通过结账支付，并继续待支付的服务费记录。",
    keywords: ["服务计划", "平台服务费", "选择方案", "付费记录", "周月年套餐"],
    body: {
      whoFor: "需要购买或续费平台服务计划，并查看服务费付费记录的商户。",
      whenToUse:
        "打开「账户与设置 → 服务计划」选择周 / 月 / 半年 / 年方案，或对待支付服务费订单点击「支付」时使用本说明。",
      beforeYouStart: [
        "使用可访问服务计划的账号登录。",
        "确认要购买的周期（周、月、半年或年）。",
        "选择方案后会跳转到外部结账页——在结账完成支付后再返回商户中心。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "服务计划展示四个方案卡片，以及仅含平台服务费订单的付费记录表。选择方案会创建服务费订单并跳转结账；待支付行可用「支付」继续结账。本说明只覆盖该页——不写跳转后的结账页 UI，也不写完整订单管理。",
        },
        {
          type: "heading",
          text: "打开服务计划",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "打开「账户与设置 → 服务计划」。",
            "确认页面标题为「服务计划」，上方为方案卡片，下方为付费记录。",
          ],
        },
        {
          type: "heading",
          text: "选择方案",
          anchor: "choose",
        },
        {
          type: "steps",
          items: [
            "查看周、月、半年、年四个卡片（名称、价格与简短说明）。",
            "在目标卡片上选择「选择方案」。",
            "在打开的结账页完成支付。",
            "支付完成后返回商户中心。",
          ],
        },
        {
          type: "heading",
          text: "付费记录",
          anchor: "records",
        },
        {
          type: "fields",
          rows: [
            {
              field: "订单号",
              description: "服务费商户订单号，必要时带主题文案。",
            },
            {
              field: "金额 / 状态 / 创建时间",
              description: "订单金额、状态徽章与创建时间。",
            },
            {
              field: "支付",
              description: "出现在待支付的平台服务费行，用于继续结账。",
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
              problem: "结账未打开或支付失败。",
              solution:
                "确认仍处于登录状态，重试「选择方案」或「支付」，并确认能创建支付令牌。若订单已是待支付，请在该行使用「支付」。",
            },
            {
              problem: "需要查看全部订单，不只服务费。",
              solution:
                "请到「交易 → 订单」查看完整列表，参见 /help/payments/orders。本页仅列出 PLATFORM_SERVICE_FEE 记录。",
            },
            {
              problem: "想关闭账户而不是续费。",
              solution:
                "请使用「账户与设置 → 关闭账户」，参见 /help/account/close-account。",
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
