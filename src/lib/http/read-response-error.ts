export interface ApiErrorPayload {
    error?: string;
    code?: string;
    receivedKeys?: string[];
}

export async function readResponseErrorMessage(
    res: Response,
    fallback: string,
): Promise<string> {
    const text = await res.text();
    if (!text) return fallback;

    try {
        const payload = JSON.parse(text) as ApiErrorPayload;
        let message = payload.error ?? fallback;
        if (payload.code === "MISSING_CREDENTIALS" && Array.isArray(payload.receivedKeys)) {
            message += ` (received keys: ${payload.receivedKeys.join(", ") || "none"})`;
        }
        if (payload.code) {
            message += ` [${payload.code}]`;
        }
        return message;
    } catch {
        return text;
    }
}
