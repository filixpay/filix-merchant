"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Alert, Button, message } from "antd";
import { Lock, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  api,
  ApiError,
  CryptoDepositWalletView,
  CryptoDepositWalletsListResponse,
  CryptoSupportedAsset,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import DepositWalletTable from "@/components/crypto-deposit-wallets/DepositWalletTable";
import DepositWalletFormDrawer from "@/components/crypto-deposit-wallets/DepositWalletFormDrawer";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import styles from "./crypto-page.module.css";

const KNOWN_ERROR_CODES = ["PLATFORM_MANAGED", "ACTIVE_RESERVATIONS", "INVALID_ADDRESS", "WALLET_EXISTS"];

export default function MoneyCryptoPage() {
  const t = useTranslations("CryptoDepositWallets");
  const tErrors = useTranslations("CryptoDepositWallets.errors");
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [listData, setListData] = useState<CryptoDepositWalletsListResponse | null>(null);
  const [supportedAssets, setSupportedAssets] = useState<CryptoSupportedAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingWallet, setEditingWallet] = useState<CryptoDepositWalletView | null>(null);

  const canManage = listData?.canManage === true && listData?.platformManaged !== true;
  const wallets = listData?.wallets ?? [];
  const readOnly = listData?.platformManaged === true || listData?.canManage === false;

  const handleApiError = useCallback(
    (err: unknown) => {
      if (handleDashboardApiError(err)) return true;
      if (err instanceof ApiError) {
        const code = String(err.code ?? "");
        if (KNOWN_ERROR_CODES.includes(code)) {
          message.error(tErrors(code));
          return true;
        }
        message.error(err.message);
        return true;
      }
      message.error(tErrors("unknown"));
      return true;
    },
    [tErrors],
  );

  const loadData = useCallback(
    async (refreshing = false) => {
      if (!accessToken) return;
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        const [walletList, assets] = await Promise.all([
          api.cryptoDepositWallets.list(accessToken),
          api.cryptoDepositWallets.listSupportedAssets(accessToken),
        ]);
        setListData(walletList);
        setSupportedAssets(assets ?? []);
      } catch (err) {
        setError(err);
        handleApiError(err);
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [accessToken, handleApiError],
  );

  useEffect(() => {
    if (accessToken) {
      void loadData();
    }
  }, [accessToken, loadData]);

  const handleCreate = () => {
    setEditingWallet(null);
    setShowDrawer(true);
  };

  const handleEdit = (wallet: CryptoDepositWalletView) => {
    setEditingWallet(wallet);
    setShowDrawer(true);
  };

  const handleToggleStatus = async (wallet: CryptoDepositWalletView) => {
    if (!accessToken) return;
    const nextStatus = wallet.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await api.cryptoDepositWallets.updateStatus(wallet.id, { status: nextStatus }, accessToken);
      await loadData(true);
    } catch (err) {
      handleApiError(err);
    }
  };

  const extra = canManage ? (
    <Button type="primary" icon={<Plus size={16} />} onClick={handleCreate}>
      {t("add_wallet")}
    </Button>
  ) : undefined;

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")} contentMode="table" extra={extra}>
      {readOnly ? (
        <Alert
          className={styles.infoBanner}
          type="info"
          showIcon
          message={listData?.platformManaged ? t("platform_managed_title") : t("read_only_title")}
          description={listData?.platformManaged ? t("platform_managed_desc") : t("read_only_desc")}
        />
      ) : (
        <div className={styles.securityBanner}>
          <div className={styles.securityIcon}>
            <Lock size={16} />
          </div>
          <div>
            <p className={styles.securityTitle}>{t("security_notice_title")}</p>
            <p className={styles.securityDesc}>{t("security_notice_desc")}</p>
          </div>
        </div>
      )}

      {accessToken ? (
        <DepositWalletTable
          wallets={wallets}
          loading={loading}
          isRefreshing={isRefreshing}
          error={error}
          onRetry={() => void loadData()}
          canManage={canManage}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      ) : null}

      {accessToken && canManage ? (
        <DepositWalletFormDrawer
          isOpen={showDrawer}
          onClose={() => {
            setShowDrawer(false);
            setEditingWallet(null);
          }}
          onSuccess={() => void loadData(true)}
          accessToken={accessToken}
          supportedAssets={supportedAssets}
          existingWallets={wallets}
          editingWallet={editingWallet}
        />
      ) : null}
    </DashboardPage>
  );
}
