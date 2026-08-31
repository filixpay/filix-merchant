export const SANDBOX_SESSION_TTL_SECONDS = 1800;
export const SANDBOX_WEBHOOK_POLL_MAX_ATTEMPTS = 40;
export const SANDBOX_WEBHOOK_POLL_INTERVAL_MS = 5000;
export const SANDBOX_COOKIE_NAME = "sandbox_session_id";
export const OPENAPI_BASE_URL =
    process.env.OPENAPI_BASE_URL ?? "https://api.example.com/openapi/v1";
export const KEYCLOAK_TOKEN_URL =
    process.env.KEYCLOAK_TOKEN_URL ??
    "https://your-auth-host/realms/your-realm/protocol/openid-connect/token";
