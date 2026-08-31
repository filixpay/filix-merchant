"use client";

import type { Key } from "react";
import Link from "next/link";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { EyeOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import type { RiskReviewListItem } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import {
    type ReviewListQuery,
    type ReviewSortField,
    toReviewTableSortOrder,
} from "./risk-review-list-model";
import { getPriorityColor } from "@/components/disputes/dispute-model";

interface RiskReviewTableProps {
    reviews: RiskReviewListItem[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    total?: number;
    query?: ReviewListQuery;
    onQueryChange?: (next: ReviewListQuery) => void;
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

function resolveSortField(field: string | undefined): ReviewSortField | null {
    if (field === "queuedAt" || field === "createdAt" || field === "priority" || field === "status") {
        return field;
    }
    return null;
}

export default function RiskReviewTable({
    reviews,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    total,
    query,
    onQueryChange,
}: RiskReviewTableProps) {
    const t = useTranslations("RiskReviews");
    const tCommon = useTranslations("Common");
    const tDisputes = useTranslations("Disputes");
    const pageLocale = useLocale();
    const paged = query != null && onQueryChange != null && total != null;

    const columns: ColumnsType<RiskReviewListItem> = [
        {
            title: t("headers.resource"),
            key: "resource",
            render: (_, row) => (
                <>
                    <Tag>{t(`resource_type.${row.resourceType}`)}</Tag> {row.resourceId}
                </>
            ),
        },
        {
            title: t("detail.review_type"),
            dataIndex: "reviewType",
            key: "reviewType",
            render: (value) => value ?? "-",
        },
        { title: t("headers.reason"), dataIndex: "reason", key: "reason", ellipsis: true },
        {
            title: t("headers.priority"),
            key: "priority",
            sorter: paged,
            sortOrder: paged ? toReviewTableSortOrder(query.sortBy, query.sortDir, "priority") : null,
            render: (_, row) => (
                <Tag color={getPriorityColor(row.priority)}>{tDisputes(`priority.${row.priority}`)}</Tag>
            ),
        },
        {
            title: t("headers.status"),
            key: "status",
            sorter: paged,
            sortOrder: paged ? toReviewTableSortOrder(query.sortBy, query.sortDir, "status") : null,
            render: (_, row) => <Tag>{t(`status.${row.status}`)}</Tag>,
        },
        {
            title: t("headers.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            sorter: paged,
            sortOrder: paged ? toReviewTableSortOrder(query.sortBy, query.sortDir, "createdAt") : null,
            render: (_, row) => new Date(row.createdAt).toLocaleString(),
        },
        {
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            width: 100,
            fixed: "right",
            render: (_, row) => (
                <Link href={`/${pageLocale}/dashboard/risk-reviews/${row.id}`}>
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
        rowCount: reviews.length,
        emptyDescription: t("empty"),
        onRetry,
    });

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        sorter: SorterResult<RiskReviewListItem> | SorterResult<RiskReviewListItem>[],
    ) => {
        if (!paged) {
            return;
        }
        const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
        const sortField = resolveSortField(
            normalizeSortKey(singleSorter?.field ?? singleSorter?.columnKey),
        );
        const next: ReviewListQuery = {
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
                dataSource={reviews}
                loading={tableLoading}
                locale={locale}
                scroll={{ x: 1050 }}
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
