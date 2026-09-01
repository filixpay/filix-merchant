"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, Modal, Space, Typography } from "antd";
import { useLocale, useTranslations } from "next-intl";

const CELEBRATION_SEEN_SESSION_KEY = "filix-commerce-celebration-seen-posted";

type FirstPublishCelebrationModalProps = {
    open: boolean;
    productName: string | null;
    storefrontPreviewUrl: string | null;
    markCelebrationSeen: () => Promise<void>;
};

export default function FirstPublishCelebrationModal({
    open,
    productName,
    storefrontPreviewUrl,
    markCelebrationSeen,
}: FirstPublishCelebrationModalProps) {
    const t = useTranslations("CommerceActivation.celebration");
    const locale = useLocale();
    const [visible, setVisible] = useState(open);
    const postingRef = useRef(false);

    useEffect(() => {
        setVisible(open);
    }, [open]);

    useEffect(() => {
        if (!open || !visible) {
            return;
        }
        if (typeof window === "undefined") {
            return;
        }

        try {
            if (sessionStorage.getItem(CELEBRATION_SEEN_SESSION_KEY) === "1") {
                return;
            }
        } catch {
            /* sessionStorage unavailable — still attempt POST */
        }

        if (postingRef.current) {
            return;
        }
        postingRef.current = true;

        void (async () => {
            try {
                await markCelebrationSeen();
                try {
                    sessionStorage.setItem(CELEBRATION_SEEN_SESSION_KEY, "1");
                } catch {
                    /* ignore */
                }
            } catch {
                // Keep modal visible; clear session guard so next mount can retry.
                try {
                    sessionStorage.removeItem(CELEBRATION_SEEN_SESSION_KEY);
                } catch {
                    /* ignore */
                }
            } finally {
                postingRef.current = false;
            }
        })();
    }, [open, visible, markCelebrationSeen]);

    const createHref = `/${locale}/dashboard/commerce/products/new`;

    return (
        <Modal
            open={visible}
            title={t("title")}
            onCancel={() => setVisible(false)}
            footer={
                <Space wrap>
                    {storefrontPreviewUrl ? (
                        <Button href={storefrontPreviewUrl} target="_blank" rel="noopener noreferrer">
                            {t("view_storefront")}
                        </Button>
                    ) : null}
                    <Link href={createHref}>
                        <Button type="primary" onClick={() => setVisible(false)}>
                            {t("continue_publish")}
                        </Button>
                    </Link>
                </Space>
            }
            destroyOnHidden
        >
            {productName ? (
                <Typography.Paragraph strong style={{ marginBottom: 8 }}>
                    {productName}
                </Typography.Paragraph>
            ) : null}
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {t("visibility")}
            </Typography.Paragraph>
        </Modal>
    );
}
