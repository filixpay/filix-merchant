import type { SandboxSession } from "./types";
import { KEYCLOAK_TOKEN_URL, OPENAPI_BASE_URL } from "./sandbox-config";

interface TokenResponse {
    access_token: string;
    expires_in: number;
}

export class OpenApiGateway {
    async ensureAccessToken(session: SandboxSession): Promise<void> {
        const now = Date.now();
        if (
            session.accessToken &&
            session.accessTokenExpiresAt &&
            session.accessTokenExpiresAt > now + 60_000
        ) {
            return;
        }

        const body = new URLSearchParams({
            grant_type: "client_credentials",
            client_id: session.clientId,
            client_secret: session.clientSecret,
        });

        const response = await fetch(KEYCLOAK_TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
        });

        if (!response.ok) {
            session.oauthProven = false;
            throw new Error(`OAuth token request failed with status ${response.status}`);
        }

        const data = (await response.json()) as TokenResponse;
        session.accessToken = data.access_token;
        session.accessTokenExpiresAt = now + data.expires_in * 1000;
        session.oauthProven = true;
    }

    async httpRequest(
        session: SandboxSession,
        method: string,
        path: string,
        body?: unknown,
    ): Promise<{ status: number; body: unknown }> {
        await this.ensureAccessToken(session);

        const url = `${OPENAPI_BASE_URL}${path}`;
        const headers: Record<string, string> = {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/json",
        };

        const init: RequestInit = { method, headers };
        if (body !== undefined && method !== "GET") {
            headers["Content-Type"] = "application/json";
            init.body = JSON.stringify(body);
        }

        const response = await fetch(url, init);
        let responseBody: unknown;
        try {
            responseBody = await response.json();
        } catch {
            responseBody = null;
        }

        return { status: response.status, body: responseBody };
    }
}

export const openApiGateway = new OpenApiGateway();
