"use client";

import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "antd";
import {
    AlertTriangle,
    ArrowUpRight,
    KeyRound,
    Lock,
    Mail,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSession, signIn } from "next-auth/react";
import { api, ApiError, MerchantDetailView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import SetPaymentPasswordModal from "./SetPaymentPasswordModal";
import { maskEmail } from "./transaction-password-model";
import styles from "./transaction-password-page.module.css";

export default function TransactionPasswordPage() {
    const t = useTranslations("SecuritySettings.TransactionPassword");
    const locale = useLocale();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [merchant, setMerchant] = useState<MerchantDetailView | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isPinSet, setIsPinSet] = useState(false);

    const bindEmailHref = `/${locale}/dashboard/maintenance/contact`;

    const loadMerchantInfo = useCallback(async () => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const data = await api.merchants.getDetail(accessToken);
            setMerchant(data);
        } catch (err) {
            console.error(err);
            if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
                signIn();
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            loadMerchantInfo();
        }
    }, [accessToken, loadMerchantInfo]);

    const userEmail = merchant?.email?.trim() ?? "";
    const isEmailBound = Boolean(userEmail);
    const maskedEmail = isEmailBound ? maskEmail(userEmail) : "";
    const securityTips = t.raw("security_tips") as string[];

    const handleSendCaptcha = useCallback(async () => {
        if (!accessToken) return;
        await api.security.sendCaptcha(accessToken);
    }, [accessToken]);

    const handleConfirm = useCallback(
        async (password: string, captcha: string) => {
            if (!accessToken) return;
            await api.security.setPaymentPassword(
                {
                    captcha,
                    password,
                    codeType: "MERCHANT_SECURITY_PPEMTCVALID_EMAIL",
                },
                accessToken,
            );
            setIsPinSet(true);
        },
        [accessToken],
    );

    if (loading) {
        return (
            <DashboardPage title={t("title")} subtitle={t("subtitle")}>
                <Skeleton active paragraph={{ rows: 6 }} />
            </DashboardPage>
        );
    }

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} plain>
            <div className={styles.layout}>
                <div className={styles.mainColumn}>
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <Mail size={16} strokeWidth={2} className={styles.cardTitleIcon} />
                                {t("account_section")}
                            </h2>
                            {!isEmailBound && (
                                <span className={styles.tagWarning}>
                                    <AlertTriangle size={12} strokeWidth={2.5} />
                                    {t("email_bind_required_tag")}
                                </span>
                            )}
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoTile}>
                                <span className={styles.infoLabel}>{t("merchant_name")}</span>
                                <span className={styles.infoValue}>{merchant?.name || "-"}</span>
                            </div>

                            <div className={styles.infoTileRow}>
                                <div>
                                    <span className={styles.infoLabel}>{t("bound_email_label")}</span>
                                    {isEmailBound ? (
                                        <span className={styles.infoValueMono}>{maskedEmail}</span>
                                    ) : (
                                        <span className={styles.infoValueMuted}>{t("email_unbound")}</span>
                                    )}
                                </div>
                                {!isEmailBound && (
                                    <Link href={bindEmailHref} className={styles.bindLink}>
                                        {t("bind_email_now")}
                                        <ArrowUpRight size={13} strokeWidth={2.5} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>
                                <KeyRound size={16} strokeWidth={2} className={styles.cardTitleIcon} />
                                {t("password_status_title")}
                            </h2>
                            <span className={isPinSet ? styles.tagSuccess : styles.tagNeutral}>
                                {isPinSet ? t("password_status_active") : t("password_status_unset")}
                            </span>
                        </div>

                        <div className={styles.passwordBody}>
                            <div className={styles.passwordCopy}>
                                <p className={styles.passwordDesc}>
                                    {t("password_desc_prefix")}
                                    <span className={styles.passwordDescStrong}>
                                        {t("password_desc_highlight")}
                                    </span>
                                    {t("password_desc_suffix")}
                                </p>
                                <div className={styles.pinDots} aria-hidden>
                                    {[...Array(6)].map((_, index) => (
                                        <span
                                            key={index}
                                            className={`${styles.pinDot}${isPinSet ? ` ${styles.pinDotActive}` : ""}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                className={styles.primaryBtn}
                                onClick={() => setShowModal(true)}
                            >
                                <Lock size={14} strokeWidth={2.5} />
                                {isPinSet ? t("change_password_btn") : t("set_password_btn")}
                            </button>
                        </div>
                    </section>
                </div>

                <aside className={styles.tipsPanel}>
                    <div className={styles.tipsHeader}>
                        <ShieldCheck size={18} strokeWidth={2} className={styles.tipsHeaderIcon} />
                        {t("security_tips_title")}
                    </div>
                    <ul className={styles.tipsList}>
                        {securityTips.map((tip, index) => (
                            <li key={index} className={styles.tipsItem}>
                                <span className={styles.tipsBullet} aria-hidden />
                                {index === 1 ? (
                                    <span>
                                        {t("security_tip_weak_before")}
                                        <code className={styles.code}>{t("weak_pin_example_1")}</code>
                                        {t("security_tip_weak_sep")}
                                        <code className={styles.code}>{t("weak_pin_example_2")}</code>
                                        {t("security_tip_weak_after")}
                                    </span>
                                ) : (
                                    <span>{tip}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>

            {accessToken ? (
                <SetPaymentPasswordModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleConfirm}
                    onSendCaptcha={handleSendCaptcha}
                    userEmail={userEmail}
                />
            ) : null}
        </DashboardPage>
    );
}
