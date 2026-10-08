import { Redx_Config } from "@/types/config.js";
import {
  RedxCreateOrder,
  ErrorResponse,
  RedxResponse,
  RedxUpdateOrder,
  RedxStoreResponse,
  RedxTrackByidResponse,
  RedxTrackByid,
  RedxAreaResponse,
} from "@/types/redx.js";
import {
  ErrorResponse as ApiErrorResponse,
  RequestResult,
  validationError,
  apiError,
  unknownError,
} from "@/utils/errors.js";
import { validateRedxOrder } from "@/validators/redx.js";

class Redx {
  private config: Redx_Config;
  private baseUrl: string;

  constructor(config: Redx_Config, environment: "production" | "development") {
    this.config = config;
    this.baseUrl =
      environment === "production"
        ? "openapi.redx.com.bd/v1.0.0-beta"
        : "sandbox.redx.com.bd/v1.0.0-beta";
  }

  private async request<T>(
    path: string,
    init?: RequestInit,
  ): Promise<RequestResult<T>> {
    try {
      const response = await fetch(`https://${this.baseUrl}${path}`, init);
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
            message: "Invalid JSON response from RedX",
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
      "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
    };
  }

  /**
   * Create a new parcel on RedX.
   *
   * @param orderData - Customer info, delivery area, weight, and COD amount.
   * @returns Tracking ID on success, or an error.
   *
   * @example
   * ```ts
   * const result = await redx.createOrder({
   *   customer_name: "John Doe",
   *   customer_phone: "01712345678",
   *   delivery_area: "Mirpur DOHS",
   *   delivery_area_id: 12,
   *   customer_address: "123 Main St, Mirpur, Dhaka",
   *   cash_collection_amount: "1500",
   *   parcel_weight: "500",
   *   value: "2000",
   * });
   * //=> { tracking_id: "21A427TU4BN3R" }
   * ```
   */
  async createOrder(
    orderData: RedxCreateOrder
  ): Promise<RedxResponse | ErrorResponse> {
    const validation = validateRedxOrder(orderData);
    if (validation) {
      return validationError(validation);
    }

    const result = await this.request<RedxResponse>("/parcel", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(orderData),
    });
    return result.ok ? result.data : result.error;
  }

  /**
   * Create a pickup store.
   *
   * @param storeData - Store name, phone, address, and area ID.
   * @returns Created store info or an error.
   *
   * @example
   * ```ts
   * const result = await redx.createStore({
   *   name: "My Pickup Store",
   *   phone: "01712345678",
   *   address: "123 Main St, Dhaka",
   *   area_id: "1",
   * });
   * //=> { id: 1, name: "My Pickup Store", address: "123 Main St, Dhaka", area_name: "Mirpur", area_id: 1, phone: "01712345678" }
   * ```
   */
  async createStore(storeData: {
    name: string;
    address: string;
    phone: string;
    area_id: string;
  }): Promise<RedxStoreResponse | ErrorResponse> {
    if (!storeData) {
      return validationError("Store data is required");
    }
    if (!storeData.name) {
      return validationError("Store name is required");
    }
    if (!storeData.address) {
      return validationError("Store address is required");
    }
    if (!storeData.phone) {
      return validationError("Store phone is required");
    }
    if (!storeData.area_id) {
      return validationError("Store area ID is required");
    }

    const result = await this.request<RedxStoreResponse>("/pickup/store", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(storeData),
    });
    return result.ok ? result.data : result.error;
  }

  /**
   * Track a parcel by tracking code.
   *
   * @param trackingCode - The RedX tracking ID.
   * @returns Tracking history with timestamps, or an error.
   *
   * @example
   * ```ts
   * const result = await redx.trackParcelByTrackingCode("21A427TU4BN3R");
   * //=> { tracking: [{ message_en: "Package is created successfully", time: "2025-01-01T10:00:00.000Z" }, ...] }
   * ```
   */
  async trackParcelByTrackingCode(
    trackingCode: string
  ): Promise<RedxTrackByidResponse | ErrorResponse> {
    if (!trackingCode) {
      return validationError("Tracking code is required");
    }

    const result = await this.request<RedxTrackByidResponse>(
      `/parcel/track/${trackingCode}`,
      {
        method: "GET",
        headers: this.headers(),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Get detailed parcel info by tracking code.
   *
   * @param trackingCode - The RedX tracking ID.
   * @returns Full parcel details including pickup location, or an error.
   *
   * @example
   * ```ts
   * const result = await redx.getParcelInfoByTrackingCode("21A427TU4BN3R");
   * //=> { parcel: { tracking_id: "21A427TU4BN3R", customer_name: "John", status: "pickup-pending", ... } }
   * ```
   */
  async getParcelInfoByTrackingCode(
    trackingCode: string
  ): Promise<RedxTrackByid | ErrorResponse> {
    if (!trackingCode) {
      return validationError("Tracking code is required");
    }

    const result = await this.request<RedxTrackByid>(
      `/parcel/info/${trackingCode}`,
      {
        method: "GET",
        headers: this.headers(),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Update parcel details (e.g., cancel, change address).
   *
   * @param trackingCode - The RedX tracking ID.
   * @param updateData - The update payload (property_name, new_value, reason).
   * @returns Success status or an error.
   *
   * @example
   * ```ts
   * const result = await redx.updateParcel("21A427TU4BN3R", {
   *   property_name: "status",
   *   new_value: "cancelled",
   *   reason: "Customer requested cancellation",
   * });
   * //=> { success: true, message: "Request Accepted" }
   * ```
   */
  async updateParcel(
    trackingCode: string,
    updateData: object
  ): Promise<RedxUpdateOrder | ErrorResponse> {
    if (!trackingCode) {
      return validationError("Tracking code is required");
    }
    if (!updateData || typeof updateData !== "object") {
      return validationError("Update data is required");
    }

    const result = await this.request<RedxUpdateOrder>("/parcels", {
      method: "PATCH",
      headers: this.headers(),
      body: JSON.stringify({
        entity_type: "parcel-tracking-id",
        entity_id: trackingCode,
        update_details: updateData,
      }),
    });
    return result.ok ? result.data : result.error;
  }

  /**
   * Get all available delivery areas.
   *
   * @returns Array of areas with IDs, post codes, and division info, or an error.
   *
   * @example
   * ```ts
   * const result = await redx.getAreaList();
   * //=> [{ id: 1, name: "Mirpur DOHS", post_code: 1216, division_name: "Dhaka", zone_id: 1 }, ...]
   * ```
   */
  async getAreaList(): Promise<RedxAreaResponse[] | ErrorResponse> {
    const result = await this.request<RedxAreaResponse[]>("/areas", {
      method: "GET",
      headers: this.headers(),
    });
    return result.ok ? result.data : result.error;
  }

  /**
   * Get areas by postal code.
   *
   * @param postcode - The postal code to look up.
   * @returns Matching areas or an error.
   *
   * @example
   * ```ts
   * const result = await redx.getAreaByPostcode("1216");
   * //=> { areas: [{ id: 1, name: "Mirpur DOHS", post_code: 1216, ... }] }
   * ```
   */
  async getAreaByPostcode(
    postcode: string
  ): Promise<RedxAreaResponse | ErrorResponse> {
    if (!postcode) {
      return validationError("Postcode is required");
    }

    const result = await this.request<RedxAreaResponse>(
      `/areas?post_code=${postcode}`,
      {
        method: "GET",
        headers: this.headers(),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Get areas by district name.
   *
   * @param districtName - The district name (e.g., "Dhaka").
   * @returns Matching areas or an error.
   *
   * @example
   * ```ts
   * const result = await redx.getAreaByDistrictName("Dhaka");
   * //=> { areas: [{ id: 1, name: "Mirpur DOHS", post_code: 1216, division_name: "Dhaka", ... }] }
   * ```
   */
  async getAreaByDistrictName(
    districtName: string
  ): Promise<RedxAreaResponse | ErrorResponse> {
    if (!districtName) {
      return validationError("District name is required");
    }

    const result = await this.request<RedxAreaResponse>(
      `/areas?district_name=${districtName}`,
      {
        method: "GET",
        headers: this.headers(),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Get all pickup stores.
   *
   * @returns Array of pickup stores or an error.
   *
   * @example
   * ```ts
   * const result = await redx.getStores();
   * //=> [{ id: 1, name: "My Store", address: "123 Main St", area_name: "Mirpur", area_id: 1, phone: "01712345678" }, ...]
   * ```
   */
  async getStores(): Promise<RedxStoreResponse[] | ErrorResponse> {
    const result = await this.request<RedxStoreResponse[]>("/pickup/stores", {
      method: "GET",
      headers: this.headers(),
    });
    return result.ok ? result.data : result.error;
  }

  /**
   * Get pickup store details by store ID.
   *
   * @param storeId - The pickup store ID.
   * @returns Store details or an error.
   *
   * @example
   * ```ts
   * const result = await redx.getPickupStoreInfo("1");
   * //=> { id: 1, name: "My Store", address: "123 Main St", area_name: "Mirpur", area_id: 1, phone: "01712345678", created_at: "2025-01-01T00:00:00.000Z" }
   * ```
   */
  async getPickupStoreInfo(
    storeId: string
  ): Promise<RedxStoreResponse | ErrorResponse> {
    if (!storeId) {
      return validationError("Store ID is required");
    }

    const result = await this.request<RedxStoreResponse>(
      `/pickup/store/info/${storeId}`,
      {
        method: "GET",
        headers: this.headers(),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Calculate delivery charge for a parcel.
   *
   * @param orderData - Delivery area, pickup area, COD amount, and weight.
   * @returns Price breakdown with delivery and COD charges, or an error.
   *
   * @example
   * ```ts
   * const result = await redx.calculatePrice({
   *   delivery_area_id: 12,
   *   pickup_area_id: 1,
   *   cash_collection_amount: 1500,
   *   weight: 500,
   * });
   * //=> { deliveryCharge: 60, codCharge: 0 }
   * ```
   */
  async calculatePrice(
    orderData:
      | {
          delivery_area_id: number;
          pickup_area_id: number;
          cash_collection_amount: number;
          weight: number;
        }
      | object
  ) {
    const queryParams = new URLSearchParams(
      orderData as Record<string, string>,
    ).toString();

    const result = await this.request<Record<string, unknown>>(
      `/charge/charge_calculator?${queryParams}`,
      {
        method: "GET",
        headers: { "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}` },
      },
    );
    return result.ok ? result.data : result.error;
  }
}

export { Redx };
