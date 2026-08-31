"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Card, Col, Row, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DollarOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api, OrderView } from "@/lib/api";
import { buildCheckoutTokenUrl } from "@/lib/checkout/checkout-url";
import DashboardPage from "@/components/layout/DashboardPage";
import {
    formatAmount,
    formatDateTime,
    getOrderStatus,
    getStatusTagColor,
} from "@/components/orders/order-list-model";
import TradeNoText from "@/components/TradeNoText";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";

const PLANS = [
    { id: "weekly", price: 50, currency: "USD" },
    { id: "monthly", price: 200, currency: "USD" },
    { id: "half_year", price: 1100, currency: "USD" },
    { id: "yearly", price: 2000, currency: "USD" },
] as const;

const PERIOD_MAP: Record<string, string> = {
    weekly: "SEVEN_DAYS",
    monthly: "THIRTY_DAYS",
    half_year: "HALF_YEAR",
    yearly: "ONE_YEAR",
};

export default function ServicePlanPage() {
    const t = useTranslations("ServicePlan");
    const tHome = useTranslations("Home");
    const tOrders = useTranslations("Orders");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [submitting, setSubmitting] = useState(false);

    const requestParams = useMemo(
        () => buildPagedListParams(0, 20, { orderType: "PLATFORM_SERVICE_FEE" }),
        [],
    );

    const { items: orders, loading, isRefreshing, error, reload } = usePagedResource<
        OrderView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.orders.search(params, token),
    });

    const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: orders.length,
        emptyDescription: tOrders("empty"),
        onRetry: reload,
    });

    const handleBuyPlan = async (planId: string) => {
        if (submitting || !accessToken) return;
        setSubmitting(true);
        try {
            const order = await api.orders.createServiceFee(
                { servicePeriod: PERIOD_MAP[planId] as "SEVEN_DAYS" },
                accessToken,
            );
            const paymentToken = await api.orders.getPaymentToken(
                order.merchantOrderId,
                accessToken,
            );
            const checkoutUrl = buildCheckoutTokenUrl(paymentToken);
            if (!checkoutUrl) {
                throw new Error("Missing payment token");
            }
            window.location.href = checkoutUrl;
            reload();
        } catch (err: unknown) {
            console.error(err);
            message.error(err instanceof Error ? err.message : "Failed to initiate payment");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePay = async (merchantOrderId: string) => {
        if (!accessToken) return;
        try {
            const paymentToken = await api.orders.getPaymentToken(
                merchantOrderId,
                accessToken,
            );
            const checkoutUrl = buildCheckoutTokenUrl(paymentToken);
            if (!checkoutUrl) {
                throw new Error("Missing payment token");
            }
            window.location.href = checkoutUrl;
        } catch (err: unknown) {
            message.error(err instanceof Error ? err.message : "Failed to get payment token");
        }
    };

    const columns: ColumnsType<OrderView> = [
        {
            title: tOrders("headers.order_id"),
            key: "merchantOrderId",
            render: (_, order) => (
                <Space direction="vertical" size={0}>
                    <TradeNoText value={order.merchantOrderId} ellipsis />
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {order.subject}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: tOrders("headers.amount"),
            key: "amount",
            render: (_, order) => formatAmount(order),
        },
        {
            title: tOrders("headers.status"),
            key: "status",
            render: (_, order) => {
                const status = getOrderStatus(order);
                return <Tag color={getStatusTagColor(status)}>{status}</Tag>;
            },
        },
        {
            title: tOrders("headers.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value) => formatDateTime(value),
        },
        {
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            render: (_, order) => {
                const status = getOrderStatus(order);
                const isPending = status === "PENDING";
                const isServiceFee =
                    order.orderType === "PLATFORM_SERVICE_FEE" || !order.orderType;
                if (!isPending || !isServiceFee) return null;
                return (
                    <Button
                        type="primary"
                        size="small"
                        icon={<DollarOutlined />}
                        onClick={() => handlePay(order.merchantOrderId)}
                    >
                        {t("pay")}
                    </Button>
                );
            },
        },
    ];

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} contentMode="table">
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                {PLANS.map((plan) => (
                    <Col key={plan.id} xs={24} sm={12} lg={6}>
                        <Card
                            title={tHome(`pricing.plans.${plan.id}.name`)}
                            extra={
                                <Typography.Title level={4} style={{ margin: 0 }}>
                                    {tHome(`pricing.plans.${plan.id}.price`)}
                                </Typography.Title>
                            }
                        >
                            <Typography.Paragraph type="secondary">
                                {tHome(`pricing.plans.${plan.id}.desc`)}
                            </Typography.Paragraph>
                            <Button
                                type="primary"
                                block
                                loading={submitting}
                                onClick={() => handleBuyPlan(plan.id)}
                            >
                                {t("choose_plan")}
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Typography.Title level={4}>{t("payment_records")}</Typography.Title>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {refreshBanner}
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="merchantOrderId"
                    loading={tableLoading}
                    size="middle"
                    locale={locale}
                    pagination={false}
                />
            </Space>
        </DashboardPage>
    );
}
