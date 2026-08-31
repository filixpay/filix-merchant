"use client";

import type { Key } from "react";
import Link from "next/link";
import { Button, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { EyeOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import type { DisputeListItem } from "@/lib/api";
import MerchantOrderLink from "@/components/orders/MerchantOrderLink";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import {
    type DisputeListQuery,
    type DisputeSortField,
    toTableSortOrder,
} from "./dispute-list-model";
import {
    formatDisputeAmount,
    getPriorityColor,
    getStatusColor,
} from "./dispute-model";
import { localizeDisputeReason } from "./dispute-labels";
import ResponseDueDisplay from "./ResponseDueDisplay";
import styles from "./DisputeOperationalKpis.module.css";

interface DisputeListTableProps {
    disputes: DisputeListItem[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    emptyText?: string;
    total: number;
    query: DisputeListQuery;
    onQueryChange: (next: DisputeListQuery) => void;
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

function resolveSortField(field: string | undefined): DisputeSortField | null {
    if (
        field === "createdAt"
        || field === "caseNumber"
        || field === "merchantOrderId"
        || field === "channelCode"
        || field === "amount"
        || field === "responseDueAt"
        || field === "status"
    ) {
        return field;
    }
    return null;
}

function ResponseDueCell({ responseDueAt }: { responseDueAt: string }) {
    return <ResponseDueDisplay responseDueAt={responseDueAt} />;
}

export default function DisputeListTable({
    disputes,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    emptyText,
    total,
    query,
    onQueryChange,
}: DisputeListTableProps) {
    const t = useTranslations("Disputes");
    const tCommon = useTranslations("Common");
    const pageLocale = useLocale();

    const columns: ColumnsType<DisputeListItem> = [
        {
            title: t("headers.case_number"),
            dataIndex: "caseNumber",
            key: "caseNumber",
            width: 180,
            sorter: true,
            sortOrder: toTableSortOrder(query.sortBy, query.sortDir, "caseNumber"),
            render: (caseNumber: string) => <Typography.Text strong>{caseNumber}</Typography.Text>,
        },
        {
            title: t("headers.order_id"),
            dataIndex: "merchantOrderId",
            key: "merchantOrderId",
            width: 160,
            sorter: true,
            sortOrder: toTableSortOrder(query.sortBy, query.sortDir, "merchantOrderId"),
            render: (_, dispute) => <MerchantOrderLink merchantOrderId={dispute.merchantOrderId} />,
        },
        {
            title: t("headers.channel"),
            dataIndex: "channelCode",
            key: "channelCode",
            width: 120,
            sorter: true,
            sortOrder: toTableSortOrder(query.sortBy, query.sortDir, "channelCode"),
            render: (channelCode?: string | null) => channelCode || "-",
        },
        {
            title: t("headers.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            sorter: true,
            sortOrder: toTableSortOrder(query.sortBy, query.sortDir, "createdAt"),
            render: (_, dispute) => new Date(dispute.createdAt).toLocaleString(),
        },
        {
            title: t("headers.amount"),
            dataIndex: "amount",
            key: "amount",
            width: 130,
            align: "right",
            sorter: true,
            sortOrder: toTableSortOrder(query.sortBy, query.sortDir, "amount"),
            render: (_, dispute) => (
                <span className={styles.amountCell}>
                    {formatDisputeAmount(dispute.amount, dispute.currency)}
                </span>
            ),
        },
        {
            title: t("headers.reason"),
            key: "reason",
            ellipsis: true,
            render: (_, dispute) => localizeDisputeReason(dispute.reason, t),
        },
        {
            title: t("headers.priority"),
            key: "priority",
            width: 100,
            render: (_, dispute) => (
                <Tag color={getPriorityColor(dispute.priority)}>{t(`priority.${dispute.priority}`)}</Tag>
            ),
        },
        {
            title: t("headers.status"),
            dataIndex: "status",
            key: "status",
            width: 120,
            sorter: true,
            sortOrder: toTableSortOrder(query.sortBy, query.sortDir, "status"),
            render: (_, dispute) => (
                <Tag color={getStatusColor(dispute.status)}>{t(`status.${dispute.status}`)}</Tag>
            ),
        },
        {
            title: t("headers.response_due"),
            dataIndex: "responseDueAt",
            key: "responseDueAt",
            width: 200,
            sorter: true,
            sortOrder: toTableSortOrder(query.sortBy, query.sortDir, "responseDueAt"),
            render: (_, dispute) => <ResponseDueCell responseDueAt={dispute.responseDueAt} />,
        },
        {
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            width: 100,
            fixed: "right",
            render: (_, dispute) => (
                <Link href={`/${pageLocale}/dashboard/disputes/${dispute.id}`}>
                    <Button type="link" icon={<EyeOutlined />} size="small">
                        {tCommon("view")}
                    </Button>
                </Link>
            ),
        },
    ];

    const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: disputes.length,
        emptyDescription: emptyText ?? t("empty"),
        onRetry,
    });

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _filters: Record<string, FilterValue | null>,
        sorter: SorterResult<DisputeListItem> | SorterResult<DisputeListItem>[],
    ) => {
        const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
        const sortField = resolveSortField(
            normalizeSortKey(singleSorter?.field ?? singleSorter?.columnKey),
        );
        const next: DisputeListQuery = {
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
            <Table<DisputeListItem>
                rowKey="id"
                columns={columns}
                dataSource={disputes}
                loading={tableLoading}
                size="middle"
                scroll={{ x: 1520 }}
                locale={tableLocale}
                onChange={handleTableChange}
                pagination={{
                    current: query.page + 1,
                    pageSize: query.size,
                    total,
                    showSizeChanger: true,
                    showTotal: (count) => t("table_total", { count }),
                }}
            />
        </Space>
    );
}
