"use client";

import { useMemo, useState, type ReactNode } from "react";
import { message, Tooltip } from "antd";
import { Check, Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import type {
  MerchantSettlementReconStatus,
  SettlementDetail,
  SettlementTimelineEvent,
} from "@/lib/settlements/api";
import styles from "./SettlementDetailView.module.css";

function formatDateTime(value: string | null, locale: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
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

function isNonZeroAmount(value: string | number): boolean {
  const n = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(n) && n !== 0;
}

function isEmptyValue(value: string | number | null | undefined): boolean {
  return value == null || (typeof value === "string" && value.trim() === "");
}

function reconBadgeClass(status: MerchantSettlementReconStatus): string {
  switch (status) {
    case "EXCEPTION":
      return `${styles.badge} ${styles.badgeException}`;
    case "MATCHED":
      return `${styles.badge} ${styles.badgeMatched}`;
    default:
      return `${styles.badge} ${styles.badgePending}`;
  }
}

function AmountValue({
  amount,
  asset,
  locale,
  size = "default",
  mutedWhenZero = false,
}: {
  amount: string | number | null;
  asset: string;
  locale: string;
  size?: "default" | "hero" | "secondary";
  mutedWhenZero?: boolean;
}) {
  if (amount == null) return <span className={styles.muted}>—</span>;
  const raw = typeof amount === "number" ? String(amount) : amount;
  const { symbol, amount: body } = formatWalletAmountDisplay(raw, asset, locale);
  const muted = mutedWhenZero && !isNonZeroAmount(raw);
  const sizeClass =
    size === "hero" ? styles.amountHero : size === "secondary" ? styles.amountSecondary : styles.amount;
  return (
    <span className={`${sizeClass} ${muted ? styles.amountMuted : ""}`}>
      {symbol ? <span className={styles.amountSymbol}>{symbol}</span> : null}
      {body}
    </span>
  );
}

function CopyableValue({
  value,
  ariaLabel,
  children,
}: {
  value: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const t = useTranslations("Settlements");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      message.success(t("copy_success"));
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      message.error(t("copy_failed"));
    }
  };

  return (
    <span className={styles.copyable}>
      <span className={styles.copyableText}>{children}</span>
      <button
        type="button"
        className={styles.copyButton}
        aria-label={ariaLabel}
        onClick={() => void handleCopy()}
      >
        {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={2} />}
      </button>
    </span>
  );
}

function sortTimelineNewestFirst(events: SettlementTimelineEvent[]): SettlementTimelineEvent[] {
  return [...events].sort((a, b) => {
    const ta = new Date(a.occurredAt).getTime();
    const tb = new Date(b.occurredAt).getTime();
    const aValid = Number.isFinite(ta);
    const bValid = Number.isFinite(tb);
    if (aValid && bValid) return tb - ta;
    if (aValid) return -1;
    if (bValid) return 1;
    return 0;
  });
}

export default function SettlementDetailView({ detail }: { detail: SettlementDetail }) {
  const t = useTranslations("Settlements");
  const locale = useLocale();
  const asset = detail.asset;

  const timeline = useMemo(
    () => sortTimelineNewestFirst(detail.timeline),
    [detail.timeline],
  );

  const providerEmpty =
    isEmptyValue(detail.providerSettlement.provider) &&
    isEmptyValue(detail.providerSettlement.providerReference) &&
    isEmptyValue(detail.providerSettlement.settlementDate) &&
    isEmptyValue(detail.providerSettlement.actualNet);

  return (
    <div className={styles.shell}>
      <div className={styles.idBar}>
        <span className={styles.idLabel}>{t("columns.settlementId")}</span>
        <CopyableValue value={detail.settlementId} ariaLabel={t("copy_settlement_id")}>
          <Tooltip title={detail.settlementId}>
            <span className={styles.idMono}>{detail.settlementId}</span>
          </Tooltip>
        </CopyableValue>
      </div>

      <section className={styles.summaryBanner} aria-label={t("summary.net")}>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>{t("summary.net")}</span>
          <AmountValue amount={detail.net} asset={asset} locale={locale} size="hero" />
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>{t("summary.gross")}</span>
          <AmountValue amount={detail.gross} asset={asset} locale={locale} size="secondary" />
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>{t("summary.fee")}</span>
          <AmountValue
            amount={detail.fee}
            asset={asset}
            locale={locale}
            size="secondary"
            mutedWhenZero
          />
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryLabel}>{t("summary.reconStatus")}</span>
          <span className={reconBadgeClass(detail.reconStatus)}>
            {t(`reconStatus.${detail.reconStatus}`)}
          </span>
        </div>
      </section>

      <div className={styles.columns}>
        <div className={styles.mainColumn}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>{t("sections.settlement")}</h2>
            <dl className={styles.grid}>
              <dt>{t("fields.moneyInRef")}</dt>
              <dd>
                <CopyableValue
                  value={detail.settlement.moneyInRef}
                  ariaLabel={t("copy_money_in_ref")}
                >
                  <Tooltip title={detail.settlement.moneyInRef}>
                    <span className={styles.idMono}>{detail.settlement.moneyInRef}</span>
                  </Tooltip>
                </CopyableValue>
              </dd>
              <dt>{t("fields.releaseRef")}</dt>
              <dd>
                <CopyableValue
                  value={detail.settlement.releaseRef}
                  ariaLabel={t("copy_release_ref")}
                >
                  <Tooltip title={detail.settlement.releaseRef}>
                    <span className={styles.idMono}>{detail.settlement.releaseRef}</span>
                  </Tooltip>
                </CopyableValue>
              </dd>
              <dt>{t("fields.releasedAt")}</dt>
              <dd>{formatDateTime(detail.settlement.releasedAt, locale)}</dd>
            </dl>
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>{t("sections.providerSettlement")}</h2>
            {providerEmpty ? (
              <p className={styles.emptyNotice}>{t("providerEmptyNotice")}</p>
            ) : null}
            <dl className={styles.grid}>
              <dt>{t("fields.provider")}</dt>
              <dd>
                {detail.providerSettlement.provider ?? (
                  <span className={styles.muted}>—</span>
                )}
              </dd>
              <dt>{t("fields.providerReference")}</dt>
              <dd>
                {detail.providerSettlement.providerReference ?? (
                  <span className={styles.muted}>—</span>
                )}
              </dd>
              <dt>{t("fields.settlementDate")}</dt>
              <dd>
                {detail.providerSettlement.settlementDate ? (
                  formatDateTime(detail.providerSettlement.settlementDate, locale)
                ) : (
                  <span className={styles.muted}>—</span>
                )}
              </dd>
              <dt>{t("fields.expectedNet")}</dt>
              <dd>
                <AmountValue
                  amount={detail.providerSettlement.expectedNet}
                  asset={asset}
                  locale={locale}
                />
              </dd>
              <dt>{t("fields.actualNet")}</dt>
              <dd>
                <AmountValue
                  amount={detail.providerSettlement.actualNet}
                  asset={asset}
                  locale={locale}
                />
              </dd>
            </dl>
          </section>
        </div>

        <div className={styles.sideColumn}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>{t("sections.reconciliation")}</h2>
            <dl className={styles.grid}>
              <dt>{t("fields.reconStatus")}</dt>
              <dd>
                <span className={reconBadgeClass(detail.reconciliation.reconStatus)}>
                  {t(`reconStatus.${detail.reconciliation.reconStatus}`)}
                </span>
              </dd>
              <dt>{t("fields.difference")}</dt>
              <dd>
                <AmountValue
                  amount={detail.reconciliation.difference}
                  asset={asset}
                  locale={locale}
                />
              </dd>
            </dl>
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>{t("sections.timeline")}</h2>
            {timeline.length === 0 ? (
              <p className={styles.muted}>{t("timelineEmpty")}</p>
            ) : (
              <ol className={styles.timeline}>
                {timeline.map((ev, index) => (
                  <li
                    key={`${ev.kind}-${ev.occurredAt}-${index}`}
                    className={index === 0 ? styles.timelineItemLatest : styles.timelineItem}
                  >
                    <span className={styles.timelineDot} aria-hidden />
                    <div className={styles.timelineBody}>
                      <span className={styles.timelineLabel}>{t(`timeline.${ev.kind}`)}</span>
                      <span className={styles.timelineTime}>
                        {formatDateTime(ev.occurredAt, locale)}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
