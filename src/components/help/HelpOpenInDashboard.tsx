"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import type { HelpDashboardLink } from "@/content/help/types";
import styles from "./help.module.css";

type Props = {
  locale: string;
  links: HelpDashboardLink[];
};

function dashboardTargetHref(locale: string, path: string): string {
  return `/${locale}${path}`;
}

function resolveHref(
  locale: string,
  path: string,
  authenticated: boolean,
): string {
  const target = dashboardTargetHref(locale, path);
  if (authenticated) {
    return target;
  }
  return `/${locale}/login?callbackUrl=${encodeURIComponent(target)}`;
}

export default function HelpOpenInDashboard({ locale, links }: Props) {
  const t = useTranslations("Help");
  const { status } = useSession();
  const authenticated = status === "authenticated";

  if (!links.length) {
    return null;
  }

  const sorted = [...links].sort((a, b) => {
    const aPrimary = a.primary ? 0 : 1;
    const bPrimary = b.primary ? 0 : 1;
    return aPrimary - bPrimary;
  });

  const multi = sorted.length > 1;
  const primaryIndex = sorted.findIndex((link) => link.primary === true);
  const effectivePrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0;

  return (
    <div className={styles.openCtaGroup}>
      {sorted.map((link, index) => {
        const isPrimary = index === effectivePrimaryIndex;
        const label = multi
          ? t(`dashboardLinks.${link.labelKey}`)
          : t("open_in_merchant_center");
        const href = resolveHref(locale, link.path, authenticated);

        return (
          <Link
            key={`${link.path}-${link.labelKey}`}
            href={href}
            className={
              isPrimary ? styles.openCtaPrimary : styles.openCtaSecondary
            }
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
