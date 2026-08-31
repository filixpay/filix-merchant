"use client";

import { useMemo, useState } from "react";
import { Checkbox, Descriptions, Empty, Flex, Segmented, Tag, Timeline, Typography } from "antd";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { TraceTimelineItem } from "@/lib/api/orders";
import { formatTimelineTimestamp, getPaymentChannelLabel } from "./order-detail-format";
import {
    buildLifecycleMetadataRows,
    buildLifecycleReplayPayload,
    filterLifecycleTimelineItems,
    lifecycleEventTranslationKey,
    type LifecycleTimelineFilter,
} from "./order-lifecycle-timeline-model";
import styles from "./OrderLifecycleTimeline.module.css";

interface OrderLifecycleTimelineProps {
    items: readonly TraceTimelineItem[];
}

const categoryColors: Record<string, string> = {
    PAYMENT: "blue",
    RISK: "orange",
    REVIEW: "purple",
    SYSTEM: "default",
};

const filterOptions: LifecycleTimelineFilter[] = ["all", "payment", "risk", "review", "system"];

function categoryLabel(
    category: string,
    t: ReturnType<typeof useTranslations<"Orders">>,
): string {
    const key = category.toLowerCase() as "payment" | "risk" | "review" | "system";
    return t(`lifecycle_timeline.categories.${key}` as "lifecycle_timeline.categories.payment");
}

function resolveEventTitle(
    item: TraceTimelineItem,
    t: ReturnType<typeof useTranslations<"Orders">>,
): string {
    if (!item.eventCode) {
        return t("lifecycle_timeline.unknown_event");
    }
    const eventKey = lifecycleEventTranslationKey(item.eventCode);
    const translationKey = `lifecycle_timeline.events.${eventKey}` as "lifecycle_timeline.events.payment_created";
    const translated = t(translationKey);
    if (translated === translationKey) {
        return item.eventCode;
    }
    return translated;
}

export default function OrderLifecycleTimeline({ items }: OrderLifecycleTimelineProps) {
    const t = useTranslations("Orders");
    const locale = useLocale();
    const [filter, setFilter] = useState<LifecycleTimelineFilter>("all");
    const [hideWebhookRetries, setHideWebhookRetries] = useState(true);
    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

    const metadataLabels = useMemo(
        () => ({
            channel: t("lifecycle_timeline.meta.channel"),
            provider: t("lifecycle_timeline.meta.provider"),
            error: t("lifecycle_timeline.meta.error"),
            review: t("lifecycle_timeline.meta.review"),
            fraud: t("lifecycle_timeline.meta.fraud"),
            rule: t("lifecycle_timeline.meta.rule"),
            action: t("lifecycle_timeline.meta.action"),
            statusChange: t("lifecycle_timeline.meta.status_change"),
            reason: t("lifecycle_timeline.meta.reason"),
            maskedValue: t("lifecycle_timeline.meta.masked_value"),
            attemptId: t("lifecycle_timeline.meta.attempt_id"),
            webhookSource: t("lifecycle_timeline.meta.webhook_source"),
        }),
        [t],
    );

    const filteredItems = useMemo(
        () => filterLifecycleTimelineItems(items, filter, hideWebhookRetries),
        [items, filter, hideWebhookRetries],
    );

    const sorted = useMemo(
        () =>
            [...filteredItems].sort(
                (a, b) =>
                    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
            ),
        [filteredItems],
    );

    const hiddenRetryCount = useMemo(
        () =>
            hideWebhookRetries
                ? items.filter((item) => item.eventCode === "system.webhook_retry").length
                : 0,
        [hideWebhookRetries, items],
    );

    const filterBar = (
        <div className={styles.filterBar}>
            <Segmented
                className={styles.filterSegmented}
                size="small"
                value={filter}
                onChange={(value) => setFilter(value as LifecycleTimelineFilter)}
                options={filterOptions.map((value) => ({
                    value,
                    label: t(`lifecycle_timeline.filters.${value}` as "lifecycle_timeline.filters.all"),
                }))}
            />
            <Checkbox
                className={styles.filterCheckbox}
                checked={hideWebhookRetries}
                onChange={(event) => setHideWebhookRetries(event.target.checked)}
            >
                {t("lifecycle_timeline.filters.hide_webhook_retries")}
            </Checkbox>
        </div>
    );

    if (!items.length) {
        return (
            <div className={styles.panel}>
                <div className={styles.panelHeader}>
                    <Typography.Title level={5} className={styles.panelTitle}>
                        {t("lifecycle_timeline.title")}
                    </Typography.Title>
                </div>
                <div className={styles.panelBody}>
                    <Empty description={t("lifecycle_timeline.empty")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.panel}>
            <div className={styles.panelHeader}>
                <Flex justify="space-between" align="center" gap={12}>
                    <Typography.Title level={5} className={styles.panelTitle}>
                        {t("lifecycle_timeline.title")}
                    </Typography.Title>
                    {hiddenRetryCount > 0 ? (
                        <Typography.Text type="secondary" className={styles.panelExtra}>
                            {t("lifecycle_timeline.filters.hidden_retries", { count: hiddenRetryCount })}
                        </Typography.Text>
                    ) : null}
                </Flex>
            </div>
            <div className={styles.panelBody}>
                {filterBar}

                {sorted.length === 0 ? (
                    <Empty
                        description={t("lifecycle_timeline.filters.empty_filtered")}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <Timeline
                        className={styles.timeline}
                        mode="left"
                        items={sorted.map((item) => {
                            const title = resolveEventTitle(item, t);
                            const metadataRows = buildLifecycleMetadataRows(
                                item,
                                metadataLabels,
                                locale,
                                {
                                    resolveChannel: (code) => getPaymentChannelLabel(code, t),
                                    resolveStatus: (status) => {
                                        if (!status || status === "-") {
                                            return status;
                                        }
                                        const key = `trade_status.${status}` as Parameters<typeof t>[0];
                                        return t.has(key) ? t(key) : status;
                                    },
                                },
                            );
                            const category = item.eventCategory?.toUpperCase();
                            const isExpanded = expandedEventId === item.eventId;

                            return {
                                key: item.eventId,
                                label: formatTimelineTimestamp(item.createdAt, locale),
                                children: (
                                    <div className={styles.eventBlock}>
                                        <div className={styles.eventHeader}>
                                            <Typography.Text strong className={styles.eventTitle}>
                                                {title}
                                            </Typography.Text>
                                            {category ? (
                                                <Tag
                                                    color={categoryColors[category] ?? "default"}
                                                    className={styles.categoryTag}
                                                >
                                                    {categoryLabel(category, t)}
                                                </Tag>
                                            ) : null}
                                        </div>
                                        {metadataRows.length > 0 ? (
                                            <ul className={styles.metaList}>
                                                {metadataRows.map((row) => (
                                                    <li key={row.key} className={styles.metaRow}>
                                                        <span className={styles.metaLabel}>{row.label}：</span>
                                                        {row.href ? (
                                                            <Link href={row.href} className={styles.metaLink}>
                                                                {row.value}
                                                            </Link>
                                                        ) : row.copyable ? (
                                                            <Typography.Text
                                                                copyable={{
                                                                    text: row.copyValue ?? row.value,
                                                                    tooltips: false,
                                                                }}
                                                                className={styles.metaValue}
                                                                code
                                                            >
                                                                {row.value}
                                                            </Typography.Text>
                                                        ) : (
                                                            <span className={styles.metaValue}>{row.value}</span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : null}
                                        <Typography.Link
                                            className={styles.detailsToggle}
                                            onClick={() =>
                                                setExpandedEventId(isExpanded ? null : item.eventId)
                                            }
                                        >
                                            {isExpanded
                                                ? t("lifecycle_timeline.replay.hide_details")
                                                : t("lifecycle_timeline.replay.view_details")}
                                        </Typography.Link>
                                        {isExpanded ? (
                                            <Descriptions
                                                bordered
                                                size="small"
                                                column={1}
                                                style={{ marginTop: 8 }}
                                                items={[
                                                    {
                                                        key: "eventId",
                                                        label: t("lifecycle_timeline.replay.event_id"),
                                                        children: (
                                                            <Typography.Text copyable code>
                                                                {item.eventId}
                                                            </Typography.Text>
                                                        ),
                                                    },
                                                    {
                                                        key: "eventCode",
                                                        label: t("lifecycle_timeline.replay.event_code"),
                                                        children: (
                                                            <Typography.Text code>
                                                                {item.eventCode ?? "-"}
                                                            </Typography.Text>
                                                        ),
                                                    },
                                                    {
                                                        key: "payload",
                                                        label: t("lifecycle_timeline.replay.payload"),
                                                        children: (
                                                            <Typography.Paragraph
                                                                code
                                                                style={{
                                                                    marginBottom: 0,
                                                                    whiteSpace: "pre-wrap",
                                                                    fontSize: 12,
                                                                }}
                                                            >
                                                                {JSON.stringify(
                                                                    buildLifecycleReplayPayload(item),
                                                                    null,
                                                                    2,
                                                                )}
                                                            </Typography.Paragraph>
                                                        ),
                                                    },
                                                ]}
                                            />
                                        ) : null}
                                    </div>
                                ),
                            };
                        })}
                    />
                )}
            </div>
        </div>
    );
}
