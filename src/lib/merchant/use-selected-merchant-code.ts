"use client";

import { useEffect, useState } from "react";
import { getStoredSelectedMerchantCode } from "@/lib/merchant/selected-merchant-code";
import { subscribeMerchantCodeChanged } from "@/lib/merchant/merchant-code-events";

/**
 * Reactive selected merchant code for portal headers.
 * localStorage alone does not re-render — subscribe to persist events.
 */
export function useSelectedMerchantCode(): string | null {
    const [code, setCode] = useState<string | null>(() => getStoredSelectedMerchantCode());

    useEffect(() => {
        setCode(getStoredSelectedMerchantCode());
        return subscribeMerchantCodeChanged((next) => {
            setCode(next ?? getStoredSelectedMerchantCode());
        });
    }, []);

    return code;
}
