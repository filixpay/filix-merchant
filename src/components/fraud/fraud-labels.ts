export type FraudLabelTranslate = {
    (key: string): string;
    has?: (key: string) => boolean;
};

export function formatFraudRiskType(t: FraudLabelTranslate, code?: string | null): string {
    if (!code) {
        return "-";
    }
    const key = `risk_type.${code}`;
    if (t.has?.(key)) {
        return t(key);
    }
    return code;
}

export function formatFraudSummary(
    t: FraudLabelTranslate,
    event: { riskType?: string; title?: string; description?: string },
): string {
    if (event.riskType) {
        const key = `summary.${event.riskType}`;
        if (t.has?.(key)) {
            return t(key);
        }
    }
    const title = event.title?.trim();
    if (title) {
        return title;
    }
    const description = event.description?.trim();
    if (description) {
        return description;
    }
    return "-";
}
