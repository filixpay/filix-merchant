import { createClientRequestId } from "./client-request-id";

/**
 * One clientRequestId per create-form attempt.
 * Reuse across submit/network retries; call renew() when the user starts a new Money-In.
 */
export class ClientRequestIdAttempt {
  private id: string;

  constructor() {
    this.id = createClientRequestId();
  }

  current(): string {
    return this.id;
  }

  renew(): void {
    this.id = createClientRequestId();
  }
}
