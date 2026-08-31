"use client";

import { Button, Modal, Space } from "antd";
import { useTranslations } from "next-intl";
import type { CommerceProductView } from "@/lib/api/domains/commerce";
import { canPublish, canRetrySync, canUnpublish, isInFlightIntegration } from "@/lib/api/domains/commerce";

type PublishActionsProps = {
    product: CommerceProductView;
    loading?: boolean;
    onPublish: () => void;
    onUnpublish: () => void;
    onRetrySync?: () => void;
};

export default function PublishActions({
    product,
    loading,
    onPublish,
    onUnpublish,
    onRetrySync,
}: PublishActionsProps) {
    const t = useTranslations("CommerceProducts");
    const inFlight = isInFlightIntegration(product.integrationStatus);
    const showRetrySync = canRetrySync(product) && onRetrySync;

    const confirmPublish = () => {
        Modal.confirm({
            title: t("publish.confirm_title"),
            content: t("publish.confirm_body"),
            okText: t("actions.publish"),
            cancelText: t("actions.cancel"),
            onOk: onPublish,
        });
    };

    const confirmUnpublish = () => {
        Modal.confirm({
            title: t("unpublish.confirm_title"),
            content: t("unpublish.confirm_body"),
            okText: t("actions.unpublish"),
            cancelText: t("actions.cancel"),
            onOk: onUnpublish,
        });
    };

    return (
        <Space>
            {showRetrySync ? (
                <Button loading={loading} onClick={onRetrySync}>
                    {t("actions.retry_sync")}
                </Button>
            ) : null}
            <Button
                type="primary"
                disabled={!canPublish(product) || inFlight}
                loading={loading && canPublish(product)}
                onClick={confirmPublish}
            >
                {t("actions.publish")}
            </Button>
            <Button
                disabled={!canUnpublish(product) || inFlight}
                loading={loading && canUnpublish(product)}
                onClick={confirmUnpublish}
            >
                {t("actions.unpublish")}
            </Button>
        </Space>
    );
}
