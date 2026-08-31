"use client";

import { useState } from "react";
import { Alert, Button, Flex, Modal, Space, Typography, message } from "antd";
import { CopyOutlined, ExportOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { IssuedCredentialView } from "@/lib/developer/applications-api";
import DevCodeField from "./DevCodeField";
import { formatIssuedCredentialEnv } from "./format-issued-credential-env";

type IssuedCredentialModalProps = {
    open: boolean;
    issued: IssuedCredentialView | null;
    onClose: () => void;
    onStartVerification?: (credentials: {
        clientId: string;
        clientSecret: string;
    }) => void | Promise<void>;
};

export default function IssuedCredentialModal({
    open,
    issued,
    onClose,
    onStartVerification,
}: IssuedCredentialModalProps) {
    const t = useTranslations("Developer.applications");
    const tDev = useTranslations("Developer");
    const locale = useLocale();
    const [startingVerification, setStartingVerification] = useState(false);

    const handleCopy = () => {
        message.success(tDev("copy_success"));
    };

    const handleCopyAll = () => {
        if (!issued) return;
        void navigator.clipboard.writeText(
            formatIssuedCredentialEnv({
                clientId: issued.clientId,
                clientSecret: issued.clientSecret,
                environment: issued.environment,
            }),
        );
        message.success(t("copy_all_success"));
    };

    const handleStartVerification = () => {
        if (!issued || !onStartVerification) return;
        setStartingVerification(true);
        void (async () => {
            try {
                await onStartVerification({
                    clientId: issued.clientId,
                    clientSecret: issued.clientSecret,
                });
                onClose();
            } catch (err) {
                console.error(err);
                message.error(
                    err instanceof Error ? err.message : t("start_verification_failed"),
                );
            } finally {
                setStartingVerification(false);
            }
        })();
    };

    return (
        <Modal
            title={t("secret_title")}
            open={open}
            onCancel={onClose}
            destroyOnHidden
            width={560}
            footer={
                <Flex
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    gap={8}
                    style={{ width: "100%" }}
                >
                    <Space wrap size="middle">
                        <Button icon={<CopyOutlined />} onClick={handleCopyAll} disabled={!issued}>
                            {t("copy_all_env")}
                        </Button>
                        {onStartVerification &&
                        (issued?.environment || "").toUpperCase() !== "LIVE" ? (
                            <Button
                                type="link"
                                style={{ paddingInline: 0 }}
                                loading={startingVerification}
                                onClick={handleStartVerification}
                            >
                                {t("start_verification")}
                            </Button>
                        ) : null}
                        <Link href={`/${locale}/developers`} target="_blank" rel="noreferrer">
                            <Button type="link" style={{ paddingInline: 0 }} icon={<ExportOutlined />}>
                                {t("view_integration_docs")}
                            </Button>
                        </Link>
                    </Space>
                    <Button type="primary" onClick={onClose}>
                        {tDev("saved_credentials_button")}
                    </Button>
                </Flex>
            }
        >
            <Alert
                type="warning"
                showIcon
                style={{
                    marginBottom: 16,
                    background: "#fffbeb",
                    borderColor: "#fde68a",
                }}
                message={t("save_secret_warning")}
            />
            {issued ? (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    <div>
                        <Typography.Text type="secondary">{t("col_environment")}</Typography.Text>
                        <div style={{ marginTop: 6 }}>
                            <DevCodeField value={issued.environment} />
                        </div>
                    </div>
                    <div>
                        <Typography.Text type="secondary">{tDev("client_id")}</Typography.Text>
                        <div style={{ marginTop: 6 }}>
                            <DevCodeField
                                value={issued.clientId}
                                copyable
                                copyLabel={t("copy")}
                                onCopy={handleCopy}
                            />
                        </div>
                    </div>
                    <div>
                        <Typography.Text type="secondary">{tDev("client_secret")}</Typography.Text>
                        <div style={{ marginTop: 6 }}>
                            <DevCodeField
                                value={issued.clientSecret}
                                copyable
                                secret
                                copyLabel={t("copy")}
                                revealLabel={t("reveal_secret")}
                                hideLabel={t("hide_secret")}
                                onCopy={handleCopy}
                            />
                        </div>
                    </div>
                </Space>
            ) : null}
        </Modal>
    );
}
