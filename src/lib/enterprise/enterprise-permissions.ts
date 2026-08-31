import type { EnterpriseMembershipKind } from "@/lib/api/domains/enterprise/types";

export function isEnterpriseAdmin(kind: EnterpriseMembershipKind | undefined | null): boolean {
    return kind === "ADMIN";
}
