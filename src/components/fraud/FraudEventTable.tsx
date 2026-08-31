"use client";

import type { Key } from "react";
import Link from "next/link";
import { Button, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { EyeOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import type { FraudEventListItem } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import {
    type FraudListQuery,
    type FraudSortField,
    toFraudTableSortOrder,
} from "./fraud-list-model";
import { getPriorityColor } from "@/components/disputes/dispute-model";
import { formatFraudRiskType, formatFraudSummary } from "@/components/fraud/fraud-labels";

interface FraudEventTableProps {
    events: FraudEventListItem[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    total?: number;
    query?: FraudListQuery;
    onQueryChange?: (next: FraudListQuery) => void;
}

function normalizeSortKey(key: Key | readonly Key[] | undefined): string | undefined {
    if (key == null) {
        return undefined;
    }
    const value = Array.isArray(key) ? key[0] : key;
    if (typeof value === "bigint") {
        return value.toString();
    }
    return value == null ? undefined : String(value);
}

function resolveSortField(field: string | undefined): FraudSortField | null {
    if (field === "detectedAt" || field === "severity" || field === "status" || field === "eventType") {
        return field;
    }
    return null;
}

export default function FraudEventTable({
    events,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    total,
    query,
    onQueryChange,
}: FraudEventTableProps) {
    const t = useTranslations("Fraud");
    const tCommon = useTranslations("Common");
    const tDisputes = useTranslations("Disputes");
    const pageLocale = useLocale();
    const paged = query != null && onQueryChange != null && total != null;

    const columns: ColumnsType<FraudEventListItem> = [
        {
            title: t("headers.event_type"),
            dataIndex: "eventType",
            key: "eventType",
            sorter: paged,
            sortOrder: paged ? toFraudTableSortOrder(query.sortBy, query.sortDir, "eventType") : null,
            render: (_, row) => formatFraudRiskType(t, row.riskType ?? row.eventType),
        },
        {
            title: t("headers.risk_type"),
            dataIndex: "riskType",
            key: "riskType",
            render: (value) => formatFraudRiskType(t, value),
        },
        {
            title: t("headers.description"),
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            render: (_, row) => formatFraudSummary(t, row),
        },
        {
            title: t("headers.severity"),
            key: "severity",
            sorter: paged,
            sortOrder: paged ? toFraudTableSortOrder(query.sortBy, query.sortDir, "severity") : null,
            render: (_, row) => (
                <Tag color={getPriorityColor(row.severity)}>{tDisputes(`priority.${row.severity}`)}</Tag>
            ),
        },
        {
            title: t("headers.order_id"),
            key: "relatedOrderId",
            render: (_, row) => row.relatedOrderId ?? "-",
        },
        {
            title: t("headers.status"),
            key: "status",
            sorter: paged,
            sortOrder: paged ? toFraudTableSortOrder(query.sortBy, query.sortDir, "status") : null,
            render: (_, row) => <Tag>{t(`status.${row.status}`)}</Tag>,
        },
        {
            title: t("headers.detected_at"),
            dataIndex: "detectedAt",
            key: "detectedAt",
            width: 180,
            sorter: paged,
            sortOrder: paged ? toFraudTableSortOrder(query.sortBy, query.sortDir, "detectedAt") : null,
            render: (_, row) => new Date(row.detectedAt).toLocaleString(),
        },
        {
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            width: 100,
            fixed: "right",
            render: (_, row) => (
                <Link href={`/${pageLocale}/dashboard/fraud/${row.id}`}>
                    <Button type="link" icon={<EyeOutlined />} size="small">
                        {tCommon("view")}
                    </Button>
                </Link>
            ),
        },
    ];

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: events.length,
        emptyDescription: t("empty"),
        onRetry,
    });

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        sorter: SorterResult<FraudEventListItem> | SorterResult<FraudEventListItem>[],
    ) => {
        if (!paged) {
            return;
        }
        const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
        const sortField = resolveSortField(
            normalizeSortKey(singleSorter?.field ?? singleSorter?.columnKey),
        );
        const next: FraudListQuery = {
            ...query,
            page: Math.max((pagination.current ?? 1) - 1, 0),
            size: pagination.pageSize ?? query.size,
        };
        if (sortField && singleSorter?.order) {
            next.sortBy = sortField;
            next.sortDir = singleSorter.order === "ascend" ? "asc" : "desc";
        }
        onQueryChange(next);
    };

    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {refreshBanner}
            <Table
                rowKey="id"
                columns={columns}
                dataSource={events}
                loading={tableLoading}
                locale={locale}
                scroll={{ x: 1100 }}
                onChange={paged ? handleTableChange : undefined}
                pagination={
                    paged
                        ? {
                              current: query.page + 1,
                              pageSize: query.size,
                              total,
                              showSizeChanger: true,
                              showTotal: (count) => t("table_total", { count }),
                          }
                        : false
                }
            />
        </Space>
    );
}
