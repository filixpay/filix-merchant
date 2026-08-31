"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";
import styles from "./LanguageSwitcher.module.css";

const languages = [
    { code: "en", name: "EN", label: "English" },
    { code: "zh", name: "中文", label: "中文" },
    { code: "es", name: "ES", label: "Español" },
    { code: "fr", name: "FR", label: "Français" },
    { code: "de", name: "DE", label: "Deutsch" },
    { code: "ja", name: "日本語", label: "日本語" },
    { code: "ko", name: "한국어", label: "한국어" },
    { code: "ar", name: "AR", label: "العربية" },
    { code: "pt", name: "PT", label: "Português" },
];

type LanguageSwitcherProps = {
    variant?: "default" | "header";
};

export default function LanguageSwitcher({ variant = "default" }: LanguageSwitcherProps) {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    const handleLanguageChange = (newLocale: string) => {
        const segments = pathname.split("/");
        segments[1] = newLocale;
        router.push(segments.join("/"));
    };

    const currentLanguage = languages.find((lang) => lang.code === currentLocale) ?? languages[0];

    if (variant === "header") {
        const menuItems: MenuProps["items"] = languages.map((lang) => ({
            key: lang.code,
            label: (
                <span className={styles.headerMenuItem}>
                    <span>{lang.label}</span>
                    {lang.code === currentLocale ? <Check size={14} strokeWidth={2} /> : null}
                </span>
            ),
        }));

        return (
            <Dropdown
                menu={{
                    items: menuItems,
                    onClick: ({ key }) => handleLanguageChange(String(key)),
                }}
                trigger={["click"]}
                placement="bottomRight"
            >
                <button
                    type="button"
                    className={styles.headerTrigger}
                    aria-label="Select language"
                >
                    <Globe size={16} strokeWidth={1.5} />
                    <span>{currentLanguage.name}</span>
                    <ChevronDown size={12} strokeWidth={1.75} className={styles.headerChevron} />
                </button>
            </Dropdown>
        );
    }

    return (
        <div className={styles.container}>
            <select
                value={currentLocale}
                onChange={(event) => handleLanguageChange(event.target.value)}
                className={styles.select}
                aria-label="Select language"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
