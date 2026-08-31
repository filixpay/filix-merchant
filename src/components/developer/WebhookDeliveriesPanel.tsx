"use client";

import { useState } from "react";
import { Alert, Button, Card, Flex, Modal, Space, Table, Tag, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined, HistoryOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { WebhookDeliveryView } from "@/lib/api";
import { formatPayload, formatWebhookDate, getDeliveryStatusColor } from "./developer-model";
import TradeNoText from "../TradeNoText";
import { resolveDashboardTableState } from "@/lib/dashboard/table-state";
import DashboardTableError from "../layout/DashboardTableError";
import DashboardTableEmpty from "../layout/DashboardTableEmpty";

interface WebhookDeliveriesPanelProps {
    deliveries: WebhookDeliveryView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRedeliver: (id: string) => Promise<void>;
    onRetry?: () => void;
}

export default function WebhookDeliveriesPanel({
    deliveries,
    loading,
    isRefreshing = false,
    error = null,
    onRedeliver,
    onRetry,
}: WebhookDeliveriesPanelProps) {
    const t = useTranslations("Developer");
    const tCommon = useTranslations("Common");
    const [selectedPayload, setSelectedPayload] = useState<string | null>(null);
    const [redelivering, setRedelivering] = useState(false);
    const tableState = resolveDashboardTableState({
        loading,
        error: error ?? null,
        rowCount: deliveries.length,
    });

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        message.success(t("copy_payload"));
    };

    const handleRedeliver = async (id: string) => {
        setRedelivering(true);
        try {
            await onRedeliver(id);
            message.success(t("redeliver_success"));
        } catch (err: unknown) {
            message.error(err instanceof Error ? err.message : t("redeliver_failed"));
        } finally {
            setRedelivering(false);
        }
    };

    const columns: ColumnsType<WebhookDeliveryView> = [
        {
            title: t("delivery_headers.url"),
            dataIndex: "webhookUrl",
            key: "webhookUrl",
            render: (url) => <TradeNoText value={url} ellipsis />,
        },
        {
            title: t("delivery_headers.delivery_status"),
            dataIndex: "deliveryStatus",
            key: "deliveryStatus",
            render: (status: string) => (
                <Tag color={getDeliveryStatusColor(status)}>{status}</Tag>
            ),
        },
        {
            title: t("delivery_headers.attempt"),
            dataIndex: "attemptNumber",
            key: "attemptNumber",
        },
        {
            title: t("delivery_headers.created_at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value) => formatWebhookDate(value),
        },
        {
            title: t("delivery_headers.payload"),
            key: "payload",
            align: "right",
            width: 120,
            render: (_, delivery) => (
                <Flex justify="flex-end" gap={4}>
                    <Button
                        type="text"
                        size="small"
                        icon={<ReloadOutlined />}
                        title={t("redeliver")}
                        loading={redelivering}
                        onClick={() => handleRedeliver(delivery.id)}
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        title={t("view_payload")}
                        onClick={() => setSelectedPayload(delivery.payload)}
                    />
                </Flex>
            ),
        },
    ];

    return (
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <Card
                title={
                    <Flex align="center" gap={10}>
                        <HistoryOutlined style={{ fontSize: 18, color: "#2563eb" }} />
                        <span>{t("webhook_deliveries")}</span>
                    </Flex>
                }
                styles={{
                    header: {
                        borderBottom: "1px solid #f1f5f9",
                        padding: "16px 24px",
                    },
                    body: { padding: "16px 24px 24px" },
                }}
                style={{
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
                }}
            >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        {t("webhook_deliveries_desc")}
                    </Typography.Text>

                    {tableState === "refresh-error" ? (
                        <Alert
                            type="warning"
                            showIcon
                            message={t("redeliver_failed")}
                            action={onRetry ? <Button size="small" onClick={onRetry}>{tCommon("refresh")}</Button> : null}
                        />
                    ) : null}

                    <Table
                        columns={columns}
                        dataSource={deliveries}
                        rowKey="id"
                        loading={loading || isRefreshing}
                        size="middle"
                        scroll={{ x: 800 }}
                        pagination={false}
                        locale={{
                            emptyText:
                                tableState === "error" ? (
                                    <DashboardTableError
                                        description={t("redeliver_failed")}
                                        onRetry={onRetry}
                                    />
                                ) : (
                                    <DashboardTableEmpty description={t("webhook_deliveries_desc")} />
                                ),
                        }}
                    />
                </Space>
            </Card>

            <Modal
                title={t("payload_modal_title")}
                open={selectedPayload !== null}
                onCancel={() => setSelectedPayload(null)}
                footer={
                    <Space>
                        <Button onClick={() => selectedPayload && handleCopy(selectedPayload)}>
                            {t("copy_payload")}
                        </Button>
                        <Button type="primary" onClick={() => setSelectedPayload(null)}>
                            {t("close")}
                        </Button>
                    </Space>
                }
                width={800}
                destroyOnHidden
            >
                <pre
                    style={{
                        background: "#1e293b",
                        color: "#e2e8f0",
                        padding: 20,
                        borderRadius: 8,
                        overflow: "auto",
                        maxHeight: "60vh",
                        fontSize: 13,
                        fontFamily: "var(--font-mono)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        lineHeight: 1.6,
                    }}
                >
                    {selectedPayload ? formatPayload(selectedPayload) : ""}
                </pre>
            </Modal>
        </Space>
    );
}
