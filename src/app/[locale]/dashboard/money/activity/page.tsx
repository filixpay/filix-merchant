"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Alert, Flex, Select, Space, Typography } from "antd";
import { useTranslations } from "next-intl";
import {
  moneyProductApi,
  type MoneyActivityItem,
  type MoneyActivityQuery,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import MoneyActivityTable from "@/components/money/MoneyActivityTable";
import MoneyAssetFilterSelect from "@/components/money/MoneyAssetFilterSelect";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import {
  assetCodeForQuery,
  normalizeAssetFilterOnOptionsLoad,
} from "@/lib/money/asset-filter";
import { sortedPresentAssetCodes } from "@/lib/money/present-asset-codes";

const PAGE_SIZE = 20;

export default function MoneyActivityPage() {
  const t = useTranslations("MoneyActivity");
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [assetOptions, setAssetOptions] = useState<string[]>([]);
  const [assetCode, setAssetCode] = useState<string | null>(null);
  const [movementType, setMovementType] = useState<string>("All");
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [assetsError, setAssetsError] = useState<unknown | null>(null);

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
      setAssetCode((prev) => normalizeAssetFilterOnOptionsLoad(prev, codes));
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

  const params = useMemo<MoneyActivityQuery>(
    () => ({
      assetCode: assetCodeForQuery(assetCode),
      movementType: movementType === "All" ? undefined : movementType,
      page,
      size: pageSize,
    }),
    [assetCode, movementType, page, pageSize],
  );

  const { items, total, loading, isRefreshing, error, reload } = usePagedResource<
    MoneyActivityItem,
    MoneyActivityQuery
  >({
    accessToken,
    params,
    fetcher: (query, token) => moneyProductApi.getActivity(query, token),
    enabled: Boolean(accessToken && !assetsLoading),
  });

  const filter = (
    <Flex align="center" gap={8} wrap="wrap">
      <MoneyAssetFilterSelect
        label={t("asset_filter_label")}
        allLabel={t("asset_filter_all")}
        assetOptions={assetOptions}
        value={assetCode}
        loading={assetsLoading}
        onChange={(value) => {
          setAssetCode(value);
          setPage(0);
        }}
      />
      <Typography.Text type="secondary">{t("movement_filter_label")}</Typography.Text>
      <Select
        style={{ minWidth: 120 }}
        value={movementType}
        options={[
          { value: "All", label: t("movement_filter_all") },
          { value: "In", label: t("movement_filter_in") },
          { value: "Out", label: t("movement_filter_out") },
          { value: "Transfer", label: t("movement_filter_transfer") },
        ]}
        onChange={(value: string) => {
          setMovementType(value);
          setPage(0);
        }}
        aria-label={t("movement_filter_label")}
      />
    </Flex>
  );

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")} contentMode="table" extra={filter}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {!assetsLoading && assetOptions.length === 0 && !assetsError ? (
          <Alert type="info" showIcon message={t("no_assets")} />
        ) : null}

        <MoneyActivityTable
          items={items}
          loading={assetsLoading || loading}
          isRefreshing={isRefreshing}
          error={assetsError ?? error}
          onRetry={() => {
            void loadAssets();
            reload();
          }}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(nextPage, nextSize) => {
            setPage(nextPage);
            setPageSize(nextSize);
          }}
        />
      </Space>
    </DashboardPage>
  );
}
