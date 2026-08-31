"use client";

import { Button, Card } from "antd";
import {
    BankOutlined,
    BarChartOutlined,
    FieldTimeOutlined,
    PercentageOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { WidgetResultDto } from "@/lib/api/domains/reporting/types";
import { resolveWidgetCardView } from "@/lib/api/domains/reporting/widget-display";
import {
    reportingTitleKey,
    type MerchantWidgetDefinition,
} from "@/lib/api/domains/reporting/widget-registry";
import styles from "./WidgetCard.module.css";

interface WidgetCardProps {
    meta: MerchantWidgetDefinition;
    result?: WidgetResultDto;
    loading?: boolean;
    onRetry?: () => void;
}

function widgetIcon(id: string) {
    if (id === "AVAILABLE_BALANCE") {
        return <BankOutlined />;
    }
    if (id === "SUCCESS_RATE") {
        return <PercentageOutlined />;
    }
    if (id === "PENDING_SETTLEMENT") {
        return <FieldTimeOutlined />;
    }
    return <BarChartOutlined />;
}

export default function WidgetCard({ meta, result, loading = false, onRetry }: WidgetCardProps) {
    const t = useTranslations("Reporting");
    const view = resolveWidgetCardView(result, meta);

    if (!view.visible) {
        return null;
    }

    const title = t(reportingTitleKey(meta.titleKey));

    if (view.variant === "failed") {
        return (
            <Card size="small" loading={loading} className={styles.card}>
                <div className={styles.titleRow}>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.icon}>{widgetIcon(meta.id)}</span>
                </div>
                <div className={styles.failedValue}>{t("failed")}</div>
                {onRetry ? (
                    <Button
                        type="link"
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={onRetry}
                        style={{ paddingInline: 0, marginTop: 4 }}
                    >
                        {t("retry")}
                    </Button>
                ) : null}
            </Card>
        );
    }

    if (view.variant === "forbidden") {
        return (
            <Card size="small" loading={loading} className={styles.card}>
                <div className={styles.titleRow}>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.icon}>{widgetIcon(meta.id)}</span>
                </div>
                <div className={styles.mutedValue}>{t("forbidden")}</div>
            </Card>
        );
    }

    if (view.variant === "no_data") {
        return (
            <Card size="small" loading={loading} className={styles.card}>
                <div className={styles.titleRow}>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.icon}>{widgetIcon(meta.id)}</span>
                </div>
                <div className={styles.mutedValue}>{t("no_data")}</div>
            </Card>
        );
    }

    return (
        <Card size="small" loading={loading} className={styles.card}>
            <div className={styles.titleRow}>
                <span className={styles.title}>{title}</span>
                <span className={styles.icon}>{widgetIcon(meta.id)}</span>
            </div>
            <div className={`${styles.value} financial-amount`}>{view.displayValue}</div>
        </Card>
    );
}
