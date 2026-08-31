"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Checkbox,
    Descriptions,
    Form,
    Input,
    Modal,
    Select,
    Spin,
    Table,
    Tag,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import {
    api,
    ApiError,
    ORGANIZATION_PERMISSION_DOMAIN_ORDER,
    ORGANIZATION_PERMISSION_DOMAINS,
    ORGANIZATION_PERMISSIONS,
    type OrganizationMerchantView,
    type OrganizationPermission,
    type OrganizationPermissionDomain,
    type OrganizationRoleResponse,
} from "@/lib/api";
import { merchantCodeToString } from "@/components/layout/organization-merchant-shell";

type RoleEditorMode = "create" | "edit" | "view";

type RoleEditorFormValues = {
    code?: string;
    displayName: string;
    description?: string;
    permissions: OrganizationPermission[];
    merchantCodes: string[];
};

type PermissionDomainRow = {
    key: OrganizationPermissionDomain;
    label: string;
    options: Array<{ label: string; value: OrganizationPermission }>;
};

export type RoleEditorModalProps = {
    open: boolean;
    mode: RoleEditorMode;
    role: OrganizationRoleResponse | null;
    accessToken: string;
    organizationCode: string;
    onClose: () => void;
    onSaved: () => void;
};

function PermissionMatrix({
    value = [],
    onChange,
    domains,
    readOnly,
    selectAllLabel,
    tModule,
    tPermissions,
}: {
    value?: OrganizationPermission[];
    onChange?: (next: OrganizationPermission[]) => void;
    domains: PermissionDomainRow[];
    readOnly: boolean;
    selectAllLabel: string;
    tModule: string;
    tPermissions: string;
}) {
    const selected = new Set(value);

    const togglePermission = (permission: OrganizationPermission, checked: boolean) => {
        if (!onChange || readOnly) {
            return;
        }
        const next = new Set(selected);
        if (checked) {
            next.add(permission);
        } else {
            next.delete(permission);
        }
        onChange(Array.from(next));
    };

    const toggleDomain = (domain: PermissionDomainRow, checked: boolean) => {
        if (!onChange || readOnly) {
            return;
        }
        const next = new Set(selected);
        for (const option of domain.options) {
            if (checked) {
                next.add(option.value);
            } else {
                next.delete(option.value);
            }
        }
        onChange(Array.from(next));
    };

    const columns: ColumnsType<PermissionDomainRow> = [
        {
            title: tModule,
            dataIndex: "label",
            width: 120,
            render: (label: string) => <span style={{ fontWeight: 600 }}>{label}</span>,
        },
        {
            title: tPermissions,
            key: "permissions",
            render: (_, row) => (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
                    {row.options.map((option) => (
                        <Checkbox
                            key={option.value}
                            checked={selected.has(option.value)}
                            disabled={readOnly}
                            onChange={(e) => togglePermission(option.value, e.target.checked)}
                        >
                            {option.label}
                        </Checkbox>
                    ))}
                </div>
            ),
        },
        {
            title: selectAllLabel,
            key: "selectAll",
            width: 88,
            align: "center",
            render: (_, row) => {
                const checkedCount = row.options.filter((option) => selected.has(option.value)).length;
                const allChecked = checkedCount === row.options.length && row.options.length > 0;
                const indeterminate = checkedCount > 0 && !allChecked;
                return (
                    <Checkbox
                        checked={allChecked}
                        indeterminate={indeterminate}
                        disabled={readOnly}
                        onChange={(e) => toggleDomain(row, e.target.checked)}
                    />
                );
            },
        },
    ];

    return (
        <Table
            size="small"
            pagination={false}
            showHeader
            rowKey="key"
            dataSource={domains}
            columns={columns}
            bordered
        />
    );
}

export default function RoleEditorModal({
    open,
    mode,
    role,
    accessToken,
    organizationCode,
    onClose,
    onSaved,
}: RoleEditorModalProps) {
    const t = useTranslations("Organization");
    const [form] = Form.useForm<RoleEditorFormValues>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [merchants, setMerchants] = useState<OrganizationMerchantView[]>([]);
    const [orphanCount, setOrphanCount] = useState(0);
    const [scopeConfigurable, setScopeConfigurable] = useState(true);
    const permissionsWatch = Form.useWatch("permissions", form) as OrganizationPermission[] | undefined;

    const readOnly = mode === "view" || (mode === "edit" && role?.kind === "SYSTEM");
    const showScopeEditor = !readOnly && (mode === "create" || scopeConfigurable);

    const permissionDomains = useMemo<PermissionDomainRow[]>(
        () =>
            ORGANIZATION_PERMISSION_DOMAIN_ORDER.map((domain: OrganizationPermissionDomain) => ({
                key: domain,
                label: t(`roles.permission_domains.${domain}`),
                options: ORGANIZATION_PERMISSION_DOMAINS[domain].map((permission) => ({
                    label: t(`roles.permissions.${permission}`),
                    value: permission,
                })),
            })),
        [t],
    );

    const merchantOptions = useMemo(
        () =>
            merchants.map((merchant) => ({
                value: merchantCodeToString(merchant.merchantCode),
                label: `${merchant.name} (${merchantCodeToString(merchant.merchantCode)})`,
            })),
        [merchants],
    );

    const modalTitle =
        mode === "create"
            ? t("roles.create_title")
            : readOnly
              ? t("roles.view_title")
              : t("roles.edit_title");

    useEffect(() => {
        if (!open) {
            form.resetFields();
            setMerchants([]);
            setOrphanCount(0);
            setScopeConfigurable(true);
            return;
        }

        let cancelled = false;
        setLoading(true);

        const load = async () => {
            try {
                const merchantList = await api.organizations.listMerchants(accessToken);
                if (cancelled) return;
                setMerchants(merchantList);

                if (mode === "create") {
                    form.setFieldsValue({
                        permissions: [],
                        merchantCodes: [],
                    });
                    return;
                }

                if (!role) {
                    return;
                }

                form.setFieldsValue({
                    displayName: role.displayName,
                    description: role.description,
                    permissions: role.permissions.filter((p): p is OrganizationPermission =>
                        ORGANIZATION_PERMISSIONS.includes(p as OrganizationPermission),
                    ),
                    merchantCodes: [],
                });

                if (role.kind === "SYSTEM") {
                    return;
                }

                const scope = await api.organizations.getRoleScope(
                    accessToken,
                    organizationCode,
                    role.roleId,
                );
                if (cancelled) return;
                setScopeConfigurable(scope.configurable);
                setOrphanCount(scope.orphanCount);
                const selectedCodes =
                    scope.unrestricted || scope.resourceCodes.length === 0
                        ? []
                        : scope.resourceCodes.map((code) => merchantCodeToString(code));
                form.setFieldValue("merchantCodes", selectedCodes);
            } catch (err) {
                if (cancelled) return;
                message.error(err instanceof ApiError ? err.message : t("roles.load_failed"));
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [accessToken, form, mode, open, organizationCode, role, t]);

    const handleSubmit = async (values: RoleEditorFormValues) => {
        if (readOnly) {
            onClose();
            return;
        }

        setSaving(true);
        try {
            const resourceCodes = values.merchantCodes.map((code) => Number(code));

            if (mode === "create") {
                const created = await api.organizations.createRole(accessToken, organizationCode, {
                    code: values.code!.trim(),
                    displayName: values.displayName.trim(),
                    description: values.description?.trim() || undefined,
                    permissions: values.permissions,
                });
                await api.organizations.replaceRoleScope(accessToken, organizationCode, created.roleId, {
                    resourceType: "MERCHANT",
                    resourceCodes,
                });
                message.success(t("roles.create_success"));
            } else if (role) {
                await api.organizations.updateRole(accessToken, organizationCode, role.roleId, {
                    displayName: values.displayName.trim(),
                    description: values.description?.trim() || undefined,
                    permissions: values.permissions,
                });
                if (role.kind === "CUSTOM") {
                    await api.organizations.replaceRoleScope(accessToken, organizationCode, role.roleId, {
                        resourceType: "MERCHANT",
                        resourceCodes,
                    });
                }
                message.success(t("roles.edit_success"));
            }
            onSaved();
            onClose();
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("roles.save_failed"));
        } finally {
            setSaving(false);
        }
    };

    const selectedPermissions = permissionsWatch ?? [];

    return (
        <Modal
            title={modalTitle}
            open={open}
            onCancel={onClose}
            onOk={() => {
                if (readOnly) {
                    onClose();
                    return;
                }
                form.submit();
            }}
            okText={readOnly ? t("actions.close") : t("roles.save")}
            cancelText={t("actions.cancel")}
            cancelButtonProps={{ style: readOnly ? { display: "none" } : undefined }}
            confirmLoading={saving}
            destroyOnClose
            width={760}
        >
            <Spin spinning={loading}>
                {readOnly ? (
                    <>
                        <Alert
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                            message={t("roles.scope.system_readonly")}
                        />
                        <Descriptions
                            column={1}
                            size="middle"
                            labelStyle={{ width: 120, color: "#64748b" }}
                            contentStyle={{ color: "#0f172a" }}
                            style={{ marginBottom: 16 }}
                        >
                            <Descriptions.Item label={t("roles.columns.display_name")}>
                                {role?.displayName || "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("roles.description")}>
                                {role?.description?.trim() ? role.description : "—"}
                            </Descriptions.Item>
                            <Descriptions.Item label={t("roles.columns.kind")}>
                                <Tag color="default">{t("roles.kind.SYSTEM_BUILTIN")}</Tag>
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ marginBottom: 8, fontWeight: 600 }}>{t("roles.columns.permissions")}</div>
                        <PermissionMatrix
                            value={selectedPermissions}
                            domains={permissionDomains}
                            readOnly
                            selectAllLabel={t("roles.select_all")}
                            tModule={t("roles.module_column")}
                            tPermissions={t("roles.permission_points_column")}
                        />
                    </>
                ) : (
                    <>
                        {orphanCount > 0 && (
                            <Alert
                                type="warning"
                                showIcon
                                style={{ marginBottom: 16 }}
                                message={t("roles.scope.orphan_warning", { count: orphanCount })}
                            />
                        )}
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            {mode === "create" && (
                                <Form.Item
                                    name="code"
                                    label={t("roles.columns.code")}
                                    rules={[{ required: true, message: t("roles.code_required") }]}
                                >
                                    <Input placeholder="custom_role" />
                                </Form.Item>
                            )}
                            <Form.Item
                                name="displayName"
                                label={t("roles.columns.display_name")}
                                rules={[{ required: true, message: t("roles.display_name_required") }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label={t("roles.description")}>
                                <Input.TextArea rows={2} placeholder={t("roles.description_placeholder")} />
                            </Form.Item>
                            <Form.Item
                                name="permissions"
                                label={t("roles.permissions_config")}
                                rules={[{ required: true, message: t("roles.permissions_required") }]}
                            >
                                <PermissionMatrix
                                    domains={permissionDomains}
                                    readOnly={false}
                                    selectAllLabel={t("roles.select_all")}
                                    tModule={t("roles.module_column")}
                                    tPermissions={t("roles.permission_points_column")}
                                />
                            </Form.Item>
                            {showScopeEditor && (
                                <Form.Item
                                    name="merchantCodes"
                                    label={t("roles.scope.label")}
                                    extra={t("roles.scope.empty_means_all")}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        placeholder={t("roles.scope.placeholder")}
                                        options={merchantOptions}
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            )}
                        </Form>
                    </>
                )}
            </Spin>
        </Modal>
    );
}
