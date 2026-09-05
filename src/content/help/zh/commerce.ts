import type { HelpArticleContent } from "../article-content";

export const zhCommerce: Record<string, HelpArticleContent> = {
  "commerce/products": {
    title: "在商户中心管理商品",
    description:
      "在 FilixPay 商户中心查看、筛选并打开商品，以便创建草稿、发布目录商品或更新已有商品。",
    keywords: ["商品", "商务", "目录", "商户中心", "商品列表"],
    body: {
      whoFor: "通过 FilixPay 商务功能销售、需要在商户中心管理目录商品的商户。",
      whenToUse:
        "当你需要了解商品列表、状态筛选，以及如何进入创建或发布流程时，使用本指南。",
      beforeYouStart: [
        "使用具备查看商务商品权限的账号登录 FilixPay 商户中心。",
        "确认你的组织已开通商务（Commerce）能力。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "商品页展示本商户的目录商品。你可按标题或 SKU 搜索，按类目与状态（例如草稿、已发布、已停用）筛选，并打开商品详情以编辑字段或执行发布操作。演示环境请使用类似 DEMO-MUG-001 的虚构 SKU，不要使用真实客户标识。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "在商户中心打开「商务 → 商品」。",
            "使用搜索或状态筛选定位目标商品。",
            "点击「创建商品」开始新草稿，或打开已有行进入详情。",
            "在详情页按需更新字段，准备就绪后发布或取消发布。",
          ],
        },
        {
          type: "heading",
          text: "列表关键字段",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "标题",
              description: "列表与详情页展示的商品名称。",
            },
            {
              field: "SKU",
              description: "用于匹配与搜索的商户 SKU（例如 DEMO-MUG-001）。",
            },
            {
              field: "状态",
              description: "生命周期状态，如草稿、已发布、已停用或同步中。",
            },
            {
              field: "类目",
              description: "可选类目，用于筛选与分组。",
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
              problem: "刚创建的商品找不到。",
              solution:
                "清空筛选（状态设为全部），刷新列表，并用你输入的 SKU（例如 DEMO-MUG-001）搜索。",
            },
            {
              problem: "如何编辑已有商品？",
              solution:
                "从商品列表打开该商品。编辑在商品详情页完成——帮助中心不提供单独的 /edit 地址。",
            },
          ],
        },
        {
          type: "paragraph",
          text: "提示：发布前可将草稿标题设为虚构示例，例如「示例陶瓷杯」。",
        },
      ],
      nextStep: {
        label: "创建商品",
        href: "/help/commerce/products/create",
      },
    },
  },
  "commerce/products/create": {
    title: "如何创建商品",
    description:
      "在 FilixPay 商户中心创建商务商品草稿：填写标题、SKU、价格、库存与类目，然后保存或发布。",
    keywords: ["创建商品", "新建商品", "商务目录", "SKU", "草稿商品"],
    body: {
      whoFor: "需要在发布前新增目录商品的运营人员。",
      whenToUse: "当你准备在「创建商品」页填写商品信息时，使用本指南。",
      beforeYouStart: [
        "准备好唯一 SKU（例如 DEMO-MUG-001）。",
        "确认售价与初始库存。",
        "可选：准备商品图片并选定类目。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "创建商品会打开商品编辑器。必填项包括标题、SKU、价格与类目。你可以保存为草稿，或在创建后立即发布。沙箱环境请仅使用虚构示例，例如标题「示例陶瓷杯」；外部备注中的联系方式请使用 catalog-ops@example.com 这类占位邮箱。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "进入「商务 → 商品」，选择「创建商品」。",
            "填写清晰标题（例如「示例陶瓷杯」）。",
            "可选填写描述并上传图片。",
            "填写 SKU、价格与库存，选择类目（若有商品类型也一并选择）。",
            "选择保存为草稿；若表单提供发布模式，也可创建并立即发布。",
            "创建完成后进入商品详情页，可继续编辑或稍后再发布。",
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
              field: "标题",
              description: "必填。面向顾客的商品名称（表单有最大长度限制）。",
            },
            {
              field: "描述",
              description: "可选的商品说明长文本。",
            },
            {
              field: "图片",
              description: "可选的媒体上传，随商品展示。",
            },
            {
              field: "SKU",
              description: "必填。目录内唯一的库存单位编码。",
            },
            {
              field: "价格",
              description: "必填。以商务币种计价的售价。",
            },
            {
              field: "库存",
              description: "可用数量；未填写时默认为 0。",
            },
            {
              field: "类目",
              description: "必填。用于组织与筛选。",
            },
            {
              field: "商品类型",
              description: "可选。当商户已配置商品类型时显示。",
            },
            {
              field: "发布模式",
              description:
                "创建时若编辑器提供该控件，可选择草稿或创建后发布。",
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
                "检查必填项：标题、SKU、价格与类目，并根据字段下方提示修正。",
            },
            {
              problem: "保存草稿后还要改内容。",
              solution:
                "从商品列表打开该商品，在详情页编辑。帮助中心没有单独的编辑 slug——编辑属于商品详情流程的一部分。",
            },
          ],
        },
      ],
      nextStep: {
        label: "发布商品",
        href: "/help/commerce/products/publish",
      },
    },
  },
  "commerce/products/publish": {
    title: "如何发布商品",
    description:
      "在商品详情页将草稿商务商品发布上线，关注同步状态，并在需要时取消发布或重试同步。",
    keywords: ["发布商品", "取消发布", "商品同步", "商务发布", "草稿转已发布"],
    body: {
      whoFor:
        "已有草稿（或未上线）商品、希望通过 FilixPay 商务对外售卖的商户。",
      whenToUse:
        "创建商品之后，或在商品准备上线/需要下线时，使用本指南。",
      beforeYouStart: [
        "创建或打开商品，确认标题、SKU、价格、库存与类目正确。",
        "发布前先消除详情页上的校验错误。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "发布操作在商品详情页的发布操作区完成。当对接同步进行中时，发布与取消发布按钮会禁用。若同步失败，可在可用时重试。示例：仅在价格与库存核对无误后，再发布「示例陶瓷杯」（SKU DEMO-MUG-001）。",
        },
        {
          type: "heading",
          text: "操作步骤",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "打开「商务 → 商品」，选择要发布的商品。",
            "在详情页核对字段并保存最后修改。",
            "点击「发布」并在对话框中确认。",
            "等待状态离开「同步中」。若失败，查看错误信息并在出现「重试同步」时使用。",
            "之后如需下线，可在同一操作区选择「取消发布」。",
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
              description: "已保存但未上线，就绪后可发布。",
            },
            {
              field: "已发布",
              description: "已对消费该目录的商务渠道上线。",
            },
            {
              field: "同步中",
              description: "对接更新进行中——请等待后再发布或取消发布。",
            },
            {
              field: "已停用",
              description: "当前不可用；重新发布前请查看状态徽章。",
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
                "确认商品尚未发布，且对接同步未在进行中。同步结束后刷新详情页再试。",
            },
            {
              problem: "发布失败或一直停在同步中。",
              solution:
                "等待同步超时窗口结束后，若出现「重试同步」请点击。仍失败时核对必填字段，再从详情页重试。",
            },
            {
              problem: "发布后还要改内容。",
              solution:
                "从商品列表打开该商品，在详情页编辑；如流程要求可再次发布。帮助中心不提供单独的编辑 URL。",
            },
          ],
        },
      ],
      nextStep: {
        label: "返回管理商品",
        href: "/help/commerce/products",
      },
    },
  },
};
