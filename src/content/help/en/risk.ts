import type { HelpArticleContent } from "../article-content";

export const enRisk: Record<string, HelpArticleContent> = {
  "risk/refunds": {
    title: "Manage refunds",
    description:
      "Search, create, and track refund orders in FilixPay Merchant Center Refund Management.",
    keywords: [
      "refunds",
      "refund management",
      "initiate refund",
      "refund status",
      "after-sales",
    ],
    body: {
      whoFor:
        "Operators who process customer refunds or monitor refund order status.",
      whenToUse:
        "Use this when you open Transactions → Refunds, or after initiating a refund from an order.",
      beforeYouStart: [
        "Have the original Order ID or Refund ID ready.",
        "Confirm your role can create refunds or view the refunds list.",
        "Know whether refund settings require approval above a threshold.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Refund Management lists refund orders with Refund ID, Order ID, amount, status, and submitted time. Refunds are merchant-initiated returns of captured payments — separate from Disputes & Chargebacks. Demo emails in notes should stay like refunds-ops@example.com.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Transactions → Refunds (Refund Management).",
            "Search by Refund ID or Order ID to find an existing refund.",
            "To create a refund, choose Create Refund (or Initiate Refund from the related order).",
            "Enter amount and required reason fields, then submit.",
            "If the amount exceeds auto-execute settings, wait for Refund approvals before execution completes.",
            "Watch status move from Requested or Processing to Succeeded, Failed, or Cancelled.",
          ],
        },
        {
          type: "heading",
          text: "Key fields and statuses",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Refund ID / Order ID",
              description: "Refund record identifier and the original order being refunded.",
            },
            {
              field: "Amount",
              description: "Refund amount; may be partial relative to the order.",
            },
            {
              field: "Status",
              description: "Requested, Processing, Succeeded, Failed, or Cancelled.",
            },
            {
              field: "Submitted At",
              description: "When the refund request entered the system.",
            },
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
              problem: "Refund stays in Processing.",
              solution:
                "Refresh the list and open detail. If approvals apply, check the refund approvals queue. Confirm the original order is in a refundable status.",
            },
            {
              problem: "Create Refund is unavailable.",
              solution:
                "Open the order first and use Initiate Refund when the trade status allows it, or confirm your role permissions and refund settings.",
            },
            {
              problem: "Is this the same as a chargeback?",
              solution:
                "No. Refunds are merchant-started. Card-network disputes are under Disputes & Chargebacks — see /help/risk/disputes.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Disputes & Chargebacks",
        href: "/help/risk/disputes",
      },
    },
  },
  "risk/disputes": {
    title: "Disputes and chargebacks",
    description:
      "Monitor chargeback cases, response deadlines, and merchant actions in FilixPay Merchant Center Disputes & Chargebacks.",
    keywords: [
      "disputes",
      "chargebacks",
      "evidence",
      "response due",
      "risk management",
    ],
    body: {
      whoFor:
        "Risk and ops teams who respond to payment chargebacks and upload evidence before deadlines.",
      whenToUse:
        "Use this when Cases Require Action, Due Soon, or Overdue appear, or when you open Risk Management → Disputes & Chargebacks.",
      beforeYouStart: [
        "Collect receipt, shipping, or communication evidence for the order.",
        "Note the Case No. and Response Due date from the disputes list.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Disputes & Chargebacks tracks card-network chargeback cases — not Offline Collection confirmations and not Risk Reviews for fraud queues. Priority and Response Due drive what you work first. Upload evidence categories such as Receipt, Shipping, Communication, or Other.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Risk Management → Disputes & Chargebacks.",
            "Review KPIs for Cases Require Action, Due Soon (under 3 days), and Overdue.",
            "Open a case by Case No. or Order ID.",
            "In the Merchant Action Center, follow required actions and upload evidence files.",
            "Submit your response before Response Due and monitor status (Draft → Submitted → Under Review → Won / Lost / Accepted).",
          ],
        },
        {
          type: "heading",
          text: "Key fields",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Case No. / Order ID",
              description: "Chargeback case identifier and the related payment order.",
            },
            {
              field: "Reason / Priority",
              description: "Dispute reason code context and Critical / High / Medium / Low priority.",
            },
            {
              field: "Status",
              description: "Draft, Submitted, Under Review, Won, Lost, or Accepted.",
            },
            {
              field: "Response Due",
              description: "Deadline to provide merchant evidence or accept the case outcome path.",
            },
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
              problem: "I opened Reviews but cannot find chargebacks.",
              solution:
                "Chargebacks live under Disputes & Chargebacks. Offline Collection confirmation and Risk Reviews are different queues.",
            },
            {
              problem: "Evidence upload fails.",
              solution:
                "Use supported evidence types (Receipt, Shipping, Communication, Other), check file size limits on the form, and retry before Response Due.",
            },
            {
              problem: "Case is Overdue.",
              solution:
                "Open the case immediately, submit whatever evidence remains available, and escalate internally — late responses raise Lost risk.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Manage refunds",
        href: "/help/risk/refunds",
      },
    },
  },
};
