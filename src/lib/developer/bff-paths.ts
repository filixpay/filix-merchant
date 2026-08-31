/**
 * Next.js BFF routes live under /auth-api/developer/* because production nginx
 * proxies /api/* to the backend merchant service, not Next.js.
 * See nginx/nginx.conf.example and next.config.ts rewrites.
 */
export const DEVELOPER_BFF_BASE = "/auth-api/developer";

export function developerBffPath(segment: string): string {
    return `${DEVELOPER_BFF_BASE}/${segment.replace(/^\//, "")}`;
}
