import type { HelpArticleContent } from "../article-content";

export const zhRisk: Record<string, HelpArticleContent> = {
  "risk/refunds": {
    title: "管理退款",
    description:
      "在 FilixPay 商户中心退款管理中搜索、创建并跟踪退款订单。",
    keywords: ["退款", "退款管理", "发起退款", "退款状态", "售后"],
    body: {
      whoFor: "处理客户退款或监控退款订单状态的运营人员。",
      whenToUse:
        "当你打开「交易 → 退款」，或从订单发起退款后，使用本指南。",
      beforeYouStart: [
        "准备好原订单号或退款单号。",
        "确认角色可创建退款或查看退款列表。",
        "了解退款设置是否对超过阈值的金额要求审批。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "退款管理列出退款订单，含退款单号、订单号、金额、状态与提交时间。退款是商户主动发起的已捕获支付返还——与拒付与争议不同。演示备注邮箱请使用 refunds-ops@example.com。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「交易 → 退款」（退款管理）。",
            "按退款单号或订单号搜索已有退款。",
            "创建退款时选择「创建退款」（或从相关订单「发起退款」）。",
            "填写金额与必填原因后提交。",
            "若金额超过自动执行阈值，需等待退款审批后再完成执行。",
            "关注状态从已请求或处理中变为成功、失败或已取消。",
          ],
        },
        {
          type: "heading",
          text: "关键字段与状态",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "退款单号 / 订单号",
              description: "退款记录标识以及被退款的原订单。",
            },
            {
              field: "金额",
              description: "退款金额；可相对原订单为部分退款。",
            },
            {
              field: "状态",
              description: "已请求、处理中、成功、失败或已取消。",
            },
            {
              field: "提交时间",
              description: "退款请求进入系统的时间。",
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
              problem: "退款一直停留在处理中。",
              solution:
                "刷新列表并打开详情。若需审批，检查退款审批队列。确认原订单处于可退款状态。",
            },
            {
              problem: "无法创建退款。",
              solution:
                "先打开订单，在交易状态允许时使用「发起退款」，或确认角色权限与退款设置。",
            },
            {
              problem: "这和拒付一样吗？",
              solution:
                "不一样。退款由商户发起。卡组织争议在「拒付与争议」——见 /help/risk/disputes。",
            },
          ],
        },
      ],
      nextStep: {
        label: "拒付与争议",
        href: "/help/risk/disputes",
      },
    },
  },
  "risk/disputes": {
    title: "拒付与争议",
    description:
      "在 FilixPay 商户中心「拒付与争议」中监控拒付案件、答复时限与商户行动。",
    keywords: ["拒付", "争议", "证据", "答复截止", "风险管理"],
    body: {
      whoFor: "需要在截止前响应支付拒付并上传证据的风险与运营团队。",
      whenToUse:
        "当出现需处理案件、即将到期或已逾期，或打开「风险管理 → 拒付与争议」时，使用本指南。",
      beforeYouStart: [
        "收集订单相关的收据、物流或沟通证据。",
        "从争议列表记下案件号与答复截止时间。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "「拒付与争议」跟踪卡组织拒付案件——不是线下归集确认，也不是风险审核欺诈队列。优先级与答复截止决定处理顺序。证据类型可包括收据、物流、沟通或其他。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「风险管理 → 拒付与争议」。",
            "查看需处理案件、即将到期（不足 3 天）与已逾期等指标。",
            "按案件号或订单号打开案件。",
            "在商户行动中心按要求操作并上传证据文件。",
            "在答复截止前提交响应，并跟踪状态（草稿 → 已提交 → 审核中 → 胜诉 / 败诉 / 已接受）。",
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
              field: "案件号 / 订单号",
              description: "拒付案件标识与相关支付订单。",
            },
            {
              field: "原因 / 优先级",
              description: "争议原因上下文，以及紧急 / 高 / 中 / 低优先级。",
            },
            {
              field: "状态",
              description: "草稿、已提交、审核中、胜诉、败诉或已接受。",
            },
            {
              field: "答复截止",
              description: "需提交商户证据或按路径接受结果的截止时间。",
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
              problem: "打开了「确认/审核」类页面但找不到拒付。",
              solution:
                "拒付在「拒付与争议」。线下归集确认与风险审核是不同队列。",
            },
            {
              problem: "证据上传失败。",
              solution:
                "使用支持的证据类型（收据、物流、沟通、其他），检查表单文件大小限制，并在截止前重试。",
            },
            {
              problem: "案件已逾期。",
              solution:
                "立即打开案件，提交仍可提供的证据并内部升级——逾期响应会提高败诉风险。",
            },
          ],
        },
      ],
      nextStep: {
        label: "管理退款",
        href: "/help/risk/refunds",
      },
    },
  },
  "risk/controls": {
    title: "欺诈事件、风险审核与风险规则",
    description:
      "在 FilixPay 商户中心「风险管理」下查找欺诈事件、风险审核队列与只读风险规则。",
    keywords: [
      "欺诈事件",
      "风险审核队列",
      "风险规则",
      "PRE_AUTH",
      "风险管理",
    ],
    body: {
      whoFor: "需要监控欺诈信号、查看人工审核队列或了解平台/商户风险规则的运营人员。",
      whenToUse:
        "打开「风险管理 → 欺诈 / 风险审核 / 风险规则」调查信号或确认生效中的 PRE_AUTH 规则时使用本说明。",
      beforeYouStart: [
        "使用可访问风险管理菜单的账号登录。",
        "搜索欺诈事件或风险审核时请准备订单号、支付号或关键词（例如 ORD_EXAMPLE_001）。",
        "商户中心的风险规则为只读——Help 不写如何创建或编辑规则。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "风险管理提供三个相关页面。欺诈事件列出已检测信号与调查状态；风险审核队列只读展示被标记需人工审核的订单与出金；风险规则只读展示平台与商户 PRE_AUTH 规则。本说明用「是什么 / 在哪里 / 何时用」对照并说明如何打开各列表；不写评分算法，也不写授信（Credit）。",
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
              field: "欺诈事件",
              description:
                "需要查看事件类型、严重级别、关联订单与调查状态时，打开「风险管理 → 欺诈」。",
            },
            {
              field: "风险审核队列",
              description:
                "订单或出金被标记需人工审核（待处理 / 已通过 / 已拒绝）时，打开「风险管理 → 风险审核」。",
            },
            {
              field: "风险规则",
              description:
                "需要查看哪些 PRE_AUTH 频率或金额规则已启用及执行方式（拦截或支付前审核）时，打开「风险管理 → 风险规则」。",
            },
          ],
        },
        {
          type: "heading",
          text: "使用欺诈事件",
          anchor: "fraud",
        },
        {
          type: "steps",
          items: [
            "打开「风险管理 → 欺诈」（欺诈事件）。",
            "按需用关键词、状态、严重级别筛选后搜索；用重置清空筛选。",
            "查看事件类型、风险类型、描述、严重级别、关联订单、状态与检测时间。",
            "打开行查看欺诈事件详情（支付 ID、提供方、风险分及元数据等）。",
            "用「返回欺诈事件」回到列表。",
          ],
        },
        {
          type: "heading",
          text: "使用风险审核",
          anchor: "reviews",
        },
        {
          type: "steps",
          items: [
            "打开「风险管理 → 风险审核」（风险审核队列）。",
            "按需用关键词、状态、优先级、审核类型筛选后搜索。",
            "查看资源（订单或出金）、原因、优先级、状态与标记时间。",
            "打开行查看审核详情（原因码、入队/决策时间、决策备注、关联欺诈事件、恢复链接等）。",
            "将队列视为商户中心只读视图——决策可能在列表外完成。",
          ],
        },
        {
          type: "heading",
          text: "查看风险规则",
          anchor: "rules",
        },
        {
          type: "steps",
          items: [
            "打开「风险管理 → 风险规则」。",
            "查看名称、类型（频率或金额）、严重级别、执行方式、范围（平台或商户）、是否启用与优先级。",
            "用此列表了解哪些规则可能拦截或在支付前送审。本页不应出现编辑操作。",
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
              problem: "无法在商户中心编辑风险规则。",
              solution:
                "风险规则在此为只读。如需改规则请联系管理员或平台运营。Help 不写规则编写 API。",
            },
            {
              problem: "欺诈事件和拒付是一回事吗？",
              solution:
                "不是。欺诈事件与风险审核属于风控界面；卡组织争议在「争议与拒付」，参见 /help/risk/disputes；商户主动退款在「退款」，参见 /help/risk/refunds。",
            },
            {
              problem: "审核队列一直待处理且没有操作按钮。",
              solution:
                "商户中心队列为只读。打开审核详情查看关联欺诈或恢复信息，并按内部流程或平台指引处理。",
            },
          ],
        },
      ],
      nextStep: {
        label: "争议与拒付",
        href: "/help/risk/disputes",
      },
    },
  },
  "risk/coverage": {
    title: "保险风控与拒付保障",
    description:
      "在 FilixPay 商户中心「风险管理 → 保障服务」下订阅平台保险风控，或配置拒付保障提供方。",
    keywords: ["保险风控", "拒付保障", "保障配置", "争议保障提供方", "开通保障"],
    body: {
      whoFor: "需要开通平台保险风控，或为新案件配置第三方拒付保障提供方的商户。",
      whenToUse:
        "打开「保险风控」或「拒付保障」时使用本说明。可见页面取决于结算模式与商户类型。",
      beforeYouStart: [
        "使用可访问保障服务菜单的账号登录。",
        "确认结算模式：PLATFORM 商户常用保险风控；DIRECT（及部分 PLATFORM）使用拒付保障配置。",
        "配置提供方时请准备凭据——Help 示例不要粘贴真实密钥。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "保障服务包含两个相关页面：保险风控用于开通或关闭平台托管保障；拒付保障用于配置提供方连接（添加、测试、启用/停用）。访问受能力门控——若页面被重定向，请使用另一保障入口或向管理员确认适用页面。",
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
              field: "保险风控",
              description:
                "打开「风险管理 → 保障服务 → 保险风控」同意并开通，或关闭保障。查看提供方、订阅时间与协议版本。",
            },
            {
              field: "拒付保障",
              description:
                "打开「风险管理 → 保障服务 → 拒付保障」添加配置、编辑、测试连接并启用或停用提供方。",
            },
          ],
        },
        {
          type: "heading",
          text: "保险风控",
          anchor: "insurance",
        },
        {
          type: "steps",
          items: [
            "打开保险风控。",
            "阅读协议后选择开通以订阅。",
            "需要停止时选择关闭并确认对话框。",
            "按页内状态确认已订阅 / 未订阅 / 不可用。",
          ],
        },
        {
          type: "heading",
          text: "拒付保障配置",
          anchor: "config",
        },
        {
          type: "steps",
          items: [
            "打开拒付保障。",
            "选择添加配置并选择提供方。",
            "填写界面展示的字段（例如团队、店铺域名、环境、保障额度、币种、模式）及所需密钥字段。",
            "使用测试连接，再启用或停用。平台运营可能还会看到维护控制。",
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
              problem: "保障页面被重定向或不可用。",
              solution:
                "结算模式或商户类型可能门控保险与配置页。请尝试保障服务下的另一页面，或向管理员确认适用入口。",
            },
            {
              problem: "保障和争议是一回事吗？",
              solution:
                "保障用于配置新案件保护；既有拒付案件在「争议」，参见 /help/risk/disputes。",
            },
            {
              problem: "测试连接失败。",
              solution:
                "复核提供方字段与密钥后重试测试连接，再启用。Help 不写提供方后台文档。",
            },
          ],
        },
      ],
      nextStep: {
        label: "争议与拒付",
        href: "/help/risk/disputes",
      },
    },
  },
};
