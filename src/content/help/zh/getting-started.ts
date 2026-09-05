import type { HelpArticleContent } from "../article-content";

export const zhGettingStarted: Record<string, HelpArticleContent> = {
  "getting-started/merchant-setup": {
    title: "完成商户入驻设置",
    description:
      "在 FilixPay 商户中心完成正式入驻：查看申请进度、继续或提交商户入驻申请，并了解审批通过后的下一步。",
    keywords: ["商户设置", "入驻", "正式入驻", "申请进度", "商户入驻申请"],
    body: {
      whoFor: "需要完成正式入驻后才能使用完整商户中心能力的试用或新商户。",
      whenToUse:
        "当你刚开始 FilixPay 设置、查看申请进度，或继续处理草稿/退回的入驻申请时，使用本指南。",
      beforeYouStart: [
        "使用具备正式入驻查看权限的账号登录 FilixPay 商户中心。",
        "准备好所选国家/地区对应的工商资料与证明文件。",
        "确定将确认的结算币种（注册后通常不可再改）。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "正式入驻是商户中心的入驻申请流程。帮助中心说明如何使用「申请进度」与「商户入驻申请」，但不会替代入驻工作流，也不会再维护一套独立激活状态机。演示联系人请使用 onboarding-ops@example.com 等虚构邮箱，不要写入真实个人数据。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「正式入驻」进入申请进度；若尚无申请，则从申请入口开始。",
            "查看当前状态、申请编号、申请类型与时间线（已提交 → 平台审核 → 凭证核验 → 已完成）。",
            "若状态为草稿或已退回，选择继续或编辑申请，进入商户入驻申请向导。",
            "按向导完成「国家与类型」「业务资料」（含证件材料），再「确认并提交」。",
            "提交后回到申请进度并刷新，直至审核结束。若为已批准或已完成，按提示退出并重新登录，使凭证生效。",
            "若被拒绝、已取消或开通失败，在界面提供「再次申请」时重新申请，或仅携带申请编号联系支持（切勿发送密码或 API 密钥）。",
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
              field: "草稿",
              description: "已开始但未提交。可继续编辑直至准备就绪。",
            },
            {
              field: "已提交 / 审核中",
              description: "等待平台审核。可查看时间线并刷新获取更新。",
            },
            {
              field: "已退回",
              description: "需要修改。编辑申请后重新提交。",
            },
            {
              field: "已批准 / 开通中 / 已完成",
              description:
                "申请已通过；开通可能仍在进行。已完成通常需要退出并重新登录。",
            },
            {
              field: "已拒绝 / 已取消 / 开通失败",
              description:
                "设置未完成。按页面提示撤回或再次申请，或联系支持。",
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
              problem: "菜单里找不到正式入驻。",
              solution:
                "正式入驻通常对试用商户升级正式可见。确认已登录正确组织；若菜单隐藏，可通过帮助中心的仪表盘链接打开申请进度。",
            },
            {
              problem: "确认并提交被拦截。",
              solution:
                "补全必填业务资料与证件，并确认结算币种。根据各步骤校验提示修正后再提交。",
            },
            {
              problem: "状态已完成但功能仍受限。",
              solution:
                "按提示退出并重新登录后再打开商户中心。若仍受限，刷新申请进度并确认开通已结束。",
            },
          ],
        },
        {
          type: "paragraph",
          text: "入驻完成后，可在「资金 → 余额」了解余额如何变动，并在「资金 → 出金」了解如何把资金转出。下一步链到余额说明；需要出金时打开 /help/funds/payouts。",
        },
      ],
      nextStep: {
        label: "了解余额",
        href: "/help/funds/balance",
      },
    },
  },
  "getting-started/payment-channel": {
    title: "配置首个支付通道",
    description:
      "在 FilixPay 商户中心添加并开通支付配置，使收单路由可以使用已启用的支付通道。",
    keywords: ["支付通道", "支付配置", "收单设置", "支付配置项", "首个通道"],
    body: {
      whoFor: "已完成或正在完成入驻、需要至少一个开通中支付通道以进行收单的商户。",
      whenToUse:
        "当你首次打开收单设置下的支付配置，或需要新增、编辑、开通通道时，使用本指南。",
      beforeYouStart: [
        "确认可访问「交易 → 收单设置 → 支付配置」。",
        "准备支付品牌提供的通道凭证（沙箱可用 sk_test_placeholder 等占位符——切勿提交真实密钥）。",
        "明确该配置适用的支付场景与子商户。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "支付配置按支付场景、子商户与机构分组展示通道。路由使用已开通（Open）的通道。请按环境选择正式或测试模式。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "进入「交易 → 收单设置 → 支付配置」。",
            "选择「添加配置」（或在已有场景卡片上「添加通道」）。",
            "按表单要求选择支付品牌、通道、场景与子商户。",
            "填写该通道凭证并保存。",
            "准备接入路由时将通道设为开通；关闭可停止路由且不必删除配置。",
            "确认目标场景卡片显示为开通（或路由生效）。",
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
              field: "支付品牌 / 通道",
              description: "你连接的支付品牌与通道产品（例如卡或钱包品牌）。",
            },
            {
              field: "支付场景",
              description: "该配置在支付配置页所属的收单场景。",
            },
            {
              field: "子商户",
              description: "组织使用业务账户时可选的子商户范围。",
            },
            {
              field: "状态",
              description:
                "如开通、关闭、申请中、已拒绝或已停用。开通的通道可被路由。",
            },
            {
              field: "正式 / 测试模式",
              description: "凭证与路由的环境切换。测试凭证勿用于生产。",
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
              problem: "无法开通通道。",
              solution:
                "确认状态不是申请中或已拒绝。补全必填凭证并保存，再使用开通/关闭控件。若仍显示通道已停止，请刷新页面。",
            },
            {
              problem: "下单提示无可用通道。",
              solution:
                "确认订单所用场景与子商户下至少有一个开通配置，并核对该订单环境是正式还是测试。",
            },
          ],
        },
      ],
      nextStep: {
        label: "创建首个商品",
        href: "/help/getting-started/create-product",
      },
    },
  },
  "getting-started/create-product": {
    title: "创建首个商品",
    description:
      "在 FilixPay 商户中心创建首个商务目录草稿：填写标题、SKU、价格、库存与类目。",
    keywords: ["首个商品", "创建商品", "商务入门", "目录草稿", "快速开始"],
    body: {
      whoFor: "完成入驻与支付配置后，希望录入首个目录商品的新商户。",
      whenToUse:
        "当你准备从商务打开「创建商品」并保存草稿（或创建并发布）时，使用本指南。",
      beforeYouStart: [
        "确认商户已开通商务商品能力。",
        "准备唯一示例 SKU（如 DEMO-MUG-001）与标题（如「示例陶瓷杯」）。",
        "明确售价与初始库存。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "快速开始中的「创建商品」是进入商务创建流程的入门入口。完整字段说明与排障见商务指南「如何创建商品」——日常目录维护请使用该指南。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「商务 → 商品」，选择「创建商品」（或使用指向 products/new 的仪表盘链接）。",
            "填写标题、可选描述与图片、SKU、价格、库存与类目。",
            "选择保存为草稿；若编辑器提供发布模式，也可创建并发布。",
            "确认创建后进入商品详情页。",
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
              field: "标题 / SKU",
              description: "必填展示名称与目录中唯一的库存单位。",
            },
            {
              field: "价格 / 库存",
              description: "必填售价与可用数量（未填库存时默认为 0）。",
            },
            {
              field: "类目",
              description: "必填类目，用于组织与筛选。",
            },
            {
              field: "发布模式",
              description:
                "创建时可选择草稿或创建后发布（若界面提供）。首次演练建议先存草稿。",
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
              problem: "表单无法提交。",
              solution:
                "补全必填的标题、SKU、价格与类目。完整字段列表见 /help/commerce/products/create。",
            },
            {
              problem: "首次创建后需要更详细说明。",
              solution:
                "打开商务创建指南查看步骤、字段与问题。后续编辑在商品详情页完成——帮助中心没有单独的 products/edit 条目。",
            },
          ],
        },
      ],
      nextStep: {
        label: "发布首个商品",
        href: "/help/getting-started/publish-product",
      },
    },
  },
  "getting-started/publish-product": {
    title: "发布首个商品",
    description:
      "在商品详情页发布首个商务草稿，等待同步完成，并确认商品已上线。",
    keywords: ["发布商品", "首次发布", "商务激活", "商品同步", "快速开始"],
    body: {
      whoFor: "已创建草稿商品、希望通过 FilixPay 商务对外销售的商户。",
      whenToUse:
        "创建完成后，当详情页显示「发布」且必填字段正确时，使用本指南。",
      beforeYouStart: [
        "打开草稿商品，确认标题、SKU、价格、库存与类目。",
        "发布前先消除校验错误。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "发布在商品详情页通过发布操作完成。商务激活可能与商户中心并行——帮助中心只说明发布任务，不另建一套激活状态机。日常发布、取消发布与重试同步请使用商务发布指南。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「商务 → 商品」，选中草稿（例如「示例陶瓷杯」/ DEMO-MUG-001）。",
            "在详情页复核字段并保存最后修改。",
            "选择「发布」并在对话框中确认。",
            "等待状态离开「同步中」；失败时使用「重试同步」。",
            "确认状态为「已发布」后再对该目录商品接单。",
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
              field: "草稿",
              description: "已保存但未上线。准备就绪后发布。",
            },
            {
              field: "同步中",
              description: "集成更新进行中——完成前请勿再次发布或取消发布。",
            },
            {
              field: "已发布",
              description: "已对消费该目录的商务渠道上线。",
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
              problem: "发布按钮不可用。",
              solution:
                "确认商品尚未发布且未在同步中。同步结束后刷新。更多情形见 /help/commerce/products/publish。",
            },
            {
              problem: "发布后如何编辑？",
              solution:
                "从商品列表打开详情页编辑。帮助中心不提供单独的编辑地址。",
            },
          ],
        },
      ],
      nextStep: {
        label: "了解余额如何运作",
        href: "/help/funds/balance",
      },
    },
  },
};
