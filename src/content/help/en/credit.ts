import type { HelpArticleContent } from "../article-content";

export const enCredit: Record<string, HelpArticleContent> = {
  "credit/limit": {
    title: "Manage credit lines in Credit Limit",
    description:
      "Create credit lines, adjust limits, and open adjustment or transaction history drawers under Credit Center → Credit Granting → Credit Limit in FilixPay Merchant Center.",
    keywords: [
      "credit limit management",
      "create credit line",
      "adjust credit limit",
      "credit adjustment logs",
      "credit transactions",
    ],
    body: {
      whoFor:
        "Operators who grant credit to debitors and maintain credit line limits in Merchant Center.",
      whenToUse:
        "Use this when you open Credit Center → Credit Granting → Credit Limit to create a line, change a limit, or review adjustment and usage history.",
      beforeYouStart: [
        "Sign in with access to Credit Center → Credit Granting → Credit Limit.",
        "Have the debitor customer code ready (for example 10001).",
        "Decide the starting limit and payment term (for example Net 30 days).",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Credit Limit Management lists credit lines you grant. You can create a line, adjust the limit with a signed amount, and open Adjustment Logs or Credit Transactions drawers from each row. This guide covers that page only. It does not cover member-side My Available Credit, underwriting, or standalone history menu pages.",
        },
        {
          type: "heading",
          text: "Open Credit Limit",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Credit Center → Credit Granting → Credit Limit.",
            "Confirm the page title Credit Limit Management and the Create Credit Line action.",
          ],
        },
        {
          type: "heading",
          text: "Read the credit line list",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Source",
              description: "Platform Credit or Bank Credit.",
            },
            {
              field: "Creditor / Debitor",
              description: "Party display names with secondary codes when shown.",
            },
            {
              field: "Limit / Used / Available",
              description:
                "Total limit, used amount, and remaining available amount (amounts display as USD in the UI).",
            },
            {
              field: "Terms",
              description:
                "Net {days} days when the term is Net Days; other term types show as Immediate Payment on this list.",
            },
            {
              field: "Status",
              description: "Active or Inactive.",
            },
          ],
        },
        {
          type: "heading",
          text: "Create a credit line",
          anchor: "create-credit-line",
        },
        {
          type: "steps",
          items: [
            "Choose Create Credit Line.",
            "Enter Debitor Customer Code (for example 10001).",
            "Enter Credit Limit (for example 100000).",
            "Select Payment Term (Immediate, Net Days, End of Month, On Delivery, or Stage Based).",
            "If Payment Term is Net Days, enter Payment Term Days (for example 30).",
            "Submit and confirm the new row appears in the list.",
          ],
        },
        {
          type: "heading",
          text: "Adjust a limit",
          anchor: "adjust-limit",
        },
        {
          type: "steps",
          items: [
            "On a row, choose Adjust Limit.",
            "Confirm Debitor and current Limit in the modal summary.",
            "Enter Adjustment Amount: positive to increase, negative to decrease (for example 5000 or -5000).",
            "Submit Adjustment and confirm Limit / Available update on the list.",
          ],
        },
        {
          type: "heading",
          text: "Open adjustment and transaction history",
          anchor: "history",
        },
        {
          type: "steps",
          items: [
            "On a row, choose Adjustment Logs. The drawer title may read Limit Adjustment Records; review Debitor, operator, old/new limit, adjustment amount, and time.",
            "On a row, choose Credit Transactions. The drawer title may read Credit Transaction History; review Customer, business ID, type (Usage, Repayment, Adjustment, Refund), amount, and used-before / used-after balances.",
            "Close the drawer when finished. These histories are drawers on this page, not separate Dashboard routes.",
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
              problem: "I cannot edit payment terms after create.",
              solution:
                "The list and adjust flow change the limit amount only. Payment term is set at create time in this UI. Help does not document an edit-terms action that is not on the page.",
            },
            {
              problem: "Where is My Available Credit?",
              solution:
                "That is the member (debitor) view under Credit Center → Credit Usage → My Limit. See /help/credit/available-credit.",
            },
            {
              problem: "Adjustment Logs is missing from the left menu.",
              solution:
                "Open Adjustment Logs or Credit Transactions from the row actions on Credit Limit. There is no separate history page in the live menu. Use Refresh in the page header if the list looks stale.",
            },
          ],
        },
      ],
      nextStep: {
        label: "My Available Credit",
        href: "/help/credit/available-credit",
      },
    },
  },
  "credit/available-credit": {
    title: "View My Available Credit",
    description:
      "Read credit lines assigned to you under Credit Center → Credit Usage → My Limit, including total, used, and available amounts, plus history drawers.",
    keywords: [
      "my available credit",
      "my limit",
      "member credit",
      "credit usage",
      "available credit balance",
    ],
    body: {
      whoFor:
        "Members (debitors) who need to see credit lines granted to them and review limit or usage history.",
      whenToUse:
        "Use this when you open Credit Center → Credit Usage → My Limit to check Total Limit, Used Amount, and Available Amount.",
      beforeYouStart: [
        "Sign in with access to Credit Center → Credit Usage → My Limit.",
        "Expect a read-only list: you cannot create or adjust lines on this page.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "My Available Credit shows credit lines assigned to your account. You can open Adjustment Logs and Credit Transactions drawers from each row. This guide covers the member view only. Creating or adjusting lines is done under Credit Limit by the grantor — see /help/credit/limit.",
        },
        {
          type: "heading",
          text: "Open My Available Credit",
          anchor: "open",
        },
        {
          type: "steps",
          items: [
            "Sign in to Merchant Center.",
            "Open Credit Center → Credit Usage → My Limit.",
            "Confirm the page title My Available Credit.",
          ],
        },
        {
          type: "heading",
          text: "Read your credit lines",
          anchor: "list",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Creditor",
              description: "Who granted the line, with secondary code when shown.",
            },
            {
              field: "Total Limit",
              description:
                "Current credit limit for the line (amounts display as USD in the UI).",
            },
            {
              field: "Used Amount / Available Amount",
              description:
                "How much is used and how much remains available (USD display).",
            },
            {
              field: "Payment Term",
              description:
                "Net {days} days when applicable; otherwise Immediate Payment on this list.",
            },
            {
              field: "Status",
              description: "Active or Inactive.",
            },
          ],
        },
        {
          type: "heading",
          text: "Open history drawers",
          anchor: "history",
        },
        {
          type: "steps",
          items: [
            "On a row, choose Adjustment Logs. The drawer title may read Credit Adjustment History; review previous limit, new limit, amount, operator, and time.",
            "On a row, choose Credit Transactions. The drawer title may read Credit Payment History; review Usage, Repayment, Adjustment, and Refund rows with used-before / used-after amounts.",
            "Close the drawer when finished.",
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
              problem: "The list is empty.",
              solution:
                "No credit lines have been assigned to you yet. Ask the grantor to create a line under Credit Limit, or confirm you are on the correct business account.",
            },
            {
              problem: "I cannot create or adjust a limit here.",
              solution:
                "My Available Credit is read-only for members. Grantors use Credit Center → Credit Granting → Credit Limit — see /help/credit/limit.",
            },
            {
              problem: "Can I start a payment from this page?",
              solution:
                "No. This page shows balances and history only. It does not initiate payments or repayments.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Credit Limit Management",
        href: "/help/credit/limit",
      },
    },
  },
};
