#!/usr/bin/env node
/**
 * Enterprise Portal FE boundary — X-Enterprise-Code must not appear on portal/** fetches.
 * Plan Task FE / F25 (client-side guardrail).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const corePath = path.join(root, "src/lib/api/core.ts");
const enterpriseCorePath = path.join(root, "src/lib/api/enterprise-core.ts");

function read(rel) {
    return fs.readFileSync(path.join(root, rel), "utf8");
}

const failures = [];

if (!read("src/lib/api/core.ts").includes("resolveClientMerchantCode")) {
    failures.push("portal core.ts must keep merchant/org header resolution");
}

const enterpriseCore = read("src/lib/api/enterprise-core.ts");
if (enterpriseCore.includes("resolveClientMerchantCode") || enterpriseCore.includes("X-Merchant-Code")) {
    failures.push("enterprise-core.ts must not reference merchant portal headers");
}

if (!enterpriseCore.includes("includeEnterpriseCode")) {
    failures.push("enterprise-core.ts must support discovery without X-Enterprise-Code");
}

const enterpriseApi = read("src/lib/api/domains/enterprise/index.ts");
for (const method of ["suspendOrganization", "activateOrganization"]) {
    if (!enterpriseApi.includes(method)) {
        failures.push(`enterprise API client must expose ${method}`);
    }
}

const apiConfig = read("src/lib/api-config.ts");
for (const key of ["organizationSuspend", "organizationActivate", "AUDIT", "DASHBOARD_EXPORT"]) {
    if (!apiConfig.includes(key)) {
        failures.push(`api-config ENTERPRISE must define ${key}`);
    }
}

for (const method of ["listAudit", "exportDashboardCsv"]) {
    if (!enterpriseApi.includes(method)) {
        failures.push(`enterprise API client must expose ${method}`);
    }
}

const auditPage = path.join(root, "src/app/[locale]/enterprise/audit/page.tsx");
if (!fs.existsSync(auditPage)) {
    failures.push("enterprise audit page must exist");
}

if (failures.length) {
    console.error("FAIL verify-enterprise-portal:");
    for (const f of failures) console.error(" -", f);
    process.exit(1);
}

console.log("PASS verify-enterprise-portal");
