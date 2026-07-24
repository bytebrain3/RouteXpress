import crypto from "node:crypto";
import type {
  PathaoWebhookPayload,
  WebhookVerifyResult,
  WebhookParseResult,
} from "@/types/webhook.js";

export class PathaoWebhookHandler {
  private integrationSecret: string;

  constructor(integrationSecret: string) {
    this.integrationSecret = integrationSecret;
  }

  verify(
    body: string | object,
    headers: Record<string, string | undefined>,
  ): WebhookVerifyResult {
    try {
      const secretHeader =
        headers["x-pathao-merchant-webhook-integration-secret"] ||
        headers["X-Pathao-Merchant-Webhook-Integration-Secret"];

      if (!secretHeader) {
        return {
          valid: false,
          error: "Missing X-Pathao-Merchant-Webhook-Integration-Secret header",
        };
      }

      if (secretHeader !== this.integrationSecret) {
        return { valid: false, error: "Invalid integration secret" };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Verification failed: ${(error as Error).message}`,
      };
    }
  }

  verifySignature(
    body: string | object,
    headers: Record<string, string | undefined>,
  ): WebhookVerifyResult {
    try {
      const signatureHeader =
        headers["x-pathao-signature"] || headers["X-PATHAO-Signature"];

      if (!signatureHeader) {
        return { valid: false, error: "Missing X-PATHAO-Signature header" };
      }

      const bodyString = typeof body === "string" ? body : JSON.stringify(body);

      const expectedSignature = crypto
        .createHmac("sha256", this.integrationSecret)
        .update(bodyString)
        .digest("hex");

      if (signatureHeader !== expectedSignature) {
        return { valid: false, error: "Invalid webhook signature" };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Signature verification failed: ${(error as Error).message}`,
      };
    }
  }

  parse(body: string | object): WebhookParseResult<PathaoWebhookPayload> {
    try {
      const payload =
        typeof body === "string" ? JSON.parse(body) : body;

      if (!payload || typeof payload !== "object") {
        return { success: false, error: "Invalid payload format" };
      }

      if (!payload.event) {
        return { success: false, error: "Missing event field" };
      }

      if (!payload.consignment_id) {
        return { success: false, error: "Missing consignment_id field" };
      }

      return { success: true, data: payload as PathaoWebhookPayload };
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
  ): WebhookParseResult<PathaoWebhookPayload> {
    const verifyResult = this.verify(body, headers);
    if (!verifyResult.valid) {
      return { success: false, error: verifyResult.error };
    }

    return this.parse(body);
  }

  handleWithSignature(
    body: string | object,
    headers: Record<string, string | undefined>,
  ): WebhookParseResult<PathaoWebhookPayload> {
    const verifyResult = this.verifySignature(body, headers);
    if (!verifyResult.valid) {
      return { success: false, error: verifyResult.error };
    }

    return this.parse(body);
  }
}
