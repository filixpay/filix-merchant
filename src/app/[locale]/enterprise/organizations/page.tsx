"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import {
    Alert,
    Button,
    Form,
    Input,
    Modal,
    Space,
    Table,
    Tag,
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
    api,
    ApiError,
    EnterpriseOrganizationDirectoryEntry,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import { getStoredSelectedEnterpriseCode } from "@/components/layout/enterprise-shell";
import { useEnterpriseCapabilities } from "@/components/layout/use-enterprise-capabilities";
import { isEnterpriseAdmin } from "@/lib/enterprise/enterprise-permissions";
import { setStoredSelectedOrganizationCode } from "@/lib/organization/selected-organization-code";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";

type LifecycleTarget = {
    organizationCode: number;
    name: string;
    mode: "suspend" | "activate";
};

export default function EnterpriseOrganizationsPage() {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("Enterprise.organizations");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const enterpriseCode = getStoredSelectedEnterpriseCode();
    const { activeEnterprise, enterprises } = useEnterpriseCapabilities(accessToken);
    const matchedEnterprise =
        enterprises.find(
            (item) => String(item.enterpriseCode) === String(enterpriseCode ?? ""),
        ) ?? activeEnterprise;
    const canAdmin = isEnterpriseAdmin(matchedEnterprise?.kind);

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<EnterpriseOrganizationDirectoryEntry[]>([]);
    const [createOpen, setCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [switchingCode, setSwitchingCode] = useState<number | null>(null);
    const [lifecycleTarget, setLifecycleTarget] = useState<LifecycleTarget | null>(null);
    const [lifecycleSubmitting, setLifecycleSubmitting] = useState(false);
    const [form] = Form.useForm<{ name: string; legalName?: string; ownerEmail?: string }>();
    const [lifecycleForm] = Form.useForm<{ reason?: string }>();

    const loadOrganizations = useCallback(async () => {
        if (!accessToken || !enterpriseCode) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            setItems(await api.enterprise.listOrganizations(accessToken, enterpriseCode));
        } catch (err) {
            handleDashboardApiError(err);
        } finally {
            setLoading(false);
        }
    }, [accessToken, enterpriseCode]);

    useEffect(() => {
        loadOrganizations();
    }, [loadOrganizations]);

    const handleCreate = async () => {
        if (!accessToken || !enterpriseCode) return;
        const values = await form.validateFields();
        setCreating(true);
        try {
            await api.enterprise.createOrganization(
                accessToken,
                {
                    name: values.name.trim(),
                    legalName: values.legalName?.trim(),
                    ownerEmail: values.ownerEmail?.trim() || undefined,
                },
                enterpriseCode,
            );
            message.success(t("create_success"));
            setCreateOpen(false);
            form.resetFields();
            await loadOrganizations();
        } catch (err) {
            if (err instanceof ApiError) {
                message.error(err.message);
            }
        } finally {
            setCreating(false);
        }
    };

    const openLifecycle = (row: EnterpriseOrganizationDirectoryEntry, mode: "suspend" | "activate") => {
        setLifecycleTarget({
            organizationCode: row.organizationCode,
            name: row.name,
            mode,
        });
        lifecycleForm.resetFields();
    };

    const handleLifecycle = async () => {
        if (!accessToken || !enterpriseCode || !lifecycleTarget) return;
        const values = await lifecycleForm.validateFields();
        const reason = values.reason?.trim();
        setLifecycleSubmitting(true);
        try {
            if (lifecycleTarget.mode === "suspend") {
                await api.enterprise.suspendOrganization(
                    accessToken,
                    lifecycleTarget.organizationCode,
                    { reason },
                    enterpriseCode,
                );
                message.success(t("suspend_success"));
            } else {
                await api.enterprise.activateOrganization(
                    accessToken,
                    lifecycleTarget.organizationCode,
                    reason ? { reason } : {},
                    enterpriseCode,
                );
                message.success(t("activate_success"));
            }
            setLifecycleTarget(null);
            lifecycleForm.resetFields();
            await loadOrganizations();
        } catch (err) {
            if (err instanceof ApiError) {
                message.error(err.message);
            }
        } finally {
            setLifecycleSubmitting(false);
        }
    };

    const handleSwitch = async (organizationCode: number) => {
        if (!accessToken || !enterpriseCode) return;
        setSwitchingCode(organizationCode);
        try {
            const handoff = await api.enterprise.switchOrganization(
                accessToken,
                organizationCode,
                enterpriseCode,
            );
            setStoredSelectedOrganizationCode(handoff.organizationCode);
            message.success(t("switch_success", { name: handoff.organizationName }));
            router.push(`/${locale}/dashboard`);
        } catch (err) {
            if (err instanceof ApiError && err.code === "ORGANIZATION_MEMBERSHIP_REQUIRED") {
                message.error(t("switch_membership_required"));
            } else if (err instanceof ApiError && err.code === "ORGANIZATION_SUSPENDED") {
                message.error(t("switch_suspended"));
            } else if (err instanceof ApiError) {
                message.error(err.message);
            }
        } finally {
            setSwitchingCode(null);
        }
    };

    return (
        <DashboardPage
            title={t("title")}
            subtitle={t("subtitle")}
            extra={
                canAdmin ? (
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
                        {t("create")}
                    </Button>
                ) : undefined
            }
            contentMode="table"
        >
            <Alert type="info" showIcon message={t("directory_note")} style={{ marginBottom: 16 }} />
            {!loading && items.length === 0 && canAdmin && (
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message={t("empty_admin_hint")}
                    action={
                        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
                            {t("create")}
                        </Button>
                    }
                />
            )}
            {!loading && items.length === 0 && !canAdmin && (
                <Alert type="warning" showIcon style={{ marginBottom: 16 }} message={t("empty_viewer_hint")} />
            )}
            <Table
                rowKey={(row) => String(row.organizationCode)}
                loading={loading}
                dataSource={items}
                columns={[
                    { title: t("col_name"), dataIndex: "name" },
                    { title: t("col_code"), dataIndex: "organizationCode" },
                    {
                        title: t("col_status"),
                        dataIndex: "status",
                        render: (status: string) => (
                            <Tag color={status === "ACTIVE" ? "green" : "orange"}>{status}</Tag>
                        ),
                    },
                    {
                        title: t("col_actions"),
                        key: "actions",
                        render: (_, row) => {
                            const isActive = row.status === "ACTIVE";
                            return (
                                <Space wrap>
                                    <Button
                                        type="link"
                                        disabled={!isActive}
                                        loading={switchingCode === row.organizationCode}
                                        onClick={() => handleSwitch(row.organizationCode)}
                                    >
                                        {t("switch")}
                                    </Button>
                                    {canAdmin && isActive && (
                                        <Button type="link" danger onClick={() => openLifecycle(row, "suspend")}>
                                            {t("suspend")}
                                        </Button>
                                    )}
                                    {canAdmin && !isActive && (
                                        <Button type="link" onClick={() => openLifecycle(row, "activate")}>
                                            {t("activate")}
                                        </Button>
                                    )}
                                </Space>
                            );
                        },
                    },
                ]}
            />

            <Modal
                title={t("create_title")}
                open={createOpen}
                onCancel={() => setCreateOpen(false)}
                onOk={handleCreate}
                confirmLoading={creating}
                destroyOnHidden
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label={t("field_name")}
                        rules={[{ required: true, message: t("field_name_required") }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="legalName" label={t("field_legal_name")}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="ownerEmail"
                        label={t("field_owner_email")}
                        extra={t("field_owner_email_extra")}
                        rules={[
                            {
                                validator: async (_, value) => {
                                    if (!value || !String(value).trim()) return;
                                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) {
                                        throw new Error(t("field_owner_email_invalid"));
                                    }
                                },
                            },
                        ]}
                    >
                        <Input placeholder="owner@example.com" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={
                    lifecycleTarget?.mode === "suspend"
                        ? t("suspend_title", { name: lifecycleTarget.name })
                        : t("activate_title", { name: lifecycleTarget?.name ?? "" })
                }
                open={lifecycleTarget != null}
                onCancel={() => {
                    setLifecycleTarget(null);
                    lifecycleForm.resetFields();
                }}
                onOk={handleLifecycle}
                confirmLoading={lifecycleSubmitting}
                okButtonProps={
                    lifecycleTarget?.mode === "suspend" ? { danger: true } : undefined
                }
                destroyOnHidden
            >
                <Form form={lifecycleForm} layout="vertical">
                    <Form.Item
                        name="reason"
                        label={t("field_reason")}
                        rules={
                            lifecycleTarget?.mode === "suspend"
                                ? [{ required: true, whitespace: true, message: t("field_reason_required") }]
                                : undefined
                        }
                    >
                        <Input.TextArea rows={3} placeholder={t("field_reason_placeholder")} />
                    </Form.Item>
                </Form>
            </Modal>
        </DashboardPage>
    );
}
