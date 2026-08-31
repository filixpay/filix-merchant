"use client";

import { useLocale, useTranslations } from "next-intl";
import type {
  MerchantTransactionReconStatus,
  TransactionReconDetail,
} from "@/lib/transaction-reconciliation/api";
import styles from "./TransactionReconDetailView.module.css";

function statusBadgeClass(status: MerchantTransactionReconStatus): string {
  switch (status) {
    case "MATCHED":
      return `${styles.badge} ${styles.badgeMatched}`;
    case "MISMATCH":
      return `${styles.badge} ${styles.badgeMismatch}`;
    case "NOT_RECONCILED":
      return `${styles.badge} ${styles.badgeNotReconciled}`;
    default:
      return `${styles.badge} ${styles.badgePending}`;
  }
}

function formatAmount(value: string | number | null | undefined, currency: string | null): string {
  if (value == null) return "—";
  const body = typeof value === "number" ? String(value) : value;
  return currency ? `${body} ${currency}` : body;
}

export default function TransactionReconDetailView({ detail }: { detail: TransactionReconDetail }) {
  const t = useTranslations("TransactionReconciliation");
  const locale = useLocale();
  const summary = detail.summary;

  const formatBizDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  return (
    <div className={styles.shell}>
      <p className={styles.scopeNote}>{t("detail.reconScopeOrder")}</p>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{t("sections.association")}</h2>
        <dl className={styles.grid}>
          <dt>{t("fields.paymentId")}</dt>
          <dd className={styles.mono}>{summary.paymentId}</dd>
          <dt>{t("fields.orderId")}</dt>
          <dd className={styles.mono}>{summary.orderId}</dd>
          <dt>{t("fields.reconciliationLevel")}</dt>
          <dd>{t("reconciliationLevelOrder")}</dd>
          <dt>{t("fields.channelCode")}</dt>
          <dd>{summary.channelCode}</dd>
          <dt>{t("fields.bizDate")}</dt>
          <dd>{formatBizDate(summary.bizDate)}</dd>
          <dt>{t("fields.reconciliationStatus")}</dt>
          <dd>
            <span className={statusBadgeClass(summary.reconciliationStatus)}>
              {t(`reconStatus.${summary.reconciliationStatus}`)}
            </span>
          </dd>
          {summary.mismatchType ? (
            <>
              <dt>{t("fields.mismatchType")}</dt>
              <dd>{summary.mismatchType}</dd>
            </>
          ) : null}
        </dl>
      </section>

      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>{t("sections.comparison")}</h2>
        <div className={styles.compareGrid}>
          <div className={styles.compareColumn}>
            <h3 className={styles.compareHeading}>{t("sections.provider")}</h3>
            <dl className={styles.grid}>
              <dt>{t("fields.providerTransactionId")}</dt>
              <dd className={styles.mono}>{summary.providerTransactionId ?? "—"}</dd>
              <dt>{t("fields.providerOrderId")}</dt>
              <dd className={styles.mono}>{summary.providerOrderId ?? "—"}</dd>
              <dt>{t("fields.providerAmount")}</dt>
              <dd>{formatAmount(detail.providerAmount, detail.providerCurrency)}</dd>
              <dt>{t("fields.providerStatus")}</dt>
              <dd>{detail.providerStatus ?? "—"}</dd>
            </dl>
          </div>
          <div className={styles.compareColumn}>
            <h3 className={styles.compareHeading}>{t("sections.filixpay")}</h3>
            <dl className={styles.grid}>
              <dt>{t("fields.localAmount")}</dt>
              <dd>{formatAmount(detail.localAmount, detail.providerCurrency)}</dd>
              <dt>{t("fields.localStatus")}</dt>
              <dd>{detail.localStatus ?? "—"}</dd>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
