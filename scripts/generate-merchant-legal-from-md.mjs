import fs from "node:fs";
import path from "node:path";

function parseMdToDocument(md, { slug, title, status, lastUpdated }) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  while (i < lines.length && !lines[i].startsWith("# ")) i++;
  if (i < lines.length) i++;

  const preamble = [];
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    if (line.startsWith(">")) {
      preamble.push(line.replace(/^>\s?/, "").replace(/\*\*/g, ""));
      i++;
      continue;
    }
    break;
  }

  const sections = [];
  if (preamble.length) {
    sections.push({ id: "meta", title: "", paragraphs: preamble });
  }

  let current = null;
  let currentSub = null;

  function flushSub() {
    if (currentSub && current) {
      current.subsections = current.subsections || [];
      current.subsections.push(currentSub);
      currentSub = null;
    }
  }
  function flushSection() {
    flushSub();
    if (current) sections.push(current);
    current = null;
  }
  function target() {
    return currentSub || current;
  }
  function ensureTarget() {
    if (!current) {
      current = { id: `section-${sections.length + 1}`, title: "", paragraphs: [] };
    }
    return target();
  }
  function pushParagraph(text) {
    const t = ensureTarget();
    t.paragraphs = t.paragraphs || [];
    t.paragraphs.push(text);
  }
  function pushBullet(text) {
    const t = ensureTarget();
    t.bullets = t.bullets || [];
    t.bullets.push(text);
  }
  function slugify(titleText, fallback) {
    return (
      titleText
        .replace(/[《》""''：:、，。！？（）()\[\]【】]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 64) || fallback
    );
  }

  let tableBuf = [];
  function flushTable() {
    if (!tableBuf.length) return;
    const rows = tableBuf.filter((r) => !/^\|[\s|:-]+$/.test(r.replace(/\s/g, "")));
    for (const row of rows) {
      const cells = row
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean)
        .map((c) => c.replace(/\*\*/g, ""));
      if (cells.length >= 2) pushParagraph(cells.join(md.includes("Article") || md.includes("Document Purpose") ? ": " : "："));
      else if (cells.length === 1) pushParagraph(cells[0]);
    }
    tableBuf = [];
  }

  while (i < lines.length) {
    const line = lines[i].trim();
    i++;

    if (!line) {
      flushTable();
      continue;
    }
    if (line === "---") {
      flushTable();
      continue;
    }
    if (line.startsWith("|")) {
      tableBuf.push(line);
      continue;
    }
    flushTable();

    if (line.startsWith("```")) {
      const code = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      const text = code.join("\n").trim();
      if (text) pushParagraph(text);
      continue;
    }

    if (/^#{1,2}\s+/.test(line) && !line.startsWith("###")) {
      flushSection();
      const titleText = line.replace(/^#{1,2}\s+/, "").replace(/\*\*/g, "");
      current = {
        id: slugify(titleText, `s-${sections.length + 1}`),
        title: titleText,
        paragraphs: [],
      };
      continue;
    }

    if (line.startsWith("### ")) {
      flushSub();
      const titleText = line.replace(/^###\s+/, "").replace(/\*\*/g, "");
      currentSub = {
        id: slugify(titleText, `sub-${(current?.subsections?.length || 0) + 1}`),
        title: titleText,
        paragraphs: [],
      };
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      pushBullet(line.slice(2).replace(/\*\*/g, ""));
      continue;
    }

    if (line.startsWith(">")) {
      let text = line.replace(/^>\s?/, "");
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        const next = lines[i].trim().replace(/^>\s?/, "");
        i++;
        if (!next) continue;
        text += (text ? " " : "") + next;
      }
      pushParagraph(text.replace(/\*\*/g, ""));
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const t = ensureTarget();
      t.orderedBullets = t.orderedBullets || [];
      t.orderedBullets.push(line.replace(/^\d+\.\s+/, "").replace(/\*\*/g, ""));
      continue;
    }

    pushParagraph(line.replace(/\*\*/g, ""));
  }
  flushTable();
  flushSection();

  function clean(block) {
    if (block.paragraphs && block.paragraphs.length === 0) delete block.paragraphs;
    if (block.bullets && block.bullets.length === 0) delete block.bullets;
    if (block.orderedBullets && block.orderedBullets.length === 0) delete block.orderedBullets;
    if (block.subsections) {
      block.subsections.forEach(clean);
      if (block.subsections.length === 0) delete block.subsections;
    }
  }
  sections.forEach(clean);

  return { slug, status, title, lastUpdated, notice: null, sections };
}

function emitModule({ filePath, exportName, constPrefix, zh, en, sourceNote }) {
  const contents = `import type { LegalContentLocale } from "@/lib/legal/content-locales";
import type { LegalDocument } from "./types";

/**
 * ${sourceNote}
 * Generated by scripts/generate-merchant-legal-from-md.mjs — do not hand-edit commercial rules.
 */
const ${constPrefix}_ZH: LegalDocument = ${JSON.stringify(zh, null, 2)} as LegalDocument;

const ${constPrefix}_EN: LegalDocument = ${JSON.stringify(en, null, 2)} as LegalDocument;

export const ${exportName}: Record<LegalContentLocale, LegalDocument> = {
  zh: ${constPrefix}_ZH,
  en: ${constPrefix}_EN,
};
`;
  fs.writeFileSync(filePath, contents);
}

const termsZh = parseMdToDocument(
  fs.readFileSync("D:/WORK/filix-pay/docs/FilixPay 商户服务协议 V1.md", "utf8"),
  {
    slug: "merchant-terms",
    title: "FilixPay 商户服务协议",
    status: "draft",
    lastUpdated: "2026-09-07",
  },
);
const termsEn = parseMdToDocument(
  fs.readFileSync(
    "D:/WORK/filix-pay/docs/FilixPay Merchant Service Agreement V1.en.md",
    "utf8",
  ),
  {
    slug: "merchant-terms",
    title: "FilixPay Merchant Service Agreement",
    status: "draft",
    lastUpdated: "2026-09-07",
  },
);
const feesZh = parseMdToDocument(
  fs.readFileSync("D:/WORK/filix-pay/docs/FilixPay 商户服务与收费规则 V1.md", "utf8"),
  {
    slug: "merchant-fees",
    title: "FilixPay 商户服务与收费规则",
    status: "draft",
    lastUpdated: "2026-09-07",
  },
);
const feesEn = parseMdToDocument(
  fs.readFileSync(
    "D:/WORK/filix-pay/docs/FilixPay Merchant Service and Fee Rules V1.en.md",
    "utf8",
  ),
  {
    slug: "merchant-fees",
    title: "FilixPay Merchant Service & Fee Rules",
    status: "draft",
    lastUpdated: "2026-09-07",
  },
);

const legalDir = "d:/open/filix-merchant/src/content/legal";
emitModule({
  filePath: path.join(legalDir, "merchant-terms.ts"),
  exportName: "MERCHANT_TERMS_BY_LOCALE",
  constPrefix: "MERCHANT_TERMS",
  zh: termsZh,
  en: termsEn,
  sourceNote:
    "SSOT ZH: filix-pay/docs/FilixPay 商户服务协议 V1.md; EN: FilixPay Merchant Service Agreement V1.en.md",
});
emitModule({
  filePath: path.join(legalDir, "merchant-fees.ts"),
  exportName: "MERCHANT_FEES_BY_LOCALE",
  constPrefix: "MERCHANT_FEES",
  zh: feesZh,
  en: feesEn,
  sourceNote:
    "SSOT ZH: filix-pay/docs/FilixPay 商户服务与收费规则 V1.md; EN: FilixPay Merchant Service and Fee Rules V1.en.md",
});

// cleanup temp generated json dir if present
const genDir = path.join(legalDir, "_generated");
if (fs.existsSync(genDir)) {
  fs.rmSync(genDir, { recursive: true, force: true });
}

console.log(
  JSON.stringify(
    {
      termsZhSections: termsZh.sections.length,
      termsEnSections: termsEn.sections.length,
      feesZhSections: feesZh.sections.length,
      feesEnSections: feesEn.sections.length,
    },
    null,
    2,
  ),
);
