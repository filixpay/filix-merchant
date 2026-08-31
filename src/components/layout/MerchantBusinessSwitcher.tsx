"use client";

import { useState } from "react";
import { Skeleton } from "antd";
import { useTranslations } from "next-intl";
import styles from "./OrganizationSwitcher.module.css";
import { BuildingStorefrontIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { OrganizationMerchantView } from "@/lib/api";
import {
    getStoredSelectedMerchantCode,
    merchantCodeToString,
} from "./organization-merchant-shell";

interface MerchantBusinessSwitcherProps {
    merchants: OrganizationMerchantView[];
    selectedMerchantCode: string | null;
    loading?: boolean;
    onSelect: (merchant: OrganizationMerchantView) => void;
    variant?: "sidebar" | "header";
}

export default function MerchantBusinessSwitcher({
    merchants,
    selectedMerchantCode,
    loading = false,
    onSelect,
    variant = "sidebar",
}: MerchantBusinessSwitcherProps) {
    const t = useTranslations("Layout.business_account");
    const [isOpen, setIsOpen] = useState(false);

    // Spec F1: hide switcher when only one business account.
    if (!loading && merchants.length <= 1) {
        return null;
    }

    const resolvedCode = selectedMerchantCode ?? getStoredSelectedMerchantCode();
    const currentMerchant = merchants.find(
        (merchant) => merchantCodeToString(merchant.merchantCode) === resolvedCode,
    );

    const handleSelect = (merchant: OrganizationMerchantView) => {
        if (merchantCodeToString(merchant.merchantCode) === resolvedCode) {
            setIsOpen(false);
            return;
        }
        onSelect(merchant);
        setIsOpen(false);
    };

    const modeLabel = (mode: OrganizationMerchantView["settlementMode"]) =>
        mode === "PLATFORM" ? t("mode.platform") : t("mode.direct");

    if (loading && merchants.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.label}>{t("current_account")}</div>
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
            <div className={styles.label}>{t("current_account")}</div>
            <div className={styles.switcher}>
                <button
                    type="button"
                    className={`${styles.summary} ${isOpen ? styles.active : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className={styles.summaryContent}>
                        <div className={styles.summaryIcon}>
                            <BuildingStorefrontIcon className={styles.icon} />
                        </div>
                        <div className={styles.summaryText}>
                            <div className={styles.summaryTitle}>
                                {currentMerchant?.name || t("current_account")}
                            </div>
                            {variant !== "header" && currentMerchant && (
                                <div className={styles.summaryDesc}>
                                    {modeLabel(currentMerchant.settlementMode)}
                                </div>
                            )}
                        </div>
                    </div>
                    <ChevronDownIcon className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`} />
                </button>

                {isOpen && (
                    <div
                        className={`${styles.dropdown} ${variant === "header" ? styles.headerDropdown : ""}`}
                    >
                        {merchants.map((merchant) => {
                            const code = merchantCodeToString(merchant.merchantCode);
                            const isSelected = code === resolvedCode;
                            return (
                                <button
                                    type="button"
                                    key={code}
                                    className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                                    onClick={() => handleSelect(merchant)}
                                >
                                    <div className={styles.optionIcon}>
                                        <BuildingStorefrontIcon className={styles.icon} />
                                    </div>
                                    <div className={styles.optionContent}>
                                        <div className={styles.optionTitle}>{merchant.name}</div>
                                        <div className={styles.optionDesc}>
                                            {modeLabel(merchant.settlementMode)} · {code}
                                        </div>
                                    </div>
                                    {isSelected && <CheckCircleIcon className={styles.checkIcon} />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
