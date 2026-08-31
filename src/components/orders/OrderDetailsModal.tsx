"use client";



import { useEffect, useMemo, useState } from "react";

import { Descriptions, Drawer, Empty, Skeleton, Space, Table, Tabs, Typography } from "antd";

import { useLocale, useTranslations } from "next-intl";

import type { CoverageAssessmentLogView, CoverageAssessmentSummaryView, OrderView, TraceTimelineItem } from "@/lib/api";

import { api } from "@/lib/api";

import {

    formatDateTime,

    getOrderPartyDisplay,

    getOrderRefundAmounts,

    getOrderStatus,

    hasOrderParty,

    normalizeOrderType,

} from "./order-list-model";

import { formatOrderMoneyAmount, getPaymentChannelLabel } from "./order-detail-format";

import TradeNoText from "@/components/TradeNoText";

import OrderLifecycleTimeline from "./OrderLifecycleTimeline";

import CoverageAssessmentPanel from "@/components/disputes/CoverageAssessmentPanel";

import OrderStatusBadge from "./OrderStatusBadge";

import styles from "./OrderDetailsModal.module.css";



interface OrderDetailsModalProps {

    isOpen: boolean;

    onClose: () => void;

    order: OrderView | null;

    lifecycleTimeline?: readonly TraceTimelineItem[];

    loading: boolean;

    accessToken?: string;

}



function resolvePaymentAttemptId(

    order: OrderView | null,

    timeline: readonly TraceTimelineItem[],

): number | undefined {

    if (order?.paymentAttemptId != null) {

        return order.paymentAttemptId;

    }

    for (let i = timeline.length - 1; i >= 0; i -= 1) {

        const attemptId = timeline[i]?.paymentAttemptId;

        if (attemptId != null) {

            return attemptId;

        }

    }

    return undefined;

}



export default function OrderDetailsModal({

    isOpen,

    onClose,

    order,

    lifecycleTimeline = [],

    loading,

    accessToken,

}: OrderDetailsModalProps) {

    const t = useTranslations("Orders");

    const tCommon = useTranslations("Common");

    const locale = useLocale();

    const status = order ? getOrderStatus(order) : "-";

    const currency = order?.totalAmount?.currency;

    const orderTypeKey = normalizeOrderType(order?.orderType);

    const orderTypeLabel = !orderTypeKey

        ? "-"

        : t.has(`orderTypes.${orderTypeKey}` as Parameters<typeof t>[0])

            ? t(`orderTypes.${orderTypeKey}` as Parameters<typeof t>[0])

            : orderTypeKey;

    const buyer = getOrderPartyDisplay(order?.buyer, order?.buyerCode);

    const seller = getOrderPartyDisplay(order?.seller, order?.sellerCode);

    const [assessment, setAssessment] = useState<{
        attemptId: number;
        summary: CoverageAssessmentSummaryView | null;
        timeline: readonly CoverageAssessmentLogView[];
    } | null>(null);

    const paymentAttemptId = useMemo(
        () => resolvePaymentAttemptId(order, lifecycleTimeline),
        [order, lifecycleTimeline],
    );

    const orderItemsTotal = useMemo(() => {
        if (!order?.orderItems?.length) {
            return order?.totalAmount?.amount ?? 0;
        }
        return order.orderItems.reduce((sum, item) => {
            const lineTotal =
                item.itemTotal ?? Number(item.quantity || 0) * Number(item.unitPrice || 0);
            return sum + lineTotal;
        }, 0);
    }, [order]);

    const refundAmounts = useMemo(
        () => (order ? getOrderRefundAmounts(order) : { refundedAmount: 0, refundableAmount: 0 }),
        [order],
    );

    useEffect(() => {
        if (!isOpen || paymentAttemptId == null || !accessToken) {
            return;
        }

        let cancelled = false;
        const attemptId = paymentAttemptId;

        api.risk.paymentContext
            .get(attemptId, accessToken)
            .then((context) => {
                if (cancelled) {
                    return;
                }
                setAssessment({
                    attemptId,
                    summary: context.coverageAssessmentSummary ?? null,
                    timeline: context.coverageAssessmentTimeline ?? [],
                });
            })
            .catch(() => {
                if (!cancelled) {
                    setAssessment({
                        attemptId,
                        summary: null,
                        timeline: [],
                    });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [isOpen, paymentAttemptId, accessToken]);

    const assessmentSummary =
        isOpen && paymentAttemptId != null && assessment?.attemptId === paymentAttemptId
            ? assessment.summary
            : null;
    const assessmentTimeline =
        isOpen && paymentAttemptId != null && assessment?.attemptId === paymentAttemptId
            ? assessment.timeline
            : [];



    return (

        <Drawer

            title={t("details.title")}

            open={isOpen}

            onClose={onClose}

            size="large"

            destroyOnClose

        >

            {loading ? (

                <Skeleton active paragraph={{ rows: 8 }} />

            ) : order ? (

                <Space direction="vertical" size={20} style={{ width: "100%" }}>

                    <div className={styles.hero}>

                        <Space direction="vertical" size={2}>

                            <span className={styles.heroLabel}>{t("details.amount")}</span>

                            <div className={styles.heroAmount}>

                                <strong className={styles.heroValue}>

                                    {formatOrderMoneyAmount(order.totalAmount?.amount, currency, locale)}

                                </strong>

                            </div>

                        </Space>

                        <OrderStatusBadge status={status} />

                    </div>



                    <Tabs

                        defaultActiveKey="summary"

                        items={[

                            {

                                key: "summary",

                                label: t("detail_tabs.summary"),

                                children: (

                                    <Space direction="vertical" size={16} style={{ width: "100%", marginTop: 8 }}>

                                        <Descriptions column={2} size="small" bordered className={styles.section}>

                                            <Descriptions.Item label={t("details.subject")} span={2}>

                                                <Typography.Text strong>{order.subject || "-"}</Typography.Text>

                                            </Descriptions.Item>

                                            <Descriptions.Item label={t("details.order_type")}>

                                                {orderTypeLabel}

                                            </Descriptions.Item>

                                            <Descriptions.Item label={t("details.channel")}>

                                                {getPaymentChannelLabel(order.channelCode, t)}

                                            </Descriptions.Item>

                                            <Descriptions.Item label={t("details.merchant_order_id")}>

                                                <Typography.Text copyable>{order.merchantOrderId}</Typography.Text>

                                            </Descriptions.Item>

                                            <Descriptions.Item label={t("details.trade_no")}>

                                                <TradeNoText value={order.tradeNo} />

                                            </Descriptions.Item>

                                            <Descriptions.Item label={t("details.paid_amount")}>

                                                {formatOrderMoneyAmount(order.paidAmount, currency, locale)}

                                            </Descriptions.Item>

                                            <Descriptions.Item label={t("details.refunded_amount")}>

                                                {formatOrderMoneyAmount(refundAmounts.refundedAmount, currency, locale)}

                                            </Descriptions.Item>

                                            <Descriptions.Item label={t("details.refundable_amount")}>

                                                {formatOrderMoneyAmount(refundAmounts.refundableAmount, currency, locale)}

                                            </Descriptions.Item>

                                            <Descriptions.Item label={t("details.created_at")}>

                                                {formatDateTime(order.createdAt)}

                                            </Descriptions.Item>

                                            {order.paidAt ? (

                                                <Descriptions.Item label={t("headers.paid_at")} span={2}>

                                                    {formatDateTime(order.paidAt)}

                                                </Descriptions.Item>

                                            ) : null}

                                        </Descriptions>



                                        {(hasOrderParty(buyer) || hasOrderParty(seller)) && (

                                            <div className={styles.partiesRow}>

                                                {hasOrderParty(buyer) ? (

                                                    <div className={styles.partyCard}>

                                                        <span className={styles.partyLabel}>{t("details.buyer_info")}</span>

                                                        <span className={styles.partyName}>{buyer.name || "-"}</span>

                                                        {buyer.code ? (

                                                            <span className={styles.partyCode}>{buyer.code}</span>

                                                        ) : null}

                                                    </div>

                                                ) : null}

                                                {hasOrderParty(seller) ? (

                                                    <div className={styles.partyCard}>

                                                        <span className={styles.partyLabel}>{t("details.seller_info")}</span>

                                                        <span className={styles.partyName}>{seller.name || "-"}</span>

                                                        {seller.code ? (

                                                            <span className={styles.partyCode}>{seller.code}</span>

                                                        ) : null}

                                                    </div>

                                                ) : null}

                                            </div>

                                        )}



                                        <div className={styles.section}>

                                            <Typography.Text strong className={styles.sectionTitle}>

                                                {t("details.order_items")}

                                            </Typography.Text>

                                            {order.orderItems && order.orderItems.length > 0 ? (

                                                <Table

                                                    size="small"

                                                    pagination={false}

                                                    rowKey={(_, index) => String(index)}

                                                    dataSource={order.orderItems}

                                                    columns={[

                                                        {

                                                            title: t("details.item_description"),

                                                            dataIndex: "description",

                                                            render: (value: string | undefined) => value || "-",

                                                        },

                                                        {

                                                            title: t("details.item_quantity"),

                                                            dataIndex: "quantity",

                                                            width: 100,

                                                        },

                                                        {

                                                            title: t("details.item_unit_price"),

                                                            dataIndex: "unitPrice",

                                                            width: 140,

                                                            align: "right",

                                                            render: (value: number) =>

                                                                formatOrderMoneyAmount(value, currency, locale),

                                                        },

                                                        {

                                                            title: t("details.item_total"),

                                                            dataIndex: "itemTotal",

                                                            width: 140,

                                                            align: "right",

                                                            render: (_: number | undefined, row) => {

                                                                const total =

                                                                    row.itemTotal ??

                                                                    Number(row.quantity || 0) *

                                                                        Number(row.unitPrice || 0);

                                                                return formatOrderMoneyAmount(total, currency, locale);

                                                            },

                                                        },

                                                    ]}

                                                    summary={() => (

                                                        <Table.Summary.Row>

                                                            <Table.Summary.Cell index={0} colSpan={3} align="right">

                                                                <Typography.Text strong>

                                                                    {t("details.grand_total")}

                                                                </Typography.Text>

                                                            </Table.Summary.Cell>

                                                            <Table.Summary.Cell index={3} align="right">

                                                                <Typography.Text strong>

                                                                    {formatOrderMoneyAmount(

                                                                        orderItemsTotal,

                                                                        currency,

                                                                        locale,

                                                                    )}

                                                                </Typography.Text>

                                                            </Table.Summary.Cell>

                                                        </Table.Summary.Row>

                                                    )}

                                                />

                                            ) : (

                                                <Empty

                                                    description={t("details.no_order_items")}

                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}

                                                />

                                            )}

                                        </div>

                                    </Space>

                                ),

                            },

                            {

                                key: "timeline",

                                label: t("detail_tabs.timeline"),

                                children: (

                                    <div style={{ marginTop: 8 }}>

                                        <OrderLifecycleTimeline items={lifecycleTimeline} />

                                    </div>

                                ),

                            },

                            {

                                key: "risk",

                                label: t("detail_tabs.risk"),

                                children: (

                                    <div style={{ marginTop: 8 }}>

                                        {assessmentSummary ? (

                                            <CoverageAssessmentPanel

                                                summary={assessmentSummary}

                                                timeline={assessmentTimeline}

                                            />

                                        ) : (

                                            <Empty

                                                description={t("details.no_risk_assessment")}

                                                image={Empty.PRESENTED_IMAGE_SIMPLE}

                                            />

                                        )}

                                    </div>

                                ),

                            },

                        ]}

                    />

                </Space>

            ) : (

                <Empty description={tCommon("error")} />

            )}

        </Drawer>

    );

}

