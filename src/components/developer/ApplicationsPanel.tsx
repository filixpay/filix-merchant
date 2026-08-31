"use client";

import { useCallback, useEffect, useState } from "react";
import {
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
    Typography,
    message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    AppstoreOutlined,
    KeyOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import {
    archiveApplication,
    createApplication,
    createSandboxCredential,
    listApplicationCredentials,
    listApplications,
    rotateApplicationCredential,
    revokeApplicationCredential,
    type ApiApplicationView,
    type ApiCredentialView,
    type IssuedCredentialView,
} from "@/lib/developer/applications-api";
import IssuedCredentialModal from "./IssuedCredentialModal";
import { filterCredentialsByEnvironment } from "./production-access-model";

const statusTagStyle: React.CSSProperties = {
    color: "#047857",
    background: "#ecfdf5",
    borderColor: "#a7f3d0",
    marginInlineEnd: 0,
};

const nestedPanelStyle: React.CSSProperties = {
    marginLeft: 4,
    padding: "14px 16px",
    borderLeft: "3px solid #2563eb",
    background: "#f8fafc",
    borderRadius: "0 8px 8px 0",
    boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
};

interface ApplicationsPanelProps {
    accessToken: string;
    onStartVerification?: (credentials: {
        clientId: string;
        clientSecret: string;
    }) => void | Promise<void>;
}

export default function ApplicationsPanel({
    accessToken,
    onStartVerification,
}: ApplicationsPanelProps) {
    const t = useTranslations("Developer.applications");
    const tCommon = useTranslations("Common");

    const [apps, setApps] = useState<ApiApplicationView[]>([]);
    const [loading, setLoading] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form] = Form.useForm<{ applicationCode: string; name: string; description?: string }>();

    const [expandedCode, setExpandedCode] = useState<string | null>(null);
    const [credentials, setCredentials] = useState<ApiCredentialView[]>([]);
    const [credentialsLoading, setCredentialsLoading] = useState(false);
    const [credentialBusy, setCredentialBusy] = useState(false);

    const [issued, setIssued] = useState<IssuedCredentialView | null>(null);
    const [secretOpen, setSecretOpen] = useState(false);

    const loadApps = useCallback(async () => {
        setLoading(true);
        try {
            setApps(await listApplications(accessToken));
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("load_failed"));
        } finally {
            setLoading(false);
        }
    }, [accessToken, t]);

    const loadCredentials = useCallback(
        async (applicationCode: string) => {
            setCredentialsLoading(true);
            try {
                setCredentials(await listApplicationCredentials(accessToken, applicationCode));
            } catch (err) {
                console.error(err);
                message.error(err instanceof Error ? err.message : t("credentials_load_failed"));
                setCredentials([]);
            } finally {
                setCredentialsLoading(false);
            }
        },
        [accessToken, t],
    );

    useEffect(() => {
        void loadApps();
    }, [loadApps]);

    const handleCreate = async () => {
        const values = await form.validateFields();
        setCreating(true);
        try {
            await createApplication(accessToken, values);
            message.success(t("create_success"));
            setCreateOpen(false);
            form.resetFields();
            await loadApps();
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("create_failed"));
        } finally {
            setCreating(false);
        }
    };

    const handleArchive = async (applicationCode: string) => {
        try {
            await archiveApplication(accessToken, applicationCode);
            message.success(t("archive_success"));
            if (expandedCode === applicationCode) {
                setExpandedCode(null);
                setCredentials([]);
            }
            await loadApps();
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("archive_failed"));
        }
    };

    const showIssuedSecret = (data: IssuedCredentialView) => {
        setIssued(data);
        setSecretOpen(true);
    };

    const handleCreateSandbox = async (applicationCode: string) => {
        setCredentialBusy(true);
        try {
            const data = await createSandboxCredential(accessToken, applicationCode);
            showIssuedSecret(data);
            await loadCredentials(applicationCode);
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("credential_create_failed"));
        } finally {
            setCredentialBusy(false);
        }
    };

    const handleRotate = async (applicationCode: string, credentialId: string) => {
        setCredentialBusy(true);
        try {
            const data = await rotateApplicationCredential(
                accessToken,
                applicationCode,
                credentialId,
            );
            showIssuedSecret(data);
            await loadCredentials(applicationCode);
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("rotate_failed"));
        } finally {
            setCredentialBusy(false);
        }
    };

    const handleRevoke = async (applicationCode: string, credentialId: string) => {
        setCredentialBusy(true);
        try {
            await revokeApplicationCredential(accessToken, applicationCode, credentialId);
            message.success(t("revoke_success"));
            await loadCredentials(applicationCode);
        } catch (err) {
            console.error(err);
            message.error(err instanceof Error ? err.message : t("revoke_failed"));
        } finally {
            setCredentialBusy(false);
        }
    };

    const statusTag = (status?: string) => {
        const value = (status || "ACTIVE").toUpperCase();
        if (value === "ARCHIVED" || value === "REVOKED") {
            return <Tag>{value}</Tag>;
        }
        return (
            <Tag style={statusTagStyle} bordered>
                {value}
            </Tag>
        );
    };

    const appColumns: ColumnsType<ApiApplicationView> = [
        {
            title: t("col_code"),
            dataIndex: "applicationCode",
            key: "applicationCode",
            render: (code: string) => (
                <Typography.Text
                    copyable={{ text: code, tooltips: false }}
                    style={{ fontFamily: "var(--font-mono)", letterSpacing: 0.2 }}
                >
                    {code}
                </Typography.Text>
            ),
        },
        {
            title: t("col_name"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("col_status"),
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: string) => statusTag(status),
        },
        {
            title: t("col_actions"),
            key: "actions",
            width: 120,
            render: (_, row) => {
                const archived = (row.status || "").toUpperCase() === "ARCHIVED";
                if (archived) return null;
                return (
                    <Popconfirm
                        title={t("archive_confirm")}
                        onConfirm={() => void handleArchive(row.applicationCode)}
                    >
                        <Button type="text" size="small" danger>
                            {t("archive")}
                        </Button>
                    </Popconfirm>
                );
            },
        },
    ];

    const credentialColumns: ColumnsType<ApiCredentialView> = [
        {
            title: t("col_environment"),
            dataIndex: "environment",
            key: "environment",
            width: 100,
        },
        {
            title: t("col_client_id"),
            dataIndex: "clientId",
            key: "clientId",
            ellipsis: true,
            render: (id: string) => (
                <Typography.Text
                    copyable={{ text: id, tooltips: false }}
                    ellipsis={{ tooltip: id }}
                    style={{
                        fontFamily: "var(--font-mono)",
                        maxWidth: "100%",
                        display: "inline-block",
                    }}
                >
                    {id}
                </Typography.Text>
            ),
        },
        {
            title: t("col_status"),
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (status: string) => statusTag(status),
        },
        {
            title: t("col_actions"),
            key: "actions",
            width: 160,
            render: (_, row) => {
                if (!expandedCode) return null;
                const active = (row.status || "").toUpperCase() === "ACTIVE";
                if (!active) return null;
                return (
                    <Space size={4}>
                        <Popconfirm
                            title={t("rotate_confirm")}
                            onConfirm={() =>
                                void handleRotate(expandedCode, row.credentialId)
                            }
                        >
                            <Button type="text" size="small" disabled={credentialBusy}>
                                {t("rotate")}
                            </Button>
                        </Popconfirm>
                        <Popconfirm
                            title={t("revoke_confirm")}
                            description={t("revoke_confirm_keycloak")}
                            onConfirm={() =>
                                void handleRevoke(expandedCode, row.credentialId)
                            }
                        >
                            <Button type="text" size="small" danger disabled={credentialBusy}>
                                {t("revoke")}
                            </Button>
                        </Popconfirm>
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
                        <AppstoreOutlined style={{ fontSize: 18, color: "#2563eb" }} />
                        <span>{t("title")}</span>
                    </Flex>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setCreateOpen(true)}
                    >
                        {t("create")}
                    </Button>
                }
                styles={{
                    header: { borderBottom: "1px solid #f1f5f9", padding: "14px 20px" },
                    body: { padding: "16px 20px 20px" },
                }}
                style={{
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    boxShadow:
                        "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.03)",
                }}
            >
                <Typography.Paragraph type="secondary" style={{ marginTop: 0, marginBottom: 16 }}>
                    {t("subtitle")}
                </Typography.Paragraph>

                <Table
                    rowKey={(row) => row.applicationCode}
                    loading={loading}
                    columns={appColumns}
                    dataSource={apps}
                    pagination={false}
                    locale={{ emptyText: t("empty") }}
                    expandable={{
                        expandedRowKeys: expandedCode ? [expandedCode] : [],
                        onExpand: (expanded, row) => {
                            if (expanded) {
                                setExpandedCode(row.applicationCode);
                                void loadCredentials(row.applicationCode);
                            } else {
                                setExpandedCode(null);
                                setCredentials([]);
                            }
                        },
                        expandedRowRender: (row) => {
                            const archived = (row.status || "").toUpperCase() === "ARCHIVED";
                            return (
                                <div style={nestedPanelStyle}>
                                    <Space direction="vertical" size={12} style={{ width: "100%" }}>
                                        <Flex justify="space-between" align="center" gap={12}>
                                            <Typography.Text strong>
                                                <KeyOutlined style={{ marginRight: 8 }} />
                                                {t("credentials_title")}
                                            </Typography.Text>
                                            {!archived && (
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    loading={credentialBusy}
                                                    onClick={() =>
                                                        void handleCreateSandbox(row.applicationCode)
                                                    }
                                                >
                                                    {t("create_sandbox")}
                                                </Button>
                                            )}
                                        </Flex>
                                        <Table
                                            rowKey={(c) => String(c.credentialId)}
                                            size="small"
                                            loading={credentialsLoading}
                                            columns={credentialColumns}
                                            dataSource={filterCredentialsByEnvironment(
                                                credentials,
                                                "SANDBOX",
                                            )}
                                            pagination={false}
                                            locale={{ emptyText: t("credentials_empty") }}
                                            tableLayout="fixed"
                                        />
                                    </Space>
                                </div>
                            );
                        },
                    }}
                />
            </Card>

            <Modal
                title={t("create_title")}
                open={createOpen}
                onCancel={() => setCreateOpen(false)}
                onOk={() => void handleCreate()}
                confirmLoading={creating}
                okText={t("create")}
                cancelText={tCommon("cancel")}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" style={{ marginTop: 8 }} requiredMark>
                    <Form.Item
                        name="applicationCode"
                        label={t("field_code")}
                        rules={[
                            { required: true, message: t("field_code_required") },
                            {
                                pattern: /^[a-z0-9-]+$/i,
                                message: t("field_code_pattern"),
                            },
                            { max: 64, message: t("field_code_max") },
                        ]}
                        extra={t("field_code_hint")}
                        style={{ marginBottom: 20 }}
                    >
                        <Input placeholder="checkout-demo" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label={t("field_name")}
                        rules={[{ required: true, message: t("field_name_required") }]}
                        style={{ marginBottom: 20 }}
                    >
                        <Input placeholder={t("field_name_placeholder")} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label={t("field_description")}
                        style={{ marginBottom: 8 }}
                    >
                        <Input.TextArea rows={3} style={{ resize: "none" }} />
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
                onStartVerification={onStartVerification}
            />
        </Space>
    );
}
