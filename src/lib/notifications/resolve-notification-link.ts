import { normalizeCheckoutUrl } from "@/lib/checkout/checkout-url";

export function isExternalUrl(value: string | undefined): boolean {
    return !!value && /^https?:\/\//i.test(value);
}

export function extractFirstUrl(value: string | undefined): string | null {
    if (!value) return null;
    const match = value.match(/https?:\/\/[^\s（）]+/i);
    return match ? match[0] : null;
}

export function resolveResumeLinkUrl(options: {
    actionPath?: string;
    resumeUrl?: string;
    content?: string;
}): string | null {
    if (isExternalUrl(options.resumeUrl)) {
        return normalizeCheckoutUrl(options.resumeUrl!);
    }
    if (isExternalUrl(options.actionPath)) {
        return normalizeCheckoutUrl(options.actionPath!);
    }

    const inlineUrl = extractFirstUrl(options.content);
    return inlineUrl ? normalizeCheckoutUrl(inlineUrl) : null;
}
