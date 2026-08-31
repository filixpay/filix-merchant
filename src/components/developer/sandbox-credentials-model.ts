import type { ApiApplicationView, ApiCredentialView } from "@/lib/developer/applications-api";

export type CredentialLookup = {
    applicationCode: string;
    clientId: string;
};

/** Prefer the first ACTIVE SANDBOX credential across applications. */
export function pickDefaultSandboxCredential(
    apps: ApiApplicationView[],
    credentialsByApp: Record<string, ApiCredentialView[]>,
): CredentialLookup | null {
    for (const app of apps) {
        if ((app.status || "").toUpperCase() === "ARCHIVED") continue;
        const credentials = credentialsByApp[app.applicationCode] ?? [];
        const match = credentials.find(
            (item) =>
                (item.environment || "").toUpperCase() === "SANDBOX" &&
                (item.status || "").toUpperCase() === "ACTIVE",
        );
        if (match?.clientId) {
            return {
                applicationCode: app.applicationCode,
                clientId: match.clientId,
            };
        }
    }
    return null;
}
