import type { HelpArticleContent } from "../article-content";

export const enAccount: Record<string, HelpArticleContent> = {
  "account/notifications": {
    title: "Notifications and tasks",
    description:
      "Open Notifications & Tasks in FilixPay Merchant Center to read platform messages, mark them read, and process open action tasks.",
    keywords: [
      "notifications",
      "tasks",
      "mark all as read",
      "unread messages",
      "action center",
    ],
    body: {
      whoFor:
        "Operators who need to clear platform messages or complete items that need action in Merchant Center.",
      whenToUse:
        "Use this when you open Notifications & Tasks from the top-level menu, or when a badge shows unread messages or open tasks.",
      beforeYouStart: [
        "Sign in to Merchant Center.",
        "Know whether you need the Notifications tab or the Tasks tab (?tab=notifications or ?tab=tasks).",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Notifications & Tasks is a single page with two tabs. Notifications lists platform messages you can mark read. Tasks lists open or completed items that deep-link to the work page. This guide covers the center only — not the notification banner widget, and not each destination workflow.",
        },
        {
          type: "heading",
          text: "Open Notifications & Tasks",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Notifications & Tasks from the top-level menu.",
            "Confirm the page title Notifications & Tasks and the Notifications / Tasks tabs.",
          ],
        },
        {
          type: "heading",
          text: "Work with notifications",
          anchor: "notifications",
        },
        {
          type: "steps",
          items: [
            "Stay on the Notifications tab (or open ?tab=notifications).",
            "Filter All or Unread. Unread may show a badge count.",
            "Choose Mark all as read when you want every message marked read.",
            "Open a row to mark it read and follow its action path when present.",
          ],
        },
        {
          type: "heading",
          text: "Work with tasks",
          anchor: "tasks",
        },
        {
          type: "steps",
          items: [
            "Switch to the Tasks tab (?tab=tasks).",
            "Filter Open tasks or Completed.",
            "Review priority, title, Reference, Details, and status or overdue time.",
            "Use Process or Review on a row to open the related Merchant Center page.",
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
              problem: "Mark all as read is missing.",
              solution:
                "That action appears on the Notifications tab only. Switch tabs if you are on Tasks.",
            },
            {
              problem: "A task opens another page instead of completing here.",
              solution:
                "Tasks deep-link to the work surface (for example orders or reviews). Complete the work there, then return to this list.",
            },
            {
              problem: "Is this the same as webhook delivery?",
              solution:
                "No. This inbox is for Merchant Center operators. API webhook delivery is under Developer Center — see /help/developers/webhooks.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Audit Logs",
        href: "/help/account/audit-logs",
      },
    },
  },
  "account/audit-logs": {
    title: "Read audit logs",
    description:
      "Search the read-only Audit Logs trail for security-sensitive actions on your FilixPay merchant account.",
    keywords: [
      "audit logs",
      "security audit trail",
      "who changed",
      "action type",
      "access denied",
    ],
    body: {
      whoFor:
        "Operators and admins who need to see who performed security-sensitive actions and whether they succeeded.",
      whenToUse:
        "Use this when you open Account & Settings → Security Settings → Audit Logs to investigate a login, API key, webhook, role, or coverage change.",
      beforeYouStart: [
        "Sign in with access to Audit Logs.",
        "Have an approximate time window and, when possible, the action type you care about (for example apikey.rotate).",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Audit Logs is a read-only trail. Filter by date range, action type, and result, then expand a row for reason and request identifiers. This guide covers the list and filters only. It does not document how to perform the underlying actions.",
        },
        {
          type: "heading",
          text: "Open Audit Logs",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Account & Settings → Security Settings → Audit Logs.",
            "Confirm the page title Audit Logs and the filter bar.",
          ],
        },
        {
          type: "heading",
          text: "Filter and read records",
          anchor: "search",
        },
        {
          type: "steps",
          items: [
            "Set Date range, Action type, and Result (Success, Failure, or Denied) as needed.",
            "Search to apply filters. Use Reset to clear them.",
            "Read Time, Actor, Action, Resource (type / id), Result, and Link when shown.",
            "Expand a row for Reason, Event ID, Request ID, Trace ID, and metadata when present.",
          ],
        },
        {
          type: "heading",
          text: "Action types you can filter",
          anchor: "actions",
        },
        {
          type: "paragraph",
          text: "The Action type filter lists P0 actions such as auth.login, auth.logout, auth.password.change, MFA enable/disable, API key create/rotate/delete, webhook create/update/delete/replay, merchant.config.update, coverage enable/disable/update, risk.review approve/reject/assign, role grant/revoke, permission.update, and operator create/update/disable. Other action types may appear in results but are not listed in this filter.",
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
              problem: "I cannot edit or delete a log row.",
              solution:
                "Audit Logs is read-only. Use the Link or expand detail to investigate, then fix the issue on the related settings page.",
            },
            {
              problem: "The action I expect is missing from the filter.",
              solution:
                "Widen the date range and leave Action type empty, or confirm the change actually happened under this merchant account.",
            },
            {
              problem: "Where do I manage API keys or webhooks?",
              solution:
                "Use Developer Center for those settings — see /help/developers/developer-center and /help/developers/webhooks. Audit Logs only records that they changed.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Developer Center",
        href: "/help/developers/developer-center",
      },
    },
  },
  "account/maintenance": {
    title: "Merchant profile, contact, and profile changes",
    description:
      "View merchant profile, update contact information, and submit legal or bank profile change requests under Account & Settings in FilixPay Merchant Center.",
    keywords: [
      "merchant profile",
      "profile changes",
      "contact information",
      "legal info change",
      "bank account change request",
    ],
    body: {
      whoFor:
        "Active merchants who need to review identity data, update emails or phones, or request legal or settlement bank changes.",
      whenToUse:
        "Use this when you open Merchant Profile, Contact Info, or Profile Changes under Account & Settings.",
      beforeYouStart: [
        "Sign in with an ACTIVE merchant that can see maintenance menus (trial merchants may see Formal Onboarding instead of profile change).",
        "For bank settlement updates, know whether you need Profile Changes (LEGAL_INFO / BANK_ACCOUNT) or Money → External accounts for payout destinations.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Account maintenance spans three pages. Merchant Profile is read-only identity. Contact Info edits notification/support emails and phones. Profile Changes is the approval workflow for legal information or settlement bank account requests, including a detail page for drafts and submissions. This guide maps all three. It does not dump every dynamic form field.",
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
              field: "Merchant Profile",
              description:
                "Open Account & Settings → Merchant Profile to view identity, entity credentials, and masked contact/bank pointers.",
            },
            {
              field: "Contact Info",
              description:
                "Open Account & Settings → Contact Info to update notification email, support email, or phone.",
            },
            {
              field: "Profile Changes",
              description:
                "Open Account & Settings → Profile Changes to create LEGAL_INFO or BANK_ACCOUNT requests and track draft, submitted, and returned statuses.",
            },
          ],
        },
        {
          type: "heading",
          text: "Read Merchant Profile",
          anchor: "profile",
        },
        {
          type: "steps",
          items: [
            "Open Account & Settings → Merchant Profile.",
            "Review identity fields (legal name, display name, type/tier, settlement mode, Merchant ID, Customer No., status).",
            "Review entity credentials (registration country, account opening status, masked ID, created/updated times).",
            "Use Update contact or Request profile change when shown. Trial merchants may see Start formal onboarding instead.",
            "Use Refresh if the page looks stale.",
          ],
        },
        {
          type: "heading",
          text: "Update Contact Info",
          anchor: "contact",
        },
        {
          type: "steps",
          items: [
            "Open Account & Settings → Contact Info.",
            "Review Notification email, Support email, and Phone overview.",
            "Choose the contact type, enter the new value (phone may require a country prefix), then Update contact.",
          ],
        },
        {
          type: "heading",
          text: "Create and track Profile Changes",
          anchor: "changes",
        },
        {
          type: "steps",
          items: [
            "Open Account & Settings → Profile Changes.",
            "Filter by change type (Legal info or Bank account) and status if needed, then Search.",
            "Choose New change, pick the type (and registration country for legal info), then continue to the detail form.",
            "On a DRAFT or RETURNED request, Continue editing, Save draft, Submit for review, or Delete/Cancel as shown.",
            "Open View details for submitted requests to read the timeline and returned-for-updates alerts.",
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
              problem: "I cannot edit legal name on Merchant Profile.",
              solution:
                "Profile is read-only. Use Profile Changes for legal or bank request workflows, and Contact Info for emails/phones.",
            },
            {
              problem: "Is bank change the same as External accounts?",
              solution:
                "Profile Changes BANK_ACCOUNT updates settlement bank on the merchant profile workflow. Payout destinations are managed under Money → External accounts — see /help/funds/external-accounts.",
            },
            {
              problem: "Maintenance menus are missing.",
              solution:
                "Merchant Profile / Changes / Contact are shown for ACTIVE merchants. Confirm account status or complete onboarding first — see /help/getting-started/merchant-setup.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Close Account",
        href: "/help/account/close-account",
      },
    },
  },
  "account/close-account": {
    title: "Close a merchant account",
    description:
      "Submit a close-account request under Account & Settings → Close Account in FilixPay Merchant Center, then track draft, review, and decision status.",
    keywords: [
      "close account",
      "deactivate merchant",
      "account closure request",
      "lifecycle close",
      "cancel close request",
    ],
    body: {
      whoFor:
        "Merchants who intend to permanently close the merchant account after settling balances and open work.",
      whenToUse:
        "Use this when you open Account & Settings → Close Account to save a draft, submit for platform review, or cancel a pending request.",
      beforeYouStart: [
        "Export bills and history you still need — closure is not reversible after approval.",
        "Confirm there is no pending settlement balance and no in-flight orders, refunds, or disputes.",
        "Expect the Close Account page labels to appear in Chinese in the current Merchant Center UI; the steps below name the same controls in English.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Close Account lets you create a closure request with a reason, save a draft, submit for platform review (typically 1–3 business days), and manage request history. Approved closure cannot be undone. This guide covers that page only.",
        },
        {
          type: "heading",
          text: "Open Close Account",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Account & Settings → Close Account (menu may be limited to ACTIVE, SUSPENDED, or RISK_FROZEN accounts).",
            "Read the warning notice about irreversibility, balances, and review time.",
          ],
        },
        {
          type: "heading",
          text: "Create a request",
          anchor: "create",
        },
        {
          type: "steps",
          items: [
            "Under New close request, choose a close reason: No longer operating, Business closed, Switch provider, or Other.",
            "Optionally enter a remark (up to 500 characters).",
            "Choose Save draft to keep a DRAFT row, or Submit for review to create and submit in one confirm step.",
            "Confirm the danger dialog before submitting — closure after approval cannot be restored.",
          ],
        },
        {
          type: "heading",
          text: "Manage request history",
          anchor: "history",
        },
        {
          type: "steps",
          items: [
            "In Request history, review status: Draft, Submitted (in review), Approved, Rejected, or Cancelled.",
            "On a Draft row, Submit to send it for review.",
            "On a Draft or Submitted row, Cancel to withdraw the request when the UI allows.",
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
              problem: "Submit is blocked or review is rejected.",
              solution:
                "Settle balances and finish open orders, refunds, or disputes, then resubmit or create a new request. Check funds under /help/funds/balance.",
            },
            {
              problem: "I only need to update profile data, not close.",
              solution:
                "Use Merchant Profile / Contact / Profile Changes instead — see /help/account/maintenance.",
            },
            {
              problem: "The page text is in Chinese while Help is English.",
              solution:
                "That matches the current Dashboard implementation. Follow the same control order: reason → remark → Save draft / Submit for review → history actions.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Merchant profile maintenance",
        href: "/help/account/maintenance",
      },
    },
  },
};
