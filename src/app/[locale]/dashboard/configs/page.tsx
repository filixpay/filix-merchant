"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Alert, Button, Pagination, Skeleton, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import {
    api,
    ApiError,
    FinancialInstitutionView,
    ChannelView,
    PaymentConfigView,
    ScenarioView,
    SubMerchantView,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CreateConfigModal, {
    type CreateConfigFormValues,
    type CreateConfigPrefill,
} from "@/components/configs/CreateConfigModal";
import EditConfigModal from "@/components/configs/EditConfigModal";
import ScenarioCard from "@/components/configs/ScenarioCard";
import type { ConfigEditData } from "@/components/configs/config-model";
import { buildConfigUpdatePayload } from "@/components/configs/config-model";
import {
    buildScenarioKey,
    groupConfigs,
    hasDuplicateConfig,
    type ScenarioGroup,
} from "@/components/configs/scenario-group";
import pageStyles from "./configs.module.css";
import DashboardTableEmpty from "@/components/layout/DashboardTableEmpty";
import DashboardTableError from "@/components/layout/DashboardTableError";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import { resolveDashboardTableState } from "@/lib/dashboard/table-state";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import { useTableQueryState } from "@/lib/dashboard/use-table-query-state";

export default function ConfigsPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [createPrefill, setCreatePrefill] = useState<CreateConfigPrefill | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [institutions, setInstitutions] = useState<FinancialInstitutionView[]>([]);
    const [channels, setChannels] = useState<ChannelView[]>([]);
    const [scenarios, setScenarios] = useState<ScenarioView[]>([]);
    const [subMerchants, setSubMerchants] = useState<SubMerchantView[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingConfig, setEditingConfig] = useState<PaymentConfigView | null>(null);
    const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);

    const t = useTranslations("Configs");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const { page, pageSize, setPagination } = useTableQueryState({ page: 0, pageSize: 50 });

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize, {}, { page: "pageNumber", size: "pageSize" }),
        [page, pageSize],
    );

    const { items: configs, total, loading, isRefreshing, error, reload } = usePagedResource<
        PaymentConfigView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.configs.list(params, token),
    });

    const scenarioGroups = useMemo(
        () => groupConfigs(configs, { institutions, channels, scenarios, subMerchants }),
        [configs, institutions, channels, scenarios, subMerchants],
    );

    const fetchLists = useCallback(async () => {
        if (!accessToken) return;
        try {
            const [institutionsRes, channelsRes, scenariosRes, subMerchantsRes] = await Promise.all([
                api.financialInstitutions.list({ pageNumber: 0, pageSize: 100 }, accessToken),
                api.channels.list({ pageNumber: 0, pageSize: 100 }, accessToken),
                api.scenarios.list({ pageNumber: 0, pageSize: 100 }, accessToken),
                api.subMerchants.list({ page: 0, size: 100 }, accessToken),
            ]);
            setInstitutions(normalizePagedResponse(institutionsRes).items);
            setChannels(normalizePagedResponse(channelsRes).items);
            setScenarios(normalizePagedResponse(scenariosRes).items);
            setSubMerchants(normalizePagedResponse(subMerchantsRes).items);
        } catch (err) {
            console.error("Failed to fetch lists:", err);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            fetchLists();
        }
    }, [accessToken, fetchLists]);

    const handleAddConfig = async (values: CreateConfigFormValues) => {
        if (!accessToken) return;
        const scenarioCode = values.scenarioCode;
        const key = buildScenarioKey(values.subMerchantId, values.bankCode, scenarioCode);
        const group = scenarioGroups.find((g) => g.key === key);
        if (group && hasDuplicateConfig(group, values.channelCode)) {
            message.error(t("duplicate_channel"));
            return;
        }
        setSubmitting(true);
        try {
            await api.configs.create(values, accessToken);
            setShowAddModal(false);
            setCreatePrefill(null);
            reload();
            message.success(t("add_config"));
        } catch (err) {
            console.error(err);
            if (!handleDashboardApiError(err)) {
                message.error(err instanceof ApiError ? err.message : "Failed to create configuration");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateConfig = async (editData: ConfigEditData) => {
        if (!editingConfig || !accessToken) return;
        setSubmitting(true);
        try {
            await api.configs.update(editingConfig.id, buildConfigUpdatePayload(editData), accessToken);
            setShowEditModal(false);
            setEditingConfig(null);
            reload();
            message.success(t("edit_success"));
        } catch (err) {
            console.error(err);
            if (!handleDashboardApiError(err)) {
                message.error(err instanceof ApiError ? err.message : "Failed to update configuration");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteConfig = async (id: number) => {
        if (!accessToken) return;
        try {
            await api.configs.delete(id, accessToken);
            reload();
        } catch (err) {
            console.error(err);
            if (!handleDashboardApiError(err)) {
                message.error(err instanceof ApiError ? err.message : "Failed to delete configuration");
            }
        }
    };

    const handleToggleOpen = async (config: PaymentConfigView, open: boolean) => {
        if (!accessToken) return;
        setStatusUpdatingId(config.id);
        try {
            await api.configs.update(
                config.id,
                {
                    channelCode: config.channelCode,
                    openStatus: open ? "OPENED" : "NONACTIVEED",
                },
                accessToken,
            );
            reload();
            message.success(open ? t("status_toggle_open_success") : t("status_toggle_close_success"));
        } catch (err) {
            console.error(err);
            if (!handleDashboardApiError(err)) {
                message.error(err instanceof ApiError ? err.message : "Failed to update status");
            }
        } finally {
            setStatusUpdatingId(null);
        }
    };

    const openGlobalAdd = () => {
        setCreatePrefill(null);
        setShowAddModal(true);
    };

    const openPrefillAdd = (group: ScenarioGroup) => {
        setCreatePrefill({
            subMerchantId: group.subMerchantId,
            bankCode: group.institutionCode,
            scenarioCode: group.scenarioCode,
        });
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setCreatePrefill(null);
    };

    const tableState = resolveDashboardTableState({
        loading,
        error: error ?? null,
        rowCount: configs.length,
    });

    const extra = (
        <Button type="primary" icon={<PlusOutlined />} onClick={openGlobalAdd}>
            {t("add_config")}
        </Button>
    );

    return (
        <DashboardPage
            title={t("title")}
            subtitle={t("subtitle")}
            extra={extra}
            plain
        >
            {accessToken ? (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    {tableState === "refresh-error" ? (
                        <Alert
                            type="warning"
                            showIcon
                            message={t("empty")}
                            action={
                                <Button size="small" onClick={reload}>
                                    {tCommon("refresh")}
                                </Button>
                            }
                        />
                    ) : null}

                    {loading && configs.length === 0 ? (
                        <Skeleton active />
                    ) : tableState === "error" ? (
                        <DashboardTableError description={tCommon("error")} onRetry={reload} />
                    ) : !loading && scenarioGroups.length === 0 ? (
                        <DashboardTableEmpty description={t("empty")} />
                    ) : (
                        <div className={pageStyles.scenarioGrid}>
                            {scenarioGroups.map((group) => (
                                <ScenarioCard
                                    key={group.key}
                                    group={group}
                                    channels={channels}
                                    statusUpdatingId={statusUpdatingId}
                                    onEdit={(config) => {
                                        setEditingConfig(config);
                                        setShowEditModal(true);
                                    }}
                                    onDelete={handleDeleteConfig}
                                    onToggleOpen={handleToggleOpen}
                                    onAddChannel={openPrefillAdd}
                                />
                            ))}
                        </div>
                    )}

                    {scenarioGroups.length > 0 || total > 0 ? (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Pagination
                                current={page + 1}
                                pageSize={pageSize}
                                total={total}
                                showSizeChanger
                                disabled={loading || isRefreshing}
                                showTotal={(pageTotal) =>
                                    t("pagination_summary", {
                                        total: pageTotal,
                                        scenarios: scenarioGroups.length,
                                    })
                                }
                                onChange={(nextPage, nextPageSize) => setPagination(nextPage - 1, nextPageSize)}
                            />
                        </div>
                    ) : null}
                </Space>
            ) : null}

            {accessToken ? (
                <>
                    <CreateConfigModal
                        open={showAddModal}
                        onClose={closeAddModal}
                        onSubmit={handleAddConfig}
                        submitting={submitting}
                        institutions={institutions}
                        channels={channels}
                        scenarios={scenarios}
                        subMerchants={subMerchants}
                        prefill={createPrefill}
                    />

                    <EditConfigModal
                        open={showEditModal}
                        config={editingConfig}
                        onClose={() => {
                            setShowEditModal(false);
                            setEditingConfig(null);
                        }}
                        onSubmit={handleUpdateConfig}
                        submitting={submitting}
                    />
                </>
            ) : null}
        </DashboardPage>
    );
}
