"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Alert, Button, Card, Form, InputNumber, Space, Switch, Typography, message } from "antd";
import { api, type RefundSettings } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";

type FormValues = {
    autoRefundThreshold: number | null;
    autoRefundUnlimited: boolean;
};

export default function RefundSettingsPage() {
    const t = useTranslations("Refunds.settings");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<RefundSettings | null>(null);
    const unlimited = Form.useWatch("autoRefundUnlimited", form);

    const load = useCallback(async () => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await api.refundSettings.get(accessToken);
            setSettings(data);
            form.setFieldsValue({
                autoRefundThreshold: Number(data.threshold),
                autoRefundUnlimited: Boolean(data.unlimited ?? data.autoRefundUnlimited),
            });
        } catch (err) {
            if (!handleDashboardApiError(err)) {
                message.error(t("load_failed"));
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken, form, t]);

    useEffect(() => {
        void load();
    }, [load]);

    const onSave = async (values: FormValues) => {
        if (!accessToken) return;
        setSaving(true);
        try {
            const updated = await api.refundSettings.update(
                {
                    autoRefundUnlimited: values.autoRefundUnlimited,
                    autoRefundThreshold: values.autoRefundUnlimited
                        ? undefined
                        : values.autoRefundThreshold,
                },
                accessToken,
            );
            setSettings(updated);
            form.setFieldsValue({
                autoRefundThreshold: Number(updated.threshold),
                autoRefundUnlimited: Boolean(updated.unlimited ?? updated.autoRefundUnlimited),
            });
            message.success(t("save_success"));
        } catch (err) {
            if (!handleDashboardApiError(err)) {
                message.error(t("save_failed"));
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} contentMode="form">
            <Card loading={loading} style={{ maxWidth: 560 }}>
                {settings?.usingPlatformDefault ? (
                    <Alert
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                        message={t("using_platform_default", {
                            threshold: settings.platformDefaultThreshold,
                        })}
                    />
                ) : null}
                <Form form={form} layout="vertical" onFinish={onSave}>
                    <Form.Item label={t("settlement_currency")}>
                        <Typography.Text>
                            {settings?.settlementCurrency || "-"}
                        </Typography.Text>
                    </Form.Item>
                    <Form.Item
                        name="autoRefundUnlimited"
                        label={t("unlimited")}
                        valuePropName="checked"
                        extra={t("unlimited_help")}
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        name="autoRefundThreshold"
                        label={t("threshold")}
                        extra={t("threshold_help")}
                        rules={
                            unlimited
                                ? []
                                : [
                                      {
                                          required: true,
                                          message: t("threshold_required"),
                                      },
                                      {
                                          type: "number",
                                          min: 0,
                                          message: t("threshold_min"),
                                      },
                                  ]
                        }
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={0}
                            precision={2}
                            disabled={Boolean(unlimited)}
                            addonAfter={settings?.settlementCurrency}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
                            {t("fx_help")}
                        </Typography.Paragraph>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={saving}>
                                {t("save")}
                            </Button>
                            <Button onClick={() => void load()} disabled={saving}>
                                {tCommon("refresh")}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </DashboardPage>
    );
}
