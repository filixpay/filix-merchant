import { KEYCLOAK_TOKEN_URL, PLACEHOLDERS } from "./constants";

export type CodeSampleLang = "curl" | "node" | "python" | "java";

export function generateAuthSample(lang: CodeSampleLang): string {
    switch (lang) {
        case "curl":
            return `curl -X POST '${KEYCLOAK_TOKEN_URL}' \\
  -H 'Content-Type: application/x-www-form-urlencoded' \\
  -d 'grant_type=client_credentials&client_id=${PLACEHOLDERS.clientId}&client_secret=${PLACEHOLDERS.clientSecret}'`;
        case "node":
            return `const body = new URLSearchParams({
  grant_type: "client_credentials",
  client_id: "${PLACEHOLDERS.clientId}",
  client_secret: "${PLACEHOLDERS.clientSecret}",
});

const response = await fetch("${KEYCLOAK_TOKEN_URL}", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: body.toString(),
});
const { access_token } = await response.json();
// Use access_token as Bearer token for Open API calls`;
        case "python":
            return `import requests

response = requests.post(
    "${KEYCLOAK_TOKEN_URL}",
    data={
        "grant_type": "client_credentials",
        "client_id": "${PLACEHOLDERS.clientId}",
        "client_secret": "${PLACEHOLDERS.clientSecret}",
    },
    headers={"Content-Type": "application/x-www-form-urlencoded"},
)
response.raise_for_status()
access_token = response.json()["access_token"]
# Use access_token as Bearer token for Open API calls`;
        case "java":
            return `HttpClient client = HttpClient.newHttpClient();
String body = "grant_type=client_credentials"
    + "&client_id=${PLACEHOLDERS.clientId}"
    + "&client_secret=${PLACEHOLDERS.clientSecret}";
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${KEYCLOAK_TOKEN_URL}"))
    .header("Content-Type", "application/x-www-form-urlencoded")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
// Parse JSON: access_token — use as Bearer for Open API calls`;
    }
}
