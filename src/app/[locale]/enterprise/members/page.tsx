"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
    Button,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
    api,
    ApiError,
    EnterpriseMemberView,
    EnterpriseMembershipKind,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import { getStoredSelectedEnterpriseCode } from "@/components/layout/enterprise-shell";
import { useEnterpriseCapabilities } from "@/components/layout/use-enterprise-capabilities";
import { isEnterpriseAdmin } from "@/lib/enterprise/enterprise-permissions";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";

const KIND_OPTIONS: EnterpriseMembershipKind[] = ["ADMIN", "VIEWER"];

export default function EnterpriseMembersPage() {
    const t = useTranslations("Enterprise.members");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const enterpriseCode = getStoredSelectedEnterpriseCode();
    const { activeEnterprise } = useEnterpriseCapabilities(accessToken);
    const canAdmin = isEnterpriseAdmin(activeEnterprise?.kind);

    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<EnterpriseMemberView[]>([]);
    const [addOpen, setAddOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [form] = Form.useForm<{ identityId: string; kind: EnterpriseMembershipKind }>();

    const loadMembers = useCallback(async () => {
        if (!accessToken || !enterpriseCode) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            setMembers(await api.enterprise.listMembers(accessToken, enterpriseCode));
        } catch (err) {
            handleDashboardApiError(err);
        } finally {
            setLoading(false);
        }
    }, [accessToken, enterpriseCode]);

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    const runMutation = async (action: () => Promise<void>, successKey: string) => {
        try {
            await action();
            message.success(t(successKey));
            await loadMembers();
        } catch (err) {
            if (err instanceof ApiError && err.code === "LAST_ENTERPRISE_ADMIN_REQUIRED") {
                message.error(t("last_admin_required"));
            } else if (err instanceof ApiError) {
                message.error(err.message);
            }
        }
    };

    const handleAdd = async () => {
        if (!accessToken || !enterpriseCode) return;
        const values = await form.validateFields();
        setAdding(true);
        try {
            await api.enterprise.addMember(
                accessToken,
                { identityId: values.identityId.trim(), kind: values.kind },
                enterpriseCode,
            );
            message.success(t("add_success"));
            setAddOpen(false);
            form.resetFields();
            await loadMembers();
        } catch (err) {
            if (err instanceof ApiError) {
                message.error(err.message);
            }
        } finally {
            setAdding(false);
        }
    };

    return (
        <DashboardPage
            title={t("title")}
            subtitle={t("subtitle")}
            extra={
                canAdmin ? (
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddOpen(true)}>
                        {t("add")}
                    </Button>
                ) : undefined
            }
            contentMode="table"
        >
            <Table
                rowKey="identityId"
                loading={loading}
                dataSource={members}
                columns={[
                    {
                        title: t("col_identity"),
                        dataIndex: "identityId",
                        width: 320,
                        render: (id: string) => (
                            <span style={{ wordBreak: "break-all", fontFamily: "var(--font-mono)" }}>{id}</span>
                        ),
                    },
                    {
                        title: t("col_email"),
                        dataIndex: "email",
                        render: (email: string | null | undefined) => email || "—",
                    },
                    { title: t("col_kind"), dataIndex: "kind", width: 100 },
                    {
                        title: t("col_status"),
                        dataIndex: "status",
                        width: 110,
                        render: (status: string) => (
                            <Tag color={status === "ACTIVE" ? "green" : status === "REMOVED" ? "default" : "orange"}>
                                {status}
                            </Tag>
                        ),
                    },
                    ...(canAdmin
                        ? [
                              {
                                  title: t("col_actions"),
                                  key: "actions",
                                  render: (_: unknown, row: EnterpriseMemberView) => (
                                      <Space>
                                          <Select<EnterpriseMembershipKind>
                                              size="small"
                                              value={row.kind}
                                              style={{ width: 110 }}
                                              options={KIND_OPTIONS.map((k) => ({ value: k, label: k }))}
                                              onChange={(kind) =>
                                                  runMutation(
                                                      () =>
                                                          api.enterprise.assignKind(
                                                              accessToken!,
                                                              row.identityId,
                                                              { kind },
                                                              enterpriseCode,
                                                          ),
                                                      "kind_updated",
                                                  )
                                              }
                                          />
                                          {row.status === "ACTIVE" && (
                                              <Button
                                                  size="small"
                                                  onClick={() =>
                                                      runMutation(
                                                          () =>
                                                              api.enterprise.suspendMember(
                                                                  accessToken!,
                                                                  row.identityId,
                                                                  enterpriseCode,
                                                              ),
                                                          "suspended",
                                                      )
                                                  }
                                              >
                                                  {t("suspend")}
                                              </Button>
                                          )}
                                          {row.status !== "REMOVED" && (
                                              <Popconfirm
                                                  title={t("remove_confirm")}
                                                  onConfirm={() =>
                                                      runMutation(
                                                          () =>
                                                              api.enterprise.removeMember(
                                                                  accessToken!,
                                                                  row.identityId,
                                                                  enterpriseCode,
                                                              ),
                                                          "removed",
                                                      )
                                                  }
                                              >
                                                  <Button size="small" danger>
                                                      {t("remove")}
                                                  </Button>
                                              </Popconfirm>
                                          )}
                                      </Space>
                                  ),
                              },
                          ]
                        : []),
                ]}
            />

            <Modal
                title={t("add_title")}
                open={addOpen}
                onCancel={() => setAddOpen(false)}
                onOk={handleAdd}
                confirmLoading={adding}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" initialValues={{ kind: "VIEWER" }}>
                    <Form.Item
                        name="identityId"
                        label={t("field_identity_id")}
                        rules={[{ required: true, message: t("field_identity_required") }]}
                    >
                        <Input placeholder="00000000-0000-0000-0000-000000000000" />
                    </Form.Item>
                    <Form.Item name="kind" label={t("field_kind")} rules={[{ required: true }]}>
                        <Select options={KIND_OPTIONS.map((k) => ({ value: k, label: k }))} />
                    </Form.Item>
                </Form>
            </Modal>
        </DashboardPage>
    );
}
