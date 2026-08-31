import { NextResponse } from "next/server";
import {
    applySandboxSessionCookie,
    clearSandboxSessionCookieOn,
} from "@/lib/sandbox/sandbox-cookie";
import { getSandboxSessionIdFromCookie } from "@/lib/sandbox/sandbox-cookie-read";
import { getSandboxRuntime, getSessionVerdict } from "@/lib/sandbox/sandbox-runtime";
import { peekStashedApiCredentials } from "@/lib/sandbox/credential-stash";
import { requireMerchantSession } from "@/lib/sandbox/server-auth";
import { toPublicSession } from "@/lib/sandbox/session-public";

export async function GET() {
    const auth = await requireMerchantSession();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const sessionId = await getSandboxSessionIdFromCookie();
    if (!sessionId) {
        return NextResponse.json({ error: "No sandbox session", code: "NO_SESSION" }, { status: 404 });
    }

    const runtime = getSandboxRuntime();
    const session = await runtime.getSession(sessionId, auth.merchantUserId);
    if (!session) {
        return NextResponse.json(
            { error: "Sandbox session not found", code: "SESSION_NOT_FOUND" },
            { status: 404 },
        );
    }

    return NextResponse.json({
        session: toPublicSession(session),
        verdict: getSessionVerdict(session),
    });
}

export async function POST(request: Request) {
    const auth = await requireMerchantSession();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
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

    let clientId = body.clientId ?? body.client_id;
    let clientSecret = body.clientSecret ?? body.client_secret;

    if (
        (typeof clientId !== "string" || !clientId || typeof clientSecret !== "string" || !clientSecret)
    ) {
        const stashed = peekStashedApiCredentials(auth.merchantUserId);
        if (stashed) {
            clientId = stashed.clientId;
            clientSecret = stashed.clientSecret;
        }
    }

    if (typeof clientId !== "string" || !clientId || typeof clientSecret !== "string" || !clientSecret) {
        return NextResponse.json(
            {
                error: "clientId and clientSecret are required. Create a SANDBOX credential under Applications, then start Integration Verification while the secret is still shown.",
                code: "MISSING_CREDENTIALS",
                receivedKeys: Object.keys(body),
            },
            { status: 400 },
        );
    }

    try {
        const runtime = getSandboxRuntime();
        const session = await runtime.createSession({
            merchantUserId: auth.merchantUserId,
            clientId,
            clientSecret,
            scenarioId: typeof body.scenario === "string" ? body.scenario : undefined,
        });

        const response = NextResponse.json({ session: toPublicSession(session) });
        return applySandboxSessionCookie(response, session.id);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create sandbox session";
        return NextResponse.json({ error: message, code: "SESSION_CREATE_FAILED" }, { status: 400 });
    }
}

export async function DELETE() {
    const auth = await requireMerchantSession();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const sessionId = await getSandboxSessionIdFromCookie();
    if (sessionId) {
        const runtime = getSandboxRuntime();
        await runtime.revokeSession(sessionId, auth.merchantUserId);
    }

    const response = NextResponse.json({ ok: true });
    return clearSandboxSessionCookieOn(response);
}
