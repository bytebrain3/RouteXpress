import crypto from "node:crypto";
import type {
  SteadfastWebhookPayload,
  WebhookVerifyResult,
  WebhookParseResult,
} from "@/types/webhook.js";

export class SteadfastWebhookHandler {
  private apiSecret: string;

  constructor(apiSecret: string) {
    this.apiSecret = apiSecret;
  }

  verify(
    body: string | object,
    headers: Record<string, string | undefined>,
  ): WebhookVerifyResult {
    try {
      const authHeader = headers["authorization"] || headers["Authorization"];

      if (!authHeader) {
        return { valid: false, error: "Missing Authorization header" };
      }

      const token = authHeader.replace(/^Bearer\s+/i, "");

      if (token !== this.apiSecret) {
        return { valid: false, error: "Invalid API secret" };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Verification failed: ${(error as Error).message}`,
      };
    }
  }

  parse(body: string | object): WebhookParseResult<SteadfastWebhookPayload> {
    try {
      const payload =
        typeof body === "string" ? JSON.parse(body) : body;

      if (!payload || typeof payload !== "object") {
        return { success: false, error: "Invalid payload format" };
      }

      if (!payload.notification_type) {
        return {
          success: false,
          error: "Missing notification_type field",
        };
      }

      if (
        payload.notification_type !== "delivery_status" &&
        payload.notification_type !== "tracking_update"
      ) {
        return {
          success: false,
          error: `Unknown notification type: ${payload.notification_type}`,
        };
      }

      return { success: true, data: payload as SteadfastWebhookPayload };
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
  ): WebhookParseResult<SteadfastWebhookPayload> {
    const verifyResult = this.verify(body, headers);
    if (!verifyResult.valid) {
      return { success: false, error: verifyResult.error };
    }

    return this.parse(body);
  }
}
