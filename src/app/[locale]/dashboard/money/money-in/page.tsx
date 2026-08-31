"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Alert, Button, Flex, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  moneyProductApi,
  type MoneyAssetCapability,
  type MoneyInQuery,
  type MoneyInView,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CreateMoneyInModal from "@/components/money/CreateMoneyInModal";
import MoneyAssetFilterSelect from "@/components/money/MoneyAssetFilterSelect";
import MoneyInListTable from "@/components/money/MoneyInListTable";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import {
  assetCodeForQuery,
  normalizeAssetFilterOnOptionsLoad,
} from "@/lib/money/asset-filter";
import { isCreateAvailable } from "@/lib/money/capability-presenter";
import { moneyMoneyInDetailPath } from "@/lib/money/money-in-redirect";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import { sortedPresentAssetCodes } from "@/lib/money/present-asset-codes";

const PAGE_SIZE = 20;

export default function MoneyInPage() {
  const t = useTranslations("MoneyIn");
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
  const [capability, setCapability] = useState<MoneyAssetCapability | null>(null);
  const [capabilityLoading, setCapabilityLoading] = useState(false);
  const [available, setAvailable] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

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

  const loadCapabilityAndBalance = useCallback(async () => {
    if (!accessToken || !assetCode) {
      setCapability(null);
      setAvailable(null);
      setCapabilityLoading(false);
      return;
    }
    setCapabilityLoading(true);
    try {
      const [cap, balance] = await Promise.all([
        moneyProductApi.getAssetCapability(accessToken, assetCode),
        moneyProductApi.getBalance(accessToken, assetCode).catch(() => null),
      ]);
      setCapability(cap);
      setAvailable(balance?.available ?? null);
    } catch (err) {
      console.error("Failed to load Money-In capability:", err);
      setCapability(null);
      setAvailable(null);
    } finally {
      setCapabilityLoading(false);
    }
  }, [accessToken, assetCode]);

  useEffect(() => {
    void loadCapabilityAndBalance();
  }, [loadCapabilityAndBalance]);

  const params = useMemo<MoneyInQuery>(
    () => ({
      assetCode: assetCodeForQuery(assetCode),
      page,
      size: pageSize,
    }),
    [assetCode, page, pageSize],
  );

  const { items, total, loading, isRefreshing, error, reload } = usePagedResource<
    MoneyInView,
    MoneyInQuery
  >({
    accessToken,
    params,
    fetcher: (query, token) => moneyProductApi.listMoneyIns(query, token),
    enabled: Boolean(accessToken && !assetsLoading),
  });

  const createAvailable = capability ? isCreateAvailable(capability.moneyIn) : false;
  const productized = capability?.moneyIn.productized === true;
  const unavailableReason =
    capability && productized && !capability.moneyIn.enabled
      ? presentMoneyProductError({ reasonCode: capability.moneyIn.reasonCode })
      : capability && !productized
        ? presentMoneyProductError({ reasonCode: capability.moneyIn.reasonCode ?? "NOT_PRODUCTIZED" })
        : null;

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
      {createAvailable ? (
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>
          {t("create_cta")}
        </Button>
      ) : null}
    </Flex>
  );

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")} contentMode="table" extra={filter}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {!assetsLoading && assetOptions.length === 0 && !assetsError ? (
          <Alert type="info" showIcon message={t("no_assets")} />
        ) : null}
        {!capabilityLoading && unavailableReason ? (
          <Alert type="warning" showIcon message={t("unavailable_title")} description={unavailableReason} />
        ) : null}

        <MoneyInListTable
          items={items}
          loading={assetsLoading || (Boolean(assetCode) && capabilityLoading) || loading}
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
          onRowClick={(moneyInId) => router.push(moneyMoneyInDetailPath(locale, moneyInId))}
          detailHref={(moneyInId) => moneyMoneyInDetailPath(locale, moneyInId)}
        />
      </Space>

      {accessToken && assetCode && createAvailable ? (
        <CreateMoneyInModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={reload}
          accessToken={accessToken}
          available={available}
          assetCode={assetCode}
        />
      ) : null}
    </DashboardPage>
  );
}
