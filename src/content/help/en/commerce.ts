import type { HelpArticleContent } from "../article-content";

export const enCommerce: Record<string, HelpArticleContent> = {
  "commerce/products": {
    title: "Manage products in Merchant Center",
    description:
      "Find, filter, and open products in FilixPay Merchant Center so you can create drafts, publish catalog items, or update existing listings.",
    keywords: [
      "products",
      "commerce",
      "catalog",
      "merchant center",
      "product list",
    ],
    body: {
      whoFor:
        "Merchants who sell through FilixPay Commerce and need to manage catalog items in Merchant Center.",
      whenToUse:
        "Use this guide when you want an overview of the Products list, status filters, and how to open create or publish flows.",
      beforeYouStart: [
        "Sign in to FilixPay Merchant Center with a role that can view Commerce products.",
        "Confirm your organization has Commerce enabled for your account.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "The Products page lists catalog items for your merchant. You can search by title or SKU, filter by category and status (for example draft, published, or suspended), and open a product detail page to edit fields or run publish actions. Example SKU values in demos use formats like DEMO-MUG-001 — never real customer identifiers.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Products in Merchant Center (Commerce → Products).",
            "Use search or status filters to find the item you need.",
            "Click Create product to start a new draft, or open an existing row to view detail.",
            "From detail, update fields as needed, then publish or unpublish when ready.",
          ],
        },
        {
          type: "heading",
          text: "Key fields on the list",
          anchor: "key-fields",
        },
        {
          type: "fields",
          rows: [
            {
              field: "Title",
              description: "Display name shown in the list and on the product detail page.",
            },
            {
              field: "SKU",
              description:
                "Merchant SKU used for matching and search (for example DEMO-MUG-001).",
            },
            {
              field: "Status",
              description:
                "Lifecycle state such as draft, published, suspended, or syncing.",
            },
            {
              field: "Category",
              description: "Optional category used to group products in filters.",
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
              problem: "I cannot find a product I just created.",
              solution:
                "Clear filters (set status to All), refresh the list, and search by the SKU you entered (for example DEMO-MUG-001).",
            },
            {
              problem: "How do I edit an existing product?",
              solution:
                "Open the product from the Products list. Editing happens on the product detail page — Help does not use a separate /edit URL.",
            },
          ],
        },
        {
          type: "paragraph",
          text: "Tip: keep draft catalog work under fictional sample titles such as “Sample Ceramic Mug” until you are ready to publish.",
        },
      ],
      nextStep: {
        label: "Create a product",
        href: "/help/commerce/products/create",
      },
    },
  },
  "commerce/products/create": {
    title: "How to create a product",
    description:
      "Create a Commerce product draft in FilixPay Merchant Center with title, SKU, price, stock, and category — then save or publish.",
    keywords: [
      "create product",
      "new product",
      "commerce catalog",
      "SKU",
      "draft product",
    ],
    body: {
      whoFor:
        "Operators who need to add a new catalog item before publishing it to the storefront.",
      whenToUse:
        "Use this when you are ready to enter product details on the Create product page.",
      beforeYouStart: [
        "Have a unique SKU ready (for example DEMO-MUG-001).",
        "Know the selling price and initial stock quantity.",
        "Optionally prepare product images and choose a category.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Creating a product opens the product editor. Required fields include title, SKU, price, and category. You can save as a draft or publish immediately after create. Use fictional sample data only in sandboxes — for example title “Sample Ceramic Mug” and contact placeholders like catalog-ops@example.com in internal notes outside FilixPay.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Go to Commerce → Products and choose Create product.",
            "Enter a clear title (for example Sample Ceramic Mug).",
            "Add an optional description and upload images if available.",
            "Enter SKU, price, and stock. Select a category (and product type if shown).",
            "Choose Save as draft, or create and publish in one step when the form offers publish mode.",
            "After create, you land on the product detail page where you can continue editing or publish later.",
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
              field: "Title",
              description: "Required. Customer-facing product name (max length applies in the form).",
            },
            {
              field: "Description",
              description: "Optional long text describing the item.",
            },
            {
              field: "Images",
              description: "Optional media uploads shown with the product.",
            },
            {
              field: "SKU",
              description: "Required unique stock-keeping unit for your catalog.",
            },
            {
              field: "Price",
              description: "Required selling price in the Commerce currency.",
            },
            {
              field: "Stock",
              description: "Available quantity. Defaults to 0 if you leave it unset.",
            },
            {
              field: "Category",
              description: "Required category used for organization and filters.",
            },
            {
              field: "Product type",
              description: "Optional type when your merchant has product types configured.",
            },
            {
              field: "Publish mode",
              description:
                "On create, choose draft or publish-after-create when the editor shows this control.",
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
                "Check required fields: title, SKU, price, and category. Fix validation messages shown under each field.",
            },
            {
              problem: "I need to change details after saving a draft.",
              solution:
                "Open the product from the Products list and edit on the detail page. There is no separate Help slug for edit — editing is part of the product detail flow.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Publish a product",
        href: "/help/commerce/products/publish",
      },
    },
  },
  "commerce/products/publish": {
    title: "How to publish a product",
    description:
      "Publish a draft Commerce product from the product detail page, monitor sync status, and unpublish or retry when needed.",
    keywords: [
      "publish product",
      "unpublish",
      "product sync",
      "commerce publish",
      "draft to published",
    ],
    body: {
      whoFor:
        "Merchants who have a draft (or unpublished) product and want it available for sale through FilixPay Commerce.",
      whenToUse:
        "Use this after create, or whenever a product is ready to go live or needs to be taken offline.",
      beforeYouStart: [
        "Create or open the product and confirm title, SKU, price, stock, and category are correct.",
        "Resolve any validation errors on the detail page before publishing.",
      ],
      blocks: [
        {
          type: "paragraph",
          text: "Publishing runs from the product detail page using Publish actions. While integration sync is in progress, publish and unpublish controls stay disabled. If sync fails, use retry when available. Example: publish “Sample Ceramic Mug” (SKU DEMO-MUG-001) only after pricing and stock look correct.",
        },
        {
          type: "heading",
          text: "Steps",
          anchor: "steps",
        },
        {
          type: "steps",
          items: [
            "Open Commerce → Products and select the product you want to publish.",
            "Review fields on the detail page and save any last edits.",
            "Choose Publish and confirm in the dialog.",
            "Wait until status leaves syncing. If publish fails, read the error and use Retry sync when shown.",
            "To take a live item offline later, use Unpublish from the same actions area.",
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
              field: "Published",
              description: "Live for Commerce channels that consume the catalog.",
            },
            {
              field: "Syncing",
              description:
                "Integration update in flight — wait before publishing or unpublishing again.",
            },
            {
              field: "Suspended",
              description: "Unavailable; review status badges before republishing.",
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
                "Confirm the product can be published (not already published) and that integration sync is not in progress. Refresh the detail page after sync completes.",
            },
            {
              problem: "Publish failed or status stuck on syncing.",
              solution:
                "Wait for the sync timeout window, then use Retry sync if shown. If the problem continues, check required fields and try again from the product detail page.",
            },
            {
              problem: "I need to edit after publishing.",
              solution:
                "Open the product from the Products list and edit on the detail page, then publish again if your workflow requires it. Help does not provide a separate edit URL.",
            },
          ],
        },
      ],
      nextStep: {
        label: "Back to managing products",
        href: "/help/commerce/products",
      },
    },
  },
};
