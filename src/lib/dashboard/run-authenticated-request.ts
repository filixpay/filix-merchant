import { handleDashboardApiError } from "./handle-dashboard-api-error";

export async function runAuthenticatedRequest<T>(
    accessToken: string | undefined,
    request: (token: string) => Promise<T>,
): Promise<T | undefined> {
    if (!accessToken) {
        return undefined;
    }

    try {
        return await request(accessToken);
    } catch (err) {
        handleDashboardApiError(err);
        return undefined;
    }
}
