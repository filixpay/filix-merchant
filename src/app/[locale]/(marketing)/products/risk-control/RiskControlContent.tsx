"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";

const pipelineKeys = ["rules", "monitor", "coverage"] as const;
const moduleKeys = ["rules", "monitor", "coverage"] as const;
const audienceKeys = ["cross_border", "marketplace", "high_risk"] as const;
const deliveryModeKeys = ["self_config", "platform_subscription"] as const;
const providerKeys = ["signifyd", "riskified", "forter"] as const;
const workflowKeys = ["checkout", "rules", "review", "coverage"] as const;
const faqKeys = [
    "what_is",
    "vs_chargeback",
    "rule_engine",
    "flagged_review",
    "coverage_eligibility",
    "coverage_providers",
    "crypto_relation",
] as const;
const pointKeys = ["0", "1", "2"] as const;

export default function RiskControlContent() {
    const t = useTranslations("Pages.risk_control");
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
            {moduleKeys.map((key, index) => (
                <section
                    key={key}
                    className={index % 2 === 0 ? styles.section : styles.sectionAlt}
                >
                    <div className={styles.sectionContainer}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>{t(`modules.${key}.title`)}</h2>
                            <p className={styles.sectionSubtitle}>{t(`modules.${key}.desc`)}</p>
                        </div>
                        <ul className={styles.platformList}>
                            {pointKeys.map((pointKey) => (
                                <li key={pointKey}>{t(`modules.${key}.points.${pointKey}`)}</li>
                            ))}
                        </ul>
                        {key === "coverage" && (
                            <p style={{ fontSize: "0.875rem" }}>{t("modules.coverage.disclaimer")}</p>
                        )}
                    </div>
                </section>
            ))}

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("delivery_modes.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("delivery_modes.desc")}</p>
                    </div>
                    <div className={styles.channelRulesGrid}>
                        {deliveryModeKeys.map((key) => (
                            <div key={key} className={styles.platformCard}>
                                <div className={styles.featureCardIcon}>
                                    {t(`delivery_modes.items.${key}.icon`)}
                                </div>
                                <h3 className={styles.platformTitle}>
                                    {t(`delivery_modes.items.${key}.title`)}
                                </h3>
                                <p className={styles.platformDesc}>
                                    {t(`delivery_modes.items.${key}.desc`)}
                                </p>
                                <ul className={styles.platformList}>
                                    {pointKeys.map((pointKey) => (
                                        <li key={pointKey}>
                                            {t(`delivery_modes.items.${key}.points.${pointKey}`)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("providers.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("providers.desc")}</p>
                    </div>
                    <div className={styles.channelRulesGrid}>
                        {providerKeys.map((key) => (
                            <div key={key} className={styles.platformCard}>
                                <h3 className={styles.platformTitle}>{t(`providers.items.${key}.name`)}</h3>
                                <p className={styles.platformDesc}>{t(`providers.items.${key}.tagline`)}</p>
                                <p className={styles.platformDesc}>{t(`providers.items.${key}.desc`)}</p>
                            </div>
                        ))}
                    </div>
                    <p style={{ fontSize: "0.875rem", marginTop: "1.5rem", textAlign: "center" }}>
                        {t("providers.footnote")}
                    </p>
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
                                <h3 className={styles.featureCardTitle}>
                                    {t(`audience.items.${key}.title`)}
                                </h3>
                                <p className={styles.featureCardDesc}>
                                    {t(`audience.items.${key}.desc`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.sectionAlt}>
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
                    <div style={{ textAlign: "center" }}>
                        <Link href={`/${locale}/dashboard/developer`} className={styles.btnPrimary}>
                            Explore Developer Capabilities
                        </Link>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
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
