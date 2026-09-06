import type { HelpArticleContent } from "../article-content";

export const zhEnterprise: Record<string, HelpArticleContent> = {
  "enterprise/governance": {
    title: "使用集团门户进行集团治理",
    description:
      "进入 FilixPay 集团门户：选择集团、查看治理概览、管理组织目录与集团成员，并阅读集团审计事件。",
    keywords: [
      "集团门户",
      "集团治理",
      "组织目录",
      "集团成员",
      "集团审计",
      "FilixPay 集团",
    ],
    body: {
      whoFor:
        "需要在 FilixPay 集团下治理组织与成员关系的集团 ADMIN / VIEWER——不是日常商户支付运营。",
      whenToUse:
        "从管理中心登录页进入「集团管理中心」，或需要组织目录、集团成员、集团审计时，使用本指南。",
      beforeYouStart: [
        "确认当前身份至少有一个可发现的集团成员资格。",
        "明确自己是 ADMIN（可创建组织、管理成员）还是 VIEWER（以只读为主）。",
        "演示联系人可使用 governance-admin@example.com——Help 示例不要粘贴真实生产邮箱。",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "集团门户与商户运营中心分离。它覆盖集团选择、治理汇总、组织目录、集团成员（ADMIN / VIEWER）与集团审计。它不是「账户与设置 → 组织」下的组织 RBAC，不是收单子商户，也不是资金或结算看板。",
        },
        {
          type: "heading",
          text: "打开集团门户",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "打开 FilixPay 管理中心登录页。",
            "选择「进入集团中心」（集团管理中心）。",
            "登录后使用集团门户侧栏：概览、组织、成员、审计。",
          ],
        },
        {
          type: "heading",
          text: "选择集团",
          anchor: "pick",
        },
        {
          type: "steps",
          items: [
            "若仅隶属一个集团，门户可能自动打开该集团。",
            "否则打开「选择集团」，查看名称、集团编号与身份类型，再打开。",
            "之后可在侧栏集团切换器中切换集团。",
          ],
        },
        {
          type: "heading",
          text: "集团概览",
          anchor: "dashboard",
        },
        {
          type: "paragraph",
          text: "集团概览展示当前集团的治理汇总：活跃/已暂停组织数、商户数、近期组织与商户创建趋势，以及按商户数排序的组织。计数仅为治理元数据——不是钱包、支付或结算数据。需要时可导出 CSV。",
        },
        {
          type: "heading",
          text: "组织目录",
          anchor: "organizations",
        },
        {
          type: "steps",
          items: [
            "打开「组织」查看本集团下的组织（名称、编号、状态）。",
            "目录访问本身不等于商户业务权限。",
            "ADMIN 可创建组织（名称必填；法定名称与初始 OWNER 邮箱可选——OWNER 须至少登录过商户门户一次）。",
            "ADMIN 可暂停（须填原因）或激活组织。",
            "「切换到商户门户」在你具备该组织有效成员资格时可打开商户中心；已暂停组织不可切换；切换不会记录商户登录。",
          ],
        },
        {
          type: "heading",
          text: "集团成员",
          anchor: "members",
        },
        {
          type: "steps",
          items: [
            "打开「成员」管理集团治理成员——不是组织内团队/角色 RBAC。",
            "ADMIN 可通过身份 ID 与类型 ADMIN / VIEWER 添加成员。",
            "按权限更改类型、暂停或移除。不能移除或降级最后一个活跃集团 ADMIN。",
          ],
        },
        {
          type: "heading",
          text: "集团审计",
          anchor: "audit",
        },
        {
          type: "paragraph",
          text: "集团审计列出本集团治理事件（组织创建/暂停/激活；成员添加/暂停/移除/类型变更）。可按组织编号与操作筛选后搜索或重置。此处不展示运营平台审计。",
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
              problem: "没有集团成员资格。",
              solution:
                "请联系平台运营。当前身份没有可发现集团时，门户会提示无集团成员资格。",
            },
            {
              problem: "无法切换到商户门户。",
              solution:
                "你需要该组织的有效组织成员资格，且组织不能处于已暂停状态。",
            },
            {
              problem: "这和商户中心的「组织」是一回事吗？",
              solution:
                "不是。集团门户治理集团目录与集团 ADMIN/VIEWER；业务账户、组织邀请、团队与角色在商户中心「组织」——见 /help/merchant/organization。",
            },
            {
              problem: "无法移除最后一个 ADMIN。",
              solution:
                "至少保留一名活跃集团 ADMIN。先将其他成员提升为 ADMIN，再移除或降级原管理员。",
            },
          ],
        },
      ],
      nextStep: {
        label: "管理组织、成员与角色",
        href: "/help/merchant/organization",
      },
    },
  },
};
