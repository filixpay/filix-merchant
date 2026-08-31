"use client";

import { useState } from "react";
import { Skeleton } from "antd";
import { useTranslations } from "next-intl";
import styles from "./IdentitySwitcher.module.css";
import { BuildingStorefrontIcon, BuildingOffice2Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { MerchantDetailView } from "@/lib/api";
import ActivatePlatformServiceModal from "./ActivatePlatformServiceModal";
import { getMerchantIdentity, type MerchantIdentity } from "./merchant-shell";

export type { MerchantIdentity };

interface IdentitySwitcherProps {
    merchants: MerchantDetailView[];
    selectedMerchantId: number | null;
    loading?: boolean;
    onSelect: (merchant: MerchantDetailView) => void;
    onMerchantsReload?: () => void;
    accessToken: string;
    variant?: "sidebar" | "header";
}

export default function IdentitySwitcher({
    merchants,
    selectedMerchantId,
    loading = false,
    onSelect,
    onMerchantsReload,
    accessToken,
    variant = "sidebar",
}: IdentitySwitcherProps) {
    const t = useTranslations("Layout.identity");
    const [isOpen, setIsOpen] = useState(false);
    const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

    const currentMerchant = merchants.find((merchant) => merchant.id === selectedMerchantId);
    const currentIdentity: MerchantIdentity = currentMerchant
        ? getMerchantIdentity(currentMerchant)
        : "independent";
    const hasThreeParty = merchants.some((merchant) => merchant.settlementMode === "PLATFORM");

    const handleSelect = (merchant: MerchantDetailView) => {
        if (selectedMerchantId === merchant.id) {
            setIsOpen(false);
            return;
        }
        onSelect(merchant);
        setIsOpen(false);
    };

    if (loading && merchants.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.label}>{t("current_identity")}</div>
                <div className={styles.summarySkeleton}>
                    <Skeleton active paragraph={{ rows: 1 }} title={false} />
                </div>
            </div>
        );
    }

    if (merchants.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.container} ${variant === "header" ? styles.headerContainer : ""}`}>
            <div className={styles.switcher}>
                <button
                    type="button"
                    className={`${styles.summary} ${isOpen ? styles.active : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className={styles.summaryContent}>
                        <div className={styles.summaryIcon}>
                            {currentIdentity === "independent" ? (
                                <BuildingStorefrontIcon className={styles.icon} />
                            ) : (
                                <BuildingOffice2Icon className={styles.icon} />
                            )}
                        </div>
                        <div className={styles.summaryText}>
                            <div className={styles.summaryTitle}>
                                {variant === "header"
                                    ? currentMerchant?.alias || t("current_identity")
                                    : currentMerchant?.alias || currentMerchant?.name || t("current_identity")}
                            </div>
                            {variant !== "header" && currentMerchant && (
                                <div className={styles.summaryDesc}>
                                    {currentMerchant.settlementMode === "DIRECT"
                                        ? t("independent.desc")
                                        : t("sub_merchant.desc")}
                                </div>
                            )}
                        </div>
                    </div>
                    <ChevronDownIcon className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`} />
                </button>

                {isOpen && (
                    <div className={`${styles.dropdown} ${variant === "header" ? styles.headerDropdown : ""}`}>
                        {merchants.map((merchant) => (
                            <button
                                type="button"
                                key={merchant.id}
                                className={`${styles.option} ${selectedMerchantId === merchant.id ? styles.selected : ""}`}
                                onClick={() => handleSelect(merchant)}
                            >
                                <div className={styles.optionIcon}>
                                    {merchant.settlementMode === "PLATFORM" ? (
                                        <BuildingOffice2Icon className={styles.icon} />
                                    ) : (
                                        <BuildingStorefrontIcon className={styles.icon} />
                                    )}
                                </div>
                                <div className={styles.optionContent}>
                                    <div className={styles.optionTitle}>{merchant.alias || merchant.name}</div>
                                    <div className={styles.optionDesc}>
                                        {merchant.settlementMode === "DIRECT"
                                            ? t("independent.desc")
                                            : t("sub_merchant.desc")}
                                    </div>
                                </div>
                                {selectedMerchantId === merchant.id && (
                                    <CheckCircleIcon className={styles.checkIcon} />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {variant === "sidebar" && !hasThreeParty && currentIdentity === "independent" && (
                <button
                    type="button"
                    className={styles.activateBtn}
                    onClick={() => setIsActivateModalOpen(true)}
                >
                    {t("open_platform_service")}
                </button>
            )}

            <ActivatePlatformServiceModal
                isOpen={isActivateModalOpen}
                onClose={() => setIsActivateModalOpen(false)}
                onSuccess={() => {
                    setIsActivateModalOpen(false);
                    onMerchantsReload?.();
                }}
                accessToken={accessToken}
                merchantName={currentMerchant?.name || ""}
            />
        </div>
    );
}
