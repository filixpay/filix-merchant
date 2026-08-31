// 你的 NextAuth 配置文件（可能在 src/lib/auth.ts 或其他位置）
import NextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

import { accessTokenStillValid, refreshAccessToken } from "./auth/refresh-access-token";
import { getEnv } from "./env";

const env = getEnv();

export const authOptions: NextAuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: env.keycloak.clientId,
            clientSecret: env.keycloak.clientSecret,
            issuer: env.keycloak.issuer,
            httpOptions: {
                timeout: 10000,
            },
        }),
    ],



    pages: {
        signIn: "/login",
    },

    secret: process.env.NEXTAUTH_SECRET,

    debug: env.isDevelopment,

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30天
        updateAge: 24 * 60 * 60, // 24小时
    },

    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? "__Secure-" : ""}filix-merchant.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === 'production',
            },
        },
        callbackUrl: {
            name: `${process.env.NODE_ENV === 'production' ? "__Secure-" : ""}filix-merchant.callback-url`,
            options: {
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === 'production',
            },
        },
        csrfToken: {
            name: `${process.env.NODE_ENV === 'production' ? "__Host-" : ""}filix-merchant.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },

    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                const expiresAtSec = account.expires_at
                    ?? Math.floor(Date.now() / 1000) + (typeof account.expires_in === "number" ? account.expires_in : 300);
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.idToken = account.id_token;
                token.accessTokenExpires = expiresAtSec * 1000;
                token.error = undefined;
                return token;
            }

            if (accessTokenStillValid(token)) {
                return token;
            }

            return refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string | undefined;
            session.idToken = token.idToken as string | undefined;
            session.issuer = env.keycloak.issuer;
            session.error = token.error as string | undefined;
            return session;
        },

        // 关键：添加 redirect 回调
        async redirect({ url, baseUrl }) {
            console.log('Auth redirect callback:', { url, baseUrl });

            // 确保 baseUrl 是 HTTPS
            const safeBaseUrl = baseUrl.replace(/^http:/, 'https:');

            // 如果 url 是相对路径，加上 baseUrl
            if (url.startsWith('/')) {
                const fullUrl = `${safeBaseUrl.replace('/auth-api/auth', '')}${url}`;
                console.log('Redirect to relative path:', fullUrl);
                return fullUrl;
            }

            // 如果是绝对路径，确保是 HTTPS
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol === 'http:') {
                parsedUrl.protocol = 'https:';
                console.log('Force HTTPS redirect:', parsedUrl.toString());
                return parsedUrl.toString();
            }

            console.log('Redirect to:', url);
            return url;
        },
    },

    // 添加 events 处理
    events: {
        async signOut() {
            // 可选：处理登出逻辑
        },
    },

    // 添加 adapter 如果你使用数据库
    // adapter: PrismaAdapter(prisma),

    // 增加会话超时时间

};

export default NextAuth(authOptions);
