"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

/** Legacy Money-In methods tab → Funds > Digital currency. */
export default function MoneyInMethodsRedirectPage() {
    const locale = useLocale();
    const router = useRouter();

    useEffect(() => {
        router.replace(`/${locale}/dashboard/money/crypto`);
    }, [locale, router]);

    return null;
}
