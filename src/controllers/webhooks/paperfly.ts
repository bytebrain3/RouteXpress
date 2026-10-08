import type {
  PaperflyWebhookPayload,
  WebhookVerifyResult,
  WebhookParseResult,
} from "@/types/webhook.js";

export class PaperflyWebhookHandler {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  verify(
    body: string | object,
    headers: Record<string, string | undefined>,
  ): WebhookVerifyResult {
    try {
      const secretHeader =
        headers["x-paperfly-webhook-secret"] ||
        headers["X-Paperfly-Webhook-Secret"];

      if (!secretHeader) {
        return { valid: false, error: "Missing webhook secret header" };
      }

      if (secretHeader !== this.secret) {
        return { valid: false, error: "Invalid webhook secret" };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Verification failed: ${(error as Error).message}`,
      };
    }
  }

  parse(body: string | object): WebhookParseResult<PaperflyWebhookPayload> {
    try {
      const payload =
        typeof body === "string" ? JSON.parse(body) : body;

      if (!payload || typeof payload !== "object") {
        return { success: false, error: "Invalid payload format" };
      }

      if (!payload.event) {
        return { success: false, error: "Missing event field" };
      }

      if (!payload.data) {
        return { success: false, error: "Missing data field" }
      }

      return { success: true, data: payload as PaperflyWebhookPayload };
    } catch (error) {
      return {
        success: false,
        error: `Parse error: ${(error as Error).message}`,
      };
    }
  }

  handle(
    body: string | object,
    headers: Record<string, string | undefined>,
  ): WebhookParseResult<PaperflyWebhookPayload> {
    const verifyResult = this.verify(body, headers);
    if (!verifyResult.valid) {
      return { success: false, error: verifyResult.error };
    }

    return this.parse(body);
  }
}
