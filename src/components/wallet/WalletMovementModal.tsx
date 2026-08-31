"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "antd";
import { useTranslations } from "next-intl";
import { api, toWalletMovementRow, type WalletMovementRow, type WalletPortalBucket } from "@/lib/api";
import WalletMovementTable from "./WalletMovementTable";

interface WalletMovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    accessToken: string;
    bucket: WalletPortalBucket;
    assetCode?: string;
    titleLabel: string;
}

export default function WalletMovementModal({
    isOpen,
    onClose,
    accessToken,
    bucket,
    assetCode = "CNY",
    titleLabel,
}: WalletMovementModalProps) {
    const [movements, setMovements] = useState<WalletMovementRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [total, setTotal] = useState(0);
    const pageSize = 20;

    const t = useTranslations("Balance");

    const loadMovements = useCallback(async () => {
        if (!isOpen) return;
        setLoading(true);
        try {
            const res = await api.walletReads.getMovements(
                { bucket, assetCode, page: pageNumber, size: pageSize },
                accessToken,
            );
            setMovements((res.data ?? []).map(toWalletMovementRow));
            setTotal(res.total ?? 0);
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
            loadMovements();
        }
    }, [isOpen, loadMovements]);

    useEffect(() => {
        if (isOpen) {
            setPageNumber(0);
        }
    }, [isOpen, bucket, assetCode]);

    return (
        <Modal
            title={`${t("movements.title")} - ${titleLabel}`}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={1000}
            destroyOnHidden
        >
            <WalletMovementTable
                movements={movements}
                loading={loading}
                page={pageNumber}
                pageSize={pageSize}
                total={total}
                onPageChange={setPageNumber}
            />
        </Modal>
    );
}
