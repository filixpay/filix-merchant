"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Flex,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    ApiOutlined,
    KeyOutlined,
    PlusOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import {
    createLiveCredential,
    listApplicationCredentials,
    listApplications,
    revokeApplicationCredential,
    type ApiApplicationView,
    type ApiCredentialView,
    type IssuedCredentialView,
} from "@/lib/developer/applications-api";
import {
    api,
    type WebhookEndpointRequest,
    type WebhookEndpointView,
} from "@/lib/api";
import IssuedCredentialModal from "./IssuedCredentialModal";
import WebhookEventTypePicker from "./WebhookEventTypePicker";
import {
    filterCredentialsByEnvironment,
    isLiveCreateDisabledByLifecycle,
} from "./production-access-model";
import {
    deriveProductionAccessChecklist,
    isCreateLiveAllowedByReadiness,
    type ReadinessCheck,
} from "./production-readiness-model";
import { validateWebhookUrl } from "./developer-model";
import { createLiveWebhookRequest } from "./create-live-webhook";

/**
 * Live / Production Access — credentials, webhooks, configuration preview.
 * No Explorer. UI disable of Create LIVE is UX only; backend 409 is SSOT.
 *
 * Applications are environment-agnostic: the same Apps list as「应用」tab.
 * LIVE only applies to credentials / webhooks under a selected application.
 */
export default function ProductionAccessPanel({
    accessToken,
    active = true,
}: {
    accessToken: string;
    /** When false (inactive tab), skip fetch; reload when becoming active. */
    active?: boolean;
}) {
    const t = useTranslations("Developer.productionAccess");
    const tApps = useTranslations("Developer.applications");
    const tDev = useTranslations("Developer");
    const tCommon = useTranslations("Common");

    const [apps, setApps] = useState<ApiApplicationView[]>([]);
    const [selectedCode, setSelectedCode] = useState<string | undefined>();
    const [credentials, setCredentials] = useState<ApiCredentialView[]>([]);
    const [webhooks, setWebhooks] = useState<WebhookEndpointView[]>([]);
    const [loadingApps, setLoadingApps] = useState(false);
    const [loadingCreds, setLoadingCreds] = useState(false);
    const [loadingHooks, setLoadingHooks] = useState(false);
    const [busy, setBusy] = useState(false);
    const [issued, setIssued] = useState<IssuedCredentialView | null>(null);
    const [secretOpen, setSecretOpen] = useState(false);
    const [createLiveOpen, setCreateLiveOpen] = useState(false);
    const [webhookModalOpen, setWebhookModalOpen] = useState(false);
    const [webhookForm] = Form.useForm<Omit<WebhookEndpointRequest, "environment">>();
    const [createdWebhook, setCreatedWebhook] = useState<WebhookEndpointView | null>(null);

    const selectedApp = useMemo(
        () => apps.find((a) => a.applicationCode === selectedCode),
        [apps, selectedCode],
    );

    const liveCredentials = useMemo(
        () => filterCredentialsByEnvironment(credentials, "LIVE"),
        [credentials],
    );

    const liveWebhooks = useMemo(
        () =>
            webhooks.filter((w) => (w.environment || "").toUpperCase() === "LIVE"),
        [webhooks],
    );

    const checklist: ReadinessCheck[] = useMemo(
        () => deriveProductionAccessChecklist(liveCredentials, liveWebhooks),
        [liveCredentials, liveWebhooks],
    );

    const createDisabled =
        !selectedApp ||
        isLiveCreateDisabledByLifecycle(selectedApp.status, liveCredentials) ||
        !isCreateLiveAllowedByReadiness();

    const loadApps = useCallback(async () => {
        setLoadingApps(true);
        try {
            const rows = await listApplications(accessToken);
            setApps(rows);
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("load_apps_failed"));
            setApps([]);
        } finally {
            setLoadingApps(false);
        }
    }, [accessToken, t]);

    const loadCredentials = useCallback(
        async (applicationCode: string) => {
            setLoadingCreds(true);
            try {
                setCredentials(await listApplicationCredentials(accessToken, applicationCode));
            } catch (err) {
                console.error(err);
                message.error(err instanceof Error ? err.message : tApps("credentials_load_failed"));
                setCredentials([]);
            } finally {
                setLoadingCreds(false);
            }
        },
        [accessToken, tApps],
    );

    const loadWebhooks = useCallback(async () => {
        setLoadingHooks(true);
        try {
            const res = await api.developer.listWebhookEndpoints({ page: 0, size: 100 }, accessToken);
            setWebhooks(res.data || res.content || []);
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("load_webhooks_failed"));
            setWebhooks([]);
        } finally {
            setLoadingHooks(false);
        }
    }, [accessToken, t]);

    useEffect(() => {
        if (!active) return;
        void loadApps();
        void loadWebhooks();
    }, [active, loadApps, loadWebhooks]);

    // Prefer ACTIVE app for default selection; keep current selection if still present.
    useEffect(() => {
        if (apps.length === 0) {
            setSelectedCode(undefined);
            return;
        }
        setSelectedCode((current) => {
            if (current && apps.some((a) => a.applicationCode === current)) {
                return current;
            }
            const activeApp = apps.find((a) => (a.status || "ACTIVE").toUpperCase() === "ACTIVE");
            return (activeApp ?? apps[0]).applicationCode;
        });
    }, [apps]);

    useEffect(() => {
        if (selectedCode) {
            void loadCredentials(selectedCode);
        } else {
            setCredentials([]);
        }
    }, [selectedCode, loadCredentials]);

    const handleCreateLive = async () => {
        if (!selectedCode) return;
        setBusy(true);
        try {
            const data = await createLiveCredential(accessToken, selectedCode);
            setIssued(data);
            setSecretOpen(true);
            setCreateLiveOpen(false);
            await loadCredentials(selectedCode);
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("create_live_failed"));
        } finally {
            setBusy(false);
        }
    };

    const handleRevoke = async (credentialId: string) => {
        if (!selectedCode) return;
        setBusy(true);
        try {
            await revokeApplicationCredential(accessToken, selectedCode, credentialId);
            message.success(tApps("revoke_success"));
            await loadCredentials(selectedCode);
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : tApps("revoke_failed"));
        } finally {
            setBusy(false);
        }
    };

    const handleCreateLiveWebhook = async (values: Omit<WebhookEndpointRequest, "environment">) => {
        setBusy(true);
        try {
            const created = await api.developer.createWebhookEndpoint(
                createLiveWebhookRequest(values),
                accessToken,
            );
            setCreatedWebhook(created);
            setWebhookModalOpen(false);
            webhookForm.resetFields();
            await loadWebhooks();
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("create_webhook_failed"));
        } finally {
            setBusy(false);
        }
    };

    const handlePatchStatus = async (id: string, status: "ACTIVE" | "DISABLED") => {
        setBusy(true);
        try {
            await api.developer.patchWebhookEndpointStatus(id, { status }, accessToken);
            message.success(
                status === "DISABLED" ? t("webhook_disabled") : t("webhook_enabled"),
            );
            await loadWebhooks();
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("webhook_status_failed"));
        } finally {
            setBusy(false);
        }
    };

    const statusTag = (status?: string) => {
        const value = (status || "ACTIVE").toUpperCase();
        if (value === "ACTIVE") {
            return (
                <Tag color="success" style={{ marginInlineEnd: 0 }}>
                    {value}
                </Tag>
            );
        }
        return <Tag style={{ marginInlineEnd: 0 }}>{value}</Tag>;
    };

    const credentialColumns: ColumnsType<ApiCredentialView> = [
        {
            title: tApps("col_client_id"),
            dataIndex: "clientId",
            key: "clientId",
            ellipsis: true,
            render: (id: string) => (
                <Typography.Text copyable={{ text: id, tooltips: false }} ellipsis>
                    {id}
                </Typography.Text>
            ),
        },
        {
            title: tApps("col_status"),
            dataIndex: "status",
            key: "status",
            width: 110,
            render: (s: string) => statusTag(s),
        },
        {
            title: tApps("col_environment"),
            dataIndex: "environment",
            key: "environment",
            width: 90,
            render: () => <Tag color="orange">LIVE</Tag>,
        },
        {
            title: tApps("col_actions"),
            key: "actions",
            width: 100,
            render: (_, row) => {
                if ((row.status || "").toUpperCase() !== "ACTIVE") return null;
                return (
                    <Popconfirm
                        title={t("revoke_confirm_title")}
                        description={t("revoke_confirm_body")}
                        onConfirm={() => void handleRevoke(row.credentialId)}
                    >
                        <Button type="text" size="small" danger disabled={busy}>
                            {tApps("revoke")}
                        </Button>
                    </Popconfirm>
                );
            },
        },
    ];

    const webhookColumns: ColumnsType<WebhookEndpointView> = [
        {
            title: "URL",
            dataIndex: "url",
            key: "url",
            ellipsis: true,
        },
        {
            title: tDev("webhook_col_status"),
            dataIndex: "status",
            key: "status",
            width: 110,
            render: (status: string) => statusTag(status),
        },
        {
            title: tCommon("actions"),
            key: "actions",
            width: 140,
            render: (_, row) => {
                const active = (row.status || "").toUpperCase() === "ACTIVE";
                return (
                    <Popconfirm
                        title={active ? t("disable_confirm") : t("enable_confirm")}
                        onConfirm={() =>
                            void handlePatchStatus(row.id, active ? "DISABLED" : "ACTIVE")
                        }
                    >
                        <Button type="text" size="small" disabled={busy}>
                            {active ? t("disable") : t("enable")}
                        </Button>
                    </Popconfirm>
                );
            },
        },
    ];

    const checkLabel = (id: ReadinessCheck["id"]) => {
        if (id === "live_credential") return t("check_live_credential");
        return t("check_live_webhook");
    };

    return (
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
            <Alert
                type="warning"
                showIcon
                message={t("risk_title")}
                description={t("risk_body")}
                style={{ borderRadius: 8 }}
            />

            <Card
                title={
                    <Flex align="center" gap={10}>
                        <SafetyCertificateOutlined style={{ fontSize: 18, color: "#c2410c" }} />
                        <span>{t("title")}</span>
                        <Tag color="orange">LIVE</Tag>
                    </Flex>
                }
                styles={{
                    header: { borderBottom: "1px solid #f1f5f9", padding: "14px 20px" },
                    body: { padding: "16px 20px 20px" },
                }}
                style={{
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                }}
            >
                <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
                    {t("subtitle")}
                </Typography.Paragraph>
                <Form layout="vertical" style={{ maxWidth: 420 }}>
                    <Form.Item label={t("select_application")} style={{ marginBottom: 8 }}>
                        <Select
                            showSearch
                            optionFilterProp="label"
                            loading={loadingApps}
                            value={selectedCode}
                            onChange={setSelectedCode}
                            style={{ width: "100%" }}
                            options={apps.map((a) => ({
                                value: a.applicationCode,
                                label: `${a.applicationCode}${a.name ? ` — ${a.name}` : ""}`,
                            }))}
                            placeholder={t("select_application_placeholder")}
                            notFoundContent={
                                loadingApps ? tCommon("loading") : t("apps_empty")
                            }
                        />
                    </Form.Item>
                    {!loadingApps && apps.length === 0 ? (
                        <Alert
                            type="info"
                            showIcon
                            message={t("apps_empty")}
                            description={t("apps_empty_hint")}
                        />
                    ) : null}
                </Form>
            </Card>

            <Card
                title={
                    <Flex align="center" gap={10}>
                        <KeyOutlined style={{ fontSize: 16, color: "#c2410c" }} />
                        <span>{t("credentials_title")}</span>
                    </Flex>
                }
                extra={
                    <Button
                        type="primary"
                        danger
                        icon={<PlusOutlined />}
                        disabled={createDisabled || busy}
                        onClick={() => setCreateLiveOpen(true)}
                    >
                        {t("create_live")}
                    </Button>
                }
                styles={{ body: { padding: "16px 20px" } }}
                style={{ borderRadius: 10, border: "1px solid #e2e8f0" }}
            >
                <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: 0 }}>
                    {t("create_ux_note")}
                </Typography.Paragraph>
                <Table
                    rowKey={(r) => r.credentialId}
                    size="small"
                    loading={loadingCreds}
                    columns={credentialColumns}
                    dataSource={liveCredentials}
                    pagination={false}
                    locale={{ emptyText: t("credentials_empty") }}
                />
            </Card>

            <Card
                title={
                    <Flex align="center" gap={10}>
                        <ApiOutlined style={{ fontSize: 16, color: "#c2410c" }} />
                        <span>{t("webhooks_title")}</span>
                    </Flex>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        disabled={!selectedCode || busy}
                        onClick={() => setWebhookModalOpen(true)}
                    >
                        {t("create_live_webhook")}
                    </Button>
                }
                styles={{ body: { padding: "16px 20px" } }}
                style={{ borderRadius: 10, border: "1px solid #e2e8f0" }}
            >
                {createdWebhook ? (
                    <Alert
                        type="warning"
                        style={{ marginBottom: 12 }}
                        message={tDev("webhook_created_save_secret")}
                        description={
                            <Space direction="vertical">
                                <Typography.Text copyable>{createdWebhook.secret || ""}</Typography.Text>
                                <Button size="small" onClick={() => setCreatedWebhook(null)}>
                                    {tDev("webhook_saved_secret_button")}
                                </Button>
                            </Space>
                        }
                    />
                ) : null}
                <Table
                    rowKey={(r) => r.id}
                    size="small"
                    loading={loadingHooks}
                    columns={webhookColumns}
                    dataSource={liveWebhooks}
                    pagination={false}
                    locale={{ emptyText: t("webhooks_empty") }}
                />
            </Card>

            <Card
                title={t("checklist_title")}
                styles={{ body: { padding: "16px 20px" } }}
                style={{ borderRadius: 10, border: "1px solid #e2e8f0" }}
            >
                <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
                    {t("checklist_subtitle")}
                </Typography.Paragraph>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    {checklist.map((check) => (
                        <Flex key={check.id} justify="space-between" align="center">
                            <Typography.Text>{checkLabel(check.id)}</Typography.Text>
                            <Tag color={check.state === "PASS" ? "success" : "error"}>
                                {check.state}
                            </Tag>
                        </Flex>
                    ))}
                </Space>
            </Card>

            <Modal
                title={t("create_live_confirm_title")}
                open={createLiveOpen}
                onCancel={() => setCreateLiveOpen(false)}
                onOk={() => void handleCreateLive()}
                confirmLoading={busy}
                okText={t("create_live_confirm_ok")}
                okButtonProps={{ danger: true }}
                cancelText={tCommon("cancel")}
                destroyOnHidden
            >
                <Alert type="error" showIcon message={t("create_live_warning")} style={{ marginBottom: 12 }} />
                <Typography.Paragraph>{t("create_live_confirm_body")}</Typography.Paragraph>
            </Modal>

            <Modal
                title={t("create_live_webhook")}
                open={webhookModalOpen}
                onCancel={() => setWebhookModalOpen(false)}
                onOk={() => webhookForm.submit()}
                confirmLoading={busy}
                okText={tDev("add_webhook_confirm")}
                cancelText={tCommon("cancel")}
                destroyOnHidden
                width={560}
            >
                <Alert
                    type="warning"
                    showIcon
                    message={t("live_webhook_env_fixed")}
                    style={{ marginBottom: 16 }}
                />
                <Form
                    form={webhookForm}
                    layout="vertical"
                    onFinish={(values) => void handleCreateLiveWebhook(values)}
                    initialValues={{ url: "", description: "", eventTypes: [] }}
                >
                    <Form.Item
                        name="url"
                        label={tDev("webhook_url")}
                        rules={[
                            { required: true, message: tDev("webhook_url_required") },
                            {
                                validator: async (_, value) => {
                                    if (!value) return;
                                    const result = validateWebhookUrl(String(value), "LIVE");
                                    if (!result.ok) {
                                        throw new Error(tDev("webhook_url_https_required"));
                                    }
                                },
                            },
                        ]}
                    >
                        <Input placeholder={tDev("webhook_url_placeholder")} />
                    </Form.Item>
                    <Form.Item name="description" label={tDev("webhook_description")}>
                        <Input placeholder={tDev("webhook_description_placeholder")} />
                    </Form.Item>
                    <Form.Item
                        name="eventTypes"
                        label={tDev("webhook_event_types")}
                        rules={[{ required: true, message: tDev("webhook_event_types_required") }]}
                    >
                        <WebhookEventTypePicker />
                    </Form.Item>
                </Form>
            </Modal>

            <IssuedCredentialModal
                open={secretOpen}
                issued={issued}
                onClose={() => {
                    setSecretOpen(false);
                    setIssued(null);
                }}
            />
        </Space>
    );
}
