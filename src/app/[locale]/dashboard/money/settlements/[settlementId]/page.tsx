"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Skeleton, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import DashboardPage from "@/components/layout/DashboardPage";
import SettlementDetailView from "@/components/settlements/SettlementDetailView";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { settlementsApi, type SettlementDetail } from "@/lib/settlements/api";

export default function SettlementDetailPage() {
  const t = useTranslations("Settlements");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ settlementId: string }>();
  const settlementId = params?.settlementId ?? "";
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [detail, setDetail] = useState<SettlementDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!accessToken || !settlementId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const row = await settlementsApi.get(settlementId, accessToken);
      setDetail(row);
    } catch (error) {
      if (!handleDashboardApiError(error)) {
        setDetail(null);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, settlementId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <DashboardPage
      title={t("detail.title")}
      contentMode="table"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push(`/${locale}/dashboard/money/settlements`)}
        >
          {t("detail.back")}
        </Button>
      }
    >
      {loading ? (
        <Skeleton active />
      ) : detail ? (
        <SettlementDetailView detail={detail} />
      ) : (
        <Space>{t("detail.notFound")}</Space>
      )}
    </DashboardPage>
  );
}
