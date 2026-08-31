"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Spin, message } from "antd";
import { signIn, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Copy, Edit3, Info, Mail, RefreshCw, TriangleAlert } from "lucide-react";
import { api, ApiError, type MerchantDetailView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import {
    canUpgradeToFormal,
    isTrialMerchant,
    resolveMerchantTier,
} from "@/lib/merchant/merchant-tier";
import styles from "./profile-page.module.css";

function alreadyMasked(value: string): boolean {
    return value.includes("*");
}

function maskEmail(value?: string | null): string | null {
    if (!value) return null;
    if (alreadyMasked(value)) return value;
    const at = value.indexOf("@");
    if (at <= 1) return "***";
    return `${value[0]}***${value.slice(at)}`;
}

function maskPhone(value?: string | null): string | null {
    if (!value) return null;
    if (alreadyMasked(value)) return value;
    if (value.length < 7) return "***";
    return `${value.slice(0, 3)}****${value.slice(-4)}`;
}

function maskId(value?: string | null): string | null {
    if (!value) return null;
    if (alreadyMasked(value)) return value;
    if (value.length <= 4) return "****";
    return `${"*".repeat(Math.max(value.length - 4, 4))}${value.slice(-4)}`;
}

function formatDateTime(value?: string | null): string | null {
    return value ? new Date(value).toLocaleString() : null;
}

function localizedEnum(
    t: (key: string) => string,
    has: (key: string) => boolean,
    group: "customerStatus" | "merchantType" | "merchantTier" | "officialIdType" | "accountOpeningStatus",
    value?: string | null,
): string | null {
    if (!value) return null;
    const key = `profile.${group}.${value}`;
    return has(key) ? t(key) : value;
}

type ProfileDetail = MerchantDetailView & {
    mobile?: string;
    phone?: string;
    idCountry?: string;
    address?: string;
};

function CopyIdChip({
    value,
    onCopy,
    ariaLabel,
}: {
    value: string;
    onCopy: (value: string) => void;
    ariaLabel: string;
}) {
    return (
        <div className={styles.idChip}>
            <span>{value}</span>
            <button
                type="button"
                className={styles.copyBtn}
                aria-label={ariaLabel}
                onClick={() => onCopy(value)}
            >
                <Copy size={13} strokeWidth={2} />
            </button>
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className={styles.field}>
            <span className={styles.fieldLabel}>{label}</span>
            <div className={styles.fieldContent}>{children}</div>
        </div>
    );
}

function EmptyValue({
    label,
    actionHref,
    actionLabel,
}: {
    label: string;
    actionHref?: string;
    actionLabel?: string;
}) {
    return (
        <span className={styles.fieldValueMuted}>
            {label}
            {actionHref && actionLabel ? (
                <>
                    {" "}
                    <Link href={actionHref} className={styles.inlineAction}>
                        {actionLabel}
                    </Link>
                </>
            ) : null}
        </span>
    );
}

function StatusBadge({
    label,
    tone,
}: {
    label: string;
    tone: "active" | "suspended" | "default";
}) {
    const toneClass =
        tone === "active"
            ? styles.statusBadgeActive
            : tone === "suspended"
              ? styles.statusBadgeSuspended
              : styles.statusBadgeDefault;

    return (
        <span className={toneClass}>
            <span className={styles.statusDot} />
            {label}
        </span>
    );
}

export default function MerchantProfilePage() {
    const t = useTranslations("Maintenance");
    const locale = useLocale();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [detail, setDetail] = useState<ProfileDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await api.merchants.getDetail(accessToken);
            setDetail(data as ProfileDetail);
        } catch (err) {
            message.error(err instanceof ApiError ? err.message : t("errors.generic"));
            setDetail(null);
        } finally {
            setLoading(false);
        }
    }, [accessToken, t]);

    useEffect(() => {
        if (!accessToken) {
            signIn();
            return;
        }
        load();
    }, [accessToken, load]);

    const handleCopy = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            message.success(t("profile.copySuccess"));
        } catch {
            message.error(t("errors.generic"));
        }
    };

    const displayMobile = detail?.mobile || detail?.phone;
    const tier = resolveMerchantTier(detail);
    const hasMessage = (key: string) => t.has(key);
    const emptyLabel = t("profile.notProvidedPending");
    const contactHref = `/${locale}/dashboard/maintenance/contact`;
    const changesHref = `/${locale}/dashboard/maintenance/changes`;

    const statusLabel = localizedEnum(t, hasMessage, "customerStatus", detail?.customerStatus);
    const statusTone =
        detail?.customerStatus === "ACTIVE"
            ? "active"
            : detail?.customerStatus === "SUSPENDED" || detail?.customerStatus === "RISK_FROZEN"
              ? "suspended"
              : "default";

    const merchantTypeLabel = localizedEnum(t, hasMessage, "merchantType", detail?.merchantType);
    const merchantTierLabel = localizedEnum(t, hasMessage, "merchantTier", tier);
    const settlementModeLabel = detail?.settlementMode
        ? t(`profile.settlementMode.${detail.settlementMode}`)
        : null;

    const idCountryLabel = detail?.idCountry
        ? hasMessage(`countries.${detail.idCountry}`)
            ? t(`countries.${detail.idCountry}`)
            : detail.idCountry
        : null;

    const idTypeLabel = localizedEnum(t, hasMessage, "officialIdType", detail?.officialIdType);
    const idNumberLabel = maskId(detail?.officialIdNumber);
    const hasIdCredentials = Boolean(idTypeLabel || idNumberLabel);

    const emailLabel = maskEmail(detail?.email);
    const phoneLabel = maskPhone(displayMobile);
    const bankAccountsHref = `/${locale}/dashboard/bank-accounts`;

    const accountOpeningLabel = localizedEnum(
        t,
        hasMessage,
        "accountOpeningStatus",
        detail?.accountOpeningStatus,
    );

    const pageActions = (
        <div className={styles.actions}>
            <button type="button" className={styles.actionBtn} onClick={load} disabled={loading}>
                <RefreshCw size={13} strokeWidth={2} />
                {t("refresh")}
            </button>
            <Link href={contactHref} className={styles.actionBtn}>
                <Mail size={13} strokeWidth={2} />
                {t("profileGoContact")}
            </Link>
            {isTrialMerchant(detail) ? (
                <Link
                    href={`/${locale}/dashboard/onboarding/apply${
                        canUpgradeToFormal(detail) ? "?type=UPGRADE" : ""
                    }`}
                    className={styles.actionBtnPrimary}
                >
                    {t("profileGoOnboarding")}
                </Link>
            ) : (
                <Link href={changesHref} className={styles.actionBtnPrimary}>
                    <Edit3 size={13} strokeWidth={2} />
                    {t("profileGoChanges")}
                </Link>
            )}
        </div>
    );

    return (
        <DashboardPage
            title={t("profileTitle")}
            subtitle={t("profileSubtitle")}
            extra={pageActions}
            plain
        >
            <div className={styles.page}>
                {isTrialMerchant(detail) ? (
                    <div className={styles.hintBannerWarning}>
                        <TriangleAlert size={14} className={styles.hintIconWarning} strokeWidth={2} />
                        <span>{t("profileTrialHint")}</span>
                    </div>
                ) : (
                    <div className={styles.hintBanner}>
                        <Info size={14} className={styles.hintIconInfo} strokeWidth={2} />
                        <span>{t("profileReadOnlyHint")}</span>
                    </div>
                )}

                {loading ? (
                    <div className={styles.loadingWrap}>
                        <Spin size="large" />
                    </div>
                ) : detail ? (
                    <section className={styles.board}>
                        <div className={styles.boardHeader}>
                            <h2 className={styles.boardTitle}>{t("profile.detailTitle")}</h2>
                            {statusLabel ? (
                                <StatusBadge label={statusLabel} tone={statusTone} />
                            ) : null}
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>{t("profile.sections.identityStatus")}</h3>
                            <div className={styles.fieldGrid}>
                                <Field label={t("profile.fields.name")}>
                                    {detail.name ? (
                                        <span className={styles.fieldValue}>{detail.name}</span>
                                    ) : (
                                        <EmptyValue label={emptyLabel} />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.alias")}>
                                    {detail.alias ? (
                                        <span className={styles.fieldValueMedium}>{detail.alias}</span>
                                    ) : (
                                        <EmptyValue label={emptyLabel} />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.merchantTypeTier")}>
                                    {merchantTypeLabel || merchantTierLabel ? (
                                        <span className={styles.fieldValueMedium}>
                                            {merchantTypeLabel || emptyLabel}
                                            {merchantTierLabel ? (
                                                <>
                                                    <span className={styles.fieldDivider}>|</span>
                                                    <span className={styles.tierAccent}>{merchantTierLabel}</span>
                                                </>
                                            ) : null}
                                        </span>
                                    ) : (
                                        <EmptyValue label={emptyLabel} />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.settlementMode")}>
                                    {settlementModeLabel ? (
                                        <span className={styles.modeBadge}>{settlementModeLabel}</span>
                                    ) : (
                                        <EmptyValue label={emptyLabel} />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.id")}>
                                    {detail.id ? (
                                        <CopyIdChip
                                            value={String(detail.id)}
                                            onCopy={handleCopy}
                                            ariaLabel={t("profile.copyId")}
                                        />
                                    ) : (
                                        <EmptyValue label={emptyLabel} />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.code")}>
                                    {detail.code != null ? (
                                        <CopyIdChip
                                            value={String(detail.code)}
                                            onCopy={handleCopy}
                                            ariaLabel={t("profile.copyCode")}
                                        />
                                    ) : (
                                        <EmptyValue label={emptyLabel} />
                                    )}
                                </Field>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>{t("profile.sections.entityAccount")}</h3>
                            <div className={styles.fieldGrid}>
                                <Field label={t("profile.fields.idCountry")}>
                                    {idCountryLabel ? (
                                        <span className={styles.fieldValueMedium}>{idCountryLabel}</span>
                                    ) : (
                                        <EmptyValue
                                            label={emptyLabel}
                                            actionHref={isTrialMerchant(detail) ? undefined : changesHref}
                                            actionLabel={
                                                isTrialMerchant(detail) ? undefined : t("profile.goSupplement")
                                            }
                                        />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.accountOpeningStatus")}>
                                    {accountOpeningLabel ? (
                                        <span className={styles.fieldValueMedium}>{accountOpeningLabel}</span>
                                    ) : (
                                        <EmptyValue label={emptyLabel} />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.idTypeNumber")}>
                                    {hasIdCredentials ? (
                                        <span className={styles.fieldValueMedium}>
                                            {idTypeLabel || emptyLabel}
                                            {idNumberLabel ? (
                                                <>
                                                    <span className={styles.fieldDivider}>·</span>
                                                    <span className={styles.monoTime}>{idNumberLabel}</span>
                                                </>
                                            ) : null}
                                        </span>
                                    ) : (
                                        <EmptyValue
                                            label={emptyLabel}
                                            actionHref={isTrialMerchant(detail) ? undefined : changesHref}
                                            actionLabel={
                                                isTrialMerchant(detail) ? undefined : t("profile.goSupplement")
                                            }
                                        />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.createdAt")}>
                                    {formatDateTime(detail.createdAt) ? (
                                        <span className={styles.monoTime}>
                                            {formatDateTime(detail.createdAt)}
                                        </span>
                                    ) : (
                                        <EmptyValue label={emptyLabel} />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.updatedAt")}>
                                    {formatDateTime(detail.updatedAt) ? (
                                        <span className={styles.monoTime}>
                                            {formatDateTime(detail.updatedAt)}
                                        </span>
                                    ) : (
                                        <EmptyValue label={emptyLabel} />
                                    )}
                                </Field>
                            </div>
                        </div>

                        <div className={`${styles.section} ${styles.sectionLast}`}>
                            <h3 className={styles.sectionTitle}>{t("profile.sections.contactSettlement")}</h3>
                            <div className={styles.fieldGrid}>
                                <Field label={t("profile.fields.email")}>
                                    {emailLabel ? (
                                        <span className={styles.fieldValueMedium}>{emailLabel}</span>
                                    ) : (
                                        <EmptyValue
                                            label={emptyLabel}
                                            actionHref={contactHref}
                                            actionLabel={t("profile.goSupplement")}
                                        />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.mobile")}>
                                    {phoneLabel ? (
                                        <span className={styles.fieldValueMedium}>{phoneLabel}</span>
                                    ) : (
                                        <EmptyValue
                                            label={emptyLabel}
                                            actionHref={contactHref}
                                            actionLabel={t("profile.goSupplement")}
                                        />
                                    )}
                                </Field>

                                <Field label={t("profile.fields.bankAccount")}>
                                    <Link href={bankAccountsHref} className={styles.inlineAction}>
                                        {t("profile.goBankAccounts")}
                                    </Link>
                                </Field>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className={`${styles.board} ${styles.emptyWrap}`}>
                        <div className={styles.section}>
                            <EmptyValue label={t("profileNotFound")} />
                        </div>
                    </div>
                )}
            </div>
        </DashboardPage>
    );
}
