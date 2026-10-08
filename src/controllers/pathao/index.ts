import {
  TokenIssueResponse,
  ErrorResponse,
  PathaoStore,
  PathaoStoreResponse,
  CreatePathaoOrder,
  CreatePathaoOrderResponse,
  Bulk_Order_For_Pathao_Response,
  Bulk_Order_For_Pathao,
  PathaoCityResponse,
  PathaoZoneResponse,
  PathaoPriceResponse,
  PathaoAreaResponse,
  PathaoOrderPiceData,
  PathaoAllStoreResponse,
} from "@/types/pathao.js";

import { Pathao_Config } from "@/types/config.js";
import {
  ErrorResponse as ApiErrorResponse,
  RequestResult,
  validationError,
  apiError,
  unknownError,
} from "@/utils/errors.js";
import {
  validatePathaoStore,
  validatePathaoOrder,
  validatePathaoBulkOrder,
} from "@/validators/pathao.js";

class Pathao {
  private config: Pathao_Config;
  private baseUrl: string;

  constructor(config: Pathao_Config) {
    this.config = config;
    this.baseUrl = "https://api-hermes.pathao.com";
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
            message: "Invalid JSON response from Pathao",
          },
        };
      }
    } catch (error) {
      return { ok: false, error: unknownError(error) };
    }
  }

  private authHeaders(authToken: string): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
  }

  /**
   * Issue a new access token using credentials.
   *
   * @returns Token response with `access_token` and `refresh_token`, or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.createNewToken();
   * //=> { access_token: "eyJhbG...", refresh_token: "abc123", expires_in: 3600, token_type: "bearer" }
   * ```
   */
  async createNewToken(): Promise<TokenIssueResponse | ErrorResponse> {
    const result = await this.request<TokenIssueResponse>(
      "/aladdin/api/v1/issue-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: this.config.apiKey ?? "",
          client_secret: this.config.apiSecret ?? "",
          grant_type: "password",
          username: this.config.username ?? "",
          password: this.config.password ?? "",
        }),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Refresh an expired access token.
   *
   * @param refreshToken - The refresh token from a previous `createNewToken` call.
   * @returns New token response or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.createRefreshToken("abc123");
   * //=> { access_token: "eyJhbG...", refresh_token: "def456", expires_in: 3600, token_type: "bearer" }
   * ```
   */
  async createRefreshToken(
    refreshToken: string,
  ): Promise<TokenIssueResponse | ErrorResponse> {
    const result = await this.request<TokenIssueResponse>(
      "/aladdin/api/v1/issue-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: this.config.apiKey,
          client_secret: this.config.apiSecret,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Create a new pickup store.
   *
   * @param authToken - Bearer token from `createNewToken`.
   * @param store - Store details including name, contact, address, and location IDs.
   * @returns Created store info or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.createStore("eyJhbG...", {
   *   name: "My Shop",
   *   contact_name: "John Doe",
   *   contact_number: "01712345678",
   *   address: "123 Main St, Dhaka",
   *   city_id: 1,
   *   zone_id: 10,
   *   area_id: 100,
   * });
   * //=> { message: "Store created successfully", data: { store_name: "My Shop" } }
   * ```
   */
  async createStore(
    authToken: string,
    store: PathaoStore,
  ): Promise<PathaoStoreResponse | ErrorResponse> {
    const validation = validatePathaoStore(store);
    if (validation) {
      return validationError(validation);
    }

    const result = await this.request<PathaoStoreResponse>(
      "/aladdin/api/v1/stores",
      {
        method: "POST",
        headers: this.authHeaders(authToken),
        body: JSON.stringify(store),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Create a new delivery order.
   *
   * @param authToken - Bearer token from `createNewToken`.
   * @param order - Order details including store, recipient, and item info.
   * @returns Created order with consignment ID or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.createOrder("eyJhbG...", {
   *   authToken: "eyJhbG...",
   *   store_id: 1,
   *   recipient_name: "John Doe",
   *   recipient_phone: "01712345678",
   *   recipient_address: "123 Main St, Dhaka",
   *   recipient_city: 1,
   *   recipient_zone: 10,
   *   delivery_type: 48,
   *   item_type: 2,
   *   item_quantity: 1,
   *   item_weight: 1.5,
   *   amount_to_collect: 1500,
   * });
   * //=> { consignment_id: "DL121224VS8TTJ", order_status: "placed", delivery_fee: 83.46 }
   * ```
   */
  async createOrder(
    authToken: string,
    order: CreatePathaoOrder,
  ): Promise<CreatePathaoOrderResponse | ErrorResponse> {
    const validation = validatePathaoOrder(order);
    if (validation) {
      return validationError(validation);
    }

    const removeAuthTokrn = { ...order, authToken: undefined };
    const result = await this.request<CreatePathaoOrderResponse>(
      "/aladdin/api/v1/orders",
      {
        method: "POST",
        headers: this.authHeaders(authToken),
        body: JSON.stringify(removeAuthTokrn),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Create multiple orders in a single request.
   *
   * @param pathaoOrder - Object containing `authToken` and an array of order items.
   * @returns Array of order results or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.createBulkOrder({
   *   authToken: "eyJhbG...",
   *   orders: [
   *     {
   *       store_id: 1,
   *       recipient_name: "John Doe",
   *       recipient_phone: "01712345678",
   *       recipient_address: "123 Main St, Dhaka",
   *       recipient_city: 1,
   *       recipient_zone: 10,
   *       delivery_type: 48,
   *       item_type: 2,
   *       item_quantity: 1,
   *       item_weight: 1.5,
   *       amount_to_collect: 1500,
   *     },
   *   ],
   * });
   * //=> [{ consignment_id: "DL121224VS8TTJ", ... }, ...]
   * ```
   */
  async createBulkOrder(
    pathaoOrder: Bulk_Order_For_Pathao,
  ): Promise<Bulk_Order_For_Pathao_Response[] | ErrorResponse> {
    const validation = validatePathaoBulkOrder(pathaoOrder);
    if (validation) {
      return validationError(validation);
    }

    const result = await this.request<Bulk_Order_For_Pathao_Response[]>(
      "/aladdin/api/v1/orders/bulk",
      {
        method: "POST",
        headers: this.authHeaders(pathaoOrder.authToken),
        body: JSON.stringify({ orders: pathaoOrder.orders }),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Get order info by consignment ID.
   *
   * @param cidDetails - Object with `cid` (consignment ID) and `authToken`.
   * @returns Order info or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.getStatusByCid({
   *   cid: "DL121224VS8TTJ",
   *   authToken: "eyJhbG...",
   * });
   * //=> { consignment_id: "DL121224VS8TTJ", order_status: "delivered", ... }
   * ```
   */
  async getStatusByCid(
    cidDetails: { cid: string; authToken: string },
  ): Promise<Record<string, unknown> | ErrorResponse> {
    if (!cidDetails?.authToken) {
      return validationError("Valid authentication token is required");
    }
    if (!cidDetails.cid) {
      return validationError("CID is required to get order status");
    }

    const result = await this.request<Record<string, unknown>>(
      `/aladdin/api/v1/orders/${cidDetails.cid}/info`,
      {
        method: "GET",
        headers: this.authHeaders(cidDetails.authToken),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Get the list of cities available for delivery.
   *
   * @param authToken - Bearer token.
   * @returns City list or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.getCitys("eyJhbG...");
   * //=> { data: [{ city_id: 1, city_name: "Dhaka" }, ...] }
   * ```
   */
  async getCitys(
    authToken: string,
  ): Promise<PathaoCityResponse | ErrorResponse> {
    const result = await this.request<PathaoCityResponse>(
      "/aladdin/api/v1/city-list",
      {
        method: "GET",
        headers: this.authHeaders(authToken),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Get zones inside a city.
   *
   * @param authToken - Bearer token.
   * @param cityId - The city ID from `getCitys`.
   * @returns Zone list or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.getZone("eyJhbG...", 1);
   * //=> { data: [{ zone_id: 10, zone_name: "Dhanmondi" }, ...] }
   * ```
   */
  async getZone(
    authToken: string,
    cityId: number,
  ): Promise<PathaoZoneResponse | ErrorResponse> {
    const result = await this.request<PathaoZoneResponse>(
      `/aladdin/api/v1/cities/${cityId}/zone-list`,
      {
        method: "GET",
        headers: this.authHeaders(authToken),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Get areas inside a zone.
   *
   * @param authToken - Bearer token.
   * @param zoneId - The zone ID from `getZone`.
   * @returns Area list or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.get_area_list("eyJhbG...", 10);
   * //=> { data: [{ area_id: 100, area_name: "Lalmatia", home_delivery_available: true, pickup_available: true }, ...] }
   * ```
   */
  async get_area_list(
    authToken: string,
    zoneId: number,
  ): Promise<PathaoAreaResponse | ErrorResponse> {
    const result = await this.request<PathaoAreaResponse>(
      `/aladdin/api/v1/zones/${zoneId}/area-list`,
      {
        method: "GET",
        headers: this.authHeaders(authToken),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Calculate the delivery price for an order.
   *
   * @param authToken - Bearer token.
   * @param orderData - Item type, delivery type, weight, city, and zone.
   * @returns Price breakdown or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.price_plane("eyJhbG...", {
   *   store_id: 1,
   *   item_type: 2,
   *   delivery_type: 48,
   *   item_weight: 1.5,
   *   recipient_city: 1,
   *   recipient_zone: 10,
   * });
   * //=> { data: { price: 83.46, discount: 0, final_price: 83.46 } }
   * ```
   */
  async price_plane(
    authToken: string,
    orderData: PathaoOrderPiceData,
  ): Promise<PathaoPriceResponse | ErrorResponse> {
    const result = await this.request<PathaoPriceResponse>(
      "/aladdin/api/v1/merchant/price-plan",
      {
        method: "POST",
        headers: this.authHeaders(authToken),
        body: JSON.stringify(orderData),
      },
    );
    return result.ok ? result.data : result.error;
  }

  /**
   * Get all stores for the merchant account.
   *
   * @param authToken - Bearer token.
   * @returns Paginated store list or an error.
   *
   * @example
   * ```ts
   * const result = await pathao.getAllStore("eyJhbG...");
   * //=> { data: [{ store_id: "1", store_name: "My Shop", ... }], pagination: { total: 5, ... } }
   * ```
   */
  async getAllStore(
    authToken: string,
  ): Promise<PathaoAllStoreResponse | ErrorResponse> {
    const result = await this.request<PathaoAllStoreResponse>(
      "/aladdin/api/v1/stores",
      {
        method: "GET",
        headers: this.authHeaders(authToken),
      },
    );
    return result.ok ? result.data : result.error;
  }
}

export { Pathao };
