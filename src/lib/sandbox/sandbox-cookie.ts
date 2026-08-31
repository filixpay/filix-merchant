import { NextResponse } from "next/server";
import { SANDBOX_COOKIE_NAME, SANDBOX_SESSION_TTL_SECONDS } from "./sandbox-config";

export function applySandboxSessionCookie(response: NextResponse, sessionId: string): NextResponse {
    response.cookies.set(SANDBOX_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: SANDBOX_SESSION_TTL_SECONDS,
    });
    return response;
}

export function clearSandboxSessionCookieOn(response: NextResponse): NextResponse {
    response.cookies.delete(SANDBOX_COOKIE_NAME);
    return response;
}
