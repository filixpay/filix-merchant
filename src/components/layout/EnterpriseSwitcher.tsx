"use client";

import { useState } from "react";
import { Skeleton } from "antd";
import { useTranslations } from "next-intl";
import styles from "./OrganizationSwitcher.module.css";
import { BuildingOffice2Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { DiscoverableEnterpriseView } from "@/lib/api";
import {
    enterpriseCodeToString,
    getStoredSelectedEnterpriseCode,
} from "./enterprise-shell";

interface EnterpriseSwitcherProps {
    enterprises: DiscoverableEnterpriseView[];
    selectedEnterpriseCode: string | null;
    loading?: boolean;
    onSelect: (enterprise: DiscoverableEnterpriseView) => void;
    variant?: "sidebar" | "header";
}

export default function EnterpriseSwitcher({
    enterprises,
    selectedEnterpriseCode,
    loading = false,
    onSelect,
    variant = "sidebar",
}: EnterpriseSwitcherProps) {
    const t = useTranslations("Layout.enterprise");
    const [isOpen, setIsOpen] = useState(false);

    const resolvedCode = selectedEnterpriseCode ?? getStoredSelectedEnterpriseCode();
    const currentEnterprise = enterprises.find(
        (item) => enterpriseCodeToString(item.enterpriseCode) === resolvedCode,
    );

    const handleSelect = (enterprise: DiscoverableEnterpriseView) => {
        if (enterpriseCodeToString(enterprise.enterpriseCode) === resolvedCode) {
            setIsOpen(false);
            return;
        }
        onSelect(enterprise);
        setIsOpen(false);
    };

    if (loading && enterprises.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.label}>{t("current_enterprise")}</div>
                <div className={styles.summarySkeleton}>
                    <Skeleton active paragraph={{ rows: 1 }} title={false} />
                </div>
            </div>
        );
    }

    if (enterprises.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.container} ${variant === "header" ? styles.headerContainer : ""}`}>
            <div className={styles.label}>{t("current_enterprise")}</div>
            <div className={styles.switcher}>
                <button
                    type="button"
                    className={`${styles.summary} ${isOpen ? styles.active : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className={styles.summaryContent}>
                        <div className={styles.summaryIcon}>
                            <BuildingOffice2Icon className={styles.icon} />
                        </div>
                        <div className={styles.summaryText}>
                            <div className={styles.summaryTitle}>
                                {currentEnterprise?.name || t("current_enterprise")}
                            </div>
                            {variant !== "header" && currentEnterprise && (
                                <div className={styles.summaryDesc}>
                                    {t("enterprise_code")}: {enterpriseCodeToString(currentEnterprise.enterpriseCode)}
                                </div>
                            )}
                        </div>
                    </div>
                    <ChevronDownIcon className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`} />
                </button>

                {isOpen && (
                    <div className={`${styles.dropdown} ${variant === "header" ? styles.headerDropdown : ""}`}>
                        {enterprises.map((enterprise) => {
                            const code = enterpriseCodeToString(enterprise.enterpriseCode);
                            const isSelected = code === resolvedCode;
                            return (
                                <button
                                    type="button"
                                    key={code}
                                    className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                                    onClick={() => handleSelect(enterprise)}
                                >
                                    <div className={styles.optionIcon}>
                                        <BuildingOffice2Icon className={styles.icon} />
                                    </div>
                                    <div className={styles.optionContent}>
                                        <div className={styles.optionTitle}>{enterprise.name}</div>
                                        <div className={styles.optionDesc}>
                                            {t("enterprise_code")}: {code} · {enterprise.kind}
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
