"use client";

import { useMemo, useState } from "react";
import { DatePicker, Input, Select } from "antd";
import type { Dayjs } from "dayjs";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import DashboardPage from "@/components/layout/DashboardPage";
import SettlementTable from "@/components/settlements/SettlementTable";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import {
  dayRangeToHalfOpenUtc,
  settlementsApi,
  type MerchantSettlementReconStatus,
  type SettlementListItem,
  type SettlementQuery,
} from "@/lib/settlements/api";
import styles from "./settlements-page.module.css";

const PAGE_SIZE = 20;

const RECON_OPTIONS: MerchantSettlementReconStatus[] = ["PENDING", "MATCHED", "EXCEPTION"];

export default function SettlementsPage() {
  const t = useTranslations("Settlements");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [reconStatuses, setReconStatuses] = useState<MerchantSettlementReconStatus[]>([]);
  const [asset, setAsset] = useState("");
  const [paymentIdInput, setPaymentIdInput] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [releasedRange, setReleasedRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const params = useMemo((): SettlementQuery => {
    const releasedFromDay = releasedRange?.[0]?.format("YYYY-MM-DD") ?? null;
    const releasedToDay = releasedRange?.[1]?.format("YYYY-MM-DD") ?? null;
    const { from: releasedFrom, to: releasedTo } = dayRangeToHalfOpenUtc(
      releasedFromDay,
      releasedToDay,
    );
    const trimmedPaymentId = paymentId.trim();
    return {
      reconStatus: reconStatuses.length > 0 ? reconStatuses : undefined,
      asset: asset.trim() || undefined,
      releasedFrom,
      releasedTo,
      paymentId: trimmedPaymentId || undefined,
      page,
      size: pageSize,
    };
  }, [asset, page, pageSize, paymentId, reconStatuses, releasedRange]);

  const { items, total, loading, isRefreshing, error, reload } = usePagedResource<
    SettlementListItem,
    SettlementQuery
  >({
    accessToken,
    params,
    fetcher: (query, token) => settlementsApi.list(query, token),
  });

  const filterBar = (
    <div className={styles.filterRow}>
      <Input
        allowClear
        prefix={<Search size={14} strokeWidth={2} color="#6b7280" />}
        placeholder={t("filters.paymentId")}
        style={{ width: 220, flex: "1 1 220px" }}
        value={paymentIdInput}
        onChange={(event) => {
          const next = event.target.value;
          setPaymentIdInput(next);
          if (!next) {
            setPaymentId("");
            setPage(0);
          }
        }}
        onPressEnter={() => {
          setPaymentId(paymentIdInput.trim());
          setPage(0);
        }}
        onBlur={() => {
          const next = paymentIdInput.trim();
          if (next !== paymentId) {
            setPaymentId(next);
            setPage(0);
          }
        }}
        aria-label={t("filters.paymentId")}
      />
      <Select
        mode="multiple"
        allowClear
        placeholder={t("filters.reconStatus")}
        style={{ minWidth: 180 }}
        value={reconStatuses}
        options={RECON_OPTIONS.map((value) => ({
          value,
          label: t(`reconStatus.${value}`),
        }))}
        onChange={(value) => {
          setReconStatuses(value);
          setPage(0);
        }}
        aria-label={t("filters.reconStatus")}
      />
      <Input
        allowClear
        placeholder={t("filters.asset")}
        style={{ width: 120 }}
        value={asset}
        onChange={(event) => {
          setAsset(event.target.value);
          setPage(0);
        }}
        aria-label={t("filters.asset")}
      />
      <DatePicker.RangePicker
        allowClear
        value={releasedRange}
        onChange={(range) => {
          setReleasedRange(range as [Dayjs | null, Dayjs | null] | null);
          setPage(0);
        }}
      />
    </div>
  );

  return (
    <DashboardPage
      title={t("title")}
      subtitle={t("subtitle")}
      filterBar={filterBar}
      contentMode="table"
    >
      <SettlementTable
        items={items}
        loading={loading}
        isRefreshing={isRefreshing}
        error={error}
        onRetry={reload}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(nextPage, nextSize) => {
          setPage(nextPage);
          setPageSize(nextSize);
        }}
        onOpenDetail={(id) => router.push(`/${locale}/dashboard/money/settlements/${encodeURIComponent(id)}`)}
      />
    </DashboardPage>
  );
}
