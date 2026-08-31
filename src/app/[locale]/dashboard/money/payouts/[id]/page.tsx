"use client";

import { useCallback, useEffect, useState } from "react";
import { message, Skeleton } from "antd";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileText,
  Info,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { ApiError, moneyProductApi, type MoneyPayoutView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import { moneyPayoutsPath } from "@/lib/money/money-payouts-redirect";
import { presentMoneyI18nLabel } from "@/lib/money/money-i18n-label";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import {
  formatMaskedAccountNumber,
  presentPayoutTimeline,
  type PayoutTimelineStepState,
} from "@/lib/money/payout-timeline";
import { presentMoneyStatus, type MoneyStatusTone } from "@/lib/money/status-presenter";
import styles from "./payout-detail.module.css";

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

function currencyDisplayName(assetCode: string, locale: string): string | null {
  try {
    return new Intl.DisplayNames([locale], { type: "currency" }).of(assetCode) ?? null;
  } catch {
    return null;
  }
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

function TimelineNode({
  state,
  stepNumber,
}: {
  state: PayoutTimelineStepState;
  stepNumber: number;
}) {
  if (state === "done") {
    return (
      <div className={`${styles.timelineNode} ${styles.timelineNodeDone}`} aria-hidden>
        <Check size={14} strokeWidth={2.5} />
      </div>
    );
  }
  if (state === "current") {
    return (
      <div className={`${styles.timelineNode} ${styles.timelineNodeCurrent}`} aria-hidden>
        <Clock3 size={14} strokeWidth={2.2} />
      </div>
    );
  }
  if (state === "failed") {
    return (
      <div className={`${styles.timelineNode} ${styles.timelineNodeFailed}`} aria-hidden>
        <X size={14} strokeWidth={2.5} />
      </div>
    );
  }
  return (
    <div className={`${styles.timelineNode} ${styles.timelineNodeUpcoming}`} aria-hidden>
      {stepNumber}
    </div>
  );
}

function stepClass(state: PayoutTimelineStepState): string {
  if (state === "current") return styles.timelineStepCurrent;
  if (state === "failed") return styles.timelineStepFailed;
  if (state === "upcoming") return styles.timelineStepUpcoming;
  return "";
}

export default function MoneyPayoutDetailPage() {
  const t = useTranslations("MoneyPayouts");
  const tCommon = useTranslations("MoneyCommon");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const payoutId = params?.id;
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [item, setItem] = useState<MoneyPayoutView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const load = useCallback(async () => {
    if (!accessToken || !payoutId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await moneyProductApi.getPayout(payoutId, accessToken);
      setItem(data);
    } catch (err) {
      if (!handleDashboardApiError(err)) {
        setError(err);
        setItem(null);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, payoutId]);

  useEffect(() => {
    void load();
  }, [load]);

  const status = item ? presentMoneyStatus(item.status) : null;
  const assetCode = item?.assetCode?.trim().toUpperCase() || "";
  const amountParts =
    item?.amount && assetCode ? formatWalletAmountDisplay(item.amount, assetCode, locale) : null;
  const assetName = assetCode ? currencyDisplayName(assetCode, locale) : null;
  const timeline = item ? presentPayoutTimeline(item.status) : null;
  const submittedAt = item ? formatDateTime(item.occurredAt ?? item.createdAt, locale) : "—";

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      message.success(t("detail.copied"));
    } catch {
      message.error(t("detail.copyFailed"));
    }
  };

  const statusLabel = status
    ? presentMoneyI18nLabel(tCommon, tCommon.has, "statuses", status.code)
    : "";

  const failureCode =
    item?.failureReason?.trim() ||
    (status &&
    (status.code === "FAILED" || status.code === "REJECTED" || status.code === "CANCELLED")
      ? "PAYOUT_FAILED"
      : null);
  const failureLabel = failureCode
    ? presentMoneyI18nLabel(t, t.has, "detail.failureReasons", failureCode, "PAYOUT_FAILED")
    : null;

  return (
    <DashboardPage
      title={t("detail.title")}
      subtitle={t("detail.subtitle")}
      plain
      contentMode="overview"
      extra={
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => router.push(moneyPayoutsPath(locale))}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          {t("detail.back")}
        </button>
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

      {!loading && item && status && timeline ? (
        <div className={styles.page}>
          <section className={styles.hero}>
            <div className={`${styles.heroGlow} ${toneClass("heroGlow", status.tone)}`} />
            <div className={`${styles.heroIcon} ${toneClass("heroIcon", status.tone)}`} aria-hidden>
              <StatusIcon tone={status.tone} />
            </div>
            <span className={styles.heroLabel}>{t("detail.heroAmountLabel")}</span>
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
              {status.tone === "warning"
                ? t("detail.statusBadgeProcessing", { status: statusLabel })
                : status.tone === "success"
                  ? t("detail.statusBadgeSuccess", { status: statusLabel })
                  : status.tone === "danger"
                    ? t("detail.statusBadgeFailed", { status: statusLabel })
                    : statusLabel}
            </div>
          </section>

          <section className={styles.timelinePanel}>
            <h3 className={styles.timelineTitle}>{t("detail.timelineTitle")}</h3>
            <div className={styles.timelineTrack}>
              <div className={styles.timelineLine} aria-hidden />

              <div className={`${styles.timelineStep} ${stepClass(timeline.submitted)}`}>
                <TimelineNode state={timeline.submitted} stepNumber={1} />
                <span className={styles.timelineStepLabel}>{t("detail.timeline.submitted")}</span>
                <span className={styles.timelineStepMeta}>{submittedAt}</span>
              </div>

              <div className={`${styles.timelineStep} ${stepClass(timeline.processing)}`}>
                <TimelineNode state={timeline.processing} stepNumber={2} />
                <span className={styles.timelineStepLabel}>
                  {timeline.processing === "failed"
                    ? t("detail.timeline.failed")
                    : t("detail.timeline.processing")}
                </span>
                <span className={styles.timelineStepMeta}>
                  {timeline.processing === "done"
                    ? t("detail.timeline.processingDone")
                    : timeline.processing === "failed"
                      ? (failureLabel ?? t("detail.timeline.failedHint"))
                      : t("detail.timeline.processingHint")}
                </span>
              </div>

              <div className={`${styles.timelineStep} ${stepClass(timeline.confirmed)}`}>
                <TimelineNode state={timeline.confirmed} stepNumber={3} />
                <span className={styles.timelineStepLabel}>{t("detail.timeline.confirmed")}</span>
                <span className={styles.timelineStepMeta}>
                  {timeline.confirmed === "done"
                    ? t("detail.timeline.confirmedDone")
                    : timeline.confirmed === "current"
                      ? t("detail.timeline.confirmedHint")
                      : t("detail.timeline.confirmedUpcoming")}
                </span>
              </div>

              <div className={`${styles.timelineStep} ${stepClass(timeline.posted)}`}>
                <TimelineNode state={timeline.posted} stepNumber={4} />
                <span className={styles.timelineStepLabel}>{t("detail.timeline.posted")}</span>
                <span className={styles.timelineStepMeta}>
                  {timeline.posted === "done"
                    ? t("detail.timeline.postedDone")
                    : t("detail.timeline.postedHint")}
                </span>
              </div>
            </div>
          </section>

          {failureLabel ? (
            <div className={styles.failureBox} role="alert">
              <strong>{t("detail.failure_reason")}：</strong>
              {failureLabel}
            </div>
          ) : null}

          <div className={styles.grid}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <FileText size={15} className={styles.panelHeaderIcon} aria-hidden />
                <h3 className={styles.panelTitle}>{t("detail.voucherSection")}</h3>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t("columns.id")}</span>
                <div className={styles.rowValue}>
                  <span className={styles.monoChip}>
                    <span>{item.payoutId}</span>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      aria-label={t("detail.copyId")}
                      onClick={() => void handleCopy(item.payoutId)}
                    >
                      <Copy size={13} strokeWidth={2} />
                    </button>
                  </span>
                </div>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t("detail.settlementAsset")}</span>
                <div className={styles.rowValue}>
                  {assetCode
                    ? assetName
                      ? `${assetCode} (${assetName})`
                      : assetCode
                    : "—"}
                </div>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t("detail.createdAt")}</span>
                <div className={`${styles.rowValue} ${styles.monoValue}`}>{submittedAt}</div>
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <Building2 size={15} className={styles.panelHeaderIcon} aria-hidden />
                <h3 className={styles.panelTitle}>{t("detail.bankSection")}</h3>
              </div>
              {item.destination ? (
                <>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>{t("detail.bank_name")}</span>
                    <div className={styles.rowValue}>{item.destination.bankName || "—"}</div>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>{t("detail.account_holder")}</span>
                    <div className={styles.rowValue}>{item.destination.accountHolder || "—"}</div>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>{t("detail.account_number")}</span>
                    <div className={`${styles.rowValue} ${styles.monoValue}`}>
                      {formatMaskedAccountNumber(item.destination.accountNumberMasked)}
                    </div>
                  </div>
                  {item.destination.bankBranchName ? (
                    <div className={styles.row}>
                      <span className={styles.rowLabel}>{t("detail.bank_branch")}</span>
                      <div className={styles.rowValue}>{item.destination.bankBranchName}</div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className={styles.row}>
                  <span className={styles.muted}>{t("detail.bankEmpty")}</span>
                </div>
              )}
            </section>
          </div>

          <p className={styles.footerNote}>
            {status.tone === "success"
              ? t("detail.footerSuccess")
              : status.tone === "danger"
                ? t("detail.footerFailed")
                : status.code === "CONFIRMED"
                  ? t("detail.footerConfirmed")
                  : t("detail.footerProcessing")}
          </p>
        </div>
      ) : null}
    </DashboardPage>
  );
}
