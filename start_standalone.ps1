$env:KEYCLOAK_CLIENT_ID="your-oidc-client-id"
$env:KEYCLOAK_CLIENT_SECRET="your-strong-secret-here"
$env:KEYCLOAK_ISSUER="https://your-auth-host/realms/your-realm"
$env:NEXTAUTH_URL="http://localhost:3000/auth-api/auth"
$env:NEXTAUTH_SECRET="generate_a_random_string_here"
$env:PORT="3000"

# Copy static files if they don't exist (safety check)
if (!(Test-Path ".next/standalone/.next/static")) {
    Write-Host "Copying static files..."
    Copy-Item -Path ".next/static" -Destination ".next/standalone/.next/static" -Recurse -Force
}
if (!(Test-Path ".next/standalone/public")) {
    Write-Host "Copying public files..."
    Copy-Item -Path "public" -Destination ".next/standalone/public" -Recurse -Force
}

Write-Host "Starting Standalone Server..."
node .next/standalone/server.js
