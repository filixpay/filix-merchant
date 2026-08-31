"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Form,
    Input,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    message,
} from "antd";
import { signIn, useSession } from "next-auth/react";
import {
    api,
    ApiError,
    CANCELABLE_CLOSE_STATUSES,
    CLOSE_REASON_CODES,
    SUBMITTABLE_CLOSE_STATUSES,
    type CloseReasonCode,
    type MerchantCloseRequest,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";

const STATUS_TAG_COLOR: Record<string, string> = {
    DRAFT: "default",
    SUBMITTED: "processing",
    APPROVED: "success",
    REJECTED: "error",
    CANCELLED: "default",
};

const REASON_LABELS: Record<CloseReasonCode, string> = {
    NO_LONGER_OPERATING: "不再经营",
    BUSINESS_CLOSED: "业务已关闭",
    SWITCH_PROVIDER: "更换服务商",
    OTHER: "其他",
};

const STATUS_LABELS: Record<string, string> = {
    DRAFT: "草稿",
    SUBMITTED: "审核中",
    APPROVED: "已通过",
    REJECTED: "已拒绝",
    CANCELLED: "已取消",
};

type CloseAccountFormValues = {
    reasonCode: CloseReasonCode;
    reasonRemark?: string;
};

function formatDateTime(value?: string): string {
    return value ? new Date(value).toLocaleString() : "—";
}

export default function CloseAccountPage() {
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [items, setItems] = useState<MerchantCloseRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [submittingForm, setSubmittingForm] = useState(false);
    const [actionId, setActionId] = useState<number | null>(null);
    const [form] = Form.useForm<CloseAccountFormValues>();

    const load = useCallback(async () => {
        if (!accessToken) {
            return;
        }
        setLoading(true);
        try {
            const response = await api.lifecycle.list(accessToken);
            setItems(response);
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : "加载关闭申请失败");
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) {
            signIn();
            return;
        }
        void load();
    }, [accessToken, load]);

    const createDraft = async (values: CloseAccountFormValues) => {
        if (!accessToken) {
            signIn();
            return null;
        }
        return api.lifecycle.create(accessToken, {
            reasonCode: values.reasonCode,
            reasonRemark: values.reasonRemark?.trim() || undefined,
        });
    };

    const handleSaveDraft = async () => {
        try {
            const values = await form.validateFields();
            setSavingDraft(true);
            await createDraft(values);
            message.success("关闭申请草稿已保存");
            form.resetFields();
            await load();
        } catch (err) {
            if (err && typeof err === "object" && "errorFields" in err) {
                return;
            }
            message.error(err instanceof ApiError ? err.message : "保存草稿失败");
        } finally {
            setSavingDraft(false);
        }
    };

    const handleSubmitForReview = async () => {
        try {
            const values = await form.validateFields();
            Modal.confirm({
                title: "确认提交关闭账户申请？",
                content:
                    "提交后将进入平台审核。账户关闭后不可恢复，请确认余额已结清且无处理中的订单、退款或纠纷。",
                okText: "确认提交",
                okButtonProps: { danger: true },
                cancelText: "再想想",
                onOk: async () => {
                    if (!accessToken) {
                        signIn();
                        return;
                    }
                    setSubmittingForm(true);
                    try {
                        const created = await createDraft(values);
                        if (!created) {
                            return;
                        }
                        await api.lifecycle.submit(accessToken, created.id);
                        message.success("关闭申请已提交审核");
                        form.resetFields();
                        await load();
                    } catch (err) {
                        message.error(err instanceof ApiError ? err.message : "提交失败");
                        throw err;
                    } finally {
                        setSubmittingForm(false);
                    }
                },
            });
        } catch (err) {
            if (err && typeof err === "object" && "errorFields" in err) {
                return;
            }
        }
    };

    const handleSubmitDraft = async (id: number) => {
        if (!accessToken) {
            signIn();
            return;
        }
        Modal.confirm({
            title: "确认提交该草稿？",
            content: "提交后将进入平台审核，账户关闭后不可恢复。",
            okText: "确认提交",
            okButtonProps: { danger: true },
            cancelText: "取消",
            onOk: async () => {
                setActionId(id);
                try {
                    await api.lifecycle.submit(accessToken, id);
                    message.success("关闭申请已提交");
                    await load();
                } catch (err) {
                    message.error(err instanceof ApiError ? err.message : "提交失败");
                    throw err;
                } finally {
                    setActionId(null);
                }
            },
        });
    };

    const handleCancel = async (id: number) => {
        if (!accessToken) {
            signIn();
            return;
        }
        Modal.confirm({
            title: "确认撤销该申请？",
            okText: "确认撤销",
            okButtonProps: { danger: true },
            cancelText: "取消",
            onOk: async () => {
                setActionId(id);
                try {
                    await api.lifecycle.cancel(accessToken, id);
                    message.success("关闭申请已撤销");
                    await load();
                } catch (err) {
                    message.error(err instanceof ApiError ? err.message : "撤销失败");
                    throw err;
                } finally {
                    setActionId(null);
                }
            },
        });
    };

    return (
        <DashboardPage title="关闭账户" subtitle="提交账户关闭申请，审核通过后将关闭商户账户">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Alert
                    type="warning"
                    showIcon
                    message="账户关闭须知"
                    description={
                        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                            <li>账户关闭后不可恢复，且无法继续使用相关支付与结算服务；请提前导出账单及历史数据。</li>
                            <li>请确保账户内无待结算余额，且无处理中的订单、退款或纠纷。</li>
                            <li>提交后需经平台审核（预计 1–3 个工作日）。</li>
                        </ul>
                    }
                />

                <Card title="新建关闭申请">
                    <Form form={form} layout="vertical" style={{ maxWidth: 560 }}>
                        <Form.Item
                            name="reasonCode"
                            label="关闭原因"
                            rules={[{ required: true, message: "请选择关闭原因" }]}
                        >
                            <Select
                                placeholder="请选择关闭原因"
                                options={CLOSE_REASON_CODES.map((value) => ({
                                    value,
                                    label: REASON_LABELS[value],
                                }))}
                            />
                        </Form.Item>
                        <Form.Item name="reasonRemark" label="补充说明">
                            <Input.TextArea
                                rows={4}
                                maxLength={500}
                                showCount
                                placeholder="请详细说明申请关闭账户的具体原因（可选）"
                            />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                                <Button loading={savingDraft} onClick={() => void handleSaveDraft()}>
                                    保存草稿
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    loading={submittingForm}
                                    onClick={() => void handleSubmitForReview()}
                                >
                                    提交审核
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>

                <Card title="申请记录">
                    <Table
                        rowKey="id"
                        loading={loading}
                        dataSource={items}
                        pagination={false}
                        locale={{ emptyText: "暂无关闭申请记录" }}
                        columns={[
                            {
                                title: "编号",
                                dataIndex: "id",
                                width: 80,
                            },
                            {
                                title: "状态",
                                dataIndex: "status",
                                width: 100,
                                render: (value: string) => (
                                    <Tag color={STATUS_TAG_COLOR[value] ?? "default"}>
                                        {STATUS_LABELS[value] ?? value}
                                    </Tag>
                                ),
                            },
                            {
                                title: "关闭原因",
                                dataIndex: "reasonCode",
                                render: (value: CloseReasonCode) => REASON_LABELS[value] ?? value,
                            },
                            {
                                title: "备注",
                                dataIndex: "reasonRemark",
                                ellipsis: true,
                                render: (value?: string) => value || "—",
                            },
                            {
                                title: "提交时间",
                                dataIndex: "submittedAt",
                                width: 180,
                                render: (value?: string) => formatDateTime(value),
                            },
                            {
                                title: "审核备注",
                                dataIndex: "reviewNote",
                                ellipsis: true,
                                render: (value?: string) => value || "—",
                            },
                            {
                                title: "操作",
                                key: "actions",
                                width: 180,
                                render: (_, record) => {
                                    const canSubmit = SUBMITTABLE_CLOSE_STATUSES.includes(record.status);
                                    const canCancel = CANCELABLE_CLOSE_STATUSES.includes(record.status);
                                    if (!canSubmit && !canCancel) {
                                        return "—";
                                    }
                                    return (
                                        <Space size="small">
                                            {canSubmit ? (
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    loading={actionId === record.id}
                                                    onClick={() => void handleSubmitDraft(record.id)}
                                                >
                                                    提交
                                                </Button>
                                            ) : null}
                                            {canCancel ? (
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    danger
                                                    loading={actionId === record.id}
                                                    onClick={() => void handleCancel(record.id)}
                                                >
                                                    撤销
                                                </Button>
                                            ) : null}
                                        </Space>
                                    );
                                },
                            },
                        ]}
                    />
                </Card>
            </Space>
        </DashboardPage>
    );
}
