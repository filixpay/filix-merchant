"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

type SidebarCollapseToggleProps = {
    collapsed: boolean;
    onToggle: () => void;
};

export default function SidebarCollapseToggle({
    collapsed,
    onToggle,
}: SidebarCollapseToggleProps) {
    const t = useTranslations("Layout");
    const label = collapsed ? t("sidebar_expand") : t("sidebar_collapse");

    return (
        <div
            className={`dashboard-sidebar-collapse-rail${collapsed ? " is-collapsed" : ""}`}
            aria-hidden={false}
        >
            <button
                type="button"
                className="dashboard-sidebar-collapse-toggle"
                onClick={onToggle}
                aria-label={label}
                aria-expanded={!collapsed}
            >
                {collapsed ? (
                    <ChevronRight size={14} strokeWidth={1.75} aria-hidden />
                ) : (
                    <ChevronLeft size={14} strokeWidth={1.75} aria-hidden />
                )}
                <span className="dashboard-sidebar-collapse-tooltip">{label}</span>
            </button>
        </div>
    );
}
