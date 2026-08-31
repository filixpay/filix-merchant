"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";

const featureKeys = ["connectivity", "transactions", "settlement", "merchant_ops"] as const;
const businessModelKeys = ["direct", "platform", "enterprise"] as const;
const linkKeys = ["merchant_center", "developers", "payment_splitting", "for_enterprise"] as const;
const pointKeys = ["0", "1", "2"] as const;

const linkPaths: Record<(typeof linkKeys)[number], string> = {
  merchant_center: "/products/merchant-center",
  developers: "/developers",
  payment_splitting: "/products/payment-splitting",
  for_enterprise: "/for-enterprise",
};

export default function PaymentPlatformContent() {
  const t = useTranslations("Pages.payment_platform");
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
      heroPrimaryHref={`/${locale}/products/merchant-center`}
      heroSecondaryText={t("cta.secondary")}
      heroSecondaryHref={`/${locale}/login?portal=merchant`}
      ctaTitle={t("cta.title")}
      ctaDesc={t("cta.desc")}
      ctaButtonText={t("cta.primary")}
      ctaButtonHref={`/${locale}/products/merchant-center`}
    >
      {featureKeys.map((key, index) => (
        <section
          key={key}
          id={key === "transactions" ? "transactions" : undefined}
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

      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("business_models.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("business_models.desc")}</p>
          </div>
          <div className={styles.featureGrid}>
            {businessModelKeys.map((key) => (
              <div key={key} className={styles.featureCard}>
                <h3 className={styles.featureCardTitle}>
                  {t(`business_models.items.${key}.title`)}
                </h3>
                <p className={styles.featureCardDesc}>
                  {t(`business_models.items.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
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
