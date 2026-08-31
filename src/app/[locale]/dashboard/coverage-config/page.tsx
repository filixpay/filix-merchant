"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Alert, Button, Form, Modal, Space, Table, Tag, message } from "antd";
import { PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { ColumnsType } from "antd/es/table";
import { api } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import DashboardTableEmpty from "@/components/layout/DashboardTableEmpty";
import DashboardTableError from "@/components/layout/DashboardTableError";
import CoverageProviderForm, {
    buildConfigJson,
    buildSecretsPayload,
    type CoverageProviderFormValues,
} from "@/components/coverage/CoverageProviderForm";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { resolveMerchantCoverageAccess } from "@/lib/coverage/merchant-coverage-access";
import { useMerchantCapabilities } from "@/components/layout/use-merchant-capabilities";
import type { CoverageConfigView, CoverageProviderSchema } from "@/types/coverageConfig";

export default function CoverageConfigPage() {
    const t = useTranslations("CoverageConfig");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const router = useRouter();
    const params = useParams();
    const locale = typeof params.locale === "string" ? params.locale : "en";
    const { activeMerchant } = useMerchantCapabilities(accessToken);
    const { showCoverageConfig, showCoverageInsurance, isPlatform } = useMemo(
        () => resolveMerchantCoverageAccess(activeMerchant),
        [activeMerchant],
    );
    const isPlatformMerchant = isPlatform;
    const [configs, setConfigs] = useState<CoverageConfigView[]>([]);
    const [providers, setProviders] = useState<CoverageProviderSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<unknown | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [editingConfig, setEditingConfig] = useState<CoverageConfigView | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [testingId, setTestingId] = useState<string | null>(null);
    const [actionId, setActionId] = useState<string | null>(null);
    const configsRef = useRef(configs);
    configsRef.current = configs;
    const [createForm] = Form.useForm<CoverageProviderFormValues>();
    const [editForm] = Form.useForm<CoverageProviderFormValues>();

    const activeConfig = useMemo(
        () =>
            configs.find((config) => config.status === "ACTIVE" || config.status === "MAINTENANCE") ?? null,
        [configs],
    );

    const reload = useCallback(async () => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        const hasRows = configsRef.current.length > 0;
        setLoading(!hasRows);
        setIsRefreshing(hasRows);
        setError(null);
        try {
            const [configList, providerList] = await Promise.all([
                api.risk.coverageConfig.list(accessToken),
                api.risk.coverageConfig.listProviders(accessToken),
            ]);
            setConfigs(configList);
            setProviders(providerList);
        } catch (err) {
            if (!handleDashboardApiError(err)) {
                setError(err);
            }
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [accessToken]);

    useEffect(() => {
        if (!activeMerchant) {
            return;
        }
        if (!showCoverageConfig) {
            if (showCoverageInsurance) {
                router.replace(`/${locale}/dashboard/coverage-insurance`);
            } else {
                router.replace(`/${locale}/dashboard`);
            }
        }
    }, [activeMerchant, showCoverageConfig, showCoverageInsurance, locale, router]);

    useEffect(() => {
        void reload();
    }, [accessToken, reload]);

    const openCreateModal = () => {
        setModalMode("create");
        setEditingConfig(null);
        createForm.resetFields();
        setModalOpen(true);
    };

    const openEditModal = (config: CoverageConfigView) => {
        setModalMode("edit");
        setEditingConfig(config);
        editForm.resetFields();
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingConfig(null);
    };

    const handleSubmit = async () => {
        if (!accessToken) return;
        const form = modalMode === "create" ? createForm : editForm;
        const values = await form.validateFields();
        const providerType = modalMode === "create" ? values.provider : editingConfig?.provider;
        const providerSchema = providers.find((provider) => provider.type === providerType);
        const configJson = buildConfigJson(providerSchema, values.config ?? {});
        const secrets = buildSecretsPayload(providerSchema, values.secrets ?? {});

        setSubmitting(true);
        try {
            if (modalMode === "create") {
                await api.risk.coverageConfig.create(accessToken, {
                    provider: values.provider!,
                    configJson,
                    secrets,
                });
                message.success(t("messages.created"));
            } else if (editingConfig) {
                await api.risk.coverageConfig.update(accessToken, editingConfig.id, {
                    configJson,
                    secrets,
                });
                message.success(t("messages.updated"));
            }
            closeModal();
            await reload();
        } catch (err) {
            handleDashboardApiError(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleActivate = async (config: CoverageConfigView) => {
        if (!accessToken) return;
        setActionId(config.id);
        try {
            await api.risk.coverageConfig.activate(accessToken, config.id);
            message.success(t("messages.activated"));
            await reload();
        } catch (err) {
            handleDashboardApiError(err);
        } finally {
            setActionId(null);
        }
    };

    const handleDeactivate = async (config: CoverageConfigView) => {
        if (!accessToken) return;
        setActionId(config.id);
        try {
            await api.risk.coverageConfig.deactivate(accessToken, config.id);
            message.success(t("messages.deactivated"));
            await reload();
        } catch (err) {
            handleDashboardApiError(err);
        } finally {
            setActionId(null);
        }
    };

    const handleEnterMaintenance = async (config: CoverageConfigView) => {
        if (!accessToken) return;
        setActionId(config.id);
        try {
            await api.risk.coverageConfig.enterMaintenance(accessToken, config.id);
            message.success(t("messages.maintenance_entered"));
            await reload();
        } catch (err) {
            handleDashboardApiError(err);
        } finally {
            setActionId(null);
        }
    };

    const handleResume = async (config: CoverageConfigView) => {
        if (!accessToken) return;
        setActionId(config.id);
        try {
            await api.risk.coverageConfig.resumeFromMaintenance(accessToken, config.id);
            message.success(t("messages.resumed"));
            await reload();
        } catch (err) {
            handleDashboardApiError(err);
        } finally {
            setActionId(null);
        }
    };

    const renderStatusTag = (status: CoverageConfigView["status"]) => {
        if (status === "ACTIVE") {
            return <Tag color="green">{t("status.active")}</Tag>;
        }
        if (status === "MAINTENANCE") {
            return <Tag color="gold">{t("status.maintenance")}</Tag>;
        }
        return <Tag>{t("status.disabled")}</Tag>;
    };

    const handleTestConnection = async (config: CoverageConfigView) => {
        if (!accessToken) return;
        setTestingId(config.id);
        try {
            const result = await api.risk.coverageConfig.testConnection(accessToken, config.id);
            if (result.status === "OK") {
                message.success(
                    t("messages.test_ok", {
                        latencyMs: result.latencyMs,
                        providerVersion: result.providerVersion ?? "-",
                    }),
                );
            } else {
                message.error(t("messages.test_failed", { status: result.status }));
            }
        } catch (err) {
            handleDashboardApiError(err);
        } finally {
            setTestingId(null);
        }
    };

    const columns: ColumnsType<CoverageConfigView> = [
        {
            title: t("columns.provider"),
            dataIndex: "provider",
            key: "provider",
        },
        {
            title: t("columns.status"),
            dataIndex: "status",
            key: "status",
            render: (status: CoverageConfigView["status"]) => renderStatusTag(status),
        },
        {
            title: t("columns.version"),
            dataIndex: "configVersion",
            key: "configVersion",
        },
        {
            title: t("columns.updated_at"),
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (value: string) => new Date(value).toLocaleString(),
        },
        {
            title: tCommon("actions"),
            key: "actions",
            render: (_, record) => (
                <Space wrap>
                    <Button size="small" onClick={() => openEditModal(record)}>
                        {t("actions.edit")}
                    </Button>
                    <Button
                        size="small"
                        icon={<ThunderboltOutlined />}
                        loading={testingId === record.id}
                        onClick={() => void handleTestConnection(record)}
                    >
                        {t("actions.test_connection")}
                    </Button>
                    {record.status === "ACTIVE" ? (
                        <>
                            {isPlatformMerchant ? (
                                <Button
                                    size="small"
                                    loading={actionId === record.id}
                                    onClick={() => void handleEnterMaintenance(record)}
                                >
                                    {t("actions.enter_maintenance")}
                                </Button>
                            ) : null}
                            <Button
                                size="small"
                                danger
                                loading={actionId === record.id}
                                onClick={() => void handleDeactivate(record)}
                            >
                                {t("actions.deactivate")}
                            </Button>
                        </>
                    ) : record.status === "MAINTENANCE" && isPlatformMerchant ? (
                        <Button
                            size="small"
                            type="primary"
                            loading={actionId === record.id}
                            onClick={() => void handleResume(record)}
                        >
                            {t("actions.resume")}
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            type="primary"
                            loading={actionId === record.id}
                            onClick={() => void handleActivate(record)}
                        >
                            {t("actions.activate")}
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {isPlatformMerchant ? (
                    <Alert type="info" showIcon message={t("platform_hosted_banner")} />
                ) : null}
                {activeConfig?.status === "MAINTENANCE" ? (
                    <Alert type="warning" showIcon message={t("maintenance_banner")} />
                ) : activeConfig ? (
                    <Alert
                        type="info"
                        showIcon
                        message={t("active_banner", { provider: activeConfig.provider, id: activeConfig.id })}
                    />
                ) : (
                    <Alert type="warning" showIcon message={t("no_active_banner")} />
                )}

                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                        {t("actions.create")}
                    </Button>
                    <Button loading={isRefreshing} onClick={() => void reload()}>
                        {tCommon("refresh")}
                    </Button>
                </Space>

                {error ? (
                    <DashboardTableError description={tCommon("error")} onRetry={() => void reload()} />
                ) : (
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={configs}
                        loading={loading}
                        locale={{ emptyText: <DashboardTableEmpty description={t("empty")} /> }}
                        pagination={false}
                    />
                )}
            </Space>

            <Modal
                title={modalMode === "create" ? t("modal.create_title") : t("modal.edit_title")}
                open={modalOpen}
                onCancel={closeModal}
                onOk={() => void handleSubmit()}
                confirmLoading={submitting}
                destroyOnClose
                width={640}
            >
                <Form
                    form={modalMode === "create" ? createForm : editForm}
                    layout="vertical"
                    initialValues={{ config: {}, secrets: {} }}
                >
                    <CoverageProviderForm
                        mode={modalMode}
                        providers={providers}
                        initialConfig={editingConfig}
                        showProviderWarning={modalMode === "create" && configs.some((c) => c.status === "ACTIVE")}
                    />
                </Form>
            </Modal>
        </DashboardPage>
    );
}
