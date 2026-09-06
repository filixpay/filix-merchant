"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";
import { GITHUB_ORG_URL, OPEN_SOURCE_PROJECTS } from "@/lib/open-source";

const projectKeys = ["checkout", "saleor", "merchant"] as const;

export default function OpenSourceHubContent() {
  const t = useTranslations("Pages.open_source");
  const tc = useTranslations("Pages.common");
  const locale = useLocale();

  return (
    <MarketingPage
      badge={t("badge")}
      heroTitle={t("hero_title")}
      heroDesc={t("hero_desc")}
      heroDescExtra={t("hero_desc_extra")}
      heroPrimaryText={t("cta.github")}
      heroPrimaryHref={GITHUB_ORG_URL}
      heroSecondaryText={t("cta.developers")}
      heroSecondaryHref={`/${locale}/developers`}
      ctaTitle={t("cta.title")}
      ctaDesc={t("cta.desc")}
      ctaButtonText={t("cta.github")}
      ctaButtonHref={GITHUB_ORG_URL}
    >
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("projects.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("projects.subtitle")}</p>
          </div>
          <div className={styles.featureGrid}>
            {projectKeys.map((key) => {
              const project = OPEN_SOURCE_PROJECTS[key];
              return (
                <Link
                  key={key}
                  href={`/${locale}${project.path}`}
                  className={styles.featureCard}
                >
                  <div className={styles.featureCardIcon}>{t(`projects.${key}.icon`)}</div>
                  <h3 className={styles.featureCardTitle}>{t(`projects.${key}.title`)}</h3>
                  <p className={styles.featureCardDesc}>{t(`projects.${key}.desc`)}</p>
                  <div
                    className={styles.btnSecondary}
                    style={{
                      marginTop: "auto",
                      alignSelf: "flex-start",
                      padding: "8px 16px",
                      fontSize: "14px",
                    }}
                  >
                    {tc("learn_more")}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("architecture.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("architecture.desc")}</p>
          </div>
          <pre className={styles.archDiagram}>{t("architecture.diagram")}</pre>
          <p className={styles.sectionSubtitle} style={{ marginTop: 24 }}>
            {t("architecture.boundary")}
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("licensing.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("licensing.desc")}</p>
          </div>
          <div className={styles.heroActions} style={{ justifyContent: "center" }}>
            <Link
              href={`/${locale}/products/private-deployment`}
              className={styles.btnSecondary}
              style={{ color: "#1e293b", background: "#ffffff", border: "1px solid #cbd5e1" }}
            >
              {t("licensing.cta")}
            </Link>
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
