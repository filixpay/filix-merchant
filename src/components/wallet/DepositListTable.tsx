"use client";

import React, { useState } from "react";
import { Table, Tag, Button, Space, Typography } from "antd";
import { useTranslations } from "next-intl";
import { EyeOutlined, CreditCardOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { api } from "@/lib/api";
import type { DepositView, OrderView, TraceTimelineItem } from "@/lib/api";
import { buildCheckoutTokenUrl } from "@/lib/checkout/checkout-url";
import PaymentModal from "../orders/PaymentModal";
import OrderDetailsModal from "../orders/OrderDetailsModal";
import TradeNoText from "../TradeNoText";
import type { PaymentActionOrder } from "../orders/order-action-model";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";

interface DepositListTableProps {
    deposits: DepositView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    accessToken: string;
    emptyText?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
}

function depositOrderId(deposit: DepositView): string | number | undefined {
    return deposit.merchantOrderId || deposit.id || deposit.depositId;
}

function depositStatus(deposit: DepositView): string {
    return deposit.status || deposit.tradeStatus || deposit.orderStatus || "-";
}

function toPaymentOrder(deposit: DepositView | null): PaymentActionOrder | null {
    if (!deposit) return null;
    if (deposit.totalAmount) {
        return {
            merchantOrderId: String(depositOrderId(deposit) ?? ""),
            totalAmount: deposit.totalAmount,
        };
    }
    if (typeof deposit.amount === "string") {
        const [currency, amount] = deposit.amount.split(" ");
        return {
            merchantOrderId: String(depositOrderId(deposit) ?? ""),
            totalAmount: { currency, amount: parseFloat(amount) },
        };
    }
    return {
        merchantOrderId: String(depositOrderId(deposit) ?? ""),
        totalAmount: { currency: "USD", amount: 0 },
    };
}

export default function DepositListTable({
    deposits,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    accessToken,
    emptyText,
    total,
    page,
    pageSize,
    onPageChange,
}: DepositListTableProps) {
    const t = useTranslations("Deposits");
    const tCommon = useTranslations("Common");

    const [detailOrder, setDetailOrder] = useState<OrderView | null>(null);
    const [lifecycleTimeline, setLifecycleTimeline] = useState<TraceTimelineItem[]>([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentLink, setPaymentLink] = useState("");
    const [paymentDeposit, setPaymentDeposit] = useState<DepositView | null>(null);

    const handleInitiatePayment = async (deposit: DepositView) => {
        try {
            const orderId = depositOrderId(deposit);
            if (orderId == null) {
                throw new Error("Missing deposit order id");
            }
            const paymentToken = await api.orders.getPaymentToken(String(orderId), accessToken);
            const checkoutUrl = buildCheckoutTokenUrl(paymentToken);
            if (!checkoutUrl) {
                throw new Error("Missing payment token");
            }
            setPaymentLink(checkoutUrl);
            setPaymentDeposit(deposit);
            setShowPaymentModal(true);
        } catch (err: unknown) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Failed to initiate payment");
        }
    };

    const handleViewDetails = async (deposit: DepositView) => {
        setLoadingDetail(true);
        setShowDetailModal(true);
        try {
            const orderId = depositOrderId(deposit);
            if (orderId == null) {
                setDetailOrder(null);
                setLifecycleTimeline([]);
                return;
            }
            const detail = await api.orders.get(String(orderId), accessToken);
            setDetailOrder(detail.order);
            setLifecycleTimeline(detail.lifecycleTimeline);
        } catch (err: unknown) {
            console.error(err);
            setDetailOrder(null);
            setLifecycleTimeline([]);
        } finally {
            setLoadingDetail(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SUCCESS":
            case "COMPLETED":
                return "success";
            case "PENDING":
            case "WAIT_BUYER_PAY":
                return "processing";
            case "FAILED":
            case "CANCELLED":
                return "error";
            default:
                return "default";
        }
    };

    const columns: ColumnsType<DepositView> = [
        {
            title: t("headers.order_id"),
            key: "order",
            width: 320,
            ellipsis: true,
            render: (_, deposit) => (
                <Typography.Text ellipsis={{ tooltip: true }}>
                    {depositOrderId(deposit)}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.trade_no"),
            dataIndex: "tradeNo",
            key: "tradeNo",
            ellipsis: true,
            render: (val: string) => <TradeNoText value={val} ellipsis />,
        },
        {
            title: t("headers.amount"),
            key: "amount",
            width: 120,
            align: "right",
            render: (_, deposit) => (
                <Typography.Text style={{ color: "#10b981", whiteSpace: "nowrap" }}>
                    {deposit.amount ||
                        (deposit.totalAmount
                            ? `${deposit.totalAmount.currency} ${deposit.totalAmount.amount}`
                            : "-")}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.status"),
            key: "status",
            width: 100,
            render: (_, deposit) => {
                const status = depositStatus(deposit);
                return <Tag color={getStatusColor(status)}>{status}</Tag>;
            },
        },
        {
            title: t("headers.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            render: (val: string) => (
                <Typography.Text style={{ whiteSpace: "nowrap" }}>
                    {val ? new Date(val).toLocaleString() : "-"}
                </Typography.Text>
            ),
        },
        {
            title: t("headers.paid_at"),
            dataIndex: "paidAt",
            key: "paidAt",
            width: 170,
            render: (val: string) => (
                <Typography.Text style={{ whiteSpace: "nowrap" }}>
                    {val ? new Date(val).toLocaleString() : "-"}
                </Typography.Text>
            ),
        },
        {
            title: tCommon("actions"),
            key: "actions",
            fixed: "right",
            width: 120,
            align: "right",
            render: (_, deposit) => (
                <Space>
                    {depositStatus(deposit) === "PENDING" && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<CreditCardOutlined />}
                            onClick={() => handleInitiatePayment(deposit)}
                        >
                            {tCommon("initiate_payment")}
                        </Button>
                    )}
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(deposit)}
                    />
                </Space>
            ),
        },
    ];

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: deposits.length,
        emptyDescription: emptyText || t("empty"),
        onRetry,
    });

    return (
        <>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {refreshBanner}
                <Table
                    columns={columns}
                    dataSource={deposits}
                    rowKey={(deposit) =>
                        String(deposit.id || deposit.merchantOrderId || deposit.depositId)
                    }
                    loading={tableLoading}
                    tableLayout="fixed"
                    size="middle"
                    locale={locale}
                    pagination={
                        onPageChange
                            ? {
                                  current: (page ?? 0) + 1,
                                  pageSize: pageSize ?? 20,
                                  total: total ?? 0,
                                  showSizeChanger: false,
                                  onChange: (p, ps) => onPageChange(p - 1, ps),
                              }
                            : false
                    }
                />
            </Space>

            <PaymentModal
                isOpen={showPaymentModal}
                order={toPaymentOrder(paymentDeposit)}
                paymentLink={paymentLink}
                onClose={() => {
                    setShowPaymentModal(false);
                    setPaymentLink("");
                    setPaymentDeposit(null);
                }}
            />

            <OrderDetailsModal
                isOpen={showDetailModal}
                order={detailOrder}
                lifecycleTimeline={lifecycleTimeline}
                loading={loadingDetail}
                accessToken={accessToken}
                onClose={() => {
                    setShowDetailModal(false);
                    setDetailOrder(null);
                    setLifecycleTimeline([]);
                }}
            />
        </>
    );
}
