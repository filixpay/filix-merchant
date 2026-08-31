"use client";

import { useEffect, useState } from "react";
import { getStoredSelectedOrganizationCode } from "@/lib/organization/selected-organization-code";
import { subscribeOrganizationCodeChanged } from "@/lib/organization/organization-code-events";

/**
 * Reactive selected org code for portal headers.
 * localStorage alone does not re-render — subscribe to persist events.
 */
export function useSelectedOrganizationCode(): string | null {
    const [code, setCode] = useState<string | null>(() =>
        getStoredSelectedOrganizationCode(),
    );

    useEffect(() => {
        setCode(getStoredSelectedOrganizationCode());
        return subscribeOrganizationCodeChanged((next) => {
            setCode(next ?? getStoredSelectedOrganizationCode());
        });
    }, []);

    return code;
}
