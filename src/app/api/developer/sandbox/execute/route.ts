import { NextResponse } from "next/server";
import { parsePortalMerchantCode } from "@/lib/api/parse-portal-merchant-code";
import { getSandboxSessionIdFromCookie } from "@/lib/sandbox/sandbox-cookie-read";
import { getSandboxRuntime } from "@/lib/sandbox/sandbox-runtime";
import { requireMerchantSession } from "@/lib/sandbox/server-auth";

export async function POST(request: Request) {
    const auth = await requireMerchantSession();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const sessionId = await getSandboxSessionIdFromCookie();
    if (!sessionId) {
        return NextResponse.json({ error: "No sandbox session", code: "NO_SESSION" }, { status: 404 });
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
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body", code: "INVALID_JSON" },
            { status: 400 },
        );
    }

    const input =
        body.input && typeof body.input === "object" && !Array.isArray(body.input)
            ? (body.input as Record<string, unknown>)
            : {};
    const selectedMerchantCode = parsePortalMerchantCode(body);

    try {
        const runtime = getSandboxRuntime();
        const result = await runtime.execute(
            sessionId,
            auth.merchantUserId,
            input,
            { merchantAccessToken: accessToken, selectedMerchantCode },
        );
        return NextResponse.json(result);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Execute failed";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
