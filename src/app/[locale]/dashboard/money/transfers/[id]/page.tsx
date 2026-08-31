"use client";

import { useCallback, useEffect, useState } from "react";
import { message, Skeleton } from "antd";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  Info,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { ApiError, moneyProductApi, type MoneyTransferView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import { moneyTransfersPath } from "@/lib/money/money-transfers-redirect";
import { presentMoneyI18nLabel } from "@/lib/money/money-i18n-label";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import { presentMoneyStatus, type MoneyStatusTone } from "@/lib/money/status-presenter";
import styles from "./transfer-detail.module.css";

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const data = error.data as { reasonCode?: string } | undefined;
    return presentMoneyProductError({
      reasonCode: data?.reasonCode,
      code: error.code,
      message: error.message,
    });
  }
  return presentMoneyProductError({});
}

function formatDateTime(value: string | null, locale: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset",
  }).format(date);
}

function currencyDisplayName(assetCode: string, locale: string): string | null {
  try {
    return new Intl.DisplayNames([locale], { type: "currency" }).of(assetCode) ?? null;
  } catch {
    return null;
  }
}

function ownerTypeKey(ownerType: string | undefined): "MERCHANT" | "CUSTOMER" | "UNKNOWN" {
  const normalized = ownerType?.trim().toUpperCase() ?? "";
  if (normalized === "MERCHANT") return "MERCHANT";
  if (normalized === "CUSTOMER" || normalized === "PERSON" || normalized === "INDIVIDUAL") {
    return "CUSTOMER";
  }
  return "UNKNOWN";
}

function toneClass(prefix: "heroGlow" | "heroIcon" | "badge", tone: MoneyStatusTone): string {
  const suffix =
    tone === "success"
      ? "Success"
      : tone === "warning"
        ? "Warning"
        : tone === "danger"
          ? "Danger"
          : "Neutral";
  return styles[`${prefix}${suffix}` as keyof typeof styles] as string;
}

function StatusIcon({ tone }: { tone: MoneyStatusTone }) {
  if (tone === "success") return <CheckCircle2 size={28} strokeWidth={2.2} />;
  if (tone === "warning") return <Clock3 size={26} strokeWidth={2.2} />;
  if (tone === "danger") return <AlertCircle size={26} strokeWidth={2.2} />;
  return <Info size={26} strokeWidth={2.2} />;
}

/** Detail page — shows CLEARED/COMPLETED truthfully; no continue CTA (TR-DEC-016). */
export default function MoneyTransferDetailPage() {
  const t = useTranslations("MoneyTransfers");
  const tCommon = useTranslations("MoneyCommon");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const transferId = params?.id;
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [item, setItem] = useState<MoneyTransferView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const load = useCallback(async () => {
    if (!accessToken || !transferId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await moneyProductApi.getTransfer(transferId, accessToken);
      setItem(data);
    } catch (err) {
      if (!handleDashboardApiError(err)) {
        setError(err);
        setItem(null);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, transferId]);

  useEffect(() => {
    void load();
  }, [load]);

  const status = item ? presentMoneyStatus(item.status) : null;
  const assetCode = item?.assetCode?.trim().toUpperCase() || "";
  const amountParts =
    item?.amount && assetCode ? formatWalletAmountDisplay(item.amount, assetCode, locale) : null;
  const assetName = assetCode ? currencyDisplayName(assetCode, locale) : null;
  const counterparty = item?.counterparty;
  const counterpartyId = counterparty
    ? `${counterparty.ownerType}:${counterparty.ownerId}`
    : "";
  const ownerKey = ownerTypeKey(counterparty?.ownerType);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      message.success(t("copied"));
    } catch {
      message.error(t("copyFailed"));
    }
  };

  const statusLabel = status
    ? presentMoneyI18nLabel(tCommon, tCommon.has, "statuses", status.code)
    : "";

  return (
    <DashboardPage
      title={t("detailTitle")}
      subtitle={t("detailSubtitle")}
      plain
      extra={
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.push(moneyTransfersPath(locale))}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          {t("backToList")}
        </button>
      }
    >
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : null}
      {!loading && error ? <p className={styles.errorText}>{resolveErrorMessage(error)}</p> : null}

      {!loading && item && status ? (
        <div className={styles.page}>
          <section className={styles.hero}>
            <div className={`${styles.heroGlow} ${toneClass("heroGlow", status.tone)}`} />
            <div className={`${styles.heroIcon} ${toneClass("heroIcon", status.tone)}`} aria-hidden>
              <StatusIcon tone={status.tone} />
            </div>
            <span className={styles.heroLabel}>
              {t("heroAmountLabel", { asset: assetCode || "—" })}
            </span>
            <div className={`${styles.heroAmount} financial-amount`}>
              {amountParts ? (
                <>
                  {amountParts.symbol ? `${amountParts.symbol} ` : null}
                  {amountParts.amount}
                  <span className={styles.heroAsset}>{amountParts.assetCode}</span>
                </>
              ) : (
                "—"
              )}
            </div>
            <div className={`${styles.badge} ${toneClass("badge", status.tone)}`}>
              <span className={styles.badgeDot} />
              {status.tone === "success"
                ? t("statusBadgeSuccess", { status: statusLabel, code: status.code })
                : statusLabel}
            </div>
          </section>

          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>{t("detailSectionTitle")}</h3>

            <div className={styles.row}>
              <span className={styles.rowLabel}>{t("fields.transferId")}</span>
              <div className={styles.rowValue}>
                <span className={styles.monoChip}>
                  <span>{item.transferId}</span>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    aria-label={t("copyId")}
                    onClick={() => void handleCopy(item.transferId)}
                  >
                    <Copy size={13} strokeWidth={2} />
                  </button>
                </span>
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLabel}>{t("fields.counterparty")}</span>
              <div className={styles.rowValue}>
                {counterparty ? (
                  <>
                    <span className={styles.ownerTag}>
                      <Building2 size={12} strokeWidth={2.5} />
                      {ownerKey === "MERCHANT"
                        ? t("ownerType.MERCHANT")
                        : ownerKey === "CUSTOMER"
                          ? t("ownerType.CUSTOMER")
                          : t("ownerType.UNKNOWN")}
                    </span>
                    <span className={styles.monoChip}>
                      <span>{counterparty.ownerId}</span>
                      <button
                        type="button"
                        className={styles.copyBtn}
                        aria-label={t("copyCounterparty")}
                        onClick={() => void handleCopy(counterpartyId)}
                      >
                        <Copy size={13} strokeWidth={2} />
                      </button>
                    </span>
                  </>
                ) : (
                  <span className={styles.muted}>—</span>
                )}
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLabel}>{t("fields.settlementAsset")}</span>
              <div className={styles.rowValue}>
                {assetCode
                  ? assetName
                    ? `${assetCode} (${assetName})`
                    : assetCode
                  : "—"}
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLabel}>{t("fields.completedAt")}</span>
              <div className={styles.rowValue}>
                {formatDateTime(item.occurredAt ?? item.createdAt, locale)}
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLabel}>{t("fields.reasonCode")}</span>
              <div className={styles.rowValue}>
                {item.reasonCode ? (
                  item.reasonCode
                ) : (
                  <span className={styles.muted}>{t("reasonNone")}</span>
                )}
              </div>
            </div>
          </section>

          <p className={styles.footerNote}>
            {status.tone === "success" ? t("detailHintCleared") : t("detailHint")}
          </p>
        </div>
      ) : null}
    </DashboardPage>
  );
}
