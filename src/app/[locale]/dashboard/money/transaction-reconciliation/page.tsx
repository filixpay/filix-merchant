"use client";

import { useCallback, useMemo, useState } from "react";
import { Alert, Button, DatePicker, Select, Space, notification } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import DashboardPage from "@/components/layout/DashboardPage";
import TransactionReconTable from "@/components/transaction-reconciliation/TransactionReconTable";
import { downloadReportBlob } from "@/components/reporting/download-report-blob";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import {
  transactionReconApi,
  type TransactionReconItem,
  type TransactionReconQuery,
  type TransactionReconScope,
} from "@/lib/transaction-reconciliation/api";
import styles from "./transaction-reconciliation-page.module.css";

const PAGE_SIZE = 20;
const CHANNEL_OPTIONS = ["STRIPE", "PAYPAL"] as const;
const SCOPE_OPTIONS: TransactionReconScope[] = ["default", "allTransactions"];

const DEFAULT_SCOPE: TransactionReconScope = "allTransactions";

function defaultDateRange(): [Dayjs, Dayjs] {
  return [dayjs().subtract(7, "day"), dayjs()];
}

type CommittedFilters = {
  channelCode: string | null;
  scope: TransactionReconScope;
  bizDateRange: [Dayjs, Dayjs];
};

export default function TransactionReconciliationPage() {
  const t = useTranslations("TransactionReconciliation");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [draftChannelCode, setDraftChannelCode] = useState<string | null>(null);
  const [draftScope, setDraftScope] = useState<TransactionReconScope>(DEFAULT_SCOPE);
  const [draftBizDateRange, setDraftBizDateRange] = useState<[Dayjs, Dayjs]>(defaultDateRange);
  const [committed, setCommitted] = useState<CommittedFilters>(() => ({
    channelCode: null,
    scope: DEFAULT_SCOPE,
    bizDateRange: defaultDateRange(),
  }));
  const [noReconData, setNoReconData] = useState(false);
  const [exporting, setExporting] = useState(false);

  const params = useMemo((): TransactionReconQuery => {
    return {
      from: committed.bizDateRange[0].format("YYYY-MM-DD"),
      to: committed.bizDateRange[1].format("YYYY-MM-DD"),
      ...(committed.channelCode ? { channelCode: committed.channelCode } : {}),
      scope: committed.scope,
      page,
      size: pageSize,
    };
  }, [committed, page, pageSize]);

  const fetcher = useCallback(
    async (query: TransactionReconQuery, token: string) => {
      const response = await transactionReconApi.list(query, token);
      setNoReconData(response.noReconData);
      return {
        data: response.items,
        total: response.total,
      };
    },
    [],
  );

  const { items, total, loading, isRefreshing, error, reload } = usePagedResource<
    TransactionReconItem,
    TransactionReconQuery
  >({
    accessToken,
    params,
    fetcher,
  });

  const handleQuery = () => {
    setCommitted({
      channelCode: draftChannelCode,
      scope: draftScope,
      bizDateRange: draftBizDateRange,
    });
    setPage(0);
  };

  const handleReset = () => {
    const nextRange = defaultDateRange();
    setDraftChannelCode(null);
    setDraftScope(DEFAULT_SCOPE);
    setDraftBizDateRange(nextRange);
    setCommitted({
      channelCode: null,
      scope: DEFAULT_SCOPE,
      bizDateRange: nextRange,
    });
    setPage(0);
  };

  const emptyTitle = noReconData && items.length === 0 ? t("emptyNoReconData") : t("empty");

  const emptyDescription = (
    <div className={styles.emptyState}>
      <div className={styles.emptyTitle}>{emptyTitle}</div>
      <div className={styles.emptyHint}>{t("emptyHint")}</div>
      <Button type="default" onClick={handleReset}>
        {t("reset")}
      </Button>
    </div>
  );

  const handleExport = async () => {
    if (!accessToken) {
      return;
    }
    setExporting(true);
    try {
      const blob = await transactionReconApi.exportCsv(
        {
          from: params.from,
          to: params.to,
          channelCode: params.channelCode,
          scope: params.scope,
        },
        accessToken,
      );
      downloadReportBlob(blob, "transaction-reconciliation.csv");
    } catch {
      notification.error({
        message: t("exportFailed"),
      });
    } finally {
      setExporting(false);
    }
  };

  const filterBar = (
    <div className={styles.filterRow}>
      <Select
        allowClear
        placeholder={t("filters.channel_all")}
        style={{ minWidth: 140 }}
        value={draftChannelCode ?? undefined}
        options={CHANNEL_OPTIONS.map((value) => ({ value, label: value }))}
        onChange={(value) => setDraftChannelCode(value ?? null)}
        aria-label={t("filters.channelCode")}
      />
      <DatePicker.RangePicker
        allowClear={false}
        value={draftBizDateRange}
        onChange={(range) => {
          if (range?.[0] && range?.[1]) {
            setDraftBizDateRange([range[0], range[1]]);
          }
        }}
      />
      <Select
        style={{ minWidth: 180 }}
        value={draftScope}
        options={SCOPE_OPTIONS.map((value) => ({
          value,
          label: t(`scope.${value}`),
        }))}
        onChange={(value: TransactionReconScope) => setDraftScope(value)}
        aria-label={t("filters.scope")}
      />
      <Space size={8} className={styles.filterActions}>
        <Button type="primary" onClick={handleQuery}>
          {t("query")}
        </Button>
        <Button onClick={handleReset}>{t("reset")}</Button>
      </Space>
    </div>
  );

  return (
    <DashboardPage
      title={t("title")}
      subtitle={t("subtitle")}
      filterBar={filterBar}
      contentMode="table"
      extra={
        <Button
          icon={<DownloadOutlined />}
          loading={exporting}
          onClick={() => void handleExport()}
        >
          {t("export")}
        </Button>
      }
    >
      {noReconData ? (
        <Alert
          className={styles.noReconAlert}
          type="info"
          showIcon
          message={t("noReconDataTitle")}
          description={t("noReconDataDescription")}
        />
      ) : null}
      <TransactionReconTable
        items={items}
        loading={loading}
        isRefreshing={isRefreshing}
        error={error}
        onRetry={reload}
        total={total}
        page={page}
        pageSize={pageSize}
        emptyDescription={emptyDescription}
        onPageChange={(nextPage, nextSize) => {
          setPage(nextPage);
          setPageSize(nextSize);
        }}
        onOpenDetail={(id) =>
          router.push(
            `/${locale}/dashboard/money/transaction-reconciliation/${encodeURIComponent(id)}`,
          )
        }
      />
    </DashboardPage>
  );
}
