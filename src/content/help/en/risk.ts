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
  "risk/controls": {
    title: "Fraud events, risk reviews, and risk rules",
    description:
      "Find Fraud Events, the Risk Review Queue, and read-only Risk Rules under Risk Management in FilixPay Merchant Center.",
    keywords: [
      "fraud events",
      "risk review queue",
      "risk rules",
      "PRE_AUTH",
      "risk management",
    ],
    body: {
      whoFor:
        "Operators who monitor fraud signals, check the manual review queue, or view platform and merchant risk rules.",
      whenToUse:
        "Use this when you open Risk Management → Fraud, Risk Reviews, or Risk Rules to investigate a signal or understand which PRE_AUTH rules are in effect.",
      beforeYouStart: [
        "Sign in with access to Risk Management menus.",
        "Have an order ID, payment ID, or keyword ready when searching Fraud Events or Risk Reviews (for example ORD_EXAMPLE_001).",
        "Know that Risk Rules in Merchant Center are read-only — Help does not document how to create or edit rules.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Risk Management exposes three related surfaces. Fraud Events lists detected fraud signals and investigation status. Risk Review Queue is a read-only list of suspicious orders and payouts flagged for manual review. Risk Rules shows platform and merchant PRE_AUTH rules (read-only). This guide maps What / Where / When and how to open each list; it does not cover scoring algorithms or Credit.",
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
              field: "Fraud Events",
              description:
                "Open Risk Management → Fraud when you need event type, severity, related order, and investigation status.",
            },
            {
              field: "Risk Review Queue",
              description:
                "Open Risk Management → Risk Reviews when an order or payout is flagged for manual review (Pending / Approved / Rejected).",
            },
            {
              field: "Risk Rules",
              description:
                "Open Risk Management → Risk Rules when you need to see which PRE_AUTH velocity or amount rules are enabled and how they enforce (Block or Review before payment).",
            },
          ],
        },
        {
          type: "heading",
          text: "Work with Fraud Events",
          anchor: "fraud",
        },
        {
          type: "steps",
          items: [
            "Open Risk Management → Fraud (Fraud Events).",
            "Filter by keyword, Status, and Severity as needed, then Search. Use Reset to clear filters.",
            "Read Event Type, Risk Type, Description, Severity, Related Order, Status, and Detected At.",
            "Open a row to view Fraud Event Detail (payment ID, provider, risk score, and metadata when present).",
            "Use Back to fraud events to return to the list.",
          ],
        },
        {
          type: "heading",
          text: "Work with Risk Reviews",
          anchor: "reviews",
        },
        {
          type: "steps",
          items: [
            "Open Risk Management → Risk Reviews (Risk Review Queue).",
            "Filter by keyword, Status, Priority, and Review type when needed, then Search.",
            "Read Resource (Order or Payout), Reason, Priority, Status, and Flagged At.",
            "Open a row for Review Detail (reason code, queued/decided times, decision note, linked fraud event, resume link when shown).",
            "Treat the queue as read-only in Merchant Center — decisions may be completed outside this list UI.",
          ],
        },
        {
          type: "heading",
          text: "View Risk Rules",
          anchor: "rules",
        },
        {
          type: "steps",
          items: [
            "Open Risk Management → Risk Rules.",
            "Review Name, Type (Velocity or Amount), Severity, Enforcement, Scope (Platform or Merchant), Enabled, and Priority.",
            "Use this list to understand which rules can block or send traffic to review before payment. Do not expect an edit action on this page.",
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
              problem: "I cannot edit a risk rule in Merchant Center.",
              solution:
                "Risk Rules is read-only here. Ask your admin or platform operator if a rule change is required. Help does not document rule authoring APIs.",
            },
            {
              problem: "Is a fraud event the same as a chargeback?",
              solution:
                "No. Fraud Events and Risk Reviews are risk-control surfaces. Card-network disputes live under Disputes & Chargebacks — see /help/risk/disputes. Merchant-started returns are under Refunds — see /help/risk/refunds.",
            },
            {
              problem: "Review queue stays Pending with no action button.",
              solution:
                "The Merchant Center queue is read-only. Open Review Detail for linked fraud or resume information, and follow your internal review process or platform instructions.",
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
};
