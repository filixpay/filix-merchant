/** Validate Product write idempotency key: non-blank after trim. */
export function assertValidClientRequestId(
  clientRequestId: string | null | undefined,
): string {
  if (clientRequestId == null) {
    throw new Error("clientRequestId is required");
  }
  const trimmed = clientRequestId.trim();
  if (!trimmed) {
    throw new Error("clientRequestId must be non-blank");
  }
  return trimmed;
}

/** Generate a fresh clientRequestId once per user create intent. */
export function createClientRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `crid_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
