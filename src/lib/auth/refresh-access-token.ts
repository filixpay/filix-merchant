import type { JWT } from "next-auth/jwt";

import { getEnv } from "../env";

type RefreshableToken = JWT & {
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpires?: number;
  error?: string;
};

/**
 * Refresh Keycloak access token using the stored refresh_token.
 * NextAuth session can outlive Keycloak access tokens; without this,
 * portal APIs return 401 while the UI still looks "logged in".
 */
export async function refreshAccessToken(token: RefreshableToken): Promise<RefreshableToken> {
  const env = getEnv();
  const refreshToken = token.refreshToken;
  if (!refreshToken || !env.keycloak.issuer) {
    return { ...token, error: "RefreshTokenMissing" };
  }

  try {
    const response = await fetch(
      `${env.keycloak.issuer}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: env.keycloak.clientId,
          client_secret: env.keycloak.clientSecret,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      },
    );

    const refreshed = (await response.json()) as {
      access_token?: string;
      refresh_token?: string;
      id_token?: string;
      expires_in?: number;
      error?: string;
    };

    if (!response.ok || !refreshed.access_token) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    const expiresInSec = refreshed.expires_in ?? 300;
    return {
      ...token,
      accessToken: refreshed.access_token,
      idToken: refreshed.id_token ?? token.idToken,
      refreshToken: refreshed.refresh_token ?? refreshToken,
      accessTokenExpires: Date.now() + expiresInSec * 1000,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export function accessTokenStillValid(token: RefreshableToken, skewMs = 60_000): boolean {
  const expires = token.accessTokenExpires;
  if (!expires || !token.accessToken) return false;
  return Date.now() < expires - skewMs;
}
