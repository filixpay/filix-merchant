"use client";

import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { ChevronDown, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./layout.module.css";

type UserMenuProps = {
    email?: string | null;
    avatarLetter?: string;
    onLogout: () => void;
};

function emailLocalPart(email?: string | null): string {
    if (!email) {
        return "User";
    }
    const local = email.split("@")[0]?.trim();
    return local || email;
}

export default function UserMenu({ email, avatarLetter = "U", onLogout }: UserMenuProps) {
    const t = useTranslations("Layout");

    const menuItems: MenuProps["items"] = [
        {
            key: "email",
            label: (
                <div className={styles.userMenuEmail} title={email ?? undefined}>
                    {email ?? t("logout")}
                </div>
            ),
            disabled: true,
        },
        { type: "divider" },
        {
            key: "logout",
            label: (
                <span className={styles.userMenuLogoutLabel}>
                    <LogOut size={14} strokeWidth={1.75} />
                    {t("logout")}
                </span>
            ),
            danger: true,
        },
    ];

    return (
        <Dropdown
            menu={{
                items: menuItems,
                onClick: ({ key }) => {
                    if (key === "logout") {
                        onLogout();
                    }
                },
            }}
            trigger={["click"]}
            placement="bottomRight"
        >
            <button type="button" className={styles.userMenuTrigger} aria-label={t("logout")}>
                <Avatar className={styles.avatar}>{avatarLetter}</Avatar>
                <span className={styles.userMenuName}>{emailLocalPart(email)}</span>
                <ChevronDown size={12} strokeWidth={1.75} className={styles.userMenuChevron} />
            </button>
        </Dropdown>
    );
}
