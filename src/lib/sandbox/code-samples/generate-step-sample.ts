import type { StepResult } from "../types";
import { PLACEHOLDERS } from "./constants";
import { buildOpenApiUrl, formatJsonForDisplay, formatSandboxRequestUrl } from "./sanitize";
import type { CodeSampleLang } from "./generate-auth-sample";

function bodyLiteral(stepResult: StepResult): string | undefined {
    if (!stepResult.request.body || stepResult.request.method.toUpperCase() === "GET") {
        return undefined;
    }
    return formatJsonForDisplay(stepResult.request.body);
}

export function generateStepSample(lang: CodeSampleLang, stepResult: StepResult): string {
    if (stepResult.request.method === "INTERNAL") {
        const url = formatSandboxRequestUrl(
            stepResult.request.method,
            stepResult.request.path,
        );
        return [
            "// This step runs inside the FilixPay merchant console (server-side).",
            "// It is not an Open API endpoint and is not implemented on your backend.",
            `// Internal action: poll webhook delivery records via ${url}`,
        ].join("\n");
    }

    const url = buildOpenApiUrl(stepResult.request.path);
    const method = stepResult.request.method.toUpperCase();
    const bodyJson = bodyLiteral(stepResult);
    const token = PLACEHOLDERS.accessToken;

    switch (lang) {
        case "curl": {
            const lines = [
                `curl -X ${method} '${url}' \\`,
                `  -H 'Authorization: Bearer ${token}' \\`,
                `  -H 'Accept: application/json'`,
            ];
            if (bodyJson) {
                lines.push(`  -H 'Content-Type: application/json' \\`);
                lines.push(`  -d '${bodyJson.replace(/\n/g, "").replace(/'/g, "'\\''")}'`);
            }
            return lines.join("\n");
        }
        case "node": {
            if (bodyJson) {
                return `const response = await fetch("${url}", {
  method: "${method}",
  headers: {
    Authorization: "Bearer ${token}",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${bodyJson}),
});
const data = await response.json();`;
            }
            return `const response = await fetch("${url}", {
  method: "${method}",
  headers: {
    Authorization: "Bearer ${token}",
    Accept: "application/json",
  },
});
const data = await response.json();`;
        }
        case "python": {
            if (bodyJson) {
                return `import requests

response = requests.post(
    "${url}",
    headers={
        "Authorization": f"Bearer ${token}",
        "Accept": "application/json",
    },
    json=${bodyJson},
)
response.raise_for_status()
data = response.json()`;
            }
            return `import requests

response = requests.get(
    "${url}",
    headers={
        "Authorization": f"Bearer ${token}",
        "Accept": "application/json",
    },
)
response.raise_for_status()
data = response.json()`;
        }
        case "java": {
            const methodCall =
                method === "GET"
                    ? ".GET()"
                    : `.method("${method}", HttpRequest.BodyPublishers.ofString(${bodyJson ? `"${bodyJson.replace(/"/g, '\\"').replace(/\n/g, "\\n")}"` : '""'}))`;
            return `HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${url}"))
    .header("Authorization", "Bearer ${token}")
    .header("Accept", "application/json")${bodyJson ? '\n    .header("Content-Type", "application/json")' : ""}
    ${methodCall}
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());`;
        }
    }
}
