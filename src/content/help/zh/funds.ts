import type { HelpArticleContent } from "../article-content";

export const zhFunds: Record<string, HelpArticleContent> = {
  "funds/balance": {
    title: "余额与流水",
    description:
      "在 FilixPay 商户中心「资金」查看可用与待入账余额、打开流水，并在能力允许时发起入金、出金或转账。",
    keywords: ["余额", "可用余额", "流水", "资金", "资金变动"],
    body: {
      whoFor: "需要了解各资产资金情况、以及哪些变动影响余额的商户。",
      whenToUse:
        "当你打开「资金 → 余额」或「资金 → 流水」核对可用资金或排查变动时，使用本指南。",
      beforeYouStart: [
        "登录后确认可访问「资金」模块。",
        "明确要查看的资产（例如 USD）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "余额展示商户资金在多资产下的可用与待入账金额。流水列出支付、退款、结算、手续费、出金、转账、入金与调账等变动。用这些页面了解资金如何进出余额。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「资金 → 余额」，查看各资产账户的可用与待入账金额。",
            "检查账户健康度（正常 / 受限）以及入金、出金、转账能力是否可用。",
            "在界面提供时，使用充值、提现或转账入口发起入金、出金或转账。",
            "打开「资金 → 流水」，按资产与变动方向（入 / 出 / 转账）筛选。",
            "需要来源、参考号、金额与状态时，打开流水明细行。",
          ],
        },
        {
          type: "heading",
          text: "关键字段",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "可用余额",
              description: "通常可用于出金或转账的资金，仍受能力限制约束。",
            },
            {
              field: "待入账余额",
              description: "处理中或受冻结规则影响、尚未可用的资金。",
            },
            {
              field: "资产账户",
              description: "余额页按资产列出的账户行（例如 USD）。",
            },
            {
              field: "变动 / 状态",
              description: "流水中每笔资金变动的类型与状态，以及时间与参考号。",
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
              problem: "可用余额比预期低。",
              solution:
                "查看待入账余额与近期流水中的冻结、手续费、退款或出金。确认所选资产正确。",
            },
            {
              problem: "充值或提现不可用。",
              solution:
                "该操作对应账户可能处于受限。参见入金与出金指南，或在余额页查看能力状态。",
            },
          ],
        },
      ],
      nextStep: {
        label: "资金入账（Money-In）",
        href: "/help/funds/money-in",
      },
    },
  },
  "funds/money-in": {
    title: "资金入账（Money-In）",
    description:
      "在 FilixPay 商户中心创建并跟踪 Money-In（充值/入金）记录，使资金记入余额。",
    keywords: ["入金", "Money-In", "充值", "入账方式", "入金记录"],
    body: {
      whoFor: "需要为商户余额增加资金或查看入金历史的运营人员。",
      whenToUse:
        "当你打开「资金 → 入金」创建充值或查看 Money-In 状态时，使用本指南。",
      beforeYouStart: [
        "确认目标资产在余额页具备 Money-In 能力。",
        "明确拟入账的金额与资产。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Money-In 记录跟踪贷记商户资金、增加余额的入金。页面包含充值记录与入金方式页签。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「资金 → 入金」（入金记录）。",
            "按时间、金额、资产、状态与 Money-In ID 查看已有记录。",
            "需要新入金时选择「创建 Money-In / 添加资金」。",
            "按页面入金方式指引完成，直至记录进入成功状态。",
            "回到余额或流水确认贷记已出现。",
          ],
        },
        {
          type: "heading",
          text: "关键字段",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Money-In ID",
              description: "入金记录的唯一标识。",
            },
            {
              field: "金额 / 资产",
              description: "拟贷记的金额与对应资产。",
            },
            {
              field: "状态",
              description: "入金处理生命周期，直至资金可用或失败。",
            },
            {
              field: "入金方式",
              description: "Money-In 页上配置的余额入账途径。",
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
              problem: "无法创建 Money-In。",
              solution:
                "打开余额，检查该资产的 Money-In 能力与账户健康度。受限账户可能无法新建入金。",
            },
            {
              problem: "入金成功但余额未变。",
              solution:
                "刷新余额，并在流水中按 Money-In 筛选。确认查看的资产与入金记录一致。",
            },
          ],
        },
      ],
      nextStep: {
        label: "出金（Payouts）",
        href: "/help/funds/payouts",
      },
    },
  },
  "funds/payouts": {
    title: "出金（Payouts）",
    description:
      "在 FilixPay 商户中心出金页，将商户资金提现或发送到已关联的外部账户。",
    keywords: ["出金", "提现", "外部账户", "资金出账", "出金记录"],
    body: {
      whoFor: "需要把可用余额转到银行或其他已关联外部账户的商户。",
      whenToUse:
        "当你打开「资金 → 出金」创建提现或跟踪出金状态时，使用本指南。",
      beforeYouStart: [
        "确认所选资产的可用余额覆盖出金金额。",
        "确保已关联可用的外部账户（银行或加密目的地）。",
        "在余额页确认出金能力未受限。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "出金（资金出账）列出出金记录，并通过「提现 / 申请提现」将商户余额中的资金发送到已关联外部账户。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「资金 → 出金」（出金记录）。",
            "按时间、金额、资产、状态与 Payout ID 查看已有出金。",
            "准备转出时选择「提现 / 申请提现」。",
            "选择资产、金额与目标外部账户后提交。",
            "跟踪状态至成功或失败，并确认余额与流水已更新。",
          ],
        },
        {
          type: "heading",
          text: "关键字段",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Payout ID",
              description: "出金记录的唯一标识。",
            },
            {
              field: "金额 / 资产",
              description: "拟从商户余额转出的资金。",
            },
            {
              field: "外部账户",
              description: "在资金模块配置的 BANK 或 CRYPTO 目的地。",
            },
            {
              field: "状态",
              description: "出金直至完成或失败的生命周期。",
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
              problem: "提现提示金额超过可用余额。",
              solution:
                "将金额降至可用余额，或等待待入账资金变为可用。在流水中查看近期冻结。",
            },
            {
              problem: "没有可选的目标账户。",
              solution:
                "先在资金模块添加或核验外部账户，再回到出金。",
            },
          ],
        },
      ],
      nextStep: {
        label: "结算单",
        href: "/help/funds/settlements",
      },
    },
  },
  "funds/settlements": {
    title: "结算单",
    description:
      "在 FilixPay 商户中心查看结算单：总额、手续费、净额、释放时间与提供方对账状态。",
    keywords: ["结算", "结算单", "净结算", "释放时间", "提供方对账"],
    body: {
      whoFor: "需要已释放结算事实、并了解其与提供方对账情况的财务人员。",
      whenToUse:
        "当收单活动应结算到资金后，打开「资金 → 结算 → 结算单」时使用本指南。",
      beforeYouStart: [
        "明确要排查的结算周期或 Money-In 参考。",
        "确认可访问「资金 → 结算单」。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "结算单展示已释放的结算金额（总额、手续费、净额）以及提供方与对账状态。用本页理解结算资金与余额的关系。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「资金 → 结算 → 结算单」。",
            "按结算单号、Money-In 参考、资产或释放时间定位单据。",
            "对照订单与费用预期，比较总额、手续费与净额。",
            "查看对账状态（待处理、已匹配、异常）与提供方。",
            "如需订单级匹配，继续打开交易对账。",
          ],
        },
        {
          type: "heading",
          text: "关键字段",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "结算单号",
              description: "结算单行的标识。",
            },
            {
              field: "总额 / 手续费 / 净额",
              description: "结算总额、扣减费用以及与资金流动相关的净额。",
            },
            {
              field: "释放时间",
              description: "结算事实释放的时间。",
            },
            {
              field: "对账 / 提供方",
              description: "相对支付提供方的匹配状态，以及结算提供方。",
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
              problem: "对账显示异常。",
              solution:
                "如有详情则打开单据，对照提供方账单金额，再使用交易对账排查订单范围不一致。",
            },
            {
              problem: "预期有结算但列表为空。",
              solution:
                "确认周期与资产筛选，等待释放时间，并核验相关订单是否已成功后再结算。",
            },
          ],
        },
      ],
      nextStep: {
        label: "交易对账",
        href: "/help/funds/reconciliation",
      },
    },
  },
  "funds/reconciliation": {
    title: "交易对账",
    description:
      "在 FilixPay 商户中心交易对账中，将提供方交易账单与本地订单进行匹配。",
    keywords: ["对账", "交易对账", "已匹配", "不一致", "提供方账单"],
    body: {
      whoFor: "需要将提供方账单与商户中心订单比对的财务与运营团队。",
      whenToUse:
        "当结算或财务复核需要订单范围的对账状态时，使用本指南。",
      beforeYouStart: [
        "明确要对账的通道与业务日期。",
        "准备结算单或订单参考，便于跟进不一致项。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "交易对账将提供方交易账单与本地订单匹配（范围：订单）。状态包括已匹配、不一致、待处理与未对账。用它解释提供方账单与本地资金变动之间的差异。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「资金 → 结算 → 交易对账」。",
            "按通道、业务日期与范围（仅已对账 / 全部交易）筛选。",
            "核对已匹配与不一致或待处理的行。",
            "打开不一致行，比较提供方金额与本地订单金额。",
            "结合结算单与订单跟进异常，直至匹配或可解释。",
          ],
        },
        {
          type: "heading",
          text: "关键状态",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "已匹配",
              description: "该行提供方账单与本地订单金额一致。",
            },
            {
              field: "不一致",
              description: "数值不同；排查金额、费用或重复记账。",
            },
            {
              field: "待处理 / 未对账",
              description: "匹配未完成，或该交易尚未尝试对账。",
            },
            {
              field: "通道 / 业务日期",
              description: "界定要对账的提供方日期的筛选条件。",
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
              problem: "全部显示未对账。",
              solution:
                "修正或扩大业务日期与通道筛选。将范围改为全部交易，并在提供方账单导入后再刷新。",
            },
            {
              problem: "仅手续费不一致。",
              solution:
                "对照结算单的总额/手续费/净额与提供方账单。在认定订单失败前先记录费用差异。",
            },
          ],
        },
      ],
      nextStep: {
        label: "返回余额",
        href: "/help/funds/balance",
      },
    },
  },
  "funds/external-accounts": {
    title: "出金用外部账户",
    description:
      "在「资金 → 外部账户」添加并管理 BANK 与 CRYPTO（USDT / TRON）收款目的地，供 FilixPay 商户中心出金使用。",
    keywords: [
      "外部账户",
      "银行账户出金",
      "加密货币出金地址",
      "USDT TRON",
      "停用外部账户",
    ],
    body: {
      whoFor: "需要在「资金 → 出金」提现前配置收款目的地的运营人员。",
      whenToUse:
        "打开「资金 → 外部账户」添加银行或加密目的地，或停用不应再接收出金的账户时使用本说明。",
      beforeYouStart: [
        "使用可访问「资金 → 外部账户」的账号登录。",
        "银行账户请准备好国家/地区、币种、账户持有人姓名与账号（例如持有人 Example Merchant LLC）。",
        "加密目的地请准备好 TRON 网络上的 USDT 地址。保存后完整账号与地址会被掩码，不再完整展示。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "外部账户列出用于「资金 → 出金」提现的 BANK 与 CRYPTO 目的地。本说明覆盖列表、添加账户弹窗与停用操作；不写出金创建流程，也不同于「资金 → 入金 → 数字货币」的入金监听地址。",
        },
        {
          type: "heading",
          text: "打开外部账户",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "在「资金 → 出金」下打开「外部账户」。",
            "确认页面标题为「外部账户」，并可见「添加账户」。",
          ],
        },
        {
          type: "heading",
          text: "阅读账户列表",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            {
              field: "类型",
              description: "表格中显示的银行或加密货币。",
            },
            {
              field: "账号 / 地址",
              description: "保存后的掩码账号或钱包地址。完整值不会再次展示。",
            },
            {
              field: "持有人 / 网络",
              description:
                "银行账户持有人姓名；或加密网络（例如 TRON），若有备注会提示 memo。",
            },
            {
              field: "银行 / 币种 / 国家或地区",
              description: "BANK 行显示银行名、币种与国家/地区；CRYPTO 行这些列显示为 —。",
            },
            {
              field: "状态",
              description: "启用或已停用。仅启用中的账户可用于出金。",
            },
          ],
        },
        {
          type: "heading",
          text: "添加银行账户",
          anchor: "add-bank",
        },
        {
          type: "steps",
          items: [
            "选择「添加账户」。",
            "账户类型选择「银行账户」。",
            "选择国家/地区与币种。",
            "填写账户持有人姓名（不要填邮箱）与账号。",
            "可选填写银行名称与银行代码，然后保存账户。",
            "确认列表出现带掩码「账号 / 地址」的新行。",
          ],
        },
        {
          type: "heading",
          text: "添加加密目的地",
          anchor: "add-crypto",
        },
        {
          type: "steps",
          items: [
            "选择「添加账户」。",
            "账户类型选择「加密地址（USDT / TRON）」。",
            "选择网络（TRON）并填写钱包地址。",
            "如目的地需要，可选填写 Memo / 标签，然后保存账户。",
            "确认行类型为加密货币且地址已掩码。",
          ],
        },
        {
          type: "heading",
          text: "停用账户",
          anchor: "disable",
        },
        {
          type: "steps",
          items: [
            "在状态为启用的行打开操作并选择「停用」。",
            "确认停用提示。",
            "确认状态变为已停用，且新出金无法再选择该账户。",
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
              problem: "保存后看不到完整账号或地址。",
              solution:
                "这是预期行为。外部账户保存后只保留掩码展示。若需要不同目的地，请重新添加账户。",
            },
            {
              problem: "这和「入金 → 数字货币」是一回事吗？",
              solution:
                "不是。外部账户用于出金目的地；接收加密入金的地址在「资金 → 入金 → 数字货币」，参见 /help/funds/crypto。",
            },
            {
              problem: "出金找不到我的目的地。",
              solution:
                "先在外部账户确认状态为启用，再打开「资金 → 出金」。出金流程见 /help/funds/payouts。",
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
  "funds/crypto": {
    title: "数字货币入金地址",
    description:
      "在「资金 → 入金 → 数字货币」配置链上入金地址，供 FilixPay 监听并结算匹配资产。",
    keywords: [
      "数字货币",
      "加密入金钱包",
      "入金地址",
      "区块链网络",
      "USDT 入金",
    ],
    body: {
      whoFor: "需要配置链上地址以接收加密入金的运营人员。",
      whenToUse:
        "打开「资金 → 入金 → 数字货币」添加、编辑、复制或启用/停用入金地址时使用本说明。",
      beforeYouStart: [
        "使用有管理入金地址权限的账号登录（可管理时会显示「添加入金地址」）。",
        "准备好正确的链、结算资产以及由你控制的入金地址。",
        "阅读页内安全提示：FilixPay 不托管私钥或助记词。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "数字货币列出平台监听链上入金的地址。本说明覆盖列表、添加/编辑抽屉、复制地址与启用/停用状态；不写外部账户下的加密出金目的地，也不写交易所操作教程。",
        },
        {
          type: "heading",
          text: "打开数字货币",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "在「资金 → 入金」下打开「数字货币」。",
            "确认页面标题为「数字货币」并可见入金地址表格。",
          ],
        },
        {
          type: "heading",
          text: "阅读钱包列表",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            {
              field: "区块链网络",
              description: "链标识与网络/协议标签。",
            },
            {
              field: "结算资产",
              description: "监听结算的资产代码（例如 USDT）。",
            },
            {
              field: "入金地址",
              description: "链上地址，带复制控件。",
            },
            {
              field: "标签",
              description: "添加或编辑时可填写的可选标签。",
            },
            {
              field: "状态",
              description: "启用或停用。有管理权限时可点击状态切换。",
            },
            {
              field: "更新时间",
              description: "该钱包行最近更新时间。",
            },
          ],
        },
        {
          type: "heading",
          text: "添加或编辑入金地址",
          anchor: "add-edit",
        },
        {
          type: "steps",
          items: [
            "选择「添加入金地址」，或在已有行打开编辑。",
            "从支持选项中选择区块链网络与结算资产。",
            "填写入金地址，并对照该链的格式提示确认无误。",
            "可选填写标签；如有所有权确认勾选框请勾选后保存。",
            "确认表格出现或更新对应行。",
          ],
        },
        {
          type: "heading",
          text: "复制地址",
          anchor: "copy",
        },
        {
          type: "steps",
          items: [
            "在入金地址单元格选择复制控件。",
            "自行核对地址后再粘贴到钱包或交易所。",
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
              problem: "没有「添加入金地址」或页面只读。",
              solution:
                "可能无管理权限，或地址由平台托管。请按页内横幅说明联系管理员或支持。",
            },
            {
              problem: "和外部账户里的加密地址搞混了。",
              solution:
                "数字货币用于接收入金；外部账户下的 CRYPTO 行是出金目的地，参见 /help/funds/external-accounts。",
            },
            {
              problem: "已链上转入但入金/余额未更新。",
              solution:
                "确认地址状态为启用，资产与网络与转账一致，再到「资金 → 入金」核对，参见 /help/funds/money-in。",
            },
          ],
        },
      ],
      nextStep: {
        label: "入金",
        href: "/help/funds/money-in",
      },
    },
  },
};
