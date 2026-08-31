import { OPENAPI_BASE_URL } from "./constants";
import { API_BASE_URL } from "@/lib/api-config";

const SENSITIVE_KEY = /secret|token|password|authorization/i;

export function redactSensitiveJson(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(redactSensitiveJson);
    }
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([key, val]) => [
                key,
                SENSITIVE_KEY.test(key) ? "***" : redactSensitiveJson(val),
            ]),
        );
    }
    return value;
}

export function formatJsonForDisplay(value: unknown): string {
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
}

export function buildOpenApiUrl(path: string): string {
    return `${OPENAPI_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatSandboxRequestUrl(method: string, path: string): string {
    if (method === "INTERNAL" || path.startsWith("/developer/")) {
        return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    }
    return buildOpenApiUrl(path);
}
