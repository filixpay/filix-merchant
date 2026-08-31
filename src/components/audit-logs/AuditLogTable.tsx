"use client";

import Link from "next/link";
import { Alert, Descriptions, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useLocale, useTranslations } from "next-intl";
import type { AuditLogItem, AuditLogListQuery } from "@/lib/api";
import {
    abbreviateTraceId,
    getAuditResultColor,
    resolveAuditDeepLink,
} from "@/lib/domain/audit";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";

interface AuditLogTableProps {
    items: AuditLogItem[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    total?: number;
    query?: AuditLogListQuery;
    onQueryChange?: (next: AuditLogListQuery) => void;
}

function formatMetadata(metadata: AuditLogItem["metadata"]): string {
    if (!metadata) {
        return "{}";
    }
    return JSON.stringify(metadata, null, 2);
}

export default function AuditLogTable({
    items,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    total,
    query,
    onQueryChange,
}: AuditLogTableProps) {
    const t = useTranslations("AuditLogs");
    const tAction = useTranslations("audit.action");
    const pageLocale = useLocale();
    const paged = query != null && onQueryChange != null && total != null;

    const resolveActionLabel = (action: string) => {
        if (tAction.has(action)) {
            return tAction(action);
        }
        return action;
    };

    const columns: ColumnsType<AuditLogItem> = [
        {
            title: t("columns.time"),
            dataIndex: "occurredAt",
            key: "occurredAt",
            width: 180,
            render: (value: string) => new Date(value).toLocaleString(),
        },
        {
            title: t("columns.actor"),
            key: "actor",
            render: (_, row) => row.actorDisplayName,
        },
        {
            title: t("columns.action"),
            dataIndex: "action",
            key: "action",
            render: (action: string) => resolveActionLabel(action),
        },
        {
            title: t("columns.resource"),
            key: "resource",
            render: (_, row) => {
                if (!row.resourceType && !row.resourceId) {
                    return "-";
                }
                return (
                    <Typography.Text code>
                        {[row.resourceType, row.resourceId].filter(Boolean).join(" / ")}
                    </Typography.Text>
                );
            },
        },
        {
            title: t("columns.result"),
            dataIndex: "result",
            key: "result",
            width: 110,
            render: (result: AuditLogItem["result"]) => (
                <Tag color={getAuditResultColor(result)}>{t(`result.${result}`)}</Tag>
            ),
        },
        {
            title: t("columns.link"),
            key: "link",
            width: 140,
            render: (_, row) => {
                const href = resolveAuditDeepLink(row, pageLocale);
                if (href) {
                    return (
                        <Link href={href}>
                            <Typography.Link>{t("view_link")}</Typography.Link>
                        </Link>
                    );
                }
                if (row.traceId) {
                    return (
                        <Tooltip title={t("timeline_hint")}>
                            <Typography.Text type="secondary">
                                Timeline ({abbreviateTraceId(row.traceId)})
                            </Typography.Text>
                        </Tooltip>
                    );
                }
                return "-";
            },
        },
    ];

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: items.length,
        emptyDescription: t("empty"),
        onRetry,
    });

    const handleTableChange = (pagination: TablePaginationConfig) => {
        if (!paged) {
            return;
        }
        onQueryChange({
            ...query,
            page: Math.max((pagination.current ?? 1) - 1, 0),
            size: pagination.pageSize ?? query.size,
        });
    };

    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {refreshBanner}
            <Table
                rowKey="eventId"
                columns={columns}
                dataSource={items}
                loading={tableLoading}
                locale={locale}
                scroll={{ x: 1000 }}
                onChange={paged ? handleTableChange : undefined}
                pagination={
                    paged
                        ? {
                              current: (query.page ?? 0) + 1,
                              pageSize: query.size ?? 20,
                              total,
                              showSizeChanger: true,
                              showTotal: (count) => t("table_total", { count }),
                          }
                        : false
                }
                expandable={{
                    expandedRowRender: (row) => (
                        <Space direction="vertical" size={12} style={{ width: "100%" }}>
                            {row.metadata?.truncated ? (
                                <Alert type="warning" showIcon message={t("metadata_truncated")} />
                            ) : null}
                            {row.reason ? (
                                <Descriptions size="small" column={1} bordered>
                                    <Descriptions.Item label={t("detail.reason")}>
                                        {row.reason}
                                    </Descriptions.Item>
                                </Descriptions>
                            ) : null}
                            <Descriptions size="small" column={1} bordered>
                                <Descriptions.Item label={t("detail.event_id")}>
                                    <Typography.Text copyable={row.eventId ? { text: row.eventId } : false}>
                                        {row.eventId}
                                    </Typography.Text>
                                </Descriptions.Item>
                                {row.requestId ? (
                                    <Descriptions.Item label={t("detail.request_id")}>
                                        <Typography.Text
                                            copyable={row.requestId ? { text: row.requestId } : false}
                                        >
                                            {row.requestId}
                                        </Typography.Text>
                                    </Descriptions.Item>
                                ) : null}
                                {row.traceId ? (
                                    <Descriptions.Item label={t("detail.trace_id")}>
                                        <Typography.Text copyable={row.traceId ? { text: row.traceId } : false}>
                                            {row.traceId}
                                        </Typography.Text>
                                    </Descriptions.Item>
                                ) : null}
                            </Descriptions>
                            <Typography.Paragraph>
                                <Typography.Text type="secondary">{t("detail.metadata")}</Typography.Text>
                                <pre style={{ margin: "8px 0 0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                                    {formatMetadata(row.metadata)}
                                </pre>
                            </Typography.Paragraph>
                        </Space>
                    ),
                }}
            />
        </Space>
    );
}
