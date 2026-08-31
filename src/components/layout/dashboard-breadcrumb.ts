import type { DashboardMenuItem } from "./dashboard-menu";
import { getDefaultOpenKeys, getSelectedMenuKey } from "./dashboard-menu";

export type DashboardBreadcrumbItem = {
    key: string;
    label: string;
    href?: string;
};

function findGroupByKey(items: DashboardMenuItem[], key: string): DashboardMenuItem | undefined {
    for (const item of items) {
        if (item.key === key && item.children?.length) {
            return item;
        }
        if (item.children?.length) {
            const nested = findGroupByKey(item.children, key);
            if (nested) {
                return nested;
            }
        }
    }
    return undefined;
}

function findLeafByHref(items: DashboardMenuItem[], href: string): DashboardMenuItem | undefined {
    for (const item of items) {
        if (item.href === href) {
            return item;
        }
        if (item.children?.length) {
            const nested = findLeafByHref(item.children, href);
            if (nested) {
                return nested;
            }
        }
    }
    return undefined;
}

function firstVisibleHref(item: DashboardMenuItem): string | undefined {
    if (item.href && item.visible !== false) {
        return item.href;
    }
    for (const child of item.children ?? []) {
        if (child.visible === false) {
            continue;
        }
        const href = firstVisibleHref(child);
        if (href) {
            return href;
        }
    }
    return undefined;
}

function stripLocalePrefix(localizedHref: string, locale: string): string {
    const prefix = `/${locale}`;
    if (localizedHref === prefix || localizedHref === `${prefix}/dashboard`) {
        return localizedHref === prefix ? "/" : "/dashboard";
    }
    if (localizedHref.startsWith(`${prefix}/`)) {
        return localizedHref.slice(prefix.length);
    }
    return localizedHref;
}

export function buildDashboardBreadcrumbs(
    menuModel: DashboardMenuItem[],
    pathname: string,
    locale: string,
): DashboardBreadcrumbItem[] {
    const selectedLocalizedHref = getSelectedMenuKey(pathname, locale);
    const selectedHref = stripLocalePrefix(selectedLocalizedHref, locale);
    const openKeys = getDefaultOpenKeys(pathname);
    const crumbs: DashboardBreadcrumbItem[] = [];

    for (const key of openKeys) {
        const group = findGroupByKey(menuModel, key);
        if (!group || group.visible === false) {
            continue;
        }
        const groupHref = firstVisibleHref(group);
        crumbs.push({
            key: group.key,
            label: group.label,
            href: groupHref ? `/${locale}${groupHref}` : undefined,
        });
    }

    const leaf = findLeafByHref(menuModel, selectedHref);
    if (leaf && leaf.visible !== false) {
        if (crumbs[crumbs.length - 1]?.key !== leaf.key) {
            crumbs.push({
                key: leaf.key,
                label: leaf.label,
            });
        }
        return crumbs;
    }

    if (crumbs.length > 0) {
        return crumbs;
    }

    const overview = findLeafByHref(menuModel, "/dashboard");
    if (overview) {
        return [{ key: overview.key, label: overview.label }];
    }

    return [];
}
