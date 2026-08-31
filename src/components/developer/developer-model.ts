export const WEBHOOK_EVENT_TYPES = ["payment.success", "refund.completed"] as const;

export type WebhookEnvironment = "LIVE" | "SANDBOX";

export type WebhookEventGroup = {
    key: string;
    /** i18n key under Developer.webhook_event_groups.* */
    labelKey: string;
    events: readonly string[];
};

export const WEBHOOK_EVENT_GROUPS: readonly WebhookEventGroup[] = [
    {
        key: "payment",
        labelKey: "payment",
        events: ["payment.success"],
    },
    {
        key: "refund",
        labelKey: "refund",
        events: ["refund.completed"],
    },
] as const;

export function getDeliveryStatusColor(
    status: string,
): "success" | "processing" | "error" | "default" {
    if (status === "SUCCESS") return "success";
    if (status === "PENDING") return "processing";
    if (status === "FAILED") return "error";
    return "default";
}

export function formatWebhookDate(value?: string): string {
    return value ? new Date(value).toLocaleString() : "-";
}

export function formatWebhookDateShort(value?: string): string {
    return value ? new Date(value).toLocaleDateString() : "-";
}

export function formatPayload(payload: string): string {
    try {
        return JSON.stringify(JSON.parse(payload), null, 2);
    } catch {
        return payload;
    }
}

export function isHttpsWebhookUrl(url: string): boolean {
    try {
        return new URL(url).protocol === "https:";
    } catch {
        return false;
    }
}

/** SANDBOX may use http:// only for localhost / loopback / *.local */
export function isAllowedSandboxHttpUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:") {
            return false;
        }
        const host = parsed.hostname.toLowerCase();
        return host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".local");
    } catch {
        return false;
    }
}

export function isInsecureWebhookUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:";
    } catch {
        return false;
    }
}

export type WebhookUrlValidation =
    | { ok: true }
    | { ok: false; reason: "invalid" | "https_required" | "sandbox_http_only_local" };

export function validateWebhookUrl(
    url: string,
    environment: WebhookEnvironment,
): WebhookUrlValidation {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return { ok: false, reason: "invalid" };
    }

    if (parsed.protocol === "https:") {
        return { ok: true };
    }

    if (parsed.protocol !== "http:") {
        return { ok: false, reason: "invalid" };
    }

    if (environment === "LIVE") {
        return { ok: false, reason: "https_required" };
    }

    if (isAllowedSandboxHttpUrl(url)) {
        return { ok: true };
    }

    return { ok: false, reason: "sandbox_http_only_local" };
}

export function summarizeEventTypes(
    types: string[] | undefined,
    maxVisible = 2,
): { visible: string[]; overflow: number; all: string[] } {
    const all = [...(types ?? [])];
    if (all.length <= maxVisible) {
        return { visible: all, overflow: 0, all };
    }
    return {
        visible: all.slice(0, maxVisible),
        overflow: all.length - maxVisible,
        all,
    };
}

export function filterWebhookEventGroups(
    groups: readonly WebhookEventGroup[],
    query: string,
): WebhookEventGroup[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
        return groups.map((group) => ({ ...group, events: [...group.events] }));
    }
    return groups
        .map((group) => ({
            ...group,
            events: group.events.filter((event) => event.toLowerCase().includes(normalized)),
        }))
        .filter((group) => group.events.length > 0);
}
