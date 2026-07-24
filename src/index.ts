import {
  Order_Data_For_Steadfast,
  Bulk_Order_For_Steadfast,
  Create_Return_Request_Params,
} from "@/types/steadfast.js";
import {
  PathaoStore,
  CreatePathaoOrder,
  Bulk_Order_For_Pathao,
} from "@/types/pathao.js";

import { RedxCreateOrder } from "@/types/redx.js";

import { Config } from "@/types/config.js";

import { Steadfast } from "@/controllers/steadfast/index.js";
import { Pathao } from "@/controllers/pathao/index.js";
import { Redx } from "@/controllers/redx/index.js";
import {
  SteadfastWebhookHandler,
  PathaoWebhookHandler,
  RedXWebhookHandler,
} from "@/controllers/webhooks/index.js";

export {
  SteadfastWebhookHandler,
  PathaoWebhookHandler,
  RedXWebhookHandler,
} from "@/controllers/webhooks/index.js";

export type {
  SteadfastWebhookPayload,
  SteadfastDeliveryStatusWebhook,
  SteadfastTrackingUpdateWebhook,
  PathaoWebhookPayload,
  PathaoWebhookEvent,
  PathaoWebhookBase,
  RedXWebhookPayload,
  RedXWebhookStatus,
  RedXDeliveryType,
  WebhookVerifyResult,
  WebhookParseResult,
} from "@/types/webhook.js";

export type {
  Config,
  Steadfast_Config,
  Pathao_Config,
  Redx_Config,
  SteadfastWebhookConfig,
  PathaoWebhookConfig,
  RedXWebhookConfig,
} from "@/types/config.js";
class RouteXpress {
  private config: Config;
  private pathao?: Pathao;
  private steadfast?: Steadfast;
  private redx?: Redx;
  private steadfastWebhook?: SteadfastWebhookHandler;
  private pathaoWebhook?: PathaoWebhookHandler;
  private redxWebhook?: RedXWebhookHandler;

  constructor(config: Config) {
    if (!config) {
      throw new Error("Configuration is required");
    }

    this.config = config;

    // Initialize services only if their configs are provided
    if (config.steadfast) {
      this.steadfast = new Steadfast(config.steadfast);
    }

    if (config.pathao) {
      this.pathao = new Pathao(config.pathao);
    }

    if (config.redx) {
      this.redx = new Redx(config.redx, config.redx.environment);
    }

    // Initialize webhook handlers if configured
    if (config.webhooks?.steadfast?.enabled && config.webhooks.steadfast.apiSecret) {
      this.steadfastWebhook = new SteadfastWebhookHandler(
        config.webhooks.steadfast.apiSecret,
      );
    }

    if (config.webhooks?.pathao?.enabled && config.webhooks.pathao.integrationSecret) {
      this.pathaoWebhook = new PathaoWebhookHandler(
        config.webhooks.pathao.integrationSecret,
      );
    }

    if (config.webhooks?.redx?.enabled && config.webhooks.redx.apiAccessToken) {
      this.redxWebhook = new RedXWebhookHandler(
        config.webhooks.redx.apiAccessToken,
      );
    }

    // Ensure at least one service is configured
    if (!this.steadfast && !this.pathao && !this.redx) {
      throw new Error(
        "At least one delivery service provider must be configured",
      );
    }
  }

  /**
   * Safely access the Steadfast service.
   * @returns {Steadfast} The Steadfast service instance.
   * @throws {Error} If the Steadfast service is not configured.
   */
  protected getSteadfast(): Steadfast {
    if (!this.steadfast) {
      throw new Error("Steadfast service is not configured");
    }
    return this.steadfast;
  }

  /**
   * Safely access the Pathao service.
   * @returns {Pathao} The Pathao service instance.
   * @throws {Error} If the Pathao service is not configured.
   */
  protected getPathao(): Pathao {
    if (!this.pathao) {
      throw new Error("Pathao service is not configured");
    }
    return this.pathao;
  }

  /**
   * Safely access the Redx service.
   * @returns {Redx} The Redx service instance.
   * @throws {Error} If the Redx service is not configured.
   */
  protected getRedx(): Redx {
    if (!this.redx) {
      throw new Error("Redx service is not configured");
    }
    return this.redx;
  }

  /**
   * Safely access the Steadfast webhook handler.
   *
   * @returns The Steadfast webhook handler.
   * @throws If Steadfast webhooks are not configured.
   *
   * @example
   * ```ts
   * const handler = rx.getSteadfastWebhook();
   * const result = handler.handle(requestBody, requestHeaders);
   * if (result.success) {
   *   console.log(result.data);
   * }
   * ```
   */
  getSteadfastWebhook(): SteadfastWebhookHandler {
    if (!this.steadfastWebhook) {
      throw new Error("Steadfast webhook is not configured");
    }
    return this.steadfastWebhook;
  }

  /**
   * Safely access the Pathao webhook handler.
   *
   * @returns The Pathao webhook handler.
   * @throws If Pathao webhooks are not configured.
   *
   * @example
   * ```ts
   * const handler = rx.getPathaoWebhook();
   * // Verify via integration secret header
   * const result = handler.handle(requestBody, requestHeaders);
   * // Or verify via HMAC-SHA256 signature
   * const result = handler.handleWithSignature(requestBody, requestHeaders);
   * ```
   */
  getPathaoWebhook(): PathaoWebhookHandler {
    if (!this.pathaoWebhook) {
      throw new Error("Pathao webhook is not configured");
    }
    return this.pathaoWebhook;
  }

  /**
   * Safely access the RedX webhook handler.
   *
   * @returns The RedX webhook handler.
   * @throws If RedX webhooks are not configured.
   *
   * @example
   * ```ts
   * const handler = rx.getRedXWebhook();
   * const result = handler.handle(requestBody, requestHeaders);
   * if (result.success) {
   *   console.log(result.data);
   * }
   * ```
   */
  getRedXWebhook(): RedXWebhookHandler {
    if (!this.redxWebhook) {
      throw new Error("RedX webhook is not configured");
    }
    return this.redxWebhook;
  }

  /**
   * Get the configured webhook URL for a provider.
   *
   * @param provider - The delivery service provider.
   * @returns The webhook URL.
   * @throws If webhooks are not configured for the provider.
   *
   * @example
   * ```ts
   * const url = rx.getWebhookUrl("steadfast");
   * //=> "https://your-server.com/api/webhooks/steadfast"
   *
   * // Register this URL with the courier's dashboard or API
   * ```
   */
  getWebhookUrl(provider: "steadfast" | "pathao" | "redx"): string {
    const url = this.config.webhooks?.[provider]?.webhookUrl;
    if (!url) {
      throw new Error(`Webhook URL is not configured for ${provider}`);
    }
    return url;
  }

  /**
   * Create an order for a specified provider.
   *
   * @param provider - "steadfast", "pathao", or "redx".
   * @param orderData - The order data matching the provider's format.
   * @returns The provider's order response.
   *
   * @example
   * ```ts
   * const rx = new RouteXpress({ steadfast: { apiKey: "...", apiSecret: "..." } });
   *
   * const result = await rx.createOrder("steadfast", {
   *   order_details: {
   *     invoice: "INV-001",
   *     recipient_name: "John Doe",
   *     recipient_phone: "01712345678",
   *     recipient_address: "123 Main St, Dhaka",
   *     cod_amount: 1500,
   *   },
   * });
   * //=> { invoice: "INV-001", consignment_id: 12345, tracking_code: "SF123", ... }
   * ```
   */
  async createOrder(
    provider: "steadfast" | "pathao" | "redx",
    orderData: Order_Data_For_Steadfast | CreatePathaoOrder | RedxCreateOrder,
  ) {
    try {
      if (!orderData || !provider) {
        throw new Error("Order data and provider are required");
      }
      const normalizedProvider = provider.toLowerCase();

      if (normalizedProvider === "steadfast") {
        const steadfastOrder = orderData as Order_Data_For_Steadfast;
        if (!steadfastOrder?.order_details) {
          throw new Error("Order details are required for Steadfast orders");
        }
        return await this.getSteadfast().createOrder(steadfastOrder);
      }

      if (normalizedProvider === "pathao") {
        const pathaoOrder = orderData as CreatePathaoOrder;
        if (!pathaoOrder.authToken) {
          throw new Error("Auth token is required for Pathao orders");
        }
        return await this.getPathao().createOrder(
          pathaoOrder.authToken,
          pathaoOrder,
        );
      }

      if (normalizedProvider === "redx") {
        const redxOrder = orderData as RedxCreateOrder;
        if (!redxOrder) {
          throw new Error("Order data is required for Redx orders");
        }
        return await this.getRedx().createOrder(redxOrder);
      }

      throw new Error(`Unsupported provider: ${provider}`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Order creation failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred while creating the order");
    }
  }

  /**
   * Create a bulk order for a specified provider.
   *
   * @param provider - "steadfast" or "pathao" (bulk not supported on RedX).
   * @param allOrder - The bulk order payload matching the provider's format.
   * @returns The provider's bulk order response.
   *
   * @example
   * ```ts
   * const result = await rx.createBulkOrder("steadfast", {
   *   orders: [
   *     {
   *       invoice: "INV-BULK-001",
   *       recipient_name: "Alice",
   *       recipient_phone: "01711112222",
   *       recipient_address: "456 Road, Chittagong",
   *       cod_amount: 2500,
   *     },
   *     {
   *       invoice: "INV-BULK-002",
   *       recipient_name: "Bob",
   *       recipient_phone: "01833334444",
   *       recipient_address: "789 Ave, Sylhet",
   *       cod_amount: 1800,
   *     },
   *   ],
   * });
   * //=> { success: true, data: [...] }
   * ```
   */
  async createBulkOrder(
    provider: "steadfast" | "pathao",
    allOrder: Bulk_Order_For_Steadfast | Bulk_Order_For_Pathao,
  ) {
    try {
      if (!allOrder || !provider) {
        throw new Error("Bulk order and provider are required");
      }
      const normalizedProvider = provider.toLowerCase();

      if (normalizedProvider === "steadfast") {
        const steadfastOrder = allOrder as Bulk_Order_For_Steadfast;
        if (!steadfastOrder?.orders) {
          throw new Error("Orders are required for Steadfast bulk orders");
        }
        return await this.getSteadfast().createBulkOrder(steadfastOrder);
      }

      if (normalizedProvider === "pathao") {
        const pathaoOrder = allOrder as Bulk_Order_For_Pathao;
        if (!pathaoOrder?.orders || !pathaoOrder.authToken) {
          throw new Error(
            "Orders and auth token are required for Pathao bulk orders",
          );
        }

        return await this.getPathao().createBulkOrder(pathaoOrder);
      }

      throw new Error(`Unsupported provider: ${provider}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Bulk order creation failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred during bulk order creation");
    }
  }

  /**
   * Get the status of an order by its consignment ID.
   *
   * @param orderData - Object containing provider name and consignment ID.
   * @returns The status response from the provider.
   *
   * @example
   * ```ts
   * // Steadfast
   * const status = await rx.getOrderStatus({
   *   provider: "steadfast",
   *   data: { consignment_id: "12345" },
   * });
   *
   * // Pathao (requires auth token)
   * const status = await rx.getOrderStatus({
   *   provider: "pathao",
   *   data: { consignment_id: "PATHAO-67890", authToken: "eyJhbG..." },
   * });
   * ```
   */
  async getOrderStatus(orderData: {
    provider: string;
    data: { consignment_id: string; authToken?: string };
  }) {
    try {
      if (!orderData || !orderData.provider) {
        throw new Error("Order data and provider are required");
      }
      if (!orderData.data || !orderData.data.consignment_id) {
        throw new Error("Tracking code is required");
      }
      switch (orderData.provider.toLowerCase()) {
        case "steadfast":
          const result = await this.getSteadfast().getStatusByCid(
            orderData.data.consignment_id,
          );
          return result;
        case "pathao":
          if (!orderData.data.authToken) {
            throw new Error("Auth token is required for Pathao orders");
          }
          const auth_token = orderData.data.authToken;
          const pathaoResult = await this.getPathao().getStatusByCid({
            cid: orderData.data.consignment_id,
            authToken: auth_token,
          });
          return pathaoResult;
        default:
          throw new Error(`Invalid provider specified: ${orderData.provider}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get the status of a Steadfast order by its invoice number.
   *
   * @param invoice - The invoice number.
   * @returns The status response.
   *
   * @example
   * ```ts
   * const result = await rx.statusByInvoice("INV-2024-001");
   * //=> { current_status: "delivered", status_code: 1, ... }
   * ```
   */
  async statusByInvoice(invoice: string) {
    try {
      if (!invoice) {
        throw new Error("Invoice is required to get order status");
      }

      return await this.getSteadfast().getStatusByInvoice(invoice);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get the status of a Steadfast order by its tracking code.
   *
   * @param trackingcode - The tracking code.
   * @returns The status response.
   *
   * @example
   * ```ts
   * const result = await rx.statusBytrackingcode("SF-TRACK-001");
   * //=> { current_status: "in_transit", status_code: 3, ... }
   * ```
   */
  async statusBytrackingcode(trackingcode: string) {
    try {
      if (!trackingcode) {
        throw new Error("Tracking code is required to get order status");
      }

      return await this.getSteadfast().statusBytrackingcode(trackingcode);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get the balance of the Steadfast account.
   *
   * @returns The balance information.
   *
   * @example
   * ```ts
   * const balance = await rx.getSteadFastBalance();
   * //=> { balance: 12500.50, currency: "BDT" }
   * ```
   */
  async getSteadFastBalance() {
    try {
      return await this.getSteadfast().getBalance();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Create a return request for a Steadfast consignment.
   *
   * @param params - Return request parameters.
   * @returns The created return request.
   *
   * @example
   * ```ts
   * const result = await rx.createSteadfastReturnRequest({
   *   consignment_id: 12345,
   *   reason: "Customer refused delivery",
   * });
   * //=> { success: true, return_id: 987 }
   * ```
   */
  async createSteadfastReturnRequest(params: Create_Return_Request_Params) {
    try {
      return await this.getSteadfast().createReturnRequest(params);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get a single return request by ID from Steadfast.
   *
   * @param id - The return request ID.
   * @returns The return request details.
   *
   * @example
   * ```ts
   * const request = await rx.getSteadfastReturnRequest(987);
   * //=> { id: 987, consignment_id: 12345, status: "pending", ... }
   * ```
   */
  async getSteadfastReturnRequest(id: number) {
    try {
      return await this.getSteadfast().getReturnRequest(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get all return requests from Steadfast.
   *
   * @returns The list of return requests.
   *
   * @example
   * ```ts
   * const requests = await rx.getSteadfastReturnRequests();
   * //=> { data: [{ id: 987, consignment_id: 12345, ... }, ...] }
   * ```
   */
  async getSteadfastReturnRequests() {
    try {
      return await this.getSteadfast().getReturnRequests();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get all payments from Steadfast.
   *
   * @returns The list of payments.
   *
   * @example
   * ```ts
   * const payments = await rx.getSteadfastPayments();
   * //=> { data: [{ payment_id: 1, amount: 12500, date: "2024-03-15" }, ...] }
   * ```
   */
  async getSteadfastPayments() {
    try {
      return await this.getSteadfast().getPayments();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get a single payment with consignments from Steadfast.
   *
   * @param paymentId - The payment ID.
   * @returns The payment details with consignments.
   *
   * @example
   * ```ts
   * const payment = await rx.getSteadfastSinglePayment(1);
   * //=> { payment_id: 1, amount: 12500, consignments: [...] }
   * ```
   */
  async getSteadfastSinglePayment(paymentId: number) {
    try {
      return await this.getSteadfast().getSinglePayment(paymentId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get all police stations from Steadfast.
   *
   * @returns The list of police stations (used for area lookups).
   *
   * @example
   * ```ts
   * const stations = await rx.getSteadfastPoliceStations();
   * //=> { data: [{ id: 1, name: "Dhanmondi PS", district: "Dhaka" }, ...] }
   * ```
   */
  async getSteadfastPoliceStations() {
    try {
      return await this.getSteadfast().getPoliceStations();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  //add pathao methods here
  /**
   * Create a new Pathao auth token using stored credentials.
   *
   * @returns The new token response.
   *
   * @example
   * ```ts
   * const rx = new RouteXpress({
   *   pathao: {
   *     baseUrl: "https://merchant-api-paths.pathao.com",
   *     clientId: "YOUR_CLIENT_ID",
   *     clientSecret: "YOUR_CLIENT_SECRET",
   *     username: "user@example.com",
   *     password: "your_password",
   *   },
   * });
   *
   * const { access_token } = await rx.createPathaoToken();
   * ```
   */
  async createPathaoToken() {
    try {
      return await this.getPathao().createNewToken();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Create a refresh token for Pathao.
   *
   * @param refreshToken - The current refresh token.
   * @returns The new token set.
   *
   * @example
   * ```ts
   * const tokens = await rx.createPathaoRefreshToken("old_refresh_token_here");
   * //=> { access_token: "...", refresh_token: "...", expires_in: 3600 }
   * ```
   */
  async createPathaoRefreshToken(refreshToken: string) {
    try {
      return await this.getPathao().createRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Create a new store in Pathao.
   *
   * @param authToken - The Pathao auth token.
   * @param storeData - The store details.
   * @returns The created store information.
   *
   * @example
   * ```ts
   * const store = await rx.createPathaoStore("eyJhbG...", {
   *   name: "My Shop",
   *   contact_name: "John Doe",
   *   contact_phone: "01712345678",
   *   address: "123 Road, Dhaka",
   *   instruction: "Ring doorbell on arrival",
   *   area_id: 1,
   *   default_pickup_phone: "01712345678",
   * });
   * //=> { store_id: 42, name: "My Shop", ... }
   * ```
   */
  async createPathaoStore(authToken: string, storeData: PathaoStore) {
    try {
      return await this.getPathao().createStore(authToken, storeData);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get the list of cities for Pathao.
   *
   * @param authToken - The Pathao auth token.
   * @returns The list of cities.
   *
   * @example
   * ```ts
   * const cities = await rx.getPathaoCity("eyJhbG...");
   * //=> { data: [{ city_id: 1, city_name: "Dhaka" }, { city_id: 2, city_name: "Chittagong" }, ...] }
   * ```
   */
  async getPathaoCity(authToken: string) {
    try {
      return await this.getPathao().getCitys(authToken);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get the list of zones in a city for Pathao.
   *
   * @param authToken - The Pathao auth token.
   * @param cityId - The city ID.
   * @returns The list of zones.
   *
   * @example
   * ```ts
   * const zones = await rx.getPathaoZone("eyJhbG...", 1);
   * //=> { data: [{ zone_id: 10, zone_name: "Dhanmondi" }, ...] }
   * ```
   */
  async getPathaoZone(authToken: string, cityId: number) {
    try {
      return await this.getPathao().getZone(authToken, cityId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get the list of areas in a zone for Pathao.
   *
   * @param authToken - The Pathao auth token.
   * @param zoneId - The zone ID.
   * @returns The list of areas.
   *
   * @example
   * ```ts
   * const areas = await rx.getPathaoArea("eyJhbG...", 10);
   * //=> { data: [{ area_id: 100, area_name: "Dhanmondi 15" }, ...] }
   * ```
   */
  async getPathaoArea(authToken: string, zoneId: number) {
    try {
      return await this.getPathao().get_area_list(authToken, zoneId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get the price plan for a Pathao order.
   *
   * @param authToken - The Pathao auth token.
   * @param orderData - Order details for pricing (delivery_type, area_id, weight, etc.).
   * @returns The price plan information.
   *
   * @example
   * ```ts
   * const price = await rx.price_plane("eyJhbG...", {
   *   delivery_type: 48,
   *   area_id: 10,
   *   merchant_id: 5,
   *   weight: 500,
   *   amount_to_collect: 1500,
   * });
   * //=> { delivery_fee: 80, cod_fee: 20, total_fee: 100 }
   * ```
   */
  async price_plane(authToken: string, orderData: any) {
    try {
      return await this.getPathao().price_plane(authToken, orderData);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get all stores for a Pathao account.
   *
   * @param authToken - The Pathao auth token.
   * @returns The list of stores.
   *
   * @example
   * ```ts
   * const stores = await rx.getAllPathaoStore("eyJhbG...");
   * //=> { data: [{ store_id: 42, name: "My Shop", ... }, ...] }
   * ```
   */
  async getAllPathaoStore(authToken: string) {
    try {
      return await this.getPathao().getAllStore(authToken);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Create a new store in RedX.
   *
   * @param storeData - Store details.
   * @returns The created store information.
   *
   * @example
   * ```ts
   * const store = await rx.createRedXStore({
   *   name: "My RedX Shop",
   *   phone: "01712345678",
   *   address: "123 Road, Dhaka",
   *   area_id: "1234",
   * });
   * //=> { store_id: "redx_store_001", name: "My RedX Shop", ... }
   * ```
   */
  async createRedXStore(storeData: {
    name: string;
    phone: string;
    address: string;
    area_id: string;
  }) {
    try {
      return await this.getRedx().createStore(storeData);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Track a parcel by its tracking code in RedX.
   *
   * @param trackingcode - The RedX tracking code.
   * @returns The tracking information.
   *
   * @example
   * ```ts
   * const tracking = await rx.trackParcelByTrackingCode("RT-TRACK-001");
   * //=> { current_status: "in_transit", status_history: [...], ... }
   * ```
   */
  async trackParcelByTrackingCode(trackingcode: string) {
    try {
      if (!trackingcode) {
        throw new Error("Tracking code is required to get parcel info");
      }

      return await this.getRedx().trackParcelByTrackingCode(trackingcode);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get parcel information by its tracking code in RedX.
   *
   * @param trackingcode - The RedX tracking code.
   * @returns The parcel information.
   *
   * @example
   * ```ts
   * const info = await rx.getParcelInfoByTrackingCode("RT-TRACK-001");
   * //=> { tracking_code: "RT-TRACK-001", status: "pending", ... }
   * ```
   */
  async getParcelInfoByTrackingCode(trackingcode: string) {
    try {
      if (!trackingcode) {
        throw new Error("Tracking code is required to get parcel info");
      }

      return await this.getRedx().getParcelInfoByTrackingCode(trackingcode);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Update parcel information in RedX.
   *
   * @param trackingcode - The RedX tracking code.
   * @param data - Fields to update (e.g. `{ delivery_date: "2024-04-01" }`).
   * @returns The update response.
   *
   * @example
   * ```ts
   * const result = await rx.updateParcel("RT-TRACK-001", {
   *   delivery_date: "2024-04-01",
   *   note: "Customer requested delay",
   * });
   * //=> { success: true }
   * ```
   */
  async updateParcel(trackingcode: string, data: object) {
    try {
      return await this.getRedx().updateParcel(trackingcode, data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get the list of areas for RedX.
   *
   * @returns The list of areas.
   *
   * @example
   * ```ts
   * const areas = await rx.getRedXAreaList();
   * //=> { data: [{ area_id: "1234", area_name: "Dhanmondi" }, ...] }
   * ```
   */
  async getRedXAreaList() {
    try {
      return await this.getRedx().getAreaList();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get area information by postcode in RedX.
   *
   * @param postcode - The postcode to lookup.
   * @returns The area information.
   *
   * @example
   * ```ts
   * const area = await rx.getResXAreabyPostcode("1207");
   * //=> { area_id: "1234", area_name: "Dhanmondi", ... }
   * ```
   */
  async getResXAreabyPostcode(postcode: string) {
    try {
      return await this.getRedx().getAreaByPostcode(postcode);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get area information by district name in RedX.
   *
   * @param district_name - The district name to lookup.
   * @returns The area information.
   *
   * @example
   * ```ts
   * const areas = await rx.getRedXAreaBYDistrict_name("Dhaka");
   * //=> { data: [{ area_id: "1234", area_name: "Dhanmondi" }, ...] }
   * ```
   */
  async getRedXAreaBYDistrict_name(district_name: string) {
    try {
      return await this.getRedx().getAreaByDistrictName(district_name);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get the list of stores for RedX.
   *
   * @returns The list of stores.
   *
   * @example
   * ```ts
   * const stores = await rx.getRedXStores();
   * //=> { data: [{ store_id: "redx_store_001", name: "My Shop", ... }, ...] }
   * ```
   */
  async getRedXStores() {
    try {
      return await this.getRedx().getStores();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Get pickup store information by store ID in RedX.
   *
   * @param storeId - The RedX store ID.
   * @returns The pickup store information.
   *
   * @example
   * ```ts
   * const store = await rx.getPickupStoreInfo("redx_store_001");
   * //=> { store_id: "redx_store_001", name: "My Shop", address: "...", ... }
   * ```
   */
  async getPickupStoreInfo(storeId: string) {
    try {
      return await this.getRedx().getPickupStoreInfo(storeId);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  /**
   * Calculate the delivery price for a RedX order.
   *
   * @param orderData - Order details for price calculation.
   * @returns The calculated price breakdown.
   *
   * @example
   * ```ts
   * const price = await rx.calculateRedXPrice({
   *   delivery_area_id: 1234,
   *   pickup_area_id: 1234,
   *   cash_collection_amount: 1500,
   *   weight: 500,
   * });
   * //=> { delivery_fee: 80, cod_fee: 20, total_fee: 100 }
   * ```
   */
  async calculateRedXPrice(orderData: {
    delivery_area_id: number;
    pickup_area_id: number;
    cash_collection_amount: number;
    weight: number;
  }) {
    try {
      if (
        !orderData.delivery_area_id ||
        !orderData.pickup_area_id ||
        !orderData.cash_collection_amount ||
        !orderData.weight
      ) {
        throw new Error(
          "All fields (delivery_area_id, pickup_area_id, cash_collection_amount, weight) are required",
        );
      }

      return await this.getRedx().calculatePrice(orderData);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred while calculating the price");
    }
  }
}

export default RouteXpress;
export { RouteXpress };
