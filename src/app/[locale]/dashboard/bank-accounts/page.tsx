"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { legacyBankAccountsRedirectPath } from "@/lib/money/external-accounts-redirect";

/** Legacy bank-accounts hard cut → Money ExternalAccount management. */
export default function BankAccountsRedirectPage() {
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    router.replace(legacyBankAccountsRedirectPath(locale));
  }, [locale, router]);

  return null;
}
