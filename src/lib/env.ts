// src/lib/env.ts
function requiredInProduction(
    name: string,
    value: string | undefined,
    developmentFallback: string,
    isProduction: boolean,
): string {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
    if (!isProduction) return developmentFallback;
    throw new Error(`${name} is required (no production defaults in open builds)`);
}

export const getEnv = () => {
    const isProduction = process.env.NODE_ENV === "production";
    const isDevelopment = process.env.NODE_ENV === "development";

    return {
        isProduction,
        isDevelopment,

        nextAuthUrl: requiredInProduction(
            "NEXTAUTH_URL",
            process.env.NEXTAUTH_URL,
            "http://localhost:3000/auth-api/auth",
            isProduction,
        ),

        siteUrl: requiredInProduction(
            "NEXT_PUBLIC_SITE_URL",
            process.env.NEXT_PUBLIC_SITE_URL,
            "http://localhost:3000",
            isProduction,
        ),

        checkoutUrl: requiredInProduction(
            "NEXT_PUBLIC_CHECKOUT_URL",
            process.env.NEXT_PUBLIC_CHECKOUT_URL,
            "http://localhost:3001",
            isProduction,
        ),

        /** When false, marketing layout redirects into the dashboard. Default: enabled. */
        enableMarketing: (() => {
            const raw = process.env.NEXT_PUBLIC_ENABLE_MARKETING?.trim().toLowerCase();
            if (raw === "0" || raw === "false" || raw === "off" || raw === "no") {
                return false;
            }
            return true;
        })(),

        keycloak: {
            clientId: process.env.KEYCLOAK_CLIENT_ID || "",
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
            issuer: process.env.KEYCLOAK_ISSUER || "",
        },
    };
};
