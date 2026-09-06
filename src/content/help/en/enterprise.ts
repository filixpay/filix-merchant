import type { HelpArticleContent } from "../article-content";

export const enEnterprise: Record<string, HelpArticleContent> = {
  "enterprise/governance": {
    title: "Use Enterprise Portal for group governance",
    description:
      "Enter FilixPay Enterprise Portal to select an enterprise, review governance dashboards, manage the organization directory and enterprise members, and read enterprise audit events.",
    keywords: [
      "enterprise portal",
      "group governance",
      "organization directory",
      "enterprise members",
      "enterprise audit",
      "FilixPay enterprise",
    ],
    body: {
      whoFor:
        "Enterprise ADMIN and VIEWER operators who govern organizations and memberships across a FilixPay enterprise — not day-to-day merchant payment ops.",
      whenToUse:
        "Use this when you open Group Management Center / Enterprise Portal from the management login chooser, or when you need the organization directory, enterprise members, or enterprise audit.",
      beforeYouStart: [
        "Confirm your identity has at least one discoverable enterprise membership.",
        "Know whether you are ADMIN (can create organizations and manage members) or VIEWER (read-mostly).",
        "Demo contacts may use governance-admin@example.com — never paste real production emails into Help examples.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Enterprise Portal (集团门户) is separate from Merchant Center. It covers enterprise selection, governance aggregates, the organization directory, enterprise members (ADMIN / VIEWER), and enterprise audit. It is not Organization RBAC under Account & Settings → Organization, not Acquiring Sub-Merchants, and not a funds or settlement dashboard.",
        },
        {
          type: "heading",
          text: "Open Enterprise Portal",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Open FilixPay Management Center login.",
            "Choose Enter Group Center / 进入集团中心 (Group Management Center).",
            "After sign-in, use the Enterprise Portal sidebar: Dashboard, Organizations, Members, Audit.",
          ],
        },
        {
          type: "heading",
          text: "Select Enterprise",
          anchor: "pick",
        },
        {
          type: "steps",
          items: [
            "If you belong to only one enterprise, the portal may open it automatically.",
            "Otherwise open Select Enterprise, review name, enterprise code, and kind, then Open.",
            "You can switch enterprises later from the sidebar enterprise switcher.",
          ],
        },
        {
          type: "heading",
          text: "Enterprise Dashboard",
          anchor: "dashboard",
        },
        {
          type: "paragraph",
          text: "Enterprise Dashboard shows governance aggregates for the selected enterprise: active and suspended organization counts, merchant count, recent organization/merchant creation trends, and top organizations by merchant count. Counts reflect governance metadata only — not wallet, payment, or settlement data. Use Export CSV when you need a file download of the organization export.",
        },
        {
          type: "heading",
          text: "Organization Directory",
          anchor: "organizations",
        },
        {
          type: "steps",
          items: [
            "Open Organizations to see organizations attached to this enterprise (Name, Code, Status).",
            "Directory access does not grant merchant operations by itself.",
            "ADMIN can Create Organization (Name required; optional Legal name and Initial OWNER email — the owner must have signed in to the merchant portal at least once).",
            "ADMIN can Suspend (reason required) or Activate an organization.",
            "Switch to Merchant Portal opens Merchant Center for that organization when you have active organization membership. Suspended organizations cannot switch; switching does not record a merchant login.",
          ],
        },
        {
          type: "heading",
          text: "Enterprise Members",
          anchor: "members",
        },
        {
          type: "steps",
          items: [
            "Open Members to manage enterprise governance membership — not organization teams/roles RBAC.",
            "ADMIN can Add Member with Identity ID and Kind ADMIN or VIEWER.",
            "Change Kind, Suspend, or Remove as allowed. You cannot remove or demote the last active enterprise ADMIN.",
          ],
        },
        {
          type: "heading",
          text: "Enterprise Audit",
          anchor: "audit",
        },
        {
          type: "paragraph",
          text: "Enterprise Audit lists governance events for this enterprise (organization created / suspended / activated; member added / suspended / removed / kind changed). Filter by organization code and action, then Search or Reset. Ops platform audits are not shown here.",
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
              problem: "No enterprise memberships.",
              solution:
                "Contact platform operations. The portal shows No enterprise memberships when your identity has no discoverable enterprises.",
            },
            {
              problem: "Switch to Merchant Portal fails.",
              solution:
                "You need active organization membership for that organization, and the organization must not be suspended.",
            },
            {
              problem: "Is this the same as Organization under Merchant Center?",
              solution:
                "No. Enterprise Portal governs the enterprise directory and enterprise ADMIN/VIEWER membership. Business accounts, org invites, teams, and roles live under Merchant Center Organization — see /help/merchant/organization.",
            },
            {
              problem: "Cannot remove the last ADMIN.",
              solution:
                "At least one active enterprise ADMIN must remain. Promote another member to ADMIN before removing or demoting the last admin.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Manage organization, members, and roles",
        href: "/help/merchant/organization",
      },
    },
  },
};
