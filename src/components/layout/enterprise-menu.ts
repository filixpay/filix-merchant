export type EnterpriseMenuItem = {
    key: string;
    label: string;
    href: string;
};

export function buildEnterpriseMenuModel(
    t: (key: string) => string,
    locale: string,
): EnterpriseMenuItem[] {
    const base = `/${locale}/enterprise`;
    return [
        { key: "dashboard", label: t("nav.dashboard"), href: `${base}/dashboard` },
        { key: "organizations", label: t("nav.organizations"), href: `${base}/organizations` },
        { key: "members", label: t("nav.members"), href: `${base}/members` },
        { key: "audit", label: t("nav.audit"), href: `${base}/audit` },
    ];
}

export function getEnterpriseSelectedMenuKey(pathname: string, locale: string): string {
    const prefix = `/${locale}/enterprise/`;
    if (!pathname.startsWith(prefix)) {
        return "dashboard";
    }
    const segment = pathname.slice(prefix.length).split("/")[0];
    if (segment === "organizations") return "organizations";
    if (segment === "members") return "members";
    if (segment === "audit") return "audit";
    return "dashboard";
}
