import type { HelpArticleContent } from "../article-content";

export const enMerchant: Record<string, HelpArticleContent> = {
  "merchant/organization": {
    title: "Manage organization, members, and roles",
    description:
      "Use Organization in FilixPay Merchant Center to manage business accounts, invite members, teams, and custom roles under Account & Settings.",
    keywords: [
      "organization management",
      "business accounts",
      "invite members",
      "teams roles",
      "merchant organization",
    ],
    body: {
      whoFor:
        "Owners and admins who manage which business accounts, members, teams, and roles belong to the organization.",
      whenToUse:
        "Use this when you open Account & Settings → Organization to create a business account, invite a member, or edit teams and roles.",
      beforeYouStart: [
        "Sign in with organization admin access.",
        "Have the invitee email ready (for example ops@example.com).",
        "Know whether a new business account should use PLATFORM or DIRECT settlement mode.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Organization has four tabs: Business Accounts, Members, Teams, and Roles. Business Accounts here are organization-scoped merchants — not the same as Acquiring Settings → Sub-Merchants. This guide covers the Organization page only.",
        },
        {
          type: "heading",
          text: "Open Organization",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Account & Settings → Organization.",
            "Confirm the page title Organization and the four tabs.",
          ],
        },
        {
          type: "heading",
          text: "Business Accounts",
          anchor: "business-accounts",
        },
        {
          type: "steps",
          items: [
            "Open the Business Accounts tab.",
            "Review name, code, settlement mode, and status.",
            "Create a business account with name and settlement mode (PLATFORM or DIRECT) when needed.",
            "Switch account or open Merchant Profile for a row when shown.",
          ],
        },
        {
          type: "heading",
          text: "Members, Teams, and Roles",
          anchor: "members-teams-roles",
        },
        {
          type: "steps",
          items: [
            "On Members, invite by email with an organization role (and optional team + team role), then search or edit/remove members as allowed. Owner rows are protected.",
            "On Teams, create or edit teams, archive when needed, and manage team members (OWNER / MANAGER / LEAD / MEMBER).",
            "On Roles, create or edit custom roles, set the permissions matrix and merchant scope, and delete unused custom roles when allowed.",
          ],
        },
        {
          type: "heading",
          text: "Common issues",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "Is a Business Account the same as a Sub-Merchant?",
              solution:
                "No. Business Accounts live under Organization. Sub-Merchants are acquiring collection entities under Transactions → Acquiring Settings — see /help/merchant/locations.",
            },
            {
              problem: "I cannot remove the Owner.",
              solution:
                "Owner membership is protected on this page. Transfer ownership through your admin process outside Help if required.",
            },
            {
              problem: "Where do I change legal name or contact email?",
              solution:
                "Use Merchant Profile / Contact / Profile Changes — see /help/account/maintenance.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Locations and sub-merchants",
        href: "/help/merchant/locations",
      },
    },
  },
  "merchant/locations": {
    title: "Set up sub-merchants and locations",
    description:
      "Create acquiring sub-merchants and operating locations under Transactions → Acquiring Settings in FilixPay Merchant Center.",
    keywords: [
      "operating locations",
      "sub-merchants",
      "acquiring settings",
      "location QR",
      "settlement alias",
    ],
    body: {
      whoFor:
        "Operators who configure collection entities (sub-merchants) and their operating locations for acquiring.",
      whenToUse:
        "Use this when you open Sub-Merchants or Locations under Acquiring Settings to add an entity, attach a store location, or show a location QR / anti-fraud code.",
      beforeYouStart: [
        "Sign in with access to Transactions → Acquiring Settings.",
        "Create the Sub-Merchant before the Location — location create requires a subMerchantId.",
        "Have location contact details ready (use fictional samples such as store@example.com or 13800138000 in tests).",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Acquiring setup uses two pages. Sub-Merchants defines collection entities. Locations attaches operating places to a sub-merchant, with optional QR / anti-fraud code. This is separate from Organization Business Accounts.",
        },
        {
          type: "heading",
          text: "What / Where / When",
          anchor: "map",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Sub-Merchants",
              description:
                "Open Transactions → Acquiring Settings → Sub-Merchants to add or edit collection entities (name, settlement alias, status).",
            },
            {
              field: "Locations",
              description:
                "Open Transactions → Acquiring Settings → Locations to add stores linked to a sub-merchant, set default, and open QR codes.",
            },
          ],
        },
        {
          type: "heading",
          text: "Manage Sub-Merchants",
          anchor: "sub-merchants",
        },
        {
          type: "steps",
          items: [
            "Open Sub-Merchant Management.",
            "Choose Add to create a sub-merchant with name and settlement alias.",
            "Edit or Delete from the table when needed.",
            "Confirm status and created time on the list.",
          ],
        },
        {
          type: "heading",
          text: "Manage Locations",
          anchor: "locations",
        },
        {
          type: "steps",
          items: [
            "Open Operating Locations.",
            "Choose Add Location. Select Sub-Merchant, then enter name, address, country, and contact phones/emails as required.",
            "Edit a row to change status (Active / Inactive) or set Default.",
            "Use the QR / anti-fraud action when you need the location code.",
          ],
        },
        {
          type: "heading",
          text: "Common issues",
          anchor: "common-issues",
        },
        {
          type: "issues",
          items: [
            {
              problem: "I cannot create a location.",
              solution:
                "Create at least one Sub-Merchant first, then reopen Add Location and select it.",
            },
            {
              problem: "I confused this with Organization Business Accounts.",
              solution:
                "Business Accounts are under Account & Settings → Organization — see /help/merchant/organization.",
            },
            {
              problem: "Where do I configure payment channels?",
              solution:
                "Use Payment Configs / Developer channel setup — see /help/developers/payment-channels.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Manage orders",
        href: "/help/payments/orders",
      },
    },
  },
};
