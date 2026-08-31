"use client";

import { useEffect, useRef } from "react";
import { Alert, Form, Input, Modal, Segmented, Typography } from "antd";
import { ExportOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { PaymentConfigView } from "@/lib/api";
import {
    buildConfigEditData,
    getCredentialHelpUrl,
    isSecretConfigured,
    matchesStripeKeyPrefix,
    stripeKeyPlaceholder,
    supportsCredentialEdit,
    supportsSandboxToggle,
    type ConfigEditData,
    type SecretParameterKey,
} from "./config-model";
import styles from "./EditConfigModal.module.css";

interface EditConfigModalProps {
    open: boolean;
    config: PaymentConfigView | null;
    onClose: () => void;
    onSubmit: (data: ConfigEditData) => Promise<void>;
    submitting: boolean;
}

function secretRules(
    config: PaymentConfigView,
    key: SecretParameterKey,
    requiredMessage: string,
) {
    if (isSecretConfigured(config, key)) {
        return [];
    }
    return [{ required: true, message: requiredMessage }];
}

function SecretStatusBadge({
    configured,
    configuredLabel,
    missingLabel,
}: {
    configured: boolean;
    configuredLabel: string;
    missingLabel: string;
}) {
    return (
        <span className={`${styles.badge} ${configured ? styles.badgeConfigured : styles.badgeMissing}`}>
            <span className={styles.badgeDot} aria-hidden />
            {configured ? configuredLabel : missingLabel}
        </span>
    );
}

function labelWithStatus(
    label: string,
    configured: boolean,
    configuredLabel: string,
    missingLabel: string,
) {
    return (
        <span className={styles.labelWithBadge}>
            <span>{label}</span>
            <SecretStatusBadge
                configured={configured}
                configuredLabel={configuredLabel}
                missingLabel={missingLabel}
            />
        </span>
    );
}

function EnvironmentToggle({ liveLabel, testLabel }: { liveLabel: string; testLabel: string }) {
    const sandbox = Form.useWatch(["parameters", "sandbox"]) === true;

    return (
        <Form.Item
            name={["parameters", "sandbox"]}
            className={styles.envToggle}
            getValueProps={(value) => ({ value: value ? "test" : "live" })}
            getValueFromEvent={(value) => value === "test"}
        >
            <Segmented
                block
                className={`${styles.envSegmented} ${sandbox ? styles.envTest : styles.envLive}`}
                options={[
                    { label: liveLabel, value: "live" },
                    { label: testLabel, value: "test" },
                ]}
            />
        </Form.Item>
    );
}

export default function EditConfigModal({
    open,
    config,
    onClose,
    onSubmit,
    submitting,
}: EditConfigModalProps) {
    const t = useTranslations("Configs");
    const tCommon = useTranslations("Common");
    const [form] = Form.useForm<ConfigEditData>();
    const sandbox = Form.useWatch(["parameters", "sandbox"], form) === true;
    const lastSandboxRef = useRef<boolean | null>(null);

    useEffect(() => {
        if (config && open) {
            form.setFieldsValue(buildConfigEditData(config));
            lastSandboxRef.current = null;
        }
    }, [config, open, form]);

    useEffect(() => {
        if (!open || !config?.channelCode.startsWith("STRIPE")) {
            lastSandboxRef.current = null;
            return;
        }
        if (lastSandboxRef.current === null) {
            lastSandboxRef.current = sandbox;
            return;
        }
        if (lastSandboxRef.current === sandbox) return;
        lastSandboxRef.current = sandbox;
        void form
            .validateFields([
                ["parameters", "secretKey"],
                ["parameters", "publishableKey"],
                ["parameters", "webhookSecret"],
            ])
            .catch(() => undefined);
    }, [sandbox, open, config, form]);

    if (!config) return null;

    const channelCode = config.channelCode;
    const needsCredentials = supportsCredentialEdit(channelCode);
    const showSandbox = supportsSandboxToggle(channelCode);
    const helpUrl = getCredentialHelpUrl(channelCode);
    const secretPlaceholder = t("fields.secret_keep_placeholder");
    const configuredLabel = t("secret_status.configured");
    const missingLabel = t("secret_status.missing");
    const requiredMsg = t("fields.required");

    const stripePrefixRule = (kind: "secret" | "publishable" | "webhook") => ({
        validator(_: unknown, value: string | undefined) {
            if (matchesStripeKeyPrefix(kind, value, sandbox)) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(t(`validation.stripe_${kind}_prefix`)));
        },
    });

    return (
        <Modal
            title={t("edit_config")}
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={submitting}
            okText={t("save_config")}
            cancelText={tCommon("cancel")}
            width={520}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                className={styles.form}
                onFinish={onSubmit}
                initialValues={{ openStatus: "OPENED" }}
            >
                {needsCredentials ? (
                    <Alert
                        className={styles.securityBanner}
                        type="info"
                        showIcon
                        icon={<SafetyCertificateOutlined />}
                        message={t("edit_security_title")}
                        description={t("edit_secret_hint")}
                    />
                ) : (
                    <Typography.Paragraph type="secondary">{t("edit_params_hint")}</Typography.Paragraph>
                )}

                {showSandbox ? (
                    <EnvironmentToggle liveLabel={t("env.live")} testLabel={t("env.test")} />
                ) : null}

                {channelCode.startsWith("ALIPAY") && (
                    <>
                        <Typography.Title level={5}>{t("sections.alipay")}</Typography.Title>
                        <Form.Item
                            name={["parameters", "appId"]}
                            label={t("fields.app_id")}
                            rules={[{ required: true, message: requiredMsg }]}
                        >
                            <Input className={styles.monoInput} />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "partner"]}
                            label={t("fields.partner_id")}
                            rules={[{ required: true, message: requiredMsg }]}
                        >
                            <Input className={styles.monoInput} />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "alipayPublicKey"]}
                            label={t("fields.alipay_public_key")}
                            rules={[{ required: true, message: requiredMsg }]}
                        >
                            <Input.TextArea
                                rows={3}
                                className={styles.monoInput}
                                style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
                            />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "appPrivateKey"]}
                            label={labelWithStatus(
                                t("fields.app_private_key"),
                                isSecretConfigured(config, "appPrivateKey"),
                                configuredLabel,
                                missingLabel,
                            )}
                            rules={secretRules(config, "appPrivateKey", requiredMsg)}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "appPrivateKey")
                                        ? secretPlaceholder
                                        : undefined
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                    </>
                )}

                {channelCode.startsWith("WECHAT") && (
                    <>
                        <Typography.Title level={5}>{t("sections.wechat")}</Typography.Title>
                        <Form.Item
                            name={["parameters", "appId"]}
                            label={t("fields.app_id")}
                            rules={[{ required: true, message: requiredMsg }]}
                        >
                            <Input className={styles.monoInput} />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "appSecret"]}
                            label={labelWithStatus(
                                t("fields.app_secret"),
                                isSecretConfigured(config, "appSecret"),
                                configuredLabel,
                                missingLabel,
                            )}
                            rules={secretRules(config, "appSecret", requiredMsg)}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "appSecret") ? secretPlaceholder : undefined
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "mchId"]}
                            label={t("fields.mch_id")}
                            rules={[{ required: true, message: requiredMsg }]}
                        >
                            <Input className={styles.monoInput} />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "v2ApiKey"]}
                            label={labelWithStatus(
                                t("fields.v2_api_key"),
                                isSecretConfigured(config, "v2ApiKey"),
                                configuredLabel,
                                missingLabel,
                            )}
                            rules={secretRules(config, "v2ApiKey", requiredMsg)}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "v2ApiKey") ? secretPlaceholder : undefined
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "v3ApiKey"]}
                            label={labelWithStatus(
                                t("fields.v3_api_key"),
                                isSecretConfigured(config, "v3ApiKey"),
                                configuredLabel,
                                missingLabel,
                            )}
                            rules={secretRules(config, "v3ApiKey", requiredMsg)}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "v3ApiKey") ? secretPlaceholder : undefined
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "v3SerialNo"]}
                            label={t("fields.v3_serial_no")}
                            rules={[{ required: true, message: requiredMsg }]}
                        >
                            <Input className={styles.monoInput} />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "v3PrivateKey"]}
                            label={labelWithStatus(
                                t("fields.v3_private_key"),
                                isSecretConfigured(config, "v3PrivateKey"),
                                configuredLabel,
                                missingLabel,
                            )}
                            rules={secretRules(config, "v3PrivateKey", requiredMsg)}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "v3PrivateKey")
                                        ? secretPlaceholder
                                        : undefined
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "v3PublicKey"]}
                            label={t("fields.v3_public_key")}
                            rules={[{ required: true, message: requiredMsg }]}
                        >
                            <Input.TextArea
                                rows={3}
                                style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
                            />
                        </Form.Item>
                    </>
                )}

                {channelCode.startsWith("STRIPE") && (
                    <>
                        <Typography.Title level={5}>{t("sections.stripe")}</Typography.Title>
                        <Form.Item
                            name={["parameters", "secretKey"]}
                            label={labelWithStatus(
                                t("fields.secret_key"),
                                isSecretConfigured(config, "secretKey"),
                                configuredLabel,
                                missingLabel,
                            )}
                            rules={[
                                ...secretRules(config, "secretKey", requiredMsg),
                                stripePrefixRule("secret"),
                            ]}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "secretKey")
                                        ? secretPlaceholder
                                        : stripeKeyPlaceholder("secret", sandbox)
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "publishableKey"]}
                            label={t("fields.publishable_key")}
                            rules={[stripePrefixRule("publishable")]}
                        >
                            <Input
                                placeholder={stripeKeyPlaceholder("publishable", sandbox)}
                                className={styles.monoInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "webhookSecret"]}
                            label={labelWithStatus(
                                t("fields.webhook_secret"),
                                isSecretConfigured(config, "webhookSecret"),
                                configuredLabel,
                                missingLabel,
                            )}
                            rules={[stripePrefixRule("webhook")]}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "webhookSecret")
                                        ? secretPlaceholder
                                        : stripeKeyPlaceholder("webhook", sandbox)
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                    </>
                )}

                {channelCode.startsWith("PAYPAL") && (
                    <>
                        <Typography.Title level={5}>{t("sections.paypal")}</Typography.Title>
                        <Form.Item
                            name={["parameters", "clientId"]}
                            label={t("fields.client_id")}
                            rules={[{ required: true, message: requiredMsg }]}
                        >
                            <Input className={styles.monoInput} />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "clientSecret"]}
                            label={labelWithStatus(
                                t("fields.client_secret"),
                                isSecretConfigured(config, "clientSecret"),
                                configuredLabel,
                                missingLabel,
                            )}
                            rules={secretRules(config, "clientSecret", requiredMsg)}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "clientSecret")
                                        ? secretPlaceholder
                                        : undefined
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                        <Form.Item name={["parameters", "webhookId"]} label={t("fields.webhook_id")}>
                            <Input className={styles.monoInput} />
                        </Form.Item>
                    </>
                )}

                {channelCode.startsWith("NOWPAYMENTS") && (
                    <>
                        <Typography.Title level={5}>{t("sections.nowpayments")}</Typography.Title>
                        <Form.Item
                            name={["parameters", "apiKey"]}
                            label={labelWithStatus(
                                t("fields.api_key"),
                                isSecretConfigured(config, "apiKey"),
                                configuredLabel,
                                missingLabel,
                            )}
                            rules={secretRules(config, "apiKey", requiredMsg)}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "apiKey") ? secretPlaceholder : undefined
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "ipnSecret"]}
                            label={labelWithStatus(
                                t("fields.ipn_secret"),
                                isSecretConfigured(config, "ipnSecret"),
                                configuredLabel,
                                missingLabel,
                            )}
                        >
                            <Input.Password
                                placeholder={
                                    isSecretConfigured(config, "ipnSecret") ? secretPlaceholder : undefined
                                }
                                visibilityToggle
                                className={styles.monoInput}
                            />
                        </Form.Item>
                        <Form.Item
                            name={["parameters", "defaultCurrency"]}
                            label={t("fields.default_currency")}
                        >
                            <Input placeholder="usdt" />
                        </Form.Item>
                    </>
                )}

                {helpUrl ? (
                    <div className={styles.helpRow}>
                        <span>{t("credential_help.prompt")}</span>
                        <Typography.Link
                            href={helpUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.helpLink}
                        >
                            {t("credential_help.open_console")} <ExportOutlined />
                        </Typography.Link>
                    </div>
                ) : null}
            </Form>
        </Modal>
    );
}
