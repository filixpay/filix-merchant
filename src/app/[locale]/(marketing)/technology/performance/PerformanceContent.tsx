"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";

const SCREENSHOTS = [
    {
        src: "/loadtest/k6-summary.png",
        altKey: "screenshot_summary_alt",
        captionKey: "screenshot_summary_caption",
    },
    {
        src: "/loadtest/monitor-50vu.png",
        altKey: "screenshot_50vu_alt",
        captionKey: "screenshot_50vu_caption",
    },
    {
        src: "/loadtest/monitor-20vu.png",
        altKey: "screenshot_20vu_alt",
        captionKey: "screenshot_20vu_caption",
    },
] as const;

const STABLE_TPS = 141;
const RECOMMENDED_TPS = 100;
const BUSINESS_HOURS = 8;
const PEAK_HOURS = 4;
const OFF_PEAK_HOURS = 4;
/** 非峰值时段按建议 TPS 的 30% 估算日常流量 */
const OFF_PEAK_TPS_RATIO = 0.3;

function formatOrders(value: number, locale: string) {
    return new Intl.NumberFormat(locale).format(value);
}

export default function PerformanceContent() {
    const t = useTranslations("Pages.performance");
    const tc = useTranslations("Pages.common");
    const locale = useLocale();

    const peakOrdersAtLimit = RECOMMENDED_TPS * 3600 * PEAK_HOURS;
    const offPeakOrdersAtLimit =
        Math.round(RECOMMENDED_TPS * OFF_PEAK_TPS_RATIO) * 3600 * OFF_PEAK_HOURS;
    const dailyOrdersAtLimit = peakOrdersAtLimit + offPeakOrdersAtLimit;
    const dailyOrdersAtFlatLimit = RECOMMENDED_TPS * 3600 * BUSINESS_HOURS;
    const peakOrdersAtStable = STABLE_TPS * 3600 * PEAK_HOURS;
    const dailyOrdersAtStable = STABLE_TPS * 3600 * BUSINESS_HOURS;
    const offPeakTps = Math.round(RECOMMENDED_TPS * OFF_PEAK_TPS_RATIO);

    const capacityRows = [
        {
            key: "peak_limit",
            scenario: t("capacity.rows.peak_limit"),
            tps: `${RECOMMENDED_TPS} TPS`,
            orders: formatOrders(peakOrdersAtLimit, locale),
        },
        {
            key: "daily_mixed",
            scenario: t("capacity.rows.daily_mixed"),
            tps: t("capacity.tps_mixed", {
                peak: RECOMMENDED_TPS,
                offPeak: offPeakTps,
            }),
            orders: formatOrders(dailyOrdersAtLimit, locale),
        },
        {
            key: "daily_flat",
            scenario: t("capacity.rows.daily_flat"),
            tps: `${RECOMMENDED_TPS} TPS`,
            orders: formatOrders(dailyOrdersAtFlatLimit, locale),
        },
        {
            key: "peak_stable",
            scenario: t("capacity.rows.peak_stable"),
            tps: `${STABLE_TPS} TPS`,
            orders: formatOrders(peakOrdersAtStable, locale),
        },
        {
            key: "daily_full",
            scenario: t("capacity.rows.daily_full"),
            tps: `${STABLE_TPS} TPS`,
            orders: formatOrders(dailyOrdersAtStable, locale),
        },
    ];

    const metrics = [
        { label: t("metrics.tps"), value: "141" },
        { label: t("metrics.success_rate"), value: "100%" },
        { label: t("metrics.p95"), value: "353 ms" },
        { label: t("metrics.p99"), value: "404 ms" },
    ];

    const methodology = [
        t("methodology.item1"),
        t("methodology.item2"),
        t("methodology.item3"),
        t("methodology.item4"),
    ];

    return (
        <MarketingPage
            badge={t("badge")}
            heroTitle={t("hero_title")}
            heroDesc={t("hero_desc")}
            ctaTitle={t("cta_title")}
            ctaDesc={t("cta_desc")}
            ctaButtonText={tc("contact_sales")}
            ctaButtonHref="mailto:invest@filixpay.com"
        >
            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("metrics_title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("metrics_subtitle")}</p>
                    </div>
                    <div className={styles.metricsGrid}>
                        {metrics.map((item) => (
                            <div key={item.label} className={styles.metricCard}>
                                <div className={styles.metricValue}>{item.value}</div>
                                <div className={styles.metricLabel}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                    <p className={styles.performanceNote}>{t("recommended_limit")}</p>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("capacity.title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("capacity.subtitle")}</p>
                    </div>
                    <p className={styles.articleIntro}>{t("capacity.intro")}</p>
                    <ul className={styles.articleList}>
                        <li>{t("capacity.assumption_hours")}</li>
                        <li>{t("capacity.assumption_peak")}</li>
                        <li>{t("capacity.assumption_off_peak")}</li>
                        <li>{t("capacity.formula")}</li>
                    </ul>
                    <div className={styles.capacityHighlight}>
                        <div className={styles.capacityHighlightItem}>
                            <div className={styles.capacityHighlightValue}>
                                {formatOrders(dailyOrdersAtLimit, locale)}
                            </div>
                            <div className={styles.capacityHighlightLabel}>
                                {t("capacity.highlight_daily")}
                            </div>
                            <p className={styles.capacityHighlightDesc}>
                                {t("capacity.highlight_daily_desc", { offPeak: offPeakTps })}
                            </p>
                        </div>
                        <div className={styles.capacityHighlightItem}>
                            <div className={styles.capacityHighlightValue}>
                                {formatOrders(dailyOrdersAtFlatLimit, locale)}
                            </div>
                            <div className={styles.capacityHighlightLabel}>
                                {t("capacity.highlight_daily_flat")}
                            </div>
                            <p className={styles.capacityHighlightDesc}>
                                {t("capacity.highlight_daily_flat_desc")}
                            </p>
                        </div>
                        <div className={styles.capacityHighlightItem}>
                            <div className={styles.capacityHighlightValue}>
                                {formatOrders(peakOrdersAtLimit, locale)}
                            </div>
                            <div className={styles.capacityHighlightLabel}>
                                {t("capacity.highlight_peak")}
                            </div>
                            <p className={styles.capacityHighlightDesc}>
                                {t("capacity.highlight_peak_desc")}
                            </p>
                        </div>
                    </div>
                    <table className={styles.marketingTable}>
                        <thead>
                            <tr>
                                <th>{t("capacity.table.scenario")}</th>
                                <th>{t("capacity.table.tps")}</th>
                                <th>{t("capacity.table.orders")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {capacityRows.map((row) => (
                                <tr key={row.key}>
                                    <td>{row.scenario}</td>
                                    <td>{row.tps}</td>
                                    <td>{row.orders}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className={styles.performanceNote}>{t("capacity.disclaimer")}</p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("methodology_title")}</h2>
                    </div>
                    <ul className={styles.articleList}>
                        {methodology.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    <div className={styles.performanceMeta}>
                        <div>
                            <span className={styles.performanceMetaLabel}>{t("meta.interface")}</span>
                            <code className={styles.performanceMetaCode}>POST /openapi/v1/orders</code>
                        </div>
                        <div>
                            <span className={styles.performanceMetaLabel}>{t("meta.tool")}</span>
                            <span>Grafana k6</span>
                        </div>
                        <div>
                            <span className={styles.performanceMetaLabel}>{t("meta.duration")}</span>
                            <span>19m 30s</span>
                        </div>
                        <div>
                            <span className={styles.performanceMetaLabel}>{t("meta.orders")}</span>
                            <span>165,229</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("evidence_title")}</h2>
                        <p className={styles.sectionSubtitle}>{t("evidence_subtitle")}</p>
                    </div>
                    <div className={styles.screenshotStack}>
                        {SCREENSHOTS.map((shot) => (
                            <figure key={shot.src} className={styles.screenshotFigure}>
                                <Image
                                    src={shot.src}
                                    alt={t(shot.altKey)}
                                    width={1600}
                                    height={900}
                                    className={styles.screenshotImage}
                                />
                                <figcaption className={styles.screenshotCaption}>
                                    {t(shot.captionKey)}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t("conclusion_title")}</h2>
                    </div>
                    <p className={styles.articleIntro}>{t("conclusion_body")}</p>
                </div>
            </section>
        </MarketingPage>
    );
}
