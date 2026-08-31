import { NextResponse } from "next/server";
import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import { parsePortalMerchantCode } from "@/lib/api/parse-portal-merchant-code";
import { merchantPortalFetch } from "@/lib/developer/merchant-portal-fetch";
import { requireMerchantSession } from "@/lib/sandbox/server-auth";

/**
 * Transport-only BFF for Explorer Execute.
 * Forwards Merchant session → `/developer/explorer/execute`.
 * MUST NOT store or handle token / secret / credential material for Sandbox.
 * MUST NOT use OpenApiGateway / sandbox session secret path.
 */
export async function POST(request: Request) {
    const auth = await requireMerchantSession();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const accessToken = (auth.session as { accessToken?: string }).accessToken;
    if (!accessToken) {
        return NextResponse.json(
            { error: "Missing merchant access token", code: "NO_ACCESS_TOKEN" },
            { status: 401 },
        );
    }

    let body: Record<string, unknown> = {};
    try {
        const raw = await request.text();
        if (raw.trim()) {
            body = JSON.parse(raw) as Record<string, unknown>;
        }
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body", code: "INVALID_JSON" },
            { status: 400 },
        );
    }

    // Strip portal routing hint; never forward forbidden Explorer fields from client extras
    const merchantCode = parsePortalMerchantCode(body);
    const {
        merchantCode: _mc,
        method: _method,
        path: _path,
        url: _url,
        credentialId: _credentialId,
        clientSecret: _clientSecret,
        accessToken: _accessToken,
        token: _token,
        environment: _environment,
        version: _version,
        documentVersion: _documentVersion,
        artifactId: _artifactId,
        ...forward
    } = body;

    const applicationCode =
        typeof forward.applicationCode === "string" ? forward.applicationCode.trim() : "";
    const operationId = typeof forward.operationId === "string" ? forward.operationId.trim() : "";
    if (!applicationCode || !operationId) {
        return NextResponse.json(
            { error: "applicationCode and operationId are required", code: "REQUEST_VALIDATION_FAILED" },
            { status: 400 },
        );
    }

    const executeBody: Record<string, unknown> = {
        applicationCode,
        operationId,
    };
    if (forward.parameters && typeof forward.parameters === "object" && !Array.isArray(forward.parameters)) {
        executeBody.parameters = forward.parameters;
    }
    if (forward.body !== undefined) {
        executeBody.body = forward.body;
    }

    try {
        const response = await merchantPortalFetch(
            `${API_BASE_URL}${ENDPOINTS.PORTAL.DEVELOPER_EXPLORER_EXECUTE}`,
            {
                token: accessToken,
                selectedGroup: merchantCode,
                init: {
                    method: "POST",
                    body: JSON.stringify(executeBody),
                },
            },
        );

        const text = await response.text();
        let payload: unknown = null;
        if (text) {
            try {
                payload = JSON.parse(text);
            } catch {
                payload = { error: text };
            }
        }
        return NextResponse.json(payload ?? {}, { status: response.status });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Explorer execute failed";
        return NextResponse.json(
            { error: message, code: "EXPLORER_EXECUTE_FAILED" },
            { status: 502 },
        );
    }
}
