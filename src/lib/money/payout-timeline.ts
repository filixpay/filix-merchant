export type PayoutTimelineStepState = "done" | "current" | "upcoming" | "failed";

export type PayoutTimelineSteps = {
  submitted: PayoutTimelineStepState;
  processing: PayoutTimelineStepState;
  confirmed: PayoutTimelineStepState;
  posted: PayoutTimelineStepState;
};

/**
 * Map payout product status to a 4-step Money-Out lifecycle.
 * CONFIRMED ≠ POSTED: rail success vs posting closure.
 */
export function presentPayoutTimeline(status: string): PayoutTimelineSteps {
  const code = status?.trim().toUpperCase() ?? "";

  if (code === "POSTED" || code === "COMPLETED" || code === "CLEARED") {
    return { submitted: "done", processing: "done", confirmed: "done", posted: "done" };
  }

  if (code === "CONFIRMED") {
    return { submitted: "done", processing: "done", confirmed: "current", posted: "upcoming" };
  }

  if (code === "FAILED" || code === "REJECTED") {
    return { submitted: "done", processing: "failed", confirmed: "upcoming", posted: "upcoming" };
  }

  if (code === "CANCELLED" || code === "CANCELED") {
    return { submitted: "done", processing: "failed", confirmed: "upcoming", posted: "upcoming" };
  }

  if (code === "PROCESSING") {
    return { submitted: "done", processing: "current", confirmed: "upcoming", posted: "upcoming" };
  }

  // REQUESTED / PENDING / unknown in-flight
  return { submitted: "done", processing: "current", confirmed: "upcoming", posted: "upcoming" };
}

export function formatMaskedAccountNumber(masked: string | null | undefined): string {
  const raw = masked?.trim() ?? "";
  if (!raw) {
    return "—";
  }
  const digits = raw.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  if (last4.length === 4) {
    return `•••• •••• •••• ${last4}`;
  }
  return raw;
}
