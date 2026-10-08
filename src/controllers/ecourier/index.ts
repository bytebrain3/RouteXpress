import { Ecourier_Config } from "@/types/config.js";
import {
  EcourierCreateOrder,
  EcourierOrderResponse,
  EcourierTrackingResponse,
  EcourierCancelResponse,
  EcourierPackage,
  EcourierFraudCheckResponse,
  EcourierCity,
  EcourierThana,
  EcourierBranch,
  EcourierPaymentStatus,
  ErrorResponse,
} from "@/types/ecourier.js";
import {
  RequestResult,
  validationError,
  apiError,
  unknownError,
} from "@/utils/errors.js";
import { validateEcourierOrder } from "@/validators/ecourier.js";

class Ecourier {
  private config: Ecourier_Config;
  private baseUrl: string;

  constructor(config: Ecourier_Config) {
    this.config = config;
    this.baseUrl =
      config.environment === "production"
        ? "https://backoffice.ecourier.com.bd/api"
        : "https://staging.ecourier.com.bd/api";
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
            message: "Invalid JSON response from eCourier",
          },
        };
      }
    } catch (error) {
      return { ok: false, error: unknownError(error) };
    }
  }

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "API-KEY": this.config.apiKey,
      "API-SECRET": this.config.apiSecret,
      "USER-ID": this.config.userId,
    };
  }

  async createOrder(
    orderData: EcourierCreateOrder,
  ): Promise<EcourierOrderResponse | ErrorResponse> {
    const validation = validateEcourierOrder(orderData);
    if (validation) {
      return validationError(validation);
    }

    const result = await this.request<EcourierOrderResponse>("/order-place", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(orderData),
    });
    return result.ok ? result.data : result.error;
  }

  async trackOrder(
    productId?: string,
    ecr?: string,
  ): Promise<EcourierTrackingResponse | ErrorResponse> {
    if (!productId && !ecr) {
      return validationError("Product ID or ECR number is required");
    }

    const body: Record<string, string> = {};
    if (productId) body.product_id = productId;
    if (ecr) body.ecr = ecr;

    const result = await this.request<EcourierTrackingResponse>("/track", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    return result.ok ? result.data : result.error;
  }

  async cancelOrder(
    tracking: string,
    comment: string,
  ): Promise<EcourierCancelResponse | ErrorResponse> {
    if (!tracking) {
      return validationError("Tracking number is required");
    }
    if (!comment || comment.length > 255) {
      return validationError("Comment is required and must be under 255 characters");
    }

    const result = await this.request<EcourierCancelResponse>("/cancel-order", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ tracking, comment }),
    });
    return result.ok ? result.data : result.error;
  }

  async getPackages(): Promise<EcourierPackage[] | ErrorResponse> {
    const result = await this.request<EcourierPackage[]>("/packages", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({}),
    });
    return result.ok ? result.data : result.error;
  }

  async fraudCheck(
    number: string,
  ): Promise<EcourierFraudCheckResponse | ErrorResponse> {
    if (!number) {
      return validationError("Phone number is required");
    }

    const result = await this.request<EcourierFraudCheckResponse>(
      "/fraud-status-check",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ number }),
      },
    );
    return result.ok ? result.data : result.error;
  }

  async getCities(): Promise<EcourierCity[] | ErrorResponse> {
    const result = await this.request<EcourierCity[]>("/city-list", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({}),
    });
    return result.ok ? result.data : result.error;
  }

  async getThanas(city: string): Promise<EcourierThana[] | ErrorResponse> {
    if (!city) {
      return validationError("City is required");
    }

    const result = await this.request<{ success: boolean; message: EcourierThana[] }>(
      "/thana-list",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ city }),
      },
    );
    if (!result.ok) return result.error;
    return result.data.message;
  }

  async getAreas(postcode: string): Promise<EcourierThana[] | ErrorResponse> {
    if (!postcode) {
      return validationError("Postcode is required");
    }

    const result = await this.request<{ success: boolean; message: EcourierThana[] }>(
      "/area-list",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ postcode }),
      },
    );
    if (!result.ok) return result.error;
    return result.data.message;
  }

  async getBranches(): Promise<EcourierBranch[] | ErrorResponse> {
    const result = await this.request<{ success: boolean; message: EcourierBranch[] }>(
      "/branch-list",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({}),
      },
    );
    if (!result.ok) return result.error;
    return result.data.message;
  }

  async getPaymentStatus(
    tracking: string,
  ): Promise<EcourierPaymentStatus | ErrorResponse> {
    if (!tracking) {
      return validationError("Tracking number is required");
    }

    const result = await this.request<EcourierPaymentStatus>(
      "/payment-status",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ tracking }),
      },
    );
    return result.ok ? result.data : result.error;
  }

  async trackChild(
    productId?: string,
    ecr?: string,
  ): Promise<EcourierTrackingResponse | ErrorResponse> {
    if (!productId && !ecr) {
      return validationError("Product ID or ECR number is required");
    }

    const body: Record<string, string> = {};
    if (productId) body.product_id = productId;
    if (ecr) body.ecr = ecr;

    const result = await this.request<EcourierTrackingResponse>("/track-child", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    return result.ok ? result.data : result.error;
  }

  async cancelChildOrder(
    tracking: string,
    comment: string,
  ): Promise<EcourierCancelResponse | ErrorResponse> {
    if (!tracking) {
      return validationError("Tracking number is required");
    }
    if (!comment || comment.length > 255) {
      return validationError("Comment is required and must be under 255 characters");
    }

    const result = await this.request<EcourierCancelResponse>(
      "/cancel-order-child",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify({ tracking, comment }),
      },
    );
    return result.ok ? result.data : result.error;
  }
}

export { Ecourier };
