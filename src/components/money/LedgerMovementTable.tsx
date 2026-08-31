"use client";

import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import TradeNoText from "@/components/TradeNoText";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import type { MerchantLedgerMovementRow } from "@/lib/money/ledger-movement-display";
import { presentLedgerMovementLabel } from "@/lib/money/ledger-movement-labels";
import styles from "./LedgerMovementModal.module.css";

interface LedgerMovementTableProps {
  movements: MerchantLedgerMovementRow[];
  loading: boolean;
  emptyText?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  hideFooterPagination?: boolean;
}

export default function LedgerMovementTable({
  movements,
  loading,
  emptyText,
  page = 0,
  pageSize = 20,
  total = 0,
  onPageChange,
  hideFooterPagination = false,
}: LedgerMovementTableProps) {
  const t = useTranslations("MoneyBalance.movements");
  const locale = useLocale();

  const columns: ColumnsType<MerchantLedgerMovementRow> = [
    {
      title: t("headers.time"),
      key: "time",
      width: 168,
      render: (_, record) => (
        <span className={styles.timeCell}>
          {new Date(record.occurredAt).toLocaleString(locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </span>
      ),
    },
    {
      title: t("headers.type"),
      dataIndex: "businessType",
      key: "businessType",
      width: 128,
      render: (value: string, record) => {
        const isCredit = record.signedAmountPrefix === "+";
        return (
          <span
            className={`${styles.typeBadge} ${isCredit ? styles.typeBadgeCredit : styles.typeBadgeDebit}`}
          >
            {isCredit ? (
              <ArrowDownLeft size={12} strokeWidth={2} aria-hidden />
            ) : (
              <ArrowUpRight size={12} strokeWidth={2} aria-hidden />
            )}
            {presentLedgerMovementLabel(t, t.has, "businessTypes", value)}
          </span>
        );
      },
    },
    {
      title: t("headers.journal"),
      dataIndex: "journalNumber",
      key: "journalNumber",
      width: 100,
      render: (value: string) => <span className={styles.journalCell}>{value || "—"}</span>,
    },
    {
      title: t("headers.reference"),
      key: "reference",
      width: 260,
      render: (_, record) => {
        if (!record.referenceId && !record.externalReference) {
          return <Typography.Text type="secondary">—</Typography.Text>;
        }
        return (
          <div className={styles.referenceStack}>
            {record.referenceId ? (
              <div className={styles.referencePrimary}>
                <TradeNoText value={record.referenceId} ellipsis />
              </div>
            ) : null}
            {record.externalReference ? (
              <span className={styles.referenceSub} title={record.externalReference}>
                {t("related_reference", { id: record.externalReference })}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      title: t("headers.amount"),
      key: "amount",
      align: "right",
      width: 120,
      render: (_, record) => {
        const amountParts = formatWalletAmountDisplay(
          String(record.amount),
          record.assetCode,
          locale,
        );
        const isCredit = record.signedAmountPrefix === "+";
        return (
          <span
            className={`${styles.amountValue} financial-amount ${isCredit ? styles.amountCredit : styles.amountDebit}`}
          >
            {record.signedAmountPrefix}
            {amountParts.amount}
          </span>
        );
      },
    },
  ];

  return (
    <Table
      className={styles.table}
      columns={columns}
      dataSource={movements}
      rowKey={(record) =>
        record.movementId ||
        `${record.occurredAt}-${record.referenceId}-${record.direction}-${record.amount}`
      }
      loading={loading}
      size="middle"
      scroll={{ x: 820 }}
      locale={{ emptyText: emptyText || t("empty") }}
      pagination={
        onPageChange && !hideFooterPagination
          ? {
              current: page + 1,
              pageSize,
              total,
              showSizeChanger: false,
              onChange: (p) => onPageChange(p - 1),
            }
          : false
      }
    />
  );
}
