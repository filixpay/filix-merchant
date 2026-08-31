"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import styles from "@/app/[locale]/home.module.css";

const items = [
  {
    key: "payment_infrastructure",
    href: "/products/payment-platform",
  },
  {
    key: "merchant_platform",
    href: "/products/merchant-center",
  },
  {
    key: "transaction_management",
    href: "/products/payment-platform#transactions",
  },
  {
    key: "settlement",
    href: "/products/payment-splitting",
  },
  {
    key: "developer",
    href: "/developers",
  },
  {
    key: "risk_control",
    href: "/products/risk-control",
  },
] as const;

export default function CoreCapabilitiesSection() {
  const t = useTranslations("Home.core_capabilities_v2");
  const locale = useLocale();

  return (
    <section id="capabilities" className={styles.coreCapabilities}>
      <div className={styles.sectionHeader}>
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>
      <div className={styles.capabilitiesContainer}>
        {items.map((item) => (
          <Link
            key={item.key}
            href={`/${locale}${item.href}`}
            className={styles.capabilityCard}
          >
            <h3>{t(`items.${item.key}.title`)}</h3>
            <p>{t(`items.${item.key}.desc`)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
