"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import styles from "@/app/[locale]/dashboard/onboarding/apply/onboarding-apply.module.css";

export default function OnboardingAgreementSection() {
  const t = useTranslations("Onboarding.agreement");
  const locale = useLocale();

  return (
    <section className={styles.agreementSection} aria-labelledby="agreement-heading">
      <h3 id="agreement-heading" className={styles.agreementTitle}>
        {t("title")}
      </h3>
      <p className={styles.agreementIntro}>{t("intro")}</p>

      <div className={styles.feeSummary}>
        <div className={styles.feeSummaryHeading}>{t("feeHeading")}</div>
        <div className={styles.feeRow}>
          <span className={styles.feeLabel}>{t("saasLabel")}</span>
          <span className={styles.feeValue}>{t("saasValue")}</span>
        </div>
        <div className={styles.feeRow}>
          <span className={styles.feeLabel}>{t("commerceLabel")}</span>
          <span className={styles.feeValue}>{t("commerceValue")}</span>
        </div>
        <ul className={styles.feeBullets}>
          <li>{t("feeAccrual")}</li>
          <li>{t("billing")}</li>
          <li>{t("threshold")}</li>
        </ul>
        <p className={styles.feeThresholdNote}>{t("thresholdNote")}</p>
      </div>

      <ul className={styles.agreementLinks}>
        <li>
          <Link href={`/${locale}/merchant/terms`} target="_blank" rel="noopener noreferrer">
            {t("linkServiceAgreement")}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/merchant/fees`} target="_blank" rel="noopener noreferrer">
            {t("linkFeeRules")}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer">
            {t("linkPrivacy")}
          </Link>
        </li>
      </ul>
    </section>
  );
}
