"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";
import {
  GITHUB_ORG_URL,
  OPEN_SOURCE_PROJECTS,
  type OpenSourceProjectKey,
} from "@/lib/open-source";

const featureKeys = ["0", "1", "2", "3", "4"] as const;
const ecosystemKeys = ["checkout", "saleor", "merchant"] as const;

type Props = {
  projectKey: OpenSourceProjectKey;
  messageKey: "open_source_checkout" | "open_source_saleor" | "open_source_merchant";
};

export default function OpenSourceProjectContent({ projectKey, messageKey }: Props) {
  const t = useTranslations(`Pages.${messageKey}`);
  const th = useTranslations("Pages.open_source");
  const locale = useLocale();
  const project = OPEN_SOURCE_PROJECTS[projectKey];

  const features = featureKeys.map((key) => ({
    icon: t(`features.${key}.icon`),
    title: t(`features.${key}.title`),
    desc: t(`features.${key}.desc`),
  }));

  return (
    <MarketingPage
      badge={t("badge")}
      heroTitle={t("hero_title")}
      heroDesc={t("hero_desc")}
      heroDescExtra={t("hero_desc_extra")}
      features={features}
      featuresSectionTitle={t("features_title")}
      heroPrimaryText={t("cta.github")}
      heroPrimaryHref={project.github}
      heroSecondaryText={t("cta.hub")}
      heroSecondaryHref={`/${locale}/open-source`}
      ctaTitle={t("cta.title")}
      ctaDesc={t("cta.desc")}
      ctaButtonText={t("cta.github")}
      ctaButtonHref={project.github}
    >
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
            <h2 className={styles.sectionTitle}>{t("getting_started.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("getting_started.desc")}</p>
          </div>
          <div className={styles.heroActions} style={{ justifyContent: "center" }}>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              {t("cta.github")}
            </a>
            <a
              href={GITHUB_ORG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
              style={{ color: "#1e293b", background: "#ffffff", border: "1px solid #cbd5e1" }}
            >
              {t("cta.org")}
            </a>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("ecosystem.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("ecosystem.desc")}</p>
          </div>
          <div className={styles.channelRulesGrid}>
            {ecosystemKeys.map((key) => {
              const item = OPEN_SOURCE_PROJECTS[key];
              const isCurrent = key === projectKey;
              return (
                <Link
                  key={key}
                  href={`/${locale}${item.path}`}
                  className={styles.platformCard}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <h3 className={styles.platformTitle}>{th(`projects.${key}.title`)}</h3>
                  <p className={styles.platformDesc}>{th(`projects.${key}.role`)}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
