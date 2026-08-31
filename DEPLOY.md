# Deployment Instructions (Manual / Nginx)

Failed to use Docker? You can run the application manually.

## 1. Prerequisites
- **Node.js**: Version 18 or later.
- **Nginx**: Installed on the server.
- **Keycloak**: Running and accessible.

## 2. Build the Application
Run the following in your development environment:

```bash
npm install
npm run build
```

This will generate a `.next/standalone` folder.

## 3. Prepare Static Files (Configuration required!)
Next.js Standalone build **does not** automatically include the static assets. You MUST copy them manually:

1. Copy `.next/static` to `.next/standalone/.next/static`
2. Copy `public` to `.next/standalone/public`

**Commands (Windows PowerShell):**
```powershell
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

**Commands (Linux/Mac):**
```bash
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
```

## 4. Run the Server
Navigate to the standalone folder and start the server:
```bash
cd .next/standalone
node server.js
```
*Note: You may need to set environment variables like `KEYCLOAK_CLIENT_SECRET`, `NEXTAUTH_URL`, etc., before running.*

## 5. Configure Nginx
Use the provided `nginx/nginx.conf.example` as a template to proxy traffic to `localhost:3000`.
