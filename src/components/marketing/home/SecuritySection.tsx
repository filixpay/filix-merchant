"use client";

import { useTranslations } from "next-intl";
import styles from "@/app/[locale]/home.module.css";

export default function SecuritySection() {
  const t = useTranslations("Home.security_section");

  return (
    <section className={styles.riskSection}>
      <div className={styles.sectionHeader}>
        <h2>{t("title")}</h2>
        <p>{t("subtitle")}</p>
      </div>
      <div className={styles.pipelineContainer}>
        {(["compliance", "controls", "audit"] as const).map((key) => (
          <div key={key} className={styles.pipelineStep}>
            <h3>{t(`items.${key}.title`)}</h3>
            <p>{t(`items.${key}.desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
