"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { countUnreadSupportReplies } from "./support-seen-state";

const POLL_INTERVAL_MS = 60_000;

type Options = {
    pause?: boolean;
};

export function useSupportUnreadCount(accessToken: string | undefined, options?: Options) {
    const pause = options?.pause ?? false;
    const [count, setCount] = useState(0);

    const refresh = useCallback(async () => {
        if (!accessToken) {
            setCount(0);
            return;
        }
        try {
            const result = await api.support.list(accessToken, { page: 0, size: 50 });
            setCount(countUnreadSupportReplies(result.items));
        } catch {
            // Keep FAB usable when list API is temporarily unavailable.
        }
    }, [accessToken]);

    useEffect(() => {
        void refresh();
        if (pause) return undefined;
        const timer = window.setInterval(() => void refresh(), POLL_INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [refresh, pause]);

    return { count, refresh };
}
