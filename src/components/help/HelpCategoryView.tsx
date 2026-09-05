import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { HelpDomainMeta } from "@/content/help/domains";
import type { HelpArticle } from "@/content/help/types";
import { getHelpHref } from "@/content/help/loaders";
import {
  isHelpContentLocale,
  type HelpContentLocale,
} from "@/lib/help/content-locales";
import styles from "./help.module.css";

type Props = {
  locale: string;
  domain: HelpDomainMeta;
  articles: HelpArticle[];
};

function titleLocale(locale: string): HelpContentLocale {
  return isHelpContentLocale(locale) ? locale : "en";
}

export default async function HelpCategoryView({
  locale,
  domain,
  articles,
}: Props) {
  const t = await getTranslations({ locale, namespace: "Help" });
  const domainLocale = titleLocale(locale);
  const title = domain.title[domainLocale];
  const description = domain.description[domainLocale];

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href={`/${locale}`}>{domainLocale === "zh" ? "首页" : "Home"}</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">
          /
        </span>
        <Link href={`/${locale}/help`}>{t("home_title")}</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">
          /
        </span>
        <span aria-current="page">{title}</span>
      </nav>

      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <p className={styles.pageDesc}>{description}</p>
      </header>

      {articles.length === 0 ? (
        <p className={styles.comingSoon}>{t("coming_soon")}</p>
      ) : (
        <ul className={styles.articleList}>
          {articles.map((article) => (
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
        </ul>
      )}
    </div>
  );
}
