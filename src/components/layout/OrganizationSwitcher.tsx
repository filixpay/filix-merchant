"use client";

import { useState } from "react";
import { Skeleton } from "antd";
import { useTranslations } from "next-intl";
import styles from "./OrganizationSwitcher.module.css";
import { BuildingOffice2Icon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { OrganizationSummaryView } from "@/lib/api";
import { getStoredSelectedOrganizationCode, organizationCodeToString } from "./organization-shell";

interface OrganizationSwitcherProps {
    organizations: OrganizationSummaryView[];
    selectedOrganizationCode: string | null;
    loading?: boolean;
    onSelect: (organization: OrganizationSummaryView) => void;
    variant?: "sidebar" | "header";
}

export default function OrganizationSwitcher({
    organizations,
    selectedOrganizationCode,
    loading = false,
    onSelect,
    variant = "sidebar",
}: OrganizationSwitcherProps) {
    const t = useTranslations("Layout.organization");
    const [isOpen, setIsOpen] = useState(false);

    const resolvedCode = selectedOrganizationCode ?? getStoredSelectedOrganizationCode();
    const currentOrganization = organizations.find(
        (org) => organizationCodeToString(org.code) === resolvedCode,
    );

    const handleSelect = (organization: OrganizationSummaryView) => {
        if (organizationCodeToString(organization.code) === resolvedCode) {
            setIsOpen(false);
            return;
        }
        onSelect(organization);
        setIsOpen(false);
    };

    if (loading && organizations.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.label}>{t("current_organization")}</div>
                <div className={styles.summarySkeleton}>
                    <Skeleton active paragraph={{ rows: 1 }} title={false} />
                </div>
            </div>
        );
    }

    // Hide when only one org — same gate as MerchantBusinessSwitcher (Spec F1).
    if (organizations.length <= 1) {
        return null;
    }

    const formatRoles = (roles: OrganizationSummaryView["roles"]) =>
        roles.length ? roles.join(", ") : t("no_roles");

    return (
        <div className={`${styles.container} ${variant === "header" ? styles.headerContainer : ""}`}>
            <div className={styles.label}>{t("current_organization")}</div>
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
                                {currentOrganization?.name || t("current_organization")}
                            </div>
                            {variant !== "header" && currentOrganization && (
                                <div className={styles.summaryDesc}>
                                    {t("org_code")}: {organizationCodeToString(currentOrganization.code)}
                                </div>
                            )}
                        </div>
                    </div>
                    <ChevronDownIcon className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`} />
                </button>

                {isOpen && (
                    <div className={`${styles.dropdown} ${variant === "header" ? styles.headerDropdown : ""}`}>
                        {organizations.map((organization) => {
                            const code = organizationCodeToString(organization.code);
                            const isSelected = code === resolvedCode;
                            return (
                                <button
                                    type="button"
                                    key={code}
                                    className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                                    onClick={() => handleSelect(organization)}
                                >
                                    <div className={styles.optionIcon}>
                                        <BuildingOffice2Icon className={styles.icon} />
                                    </div>
                                    <div className={styles.optionContent}>
                                        <div className={styles.optionTitle}>{organization.name}</div>
                                        <div className={styles.optionDesc}>
                                            {t("org_code")}: {code} · {formatRoles(organization.roles)}
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
