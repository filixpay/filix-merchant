"use client";

import Link from "next/link";
import { Card, Timeline, Typography } from "antd";
import { useLocale, useTranslations } from "next-intl";
import type { PaymentTimelineItem } from "@/lib/api";
import { resolveRiskActionPath } from "@/lib/risk/resolve-risk-action-path";

interface PaymentRiskTimelineProps {
    items: readonly PaymentTimelineItem[];
    title?: string;
}

export default function PaymentRiskTimeline({ items, title }: PaymentRiskTimelineProps) {
    const t = useTranslations("Risk");
    const locale = useLocale();

    if (items.length === 0) {
        return null;
    }

    const sorted = [...items].sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
    );

    return (
        <Card size="small" title={title ?? t("payment_timeline.title")}>
            <Timeline
                mode="left"
                items={sorted.map((item) => {
                    const href = resolveRiskActionPath(item.actionPath, locale);
                    const label = (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(item.occurredAt).toLocaleString()}
                        </Typography.Text>
                    );
                    const content = (
                        <div>
                            <Typography.Text strong>
                                {href ? (
                                    <Link href={href}>{item.title}</Link>
                                ) : (
                                    item.title
                                )}
                            </Typography.Text>
                            {item.description ? (
                                <Typography.Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 4 }}>
                                    {item.description}
                                </Typography.Paragraph>
                            ) : null}
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {t(`payment_timeline.entity.${item.entityType}`)}
                            </Typography.Text>
                        </div>
                    );
                    return {
                        key: `${item.entityType}-${item.id ?? item.occurredAt}`,
                        label,
                        children: content,
                    };
                })}
            />
        </Card>
    );
}
