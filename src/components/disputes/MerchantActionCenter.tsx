"use client";

import { useState } from "react";
import { App, Button, Card, Flex, Select, Space, Table, Typography, Upload } from "antd";
import { DeleteOutlined, InboxOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import {
    EvidenceCategory,
    type DisputeEvidence,
    type DisputeView,
    canEditEvidence,
    getAvailableActions,
} from "@/lib/api";

interface MerchantActionCenterProps {
    dispute: DisputeView;
    saving: boolean;
    uploading?: boolean;
    onUploadEvidence?: (file: File) => Promise<DisputeEvidence>;
    onSaveDraft: (evidence: DisputeEvidence[]) => Promise<void>;
    onSubmit: (evidence: DisputeEvidence[]) => Promise<void>;
    onAcceptLiability: () => Promise<void>;
}

const ACCEPTED_MIME_HINT = ".pdf,.jpg,.jpeg,.png,.webp";
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

type LocalEvidenceItem = DisputeEvidence & {
    clientFileSize?: number;
};

function toDisputeEvidence(items: LocalEvidenceItem[]): DisputeEvidence[] {
    return items.map(({ category, fileName, uploadedAt, fileId, fileUrl }) => ({
        category,
        fileName,
        uploadedAt,
        fileId,
        fileUrl,
    }));
}

function formatFileSize(bytes: number | undefined): string {
    if (bytes == null || !Number.isFinite(bytes) || bytes <= 0) {
        return "-";
    }
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MerchantActionCenter({
    dispute,
    saving,
    uploading = false,
    onUploadEvidence,
    onSaveDraft,
    onSubmit,
    onAcceptLiability,
}: MerchantActionCenterProps) {
    const t = useTranslations("Disputes");
    const tCommon = useTranslations("Common");
    const { modal, message } = App.useApp();
    const editable = canEditEvidence(dispute.status);
    const actions = getAvailableActions(dispute.status);
    const [evidence, setEvidence] = useState<LocalEvidenceItem[]>([...dispute.evidence]);

    const categoryOptions = Object.values(EvidenceCategory).map((value) => ({
        value,
        label: t(`evidence_category.${value}`),
    }));

    const handleUpload = async (file: File) => {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            message.error(t("action_center.file_too_large", { size: MAX_FILE_SIZE_MB }));
            return false;
        }

        if (onUploadEvidence) {
            try {
                const uploaded = await onUploadEvidence(file);
                setEvidence((current) => [
                    ...current,
                    { ...uploaded, clientFileSize: file.size },
                ]);
                message.success(t("messages.evidence_uploaded"));
            } catch (err) {
                message.error(err instanceof Error ? err.message : tCommon("error"));
            }
            return false;
        }

        const entry: LocalEvidenceItem = {
            category: EvidenceCategory.OTHER,
            fileName: file.name,
            uploadedAt: new Date().toISOString(),
            clientFileSize: file.size,
        };
        setEvidence((current) => [...current, entry]);
        return false;
    };

    const handleCategoryChange = (index: number, category: EvidenceCategory) => {
        setEvidence((current) =>
            current.map((item, itemIndex) => (itemIndex === index ? { ...item, category } : item)),
        );
    };

    const handleRemove = (index: number) => {
        setEvidence((current) => current.filter((_, itemIndex) => itemIndex !== index));
    };

    const confirmSubmit = () => {
        if (evidence.length === 0) {
            message.warning(t("messages.evidence_required"));
            return;
        }
        modal.confirm({
            title: t("actions.submit_confirm_title"),
            content: t("actions.submit_confirm_body"),
            okText: t("actions.submit"),
            onOk: () => onSubmit(toDisputeEvidence(evidence)),
        });
    };

    const confirmAcceptLiability = () => {
        modal.confirm({
            title: t("actions.accept_liability_confirm_title"),
            content: t("actions.accept_liability_confirm_body"),
            okType: "danger",
            onOk: onAcceptLiability,
        });
    };

    return (
        <Card title={t("action_center.title")} size="small">
            {!editable ? (
                <Typography.Text type="secondary">{t("action_center.locked")}</Typography.Text>
            ) : (
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Upload.Dragger
                        multiple
                        accept={ACCEPTED_MIME_HINT}
                        beforeUpload={handleUpload}
                        showUploadList={false}
                        disabled={!editable || saving || uploading}
                        style={{ padding: "12px 8px" }}
                    >
                        <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text" style={{ marginBottom: 4 }}>
                            {t("action_center.upload_hint")}
                        </p>
                        <p className="ant-upload-hint" style={{ marginBottom: 0 }}>
                            {t("action_center.upload_types", { size: MAX_FILE_SIZE_MB })}
                        </p>
                    </Upload.Dragger>

                    {evidence.length > 0 ? (
                        <Table
                            size="small"
                            pagination={false}
                            rowKey={(_, index) => String(index)}
                            dataSource={evidence.map((item, index) => ({ ...item, index }))}
                            columns={[
                                {
                                    title: t("action_center.file"),
                                    dataIndex: "fileName",
                                    key: "fileName",
                                    ellipsis: true,
                                },
                                {
                                    title: t("action_center.file_size"),
                                    key: "fileSize",
                                    width: 90,
                                    render: (_, row) => formatFileSize(row.clientFileSize),
                                },
                                {
                                    title: t("action_center.category"),
                                    key: "category",
                                    render: (_, row) => (
                                        <Select
                                            size="small"
                                            style={{ minWidth: 140 }}
                                            value={row.category}
                                            options={categoryOptions}
                                            disabled={!editable || saving}
                                            onChange={(value) => handleCategoryChange(row.index, value)}
                                        />
                                    ),
                                },
                                {
                                    key: "remove",
                                    width: 48,
                                    render: (_, row) => (
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            disabled={!editable || saving}
                                            onClick={() => handleRemove(row.index)}
                                            aria-label={tCommon("delete")}
                                        />
                                    ),
                                },
                            ]}
                        />
                    ) : null}

                    <Flex gap={8} wrap="wrap" align="center">
                        {actions.includes("SUBMIT") ? (
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                loading={saving}
                                disabled={evidence.length === 0}
                                onClick={confirmSubmit}
                            >
                                {t("actions.submit")}
                            </Button>
                        ) : null}
                        {actions.includes("SAVE_DRAFT") ? (
                            <Button
                                type="default"
                                icon={<SaveOutlined />}
                                loading={saving}
                                onClick={() => onSaveDraft(toDisputeEvidence(evidence))}
                            >
                                {t("actions.save_draft")}
                            </Button>
                        ) : null}
                        {actions.includes("ACCEPT_LIABILITY") ? (
                            <Button
                                danger
                                ghost
                                loading={saving}
                                onClick={confirmAcceptLiability}
                                style={{ marginLeft: "auto" }}
                            >
                                {t("actions.accept_liability")}
                            </Button>
                        ) : null}
                    </Flex>
                </Space>
            )}
        </Card>
    );
}
