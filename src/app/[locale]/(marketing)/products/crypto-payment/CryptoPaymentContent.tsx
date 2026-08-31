"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";

const pipelineKeys = ["configure", "checkout", "confirm"] as const;
const nativePointKeys = ["0", "1", "2"] as const;
const walletPointKeys = ["0", "1", "2"] as const;
const extensionPointKeys = ["0", "1", "2"] as const;
const merchantCenterKeys = ["configs", "wallets", "orders"] as const;
const workflowKeys = ["order", "present", "pay", "settle"] as const;
const scenarioKeys = ["cross_border", "chargeback_free", "platform"] as const;
const faqKeys = [
    "what_coins",
    "wallet_required",
    "deposit_modes",
    "nowpayments",
    "chargebacks",
    "refunds",
] as const;

export default function CryptoPaymentContent() {
    const t = useTranslations("Pages.crypto_payment");
    const tc = useTranslations("Pages.common");
    const locale = useLocale();

    const features = pipelineKeys.map((key, index) => ({
        icon: String(index + 1),
        title: t(`pipeline.${key}.title`),
        desc: t(`pipeline.${key}.desc`),
    }));

    return (
        <MarketingPage
            badge={t("title")}
            heroTitle={t("hero_title")}
            heroDesc={t("hero_desc")}
            features={features}
            featuresSectionTitle={tc("key_features")}
            ctaTitle={t("cta.title")}
            ctaDesc={t("cta.desc")}
            ctaButtonText={tc("get_started")}
            ctaButtonHref={`/${locale}/login`}
        >
            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("what.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("what.desc")}</p>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("native.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("native.desc")}</p>
                    </div>
                    <ul className={styles.platformList}>
                        {nativePointKeys.map((key) => (
                            <li key={key}>{t(`native.points.${key}`)}</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("wallets.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("wallets.desc")}</p>
                    </div>
                    <ul className={styles.platformList}>
                        {walletPointKeys.map((key) => (
                            <li key={key}>{t(`wallets.points.${key}`)}</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("extension.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("extension.desc")}</p>
                    </div>
                    <ul className={styles.platformList}>
                        {extensionPointKeys.map((key) => (
                            <li key={key}>{t(`extension.points.${key}`)}</li>
                        ))}
                    </ul>
                    <p style={{ fontSize: "0.875rem", marginTop: "1rem" }}>{t("extension.footnote")}</p>
                </div>
            </section>

            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("merchant_center.title")}</h2>
                    </div>
                    <div className={styles.featureGrid}>
                        {merchantCenterKeys.map((key) => (
                            <div key={key} className={styles.featureCard}>
                                <h3 className={styles.featureCardTitle}>
                                    {t(`merchant_center.items.${key}.title`)}
                                </h3>
                                <p className={styles.featureCardDesc}>
                                    {t(`merchant_center.items.${key}.desc`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("workflow.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("workflow.desc")}</p>
                    </div>
                    <div className={styles.featureGrid}>
                        {workflowKeys.map((key, index) => (
                            <div key={key} className={styles.featureCard}>
                                <div className={styles.featureCardIcon}>{index + 1}</div>
                                <h3 className={styles.featureCardTitle}>
                                    {t(`workflow.steps.${key}.title`)}
                                </h3>
                                <p className={styles.featureCardDesc}>
                                    {t(`workflow.steps.${key}.desc`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.featureGrid}>
                        {scenarioKeys.map((key) => (
                            <div key={key} className={styles.featureCard}>
                                <h3 className={styles.featureCardTitle}>
                                    {t(`scenarios.${key}.title`)}
                                </h3>
                                <p className={styles.featureCardDesc}>
                                    {t(`scenarios.${key}.desc`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div style={{ textAlign: "center" }}>
                        <Link href={`/${locale}/dashboard/developer`} className={styles.btnPrimary}>
                            Explore Developer Capabilities
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("faq.title")}</h2>
                    </div>
                    <div className={styles.featureGrid}>
                        {faqKeys.map((key) => (
                            <div key={key} className={styles.featureCard}>
                                <h3 className={styles.featureCardTitle}>{t(`faq.items.${key}.q`)}</h3>
                                <p className={styles.featureCardDesc}>{t(`faq.items.${key}.a`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MarketingPage>
    );
}
