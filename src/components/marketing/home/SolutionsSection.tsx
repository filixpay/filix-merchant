"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import styles from "@/app/[locale]/home.module.css";

const cards = [
  { key: "cross_border", href: "/products/payment-platform" },
  { key: "platform", href: "/products/payment-splitting" },
  { key: "enterprise", href: "/for-enterprise" },
  { key: "infrastructure_partner", href: "/developers" },
] as const;

export default function SolutionsSection() {
  const t = useTranslations("Home.solutions_section");
  const locale = useLocale();

  return (
    <section className={styles.businessModes}>
      <div className={styles.modesContainer}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.modesTitle}>{t("title")}</h2>
          <p className={styles.modesSubtitle}>{t("subtitle")}</p>
        </div>
        <div className={styles.modesGrid}>
          {cards.map((card) => (
            <Link
              key={card.key}
              href={`/${locale}${card.href}`}
              className={styles.modeCard}
            >
              <h3 className={styles.modeName}>{t(`items.${card.key}.title`)}</h3>
              <p className={styles.modeDesc}>{t(`items.${card.key}.desc`)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
