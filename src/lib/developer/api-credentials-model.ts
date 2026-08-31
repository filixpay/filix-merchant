import type { ApiCredentialsView } from "@/lib/api";

function unwrapCredentialRecord(raw: Record<string, unknown>): Record<string, unknown> {
    if (raw.clientId ?? raw.client_id ?? raw.clientSecret ?? raw.client_secret) {
        return raw;
    }

    for (const key of ["credentials", "credential", "apiCredentials", "data"]) {
        const nested = raw[key];
        if (nested && typeof nested === "object" && !Array.isArray(nested)) {
            return nested as Record<string, unknown>;
        }
    }

    return raw;
}

export function normalizeApiCredentials(raw: Record<string, unknown>): ApiCredentialsView {
    const source = unwrapCredentialRecord(raw);
    const clientId = source.clientId ?? source.client_id;
    const clientSecret = source.clientSecret ?? source.client_secret;
    const createdAt = source.createdAt ?? source.created_at;

    return {
        clientId: typeof clientId === "string" ? clientId : String(clientId ?? ""),
        clientSecret: typeof clientSecret === "string" ? clientSecret : String(clientSecret ?? ""),
        createdAt: typeof createdAt === "string" ? createdAt : undefined,
    };
}

export function assertApiCredentials(credentials: ApiCredentialsView): void {
    if (!credentials.clientId || !credentials.clientSecret) {
        throw new Error("API credentials response is missing clientId or clientSecret");
    }
}
