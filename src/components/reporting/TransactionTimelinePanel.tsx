"use client";

import { Card, Empty, Timeline, Typography } from "antd";
import { useTranslations } from "next-intl";
import type { TransactionTimelineItem } from "@/lib/api/domains/reporting/types";
import { formatOptionalDateTime, localizeTimelineEventType } from "./transaction-detail-model";

interface TransactionTimelinePanelProps {
    items: TransactionTimelineItem[];
}

function timelineOccurredAtMs(value: string | null | undefined): number {
    if (!value) {
        return 0;
    }
    const ms = new Date(value).getTime();
    return Number.isFinite(ms) ? ms : 0;
}

export default function TransactionTimelinePanel({ items }: TransactionTimelinePanelProps) {
    const t = useTranslations("Reporting.transactions.detail.timeline");

    const sortedItems = [...items].sort(
        (a, b) => timelineOccurredAtMs(b.occurredAt) - timelineOccurredAtMs(a.occurredAt),
    );

    return (
        <Card size="small">
            <Typography.Title level={5} style={{ marginTop: 0 }}>
                {t("title")}
            </Typography.Title>
            {sortedItems.length === 0 ? (
                <Empty description={t("empty")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <Timeline
                    mode="left"
                    items={sortedItems.map((item, index) => ({
                        key: `${item.eventType ?? "event"}-${item.occurredAt ?? index}-${index}`,
                        label: formatOptionalDateTime(item.occurredAt),
                        children: (
                            <Typography.Text strong>
                                {localizeTimelineEventType(item.eventType)}
                            </Typography.Text>
                        ),
                    }))}
                />
            )}
        </Card>
    );
}
