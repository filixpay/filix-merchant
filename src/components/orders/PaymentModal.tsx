"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Clock3,
    Copy,
    ExternalLink,
    Mail,
    Share2,
} from "lucide-react";
import { Button, Modal, message } from "antd";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import {
    formatPaymentExpiryCountdown,
    parsePaymentLinkExpiry,
    type PaymentActionOrder,
} from "./order-action-model";
import styles from "./PaymentModal.module.css";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    paymentLink: string;
    order: PaymentActionOrder | null;
}

function WhatsAppIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
            />
        </svg>
    );
}

export default function PaymentModal({ isOpen, onClose, paymentLink, order }: PaymentModalProps) {
    const t = useTranslations("Orders");
    const tCommon = useTranslations("Common");
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setNow(Date.now());
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [isOpen, paymentLink]);

    const expiry = useMemo(
        () => parsePaymentLinkExpiry(paymentLink, now),
        [paymentLink, now],
    );

    if (!order) {
        return null;
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(paymentLink);
            message.success(t("payment_modal.copy_success"));
        } catch {
            message.error(tCommon("error"));
        }
    };

    const handleShareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: t("payment_modal.title"),
                    text: t("payment_modal.share_text"),
                    url: paymentLink,
                });
                return;
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
            }
        }

        await handleCopyLink();
    };

    const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
        `${tCommon("app_name" as never) || "FilixPay"} - ${t("payment_modal.share_text")}: ${paymentLink}`,
    )}`;
    const emailHref = `mailto:?subject=${encodeURIComponent(t("payment_modal.title"))}&body=${encodeURIComponent(paymentLink)}`;

    const formattedAmount = order.totalAmount?.amount?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const expiryClassName = [
        styles.expiry,
        expiry.kind === "countdown" ? styles.expiryWarning : "",
        expiry.kind === "expired" ? styles.expiryExpired : "",
    ]
        .filter(Boolean)
        .join(" ");

    const expiryLabel = (() => {
        if (expiry.kind === "long_lived") {
            return t("payment_modal.expires_long_lived");
        }
        if (expiry.kind === "expired" && expiry.expiresAt) {
            return t("payment_modal.expires_expired");
        }
        if (expiry.kind === "countdown" && expiry.expiresAt) {
            return t("payment_modal.expires_countdown", {
                time: formatPaymentExpiryCountdown(expiry.expiresAt, now),
            });
        }
        if (expiry.expiresAt) {
            return t("payment_modal.expires_at", {
                time: expiry.expiresAt.toLocaleString(),
            });
        }
        return t("payment_modal.expires_long_lived");
    })();

    return (
        <Modal
            title={t("payment_modal.title")}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={440}
            centered
            destroyOnHidden
            className={styles.modal}
        >
            <div className={styles.body}>
                <div className={styles.amountSection}>
                    <span className={styles.amountLabel}>{t("payment_modal.amount_to_pay")}</span>
                    <p className={styles.amountValue}>
                        <span className={styles.currency}>{order.totalAmount?.currency}</span>
                        <span>{formattedAmount}</span>
                    </p>
                </div>

                <div className={styles.qrSection}>
                    <div className={styles.qrFrame}>
                        <QRCodeSVG
                            value={paymentLink}
                            size={196}
                            level="H"
                            fgColor="#0f172a"
                            bgColor="#ffffff"
                            imageSettings={{
                                src: "/icon.png",
                                height: 40,
                                width: 40,
                                excavate: true,
                            }}
                        />
                    </div>
                    <div className={expiryClassName}>
                        <Clock3 size={14} aria-hidden="true" />
                        <span>{expiryLabel}</span>
                    </div>
                </div>

                <Button
                    block
                    type="primary"
                    size="large"
                    icon={<Copy size={16} />}
                    className={styles.primaryAction}
                    onClick={handleCopyLink}
                >
                    {t("payment_modal.copy_link_primary")}
                </Button>

                <div className={styles.quickSend}>
                    <span className={styles.quickSendLabel}>{t("payment_modal.quick_send_label")}</span>
                    <div className={styles.channelGrid}>
                        <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.channelChip}
                        >
                            <span className={`${styles.channelIcon} ${styles.channelIconWhatsapp}`}>
                                <WhatsAppIcon />
                            </span>
                            <span>{t("payment_modal.share_whatsapp")}</span>
                        </a>
                        <a href={emailHref} className={styles.channelChip}>
                            <span className={`${styles.channelIcon} ${styles.channelIconEmail}`}>
                                <Mail size={16} aria-hidden="true" />
                            </span>
                            <span>{t("payment_modal.share_email")}</span>
                        </a>
                        <button type="button" className={styles.channelChip} onClick={handleShareLink}>
                            <span className={`${styles.channelIcon} ${styles.channelIconShare}`}>
                                <Share2 size={16} aria-hidden="true" />
                            </span>
                            <span>{t("payment_modal.share_more")}</span>
                        </button>
                    </div>
                </div>

                <a href={paymentLink} className={styles.previewLink}>
                    <ExternalLink size={14} aria-hidden="true" />
                    {t("payment_modal.preview_checkout")}
                </a>
            </div>
        </Modal>
    );
}
