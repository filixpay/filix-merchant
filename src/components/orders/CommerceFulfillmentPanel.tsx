"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Empty, Form, Input, Space, Table, Tag, Typography, message } from "antd";
import { useTranslations } from "next-intl";
import type { OrderView } from "@/lib/api";
import { ApiError } from "@/lib/api";
import {
    fulfillCommerceOrder,
    getFulfillmentDetail,
    type CommerceOrderFulfillmentDetail,
} from "@/lib/api/domains/commerce/fulfillment";
import { formatDateTime } from "./order-list-model";
import {
    canSubmitCommerceFulfillment,
    createFulfillmentIdempotencyKey,
    fulfillmentRowStatusKey,
    hasFulfillmentInProgress,
    isOrderPaidForFulfillment,
} from "./commerce-fulfillment-model";
import styles from "./CommerceFulfillmentPanel.module.css";

type FulfillmentFormValues = {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
};

type CommerceFulfillmentPanelProps = {
    order: OrderView;
    accessToken?: string;
    active: boolean;
};

function fulfillmentSummaryColor(status: CommerceOrderFulfillmentDetail["fulfillmentStatus"]): string {
    return status === "FULFILLED" ? "success" : "default";
}

function rowStatusColor(status: "requested" | "fulfilled" | "failed"): string {
    switch (status) {
        case "fulfilled":
            return "success";
        case "failed":
            return "error";
        default:
            return "processing";
    }
}

export default function CommerceFulfillmentPanel({ order, accessToken, active }: CommerceFulfillmentPanelProps) {
    const t = useTranslations("Orders.fulfillment");
    const [form] = Form.useForm<FulfillmentFormValues>();
    const [detail, setDetail] = useState<CommerceOrderFulfillmentDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const paid = isOrderPaidForFulfillment(order);
    const canSubmit = canSubmitCommerceFulfillment(order, detail);

    const loadDetail = useCallback(async () => {
        if (!accessToken || !paid) {
            return;
        }
        setLoading(true);
        setLoadError(null);
        try {
            const next = await getFulfillmentDetail(accessToken, order.id);
            setDetail(next);
        } catch (err) {
            setDetail(null);
            setLoadError(err instanceof ApiError ? err.message : t("load_failed"));
        } finally {
            setLoading(false);
        }
    }, [accessToken, order.id, paid, t]);

    useEffect(() => {
        if (!active) {
            return;
        }
        if (!paid) {
            setDetail(null);
            setLoadError(null);
            return;
        }
        void loadDetail();
    }, [active, loadDetail, paid]);

    const onSubmit = async (values: FulfillmentFormValues) => {
        if (!accessToken || !canSubmit) {
            return;
        }
        setSubmitting(true);
        try {
            await fulfillCommerceOrder(accessToken, order.id, createFulfillmentIdempotencyKey(), {
                carrier: values.carrier.trim(),
                trackingNumber: values.trackingNumber.trim(),
                trackingUrl: values.trackingUrl?.trim() || undefined,
            });
            message.success(t("submit_success"));
            form.resetFields();
            await loadDetail();
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("submit_failed"));
        } finally {
            setSubmitting(false);
        }
    };

    if (!paid) {
        return (
            <Alert
                type="info"
                showIcon
                message={t("not_paid_title")}
                description={t("not_paid_body")}
            />
        );
    }

    if (loading && !detail) {
        return <Typography.Text type="secondary">{t("loading")}</Typography.Text>;
    }

    if (loadError) {
        return (
            <Space direction="vertical" size={12} className={styles.section}>
                <Alert type="error" showIcon message={loadError} />
                <Button onClick={() => void loadDetail()}>{t("retry")}</Button>
            </Space>
        );
    }

    return (
        <Space direction="vertical" size={16} className={styles.section} style={{ width: "100%", marginTop: 8 }}>
            {detail ? (
                <div className={styles.statusRow}>
                    <Space wrap>
                        <Typography.Text strong>{t("summary_status")}</Typography.Text>
                        <Tag color={fulfillmentSummaryColor(detail.fulfillmentStatus)}>
                            {t(`summary.${detail.fulfillmentStatus.toLowerCase() as "unfulfilled" | "fulfilled"}`)}
                        </Tag>
                    </Space>
                </div>
            ) : null}

            {detail && hasFulfillmentInProgress(detail) ? (
                <Alert type="info" showIcon message={t("in_progress")} />
            ) : null}

            <div className={styles.section}>
                <Typography.Text strong className={styles.sectionTitle}>
                    {t("history_title")}
                </Typography.Text>
                {detail && detail.fulfillments.length > 0 ? (
                    <Table
                        size="small"
                        pagination={false}
                        rowKey="id"
                        dataSource={detail.fulfillments}
                        columns={[
                            {
                                title: t("columns.status"),
                                dataIndex: "status",
                                width: 160,
                                render: (_value, row) => {
                                    const key = fulfillmentRowStatusKey(row.status);
                                    return (
                                        <Tag color={rowStatusColor(key)}>
                                            {row.statusLabel || t(`row_status.${key}`)}
                                        </Tag>
                                    );
                                },
                            },
                            {
                                title: t("columns.carrier"),
                                dataIndex: "carrier",
                                width: 120,
                            },
                            {
                                title: t("columns.tracking_number"),
                                dataIndex: "trackingNumber",
                                render: (value: string, row) =>
                                    row.trackingUrl ? (
                                        <Typography.Link href={row.trackingUrl} target="_blank" rel="noreferrer">
                                            {value}
                                        </Typography.Link>
                                    ) : (
                                        value
                                    ),
                            },
                            {
                                title: t("columns.requested_at"),
                                dataIndex: "requestedAt",
                                width: 180,
                                render: (value?: string | null) => (value ? formatDateTime(value) : "-"),
                            },
                        ]}
                    />
                ) : (
                    <Empty description={t("history_empty")} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>

            {canSubmit ? (
                <div className={styles.formCard}>
                    <Typography.Text strong className={styles.sectionTitle}>
                        {t("form_title")}
                    </Typography.Text>
                    <Typography.Text type="secondary" className={styles.hint}>
                        {t("form_hint")}
                    </Typography.Text>
                    <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark="optional">
                        <Form.Item
                            name="carrier"
                            label={t("fields.carrier")}
                            rules={[{ required: true, message: t("validation.carrier_required") }]}
                        >
                            <Input maxLength={255} placeholder={t("placeholders.carrier")} />
                        </Form.Item>
                        <Form.Item
                            name="trackingNumber"
                            label={t("fields.tracking_number")}
                            rules={[{ required: true, message: t("validation.tracking_required") }]}
                        >
                            <Input maxLength={255} placeholder={t("placeholders.tracking_number")} />
                        </Form.Item>
                        <Form.Item name="trackingUrl" label={t("fields.tracking_url")}>
                            <Input maxLength={2048} placeholder={t("placeholders.tracking_url")} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={submitting}>
                            {t("submit")}
                        </Button>
                    </Form>
                </div>
            ) : null}
        </Space>
    );
}
