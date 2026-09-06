import type { LegalBlock, LegalDocument } from "@/content/legal/types";
import type { LegalContentLocale } from "@/lib/legal/content-locales";
import styles from "./legal.module.css";

const LABELS: Record<
  LegalContentLocale,
  {
    effectiveDate: string;
    lastUpdated: string;
  }
> = {
  en: {
    effectiveDate: "Effective Date",
    lastUpdated: "Last Updated",
  },
  zh: {
    effectiveDate: "生效日期",
    lastUpdated: "最后更新",
  },
};

type Props = {
  document: LegalDocument;
  locale: LegalContentLocale;
};

function formatLegalDate(iso: string, locale: LegalContentLocale): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (locale === "zh") {
    return `${year}年${month}月${day}日`;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function BlockContent({
  block,
  headingLevel,
}: {
  block: LegalBlock;
  headingLevel: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const titleClass =
    headingLevel === 2 ? styles.sectionTitle : styles.subsectionTitle;
  const title = block.title.trim();

  return (
    <section id={block.id} className={styles.section}>
      {title ? <Heading className={titleClass}>{title}</Heading> : null}
      {(block.paragraphs ?? []).map((paragraph, index) => (
        <p key={`p-${index}`} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}
      {block.definitions && block.definitions.length > 0 ? (
        <dl className={styles.definitions}>
          {block.definitions.map((item, index) => (
            <div key={`d-${index}`} className={styles.definitionItem}>
              <dt className={styles.definitionTerm}>{item.term}</dt>
              <dd className={styles.definitionText}>{item.text}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {block.bullets && block.bullets.length > 0 ? (
        <ul className={styles.list}>
          {block.bullets.map((item, index) => (
            <li key={`b-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null}
      {block.orderedBullets && block.orderedBullets.length > 0 ? (
        <ol className={styles.orderedList}>
          {block.orderedBullets.map((item, index) => (
            <li key={`o-${index}`}>{item}</li>
          ))}
        </ol>
      ) : null}
      {block.subsections?.map((sub) => (
        <BlockContent key={sub.id} block={sub} headingLevel={3} />
      ))}
    </section>
  );
}

export default function LegalDocumentView({ document, locale }: Props) {
  const labels = LABELS[locale];
  const notice = document.notice?.trim() ?? "";
  const lastUpdated = formatLegalDate(document.lastUpdated, locale);
  const effectiveDate = document.effectiveDate
    ? formatLegalDate(document.effectiveDate, locale)
    : null;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{document.title}</h1>
        <p className={styles.meta}>
          {effectiveDate ? (
            <>
              {labels.effectiveDate}: {effectiveDate}
              <span className={styles.metaSep} aria-hidden>
                ·
              </span>
            </>
          ) : null}
          {labels.lastUpdated}: {lastUpdated}
        </p>
        {notice ? (
          <p className={styles.notice} role="note">
            {notice}
          </p>
        ) : null}
      </header>

      <div className={styles.body}>
        {document.sections.map((section) => (
          <BlockContent key={section.id} block={section} headingLevel={2} />
        ))}
      </div>
    </article>
  );
}
