/**
 * One-off script: wrap marketing client pages with server metadata shells.
 * Run: node scripts/wrap-marketing-pages.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const marketingRoot = path.join(root, "src/app/[locale]/(marketing)");

const PAGE_CONFIG = [
  { rel: "products/page.tsx", seoKey: "products" },
  { rel: "products/credit-payment/page.tsx", seoKey: "credit_payment" },
  { rel: "products/crypto-payment/page.tsx", seoKey: "crypto_payment" },
  { rel: "deployment/page.tsx", seoKey: "deployment" },
  { rel: "solutions/page.tsx", seoKey: "solutions" },
  { rel: "solutions/cross-border-ecommerce/page.tsx", seoKey: "cross_border" },
  { rel: "solutions/group-enterprise/page.tsx", seoKey: "group_enterprise" },
  { rel: "technology/page.tsx", seoKey: "technology" },
  { rel: "technology/architecture/page.tsx", seoKey: "architecture" },
  { rel: "technology/performance/page.tsx", seoKey: "performance" },
  { rel: "technology/identity/page.tsx", seoKey: "identity" },
  { rel: "technology/blockchain/page.tsx", seoKey: "blockchain" },
  { rel: "resources/page.tsx", seoKey: "resources" },
  { rel: "resources/case-studies/page.tsx", seoKey: "case_studies" },
  { rel: "resources/case-studies/micselect/page.tsx", seoKey: "micselect" },
  { rel: "resources/compliance/page.tsx", seoKey: "compliance" },
  { rel: "resources/blog/page.tsx", seoKey: "blog" },
  { rel: "resources/downloads/page.tsx", seoKey: "downloads" },
  { rel: "whitepaper/page.tsx", seoKey: "whitepaper" },
];

function extractDefaultExportName(source) {
  const match = source.match(/export default function (\w+)/);
  if (!match) {
    throw new Error("Could not find default export function name");
  }
  return match[1];
}

function toContentName(pageName) {
  return pageName.replace(/Page$/, "Content");
}

function buildWrapper(contentName, seoKey) {
  const pageName = contentName.replace(/Content$/, "Page");

  return `import type { Metadata } from "next";
import { generateMarketingMetadata } from "@/lib/seo/generate-marketing-metadata";
import ${contentName} from "./${contentName}";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateMarketingMetadata(locale, "${seoKey}");
}

export default function ${pageName}() {
  return <${contentName} />;
}
`;
}

for (const { rel, seoKey } of PAGE_CONFIG) {
  const pagePath = path.join(marketingRoot, rel);
  const dir = path.dirname(pagePath);
  const source = fs.readFileSync(pagePath, "utf8");

  if (source.includes("generateMarketingMetadata")) {
    console.log(`skip (already wrapped): ${rel}`);
    continue;
  }

  const pageName = extractDefaultExportName(source);
  const contentName = toContentName(pageName);
  const contentPath = path.join(dir, `${contentName}.tsx`);

  const contentSource = source.replace(
    `export default function ${pageName}`,
    `export default function ${contentName}`
  );

  fs.writeFileSync(contentPath, contentSource, "utf8");
  fs.writeFileSync(pagePath, buildWrapper(contentName, seoKey), "utf8");
  console.log(`wrapped: ${rel} -> ${contentName}.tsx`);
}

const reconciliationPath = path.join(
  marketingRoot,
  "resources/reconciliation-settlement/page.tsx"
);
const reconciliationSource = fs.readFileSync(reconciliationPath, "utf8");
if (!reconciliationSource.includes("generateMetadata")) {
  const pageName = extractDefaultExportName(reconciliationSource);
  const contentName = toContentName(pageName);
  const contentPath = path.join(
    path.dirname(reconciliationPath),
    `${contentName}.tsx`
  );
  fs.writeFileSync(
    contentPath,
    reconciliationSource.replace(
      `export default function ${pageName}`,
      `export default function ${contentName}`
    ),
    "utf8"
  );
  fs.writeFileSync(
    reconciliationPath,
    buildWrapper(contentName, "reconciliation_settlement"),
    "utf8"
  );
  console.log("wrapped: resources/reconciliation-settlement/page.tsx");
}

console.log("done");
