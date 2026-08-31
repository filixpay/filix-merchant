import { signIn } from "next-auth/react";
import { ApiError } from "@/lib/api";

export function handleDashboardApiError(err: unknown): boolean {
    console.error(err);
    if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
        signIn();
        return true;
    }
    return false;
}
