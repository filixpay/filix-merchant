import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireMerchantSession() {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email ?? session?.user?.name;
    if (!userId) return null;
    return { session, merchantUserId: userId };
}
