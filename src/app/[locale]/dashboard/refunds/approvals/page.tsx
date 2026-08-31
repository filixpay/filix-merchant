"use client";

import { Suspense, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button, Flex, Modal, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckOutlined, CloseOutlined, EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { api, type RefundView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import RefundDetailsModal from "@/components/refunds/RefundDetailsModal";
import {
    formatRefundAmount,
    getRefundStatusColor,
    refundStatusI18nKey,
} from "@/components/refunds/refund-model";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";

export default function RefundApprovalsPage() {
    return (
        <Suspense fallback={null}>
            <RefundApprovalsPageContent />
        </Suspense>
    );
}

function RefundApprovalsPageContent() {
    const t = useTranslations("Refunds");
    const tApprovals = useTranslations("Refunds.approvals");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [page, setPage] = useState(0);
    const pageSize = 20;
    const [actionId, setActionId] = useState<string | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState<RefundView | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize, {}),
        [page, pageSize],
    );

    const { items, total, loading, isRefreshing, error, reload } = usePagedResource<
        RefundView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.refunds.listPendingApproval(params, token),
    });

    const openDetail = async (merchantRefundId: string) => {
        if (!accessToken) return;
        setShowDetailModal(true);
        setDetailLoading(true);
        setSelectedRefund(null);
        try {
            const detail = await api.refunds.get(merchantRefundId, accessToken);
            setSelectedRefund(detail);
        } catch (err) {
            if (!handleDashboardApiError(err)) {
                message.error(tApprovals("detail_failed"));
            }
            setShowDetailModal(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const runAudit = (merchantRefundId: string, action: "approve" | "reject") => {
        if (!accessToken) return;
        Modal.confirm({
            title: action === "approve" ? tApprovals("approve_confirm") : tApprovals("reject_confirm"),
            content:
                action === "approve"
                    ? tApprovals("approve_confirm_desc")
                    : tApprovals("reject_confirm_desc"),
            okText: action === "approve" ? tApprovals("approve") : tApprovals("reject"),
            okButtonProps: { danger: action === "reject" },
            cancelText: tCommon("cancel"),
            onOk: async () => {
                setActionId(merchantRefundId);
                try {
                    await (action === "approve"
                        ? api.refunds.approve(merchantRefundId, accessToken)
                        : api.refunds.reject(merchantRefundId, accessToken));
                    message.success(
                        action === "approve"
                            ? tApprovals("approve_success")
                            : tApprovals("reject_success"),
                    );
                    await reload();
                } catch (err) {
                    if (!handleDashboardApiError(err)) {
                        message.error(
                            action === "approve"
                                ? tApprovals("approve_failed")
                                : tApprovals("reject_failed"),
                        );
                    }
                    throw err;
                } finally {
                    setActionId(null);
                }
            },
        });
    };

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
            render: (_, refund) => formatRefundAmount(refund),
        },
        {
            title: t("headers.status"),
            key: "status",
            render: (_, refund) => {
                const key = refundStatusI18nKey(refund.status);
                return (
                    <Tag color={getRefundStatusColor(refund.status)}>
                        {key ? t(`status.${key}`) : refund.status}
                    </Tag>
                );
            },
        },
        {
            title: t("headers.created_at"),
            key: "createdAt",
            width: 180,
            render: (_, refund) =>
                refund.createdAt ? new Date(refund.createdAt).toLocaleString() : "-",
        },
        {
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            width: 220,
            render: (_, refund) => (
                <Space size={4}>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        title={t("details.view")}
                        onClick={() => void openDetail(refund.merchantRefundId)}
                    />
                    <Button
                        size="small"
                        type="primary"
                        icon={<CheckOutlined />}
                        loading={actionId === refund.merchantRefundId}
                        onClick={() => runAudit(refund.merchantRefundId, "approve")}
                    >
                        {tApprovals("approve")}
                    </Button>
                    <Button
                        size="small"
                        danger
                        icon={<CloseOutlined />}
                        loading={actionId === refund.merchantRefundId}
                        onClick={() => runAudit(refund.merchantRefundId, "reject")}
                    >
                        {tApprovals("reject")}
                    </Button>
                </Space>
            ),
        },
    ];

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: items.length,
        emptyDescription: tApprovals("empty"),
        onRetry: reload,
    });

    return (
        <DashboardPage
            title={tApprovals("title")}
            subtitle={tApprovals("subtitle")}
            contentMode="table"
            extra={
                <Button icon={<ReloadOutlined />} onClick={() => void reload()} loading={isRefreshing}>
                    {tCommon("refresh")}
                </Button>
            }
        >
            <Flex vertical gap={12}>
                {refreshBanner}
                <Table
                    rowKey={(row) => row.merchantRefundId || row.refundId}
                    columns={columns}
                    dataSource={items}
                    loading={tableLoading}
                    locale={locale}
                    pagination={{
                        current: page + 1,
                        pageSize,
                        total,
                        showSizeChanger: false,
                        onChange: (next) => setPage(Math.max(0, next - 1)),
                    }}
                />
            </Flex>
            <RefundDetailsModal
                isOpen={showDetailModal}
                loading={detailLoading}
                refund={selectedRefund}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedRefund(null);
                }}
            />
        </DashboardPage>
    );
}
