import type { HelpArticleContent } from "../article-content";

export const zhPayments: Record<string, HelpArticleContent> = {
  "payments/orders": {
    title: "管理订单",
    description:
      "在 FilixPay 商户中心的订单管理中搜索、查看、创建并操作交易订单。",
    keywords: ["订单", "订单管理", "交易号", "商户订单号", "交易"],
    body: {
      whoFor: "需要查找支付订单、核对状态、创建订单或从订单列表发起退款的运营人员。",
      whenToUse:
        "当你打开「交易 → 订单」排查支付、导出结果或创建订单时，使用本指南。",
      beforeYouStart: [
        "使用具备查看订单权限的账号登录。",
        "查找特定订单时请准备好商户订单号、交易号或客户编码。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "订单管理列出本商户的交易及相关订单类型。可按状态、通道、子商户、门店、金额与日期范围筛选。演示商户订单号请使用 DEMO-ORD-1001 一类虚构值——示例中不要使用真实客户邮箱或手机号（可用 buyer@example.com 或 13800138000）。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「交易 → 订单」。",
            "输入商户订单号、交易号、客户编码或其他筛选项后搜索。",
            "打开行查看详情，或在列表提供时使用发起支付、发起退款、修补订单等操作。",
            "创建订单时选择「创建订单」，填写商户订单号、主题、金额、币种及相关字段。",
            "需要离线备份时，可导出当前筛选结果的 CSV。",
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
              field: "商户订单号 / 交易号",
              description: "你的业务参考号与 FilixPay 交易标识，用于搜索与支持。",
            },
            {
              field: "订单类型",
              description:
                "例如交易订单、充值、转账、出金、退款、平台服务费等。",
            },
            {
              field: "支付通道 / 金额",
              description: "支付所用通道以及含币种的订单金额。",
            },
            {
              field: "交易状态",
              description:
                "生命周期如待处理、处理中、成功、已关闭、失败、待捕获或争议中。",
            },
            {
              field: "创建时间 / 支付时间",
              description: "订单创建时间，以及支付成功时间（如有）。",
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
              problem: "刚创建的订单找不到。",
              solution:
                "清空筛选、扩大创建时间范围，并用商户订单号搜索。创建完成后再刷新列表。",
            },
            {
              problem: "如何从订单发起退款？",
              solution:
                "打开订单并在可用时使用「发起退款」，或前往退款管理查看退款列表。退款状态见 /help/risk/refunds。",
            },
            {
              problem: "创建订单里的「线下转账」是什么？",
              solution:
                "该选项关联线下归集（银行转账收款），不是资金转账。审核与确认见线下归集指南。",
            },
          ],
        },
      ],
      nextStep: {
        label: "线下归集",
        href: "/help/payments/offline-collection",
      },
    },
  },
  "payments/offline-collection": {
    title: "线下归集",
    description:
      "在 FilixPay 商户中心执行线下归集：审核待确认的银行转账，再由第二操作员确认收款。",
    keywords: ["线下归集", "银行转账", "待审核", "待确认", "双人复核"],
    body: {
      whoFor:
        "通过线下银行转账收款、需要制单人/复核人确认到账的商户。",
      whenToUse:
        "当买家以银行转账付款、你必须完成线下归集审核与确认时使用——不是商品评价或目录评分。",
      beforeYouStart: [
        "确认有两名具备线下归集权限的操作员（审核人制单、确认人复核）。",
        "准备买家银行凭证，以及对应的商户订单号或交易号。",
        "审核前如需金额与付款人上下文，先打开相关订单。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "线下归集（Offline Collection）是「交易」下的银行转账收款流程。待审核是制单（Maker）步骤；待确认是复核（Checker）步骤。确认界面路径为 /dashboard/reviews，但其含义是线下归集确认——绝不是商品评价或「商品评价」。请勿与风险审核或「资金 → 转账」混淆。",
        },
        {
          type: "heading",
          text: "操作步骤 — 审核（制单人）",
          anchor: "steps-audit",
        },
        {
          type: "steps",
          items: [
            "打开「交易 → 线下收款 → 待审核」（线下收款审核）。",
            "按商户订单号、交易号或银行流水号定位记录。",
            "对照银行记录核验付款人、收款人、金额与买家付款凭证。",
            "按要求填写银行流水号、实收金额、银行入账时间与备注。",
            "选择「拟确认已收款」或「拟未收到款」，并提交至确认环节。",
          ],
        },
        {
          type: "heading",
          text: "操作步骤 — 确认（复核人）",
          anchor: "steps-confirmation",
        },
        {
          type: "steps",
          items: [
            "打开「交易 → 线下收款 → 待确认」（线下收款确认）。",
            "独立复核制单人结论（双人四眼原则）。",
            "选择「确认已收款」「确认未收到」或「退回审核」。",
            "确认确认状态已更新（已确认收款 / 确认未收到）。",
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
              field: "银行流水号 / 交易参考",
              description: "用于在银行对账单上匹配买家转账的参考号。",
            },
            {
              field: "实收金额",
              description: "制单人根据银行入账记录的金额，可能与订单金额不同。",
            },
            {
              field: "审核状态",
              description: "审核列表中的待审核、已提交审核或拟未收到款。",
            },
            {
              field: "确认状态",
              description: "确认列表中的待确认、已确认收款或确认未收到。",
            },
            {
              field: "审核人 / 确认人",
              description:
                "第一操作员（审核）与第二操作员（确认）。启用四眼时同一人不能完成两步。",
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
              problem: "这是商品评价页面吗？",
              solution:
                "不是。线下归集确认仅使用 reviews 路径处理银行转账确认，与商品评价无关。",
            },
            {
              problem: "无法确认自己提交的审核。",
              solution:
                "四眼规则要求不同的确认人。请使用另一名授权操作员登录「待确认」。",
            },
            {
              problem: "银行回单金额与订单不一致。",
              solution:
                "登记实收金额；若政策要求异常处理，使用拟未收到款并备注，再由确认人确认或退回审核。",
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
  "payments/customers": {
    title: "在商户中心查找客户",
    description:
      "打开 FilixPay 商户中心的客户页，查看客户列表，并按客户号、邮箱或电话筛选。",
    keywords: [
      "FilixPay 客户 商户中心",
      "客户列表",
      "按邮箱查找客户",
      "客户号",
      "电话筛选客户",
    ],
    body: {
      whoFor: "需要在 FilixPay 商户中心用客户列表与筛选条件定位已有客户记录的运营人员。",
      whenToUse: "当你需要按客户号、邮箱或电话查找客户，或查看列表中展示的客户字段时使用。",
      beforeYouStart: [
        "使用具备「客户」权限的账号登录商户中心。",
        "搜索时准备至少一个标识（客户号、邮箱如 customer@example.com、或电话如 13800138000）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "侧栏「客户」对应页面标题为「客户」。本指南覆盖打开列表、阅读行内字段与筛选。不覆盖创建/编辑客户、Customer API，也不描述单独的详情页——当前界面没有这些能力。",
        },
        {
          type: "heading",
          text: "打开客户列表",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "在侧栏打开「客户」。",
            "确认页面标题为「客户」，表格上方有筛选栏。",
          ],
        },
        {
          type: "heading",
          text: "在列表中查看客户记录",
          anchor: "list",
        },
        {
          type: "paragraph",
          text: "客户记录以表格行展示。本页没有单独的客户详情页——请直接阅读行内字段。",
        },
        {
          type: "fields",
          rows: [
            { field: "客户号", description: "列表中的客户唯一编号。" },
            { field: "姓名", description: "客户显示名称。" },
            { field: "邮箱", description: "记录上的邮箱。" },
            {
              field: "手机号",
              description: "表格中的手机号列（标签为「手机号」）。",
            },
            { field: "客户状态", description: "商户中心展示的状态徽标。" },
            { field: "创建时间", description: "客户记录创建时间。" },
          ],
        },
        {
          type: "heading",
          text: "按客户号、邮箱或电话搜索",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "在筛选栏按需填写客户号、邮箱和/或电话。电话筛选项占位为「电话」（与表格列「手机号」不同）。",
            "点击「查询」应用筛选；留空的字段不会参与筛选。",
            "同时填写多个字段时，商户中心会一并应用这些条件。",
            "点击「重置」清空筛选并回到未筛选列表。",
            "使用分页浏览结果。",
          ],
        },
        {
          type: "heading",
          text: "常见场景",
          anchor: "scenarios",
        },
        {
          type: "steps",
          items: [
            "已知邮箱：填写邮箱（例如 customer@example.com），再查询。",
            "已知电话：填写电话（例如 13800138000），再查询。",
            "已知客户号：填写客户号，再查询。",
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
              problem: "提示暂无客户数据。",
              solution:
                "确认当前组织/业务账户正确，先重置筛选再查询。若仍为空，说明该账户下尚无客户记录。",
            },
            {
              problem: "查询后没有匹配行。",
              solution:
                "检查拼写与多余空格，可先只填一个条件。注意筛选项是「电话」，表格列名是「手机号」。",
            },
            {
              problem: "我以为会有客户详情页。",
              solution:
                "当前商户中心此页仅在表格中展示记录。请使用行内字段查看；本 UI 不含单独详情路由。",
            },
          ],
        },
      ],
      nextStep: {
        label: "查看支付与订单",
        href: "/help/payments/orders",
      },
    },
  },
};
