"use client";

import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import { ApiError, type MoneyTransferView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import MoneyAmountCell from "@/components/money/MoneyAmountCell";
import MoneyMovementIdCell from "@/components/money/MoneyMovementIdCell";
import listStyles from "@/components/money/MoneyListTable.module.css";
import { moneyStatusToneToTagColor } from "@/lib/money/activity-display";
import { presentMoneyI18nLabel } from "@/lib/money/money-i18n-label";
import { presentMoneyMovementAmount } from "@/lib/money/money-movement-amount";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import { presentMoneyStatus } from "@/lib/money/status-presenter";

export interface TransferListTableProps {
  items: MoneyTransferView[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onRowClick?: (transferId: string) => void;
  detailHref?: (transferId: string) => string;
}

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

function formatTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

export default function TransferListTable({
  items,
  loading,
  isRefreshing = false,
  error = null,
  onRetry,
  total,
  page,
  pageSize,
  onPageChange,
  onRowClick,
  detailHref,
}: TransferListTableProps) {
  const t = useTranslations("MoneyTransfers");
  const tCommon = useTranslations("MoneyCommon");

  const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: items.length,
    emptyDescription: t("empty"),
    errorDescription: error ? resolveErrorMessage(error) : undefined,
    onRetry,
  });

  const columns: ColumnsType<MoneyTransferView> = [
    {
      title: t("columns.id"),
      dataIndex: "transferId",
      key: "transferId",
      width: 240,
      render: (value: string) => (
        <MoneyMovementIdCell value={value} href={detailHref?.(value)} />
      ),
    },
    {
      title: t("columns.time"),
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 180,
      render: (value: string | null) => formatTime(value),
    },
    {
      title: t("columns.amount"),
      key: "amount",
      align: "right",
      render: (_: unknown, row) => {
        if (row.amount == null || !row.assetCode) return "—";
        return (
          <MoneyAmountCell
            presentation={presentMoneyMovementAmount({
              amount: row.amount,
              assetCode: row.assetCode,
              semantic: "transfer",
            })}
          />
        );
      },
    },
    {
      title: t("columns.counterparty"),
      dataIndex: "counterparty",
      key: "counterparty",
      render: (_: unknown, row) => row.counterparty?.ownerId ?? "—",
    },
    {
      title: t("columns.status"),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const presented = presentMoneyStatus(status);
        return (
          <Tag color={moneyStatusToneToTagColor(presented.tone)}>
            {presentMoneyI18nLabel(tCommon, tCommon.has, "statuses", presented.code)}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      {refreshBanner}
      <Table
        className={onRowClick ? listStyles.table : undefined}
        rowKey="transferId"
        columns={columns}
        dataSource={items}
        loading={tableLoading}
        locale={tableLocale}
        pagination={{
          current: page + 1,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (nextPage, nextSize) => onPageChange(nextPage - 1, nextSize),
        }}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record.transferId),
          className: onRowClick ? "clickable-row" : undefined,
        })}
      />
    </>
  );
}
