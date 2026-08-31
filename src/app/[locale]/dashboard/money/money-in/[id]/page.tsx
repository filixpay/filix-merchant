"use client";

import { useCallback, useEffect, useState } from "react";
import { message, Skeleton } from "antd";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Copy,
  Info,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { ApiError, moneyProductApi, type MoneyInView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import MoneyAssetLabel from "@/components/money/MoneyAssetLabel";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { resolveMoneyInCheckoutUrl } from "@/lib/money/money-in-checkout-redirect";
import { moneyMoneyInPath } from "@/lib/money/money-in-redirect";
import { presentMoneyI18nLabel } from "@/lib/money/money-i18n-label";
import { presentMoneyMovementAmount } from "@/lib/money/money-movement-amount";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import { presentMoneyStatus, type MoneyStatusTone } from "@/lib/money/status-presenter";
import styles from "./money-in-detail.module.css";

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
  }).format(date);
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

export default function MoneyInDetailPage() {
  const t = useTranslations("MoneyIn");
  const tCommon = useTranslations("MoneyCommon");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const moneyInId = params?.id;
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [item, setItem] = useState<MoneyInView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const load = useCallback(async () => {
    if (!accessToken || !moneyInId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await moneyProductApi.getMoneyIn(moneyInId, accessToken);
      setItem(data);
    } catch (err) {
      if (!handleDashboardApiError(err)) {
        setError(err);
        setItem(null);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, moneyInId]);

  useEffect(() => {
    void load();
  }, [load]);

  const status = item ? presentMoneyStatus(item.status) : null;
  const checkoutUrl = item ? resolveMoneyInCheckoutUrl(item.nextAction) : null;
  const amountPresentation =
    item?.amount != null && item.assetCode
      ? presentMoneyMovementAmount({
          amount: item.amount,
          assetCode: item.assetCode,
          semantic: "inflow",
        })
      : null;
  const occurredAt = item ? formatDateTime(item.occurredAt ?? item.createdAt, locale) : "—";
  const statusLabel = status
    ? presentMoneyI18nLabel(tCommon, tCommon.has, "statuses", status.code)
    : "";

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      message.success(t("detail.copied"));
    } catch {
      message.error(t("detail.copy_failed"));
    }
  };

  return (
    <DashboardPage
      title={t("detail.title")}
      subtitle={t("detail.subtitle")}
      plain
      contentMode="overview"
      extra={
        <div className={styles.headerActions}>
          {checkoutUrl ? (
            <a className={styles.payBtn} href={checkoutUrl}>
              {t("detail.pay_cta")}
            </a>
          ) : null}
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => router.push(moneyMoneyInPath(locale))}
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            {t("detail.back")}
          </button>
        </div>
      }
    >
      {loading ? <Skeleton active paragraph={{ rows: 8 }} /> : null}

      {!loading && error ? (
        <div>
          <p className={styles.errorText}>{resolveErrorMessage(error)}</p>
          <button type="button" className={styles.retryBtn} onClick={() => void load()}>
            {t("retry")}
          </button>
        </div>
      ) : null}

      {!loading && !error && !item ? (
        <p className={styles.muted}>{t("detail.empty")}</p>
      ) : null}

      {!loading && item && status ? (
        <div className={styles.page}>
          <section className={styles.hero}>
            <div className={`${styles.heroGlow} ${toneClass("heroGlow", status.tone)}`} />
            <div className={`${styles.heroIcon} ${toneClass("heroIcon", status.tone)}`} aria-hidden>
              <StatusIcon tone={status.tone} />
            </div>
            <span className={styles.heroLabel}>{t("detail.hero_amount_label")}</span>
            <div className={`${styles.heroAmount} financial-amount`}>
              {amountPresentation && item.assetCode ? (
                <>
                  {amountPresentation.sign}
                  {amountPresentation.amountBody.endsWith(` ${item.assetCode}`)
                    ? amountPresentation.amountBody.slice(0, -(item.assetCode.length + 1))
                    : amountPresentation.amountBody}
                  <span className={styles.heroAsset}>{item.assetCode}</span>
                </>
              ) : amountPresentation ? (
                `${amountPresentation.sign ?? ""}${amountPresentation.amountBody}`
              ) : (
                "—"
              )}
            </div>
            <p className={styles.heroMeta}>
              {t("detail.hero_time", { time: occurredAt })}
            </p>
            <div className={`${styles.badge} ${toneClass("badge", status.tone)}`}>
              <span className={styles.badgeDot} />
              {status.tone === "success"
                ? t("detail.status_badge_success", { status: statusLabel })
                : status.tone === "warning"
                  ? t("detail.status_badge_processing", { status: statusLabel })
                  : status.tone === "danger"
                    ? t("detail.status_badge_failed", { status: statusLabel })
                    : statusLabel}
            </div>
          </section>

          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>{t("detail.section_basic")}</h3>
            <div className={styles.detailsGrid}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t("columns.id")}</span>
                <div className={styles.rowValue}>
                  <span className={styles.monoChip}>
                    <span>{item.moneyInId}</span>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      aria-label={t("detail.copy_id")}
                      onClick={() => void handleCopy(item.moneyInId)}
                    >
                      <Copy size={13} strokeWidth={2} />
                    </button>
                  </span>
                </div>
              </div>

              <div className={styles.row}>
                <span className={styles.rowLabel}>{t("columns.status")}</span>
                <div className={styles.rowValue}>{statusLabel || item.status}</div>
              </div>

              <div className={styles.row}>
                <span className={styles.rowLabel}>{t("columns.amount")}</span>
                <div className={`${styles.rowValue} ${styles.monoValue}`}>
                  {amountPresentation
                    ? `${amountPresentation.sign ?? ""}${amountPresentation.amountBody}`
                    : "—"}
                </div>
              </div>

              <div className={styles.row}>
                <span className={styles.rowLabel}>{t("columns.asset")}</span>
                <div className={styles.rowValue}>
                  {item.assetCode ? <MoneyAssetLabel assetCode={item.assetCode} /> : "—"}
                </div>
              </div>

              <div className={styles.row}>
                <span className={styles.rowLabel}>{t("columns.time")}</span>
                <div className={styles.rowValue}>{occurredAt}</div>
              </div>

              {item.fundingSessionId ? (
                <div className={styles.row}>
                  <span className={styles.rowLabel}>{t("detail.funding_session")}</span>
                  <div className={styles.rowValue}>
                    <span className={styles.monoChip}>
                      <span>{item.fundingSessionId}</span>
                      <button
                        type="button"
                        className={styles.copyBtn}
                        aria-label={t("detail.copy_funding_session")}
                        onClick={() => void handleCopy(item.fundingSessionId!)}
                      >
                        <Copy size={13} strokeWidth={2} />
                      </button>
                    </span>
                  </div>
                </div>
              ) : null}

              {item.updatedAt ? (
                <div className={styles.row}>
                  <span className={styles.rowLabel}>{t("detail.updated_at")}</span>
                  <div className={styles.rowValue}>{formatDateTime(item.updatedAt, locale)}</div>
                </div>
              ) : null}

              {item.failureReason ? (
                <div className={`${styles.row} ${styles.rowSpan}`}>
                  <span className={styles.rowLabel}>{t("detail.failure_reason")}</span>
                  <div className={styles.rowValue}>
                    <p className={styles.failureBox}>{item.failureReason}</p>
                  </div>
                </div>
              ) : null}

              {!checkoutUrl && item.status === "PROCESSING" ? (
                <div className={`${styles.row} ${styles.rowSpan}`}>
                  <span className={styles.rowLabel}>{t("detail.pay_unavailable")}</span>
                  <div className={styles.rowValue}>
                    <p className={styles.hintBox}>{t("detail.pay_unavailable_hint")}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <p className={styles.footerNote}>{t("detail.footer_hint")}</p>
        </div>
      ) : null}
    </DashboardPage>
  );
}
