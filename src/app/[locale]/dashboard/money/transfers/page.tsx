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
  type MoneyTransferView,
  type TransferQuery,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CreateTransferModal from "@/components/money/CreateTransferModal";
import MoneyAssetFilterSelect from "@/components/money/MoneyAssetFilterSelect";
import TransferListTable from "@/components/money/TransferListTable";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import {
  assetCodeForQuery,
  normalizeAssetFilterOnOptionsLoad,
} from "@/lib/money/asset-filter";
import { isCreateAvailable } from "@/lib/money/capability-presenter";
import { moneyTransfersDetailPath } from "@/lib/money/money-transfers-redirect";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import { sortedPresentAssetCodes } from "@/lib/money/present-asset-codes";

const PAGE_SIZE = 20;

export default function MoneyTransfersPage() {
  const t = useTranslations("MoneyTransfers");
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
      console.error("Failed to load Money Transfers capability:", err);
      setCapability(null);
      setAvailable(null);
    } finally {
      setCapabilityLoading(false);
    }
  }, [accessToken, assetCode]);

  useEffect(() => {
    void loadCapabilityAndBalance();
  }, [loadCapabilityAndBalance]);

  const params = useMemo<TransferQuery>(
    () => ({
      assetCode: assetCodeForQuery(assetCode),
      page,
      size: pageSize,
    }),
    [assetCode, page, pageSize],
  );

  const { items, total, loading, isRefreshing, error, reload } = usePagedResource<
    MoneyTransferView,
    TransferQuery
  >({
    accessToken,
    params,
    fetcher: (query, token) => moneyProductApi.listTransfers(query, token),
    enabled: Boolean(accessToken && !assetsLoading),
  });

  const createAvailable = capability ? isCreateAvailable(capability.transfer) : false;
  const productized = capability?.transfer.productized === true;
  const unavailableReason =
    capability && productized && !capability.transfer.enabled
      ? presentMoneyProductError({ reasonCode: capability.transfer.reasonCode })
      : capability && !productized
        ? presentMoneyProductError({
            reasonCode: capability.transfer.reasonCode ?? "NOT_PRODUCTIZED",
          })
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

        <TransferListTable
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
          onRowClick={(transferId) => router.push(moneyTransfersDetailPath(locale, transferId))}
          detailHref={(transferId) => moneyTransfersDetailPath(locale, transferId)}
        />
      </Space>

      {accessToken && assetCode && createAvailable ? (
        <CreateTransferModal
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
