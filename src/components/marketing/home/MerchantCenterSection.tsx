"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import styles from "@/app/[locale]/home.module.css";

export default function MerchantCenterSection() {
  const t = useTranslations("Home.merchant_center_section");
  const locale = useLocale();

  return (
    <section className={styles.features}>
      <div className={styles.sectionHeader}>
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>
      <div className={styles.featuresContainer}>
        {(
          [
            "transactions",
            "money",
            "reporting",
            "customers",
            "risk",
            "credit",
            "account",
            "api",
          ] as const
        ).map(
          (key) => (
            <div key={key} className={styles.featureCard}>
              <h3>{t(`items.${key}.title`)}</h3>
              <p>{t(`items.${key}.desc`)}</p>
            </div>
          )
        )}
      </div>
      <div className={styles.heroActions} style={{ justifyContent: "center", marginTop: 32 }}>
        <Link
          href={`/${locale}/products/merchant-center`}
          className={styles.btnPrimary}
        >
          {t("cta_primary")}
        </Link>
        <Link href={`/${locale}/login?portal=merchant`} className={styles.btnSecondary}>
          {t("cta_secondary")}
        </Link>
      </div>
    </section>
  );
}
