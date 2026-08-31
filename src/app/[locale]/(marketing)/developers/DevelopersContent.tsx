"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";

const featureKeys = ["api", "sdk", "sandbox", "webhooks"] as const;
const quickStartKeys = ["0", "1", "2"] as const;
const linkKeys = ["payment_platform", "merchant_center"] as const;
const pointKeys = ["0", "1", "2"] as const;

const CHECKOUT_DEPLOYMENT_DOC_URL =
  "https://github.com/filixpay/filix-checkout/blob/main/docs/merchant-deployment.md";

const linkPaths: Record<(typeof linkKeys)[number], string> = {
  payment_platform: "/products/payment-platform",
  merchant_center: "/products/merchant-center",
};

export default function DevelopersContent() {
  const t = useTranslations("Pages.developers");
  const locale = useLocale();

  const features = featureKeys.map((key) => ({
    icon: t(`features.${key}.icon`),
    title: t(`features.${key}.title`),
    desc: t(`features.${key}.desc`),
  }));

  const developerConsoleHref = `/${locale}/login?portal=merchant&callbackUrl=/${locale}/dashboard/developer`;

  return (
    <MarketingPage
      badge={t("badge")}
      heroTitle={t("hero_title")}
      heroDesc={t("hero_desc")}
      heroDescExtra={t("hero_desc_extra")}
      features={features}
      featuresSectionTitle={t("features_title")}
      heroPrimaryText={t("cta.primary")}
      heroPrimaryHref={`/${locale}/developers#quick-start`}
      heroSecondaryText={t("cta.secondary")}
      heroSecondaryHref={developerConsoleHref}
      ctaTitle={t("cta.title")}
      ctaDesc={t("cta.desc")}
      ctaButtonText={t("cta.primary")}
      ctaButtonHref={`/${locale}/developers#quick-start`}
    >
      {featureKeys.map((key, index) => (
        <section
          key={key}
          id={key === "api" ? "api" : undefined}
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

      <section id="quick-start" className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("quick_start.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("quick_start.desc")}</p>
          </div>
          <ol className={styles.platformList}>
            {quickStartKeys.map((stepKey) => (
              <li key={stepKey}>{t(`quick_start.steps.${stepKey}`)}</li>
            ))}
          </ol>
        </div>
      </section>

      <section id="checkout-deployment" className={styles.sectionAlt}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("checkout_deployment.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("checkout_deployment.desc")}</p>
          </div>
          <ul className={styles.platformList}>
            {pointKeys.map((pointKey) => (
              <li key={pointKey}>{t(`checkout_deployment.points.${pointKey}`)}</li>
            ))}
          </ul>
          <div className={styles.heroActions} style={{ justifyContent: "center", marginTop: 32 }}>
            <a
              href={CHECKOUT_DEPLOYMENT_DOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              {t("checkout_deployment.cta_docs")}
            </a>
            <Link
              href={`/${locale}/products/merchant-center#checkout-deployment`}
              className={styles.btnSecondary}
              style={{ color: "#1e293b", background: "#ffffff", border: "1px solid #cbd5e1" }}
            >
              {t("checkout_deployment.cta_merchant_center")}
            </Link>
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
