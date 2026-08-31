import type { ExecuteResult, IntegrationVerdict, SandboxSessionPublicView } from "@/lib/sandbox/types";
import { developerBffPath } from "@/lib/developer/bff-paths";
import { withSelectedMerchantCode } from "@/lib/developer/bff-request";
import { readResponseErrorMessage } from "@/lib/http/read-response-error";

export async function createSandboxSession(body?: {
    clientId?: string;
    clientSecret?: string;
    scenario?: string;
}): Promise<{ session: SandboxSessionPublicView }> {
    const hasInlineCredentials = Boolean(body?.clientId || body?.clientSecret);
    if (hasInlineCredentials && (!body?.clientId?.trim() || !body?.clientSecret?.trim())) {
        throw new Error("Missing clientId or clientSecret before creating sandbox session");
    }

    const payload =
        body?.clientId?.trim() && body?.clientSecret?.trim()
            ? withSelectedMerchantCode({
                  clientId: body.clientId.trim(),
                  clientSecret: body.clientSecret.trim(),
                  ...(body.scenario ? { scenario: body.scenario } : {}),
              })
            : withSelectedMerchantCode({
                  ...(body?.scenario ? { scenario: body.scenario } : {}),
              });

    const res = await fetch(developerBffPath("sandbox/session"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error(await readResponseErrorMessage(res, `Failed to create sandbox session (${res.status})`));
    }
    return res.json();
}

export async function getSandboxSession(): Promise<{
    session: SandboxSessionPublicView;
    verdict?: IntegrationVerdict;
} | null> {
    const res = await fetch(developerBffPath("sandbox/session"), {
        credentials: "same-origin",
    });
    if (res.status === 404) return null;
    if (!res.ok) {
        throw new Error(await readResponseErrorMessage(res, `Failed to load sandbox session (${res.status})`));
    }
    return res.json();
}

export async function executeSandboxStep(
    input: Record<string, unknown> = {},
): Promise<ExecuteResult> {
    const res = await fetch(developerBffPath("sandbox/execute"), {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withSelectedMerchantCode({ input })),
    });
    if (!res.ok) {
        throw new Error(await readResponseErrorMessage(res, `Failed to execute sandbox step (${res.status})`));
    }
    return res.json();
}

export async function revokeSandboxSession(): Promise<void> {
    await fetch(developerBffPath("sandbox/session"), {
        method: "DELETE",
        credentials: "same-origin",
    });
}
