import crypto from "node:crypto";
import type {
  RedXWebhookPayload,
  WebhookVerifyResult,
  WebhookParseResult,
} from "@/types/webhook.js";

export class RedXWebhookHandler {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  verify(
    body: string | object,
    headers: Record<string, string | undefined>,
  ): WebhookVerifyResult {
    try {
      const authHeader =
        headers["api-access-token"] || headers["API-ACCESS-TOKEN"];

      if (!authHeader) {
        return { valid: false, error: "Missing API-ACCESS-TOKEN header" };
      }

      const token = authHeader.replace(/^Bearer\s+/i, "");

      if (token !== this.token) {
        return { valid: false, error: "Invalid API access token" };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Verification failed: ${(error as Error).message}`,
      };
    }
  }

  parse(body: string | object): WebhookParseResult<RedXWebhookPayload> {
    try {
      const payload =
        typeof body === "string" ? JSON.parse(body) : body;

      if (!payload || typeof payload !== "object") {
        return { success: false, error: "Invalid payload format" };
      }

      if (!payload.tracking_number) {
        return { success: false, error: "Missing tracking_number field" };
      }

      if (!payload.status) {
        return { success: false, error: "Missing status field" };
      }

      const validStatuses = [
        "ready-for-delivery",
        "delivery-in-progress",
        "delivered",
        "agent-hold",
        "agent-returning",
        "returned",
        "agent-area-change",
      ];

      if (!validStatuses.includes(payload.status)) {
        return {
          success: false,
          error: `Unknown status: ${payload.status}`,
        };
      }

      return { success: true, data: payload as RedXWebhookPayload };
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
  ): WebhookParseResult<RedXWebhookPayload> {
    const verifyResult = this.verify(body, headers);
    if (!verifyResult.valid) {
      return { success: false, error: verifyResult.error };
    }

    return this.parse(body);
  }
}
