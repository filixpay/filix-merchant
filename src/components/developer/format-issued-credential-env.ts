export type IssuedCredentialEnvFields = {
    clientId: string;
    clientSecret: string;
    environment: string;
};

/** Format issued credentials as .env lines for one-click copy. */
export function formatIssuedCredentialEnv(fields: IssuedCredentialEnvFields): string {
    return [
        `CLIENT_ID=${fields.clientId}`,
        `CLIENT_SECRET=${fields.clientSecret}`,
        `ENVIRONMENT=${fields.environment}`,
    ].join("\n");
}
