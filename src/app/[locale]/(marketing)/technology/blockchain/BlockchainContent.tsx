"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import styles from "@/components/marketing/marketing.module.css";

export default function BlockchainContent() {
  const t = useTranslations("Pages.blockchain");
  const locale = useLocale();

  return (
    <MarketingPage
      badge={t("deprecated.badge")}
      heroTitle={t("deprecated.title")}
      heroDesc={t("deprecated.desc")}
      heroDescExtra={t("deprecated.extra")}
      heroPrimaryText={t("deprecated.cta")}
      heroPrimaryHref={`/${locale}/products/payment-platform`}
      ctaTitle={t("deprecated.cta_title")}
      ctaDesc={t("deprecated.cta_desc")}
      ctaButtonText={t("deprecated.cta")}
      ctaButtonHref={`/${locale}/products/payment-platform`}
    >
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t("deprecated.notice_title")}</h2>
            <p className={styles.sectionSubtitle}>{t("deprecated.notice_body")}</p>
          </div>
          <p>
            <Link href={`/${locale}/products/payment-platform`} className={styles.link}>
              {t("deprecated.cta")}
            </Link>
          </p>
        </div>
      </section>
    </MarketingPage>
  );
}
