import type { LegalDocument } from "@/content/legal/types";
import type { LegalContentLocale } from "@/lib/legal/content-locales";
import styles from "./legal.module.css";

const LABELS: Record<
  LegalContentLocale,
  {
    effectiveDate: string;
    lastUpdated: string;
    toBeConfirmed: string;
  }
> = {
  en: {
    effectiveDate: "Effective Date",
    lastUpdated: "Last Updated",
    toBeConfirmed: "To be confirmed",
  },
  zh: {
    effectiveDate: "生效日期",
    lastUpdated: "最后更新",
    toBeConfirmed: "待确认",
  },
};

type Props = {
  document: LegalDocument;
  locale: LegalContentLocale;
};

export default function LegalDocumentView({ document, locale }: Props) {
  const labels = LABELS[locale];
  const effective =
    document.effectiveDate ?? labels.toBeConfirmed;
  const updated = document.lastUpdated ?? labels.toBeConfirmed;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{document.title}</h1>
        <p className={styles.meta}>
          {labels.effectiveDate}: {effective}
          <span className={styles.metaSep} aria-hidden>
            ·
          </span>
          {labels.lastUpdated}: {updated}
        </p>
        <p className={styles.notice} role="note">
          {document.notice}
        </p>
      </header>

      <div className={styles.body}>
        {document.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={styles.section}
          >
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
