"use client";

import { Button, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { RefundView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import AmountCell from "@/components/layout/AmountCell";
import DateTimeCell from "@/components/layout/DateTimeCell";
import StatusBadge, { type StatusBadgeTone } from "@/components/layout/StatusBadge";
import { refundStatusI18nKey } from "./refund-model";

interface RefundListTableProps {
    refunds: RefundView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    emptyText?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    onViewDetails?: (merchantRefundId: string) => void;
}

export default function RefundListTable({
    refunds,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    emptyText,
    total,
    page,
    pageSize,
    onPageChange,
    onViewDetails,
}: RefundListTableProps) {
    const t = useTranslations("Refunds");
    const tCommon = useTranslations("Common");

    const columns: ColumnsType<RefundView> = [
        {
            title: t("headers.refund_id"),
            key: "refundId",
            render: (_, refund) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text>{refund.refundId}</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {refund.merchantRefundId}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: t("headers.order_id"),
            key: "paymentId",
            render: (_, refund) => refund.paymentId || "-",
        },
        {
            title: t("headers.amount"),
            key: "amount",
            align: "right",
            width: 140,
            render: (_, refund) => (
                <AmountCell 
                    amount={refund.amount ?? 0}
                    currency={""}
                    alignRight
                />
            ),
        },
        {
            title: t("headers.status"),
            key: "status",
            width: 130,
            render: (_, refund) => {
                const key = refundStatusI18nKey(refund.status);
                const label = key ? t(`status.${key}` as any) : refund.status;
                let tone: StatusBadgeTone = "neutral";
                switch (refund.status) {
                    case "COMPLETED": tone = "success"; break;
                    case "PENDING": tone = "processing"; break;
                    case "FAILED":
                    case "REJECTED": tone = "danger"; break;
                    case "CANCELED": tone = "neutral"; break;
                }
                return <StatusBadge label={label} tone={tone} />;
            },
        },
        {
            title: t("headers.created_at"),
            key: "createdAt",
            width: 160,
            render: (_, refund) => <DateTimeCell value={refund.createdAt} />,
        },
        {
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            width: 80,
            render: (_, refund) => (
                <Button
                    size="small"
                    icon={<EyeOutlined />}
                    title={t("details.view")}
                    onClick={() => onViewDetails?.(refund.merchantRefundId)}
                />
            ),
        },
    ];

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: refunds.length,
        emptyDescription: emptyText || t("empty"),
        onRetry,
    });

    return (
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {refreshBanner}
            <Table
                columns={columns}
                dataSource={refunds}
                rowKey={(row) => row.refundId || row.merchantRefundId}
                loading={tableLoading}
                size="middle"
                scroll={{ x: 900 }}
                locale={locale}
                pagination={
                    onPageChange
                        ? {
                              current: (page ?? 0) + 1,
                              pageSize: pageSize ?? 20,
                              total: total ?? 0,
                              showSizeChanger: true,
                              showTotal: (count) => tCommon("total", { count }),
                              onChange: (p, ps) => onPageChange(p - 1, ps),
                          }
                        : false
                }
            />
        </Space>
    );
}
