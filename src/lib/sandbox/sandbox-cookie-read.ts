import { cookies } from "next/headers";
import { SANDBOX_COOKIE_NAME } from "./sandbox-config";

export async function getSandboxSessionIdFromCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(SANDBOX_COOKIE_NAME)?.value ?? null;
}
