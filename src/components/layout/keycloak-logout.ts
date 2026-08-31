export function buildKeycloakLogoutUrl(
    issuer: string,
    idToken: string,
    postLogoutRedirectUri: string,
): string {
    return `${issuer}/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
}

export function buildLoginCallbackUrl(origin: string, locale: string): string {
    return `${origin}/${locale}/login`;
}

export type KeycloakLogoutSession = {
    idToken?: string | null;
    issuer?: string | null;
};

export function canUseKeycloakEndSession(session: KeycloakLogoutSession): boolean {
    return Boolean(session.idToken && session.issuer);
}
