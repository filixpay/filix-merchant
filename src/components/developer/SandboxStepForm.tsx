"use client";

import { Form, Input, InputNumber, Select, Space, Typography } from "antd";
import { useTranslations } from "next-intl";
import { buildDefaultCreateOrderInput } from "./sandbox-ui-model";

interface SandboxStepFormProps {
    inputSchema: string;
    context: Record<string, unknown>;
    disabled?: boolean;
    onChange?: (values: Record<string, unknown>) => void;
}

export default function SandboxStepForm({
    inputSchema,
    context,
    disabled,
    onChange,
}: SandboxStepFormProps) {
    const t = useTranslations("Developer.sandbox");
    const [form] = Form.useForm();

    if (inputSchema === "readonly-context" || inputSchema === "webhook-poll") {
        return (
            <Space direction="vertical" size={8}>
                <Typography.Text type="secondary">{t("context_merchant_order_id")}</Typography.Text>
                <Typography.Text code>{String(context.merchantOrderId ?? "-")}</Typography.Text>
                {inputSchema === "webhook-poll" ? (
                    <Typography.Text type="secondary">{t("webhook_poll_hint")}</Typography.Text>
                ) : null}
            </Space>
        );
    }

    if (inputSchema !== "create-order") {
        return null;
    }

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={buildDefaultCreateOrderInput()}
            disabled={disabled}
            onValuesChange={(_, values) => onChange?.(values as Record<string, unknown>)}
        >
            <Form.Item name="merchantOrderId" label={t("field_merchant_order_id")} rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="subject" label={t("field_subject")} rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="returnUrl" label={t("field_return_url")} rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Space wrap style={{ width: "100%" }}>
                <Form.Item
                    name={["totalAmount", "currency"]}
                    label={t("field_currency")}
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { value: "CNY", label: "CNY" },
                            { value: "USD", label: "USD" },
                        ]}
                        style={{ width: 120 }}
                    />
                </Form.Item>
                <Form.Item
                    name={["totalAmount", "amount"]}
                    label={t("field_amount")}
                    rules={[{ required: true }]}
                >
                    <InputNumber min={1} style={{ width: 120 }} />
                </Form.Item>
            </Space>
            <Typography.Text type="secondary">{t("field_order_item_hint")}</Typography.Text>
            <Form.Item name={["orderItems", 0, "productId"]} label={t("field_product_id")} rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name={["orderItems", 0, "productName"]} label={t("field_product_name")} rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Space wrap>
                <Form.Item name={["orderItems", 0, "quantity"]} label={t("field_quantity")} rules={[{ required: true }]}>
                    <InputNumber min={1} />
                </Form.Item>
                <Form.Item name={["orderItems", 0, "unitPrice"]} label={t("field_unit_price")} rules={[{ required: true }]}>
                    <InputNumber min={1} />
                </Form.Item>
            </Space>
        </Form>
    );
}
