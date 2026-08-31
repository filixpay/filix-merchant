"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, DatePicker, Flex, Segmented, Select, Space } from "antd";
import type { Dayjs } from "dayjs";
import { Globe } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import DashboardPage from "@/components/layout/DashboardPage";
import MoneyAssetLabel from "@/components/money/MoneyAssetLabel";
import SettlementStatementTable from "@/components/settlement-statements/SettlementStatementTable";
import { moneyProductApi } from "@/lib/api";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import { sortedPresentAssetCodes } from "@/lib/money/present-asset-codes";
import {
  isPeriodNotStartedError,
  settlementStatementsApi,
  type SettlementPeriodKind,
  type SettlementStatementQuery,
  type SettlementStatementSummary,
} from "@/lib/settlement-statements/api";
import {
  defaultPeriodRange,
  formatPeriodKey,
} from "@/lib/settlement-statements/period-keys";
import styles from "./settlement-statements-page.module.css";

const PAGE_SIZE = 20;
const PERIOD_KINDS: SettlementPeriodKind[] = ["DAY", "WEEK", "MONTH"];
const ALL_ASSETS = "";

function normalizeOptionalAsset(prev: string | null, codes: string[]): string | null {
  if (prev !== null && codes.includes(prev)) return prev;
  return null;
}

export default function SettlementStatementsPage() {
  const t = useTranslations("SettlementStatements");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [assetOptions, setAssetOptions] = useState<string[]>([]);
  const [assetCode, setAssetCode] = useState<string | null>(null);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState<unknown | null>(null);
  const [periodKind, setPeriodKind] = useState<SettlementPeriodKind>("DAY");
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => defaultPeriodRange("DAY"));

  const loadAssets = useCallback(async () => {
    if (!accessToken) {
      setAssetsLoading(false);
      return;
    }
    setAssetsLoading(true);
    setAssetsError(null);
    try {
      const balances = await moneyProductApi.listBalances(accessToken);
      const codes = sortedPresentAssetCodes(balances);
      setAssetOptions(codes);
      setAssetCode((prev) => normalizeOptionalAsset(prev, codes));
      setPage(0);
    } catch (err) {
      setAssetsError(err);
      setAssetOptions([]);
      setAssetCode(null);
    } finally {
      setAssetsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  const fromKey = formatPeriodKey(range[0], periodKind);
  const toKey = formatPeriodKey(range[1], periodKind);

  const params = useMemo((): SettlementStatementQuery => {
    return {
      ...(assetCode ? { assetCode } : {}),
      periodKind,
      from: fromKey,
      to: toKey,
      pageNumber: page,
      pageSize,
    };
  }, [assetCode, fromKey, page, pageSize, periodKind, toKey]);

  const { items, total, loading, isRefreshing, error, reload } = usePagedResource<
    SettlementStatementSummary,
    SettlementStatementQuery
  >({
    accessToken,
    params,
    fetcher: (query, token) => settlementStatementsApi.list(query, token),
    enabled: Boolean(accessToken),
  });

  const periodNotStarted = isPeriodNotStartedError(error);
  const detailHref = (statementKey: string) =>
    `/${locale}/dashboard/money/settlements/statements/${encodeURIComponent(statementKey)}`;

  const timezoneLabel = useMemo(() => {
    const row = items[0];
    if (row?.timezone) {
      return row.timezone;
    }
    return t("timezoneChip.fallback");
  }, [items, t]);

  const picker =
    periodKind === "MONTH" ? "month" : periodKind === "WEEK" ? "week" : "date";

  const filter = (
    <Flex align="center" gap={8} wrap="wrap">
      <Select
        style={{ minWidth: 160 }}
        loading={assetsLoading}
        value={assetCode ?? ALL_ASSETS}
        placeholder={t("filters.assetPlaceholder")}
        options={[
          { value: ALL_ASSETS, label: t("filters.allAssets") },
          ...assetOptions.map((code) => ({ value: code, label: code })),
        ]}
        optionRender={(option) => {
          const code = String(option.value ?? "");
          if (!code) return t("filters.allAssets");
          return <MoneyAssetLabel assetCode={code} compact />;
        }}
        labelRender={(props) => {
          const code = String(props.value ?? "");
          if (!code) return t("filters.allAssets");
          return <MoneyAssetLabel assetCode={code} compact />;
        }}
        onChange={(value: string) => {
          setAssetCode(value || null);
          setPage(0);
        }}
        aria-label={t("filters.asset")}
      />
      <Segmented
        value={periodKind}
        options={PERIOD_KINDS.map((value) => ({
          value,
          label: t(`periodKind.${value}`),
        }))}
        onChange={(value) => {
          const next = value as SettlementPeriodKind;
          setPeriodKind(next);
          setRange(defaultPeriodRange(next));
          setPage(0);
        }}
        aria-label={t("filters.periodKind")}
      />
      <DatePicker.RangePicker
        picker={picker}
        value={range}
        allowClear={false}
        onChange={(next) => {
          if (!next?.[0] || !next?.[1]) return;
          setRange([next[0], next[1]]);
          setPage(0);
        }}
      />
    </Flex>
  );

  const subtitle = (
    <>
      <span className={styles.timezoneChip}>
        <Globe size={11} strokeWidth={2} />
        {t("timezoneChip.label", { timezone: timezoneLabel })}
      </span>
      <span className={styles.subtitleText}>{t("subtitle")}</span>
    </>
  );

  return (
    <DashboardPage
      title={t("title")}
      subtitle={subtitle}
      contentMode="table"
      extra={filter}
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {periodNotStarted ? (
          <Alert type="warning" showIcon message={t("periodNotStarted")} />
        ) : null}
        <SettlementStatementTable
          items={items}
          loading={loading || assetsLoading}
          isRefreshing={isRefreshing}
          error={periodNotStarted ? null : error ?? assetsError}
          onRetry={() => {
            void loadAssets();
            void reload();
          }}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(nextPage, nextSize) => {
            setPage(nextPage);
            setPageSize(nextSize);
          }}
          onOpenDetail={(statementKey) => router.push(detailHref(statementKey))}
        />
      </Space>
    </DashboardPage>
  );
}
