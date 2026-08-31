"use client";

import { Card, Col, Row, Skeleton } from "antd";
import { AlertOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { DisputeOperationalSummary } from "@/lib/api";
import styles from "./DisputeOperationalKpis.module.css";

interface DisputeOperationalKpisProps {
    summary: DisputeOperationalSummary;
    loading?: boolean;
}

export default function DisputeOperationalKpis({ summary, loading = false }: DisputeOperationalKpisProps) {
    const t = useTranslations("Disputes");

    const cards = [
        {
            key: "pending",
            label: t("kpis.action_required"),
            value: summary.actionRequired,
            icon: <AlertOutlined />,
            cardClass: styles.kpiPending,
        },
        {
            key: "dueSoon",
            label: t("kpis.due_soon"),
            value: summary.dueSoon,
            icon: <ClockCircleOutlined />,
            cardClass: styles.kpiDueSoon,
        },
        {
            key: "overdue",
            label: t("kpis.overdue"),
            value: summary.overdue,
            icon: <ExclamationCircleOutlined />,
            cardClass: styles.kpiOverdue,
        },
    ] as const;

    return (
        <Row gutter={[16, 16]} className={styles.kpiRow}>
            {cards.map((card) => (
                <Col xs={24} md={8} key={card.key}>
                    <Card size="small" className={`${styles.kpiCard} ${card.cardClass}`} loading={loading}>
                        {loading ? (
                            <Skeleton active paragraph={false} title={{ width: "60%" }} />
                        ) : (
                            <div className={styles.kpiCardInner}>
                                <span className={styles.kpiIcon} aria-hidden="true">
                                    {card.icon}
                                </span>
                                <div className={styles.kpiBody}>
                                    <span className={styles.kpiLabel}>{card.label}</span>
                                    <span className={styles.kpiValue}>{card.value}</span>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
