"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Skeleton, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import DashboardPage from "@/components/layout/DashboardPage";
import TransactionReconDetailView from "@/components/transaction-reconciliation/TransactionReconDetailView";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import {
  transactionReconApi,
  type TransactionReconDetail,
} from "@/lib/transaction-reconciliation/api";

export default function TransactionReconciliationDetailPage() {
  const t = useTranslations("TransactionReconciliation");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ reconciliationItemId: string }>();
  const reconciliationItemId = params?.reconciliationItemId ?? "";
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [detail, setDetail] = useState<TransactionReconDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accessToken || !reconciliationItemId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const row = await transactionReconApi.get(reconciliationItemId, accessToken);
      setDetail(row);
    } catch (error) {
      if (!handleDashboardApiError(error)) {
        setDetail(null);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, reconciliationItemId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <DashboardPage
      title={t("detail.title")}
      subtitle={t("detail.reconScopeOrder")}
      contentMode="table"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push(`/${locale}/dashboard/money/transaction-reconciliation`)}
        >
          {t("detail.back")}
        </Button>
      }
    >
      {loading ? (
        <Skeleton active />
      ) : detail ? (
        <TransactionReconDetailView detail={detail} />
      ) : (
        <Space>{t("detail.notFound")}</Space>
      )}
    </DashboardPage>
  );
}
