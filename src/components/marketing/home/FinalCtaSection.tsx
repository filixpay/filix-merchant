"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CONTACT_CONFIG } from "@/lib/constants";
import styles from "@/app/[locale]/home.module.css";

export default function FinalCtaSection() {
  const t = useTranslations("Home.final_cta");
  const locale = useLocale();

  return (
    <section className={styles.trialExperience}>
      <div className={styles.trialContainer}>
        <h2 className={styles.trialTitle}>{t("title")}</h2>
        <p className={styles.trialSubtitle}>{t("subtitle")}</p>
        <div className={styles.heroActions} style={{ justifyContent: "center" }}>
          <Link href={`/${locale}/login?portal=merchant`} className={styles.btnPrimary}>
            {t("start")}
          </Link>
          <Link href={`/${locale}/developers`} className={styles.btnSecondary}>
            {t("docs")}
          </Link>
          <a
            href={`mailto:${CONTACT_CONFIG.investEmail}`}
            className={styles.btnSecondary}
          >
            {t("contact")}
          </a>
        </div>
      </div>
    </section>
  );
}
