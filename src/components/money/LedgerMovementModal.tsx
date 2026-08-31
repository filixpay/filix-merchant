"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal, Pagination } from "antd";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import type { MerchantPortalBucket } from "@/lib/api/domains/merchants";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import {
  toMerchantLedgerMovementRow,
  type MerchantLedgerMovementRow,
} from "@/lib/money/ledger-movement-display";
import { presentLedgerMovementLabel } from "@/lib/money/ledger-movement-labels";
import AssetFlagIcon from "@/components/money/AssetFlagIcon";
import LedgerMovementTable from "./LedgerMovementTable";
import styles from "./LedgerMovementModal.module.css";

interface LedgerMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessToken: string;
  bucket: MerchantPortalBucket;
  assetCode: string;
}

export default function LedgerMovementModal({
  isOpen,
  onClose,
  accessToken,
  bucket,
  assetCode,
}: LedgerMovementModalProps) {
  const [movements, setMovements] = useState<MerchantLedgerMovementRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const t = useTranslations("MoneyBalance.movements");
  const bucketLabel = presentLedgerMovementLabel(t, t.has, "buckets", bucket);

  const loadMovements = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const res = await api.merchants.getLedgerMovements(
        { bucket, assetCode, page: pageNumber, size: pageSize },
        accessToken,
      );
      const page = normalizePagedResponse(res);
      setMovements(page.items.map(toMerchantLedgerMovementRow));
      setTotal(page.total);
    } catch (err) {
      console.error(err);
      setMovements([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [accessToken, assetCode, bucket, pageNumber, isOpen]);

  useEffect(() => {
    if (isOpen) {
      void loadMovements();
    }
  }, [isOpen, loadMovements]);

  useEffect(() => {
    if (isOpen) {
      setPageNumber(0);
    }
  }, [isOpen, bucket, assetCode]);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={880}
      centered
      destroyOnHidden
      className={styles.modal}
      title={null}
      closable={false}
    >
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h3 className={styles.headerTitle}>{t("title")}</h3>
          <span className={styles.headerBadge}>
            <AssetFlagIcon assetCode={assetCode} className={styles.headerFlag} size={16} />
            <span>{assetCode}</span>
            <span className={styles.headerBadgeDot} aria-hidden>
              •
            </span>
            <span>{bucketLabel}</span>
          </span>
        </div>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div className={styles.body}>
        <LedgerMovementTable
          movements={movements}
          loading={loading}
          emptyText={t("empty")}
          page={pageNumber}
          pageSize={pageSize}
          total={total}
          onPageChange={setPageNumber}
          hideFooterPagination
        />
      </div>

      <div className={styles.footer}>
        <span className={styles.footerCount}>{t("total_count", { count: total })}</span>
        <Pagination
          size="small"
          current={pageNumber + 1}
          pageSize={pageSize}
          total={total}
          showSizeChanger={false}
          onChange={(p) => setPageNumber(p - 1)}
        />
      </div>
    </Modal>
  );
}
