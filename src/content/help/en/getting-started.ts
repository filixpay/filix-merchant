import type { HelpArticleContent } from "../article-content";

export const enGettingStarted: Record<string, HelpArticleContent> = {
  "getting-started/merchant-setup": {
    title: "Complete your merchant setup",
    description:
      "Finish Formal Onboarding in FilixPay Merchant Center: track application status, continue or submit your merchant application, and know what happens after approval.",
    keywords: [
      "merchant setup",
      "onboarding",
      "formal onboarding",
      "application status",
      "merchant application",
    ],
    body: {
      whoFor:
        "Trial or new merchants who need to complete Formal Onboarding before using full Merchant Center capabilities.",
      whenToUse:
        "Use this when you are starting FilixPay setup, checking Application Status, or continuing a draft or returned merchant application.",
      beforeYouStart: [
        "Sign in to FilixPay Merchant Center with an account that can view Formal Onboarding.",
        "Have business registration details and supporting documents ready for the country or region you select.",
        "Decide the settlement currency you will confirm (it is locked after registration).",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Formal Onboarding is the merchant application funnel in Merchant Center. Help explains how to use Application Status and Merchant Application — it does not replace the onboarding workflow or hold a separate activation state. Sample contacts in demos use values like onboarding-ops@example.com; never paste real personal data into Help examples.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Formal Onboarding to land on Application Status (or start Apply if you have no application yet).",
            "Review Current status, Application ID, application type, and timeline steps (Submitted → Platform review → Credential check → Completed).",
            "If status is Draft or Returned, choose Continue or Edit application to open Merchant Application.",
            "In the wizard, complete Country & Type, Business Profile (including documents), then Confirm & Submit.",
            "After submit, return to Application Status and refresh until review finishes. If Approved or Completed, follow any sign-out and sign-in prompt so credentials take effect.",
            "If Rejected or Cancelled, use Apply again when the UI offers it, or contact support with your Application ID only (never share passwords or API secrets).",
          ],
        },
        {
          type: "heading",
          text: "Key statuses",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Draft",
              description: "Application started but not submitted. Continue editing until ready.",
            },
            {
              field: "Submitted / Under review",
              description: "Waiting on platform review. Check timeline and refresh for updates.",
            },
            {
              field: "Returned",
              description: "Needs corrections. Edit the application and resubmit.",
            },
            {
              field: "Approved / Provisioning / Completed",
              description:
                "Application accepted; provisioning may still run. Completed usually requires signing out and signing in again.",
            },
            {
              field: "Rejected / Cancelled / Provision failed",
              description:
                "Setup did not finish. Read on-screen guidance, withdraw or reapply when available, or contact support.",
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
              problem: "I cannot find Formal Onboarding in the menu.",
              solution:
                "Formal Onboarding is shown for trial merchants upgrading to formal. Confirm you are signed into the correct organization, then open Application Status from the help dashboard link if the menu item is hidden.",
            },
            {
              problem: "Submit is blocked on Confirm & Submit.",
              solution:
                "Complete required business profile fields and documents, and confirm settlement currency. Fix validation messages on each step before submitting.",
            },
            {
              problem: "Status is Completed but features still look limited.",
              solution:
                "Sign out and sign in again as prompted, then re-open Merchant Center. If limits remain, refresh Application Status and confirm provisioning finished.",
            },
          ],
        },
        {
          type: "paragraph",
          text: "After setup, learn how balance moves under Money → Balance, and how to send funds out under Money → Payouts. Use the Next step for balance; for payouts open /help/funds/payouts when you are ready.",
        },
      ],
      nextStep: {
        label: "Understand your balance",
        href: "/help/funds/balance",
      },
    },
  },
  "getting-started/payment-channel": {
    title: "Configure your first payment channel",
    description:
      "Add and open a payment configuration in FilixPay Merchant Center so acquiring can route to an enabled payment channel.",
    keywords: [
      "payment channel",
      "payment configs",
      "acquiring settings",
      "payment configuration",
      "first channel",
    ],
    body: {
      whoFor:
        "Merchants who finished (or are finishing) setup and need at least one open payment channel for acquiring.",
      whenToUse:
        "Use this when you open Payment Configurations under Acquiring Settings for the first time, or when a channel must be added, edited, or opened.",
      beforeYouStart: [
        "Confirm your merchant can access Transactions → Acquiring Settings → Payment Configs.",
        "Have channel credentials from your payment brand ready (use test-mode placeholders such as sk_test_placeholder in sandboxes — never commit real secrets).",
        "Know which payment scenario and sub-merchant the configuration should apply to.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Payment Configurations lists channels grouped by payment scenario, sub-merchant, and institution. Routing uses enabled (open) channels. Configure Live or Test mode as appropriate for your environment.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Go to Transactions → Acquiring Settings → Payment Configs.",
            "Choose Add Configuration (or Add channel on an existing scenario card).",
            "Select payment brand, channel, scenario, and sub-merchant as required by the form.",
            "Enter credentials for that channel, then save.",
            "Set the channel to Open when you are ready for routing. Use Close to stop routing without deleting the configuration.",
            "Confirm the card shows Open (or Routing active) for the scenario you intend to use.",
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
              field: "Payment brand / channel",
              description: "Provider and channel product you connect (for example a card or wallet brand).",
            },
            {
              field: "Payment scenario",
              description: "Acquiring scenario the configuration belongs to on the configs page.",
            },
            {
              field: "Sub-merchant",
              description: "Optional sub-merchant scope when your organization uses business accounts.",
            },
            {
              field: "Status",
              description:
                "Lifecycle such as Open, Close, Applying, Rejected, or Disabled. Open channels can receive routing.",
            },
            {
              field: "Live / Test mode",
              description: "Environment toggle for credentials and routing. Keep test credentials out of production.",
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
              problem: "I cannot open a channel.",
              solution:
                "Check status is not Applying or Rejected. Complete required credentials, save, then use the Open/Close control. Refresh the page if the toggle stayed on Channel stopped.",
            },
            {
              problem: "Orders fail with no available channel.",
              solution:
                "Confirm at least one configuration is Open for the scenario and sub-merchant used by the order. Verify Live vs Test mode matches the order environment.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Create your first product",
        href: "/help/getting-started/create-product",
      },
    },
  },
  "getting-started/create-product": {
    title: "Create your first product",
    description:
      "Add your first Commerce catalog draft in FilixPay Merchant Center with title, SKU, price, stock, and category.",
    keywords: [
      "first product",
      "create product",
      "commerce onboarding",
      "catalog draft",
      "getting started",
    ],
    body: {
      whoFor:
        "New merchants who want a first catalog item after setup and payment configuration.",
      whenToUse:
        "Use this when you are ready to open Create product from Commerce and save a draft (or create-and-publish).",
      beforeYouStart: [
        "Confirm Commerce products are available for your merchant.",
        "Prepare a unique sample SKU such as DEMO-MUG-001 and a title like Sample Ceramic Mug.",
        "Know the selling price and initial stock.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Getting Started create-product is the onboarding entry into Commerce create. The full field reference and troubleshooting live in the Commerce guide How to create a product — use that guide for day-to-day catalog work after your first item.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Commerce → Products and choose Create product (or use the dashboard link to products/new).",
            "Enter title, optional description and images, SKU, price, stock, and category.",
            "Choose Save as draft, or create and publish when the editor offers publish mode.",
            "Confirm you land on the product detail page after create.",
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
              field: "Title / SKU",
              description: "Required display name and unique stock-keeping unit for the catalog.",
            },
            {
              field: "Price / Stock",
              description: "Required selling price and available quantity (stock defaults to 0 if unset).",
            },
            {
              field: "Category",
              description: "Required category for organization and filters.",
            },
            {
              field: "Publish mode",
              description:
                "On create, choose draft or publish-after-create when shown. Prefer draft for your first walkthrough.",
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
              problem: "The form will not submit.",
              solution:
                "Fill required title, SKU, price, and category. See /help/commerce/products/create for the full field list.",
            },
            {
              problem: "I need more detail after the first create.",
              solution:
                "Open the Commerce create guide for steps, fields, and issues. Editing later happens on the product detail page — Help has no separate products/edit slug.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Publish your first product",
        href: "/help/getting-started/publish-product",
      },
    },
  },
  "getting-started/publish-product": {
    title: "Publish your first product",
    description:
      "Publish your first Commerce draft from the product detail page, wait for sync, and confirm the item is live.",
    keywords: [
      "publish product",
      "first publish",
      "commerce activation",
      "product sync",
      "getting started",
    ],
    body: {
      whoFor:
        "Merchants who created a draft product and want it available through FilixPay Commerce.",
      whenToUse:
        "Use this after create, when the product detail page shows Publish and required fields look correct.",
      beforeYouStart: [
        "Open the draft product and confirm title, SKU, price, stock, and category.",
        "Resolve validation errors before publishing.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Publishing runs from product detail using Publish actions. Commerce Activation may run alongside Merchant Center — Help documents the publish task only and does not own a second activation state machine. For ongoing publish, unpublish, and retry sync detail, use the Commerce publish guide.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Commerce → Products and select your draft (for example Sample Ceramic Mug / DEMO-MUG-001).",
            "Review fields on detail and save any last edits.",
            "Choose Publish and confirm in the dialog.",
            "Wait until status leaves Syncing. Use Retry sync if publish fails.",
            "Confirm status is Published before taking live orders against that catalog item.",
          ],
        },
        {
          type: "heading",
          text: "Key statuses",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Draft",
              description: "Saved but not live. Publish when ready.",
            },
            {
              field: "Syncing",
              description: "Integration update in flight — wait before publishing or unpublishing again.",
            },
            {
              field: "Published",
              description: "Live for Commerce channels that consume the catalog.",
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
              problem: "Publish is disabled.",
              solution:
                "Confirm the product is not already published and sync is not in progress. Refresh after sync completes. See /help/commerce/products/publish for more cases.",
            },
            {
              problem: "Where do I edit after publishing?",
              solution:
                "Edit on the product detail page from the Products list. There is no separate Help edit URL.",
            },
          ],
        },
      ],
      nextStep: {
        label: "See how balance works",
        href: "/help/funds/balance",
      },
    },
  },
};
