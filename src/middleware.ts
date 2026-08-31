// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import createIntlMiddleware from 'next-intl/middleware'
import { buildLoginUrl, getSessionCookieName, parseLocaleDashboardPath, parseLocaleEnterprisePath, parseLocaleOnboardingPath } from '@/lib/auth/dashboard-route'

const intlMiddleware = createIntlMiddleware({
    locales: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'pt'],
    defaultLocale: 'en'
})

function resolvePublicHost(requestHost: string | null): string {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.trim()
    if (site) {
        try {
            return new URL(site).host
        } catch {
            // fall through
        }
    }
    if (requestHost) return requestHost
    throw new Error('NEXT_PUBLIC_SITE_URL is required in production')
}

export async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const proto = requestHeaders.get('x-forwarded-proto')
    const host = requestHeaders.get('host')
    const url = new URL(request.url)

    // 生产环境强制 HTTPS
    if (process.env.NODE_ENV === 'production') {
        // 如果是 HTTP，重定向到 HTTPS
        if (proto === 'http') {
            const httpsUrl = new URL(request.url)
            httpsUrl.protocol = 'https:'
            httpsUrl.host = host || resolvePublicHost(null)
            return NextResponse.redirect(httpsUrl)
        }

        // 确保所有 auth-api 请求都使用正确的域名
        if (url.pathname.includes('/auth-api/')) {
            // 检查请求是否来自 Keycloak 回调
            const code = url.searchParams.get('code')
            const state = url.searchParams.get('state')
            const sessionState = url.searchParams.get('session_state')
            const iss = url.searchParams.get('iss')

            if (code || state || sessionState || iss) {
                // 如果 URL 包含 localhost，重定向到实际域名
                if (url.hostname === 'localhost' || url.protocol === 'http:') {
                    const correctUrl = new URL(request.url)
                    correctUrl.protocol = 'https:'
                    correctUrl.host = resolvePublicHost(host)
                    return NextResponse.redirect(correctUrl)
                }
            }
        }
    }

    // 设置正确的协议头
    requestHeaders.set('x-forwarded-proto', 'https')

    const dashboardPath = parseLocaleDashboardPath(url.pathname)
    if (dashboardPath?.isDashboard) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: getSessionCookieName(),
        })

        if (!token) {
            const loginUrl = buildLoginUrl(
                request.nextUrl.origin,
                dashboardPath.locale,
                `${url.pathname}${url.search}`,
            )
            return NextResponse.redirect(loginUrl)
        }
    }

    const enterprisePath = parseLocaleEnterprisePath(url.pathname)
    if (enterprisePath?.isEnterprise) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: getSessionCookieName(),
        })

        if (!token) {
            const loginUrl = buildLoginUrl(
                request.nextUrl.origin,
                enterprisePath.locale,
                `${url.pathname}${url.search}`,
            )
            return NextResponse.redirect(loginUrl)
        }
    }

    const onboardingPath = parseLocaleOnboardingPath(url.pathname)
    if (onboardingPath?.isOnboarding) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: getSessionCookieName(),
        })

        if (!token) {
            const loginUrl = buildLoginUrl(
                request.nextUrl.origin,
                onboardingPath.locale,
                `${url.pathname}${url.search}`,
                { portal: 'merchant' },
            )
            return NextResponse.redirect(loginUrl)
        }
    }

    // 应用国际化中间件 - 排除 auth-api
    if (!url.pathname.startsWith('/auth-api')) {
        const response = intlMiddleware(request)

        if (response) {
            const newHeaders = new Headers(response.headers)
            newHeaders.set('x-forwarded-proto', 'https')

            return new NextResponse(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders
            })
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    })
}

export const config = {
    matcher: [
        // 匹配除静态文件外的所有路径
        '/((?!api|auth-api|merchant|_next/static|_next/image|favicon.ico|.*\\..*).*)'
    ]
}
