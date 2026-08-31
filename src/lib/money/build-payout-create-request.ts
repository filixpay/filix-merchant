import type { PayoutCreateRequest } from "@/lib/api";

/** Pure builder for Money payout create body (P1 destinationAccountId hard cut). */
export function buildPayoutCreateRequest(input: {
  assetCode: string;
  amount: string;
  clientRequestId: string;
  paymentPin: string;
  destinationAccountId: string;
}): PayoutCreateRequest {
  return {
    assetCode: input.assetCode,
    amount: input.amount.trim(),
    clientRequestId: input.clientRequestId,
    paymentPin: input.paymentPin,
    destinationAccountId: input.destinationAccountId,
  };
}
