"use client";

import { useState } from "react";
import {
    Alert,
    Button,
    Card,
    Flex,
    Form,
    Input,
    Modal,
    Popconfirm,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    ApiOutlined,
    CopyOutlined,
    DeleteOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    PlusOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { WebhookEndpointRequest, WebhookEndpointView } from "@/lib/api";
import {
    formatWebhookDate,
    isInsecureWebhookUrl,
    summarizeEventTypes,
    validateWebhookUrl,
    type WebhookEnvironment,
} from "./developer-model";
import TradeNoText from "../TradeNoText";
import { resolveDashboardTableState } from "@/lib/dashboard/table-state";
import DashboardTableError from "../layout/DashboardTableError";
import DashboardTableEmpty from "../layout/DashboardTableEmpty";
import DevCodeField from "./DevCodeField";
import WebhookEventTypePicker from "./WebhookEventTypePicker";

const eventTagStyle: React.CSSProperties = {
    color: "#1d4ed8",
    background: "#eff6ff",
    borderColor: "#bfdbfe",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    marginInlineEnd: 0,
};

interface WebhookPanelProps {
    webhooks: WebhookEndpointView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    submitting: boolean;
    createdWebhook: WebhookEndpointView | null;
    /** Sandbox tab only lists/creates SANDBOX; LIVE is under Production Access. */
    environmentScope?: WebhookEnvironment;
    onCreate: (data: WebhookEndpointRequest) => Promise<WebhookEndpointView>;
    onPatchStatus?: (id: string, status: "ACTIVE" | "DISABLED") => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
    onRetry?: () => void;
    onDismissCreated: () => void;
}

function SecretCell({
    secret,
    onCopy,
    revealLabel,
    hideLabel,
    copyLabel,
}: {
    secret?: string;
    onCopy: (text: string) => void;
    revealLabel: string;
    hideLabel: string;
    copyLabel: string;
}) {
    const [revealed, setRevealed] = useState(false);
    if (!secret) return <Typography.Text type="secondary">-</Typography.Text>;

    return (
        <Flex gap={6} align="center">
            <Typography.Text
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: revealed ? 0 : 1,
                }}
            >
                {revealed ? secret : "••••••••••••"}
            </Typography.Text>
            <Tooltip title={revealed ? hideLabel : revealLabel}>
                <Button
                    type="text"
                    size="small"
                    aria-label={revealed ? hideLabel : revealLabel}
                    icon={revealed ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    onClick={() => setRevealed((prev) => !prev)}
                />
            </Tooltip>
            <Tooltip title={copyLabel}>
                <Button
                    type="text"
                    size="small"
                    aria-label={copyLabel}
                    icon={<CopyOutlined />}
                    onClick={() => onCopy(secret)}
                />
            </Tooltip>
        </Flex>
    );
}

export default function WebhookPanel({
    webhooks,
    loading,
    isRefreshing = false,
    error = null,
    submitting,
    createdWebhook,
    environmentScope = "SANDBOX",
    onCreate,
    onPatchStatus,
    onDelete,
    onRetry,
    onDismissCreated,
}: WebhookPanelProps) {
    const t = useTranslations("Developer");
    const tCommon = useTranslations("Common");
    const locale = useLocale();
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm<WebhookEndpointRequest>();
    const scopedWebhooks = webhooks.filter(
        (w) => (w.environment || "").toUpperCase() === environmentScope,
    );
    const tableState = resolveDashboardTableState({
        loading,
        error: error ?? null,
        rowCount: scopedWebhooks.length,
    });

    const handleCopy = (text: string) => {
        void navigator.clipboard.writeText(text);
        message.success(t("copy_success"));
    };

    const handleCreate = async (values: WebhookEndpointRequest) => {
        try {
            // Scope is authoritative — never allow form to flip environment.
            await onCreate({ ...values, environment: environmentScope });
            setShowModal(false);
            form.resetFields();
        } catch {
            // parent handles errors
        }
    };

    const urlValidationMessage = (reason: string) => {
        if (reason === "https_required") return t("webhook_url_https_required");
        if (reason === "sandbox_http_only_local") return t("webhook_url_sandbox_http_local");
        return t("webhook_url_invalid");
    };

    const columns: ColumnsType<WebhookEndpointView> = [
        {
            title: "URL",
            dataIndex: "url",
            key: "url",
            width: 260,
            render: (url: string) => (
                <Space direction="vertical" size={4} style={{ maxWidth: "100%" }}>
                    <TradeNoText value={url} ellipsis />
                    {isInsecureWebhookUrl(url) ? (
                        <Tag color="warning" icon={<WarningOutlined />}>
                            {t("webhook_insecure_url")}
                        </Tag>
                    ) : null}
                </Space>
            ),
        },
        {
            title: t("webhook_col_description"),
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            render: (desc) => desc || "-",
        },
        {
            title: t("webhook_environment"),
            dataIndex: "environment",
            key: "environment",
            width: 110,
            render: (env: string) => (env ? <Tag>{env}</Tag> : "-"),
        },
        {
            title: t("webhook_col_secret"),
            key: "secret",
            width: 200,
            render: (_, webhook) => (
                <SecretCell
                    secret={webhook.secret}
                    onCopy={handleCopy}
                    revealLabel={t("applications.reveal_secret")}
                    hideLabel={t("applications.hide_secret")}
                    copyLabel={t("applications.copy")}
                />
            ),
        },
        {
            title: t("webhook_col_event_types"),
            dataIndex: "eventTypes",
            key: "eventTypes",
            width: 220,
            render: (types: string[]) => {
                const summary = summarizeEventTypes(types, 2);
                return (
                    <Space wrap size={4}>
                        {summary.visible.map((type) => (
                            <Tag key={type} style={eventTagStyle}>
                                {type}
                            </Tag>
                        ))}
                        {summary.overflow > 0 ? (
                            <Tooltip title={summary.all.join(", ")}>
                                <Tag style={eventTagStyle}>+{summary.overflow}</Tag>
                            </Tooltip>
                        ) : null}
                    </Space>
                );
            },
        },
        {
            title: t("webhook_col_status"),
            dataIndex: "status",
            key: "status",
            width: 110,
            render: (status: string) =>
                (status || "").toUpperCase() === "ACTIVE" ? (
                    <Tag color="success">{t("webhook_status_enabled")}</Tag>
                ) : (
                    <Tag>{t("webhook_status_disabled")}</Tag>
                ),
        },
        {
            title: t("webhook_col_created"),
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            render: (value?: string) => {
                const full = formatWebhookDate(value);
                return (
                    <Tooltip title={full}>
                        <Typography.Text style={{ whiteSpace: "nowrap" }}>{full}</Typography.Text>
                    </Tooltip>
                );
            },
        },
        {
            title: tCommon("actions"),
            key: "actions",
            align: "right",
            width: 160,
            render: (_, webhook) => {
                const active = (webhook.status || "").toUpperCase() === "ACTIVE";
                return (
                    <Space size={4}>
                        {onPatchStatus ? (
                            <Popconfirm
                                title={
                                    active
                                        ? t("webhook_disable_confirm")
                                        : t("webhook_enable_confirm")
                                }
                                onConfirm={() =>
                                    void onPatchStatus(
                                        webhook.id,
                                        active ? "DISABLED" : "ACTIVE",
                                    )
                                }
                            >
                                <Button type="text" size="small">
                                    {active ? t("webhook_disable") : t("webhook_enable")}
                                </Button>
                            </Popconfirm>
                        ) : null}
                        {onDelete ? (
                            <Popconfirm
                                title={tCommon("confirm_delete")}
                                onConfirm={() => void onDelete(webhook.id)}
                            >
                                <Button type="text" danger size="small" icon={<DeleteOutlined />}>
                                    {tCommon("delete")}
                                </Button>
                            </Popconfirm>
                        ) : null}
                    </Space>
                );
            },
        },
    ];

    return (
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <Card
                title={
                    <Flex align="center" gap={10}>
                        <ApiOutlined style={{ fontSize: 18, color: "#2563eb" }} />
                        <span>{t("webhook_endpoints")}</span>
                    </Flex>
                }
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
                        {t("add_webhook")}
                    </Button>
                }
                styles={{
                    header: {
                        borderBottom: "1px solid #f1f5f9",
                        padding: "14px 20px",
                    },
                    body: { padding: "16px 20px 20px" },
                }}
                style={{
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
                }}
            >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                        {t("webhook_endpoints_desc")}{" "}
                        <Link href={`/${locale}/dashboard/developer/webhook-verification`}>
                            {t("view_docs")}
                        </Link>
                    </Typography.Text>

                    {createdWebhook && (
                        <Alert
                            type="warning"
                            message={t("webhook_created_save_secret")}
                            style={{ borderRadius: 8, background: "#fffbeb", borderColor: "#fde68a" }}
                            description={
                                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                                    <div>
                                        <Typography.Text type="secondary">{t("webhook_url")}</Typography.Text>
                                        <div style={{ marginTop: 6 }}>
                                            <DevCodeField
                                                value={createdWebhook.url}
                                                copyable
                                                copyLabel={t("applications.copy")}
                                                onCopy={() => handleCopy(createdWebhook.url)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Typography.Text type="secondary">
                                            {t("webhook_secret_label")}
                                        </Typography.Text>
                                        <div style={{ marginTop: 6 }}>
                                            <DevCodeField
                                                value={createdWebhook.secret || ""}
                                                copyable
                                                secret
                                                copyLabel={t("applications.copy")}
                                                revealLabel={t("applications.reveal_secret")}
                                                hideLabel={t("applications.hide_secret")}
                                                onCopy={() => handleCopy(createdWebhook.secret || "")}
                                            />
                                        </div>
                                    </div>
                                    <Button size="small" type="primary" onClick={onDismissCreated}>
                                        {t("webhook_saved_secret_button")}
                                    </Button>
                                </Space>
                            }
                        />
                    )}

                    {tableState === "refresh-error" ? (
                        <Alert
                            type="warning"
                            showIcon
                            message={tCommon("error")}
                            action={
                                onRetry ? (
                                    <Button size="small" onClick={onRetry}>
                                        {tCommon("refresh")}
                                    </Button>
                                ) : null
                            }
                        />
                    ) : null}

                    <Table
                        columns={columns}
                        dataSource={scopedWebhooks}
                        rowKey="id"
                        loading={loading || isRefreshing}
                        size="middle"
                        scroll={{ x: 1100 }}
                        pagination={false}
                        locale={{
                            emptyText:
                                tableState === "error" ? (
                                    <DashboardTableError
                                        description={tCommon("error")}
                                        onRetry={onRetry}
                                    />
                                ) : (
                                    <DashboardTableEmpty description={t("webhook_endpoints_empty")} />
                                ),
                        }}
                    />
                </Space>
            </Card>

            <Modal
                title={t("add_webhook_title")}
                open={showModal}
                onCancel={() => setShowModal(false)}
                onOk={() => form.submit()}
                confirmLoading={submitting}
                okText={t("add_webhook_confirm")}
                cancelText={tCommon("cancel")}
                destroyOnHidden
                width={560}
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: 8 }}
                    initialValues={{
                        url: "",
                        description: "",
                        eventTypes: [],
                        environment: environmentScope,
                    }}
                    onFinish={handleCreate}
                >
                    <Form.Item
                        name="url"
                        label={t("webhook_url")}
                        extra={t("webhook_url_hint")}
                        style={{ marginBottom: 20 }}
                        rules={[
                            { required: true, message: t("webhook_url_required") },
                            {
                                validator: async (_, value) => {
                                    if (!value) return;
                                    const result = validateWebhookUrl(
                                        String(value),
                                        environmentScope,
                                    );
                                    if (!result.ok) {
                                        throw new Error(urlValidationMessage(result.reason));
                                    }
                                },
                            },
                        ]}
                    >
                        <Input placeholder={t("webhook_url_placeholder")} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={t("webhook_description")}
                        style={{ marginBottom: 20 }}
                    >
                        <Input placeholder={t("webhook_description_placeholder")} />
                    </Form.Item>
                    <Form.Item label={t("webhook_environment")} style={{ marginBottom: 20 }}>
                        <Tag>{environmentScope}</Tag>
                        <Typography.Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                            {t("webhook_environment_fixed")}
                        </Typography.Text>
                    </Form.Item>
                    <Form.Item name="environment" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="eventTypes"
                        label={t("webhook_event_types")}
                        rules={[{ required: true, message: t("webhook_event_types_required") }]}
                        style={{ marginBottom: 8 }}
                    >
                        <WebhookEventTypePicker />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}
