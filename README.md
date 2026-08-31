# Filix Merchant

Open-source merchant portal for [FilixPay](https://www.filixpay.com). Built with Next.js, it provides localized marketing pages and a Keycloak-backed dashboard that talks to FilixPay Portal APIs.

本仓库是开源**商户门户前端**（Next.js）。商户自行托管后，门户与登录回调运行在**您自己的域名**上；FilixPay 账务、风控与渠道能力仍通过官方 Portal / OIDC 对接。**通过环境变量配置即可部署**，生产构建不包含默认的 filixpay.com 地址。

## Documentation | 文档

| Document | Description |
|----------|-------------|
| [`.env.example`](.env.example) | Required environment variables (no secrets) |
| [DEPLOY.md](DEPLOY.md) | Container / reverse-proxy notes (if present) |

Full product docs remain with FilixPay for now; this repository ships source plus a deploy-oriented README.

---

## Why self-host?

- **Brand & domain** — run the portal on `portal.yourdomain.com`
- **Auditability** — Apache-2.0 source, no black-box admin UI
- **Config-driven** — Keycloak + site URLs via env; optional marketing off switch

## Prerequisites

| Item | Notes |
|------|--------|
| FilixPay merchant access | Portal APIs available to your account |
| OIDC client | Keycloak client with callbacks to your `NEXTAUTH_URL` |
| Reverse proxy | Terminate TLS; proxy `/merchant/service` to FilixPay Portal API |
| Node 20+ (dev) or Docker | See Dockerfile |

## Quick start (development)

```bash
cp .env.example .env.local
# Edit .env.local — set NEXTAUTH_*, KEYCLOAK_*, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_CHECKOUT_URL

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Dashboard routes require a valid session. Marketing pages can be disabled:

```env
NEXT_PUBLIC_ENABLE_MARKETING=false
```

When marketing is off, marketing routes redirect into `/{locale}/dashboard`.

## Docker

```bash
cp .env.example /etc/filix-merchant/env
# Fill secrets and public URLs for your domain
chmod 600 /etc/filix-merchant/env

docker build -t filix-merchant:local .
docker run -d \
  --name filix-merchant \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  --env-file /etc/filix-merchant/env \
  filix-merchant:local
```

Production tip: publish/pull `ghcr.io/filixpay/filix-merchant` once CI is enabled for this repository; pin a version tag rather than `latest`.

## Environment variables

See [`.env.example`](.env.example). Required for a working portal:

| Variable | Purpose |
|----------|---------|
| `NEXTAUTH_URL` | Must match browser origin + `/auth-api/auth` |
| `NEXTAUTH_SECRET` | Session encryption |
| `KEYCLOAK_CLIENT_ID` / `KEYCLOAK_CLIENT_SECRET` / `KEYCLOAK_ISSUER` | OIDC |
| `NEXT_PUBLIC_SITE_URL` | Public site origin |
| `NEXT_PUBLIC_CHECKOUT_URL` | Checkout base URL for payment links |
| `NEXT_PUBLIC_ENABLE_MARKETING` | Optional; `false` for portal-only |

Portal HTTP calls use same-origin `API_BASE_URL=/merchant/service`. Your ingress must forward that path to FilixPay.

## Auth contract

| Item | Value |
|------|--------|
| NextAuth mount | `/auth-api/auth` |
| Dashboard API auth | `Authorization: Bearer <accessToken>` |
| Org / merchant headers | `X-Organization-Code`, `X-Merchant-Code` |

Register Keycloak redirect URIs for each self-hosted origin, e.g. `https://portal.example.com/auth-api/auth/callback/keycloak`.

## Verification

```bash
npm test
npm run build
```

## License

Apache License 2.0 — see [LICENSE](LICENSE) and [NOTICE](NOTICE).

## Roadmap note

First open release targets **FilixPay cloud Portal + OIDC**. A future iteration may document wiring any compatible Portal API + OIDC provider without FilixPay-hosted backends.
