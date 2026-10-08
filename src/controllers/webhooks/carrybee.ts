import type {
  CarrybeeWebhookPayload,
  WebhookVerifyResult,
  WebhookParseResult,
} from "@/types/webhook.js";

export class CarrybeeWebhookHandler {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  verify(
    body: string | object,
    headers: Record<string, string | undefined>,
  ): WebhookVerifyResult {
    try {
      const signatureHeader =
        headers["x-carrybee-webhook-signature"] ||
        headers["X-Carrybee-Webhook-Signature"];

      if (!signatureHeader) {
        return { valid: false, error: "Missing X-Carrybee-Webhook-Signature header" };
      }

      if (signatureHeader !== this.secret) {
        return { valid: false, error: "Invalid webhook signature" };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Verification failed: ${(error as Error).message}`,
      };
    }
  }

  parse(body: string | object): WebhookParseResult<CarrybeeWebhookPayload> {
    try {
      const payload =
        typeof body === "string" ? JSON.parse(body) : body;

      if (!payload || typeof payload !== "object") {
        return { success: false, error: "Invalid payload format" };
      }

      if (!payload.event) {
        return { success: false, error: "Missing event field" };
      }

      if (!payload.store_id) {
        return { success: false, error: "Missing store_id field" };
      }

      if (!payload.consignment_id) {
        return { success: false, error: "Missing consignment_id field" };
      }

      if (!payload.merchant_order_id) {
        return { success: false, error: "Missing merchant_order_id field" };
      }

      if (!payload.timestamptz) {
        return { success: false, error: "Missing timestamptz field" };
      }

      return { success: true, data: payload as CarrybeeWebhookPayload };
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
  ): WebhookParseResult<CarrybeeWebhookPayload> {
    const verifyResult = this.verify(body, headers);
    if (!verifyResult.valid) {
      return { success: false, error: verifyResult.error };
    }

    return this.parse(body);
  }
}
