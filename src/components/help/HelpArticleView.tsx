import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { HelpArticle, HelpBodyBlock } from "@/content/help/types";
import type { HelpDomainMeta } from "@/content/help/domains";
import { getHelpHref } from "@/content/help/loaders";
import {
  isHelpContentLocale,
  type HelpContentLocale,
} from "@/lib/help/content-locales";
import HelpOpenInDashboard from "./HelpOpenInDashboard";
import HelpHashScroll from "./HelpHashScroll";
import styles from "./help.module.css";

type Props = {
  locale: string;
  domain: HelpDomainMeta;
  article: HelpArticle;
  related: HelpArticle[];
  prev: HelpArticle | null;
  next: HelpArticle | null;
};

function titleLocale(locale: string): HelpContentLocale {
  return isHelpContentLocale(locale) ? locale : "en";
}

function nextStepHref(locale: string, href: string): string {
  if (href.startsWith("/help/")) {
    return `/${locale}${href}`;
  }
  if (href.startsWith(`/${locale}/`)) {
    return href;
  }
  return getHelpHref(locale, href.replace(/^\/+/, ""));
}

function BodyBlocks({ blocks }: { blocks: HelpBodyBlock[] }) {
  return (
    <div className={styles.articleBlocks}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "paragraph":
            return (
              <p key={key} className={styles.articleParagraph}>
                {block.text}
              </p>
            );
          case "heading":
            return (
              <h2
                key={key}
                id={block.anchor}
                className={styles.articleHeading}
              >
                {block.text}
              </h2>
            );
          case "steps":
            return (
              <ol key={key} className={styles.articleSteps}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          case "fields":
            return (
              <div key={key} className={styles.fieldsWrap}>
                <table className={styles.fieldsTable}>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.field}>
                        <th scope="row">{row.field}</th>
                        <td>{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "issues":
            return (
              <ul key={key} className={styles.issuesList}>
                {block.items.map((item) => (
                  <li key={item.problem}>
                    <p className={styles.issueProblem}>{item.problem}</p>
                    <p className={styles.issueSolution}>{item.solution}</p>
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default async function HelpArticleView({
  locale,
  domain,
  article,
  related,
  prev,
  next,
}: Props) {
  const t = await getTranslations({ locale, namespace: "Help" });
  const domainLocale = titleLocale(locale);
  const domainTitle = domain.heading[domainLocale];
  const body = article.body;
  const dashboardLinks = article.dashboardLinks ?? [];

  return (
    <article className={styles.page}>
      <HelpHashScroll />
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href={`/${locale}`}>
          {domainLocale === "zh" ? "首页" : "Home"}
        </Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">
          /
        </span>
        <Link href={`/${locale}/help`}>{t("home_nav")}</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">
          /
        </span>
        <Link href={`/${locale}/help/${domain.id}`}>{domainTitle}</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">
          /
        </span>
        <span aria-current="page">{article.title}</span>
      </nav>

      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{article.title}</h1>
        {article.description ? (
          <p className={styles.pageDesc}>{article.description}</p>
        ) : null}
      </header>

      {dashboardLinks.length > 0 ? (
        <HelpOpenInDashboard locale={locale} links={dashboardLinks} />
      ) : null}

      {body ? (
        <section className={styles.overview} aria-label={t("in_this_guide")}>
          <div className={styles.overviewItem}>
            <h2 className={styles.overviewLabel}>{t("who_this_is_for")}</h2>
            <p className={styles.overviewText}>{body.whoFor}</p>
          </div>
          <div className={styles.overviewItem}>
            <h2 className={styles.overviewLabel}>{t("when_to_use")}</h2>
            <p className={styles.overviewText}>{body.whenToUse}</p>
          </div>
          {body.beforeYouStart.length > 0 ? (
            <div className={styles.overviewItem}>
              <h2 className={styles.overviewLabel}>{t("before_you_start")}</h2>
              <ul className={styles.beforeList}>
                {body.beforeYouStart.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {body?.blocks?.length ? <BodyBlocks blocks={body.blocks} /> : null}

      {related.length > 0 ? (
        <section className={styles.section} aria-labelledby="help-related">
          <h2 id="help-related" className={styles.sectionTitle}>
            {t("related_guides")}
          </h2>
          <ul className={styles.articleList}>
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={getHelpHref(locale, item.slug)}
                  className={styles.articleLink}
                >
                  <span className={styles.articleTitle}>{item.title}</span>
                  {item.description ? (
                    <span className={styles.articleBlurb}>
                      {item.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {article.marketingPath || article.developerPath ? (
        <section className={styles.section} aria-labelledby="help-outbound">
          <h2 id="help-outbound" className={styles.sectionTitle}>
            {t("outbound.section_title")}
          </h2>
          <div className={styles.outboundGroup}>
            {article.marketingPath ? (
              <Link
                href={`/${locale}${article.marketingPath}`}
                className={styles.outboundLink}
              >
                {t("outbound.marketing")}
              </Link>
            ) : null}
            {article.developerPath ? (
              <Link
                href={
                  article.developerPath.startsWith("http")
                    ? article.developerPath
                    : `/${locale}${article.developerPath}`
                }
                className={styles.outboundLink}
                {...(article.developerPath.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {t("outbound.developer_docs")}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {body?.nextStep ? (
        <section className={styles.nextStep} aria-labelledby="help-next-step">
          <h2 id="help-next-step" className={styles.sectionTitle}>
            {t("next_step")}
          </h2>
          <Link
            href={nextStepHref(locale, body.nextStep.href)}
            className={styles.nextStepLink}
          >
            {body.nextStep.label}
          </Link>
        </section>
      ) : null}

      {prev || next ? (
        <nav className={styles.prevNext} aria-label={t("browse_all")}>
          {prev ? (
            <Link
              href={getHelpHref(locale, prev.slug)}
              className={styles.prevNextLink}
            >
              <span className={styles.prevNextLabel}>{t("previous")}</span>
              <span className={styles.prevNextTitle}>{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={getHelpHref(locale, next.slug)}
              className={`${styles.prevNextLink} ${styles.prevNextLinkEnd}`}
            >
              <span className={styles.prevNextLabel}>{t("next")}</span>
              <span className={styles.prevNextTitle}>{next.title}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}
