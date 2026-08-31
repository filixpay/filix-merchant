"use client";

import { useMemo, useState } from "react";
import { Alert, message, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AlertCircle, Check, CheckCircle2, Clock, Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import type {
  CoverageState,
  PeriodState,
  SettlementStatementDetail,
  SettlementStatementDiagnostic,
  SettlementStatementEventRow,
  StatementJournalFact,
} from "@/lib/settlement-statements/api";
import styles from "./SettlementStatementDetailView.module.css";

function formatDateTime(value: string | undefined | null, locale: string): string {
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

function formatBusinessType(
  value: { domain?: string; action?: string } | string | undefined | null,
): string {
  if (!value) return "—";
  if (typeof value === "string") return value;
  if (value.domain && value.action) return `${value.domain}.${value.action}`;
  return value.domain ?? value.action ?? "—";
}

function parseAmount(value: string | number): number | null {
  const n = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(n) ? n : null;
}

function isNonZero(value: string | number): boolean {
  const n = parseAmount(value);
  return n != null && n !== 0;
}

function AmountText({
  value,
  assetCode,
  locale,
  strong = false,
}: {
  value: string | number;
  assetCode: string;
  locale: string;
  strong?: boolean;
}) {
  const raw = typeof value === "number" ? String(value) : value;
  const { symbol, amount } = formatWalletAmountDisplay(raw, assetCode, locale);
  const muted = !isNonZero(raw);
  return (
    <span
      className={`financial-amount ${styles.amountCell} ${strong ? styles.amountStrong : ""} ${
        muted ? styles.amountMuted : ""
      }`}
    >
      {symbol ? <span className={styles.amountSymbol}>{symbol}</span> : null}
      {amount}
    </span>
  );
}

function journalsForEvent(
  event: SettlementStatementEventRow,
  journals: StatementJournalFact[],
): StatementJournalFact[] {
  const ids = new Set(event.journalIds);
  return journals.filter((j) => ids.has(j.journalId));
}

function primaryJournal(
  event: SettlementStatementEventRow,
  journals: StatementJournalFact[],
): StatementJournalFact | null {
  const linked = journalsForEvent(event, journals);
  if (linked.length === 0) return null;
  return [...linked].sort((a, b) => String(a.effectiveAt).localeCompare(String(b.effectiveAt)))[0] ?? null;
}

function CoverageBadge({ state }: { state: CoverageState }) {
  const t = useTranslations("SettlementStatements");
  if (state === "OK") {
    return (
      <span className={styles.coverageOk}>
        <CheckCircle2 size={12} strokeWidth={2} />
        {t(`coverageState.${state}`)}
      </span>
    );
  }
  if (state === "PARTIAL_COVERAGE") {
    return (
      <span className={styles.coverageWarn}>
        <AlertCircle size={12} strokeWidth={2} />
        {t(`coverageState.${state}`)}
      </span>
    );
  }
  return (
    <span className={styles.coverageError}>
      <AlertCircle size={12} strokeWidth={2} />
      {t(`coverageState.${state}`)}
    </span>
  );
}

function PeriodBadge({ state }: { state: PeriodState }) {
  const t = useTranslations("SettlementStatements");
  if (state === "OPEN") {
    return (
      <span className={styles.periodOpen}>
        <Clock size={12} strokeWidth={2} />
        {t("periodState.OPEN")}
      </span>
    );
  }
  return <span className={styles.periodClosed}>{t("periodState.CLOSED")}</span>;
}

export default function SettlementStatementDetailView({
  detail,
}: {
  detail: SettlementStatementDetail;
}) {
  const t = useTranslations("SettlementStatements");
  const locale = useLocale();
  const { summary, events, journals, diagnostics } = detail;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hasDiagnostics =
    (diagnostics?.conflicts?.length ?? 0) > 0 ||
    (diagnostics?.unclassified?.length ?? 0) > 0;

  const assetCode = summary.assetCode;
  const net = parseAmount(summary.settlementNet) ?? 0;
  const payout = parseAmount(summary.payoutAmount) ?? 0;
  const pending = Math.max(net - payout, 0);
  const progressPct = net > 0 ? Math.min(100, Math.round((payout / net) * 100)) : 0;

  const pendingDisplay = useMemo(
    () => formatWalletAmountDisplay(pending.toFixed(2), assetCode, locale),
    [pending, assetCode, locale],
  );

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(value);
      message.success(t("events.copy_success"));
      window.setTimeout(() => setCopiedId((cur) => (cur === value ? null : cur)), 1500);
    } catch {
      message.error(t("events.copy_failed"));
    }
  };

  const eventColumns: ColumnsType<SettlementStatementEventRow> = [
    {
      title: t("events.businessRef"),
      dataIndex: "businessRef",
      key: "businessRef",
      width: 280,
      render: (value: string) => (
        <span className={styles.refCell}>
          <span className={styles.refText} title={value}>
            {value || "—"}
          </span>
          {value ? (
            <button
              type="button"
              className={styles.copyButton}
              aria-label={t("events.copy")}
              onClick={() => void handleCopy(value)}
            >
              {copiedId === value ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={2} />}
            </button>
          ) : null}
        </span>
      ),
    },
    {
      title: t("events.eventType"),
      key: "eventType",
      width: 180,
      render: (_: unknown, row) => {
        const journal = primaryJournal(row, journals);
        if (!journal) return <span className={styles.typeMuted}>—</span>;
        return <span className={styles.typeBadge}>{formatBusinessType(journal.businessType)}</span>;
      },
    },
    {
      title: t("events.effectiveAt"),
      key: "effectiveAt",
      width: 170,
      render: (_: unknown, row) => {
        const journal = primaryJournal(row, journals);
        return (
          <span className={styles.timeCell}>
            {journal ? formatDateTime(journal.effectiveAt, locale) : "—"}
          </span>
        );
      },
    },
    {
      title: t("events.gross"),
      dataIndex: "grossAmount",
      key: "grossAmount",
      align: "right",
      width: 120,
      render: (v: string | number) => <AmountText value={v} assetCode={assetCode} locale={locale} strong />,
    },
    {
      title: t("events.fee"),
      dataIndex: "feeAmount",
      key: "feeAmount",
      align: "right",
      width: 110,
      render: (v: string | number) => <AmountText value={v} assetCode={assetCode} locale={locale} />,
    },
    {
      title: t("events.adjustment"),
      dataIndex: "adjustmentAmount",
      key: "adjustmentAmount",
      align: "right",
      width: 110,
      render: (v: string | number) => <AmountText value={v} assetCode={assetCode} locale={locale} />,
    },
    {
      title: t("columns.released"),
      dataIndex: "releasedAmount",
      key: "releasedAmount",
      align: "right",
      width: 110,
      render: (v: string | number) => <AmountText value={v} assetCode={assetCode} locale={locale} />,
    },
    {
      title: t("columns.payout"),
      dataIndex: "payoutAmount",
      key: "payoutAmount",
      align: "right",
      width: 110,
      render: (v: string | number) => <AmountText value={v} assetCode={assetCode} locale={locale} />,
    },
  ];

  const diagnosticColumns: ColumnsType<SettlementStatementDiagnostic> = [
    {
      title: t("diagnostics.journalId"),
      dataIndex: "journalId",
      key: "journalId",
    },
    {
      title: t("diagnostics.kind"),
      dataIndex: "kind",
      key: "kind",
    },
    {
      title: t("diagnostics.businessType"),
      dataIndex: "businessType",
      key: "businessType",
      render: (v) => formatBusinessType(v),
    },
    {
      title: t("events.businessRef"),
      dataIndex: "businessRef",
      key: "businessRef",
      render: (v: string | null | undefined) => v ?? "—",
    },
    {
      title: t("diagnostics.reason"),
      dataIndex: "reason",
      key: "reason",
      render: (v: string | null | undefined) => v ?? "—",
    },
  ];

  const netDisplay = formatWalletAmountDisplay(
    typeof summary.settlementNet === "number"
      ? String(summary.settlementNet)
      : summary.settlementNet,
    assetCode,
    locale,
  );

  return (
    <div className={styles.stack}>
      {summary.periodState === "OPEN" ? (
        <Alert type="info" showIcon message={t("openBanner")} />
      ) : null}

      <div className={styles.statusRow}>
        <PeriodBadge state={summary.periodState} />
        <CoverageBadge state={summary.coverageState} />
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricsMain}>
          <div className={styles.heroCard}>
            <div className={styles.heroLabel}>{t("columns.settlementNet")}</div>
            <div className={`financial-amount ${styles.heroAmount}`}>
              {netDisplay.symbol ? `${netDisplay.symbol} ` : ""}
              {netDisplay.amount}
              <span className={styles.heroAsset}>{assetCode}</span>
            </div>
            <div className={styles.heroMeta}>
              <span>
                {t("detail.asOf")}: {formatDateTime(summary.asOf, locale)}
              </span>
              <span>
                {t("filters.periodKind")}: {t(`periodKind.${summary.periodKind}`)}
              </span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t("columns.gross")}</span>
            <div className={styles.metricValue}>
              <AmountText value={summary.grossAmount} assetCode={assetCode} locale={locale} strong />
            </div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t("columns.fee")}</span>
            <div className={styles.metricValue}>
              <AmountText value={summary.feeAmount} assetCode={assetCode} locale={locale} strong />
            </div>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{t("columns.adjustment")}</span>
            <div className={styles.metricValue}>
              <AmountText value={summary.adjustmentAmount} assetCode={assetCode} locale={locale} strong />
            </div>
          </div>
        </div>

        <div className={styles.progressPanel}>
          <div>
            <div className={styles.progressTitle}>
              <span>{t("detail.payoutProgress")}</span>
              <span className={styles.progressTimezone}>{summary.timezone}</span>
            </div>
            <div className={styles.progressRows}>
              <div className={styles.progressRow}>
                <span>{t("columns.released")}</span>
                <span className={styles.progressAmount}>
                  <AmountText value={summary.releasedAmount} assetCode={assetCode} locale={locale} strong />
                </span>
              </div>
              <div className={styles.progressRow}>
                <span>{t("columns.payout")}</span>
                <span className={styles.progressAmount}>
                  <AmountText value={summary.payoutAmount} assetCode={assetCode} locale={locale} strong />
                </span>
              </div>
              <div className={styles.progressRow}>
                <span>{t("detail.pendingPayout")}</span>
                <span className={`${styles.progressAmount} ${styles.progressPending}`}>
                  {pendingDisplay.symbol ? `${pendingDisplay.symbol} ` : ""}
                  {pendingDisplay.amount}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} style={{ width: `${progressPct}%` }} />
            </div>
            <div className={styles.progressFooter}>
              <span>
                {progressPct === 0 ? t("detail.payoutStatusNone") : t("detail.payoutStatusPartial")}
              </span>
              <span>{progressPct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <Typography.Title level={5} className={styles.sectionTitle}>
            {t("events.title")}
          </Typography.Title>
          <span className={styles.sectionCount}>
            {t("events.count", { count: events.length })}
          </span>
        </div>
        <div className={styles.tableWrap}>
          <Table<SettlementStatementEventRow>
            rowKey={(row) => `${row.businessRef}-${row.journalIds.join(",")}`}
            columns={eventColumns}
            dataSource={events}
            pagination={false}
            size="middle"
            scroll={{ x: 1100 }}
            locale={{ emptyText: t("events.empty") }}
            expandable={{
              expandedRowRender: (row) => {
                const linked = journalsForEvent(row, journals);
                if (linked.length === 0) {
                  return (
                    <div className={styles.expandedPanel}>
                      <Typography.Text type="secondary">{t("events.noJournals")}</Typography.Text>
                    </div>
                  );
                }
                return (
                  <div className={styles.expandedPanel}>
                    <Table<StatementJournalFact>
                      rowKey="journalId"
                      size="small"
                      pagination={false}
                      dataSource={linked}
                      columns={[
                        {
                          title: t("diagnostics.journalId"),
                          dataIndex: "journalId",
                          key: "journalId",
                        },
                        {
                          title: t("diagnostics.businessType"),
                          dataIndex: "businessType",
                          key: "businessType",
                          render: (v) => formatBusinessType(v),
                        },
                        {
                          title: t("detail.effectiveAt"),
                          dataIndex: "effectiveAt",
                          key: "effectiveAt",
                          render: (v: string) => formatDateTime(v, locale),
                        },
                      ]}
                    />
                  </div>
                );
              },
              rowExpandable: (row) => row.journalIds.length > 0,
            }}
          />
        </div>
      </div>

      {hasDiagnostics ? (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <Typography.Title level={5} className={styles.sectionTitle}>
              {t("diagnostics.title")}
            </Typography.Title>
          </div>
          <div style={{ padding: 16 }}>
            {(diagnostics.conflicts?.length ?? 0) > 0 ? (
              <>
                <Typography.Text type="secondary">{t("diagnostics.conflicts")}</Typography.Text>
                <Table<SettlementStatementDiagnostic>
                  style={{ marginTop: 8, marginBottom: 16 }}
                  rowKey={(row) => `conflict-${row.journalId}`}
                  columns={diagnosticColumns}
                  dataSource={diagnostics.conflicts}
                  pagination={false}
                  size="small"
                />
              </>
            ) : null}
            {(diagnostics.unclassified?.length ?? 0) > 0 ? (
              <>
                <Typography.Text type="secondary">{t("diagnostics.unclassified")}</Typography.Text>
                <Table<SettlementStatementDiagnostic>
                  style={{ marginTop: 8 }}
                  rowKey={(row) => `unclassified-${row.journalId}`}
                  columns={diagnosticColumns}
                  dataSource={diagnostics.unclassified}
                  pagination={false}
                  size="small"
                />
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
