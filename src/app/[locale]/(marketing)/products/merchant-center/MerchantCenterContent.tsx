"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";

const featureKeys = [
  "transactions",
  "settlement",
  "reporting",
  "api_credentials",
  "webhooks",
  "team_permissions",
  "self_hosted_checkout",
] as const;
const audienceKeys = ["merchants", "platforms", "enterprises"] as const;
const linkKeys = ["payment_platform", "developers", "payment_splitting"] as const;
const checkoutBenefitKeys = ["brand", "compliance", "open_source", "low_cost"] as const;
const checkoutStepKeys = ["credentials", "docker", "domain"] as const;
const pointKeys = ["0", "1", "2"] as const;

const CHECKOUT_DEPLOYMENT_DOC_URL =
  "https://github.com/filixpay/filix-checkout/blob/main/docs/merchant-deployment.md";

const linkPaths: Record<(typeof linkKeys)[number], string> = {
  payment_platform: "/products/payment-platform",
  developers: "/developers",
  payment_splitting: "/products/payment-splitting",
};

export default function MerchantCenterContent() {
  const t = useTranslations("Pages.merchant_center");
  const locale = useLocale();

  const features = featureKeys.map((key) => ({
    icon: t(`features.${key}.icon`),
    title: t(`features.${key}.title`),
    desc: t(`features.${key}.desc`),
  }));

  const loginHref = `/${locale}/login?portal=merchant`;

  return (
    <MarketingPage
      badge={t("badge")}
      heroTitle={t("hero_title")}
      heroDesc={t("hero_desc")}
      heroDescExtra={t("hero_desc_extra")}
      features={features}
      featuresSectionTitle={t("features_title")}
      heroPrimaryText={t("cta.primary")}
      heroPrimaryHref={loginHref}
      heroSecondaryText={t("cta.secondary")}
      heroSecondaryHref={`/${locale}/developers`}
      ctaTitle={t("cta.title")}
      ctaDesc={t("cta.desc")}
      ctaButtonText={t("cta.primary")}
      ctaButtonHref={loginHref}
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

      <section id="checkout-deployment" className={styles.sectionAlt}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("checkout_deployment.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("checkout_deployment.desc")}</p>
          </div>
          <div className={styles.featureGrid}>
            {checkoutBenefitKeys.map((key) => (
              <div key={key} className={styles.featureCard}>
                <h3 className={styles.featureCardTitle}>{t(`checkout_deployment.benefits.${key}.title`)}</h3>
                <p className={styles.featureCardDesc}>{t(`checkout_deployment.benefits.${key}.desc`)}</p>
              </div>
            ))}
          </div>
          <div className={styles.channelRulesGrid} style={{ marginTop: 32 }}>
            {checkoutStepKeys.map((key) => (
              <div key={key} className={styles.platformCard}>
                <h3 className={styles.platformTitle}>{t(`checkout_deployment.steps.${key}.title`)}</h3>
                <p className={styles.platformDesc}>{t(`checkout_deployment.steps.${key}.desc`)}</p>
              </div>
            ))}
          </div>
          <p className={styles.sectionSubtitle} style={{ marginTop: 32, marginBottom: 24 }}>
            {t("checkout_deployment.note")}
          </p>
          <div className={styles.heroActions} style={{ justifyContent: "center" }}>
            <a
              href={CHECKOUT_DEPLOYMENT_DOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              {t("checkout_deployment.cta_docs")}
            </a>
            <Link
              href={`/${locale}/developers#checkout-deployment`}
              className={styles.btnSecondary}
              style={{ color: "#1e293b", background: "#ffffff", border: "1px solid #cbd5e1" }}
            >
              {t("checkout_deployment.cta_developers")}
            </Link>
            <Link
              href={`/${locale}/products/private-deployment#deployment-comparison`}
              className={styles.btnSecondary}
              style={{ color: "#1e293b", background: "#ffffff", border: "1px solid #cbd5e1" }}
            >
              {t("checkout_deployment.cta_compare")}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("audience.title")}</h2>
            <p className={styles.sectionSubtitle}>{t("audience.desc")}</p>
          </div>
          <div className={styles.featureGrid}>
            {audienceKeys.map((key) => (
              <div key={key} className={styles.featureCard}>
                <h3 className={styles.featureCardTitle}>{t(`audience.items.${key}.title`)}</h3>
                <p className={styles.featureCardDesc}>{t(`audience.items.${key}.desc`)}</p>
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
