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
  "payments/payment-splits": {
    title: "在商户中心查看分账记录",
    description:
      "打开 FilixPay 商户中心分账记录，按流水号筛选，并在分账详情中查看接收方明细。",
    keywords: [
      "FilixPay 分账记录",
      "分账",
      "流水号筛选",
      "分账接收方",
      "商户中心分账",
    ],
    body: {
      whoFor:
        "使用直清业务账户、需要在商户中心查看订单分账记录与接收方状态的运营人员。",
      whenToUse:
        "需要按流水号查找分账、查看分账状态，或打开详情查看接收方时使用。",
      beforeYouStart: [
        "登录 FilixPay 商户中心。",
        "使用能在「交易」下看到「分账记录」的业务账户（直清）。若没有该菜单，请切换账户或向管理员确认结算模式——Help 不说明如何变更结算模式。",
        "搜索时准备好流水号（例如 TRD_EXAMPLE_001）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "「分账记录」列出订单分账，并可打开详情对话框查看接收方。本指南仅覆盖列表、流水号筛选与详情对话框，不覆盖分账规则配置或分账 API。",
        },
        {
          type: "heading",
          text: "打开分账记录",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "在「交易」下打开「分账记录」。",
            "确认页面标题为「分账记录」，表格上方有流水号筛选。",
          ],
        },
        {
          type: "heading",
          text: "阅读分账列表",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            { field: "ID", description: "分账记录标识。" },
            { field: "流水号", description: "该分账对应的交易流水号。" },
            {
              field: "分账金额",
              description: "分账金额；次要文字可显示订单总额。",
            },
            {
              field: "分账类型",
              description: "即时分账或延时分账（以界面标签为准）。",
            },
            {
              field: "分账状态",
              description: "状态徽标（如待分账、成功、失败）。",
            },
            {
              field: "接收方数量",
              description: "成功数 / 接收方总数；失败数可能单独显示。",
            },
            { field: "创建时间", description: "分账记录创建时间。" },
          ],
        },
        {
          type: "heading",
          text: "按流水号筛选",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "在筛选栏填写流水号。",
            "提交以应用筛选。",
            "使用重置清空筛选并回到完整列表。",
            "需要时使用分页浏览。",
          ],
        },
        {
          type: "heading",
          text: "打开分账详情",
          anchor: "details",
        },
        {
          type: "steps",
          items: [
            "在行操作中选择查看，打开「分账详情」。",
            "查看基本信息（流水号、状态、类型、金额、创建时间）。",
            "在接收方明细表中查看接收方、名称、金额、比例与状态。",
            "查看完毕后关闭对话框。本页没有单独的详情 URL。",
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
              problem: "侧栏找不到「分账记录」。",
              solution:
                "该入口面向直清业务账户。请确认已选择正确账户。Help 不说明如何变更结算模式——若仍无菜单，请联系管理员。",
            },
            {
              problem: "提示暂无分账记录。",
              solution:
                "先重置流水号筛选。若仍为空，说明当前账户下尚无分账记录。",
            },
            {
              problem: "分账详情打不开或一直加载。",
              solution:
                "关闭对话框，确认仍处于登录状态后再次查看；若因网络失败可重试。",
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
  "payments/transaction-reports": {
    title: "导出交易报表",
    description:
      "在 FilixPay 商户中心「报表 → 交易报表」发现、筛选并导出交易报表行。",
    keywords: ["交易报表", "导出 CSV", "报表交易", "商户订单号报表", "流水号报表"],
    body: {
      whoFor: "需要在授权范围内查看报表式交易列表或导出 CSV 的运营人员。",
      whenToUse:
        "打开「报表 → 交易报表」按商户订单号、状态、渠道、金额或创建时间搜索，或导出 CSV 时使用本说明。",
      beforeYouStart: [
        "使用可访问「报表 → 交易报表」的账号登录。",
        "搜索时请准备商户订单号或时间范围（例如 DEMO-ORD-1001）。",
        "这是报表视图——日常订单操作仍在「交易 → 订单」。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "交易报表列出可发现的交易并支持导出 CSV。打开行可查看只读摘要与时间线，并在可用时跳转业务详情。本说明覆盖列表、筛选、导出与详情；不能替代订单管理。",
        },
        {
          type: "heading",
          text: "打开交易报表",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "打开「报表 → 交易报表」。",
            "确认页面标题为「交易报表」，并可见导出 CSV。",
          ],
        },
        {
          type: "heading",
          text: "筛选列表",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "按需填写商户订单号、状态、渠道、金额上下限与创建时间范围。",
            "搜索以应用筛选；用重置清空。",
            "分页查看商户订单号、流水号、订单类型、状态、金额、渠道与创建时间。",
          ],
        },
        {
          type: "heading",
          text: "导出并打开详情",
          anchor: "export",
        },
        {
          type: "steps",
          items: [
            "选择导出 CSV，按当前筛选范围下载 CSV 文件。",
            "打开行查看报表详情摘要与时间线。",
            "在显示时使用查看业务详情跳转到相关业务页，或停留在报表详情路径。",
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
              problem: "导出失败。",
              solution: "确认仍处于登录状态；若范围过大请缩小筛选后重试导出 CSV。",
            },
            {
              problem: "需要退款或修改订单。",
              solution:
                "请到「交易 → 订单」做业务操作，参见 /help/payments/orders。报表仅用于发现与导出。",
            },
            {
              problem: "金额与结算对不上。",
              solution:
                "请对照资金下的结算与对账说明，参见 /help/funds/reconciliation。",
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
  "payments/checkouts": {
    title: "收银台配置",
    description:
      "在 FilixPay 商户中心「收银台配置」中创建并管理跨语言聚合收银台页面。",
    keywords: [
      "收银台配置",
      "收银台",
      "聚合收银台",
      "支付配置",
      "FilixPay 收银台",
    ],
    body: {
      whoFor: "需要配置品牌化收银台并挂载支付配置、以便买家付款的运营人员。",
      whenToUse:
        "当你打开「收银台配置」添加、编辑、启用/停用或删除收银台时，使用本指南。",
      beforeYouStart: [
        "使用可访问「收银台配置」的账号登录。",
        "请先在支付通道配置下准备至少一条支付配置——见 /help/developers/payment-channels。",
        "明确将使用的收银台代码（唯一标识，例如 checkout-demo）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "收银台配置用于管理跨语言聚合收银台页面（收银台计数器）。它不是订单，不是入金里的「打开结账」，也不是自托管 filix-checkout 部署说明。演示 Logo 可使用 https://cdn.example.com/logo.png。",
        },
        {
          type: "heading",
          text: "打开收银台配置",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "登录商户中心。",
            "从侧栏打开「收银台配置」。",
            "查看列表：收银台名称（含品牌色）、代码、配置数量、状态与操作。",
          ],
        },
        {
          type: "heading",
          text: "添加配置",
          anchor: "create",
        },
        {
          type: "steps",
          items: [
            "选择「添加配置」。",
            "填写收银台代码（唯一标识）。创建后不可再改代码。",
            "填写默认显示名称：英文必填，中文与日文可选。",
            "可选填写 Logo 链接与品牌颜色。",
            "填写支持货币与买家地区（逗号分隔，* 表示全部）。",
            "在「支付配置列表」中按优先级添加已有支付配置，然后提交。",
          ],
        },
        {
          type: "heading",
          text: "编辑配置",
          anchor: "edit",
        },
        {
          type: "steps",
          items: [
            "在行上选择编辑，打开「编辑配置」。",
            "更新名称、品牌、货币、地区或支付配置列表。",
            "收银台代码保持锁定。提交以保存。",
          ],
        },
        {
          type: "heading",
          text: "状态与删除",
          anchor: "status",
        },
        {
          type: "steps",
          items: [
            "点击状态徽标可在 ACTIVE 与 INACTIVE 间切换（启用或停用）。",
            "需要移除时选择删除并确认。",
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
              field: "收银台名称 / 代码",
              description: "列表中的本地化显示名称，以及唯一的收银台代码标识。",
            },
            {
              field: "配置数量",
              description: "挂载到该收银台的支付配置条数。",
            },
            {
              field: "状态",
              description: "ACTIVE 或 INACTIVE。点击徽标可切换。",
            },
            {
              field: "支付配置列表",
              description:
                "按优先级选择的已有支付配置。若列表为空，请先在支付通道配置中创建配置。",
            },
            {
              field: "货币 / 买家地区",
              description: "逗号分隔的允许列表；* 表示全部货币或全部买家地区。",
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
              problem: "支付配置列表没有可选配置。",
              solution:
                "先打开支付通道配置并创建支付配置——见 /help/developers/payment-channels——再返回添加配置。",
            },
            {
              problem: "买家无法通过该收银台付款。",
              solution:
                "确认状态为 ACTIVE、至少挂载一条支付配置，且货币与买家地区匹配买家场景。",
            },
            {
              problem: "这和订单或入金结账是一回事吗？",
              solution:
                "不是。收银台配置定义收银台页面。订单跟踪支付——见 /help/payments/orders。入金可能打开单独的结账链接用于充值。",
            },
          ],
        },
      ],
      nextStep: {
        label: "支付通道配置",
        href: "/help/developers/payment-channels",
      },
    },
  },
};
