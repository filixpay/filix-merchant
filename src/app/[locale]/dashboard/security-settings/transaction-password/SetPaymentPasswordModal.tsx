"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import {
    AlertCircle,
    ArrowRight,
    Check,
    CheckCircle2,
    Lock,
    Mail,
    ShieldCheck,
    X,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import OtpInput from "./OtpInput";
import { isPinCompleteAndValid, maskEmail } from "./transaction-password-model";
import styles from "./SetPaymentPasswordModal.module.css";

interface SetPaymentPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string, captcha: string) => Promise<void>;
    onSendCaptcha: () => Promise<void>;
    userEmail: string;
}

type Step = "verify" | "password" | "done";

export default function SetPaymentPasswordModal({
    isOpen,
    onClose,
    onConfirm,
    onSendCaptcha,
    userEmail,
}: SetPaymentPasswordModalProps) {
    const t = useTranslations("SecuritySettings.TransactionPassword");
    const locale = useLocale();
    const [step, setStep] = useState<Step>("verify");
    const [captcha, setCaptcha] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [captchaSent, setCaptchaSent] = useState(false);
    const [error, setError] = useState("");
    const [confirmPinShake, setConfirmPinShake] = useState(false);

    const merchantEmail = userEmail.trim();
    const hasMerchantEmail = Boolean(merchantEmail);
    const displayEmail = hasMerchantEmail ? maskEmail(merchantEmail) : "";
    const bindEmailHref = `/${locale}/dashboard/maintenance/contact`;
    const stepIndex = step === "verify" ? 1 : step === "password" ? 2 : 3;

    useEffect(() => {
        if (!isOpen) {
            setStep("verify");
            setCaptcha("");
            setPassword("");
            setConfirmPassword("");
            setCountdown(0);
            setCaptchaSent(false);
            setError("");
            setConfirmPinShake(false);
        }
    }, [isOpen]);

    const pinMatched =
        password.length === 6 && confirmPassword.length === 6 && password === confirmPassword;
    const pinMismatch =
        password.length === 6 && confirmPassword.length === 6 && password !== confirmPassword;
    const canSubmitPin = isPinCompleteAndValid(password) && pinMatched;

    useEffect(() => {
        if (!pinMismatch) {
            return;
        }
        setConfirmPinShake(true);
        const timer = window.setTimeout(() => setConfirmPinShake(false), 400);
        return () => window.clearTimeout(timer);
    }, [pinMismatch, confirmPassword]);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = window.setTimeout(() => setCountdown((prev) => prev - 1), 1000);
        return () => window.clearTimeout(timer);
    }, [countdown]);

    const handleSendCaptcha = async () => {
        if (!hasMerchantEmail || countdown > 0 || sending) return;
        setSending(true);
        setError("");
        try {
            await onSendCaptcha();
            setCaptchaSent(true);
            setCountdown(60);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : t("modal.send_failed"));
        } finally {
            setSending(false);
        }
    };

    const handleNext = () => {
        if (!hasMerchantEmail || captcha.length !== 6) return;
        setError("");
        setStep("password");
    };

    const handleSubmit = async () => {
        setError("");
        if (!canSubmitPin) {
            return;
        }

        setLoading(true);
        try {
            await onConfirm(password, captcha);
            setStep("done");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t("modal.set_failed"));
        } finally {
            setLoading(false);
        }
    };

    const footer =
        step === "verify" ? (
            <div className={styles.footer}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>
                    {t("modal.cancel_btn")}
                </button>
                <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={handleNext}
                    disabled={!hasMerchantEmail || captcha.length !== 6}
                >
                    {t("modal.next")}
                    <ArrowRight size={13} strokeWidth={2.5} />
                </button>
            </div>
        ) : step === "password" ? (
            <div className={styles.footer}>
                <button type="button" className={styles.cancelBtn} onClick={() => setStep("verify")}>
                    {t("modal.back")}
                </button>
                <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={() => void handleSubmit()}
                    disabled={loading || !canSubmitPin}
                >
                    <Lock size={13} strokeWidth={2.5} />
                    {loading ? `${t("modal.confirm_btn")}...` : t("modal.confirm_btn")}
                </button>
            </div>
        ) : (
            <div className={`${styles.footer} ${styles.footerCenter}`}>
                <button type="button" className={styles.primaryBtn} onClick={onClose}>
                    {t("modal.done")}
                </button>
            </div>
        );

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
            width={520}
            centered
            className={styles.modal}
            title={null}
            closable={false}
        >
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div className={styles.headerMain}>
                        <div className={styles.headerIcon} aria-hidden>
                            <ShieldCheck size={18} strokeWidth={2} />
                        </div>
                        <h3 className={styles.headerTitle}>{t("modal.title")}</h3>
                    </div>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label={t("modal.cancel_btn")}
                    >
                        <X size={16} strokeWidth={2} />
                    </button>
                </div>

                <div className={styles.stepBars} aria-hidden>
                    {[1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className={`${styles.stepBar}${stepIndex >= index ? ` ${styles.stepBarActive}` : ""}`}
                        />
                    ))}
                </div>
                <div className={styles.stepLabels}>
                    <span className={stepIndex >= 1 ? styles.stepLabelActive : undefined}>
                        1. {t("modal.step_verify")}
                    </span>
                    <span className={stepIndex >= 2 ? styles.stepLabelActive : undefined}>
                        2. {t("modal.step_password")}
                    </span>
                    <span className={stepIndex >= 3 ? styles.stepLabelActive : undefined}>
                        3. {t("modal.step_done")}
                    </span>
                </div>
            </div>

            <div className={styles.body}>
                {error && (
                    <div className={styles.errorBanner} role="alert">
                        <AlertCircle size={16} strokeWidth={2} />
                        <span>{error}</span>
                    </div>
                )}

                {step === "verify" && (
                    <>
                        <div>
                            <h4 className={styles.sectionTitle}>{t("modal.verify_title")}</h4>
                            <p className={styles.sectionDesc}>{t("modal.verify_desc")}</p>
                        </div>

                        {!hasMerchantEmail ? (
                            <div className={styles.warningBanner}>
                                <AlertCircle size={16} strokeWidth={2} />
                                <div>
                                    <p className={styles.warningTitle}>{t("modal.email_not_set_title")}</p>
                                    <p className={styles.warningDesc}>{t("modal.email_not_set_desc")}</p>
                                    <Link href={bindEmailHref} className={styles.bindLink} onClick={onClose}>
                                        {t("modal.bind_email_link")}
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.emailCard}>
                                <div className={styles.emailIcon} aria-hidden>
                                    <Mail size={15} strokeWidth={2} />
                                </div>
                                <div>
                                    <span className={styles.emailLabel}>{t("modal.send_to")}</span>
                                    <span className={styles.emailValue}>{displayEmail}</span>
                                </div>
                            </div>
                        )}

                        <div className={styles.captchaBlock}>
                            <label className={styles.captchaLabel}>
                                {t("modal.captcha")} <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.captchaRow}>
                                <OtpInput
                                    value={captcha}
                                    onChange={setCaptcha}
                                    disabled={!hasMerchantEmail}
                                />
                                <button
                                    type="button"
                                    className={styles.sendBtn}
                                    disabled={!hasMerchantEmail || countdown > 0 || sending}
                                    onClick={() => void handleSendCaptcha()}
                                >
                                    {countdown > 0
                                        ? t("modal.countdown_resend", { seconds: countdown })
                                        : t("modal.get_captcha")}
                                </button>
                            </div>
                            {captchaSent && hasMerchantEmail && (
                                <div className={styles.captchaSent}>
                                    <CheckCircle2 size={14} strokeWidth={2.5} />
                                    {t("modal.captcha_sent")}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {step === "password" && (
                    <>
                        <div>
                            <h4 className={styles.sectionTitle}>{t("modal.password_title")}</h4>
                            <p className={styles.sectionDesc}>{t("modal.password_desc")}</p>
                        </div>

                        <div className={styles.passwordField}>
                            <label className={styles.captchaLabel}>
                                {t("modal.payment_password")}{" "}
                                <span className={styles.required}>*</span>
                            </label>
                            <OtpInput
                                value={password}
                                onChange={setPassword}
                                masked
                                size="pin"
                                idPrefix="txn-pin"
                                ariaLabel={t("modal.payment_password")}
                            />
                            <div className={styles.pinRules}>
                                <span
                                    className={
                                        password.length === 6 ? styles.pinRuleMet : styles.pinRule
                                    }
                                >
                                    <Check size={12} strokeWidth={2.5} aria-hidden />
                                    {t("modal.pin_rule_length")}
                                </span>
                                <span
                                    className={
                                        isPinCompleteAndValid(password)
                                            ? styles.pinRuleMet
                                            : styles.pinRule
                                    }
                                >
                                    <Check size={12} strokeWidth={2.5} aria-hidden />
                                    {t("modal.pin_rule_pattern")}
                                </span>
                            </div>
                        </div>

                        <div className={`${styles.passwordField} ${styles.confirmPinSection}`}>
                            <label className={styles.captchaLabel}>
                                {t("modal.confirm_password")}{" "}
                                <span className={styles.required}>*</span>
                            </label>
                            <OtpInput
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                masked
                                size="pin"
                                variant={pinMismatch ? "error" : "default"}
                                shake={confirmPinShake}
                                idPrefix="txn-pin-confirm"
                                ariaLabel={t("modal.confirm_password")}
                            />
                            {pinMismatch ? (
                                <p className={styles.mismatchHint} role="alert">
                                    <AlertCircle size={12} strokeWidth={2.5} aria-hidden />
                                    {t("modal.mismatch_inline")}
                                </p>
                            ) : null}
                        </div>
                    </>
                )}

                {step === "done" && (
                    <div className={styles.successBlock}>
                        <div className={styles.successIcon} aria-hidden>
                            <CheckCircle2 size={28} strokeWidth={2} />
                        </div>
                        <h4 className={styles.successTitle}>{t("modal.success_title")}</h4>
                        <p className={styles.successDesc}>
                            {t("modal.success")}
                            <br />
                            {t("modal.success_desc")}
                        </p>
                    </div>
                )}
            </div>

            {footer}
        </Modal>
    );
}
