"use client";

import { useCallback, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Alert, Button } from "antd";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { moneyProductApi, type ExternalAccountView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CreateExternalAccountModal from "@/components/money/CreateExternalAccountModal";
import ExternalAccountTable from "@/components/money/ExternalAccountTable";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";

const PAGE_SIZE = 50;

export default function MoneyExternalAccountsPage() {
  const t = useTranslations("MoneyExternalAccounts");
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const [showCreate, setShowCreate] = useState(false);

  const requestParams = useMemo(
    () => buildPagedListParams(0, PAGE_SIZE, {}, { page: "page", size: "size" }),
    [],
  );

  const { items, loading, error, reload } = usePagedResource<
    ExternalAccountView,
    Record<string, string | number>
  >({
    accessToken,
    params: requestParams,
    fetcher: (params, token) =>
      moneyProductApi.listExternalAccounts(
        {
          page: Number(params.page ?? 0),
          size: Number(params.size ?? PAGE_SIZE),
        },
        token,
      ),
  });

  const handleDisable = useCallback(
    async (id: string) => {
      if (!accessToken) return;
      try {
        await moneyProductApi.disableExternalAccount(id, accessToken);
        reload();
      } catch (err) {
        handleDashboardApiError(err);
        throw err;
      }
    },
    [accessToken, reload],
  );

  const extra = (
    <Button type="primary" icon={<Plus size={16} />} onClick={() => setShowCreate(true)}>
      {t("create_account")}
    </Button>
  );

  return (
    <DashboardPage title={t("title")} subtitle={t("subtitle")} contentMode="table" extra={extra}>
      {error ? (
        <Alert
          type="error"
          showIcon
          message={presentMoneyProductError({
            code: error instanceof Error ? error.message : undefined,
          })}
          action={
            <Button size="small" onClick={() => reload()}>
              {t("retry")}
            </Button>
          }
          style={{ marginBottom: 16 }}
        />
      ) : null}

      {accessToken ? (
        <ExternalAccountTable accounts={items} loading={loading} onDisable={handleDisable} />
      ) : null}

      {accessToken ? (
        <CreateExternalAccountModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={reload}
          accessToken={accessToken}
        />
      ) : null}
    </DashboardPage>
  );
}
