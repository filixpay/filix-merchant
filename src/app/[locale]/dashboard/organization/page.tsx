"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { InfoCircleOutlined, MoreOutlined } from "@ant-design/icons";
import { signIn, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Alert,
    Button,
    Card,
    Dropdown,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    api,
    ApiError,
    type OrganizationMemberRole,
    type OrganizationMemberView,
    type OrganizationMerchantView,
    type OrganizationRoleSummary,
    type OrganizationSummaryView,
    type OrganizationTeamMemberView,
    type OrganizationTeamView,
    type TeamHasLastOwnerData,
    type TeamRole,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import OrganizationRolesPanel from "@/components/organization/OrganizationRolesPanel";
import { useOrganizationCapabilities } from "@/components/layout/use-organization-capabilities";
import { useOrganizationMerchants } from "@/components/layout/use-organization-merchants";
import { organizationCodeToString } from "@/components/layout/organization-shell";
import { merchantCodeToString } from "@/components/layout/organization-merchant-shell";
import {
    organizationCanCreateMerchant,
    organizationCanCreateTeam,
    organizationCanChangeRole,
    organizationCanInvite,
    organizationCanRemoveMember,
    organizationCanViewMembers,
    organizationIsAdminOnly,
    SYSTEM_OWNER_ROLE_CODE,
} from "@/lib/organization/organization-permissions";

const TEAM_ROLES: TeamRole[] = ["OWNER", "MANAGER", "LEAD", "MEMBER"];

type InviteFormValues = {
    email: string;
    roleId: string;
    teamId?: string;
    teamRole?: TeamRole;
};

type CreateTeamFormValues = {
    name: string;
    description?: string;
    initialOwnerMembershipIds: string[];
};

type EditTeamFormValues = {
    name: string;
    description?: string;
};

type TeamExtras = {
    memberCount: number;
    ownerLabels: string[];
};

function resolveMemberLabel(member?: OrganizationMemberView): string {
    if (!member) {
        return "—";
    }
    return member.displayName || member.email || member.identityId;
}

function formatTeamHasLastOwnerMessage(
    err: ApiError,
    fallback: string,
    prefix: string,
): string {
    if (err.code !== "TEAM_HAS_LAST_OWNER") {
        return err.message || fallback;
    }
    const data = err.data as TeamHasLastOwnerData | undefined;
    const names = (data?.teams ?? []).map((t) => t.teamName).filter(Boolean);
    if (names.length === 0) {
        return prefix;
    }
    return `${prefix}: ${names.join(", ")}`;
}

type CreateMerchantFormValues = {
    name: string;
    settlementMode: "PLATFORM" | "DIRECT";
};

function formatDateTime(value?: string): string {
    return value ? new Date(value).toLocaleString() : "—";
}

function memberHasOwnerRole(roles: OrganizationMemberRole[]): boolean {
    return roles.some((role) => role.code === SYSTEM_OWNER_ROLE_CODE);
}

function OrganizationMembersPanel({
    accessToken,
    organization,
}: {
    accessToken: string;
    organization: OrganizationSummaryView;
}) {
    const t = useTranslations("Organization");
    const [members, setMembers] = useState<OrganizationMemberView[]>([]);
    const [roles, setRoles] = useState<OrganizationRoleSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviting, setInviting] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [changingId, setChangingId] = useState<string | null>(null);
    const [editRoleMember, setEditRoleMember] = useState<OrganizationMemberView | null>(null);
    const [editRoleId, setEditRoleId] = useState<string | undefined>(undefined);
    const [searchText, setSearchText] = useState("");
    const [teams, setTeams] = useState<OrganizationTeamView[]>([]);
    const [form] = Form.useForm<InviteFormValues>();

    const orgCode = organizationCodeToString(organization.code);
    const canInvite = organizationCanInvite(organization.roles);
    const canChangeRole = organizationCanChangeRole(organization.roles);
    const canRemove = organizationCanRemoveMember(organization.roles);
    const canView = organizationCanViewMembers(organization.roles);

    const invitableRoles = useMemo(
        () => roles.filter((role) => role.code !== SYSTEM_OWNER_ROLE_CODE),
        [roles],
    );

    const editableRoles = useMemo(
        () => roles.filter((role) => role.code !== SYSTEM_OWNER_ROLE_CODE),
        [roles],
    );

    const filteredMembers = useMemo(() => {
        const query = searchText.trim().toLowerCase();
        if (!query) {
            return members;
        }
        return members.filter((member) => {
            const email = (member.email || member.displayName || member.identityId || "").toLowerCase();
            const roleText = member.roles.map((role) => role.displayName).join(" ").toLowerCase();
            return email.includes(query) || roleText.includes(query);
        });
    }, [members, searchText]);

    const load = useCallback(async () => {
        if (!canView) {
            setMembers([]);
            setTeams([]);
            setRoles([]);
            return;
        }
        setLoading(true);
        try {
            const [memberData, teamData, roleData] = await Promise.all([
                api.organizations.listMembers(accessToken, orgCode),
                api.organizations.listTeams(accessToken, orgCode),
                api.organizations.listRoles(accessToken, orgCode),
            ]);
            setMembers(memberData);
            setTeams(teamData.filter((team) => team.status === "ACTIVE"));
            setRoles(roleData);
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("members.load_failed"));
        } finally {
            setLoading(false);
        }
    }, [accessToken, canView, orgCode, t]);

    useEffect(() => {
        void load();
    }, [load]);

    const handleInvite = async (values: InviteFormValues) => {
        setInviting(true);
        try {
            const body = {
                email: values.email,
                roleId: values.roleId,
                ...(values.teamId
                    ? { teamId: values.teamId, teamRole: values.teamRole ?? "MEMBER" }
                    : {}),
            };
            await api.organizations.invite(accessToken, orgCode, body);
            message.success(t("members.invite_success"));
            setInviteOpen(false);
            form.resetFields();
            await load();
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("members.invite_failed"));
        } finally {
            setInviting(false);
        }
    };

    const handleRemove = async (identityId: string) => {
        setRemovingId(identityId);
        try {
            await api.organizations.removeMember(accessToken, orgCode, identityId);
            message.success(t("members.remove_success"));
            await load();
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.code === "LAST_OWNER_REQUIRED") {
                    message.error(t("members.last_owner_required"));
                } else if (err.code === "TEAM_HAS_LAST_OWNER") {
                    message.error(
                        formatTeamHasLastOwnerMessage(
                            err,
                            t("members.remove_failed"),
                            t("members.team_has_last_owner"),
                        ),
                    );
                } else {
                    message.error(err.message);
                }
            } else {
                message.error(t("members.remove_failed"));
            }
        } finally {
            setRemovingId(null);
        }
    };

    const handleChangeRole = async (identityId: string, roleId: string) => {
        if (!accessToken || orgCode == null) return;
        setChangingId(identityId);
        try {
            await api.organizations.changeMemberRole(accessToken, orgCode, identityId, roleId);
            message.success(t("members.change_role_success"));
            setEditRoleMember(null);
            setEditRoleId(undefined);
            await load();
        } catch (err) {
            const code = err instanceof ApiError ? err.code : undefined;
            message.error(
                code === "LAST_OWNER_REQUIRED"
                    ? t("members.last_owner_required")
                    : err instanceof ApiError
                      ? err.message
                      : t("members.change_role_failed"),
            );
        } finally {
            setChangingId(null);
        }
    };

    const openEditRole = (member: OrganizationMemberView) => {
        setEditRoleMember(member);
        setEditRoleId(member.roles[0]?.roleId);
    };

    const memberStatusMeta = (status: string) => {
        const key = `members.status.${status}` as Parameters<typeof t>[0];
        const label = t.has(key) ? t(key) : status;
        if (status === "ACTIVE") {
            return { label, color: "success" as const };
        }
        if (status === "SUSPENDED") {
            return { label, color: "warning" as const };
        }
        if (status === "PENDING" || status === "INVITED") {
            return { label, color: "warning" as const };
        }
        if (status === "REMOVED") {
            return { label, color: "default" as const };
        }
        return { label, color: "default" as const };
    };

    const defaultInviteRoleId = invitableRoles.find((r) => r.code === "VIEWER")?.roleId
        ?? invitableRoles[0]?.roleId;

    const columns: ColumnsType<OrganizationMemberView> = [
        {
            title: t("members.columns.email"),
            dataIndex: "email",
            render: (value: string | undefined, record) => value || record.displayName || record.identityId,
        },
        {
            title: t("members.columns.roles"),
            dataIndex: "roles",
            render: (memberRoles: OrganizationMemberRole[]) => {
                const isOwner = memberHasOwnerRole(memberRoles);
                if (isOwner) {
                    return (
                        <Tag color="gold">
                            {t("members.owner_badge")} 👑
                        </Tag>
                    );
                }
                return memberRoles.map((role) => (
                    <Tag key={role.roleId}>{role.displayName}</Tag>
                ));
            },
        },
        {
            title: t("members.columns.status"),
            dataIndex: "status",
            render: (status: string) => {
                const meta = memberStatusMeta(status);
                return <Tag color={meta.color}>{meta.label}</Tag>;
            },
        },
        {
            title: t("members.columns.joined_at"),
            dataIndex: "joinedAt",
            render: (value?: string) => formatDateTime(value),
        },
        {
            title: t("members.columns.actions"),
            key: "actions",
            render: (_, record) => {
                const isOwner = memberHasOwnerRole(record.roles);
                if (isOwner) {
                    return (
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>
                            {t("members.system_builtin")}
                        </span>
                    );
                }

                return (
                    <Space size={4}>
                        {canChangeRole ? (
                            <Button type="link" onClick={() => openEditRole(record)}>
                                {t("members.edit_role")}
                            </Button>
                        ) : null}
                        {canRemove ? (
                            <Popconfirm
                                title={t("members.remove_confirm")}
                                onConfirm={() => void handleRemove(record.identityId)}
                            >
                                <Button
                                    type="link"
                                    danger
                                    loading={removingId === record.identityId}
                                >
                                    {t("members.remove")}
                                </Button>
                            </Popconfirm>
                        ) : null}
                    </Space>
                );
            },
        },
    ];

    if (!canView) {
        return <Alert type="warning" showIcon message={t("members.no_permission")} />;
    }

    return (
        <Card>
            <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }} wrap>
                <Space wrap>
                    {canInvite && (
                        <Button
                            type="primary"
                            onClick={() => {
                                form.setFieldsValue({ roleId: defaultInviteRoleId });
                                setInviteOpen(true);
                            }}
                        >
                            {t("members.invite")}
                        </Button>
                    )}
                    <Button onClick={() => void load()} loading={loading}>
                        {t("actions.refresh")}
                    </Button>
                </Space>
                <Input.Search
                    allowClear
                    placeholder={t("members.search_placeholder")}
                    style={{ width: 260 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Space>
            <Table
                rowKey="identityId"
                loading={loading}
                columns={columns}
                dataSource={filteredMembers}
                pagination={false}
            />

            <Modal
                title={t("members.edit_role_title")}
                open={!!editRoleMember}
                onCancel={() => {
                    setEditRoleMember(null);
                    setEditRoleId(undefined);
                }}
                onOk={() => {
                    if (!editRoleMember || !editRoleId) {
                        return;
                    }
                    void handleChangeRole(editRoleMember.identityId, editRoleId);
                }}
                okText={t("members.edit_role_confirm")}
                cancelText={t("actions.cancel")}
                confirmLoading={changingId === editRoleMember?.identityId}
                destroyOnClose
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <div style={{ color: "#64748b", fontSize: 13 }}>
                        {editRoleMember?.email || editRoleMember?.displayName || editRoleMember?.identityId}
                    </div>
                    <Select
                        style={{ width: "100%" }}
                        value={editRoleId}
                        onChange={setEditRoleId}
                        options={editableRoles.map((role) => ({
                            value: role.roleId,
                            label: role.displayName,
                        }))}
                    />
                </Space>
            </Modal>

            <Modal
                title={t("members.invite_title")}
                open={inviteOpen}
                onCancel={() => setInviteOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleInvite}>
                    <Form.Item
                        name="email"
                        label={t("members.email")}
                        rules={[
                            { required: true, message: t("members.email_required") },
                            { type: "email", message: t("members.email_invalid") },
                        ]}
                    >
                        <Input placeholder="user@example.com" />
                    </Form.Item>
                    <Form.Item
                        name="roleId"
                        label={t("members.org_role")}
                        initialValue={defaultInviteRoleId}
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={invitableRoles.map((role) => ({
                                value: role.roleId,
                                label: role.displayName,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="teamId"
                        label={
                            <Space size={4}>
                                <span>{t("members.optional_team")}</span>
                                <Tooltip title={t("members.optional_team_tooltip")}>
                                    <InfoCircleOutlined style={{ color: "#94a3b8" }} />
                                </Tooltip>
                            </Space>
                        }
                    >
                        <Select
                            allowClear
                            placeholder={t("members.optional_team_placeholder")}
                            options={teams.map((team) => ({
                                value: team.id,
                                label: team.name,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate={(prev, next) => prev.teamId !== next.teamId}>
                        {({ getFieldValue }) =>
                            getFieldValue("teamId") ? (
                                <Form.Item
                                    name="teamRole"
                                    label={t("members.team_role")}
                                    initialValue="MEMBER"
                                    rules={[{ required: true }]}
                                >
                                    <Select
                                        options={TEAM_ROLES.map((role) => ({
                                            value: role,
                                            label: t(`teams.roles.${role}`),
                                        }))}
                                    />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                    <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                        <Button onClick={() => setInviteOpen(false)}>{t("actions.cancel")}</Button>
                        <Button type="primary" htmlType="submit" loading={inviting}>
                            {t("members.send_invite")}
                        </Button>
                    </Space>
                </Form>
            </Modal>
        </Card>
    );
}

function OrganizationBusinessAccountsPanel({
    accessToken,
    organization,
}: {
    accessToken: string;
    organization: OrganizationSummaryView;
}) {
    const t = useTranslations("Organization");
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        merchants,
        merchantsLoading,
        reloadMerchants,
        selectMerchant,
        activeMerchant,
    } = useOrganizationMerchants(accessToken, organization);
    const [createOpen, setCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm<CreateMerchantFormValues>();

    const canCreate = organizationCanCreateMerchant(organization.roles);
    const activeCode = activeMerchant
        ? merchantCodeToString(activeMerchant.merchantCode)
        : null;

    useEffect(() => {
        if (searchParams.get("create") !== "1" || !canCreate) {
            return;
        }
        setCreateOpen(true);
        router.replace(`/${locale}/dashboard/organization`, { scroll: false });
    }, [searchParams, canCreate, locale, router]);

    const handleCreate = async (values: CreateMerchantFormValues) => {
        setCreating(true);
        try {
            const created = await api.organizations.createMerchant(accessToken, values);
            message.success(t("accounts.create_success"));
            setCreateOpen(false);
            form.resetFields();
            await reloadMerchants();
            selectMerchant(created);
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("accounts.create_failed"));
        } finally {
            setCreating(false);
        }
    };

    const handleSwitch = (merchant: OrganizationMerchantView) => {
        selectMerchant(merchant);
        message.success(t("accounts.switch_success"));
    };

    const handleOpenProfile = (merchant: OrganizationMerchantView) => {
        selectMerchant(merchant);
        router.push(`/${locale}/dashboard/maintenance/profile`);
    };

    const accountStatusMeta = (status: string) => {
        const key = `accounts.status.${status}` as Parameters<typeof t>[0];
        const label = t.has(key) ? t(key) : status;
        if (status === "ACTIVE") {
            return { label, color: "success" as const };
        }
        if (status === "PENDING" || status === "DRAFT") {
            return { label, color: "warning" as const };
        }
        if (status === "SUSPENDED" || status === "CLOSED") {
            return { label, color: "default" as const };
        }
        return { label, color: "default" as const };
    };

    const columns: ColumnsType<OrganizationMerchantView> = [
        {
            title: t("accounts.columns.name"),
            dataIndex: "name",
            render: (name: string, record) => {
                const isCurrent = merchantCodeToString(record.merchantCode) === activeCode;
                return (
                    <Space size={8} wrap>
                        <span>{name}</span>
                        {isCurrent ? <Tag color="success">{t("accounts.current_badge")}</Tag> : null}
                    </Space>
                );
            },
        },
        {
            title: t("accounts.columns.code"),
            dataIndex: "merchantCode",
            render: (code: number | string) => {
                const fullCode = merchantCodeToString(code);
                return (
                    <Typography.Text copyable={{ text: fullCode, tooltips: [t("accounts.copy"), t("accounts.copied")] }}>
                        {fullCode}
                    </Typography.Text>
                );
            },
        },
        {
            title: t("accounts.columns.mode"),
            dataIndex: "settlementMode",
            render: (mode: OrganizationMerchantView["settlementMode"]) =>
                mode === "PLATFORM" ? t("accounts.mode.platform") : t("accounts.mode.direct"),
        },
        {
            title: t("accounts.columns.status"),
            dataIndex: "status",
            render: (status: string) => {
                const meta = accountStatusMeta(status);
                return <Tag color={meta.color}>{meta.label}</Tag>;
            },
        },
        {
            title: t("accounts.columns.actions"),
            key: "actions",
            render: (_, record) => {
                const isCurrent = merchantCodeToString(record.merchantCode) === activeCode;
                if (isCurrent) {
                    return (
                        <Button type="link" onClick={() => handleOpenProfile(record)}>
                            {t("accounts.open_profile")}
                        </Button>
                    );
                }
                return (
                    <Space size={4}>
                        <Button type="link" onClick={() => handleSwitch(record)}>
                            {t("accounts.switch")}
                        </Button>
                        <Button type="link" onClick={() => handleOpenProfile(record)}>
                            {t("accounts.configure")}
                        </Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <Card>
            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message={t("accounts.hint")}
            />
            <Space style={{ marginBottom: 16 }}>
                {canCreate && (
                    <Button type="primary" onClick={() => setCreateOpen(true)}>
                        {t("accounts.create")}
                    </Button>
                )}
                <Button onClick={() => void reloadMerchants()} loading={merchantsLoading}>
                    {t("actions.refresh")}
                </Button>
            </Space>
            <Table
                rowKey={(record) => merchantCodeToString(record.merchantCode)}
                loading={merchantsLoading}
                columns={columns}
                dataSource={merchants}
                pagination={false}
            />
            <Modal
                title={t("accounts.create_title")}
                open={createOpen}
                onCancel={() => setCreateOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item
                        name="name"
                        label={t("accounts.name")}
                        rules={[{ required: true, message: t("accounts.name_required") }]}
                    >
                        <Input placeholder={t("accounts.name_placeholder")} />
                    </Form.Item>
                    <Form.Item
                        name="settlementMode"
                        label={
                            <Space size={4}>
                                <span>{t("accounts.settlement_mode")}</span>
                                <Tooltip title={t("accounts.settlement_mode_tooltip")}>
                                    <InfoCircleOutlined style={{ color: "#94a3b8" }} />
                                </Tooltip>
                            </Space>
                        }
                        rules={[{ required: true, message: t("accounts.settlement_mode_required") }]}
                    >
                        <Select
                            placeholder={t("accounts.settlement_mode_placeholder")}
                            options={[
                                {
                                    value: "DIRECT",
                                    label: t("accounts.mode.direct"),
                                },
                                {
                                    value: "PLATFORM",
                                    label: t("accounts.mode.platform"),
                                },
                            ]}
                        />
                    </Form.Item>
                    <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                        <Button onClick={() => setCreateOpen(false)}>{t("actions.cancel")}</Button>
                        <Button type="primary" htmlType="submit" loading={creating}>
                            {t("accounts.submit_create")}
                        </Button>
                    </Space>
                </Form>
            </Modal>
        </Card>
    );
}

function OrganizationTeamsPanel({
    accessToken,
    organization,
}: {
    accessToken: string;
    organization: OrganizationSummaryView;
}) {
    const t = useTranslations("Organization");
    const [teams, setTeams] = useState<OrganizationTeamView[]>([]);
    const [members, setMembers] = useState<OrganizationMemberView[]>([]);
    const [teamExtras, setTeamExtras] = useState<Record<string, TeamExtras>>({});
    const [loading, setLoading] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [archivingId, setArchivingId] = useState<string | null>(null);
    const [editTeam, setEditTeam] = useState<OrganizationTeamView | null>(null);
    const [editing, setEditing] = useState(false);
    const [manageTeam, setManageTeam] = useState<OrganizationTeamView | null>(null);
    const [teamMembers, setTeamMembers] = useState<OrganizationTeamMemberView[]>([]);
    const [teamMembersLoading, setTeamMembersLoading] = useState(false);
    const [addingMember, setAddingMember] = useState(false);
    const [removingMembershipId, setRemovingMembershipId] = useState<string | null>(null);
    const [form] = Form.useForm<CreateTeamFormValues>();
    const [editForm] = Form.useForm<EditTeamFormValues>();
    const [addMemberForm] = Form.useForm<{ membershipId: string; teamRole: TeamRole }>();

    const orgCode = organizationCodeToString(organization.code);
    const canView = organizationCanViewMembers(organization.roles);
    const canCreate = organizationCanCreateTeam(organization.roles);
    const adminReadOnly = organizationIsAdminOnly(organization.roles);

    const memberByMembershipId = useMemo(() => {
        const map = new Map<string, OrganizationMemberView>();
        for (const member of members) {
            if (member.membershipId) {
                map.set(member.membershipId, member);
            }
        }
        return map;
    }, [members]);

    const loadTeamExtras = useCallback(
        async (teamList: OrganizationTeamView[], orgMembers: OrganizationMemberView[]) => {
            const memberMap = new Map<string, OrganizationMemberView>();
            for (const member of orgMembers) {
                if (member.membershipId) {
                    memberMap.set(member.membershipId, member);
                }
            }
            const entries = await Promise.all(
                teamList.map(async (team) => {
                    try {
                        const list = await api.organizations.listTeamMembers(
                            accessToken,
                            orgCode,
                            team.id,
                        );
                        const ownerLabels = list
                            .filter((item) => item.teamRole === "OWNER")
                            .map((item) => resolveMemberLabel(memberMap.get(item.membershipId)));
                        return [
                            team.id,
                            {
                                memberCount: list.length,
                                ownerLabels: ownerLabels.length > 0 ? ownerLabels : ["—"],
                            } satisfies TeamExtras,
                        ] as const;
                    } catch {
                        return [
                            team.id,
                            { memberCount: 0, ownerLabels: ["—"] } satisfies TeamExtras,
                        ] as const;
                    }
                }),
            );
            setTeamExtras(Object.fromEntries(entries));
        },
        [accessToken, orgCode],
    );

    const load = useCallback(async () => {
        if (!canView) {
            setTeams([]);
            setTeamExtras({});
            return;
        }
        setLoading(true);
        try {
            const [teamData, memberData] = await Promise.all([
                api.organizations.listTeams(accessToken, orgCode),
                api.organizations.listMembers(accessToken, orgCode),
            ]);
            const activeMembers = memberData.filter((m) => m.status === "ACTIVE");
            setTeams(teamData);
            setMembers(activeMembers);
            void loadTeamExtras(teamData, activeMembers);
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("teams.load_failed"));
        } finally {
            setLoading(false);
        }
    }, [accessToken, canView, loadTeamExtras, orgCode, t]);

    useEffect(() => {
        void load();
    }, [load]);

    const loadManageMembers = useCallback(
        async (team: OrganizationTeamView) => {
            setTeamMembersLoading(true);
            try {
                const list = await api.organizations.listTeamMembers(accessToken, orgCode, team.id);
                setTeamMembers(list);
            } catch (err) {
                message.error(err instanceof ApiError ? err.message : t("teams.members_load_failed"));
                setTeamMembers([]);
            } finally {
                setTeamMembersLoading(false);
            }
        },
        [accessToken, orgCode, t],
    );

    const openManage = (team: OrganizationTeamView) => {
        setManageTeam(team);
        addMemberForm.resetFields();
        void loadManageMembers(team);
    };

    const openEdit = (team: OrganizationTeamView) => {
        setEditTeam(team);
        editForm.setFieldsValue({
            name: team.name,
            description: team.description,
        });
    };

    const handleCreate = async (values: CreateTeamFormValues) => {
        setCreating(true);
        try {
            if (!values.initialOwnerMembershipIds?.length) {
                message.error(t("teams.initial_owner_required"));
                return;
            }
            await api.organizations.createTeam(accessToken, orgCode, {
                name: values.name,
                description: values.description,
                initialOwnerMembershipIds: values.initialOwnerMembershipIds,
            });
            message.success(t("teams.create_success"));
            setCreateOpen(false);
            form.resetFields();
            await load();
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("teams.create_failed"));
        } finally {
            setCreating(false);
        }
    };

    const handleEdit = async (values: EditTeamFormValues) => {
        if (!editTeam) {
            return;
        }
        setEditing(true);
        try {
            await api.organizations.updateTeam(accessToken, orgCode, editTeam.id, {
                name: values.name.trim(),
                description: values.description?.trim() || undefined,
            });
            message.success(t("teams.edit_success"));
            setEditTeam(null);
            await load();
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("teams.edit_failed"));
        } finally {
            setEditing(false);
        }
    };

    const handleArchive = async (teamId: string) => {
        setArchivingId(teamId);
        try {
            await api.organizations.archiveTeam(accessToken, orgCode, teamId);
            message.success(t("teams.archive_success"));
            await load();
        } catch (err) {
            message.error(
                err instanceof ApiError
                    ? err.code === "TEAM_GOVERNANCE_DENIED"
                        ? t("teams.governance_denied")
                        : err.message
                    : t("teams.archive_failed"),
            );
        } finally {
            setArchivingId(null);
        }
    };

    const handleAddTeamMember = async (values: { membershipId: string; teamRole: TeamRole }) => {
        if (!manageTeam) {
            return;
        }
        setAddingMember(true);
        try {
            await api.organizations.addTeamMember(
                accessToken,
                orgCode,
                manageTeam.id,
                values.membershipId,
                values.teamRole,
            );
            message.success(t("teams.add_member_success"));
            addMemberForm.resetFields();
            await loadManageMembers(manageTeam);
            await load();
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("teams.add_member_failed"));
        } finally {
            setAddingMember(false);
        }
    };

    const handleRemoveTeamMember = async (membershipId: string) => {
        if (!manageTeam) {
            return;
        }
        setRemovingMembershipId(membershipId);
        try {
            await api.organizations.removeTeamMember(
                accessToken,
                orgCode,
                manageTeam.id,
                membershipId,
            );
            message.success(t("teams.remove_member_success"));
            await loadManageMembers(manageTeam);
            await load();
        } catch (err) {
            if (err instanceof ApiError && err.code === "TEAM_HAS_LAST_OWNER") {
                message.error(
                    formatTeamHasLastOwnerMessage(
                        err,
                        t("teams.remove_member_failed"),
                        t("members.team_has_last_owner"),
                    ),
                );
            } else {
                message.error(
                    err instanceof ApiError ? err.message : t("teams.remove_member_failed"),
                );
            }
        } finally {
            setRemovingMembershipId(null);
        }
    };

    const teamStatusMeta = (status: string) => {
        if (status === "ACTIVE") {
            return { label: t("teams.status.ACTIVE"), color: "success" as const };
        }
        if (status === "ARCHIVED") {
            return { label: t("teams.status.ARCHIVED"), color: "default" as const };
        }
        return { label: status, color: "default" as const };
    };

    const addableMembers = useMemo(() => {
        const inTeam = new Set(teamMembers.map((item) => item.membershipId));
        return members.filter(
            (member) => member.membershipId && !inTeam.has(member.membershipId),
        );
    }, [members, teamMembers]);

    const columns: ColumnsType<OrganizationTeamView> = [
        {
            title: t("teams.columns.name"),
            dataIndex: "name",
            render: (name: string, record) =>
                record.status === "ACTIVE" ? (
                    <Button type="link" style={{ paddingInline: 0 }} onClick={() => openManage(record)}>
                        {name}
                    </Button>
                ) : (
                    name
                ),
        },
        {
            title: t("teams.columns.owners"),
            key: "owners",
            render: (_, record) => {
                const owners = teamExtras[record.id]?.ownerLabels ?? ["—"];
                return owners.join("、");
            },
        },
        {
            title: t("teams.columns.member_count"),
            key: "memberCount",
            width: 110,
            render: (_, record) => {
                const count = teamExtras[record.id]?.memberCount;
                return count == null ? "—" : t("teams.member_count_value", { count });
            },
        },
        {
            title: t("teams.columns.status"),
            dataIndex: "status",
            width: 110,
            render: (status: string) => {
                const meta = teamStatusMeta(status);
                return <Tag color={meta.color}>{meta.label}</Tag>;
            },
        },
        {
            title: t("teams.columns.description"),
            dataIndex: "description",
            render: (value?: string) => value || "—",
        },
        {
            title: t("teams.columns.actions"),
            key: "actions",
            width: 220,
            render: (_, record) => {
                if (adminReadOnly) {
                    return <Tag>{t("teams.admin_readonly")}</Tag>;
                }
                if (record.status !== "ACTIVE") {
                    return null;
                }
                return (
                    <Space size={4}>
                        <Button type="link" onClick={() => openManage(record)}>
                            {t("teams.manage_members")}
                        </Button>
                        <Button type="link" onClick={() => openEdit(record)}>
                            {t("teams.edit")}
                        </Button>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: "archive",
                                        danger: true,
                                        label: t("teams.archive"),
                                        disabled: archivingId === record.id,
                                        onClick: () => {
                                            Modal.confirm({
                                                title: t("teams.archive_confirm"),
                                                okText: t("teams.archive"),
                                                okButtonProps: { danger: true },
                                                cancelText: t("actions.cancel"),
                                                onOk: () => handleArchive(record.id),
                                            });
                                        },
                                    },
                                ],
                            }}
                        >
                            <Button type="link" icon={<MoreOutlined />}>
                                {t("teams.more")}
                            </Button>
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];

    if (!canView) {
        return <Alert type="warning" showIcon message={t("teams.no_permission")} />;
    }

    return (
        <Card>
            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
                message={t("teams.role_hint")}
            />
            <Space style={{ marginBottom: 16 }}>
                {canCreate && (
                    <Button type="primary" onClick={() => setCreateOpen(true)}>
                        {t("teams.create")}
                    </Button>
                )}
                <Button onClick={() => void load()} loading={loading}>
                    {t("actions.refresh")}
                </Button>
            </Space>
            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={teams}
                pagination={false}
            />

            <Modal
                title={t("teams.create_title")}
                open={createOpen}
                onCancel={() => setCreateOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item
                        name="name"
                        label={t("teams.name")}
                        rules={[{ required: true, message: t("teams.name_required") }]}
                    >
                        <Input placeholder={t("teams.name_placeholder")} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={t("teams.description")}
                        rules={[{ max: 200, message: t("teams.description_max") }]}
                    >
                        <Input.TextArea
                            rows={3}
                            maxLength={200}
                            showCount
                            placeholder={t("teams.description_placeholder")}
                        />
                    </Form.Item>
                    <Form.Item
                        name="initialOwnerMembershipIds"
                        label={
                            <Space size={4}>
                                <span>{t("teams.initial_owners")}</span>
                                <Tooltip title={t("teams.initial_owners_hint")}>
                                    <InfoCircleOutlined style={{ color: "#94a3b8" }} />
                                </Tooltip>
                            </Space>
                        }
                        rules={[{ required: true, message: t("teams.initial_owner_required") }]}
                    >
                        <Select
                            mode="multiple"
                            showSearch
                            optionFilterProp="label"
                            placeholder={t("teams.initial_owners_placeholder")}
                            options={members
                                .filter((m) => !!m.membershipId)
                                .map((m) => ({
                                    value: m.membershipId as string,
                                    label: m.email || m.displayName || m.identityId,
                                }))}
                        />
                    </Form.Item>
                    <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                        <Button onClick={() => setCreateOpen(false)}>{t("actions.cancel")}</Button>
                        <Button type="primary" htmlType="submit" loading={creating}>
                            {t("teams.submit_create")}
                        </Button>
                    </Space>
                </Form>
            </Modal>

            <Modal
                title={t("teams.edit_title")}
                open={!!editTeam}
                onCancel={() => setEditTeam(null)}
                onOk={() => editForm.submit()}
                confirmLoading={editing}
                okText={t("teams.save")}
                cancelText={t("actions.cancel")}
                destroyOnClose
            >
                <Form form={editForm} layout="vertical" onFinish={handleEdit}>
                    <Form.Item
                        name="name"
                        label={t("teams.name")}
                        rules={[{ required: true, message: t("teams.name_required") }]}
                    >
                        <Input placeholder={t("teams.name_placeholder")} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={t("teams.description")}
                        rules={[{ max: 200, message: t("teams.description_max") }]}
                    >
                        <Input.TextArea
                            rows={3}
                            maxLength={200}
                            showCount
                            placeholder={t("teams.description_placeholder")}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={
                    manageTeam
                        ? t("teams.manage_members_title", { name: manageTeam.name })
                        : t("teams.manage_members")
                }
                open={!!manageTeam}
                onCancel={() => {
                    setManageTeam(null);
                    setTeamMembers([]);
                }}
                footer={null}
                width={720}
                destroyOnClose
            >
                {!adminReadOnly ? (
                    <Form
                        form={addMemberForm}
                        layout="inline"
                        style={{ marginBottom: 16, rowGap: 12 }}
                        onFinish={handleAddTeamMember}
                        initialValues={{ teamRole: "MEMBER" }}
                    >
                        <Form.Item
                            name="membershipId"
                            rules={[{ required: true, message: t("teams.add_member_required") }]}
                        >
                            <Select
                                showSearch
                                optionFilterProp="label"
                                style={{ minWidth: 240 }}
                                placeholder={t("teams.add_member_placeholder")}
                                options={addableMembers.map((member) => ({
                                    value: member.membershipId as string,
                                    label: member.email || member.displayName || member.identityId,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item name="teamRole" rules={[{ required: true }]}>
                            <Select
                                style={{ minWidth: 140 }}
                                options={TEAM_ROLES.map((role) => ({
                                    value: role,
                                    label: t(`teams.roles.${role}`),
                                }))}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={addingMember}>
                                {t("teams.add_member")}
                            </Button>
                        </Form.Item>
                    </Form>
                ) : null}

                <Table
                    rowKey="membershipId"
                    loading={teamMembersLoading}
                    dataSource={teamMembers}
                    pagination={false}
                    columns={[
                        {
                            title: t("teams.columns.member"),
                            dataIndex: "membershipId",
                            render: (membershipId: string) =>
                                resolveMemberLabel(memberByMembershipId.get(membershipId)),
                        },
                        {
                            title: t("teams.columns.team_role"),
                            dataIndex: "teamRole",
                            render: (role: TeamRole) => t(`teams.roles.${role}`),
                        },
                        {
                            title: t("teams.columns.joined_at"),
                            dataIndex: "joinedAt",
                            render: (value?: string) => formatDateTime(value),
                        },
                        {
                            title: t("teams.columns.actions"),
                            key: "actions",
                            render: (_, record) =>
                                adminReadOnly ? null : (
                                    <Popconfirm
                                        title={t("teams.remove_member_confirm")}
                                        onConfirm={() => void handleRemoveTeamMember(record.membershipId)}
                                    >
                                        <Button
                                            type="link"
                                            danger
                                            loading={removingMembershipId === record.membershipId}
                                        >
                                            {t("teams.remove_member")}
                                        </Button>
                                    </Popconfirm>
                                ),
                        },
                    ]}
                />
            </Modal>
        </Card>
    );
}

export default function OrganizationPage() {
    return (
        <Suspense fallback={null}>
            <OrganizationPageContent />
        </Suspense>
    );
}

function OrganizationPageContent() {
    const t = useTranslations("Organization");
    const { data: session, status } = useSession();
    const accessToken = session?.accessToken;
    const { activeOrganization, organizationsLoading } = useOrganizationCapabilities(accessToken);

    const subtitle = useMemo(() => {
        if (!activeOrganization) {
            return undefined;
        }
        return `${activeOrganization.name} · ${organizationCodeToString(activeOrganization.code)}`;
    }, [activeOrganization]);

    useEffect(() => {
        if (status === "unauthenticated") {
            signIn();
        }
    }, [status]);

    if (!accessToken || organizationsLoading) {
        return (
            <DashboardPage title={t("title")}>
                <Card loading />
            </DashboardPage>
        );
    }

    if (!activeOrganization) {
        return (
            <DashboardPage title={t("title")}>
                <Alert type="warning" showIcon message={t("no_active_org")} />
            </DashboardPage>
        );
    }

    return (
        <DashboardPage title={t("title")} subtitle={subtitle}>
            <Tabs
                defaultActiveKey="accounts"
                items={[
                    {
                        key: "accounts",
                        label: t("tabs.business_accounts"),
                        children: (
                            <OrganizationBusinessAccountsPanel
                                accessToken={accessToken}
                                organization={activeOrganization}
                            />
                        ),
                    },
                    {
                        key: "members",
                        label: t("tabs.members"),
                        children: (
                            <OrganizationMembersPanel
                                accessToken={accessToken}
                                organization={activeOrganization}
                            />
                        ),
                    },
                    {
                        key: "teams",
                        label: t("tabs.teams"),
                        children: (
                            <OrganizationTeamsPanel
                                accessToken={accessToken}
                                organization={activeOrganization}
                            />
                        ),
                    },
                    {
                        key: "roles",
                        label: t("tabs.roles"),
                        children: (
                            <OrganizationRolesPanel
                                accessToken={accessToken}
                                organization={activeOrganization}
                            />
                        ),
                    },
                ]}
            />
        </DashboardPage>
    );
}
