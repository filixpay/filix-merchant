"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";

interface ChannelRuleItem {
    id: string;
    title: string;
    desc: string;
    flow: {
        title: string;
        steps: string[];
    };
    compliance: {
        title: string;
        items: string[];
    };
}

export default function PaymentSplittingContent() {
    const t = useTranslations("Pages.payment_splitting");
    const tc = useTranslations("Pages.common");
    const locale = useLocale();

    const scenarioKeys = [
        "marketplace",
        "commission",
        "saas",
        "chain",
        "cross_border",
        "partner",
    ];

    const featureKeys = [
        "multi_receiver",
        "commission",
        "settlement",
        "webhook",
    ];

    const workflowKeys = [
        "pay",
        "receive",
        "calculate",
        "credit",
        "settle",
        "reconcile",
    ];

    const ruleKeys = [
        "fixed_amount",
        "percentage",
        "commission",
        "receiver",
        "currency",
        "cycle",
    ];

    const exceptionKeys = [
        "receiver_unavailable",
        "rule_mismatch",
        "refund_after_split",
        "partial_failure",
        "settlement_pending",
        "reconciliation_difference",
    ];

    const faqKeys = [
        "what_is",
        "difference_from_payout",
        "multiple_receivers",
        "platform_commission",
        "refunds",
        "reconciliation",
        "api_webhook",
    ];

    const features = featureKeys.map((key) => ({
        icon: t(`features.${key}.icon`),
        title: t(`features.${key}.title`),
        desc: t(`features.${key}.desc`),
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
                    <div className={styles.featureGrid}>
                        {scenarioKeys.map((key) => (
                            <div key={key} className={styles.featureCard}>
                                <div className={styles.featureCardIcon}>{t(`scenarios.${key}.icon`)}</div>
                                <h3 className={styles.featureCardTitle}>{t(`scenarios.${key}.title`)}</h3>
                                <p className={styles.featureCardDesc}>{t(`scenarios.${key}.desc`)}</p>
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
                                <h3 className={styles.featureCardTitle}>{t(`workflow.steps.${key}.title`)}</h3>
                                <p className={styles.featureCardDesc}>{t(`workflow.steps.${key}.desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("rules.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("rules.desc")}</p>
                    </div>
                    <div className={styles.featureGrid}>
                        {ruleKeys.map((key) => (
                            <div key={key} className={styles.featureCard}>
                                <div className={styles.featureCardIcon}>{t(`rules.items.${key}.icon`)}</div>
                                <h3 className={styles.featureCardTitle}>{t(`rules.items.${key}.title`)}</h3>
                                <p className={styles.featureCardDesc}>{t(`rules.items.${key}.desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("settlement.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("settlement.desc")}</p>
                    </div>
                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureCardIcon}>📄</div>
                            <h3 className={styles.featureCardTitle}>{t("settlement.records.title")}</h3>
                            <p className={styles.featureCardDesc}>{t("settlement.records.desc")}</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureCardIcon}>📊</div>
                            <h3 className={styles.featureCardTitle}>{t("settlement.bills.title")}</h3>
                            <p className={styles.featureCardDesc}>{t("settlement.bills.desc")}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("exceptions.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("exceptions.desc")}</p>
                    </div>
                    <div className={styles.featureGrid}>
                        {exceptionKeys.map((key) => (
                            <div key={key} className={styles.featureCard}>
                                <div className={styles.featureCardIcon}>!</div>
                                <h3 className={styles.featureCardTitle}>{t(`exceptions.items.${key}.title`)}</h3>
                                <p className={styles.featureCardDesc}>{t(`exceptions.items.${key}.desc`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("channel_rules.title")}</h2>
                    </div>
                    
                    <div className={styles.channelRulesGrid}>
                        {(t.raw("channel_rules.items") as ChannelRuleItem[]).map((item) => (
                            <div key={item.id} className={styles.platformCard}>
                                <h3 className={styles.platformTitle}>{item.title}</h3>
                                <p className={styles.platformDesc}>{item.desc}</p>
                                
                                <h4 className={styles.platformDetailTitle}>{item.flow.title}</h4>
                                <ul className={styles.platformList}>
                                    {item.flow.steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ul>
                                
                                <h4 className={styles.platformDetailTitle}>{item.compliance.title}</h4>
                                <ul className={styles.platformList}>
                                    {item.compliance.items.map((point, i) => (
                                        <li key={i}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.marketingTable}>
                            <thead>
                                <tr>
                                    {(t.raw("channel_rules.comparison.headers") as string[]).map((header, i) => (
                                        <th key={i}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(t.raw("channel_rules.comparison.rows") as string[][]).map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td key={j}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("developer.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("developer.desc")}</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <Link href={`/${locale}/dashboard/developer`} className={styles.btnPrimary}>
                            {t("developer.cta")}
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
