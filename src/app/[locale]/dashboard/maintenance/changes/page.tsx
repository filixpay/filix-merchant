"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, Modal, Radio, Select, Space, Table, Tag, Tooltip, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { signIn, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    api,
    ApiError,
    PendingChangeExistsError,
    CHANGE_TYPES,
    type ChangeType,
    type ChangeRequestStatus,
    type MerchantChangeRequestListItem,
} from "@/lib/api";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import DashboardPage from "@/components/layout/DashboardPage";
import { getMaintenanceStatusTagColor, sortChangeRequestsByIdDesc, truncateIdMiddle, formatChangeSubmittedAtDisplay } from "@/components/maintenance/maintenance-change-ui";
import { REGISTRATION_COUNTRY_GROUPS } from "@/lib/onboarding/registration-countries";

export default function MaintenanceChangesPage() {
    const t = useTranslations("Maintenance");
    const locale = useLocale();
    const router = useRouter();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [items, setItems] = useState<MerchantChangeRequestListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [changeType, setChangeType] = useState<ChangeType>("LEGAL_INFO");
    const [registrationCountry, setRegistrationCountry] = useState<string>("CN");
    const [requireCountry, setRequireCountry] = useState(false);
    const pageSize = 20;

    const STATUS_OPTIONS: ChangeRequestStatus[] = [
        "DRAFT",
        "SUBMITTED",
        "UNDER_REVIEW",
        "RETURNED",
        "APPROVED",
        "APPLYING",
        "APPLY_FAILED",
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
    ];

    const [filterChangeType, setFilterChangeType] = useState<ChangeType | null>(null);
    const [filterStatus, setFilterStatus] = useState<ChangeRequestStatus | null>(null);
    const [draftChangeType, setDraftChangeType] = useState<ChangeType | null>(null);
    const [draftStatus, setDraftStatus] = useState<ChangeRequestStatus | null>(null);

    const load = useCallback(async () => {
        if (!accessToken) {
            return;
        }
        setLoading(true);
        try {
            const response = await api.maintenance.list(accessToken, {
                page,
                size: pageSize,
                changeType: filterChangeType ?? undefined,
                status: filterStatus ?? undefined,
            });
            const normalized = normalizePagedResponse(response);
            setItems(sortChangeRequestsByIdDesc(normalized.items));
            setTotal(normalized.total);
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
        } finally {
            setLoading(false);
        }
    }, [accessToken, page, t, filterChangeType, filterStatus]);

    useEffect(() => {
        if (!accessToken) {
            signIn();
            return;
        }
        load();
    }, [accessToken, load]);

    const handleCreate = async () => {
        if (!accessToken) {
            signIn();
            return;
        }
        if (changeType === "LEGAL_INFO" && requireCountry && !registrationCountry) {
            message.error(t("validation.countryRequired"));
            return;
        }
        setCreating(true);
        try {
            const body =
                changeType === "LEGAL_INFO"
                    ? { changeType, registrationCountry }
                    : { changeType };
            const created = await api.maintenance.create(accessToken, body);
            message.success(t("createSuccess"));
            setCreateOpen(false);
            setRequireCountry(false);
            router.push(`/${locale}/dashboard/maintenance/changes/${created.id}`);
        } catch (err) {
            if (err instanceof PendingChangeExistsError) {
                message.error(t("errors.pendingExists"));
            } else if (
                err instanceof ApiError &&
                (err.code === "MERCHANT_MISSING_REGISTRATION_COUNTRY" ||
                    err.message === "MERCHANT_MISSING_REGISTRATION_COUNTRY")
            ) {
                setRequireCountry(true);
                message.error(t("errors.missingRegistrationCountry"));
            } else {
                message.error(err instanceof ApiError ? err.message : t("errors.generic"));
            }
        } finally {
            setCreating(false);
        }
    };

    return (
        <DashboardPage
            title={t("changesTitle")}
            subtitle={t("changesSubtitle")}
            extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
                    {t("create")}
                </Button>
            }
        >
            <Space style={{ width: "100%", marginBottom: 16, flexWrap: "wrap" }} align="end">
                <div style={{ minWidth: 220 }}>
                    <div style={{ fontSize: 12, color: "var(--ant-color-text-secondary)", marginBottom: 6 }}>
                        {t("changeTypeLabel")}
                    </div>
                    <Select
                        style={{ width: "100%" }}
                        allowClear
                        placeholder={t("filterChangeTypePlaceholder")}
                        value={draftChangeType ?? undefined}
                        onChange={(v) => setDraftChangeType(v ?? null)}
                        options={CHANGE_TYPES.map((value) => ({
                            value,
                            label: t(`changeType.${value}`),
                        }))}
                    />
                </div>

                <div style={{ minWidth: 220 }}>
                    <div style={{ fontSize: 12, color: "var(--ant-color-text-secondary)", marginBottom: 6 }}>
                        {t("columns.status")}
                    </div>
                    <Select
                        style={{ width: "100%" }}
                        allowClear
                        placeholder={t("filterStatusPlaceholder")}
                        value={draftStatus ?? undefined}
                        onChange={(v) => setDraftStatus(v ?? null)}
                        options={STATUS_OPTIONS.map((value) => ({
                            value,
                            label: t(`status.${value}`),
                        }))}
                    />
                </div>

                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            setFilterChangeType(draftChangeType);
                            setFilterStatus(draftStatus);
                            setPage(0);
                        }}
                    >
                        {t("search")}
                    </Button>
                    <Button
                        onClick={() => {
                            setDraftChangeType(null);
                            setDraftStatus(null);
                            setFilterChangeType(null);
                            setFilterStatus(null);
                            setPage(0);
                        }}
                    >
                        {t("reset")}
                    </Button>
                </Space>
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                dataSource={items}
                onRow={(record) => ({
                    onClick: () =>
                        router.push(`/${locale}/dashboard/maintenance/changes/${record.id}`),
                    style: { cursor: "pointer" },
                })}
                pagination={{
                    current: page + 1,
                    pageSize,
                    total,
                    onChange: (nextPage) => setPage(nextPage - 1),
                }}
                columns={[
                    {
                        title: t("columns.id"),
                        dataIndex: "id",
                        width: 220,
                        render: (value: unknown) => {
                            const fullId = String(value ?? "");
                            const shortId = truncateIdMiddle(fullId, 8, 4);
                            return (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                                    <Tooltip title={fullId}>
                                        <Typography.Text
                                            ellipsis={{ tooltip: fullId }}
                                            style={{ maxWidth: 120, display: "inline-block" }}
                                        >
                                            {shortId}
                                        </Typography.Text>
                                    </Tooltip>
                                    <span
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => e.stopPropagation()}
                                    >
                                        <Typography.Text copyable={{ text: fullId, tooltips: false }} />
                                    </span>
                                </span>
                            );
                        },
                    },
                    {
                        title: t("columns.changeType"),
                        dataIndex: "changeType",
                        render: (value: ChangeType) => t(`changeType.${value}`),
                    },
                    {
                        title: t("columns.status"),
                        dataIndex: "status",
                        render: (value: ChangeRequestStatus) => (
                            <Tag color={getMaintenanceStatusTagColor(value)}>{t(`status.${value}`)}</Tag>
                        ),
                    },
                    {
                        title: t("columns.businessName"),
                        dataIndex: "businessName",
                        render: (value?: string) =>
                            value ? (
                                <Typography.Text
                                    ellipsis={{ tooltip: value }}
                                    style={{ maxWidth: 220, display: "inline-block" }}
                                >
                                    {value}
                                </Typography.Text>
                            ) : (
                                "—"
                            ),
                    },
                    {
                        title: t("columns.submittedAt"),
                        dataIndex: "submittedAt",
                        render: (value: string | undefined, record: MerchantChangeRequestListItem) => {
                            const text = formatChangeSubmittedAtDisplay(
                                value,
                                record.status,
                                t("notSubmitted"),
                            );
                            if (!value) {
                                return (
                                    <Typography.Text type="secondary" style={{ color: "#8c8c8c" }}>
                                        {text}
                                    </Typography.Text>
                                );
                            }
                            return text;
                        },
                    },
                    {
                        title: t("columns.updatedAt"),
                        dataIndex: "updatedAt",
                        render: (value?: string) =>
                            value ? new Date(value).toLocaleString() : "—",
                    },
                    {
                        title: t("columns.actions"),
                        key: "actions",
                        width: 240,
                        render: (_: unknown, record: MerchantChangeRequestListItem) => {
                            const editable = record.status === "DRAFT" || record.status === "RETURNED";
                            return (
                                <div onClick={(e) => e.stopPropagation()}>
                                    {editable ? (
                                        <Space size={8}>
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={() =>
                                                    router.push(
                                                        `/${locale}/dashboard/maintenance/changes/${record.id}`,
                                                    )
                                                }
                                            >
                                                {t("continueEdit")}
                                            </Button>
                                            <Button
                                                danger
                                                size="small"
                                                onClick={() => {
                                                    Modal.confirm({
                                                        title: t("deleteConfirmTitle"),
                                                        content: t("deleteConfirmContent"),
                                                        okText: t("deleteConfirmOk"),
                                                        cancelText: t("cancelShort"),
                                                        onOk: async () => {
                                                            if (!accessToken) {
                                                                return;
                                                            }
                                                            try {
                                                                await api.maintenance.cancel(accessToken, record.id);
                                                                message.success(t("cancelSuccess"));
                                                                await load();
                                                            } catch (err) {
                                                                message.error(
                                                                    err instanceof ApiError
                                                                        ? err.message
                                                                        : t("errors.generic"),
                                                                );
                                                            }
                                                        },
                                                    });
                                                }}
                                            >
                                                {t("delete")}
                                            </Button>
                                        </Space>
                                    ) : (
                                        <Space size={8}>
                                            <Button
                                                size="small"
                                                onClick={() =>
                                                    router.push(
                                                        `/${locale}/dashboard/maintenance/changes/${record.id}`,
                                                    )
                                                }
                                            >
                                                {t("viewDetails")}
                                            </Button>
                                        </Space>
                                    )}
                                </div>
                            );
                        },
                    },
                ]}
            />

            <Modal
                title={t("createTitle")}
                open={createOpen}
                onCancel={() => {
                    setCreateOpen(false);
                    setRequireCountry(false);
                }}
                onOk={handleCreate}
                confirmLoading={creating}
                okText={t("createNow")}
                cancelText={t("cancelShort")}
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <div>{t("changeTypeLabel")}</div>
                    <Radio.Group
                        value={changeType}
                        onChange={(e) => {
                            setChangeType(e.target.value as ChangeType);
                            setRequireCountry(false);
                        }}
                        style={{
                            width: "100%",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 12,
                        }}
                    >
                        {CHANGE_TYPES.map((value) => (
                            <Card key={value} style={{ border: "1px solid #e2e8f0" }}>
                                <Radio value={value} style={{ display: "block", padding: 10 }}>
                                    {t(`changeType.${value}`)}
                                </Radio>
                            </Card>
                        ))}
                    </Radio.Group>
                    {(changeType === "LEGAL_INFO" || requireCountry) && (
                        <>
                            <div>{t("registrationCountryLabel")}</div>
                            <Select
                                style={{ width: "100%" }}
                                value={registrationCountry}
                                onChange={setRegistrationCountry}
                                showSearch
                                optionFilterProp="label"
                                options={REGISTRATION_COUNTRY_GROUPS.map((group) => ({
                                    label: t(`regions.${group.region}` as "regions.GREATER_CHINA"),
                                    options: group.options.map((item) => ({
                                        value: item.value,
                                        label: t(`countries.${item.labelKey}`),
                                    })),
                                }))}
                            />
                            {requireCountry ? (
                                <div style={{ color: "var(--ant-color-warning)" }}>
                                    {t("errors.missingRegistrationCountryHint")}
                                </div>
                            ) : null}
                        </>
                    )}
                </Space>
            </Modal>
        </DashboardPage>
    );
}
