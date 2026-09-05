import type { HelpArticle, HelpBody, HelpBodyBlock } from "./types";
import { listHelpArticles } from "./loaders";

function flattenBlock(block: HelpBodyBlock): string {
  switch (block.type) {
    case "heading":
    case "paragraph":
      return block.text;
    case "steps":
      return block.items.join(" ");
    case "fields":
      return block.rows.map((r) => `${r.field} ${r.description}`).join(" ");
    case "issues":
      return block.items.map((i) => `${i.problem} ${i.solution}`).join(" ");
    default:
      return "";
  }
}

/** Plain-text flatten of typed HelpBody for search — not HTML/React. */
export function flattenHelpBody(body: HelpBody | undefined): string {
  if (!body) return "";
  const parts = [
    body.whoFor,
    body.whenToUse,
    ...body.beforeYouStart,
    ...body.blocks.map(flattenBlock),
    body.nextStep?.label ?? "",
  ];
  return parts.filter(Boolean).join(" ");
}

export type HelpSearchHit = { slug: string; title: string; description: string };

export function searchHelpArticles(locale: string, query: string): HelpSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  // publishedOnly: true — published:false never enters the index
  return listHelpArticles(locale, { publishedOnly: true })
    .filter((a: HelpArticle) => {
      const hay = [
        a.title,
        a.description,
        ...(a.keywords ?? []),
        flattenHelpBody(a.body),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    })
    .map((a) => ({ slug: a.slug, title: a.title, description: a.description }));
}
