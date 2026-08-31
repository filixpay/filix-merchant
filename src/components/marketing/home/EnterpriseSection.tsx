"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import styles from "@/app/[locale]/home.module.css";

export default function EnterpriseSection() {
  const t = useTranslations("Home.enterprise_section");
  const locale = useLocale();

  return (
    <section className={styles.coreCapabilities}>
      <div className={styles.sectionHeader}>
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>
      <div className={styles.capabilitiesContainerTwoCol}>
        {(["multi_org", "multi_merchant", "rbac", "isolation"] as const).map((key) => (
          <div key={key} className={styles.capabilityCard}>
            <h3>{t(`items.${key}.title`)}</h3>
            <p>{t(`items.${key}.desc`)}</p>
          </div>
        ))}
      </div>
      <div className={styles.heroActions} style={{ justifyContent: "center", marginTop: 32 }}>
        <Link href={`/${locale}/for-enterprise`} className={styles.btnPrimary}>
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
