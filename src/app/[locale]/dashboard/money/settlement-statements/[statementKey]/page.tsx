"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Skeleton, Space } from "antd";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import DashboardPage from "@/components/layout/DashboardPage";
import SettlementStatementDetailView from "@/components/settlement-statements/SettlementStatementDetailView";
import detailStyles from "@/components/settlement-statements/SettlementStatementDetailView.module.css";
import { downloadReportBlob } from "@/components/reporting/download-report-blob";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import {
  isPeriodNotStartedError,
  settlementStatementsApi,
  type SettlementStatementDetail,
} from "@/lib/settlement-statements/api";

function formatDateTime(value: string | undefined | null, locale: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export default function SettlementStatementDetailPage() {
  const t = useTranslations("SettlementStatements");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<{ statementKey: string }>();
  const rawKey = params?.statementKey;
  const statementKey =
    typeof rawKey === "string" ? decodeURIComponent(rawKey) : Array.isArray(rawKey) ? decodeURIComponent(rawKey[0] ?? "") : "";
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [detail, setDetail] = useState<SettlementStatementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodNotStarted, setPeriodNotStarted] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken || !statementKey) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setPeriodNotStarted(false);
    try {
      const row = await settlementStatementsApi.get(statementKey, accessToken);
      setDetail(row);
    } catch (error) {
      if (isPeriodNotStartedError(error)) {
        setPeriodNotStarted(true);
        setDetail(null);
        return;
      }
      if (!handleDashboardApiError(error)) {
        setDetail(null);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, statementKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const onDownload = async () => {
    if (!accessToken || !statementKey) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const blob = await settlementStatementsApi.downloadXlsx(statementKey, accessToken);
      const filename = `settlement-statement-${statementKey.replace(/:/g, "-")}.xlsx`;
      downloadReportBlob(blob, filename);
    } catch (error) {
      if (isPeriodNotStartedError(error)) {
        setPeriodNotStarted(true);
        setDownloadError(t("periodNotStarted"));
      } else if (!handleDashboardApiError(error)) {
        setDownloadError(t("downloadError"));
      }
    } finally {
      setDownloading(false);
    }
  };

  const subtitle = useMemo(() => {
    if (!detail) {
      return statementKey ? <span className={detailStyles.keyChip}>{statementKey}</span> : undefined;
    }
    const { summary } = detail;
    return (
      <div className={detailStyles.subtitleBlock}>
        <span className={detailStyles.keyChip}>
          {summary.assetCode} : {summary.periodKind} : {summary.periodKey}
        </span>
        <span className={detailStyles.windowLine}>
          {t("detail.window")}: {formatDateTime(summary.startInstant, locale)} →{" "}
          {formatDateTime(summary.effectiveEnd ?? summary.endInstant, locale)} ({summary.timezone})
        </span>
      </div>
    );
  }, [detail, locale, statementKey, t]);

  return (
    <DashboardPage
      title={t("detail.title")}
      subtitle={subtitle}
      contentMode="table"
      extra={
        <Space wrap>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(`/${locale}/dashboard/money/settlement-statements`)}
          >
            {t("detail.back")}
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloading}
            disabled={!detail || periodNotStarted}
            onClick={() => void onDownload()}
          >
            {t("detail.download")}
          </Button>
        </Space>
      }
    >
      {downloadError ? (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message={downloadError}
        />
      ) : null}
      {loading ? (
        <Skeleton active />
      ) : periodNotStarted ? (
        <Alert type="warning" showIcon message={t("periodNotStarted")} />
      ) : detail ? (
        <SettlementStatementDetailView detail={detail} />
      ) : (
        <Space>{t("detail.notFound")}</Space>
      )}
    </DashboardPage>
  );
}
