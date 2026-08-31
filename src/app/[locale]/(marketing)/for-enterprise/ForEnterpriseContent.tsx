"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";

const featureKeys = ["multi_org", "multi_merchant", "rbac", "isolation"] as const;
const linkKeys = ["payment_platform"] as const;
const pointKeys = ["0", "1", "2"] as const;

const linkPaths: Record<(typeof linkKeys)[number], string> = {
  payment_platform: "/products/payment-platform",
};

export default function ForEnterpriseContent() {
  const t = useTranslations("Pages.for_enterprise");
  const locale = useLocale();

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
      heroPrimaryText={t("cta.primary")}
      heroPrimaryHref="mailto:invest@filixpay.com"
      heroSecondaryText={t("cta.secondary")}
      heroSecondaryHref={`/${locale}/products/payment-platform`}
      ctaTitle={t("cta.title")}
      ctaDesc={t("cta.desc")}
      ctaButtonText={t("cta.primary")}
      ctaButtonHref="mailto:invest@filixpay.com"
    >
      {featureKeys.map((key, index) => (
        <section
          key={key}
          className={index % 2 === 0 ? styles.sectionAlt : styles.section}
        >
          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t(`features.${key}.title`)}</h2>
              <p className={styles.sectionSubtitle}>{t(`features.${key}.detail_desc`)}</p>
            </div>
            <ul className={styles.platformList}>
              {pointKeys.map((pointKey) => (
                <li key={pointKey}>{t(`features.${key}.points.${pointKey}`)}</li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className={styles.sectionAlt}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("private_deployment.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("private_deployment.desc")}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("links.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("links.desc")}</p>
          </div>
          <div className={styles.channelRulesGrid}>
            {linkKeys.map((key) => (
              <Link
                key={key}
                href={`/${locale}${linkPaths[key]}`}
                className={styles.platformCard}
              >
                <h3 className={styles.platformTitle}>{t(`links.${key}.title`)}</h3>
                <p className={styles.platformDesc}>{t(`links.${key}.desc`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MarketingPage>
  );
}
