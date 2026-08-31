"use client";

import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Link from "next/link";
import {
  parsePortalQuery,
  resolveLoginCallbackUrl,
  type PortalId,
} from "@/lib/auth/portal-entry";

function LoginForm() {
  const [loadingPortal, setLoadingPortal] = useState<PortalId | null>(null);
  const t = useTranslations("Login");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl");
  const highlighted = parsePortalQuery(searchParams.get("portal"));

  const handlePortalLogin = async (portal: PortalId) => {
    setLoadingPortal(portal);
    try {
      const callbackUrl = resolveLoginCallbackUrl({
        locale,
        selectedPortal: portal,
        rawCallbackUrl,
      });
      await signIn("keycloak", { callbackUrl });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoadingPortal(null);
    }
  };

  const busy = loadingPortal !== null;

  return (
    <div className={styles.card}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="FilixPay" className={styles.logoImg} />
      </div>
      <h1 className={styles.title}>{t("title")}</h1>
      <p className={styles.subtitle}>{t("subtitle")}</p>

      <div className={styles.portalGrid}>
        <div
          className={`${styles.portalCard} ${
            highlighted === "merchant" ? styles.portalCardHighlighted : ""
          }`}
        >
          <h2 className={styles.portalTitle}>{t("merchant_title")}</h2>
          <p className={styles.portalBody}>{t("merchant_body")}</p>
          <button
            type="button"
            className={styles.button}
            onClick={() => handlePortalLogin("merchant")}
            disabled={busy}
          >
            <span>
              {loadingPortal === "merchant" ? t("connecting") : t("merchant_cta")}
            </span>
          </button>
        </div>

        <div
          className={`${styles.portalCard} ${
            highlighted === "enterprise" ? styles.portalCardHighlighted : ""
          }`}
        >
          <h2 className={styles.portalTitle}>{t("enterprise_title")}</h2>
          <p className={styles.portalBody}>{t("enterprise_body")}</p>
          <button
            type="button"
            className={styles.button}
            onClick={() => handlePortalLogin("enterprise")}
            disabled={busy}
          >
            <span>
              {loadingPortal === "enterprise"
                ? t("connecting")
                : t("enterprise_cta")}
            </span>
          </button>
        </div>
      </div>

      <Link href={`/${locale}`} className={styles.backLink}>
        {t("back_to_home")}
      </Link>

      <div className={styles.footer}>
        <a href="#">Help</a> &middot; <a href="#">Privacy</a> &middot;{" "}
        <a href="#">Terms</a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const tCommon = useTranslations("Common");

  return (
    <div className={styles.container}>
      <div
        style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 100 }}
      >
        <LanguageSwitcher />
      </div>

      <div className={styles.blob}></div>
      <div className={styles.blob}></div>

      <Suspense fallback={<div className={styles.card}>{tCommon("loading")}</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
