import type { CommerceProductView } from "./types";

export type BusinessStatusPresentation = {
    kind: "normal" | "legacy";
    labelKey: string;
};

export function presentBusinessStatus(raw: string): BusinessStatusPresentation {
    if (raw === "DRAFT" || raw === "PUBLISHED" || raw === "SUSPENDED") {
        return { kind: "normal", labelKey: `business.${raw}` };
    }
    return { kind: "legacy", labelKey: "business.legacy" };
}

export function integrationLabelKey(raw: string): string {
    if (raw === "CREATING" || raw === "SYNCING" || raw === "READY" || raw === "FAILED") {
        return `integration.${raw}`;
    }
    return "integration.UNKNOWN";
}

export function isInFlightIntegration(integrationStatus: string): boolean {
    return integrationStatus === "CREATING" || integrationStatus === "SYNCING";
}

export function canPublish(product: Pick<CommerceProductView, "businessStatus" | "integrationStatus">): boolean {
    return (
        (product.businessStatus === "DRAFT" || product.businessStatus === "SUSPENDED") &&
        product.integrationStatus === "READY"
    );
}

export function canUnpublish(product: Pick<CommerceProductView, "businessStatus" | "integrationStatus">): boolean {
    return product.businessStatus === "PUBLISHED" && product.integrationStatus === "READY";
}

/** Stuck DRAFT/REJECTED rows in CREATING or FAILED can call retry-sync to adopt/rematerialize. */
export function canRetrySync(product: Pick<CommerceProductView, "businessStatus" | "integrationStatus">): boolean {
    const businessOk =
        product.businessStatus === "DRAFT" || product.businessStatus === "REJECTED";
    const integrationOk =
        product.integrationStatus === "FAILED" || product.integrationStatus === "CREATING";
    return businessOk && integrationOk;
}

export function canEdit(product: Pick<CommerceProductView, "businessStatus" | "integrationStatus">): boolean {
    return product.businessStatus === "DRAFT" && (product.integrationStatus === "READY" || product.integrationStatus === "FAILED");
}

/** While integration is in-flight, UI must not treat business as terminal published. */
export function displayBusinessStatus(product: Pick<CommerceProductView, "businessStatus" | "integrationStatus">): string {
    if (isInFlightIntegration(product.integrationStatus)) {
        return product.businessStatus;
    }
    return product.businessStatus;
}
