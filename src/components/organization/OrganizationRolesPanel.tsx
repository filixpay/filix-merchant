"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Popconfirm, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import {
    api,
    ApiError,
    type OrganizationRoleResponse,
    type OrganizationSummaryView,
} from "@/lib/api";
import { organizationCodeToString } from "@/components/layout/organization-shell";
import RoleEditorModal from "./RoleEditorModal";

function sortRoles(roles: OrganizationRoleResponse[]): OrganizationRoleResponse[] {
    return [...roles].sort((a, b) => {
        if (a.kind !== b.kind) {
            return a.kind === "SYSTEM" ? -1 : 1;
        }
        const byPermissionCount = b.permissions.length - a.permissions.length;
        if (byPermissionCount !== 0) {
            return byPermissionCount;
        }
        const byName = a.displayName.localeCompare(b.displayName, undefined, { sensitivity: "base" });
        if (byName !== 0) {
            return byName;
        }
        return a.code.localeCompare(b.code);
    });
}

function summarizePermissions(
    permissions: OrganizationRoleResponse["permissions"],
    t: (key: string, values?: Record<string, string | number>) => string,
): string {
    if (permissions.length === 0) {
        return t("roles.no_permissions");
    }
    if (permissions.length <= 3) {
        return permissions.map((permission) => t(`roles.permissions.${permission}`)).join(", ");
    }
    return t("roles.permissions_summary", { count: permissions.length });
}

export default function OrganizationRolesPanel({
    accessToken,
    organization,
}: {
    accessToken: string;
    organization: OrganizationSummaryView;
}) {
    const t = useTranslations("Organization");
    const orgCode = organizationCodeToString(organization.code);
    const [roles, setRoles] = useState<OrganizationRoleResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [noPermission, setNoPermission] = useState(false);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorMode, setEditorMode] = useState<"create" | "edit" | "view">("create");
    const [editingRole, setEditingRole] = useState<OrganizationRoleResponse | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setNoPermission(false);
        try {
            const data = await api.organizations.listRoles(accessToken, orgCode);
            setRoles(sortRoles(data));
        } catch (err) {
            if (err instanceof ApiError && err.status === 403) {
                setRoles([]);
                setNoPermission(true);
                return;
            }
            message.error(err instanceof ApiError ? err.message : t("roles.load_failed"));
        } finally {
            setLoading(false);
        }
    }, [accessToken, orgCode, t]);

    useEffect(() => {
        void load();
    }, [load]);

    const openCreate = () => {
        setEditorMode("create");
        setEditingRole(null);
        setEditorOpen(true);
    };

    const openView = (role: OrganizationRoleResponse) => {
        setEditorMode("view");
        setEditingRole(role);
        setEditorOpen(true);
    };

    const openEdit = (role: OrganizationRoleResponse) => {
        setEditorMode("edit");
        setEditingRole(role);
        setEditorOpen(true);
    };

    const handleDelete = async (role: OrganizationRoleResponse) => {
        setDeletingId(role.roleId);
        try {
            await api.organizations.deleteRole(accessToken, orgCode, role.roleId);
            message.success(t("roles.delete_success"));
            await load();
        } catch (err) {
            if (err instanceof ApiError && err.code === "ROLE_IN_USE") {
                message.error(t("roles.role_in_use"));
            } else {
                message.error(err instanceof ApiError ? err.message : t("roles.delete_failed"));
            }
        } finally {
            setDeletingId(null);
        }
    };

    const columns: ColumnsType<OrganizationRoleResponse> = useMemo(
        () => [
            {
                title: t("roles.columns.code"),
                dataIndex: "code",
            },
            {
                title: t("roles.columns.display_name"),
                dataIndex: "displayName",
            },
            {
                title: t("roles.columns.kind"),
                dataIndex: "kind",
                render: (kind: OrganizationRoleResponse["kind"]) =>
                    kind === "SYSTEM" ? (
                        <Tag color="default">{t("roles.kind.SYSTEM_BUILTIN")}</Tag>
                    ) : (
                        <Tag color="processing">{t("roles.kind.CUSTOM")}</Tag>
                    ),
            },
            {
                title: t("roles.columns.permissions"),
                dataIndex: "permissions",
                render: (permissions: OrganizationRoleResponse["permissions"]) =>
                    summarizePermissions(permissions, t),
            },
            {
                title: t("roles.columns.actions"),
                key: "actions",
                render: (_, record) =>
                    record.kind === "SYSTEM" ? (
                        <Button type="link" onClick={() => openView(record)}>
                            {t("roles.view")}
                        </Button>
                    ) : (
                        <Space size={4}>
                            <Button type="link" onClick={() => openEdit(record)}>
                                {t("roles.edit")}
                            </Button>
                            <Popconfirm
                                title={t("roles.delete_confirm")}
                                onConfirm={() => void handleDelete(record)}
                            >
                                <Button type="link" danger loading={deletingId === record.roleId}>
                                    {t("roles.delete")}
                                </Button>
                            </Popconfirm>
                        </Space>
                    ),
            },
        ],
        [deletingId, t],
    );

    if (noPermission) {
        return <Alert type="warning" showIcon message={t("roles.no_permission")} />;
    }

    return (
        <Card>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={openCreate}>
                    {t("roles.create")}
                </Button>
                <Button onClick={() => void load()} loading={loading}>
                    {t("actions.refresh")}
                </Button>
            </Space>
            <Table
                rowKey="roleId"
                loading={loading}
                columns={columns}
                dataSource={roles}
                pagination={false}
            />
            <RoleEditorModal
                open={editorOpen}
                mode={editorMode}
                role={editingRole}
                accessToken={accessToken}
                organizationCode={orgCode}
                onClose={() => setEditorOpen(false)}
                onSaved={() => void load()}
            />
        </Card>
    );
}
