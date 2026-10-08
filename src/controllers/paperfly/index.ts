import { Paperfly_Config } from "@/types/config.js";
import {
  PaperflyCreateOrder,
  PaperflyOrderResponse,
  PaperflyTrackingResponse,
  PaperflyCancelResponse,
  ErrorResponse,
} from "@/types/paperfly.js";
import {
  RequestResult,
  validationError,
  apiError,
  unknownError,
} from "@/utils/errors.js";
import { validatePaperflyOrder } from "@/validators/paperfly.js";

class Paperfly {
  private config: Paperfly_Config;
  private baseUrl = "https://api.paperfly.com.bd";

  constructor(config: Paperfly_Config) {
    this.config = config;
  }

  private async request<T>(
    path: string,
    init?: RequestInit,
  ): Promise<RequestResult<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, init);
      const raw = await response.text();

      if (!response.ok) {
        return { ok: false, error: await apiError(response, raw) };
      }

      if (!raw) {
        return { ok: true, data: {} as T };
      }

      try {
        return { ok: true, data: JSON.parse(raw) as T };
      } catch {
        return {
          ok: false,
          error: {
            status: response.status,
            message: "Invalid JSON response from Paperfly",
          },
        };
      }
    } catch (error) {
      return { ok: false, error: unknownError(error) };
    }
  }

  private headers(): Record<string, string> {
    const auth = btoa(`${this.config.username}:${this.config.password}`);
    return {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
      paperflykey: this.config.apiKey,
    };
  }

  async createOrder(
    orderData: PaperflyCreateOrder,
  ): Promise<PaperflyOrderResponse | ErrorResponse> {
    const validation = validatePaperflyOrder(orderData);
    if (validation) {
      return validationError(validation);
    }

    const result = await this.request<PaperflyOrderResponse>(
      "/merchant/api/service/new_order_v2.php",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(orderData),
      },
    );
    return result.ok ? result.data : result.error;
  }

  async trackOrder(
    referenceNumber: string,
  ): Promise<PaperflyTrackingResponse | ErrorResponse> {
    if (!referenceNumber) {
      return validationError("Reference number is required");
    }

    const result = await this.request<PaperflyTrackingResponse>(
      "/API-Order-Tracking",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ ReferenceNumber: referenceNumber }),
      },
    );
    return result.ok ? result.data : result.error;
  }

  async cancelOrder(
    orderId: string,
  ): Promise<PaperflyCancelResponse | ErrorResponse> {
    if (!orderId) {
      return validationError("Order ID is required");
    }

    const result = await this.request<PaperflyCancelResponse>(
      "/api/v1/cancel-order",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ order_id: orderId }),
      },
    );
    return result.ok ? result.data : result.error;
  }
}

export { Paperfly };
