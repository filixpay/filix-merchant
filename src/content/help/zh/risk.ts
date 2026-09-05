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
};
