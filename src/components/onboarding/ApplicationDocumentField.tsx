"use client";

import { useState } from "react";
import { App, Button, Space, Typography, Upload } from "antd";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { api, ApiError, type ApplicationDocument } from "@/lib/api";

type ApplicationDocumentFieldProps = {
    applicationId: string;
    fieldCode: string;
    editable: boolean;
    document?: ApplicationDocument;
    onDocumentChange: () => void | Promise<void>;
};

export default function ApplicationDocumentField({
    applicationId,
    fieldCode,
    editable,
    document,
    onDocumentChange,
}: ApplicationDocumentFieldProps) {
    const t = useTranslations("Onboarding");
    const tCommon = useTranslations("Common");
    const { message } = App.useApp();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleUpload = async (file: File) => {
        if (!accessToken) {
            return false;
        }
        setUploading(true);
        try {
            await api.onboarding.uploadDocument(accessToken, applicationId, fieldCode, file);
            await onDocumentChange();
            message.success(t("documentUploaded"));
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : tCommon("error"));
        } finally {
            setUploading(false);
        }
        return false;
    };

    const handleDelete = async () => {
        if (!accessToken) {
            return;
        }
        setDeleting(true);
        try {
            await api.onboarding.deleteDocument(accessToken, applicationId, fieldCode);
            await onDocumentChange();
            message.success(t("documentRemoved"));
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : tCommon("error"));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {document ? (
                <Space>
                    <Typography.Text>{document.fileName}</Typography.Text>
                    {editable ? (
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            loading={deleting}
                            disabled={uploading}
                            onClick={handleDelete}
                        />
                    ) : null}
                </Space>
            ) : null}
            {editable ? (
                <Upload.Dragger
                    multiple={false}
                    beforeUpload={handleUpload}
                    showUploadList={false}
                    disabled={!editable || uploading || deleting}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">{t("documentUploadHint")}</p>
                </Upload.Dragger>
            ) : document ? null : (
                <Typography.Text type="secondary">{t("documentMissing")}</Typography.Text>
            )}
        </Space>
    );
}
