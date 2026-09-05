import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HELP_DOMAINS } from "@/content/help/domains";
import type { HelpArticle } from "@/content/help/types";
import { getHelpHref } from "@/content/help/loaders";
import {
  isHelpContentLocale,
  type HelpContentLocale,
} from "@/lib/help/content-locales";
import { ORGANIZATION_EMAIL } from "@/lib/seo/constants";
import styles from "./help.module.css";

type Props = {
  locale: string;
  startHereArticles: HelpArticle[];
};

function titleLocale(locale: string): HelpContentLocale {
  return isHelpContentLocale(locale) ? locale : "en";
}

export default async function HelpHomeView({
  locale,
  startHereArticles,
}: Props) {
  const t = await getTranslations({ locale, namespace: "Help" });
  const domainLocale = titleLocale(locale);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t("home_title")}</h1>
        <p className={styles.pageDesc}>{t("home_description")}</p>
      </header>

      <div className={styles.searchBox}>
        <label className={styles.srOnly} htmlFor="help-search">
          {t("search_placeholder")}
        </label>
        <input
          id="help-search"
          type="search"
          name="q"
          className={styles.searchInput}
          placeholder={t("search_placeholder")}
          autoComplete="off"
          // Wired in Task 10 (HelpSearch)
          readOnly
          aria-disabled="true"
        />
      </div>

      <section className={styles.section} aria-labelledby="help-start-here">
        <h2 id="help-start-here" className={styles.sectionTitle}>
          {t("start_here")}
        </h2>
        <ol className={styles.checklist}>
          {startHereArticles.map((article) => (
            <li key={article.slug}>
              <Link
                href={getHelpHref(locale, article.slug)}
                className={styles.articleLink}
              >
                <span className={styles.articleTitle}>{article.title}</span>
                {article.description ? (
                  <span className={styles.articleBlurb}>
                    {article.description}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="help-browse">
        <h2 id="help-browse" className={styles.sectionTitle}>
          {t("browse_all")}
        </h2>
        <ul className={styles.domainGrid}>
          {HELP_DOMAINS.map((domain) => (
            <li key={domain.id}>
              <Link
                href={`/${locale}/help/${domain.id}`}
                className={styles.domainCard}
              >
                <span className={styles.domainCardTitle}>
                  {domain.title[domainLocale]}
                </span>
                <span className={styles.domainCardDesc}>
                  {domain.description[domainLocale]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="help-still-need">
        <h2 id="help-still-need" className={styles.sectionTitle}>
          {t("still_need_help")}
        </h2>
        <p className={styles.supportLine}>
          <a href={`mailto:${ORGANIZATION_EMAIL}`} className={styles.supportLink}>
            {ORGANIZATION_EMAIL}
          </a>
        </p>
      </section>
    </div>
  );
}
