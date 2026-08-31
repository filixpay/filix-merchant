"use client";

import { Button } from "antd";
import { Menu as MenuIcon } from "lucide-react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NotificationBell from "@/components/notifications/NotificationBell";
import { buildDashboardBreadcrumbs } from "./dashboard-breadcrumb";
import DashboardBreadcrumb from "./DashboardBreadcrumb";
import type { DashboardMenuItem } from "./dashboard-menu";
import UserMenu from "./UserMenu";
import styles from "./layout.module.css";

type DashboardHeaderProps = {
    menuModel: DashboardMenuItem[];
    locale: string;
    session: Session | null;
    onMobileMenuToggle: () => void;
    onLogout: () => void;
};

export default function DashboardHeader({
    menuModel,
    locale,
    session,
    onMobileMenuToggle,
    onLogout,
}: DashboardHeaderProps) {
    const pathname = usePathname();
    const breadcrumbItems = useMemo(
        () => buildDashboardBreadcrumbs(menuModel, pathname, locale),
        [menuModel, pathname, locale],
    );

    const avatarLetter = session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || "U";

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <Button
                    className={styles.mobileToggle}
                    type="text"
                    icon={<MenuIcon size={20} strokeWidth={1.5} className={styles.headerIcon} />}
                    onClick={onMobileMenuToggle}
                    aria-label="Toggle menu"
                />
                <DashboardBreadcrumb items={breadcrumbItems} />
            </div>

            <div className={styles.headerRight}>
                <div className={styles.headerActions}>
                    <LanguageSwitcher variant="header" />
                    <NotificationBell triggerClassName={styles.headerIconBtn} />
                    <span className={styles.headerDivider} aria-hidden />
                    <UserMenu
                        email={session?.user?.email}
                        avatarLetter={avatarLetter}
                        onLogout={onLogout}
                    />
                </div>
            </div>
        </header>
    );
}
