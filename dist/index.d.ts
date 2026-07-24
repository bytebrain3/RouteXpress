import { Order_Data_For_Steadfast, Bulk_Order_For_Steadfast, Create_Return_Request_Params } from "./types/steadfast.js";
import { PathaoStore, CreatePathaoOrder, Bulk_Order_For_Pathao } from "./types/pathao.js";
import { RedxCreateOrder } from "./types/redx.js";
import { Config } from "./types/config.js";
import { Steadfast } from "./controllers/steadfast/index.js";
import { Pathao } from "./controllers/pathao/index.js";
import { Redx } from "./controllers/redx/index.js";
import { SteadfastWebhookHandler, PathaoWebhookHandler, RedXWebhookHandler } from "./controllers/webhooks/index.js";
export { SteadfastWebhookHandler, PathaoWebhookHandler, RedXWebhookHandler, } from "./controllers/webhooks/index.js";
export type { SteadfastWebhookPayload, SteadfastDeliveryStatusWebhook, SteadfastTrackingUpdateWebhook, PathaoWebhookPayload, PathaoWebhookEvent, PathaoWebhookBase, RedXWebhookPayload, RedXWebhookStatus, RedXDeliveryType, WebhookVerifyResult, WebhookParseResult, } from "./types/webhook.js";
export type { Config, Steadfast_Config, Pathao_Config, Redx_Config, SteadfastWebhookConfig, PathaoWebhookConfig, RedXWebhookConfig, } from "./types/config.js";
declare class RouteXpress {
    private config;
    private pathao?;
    private steadfast?;
    private redx?;
    private steadfastWebhook?;
    private pathaoWebhook?;
    private redxWebhook?;
    constructor(config: Config);
    /**
     * Safely access the Steadfast service.
     * @returns {Steadfast} The Steadfast service instance.
     * @throws {Error} If the Steadfast service is not configured.
     */
    protected getSteadfast(): Steadfast;
    /**
     * Safely access the Pathao service.
     * @returns {Pathao} The Pathao service instance.
     * @throws {Error} If the Pathao service is not configured.
     */
    protected getPathao(): Pathao;
    /**
     * Safely access the Redx service.
     * @returns {Redx} The Redx service instance.
     * @throws {Error} If the Redx service is not configured.
     */
    protected getRedx(): Redx;
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
    getSteadfastWebhook(): SteadfastWebhookHandler;
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
    getPathaoWebhook(): PathaoWebhookHandler;
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
    getRedXWebhook(): RedXWebhookHandler;
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
    getWebhookUrl(provider: "steadfast" | "pathao" | "redx"): string;
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
    createOrder(provider: "steadfast" | "pathao" | "redx", orderData: Order_Data_For_Steadfast | CreatePathaoOrder | RedxCreateOrder): Promise<any>;
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
    createBulkOrder(provider: "steadfast" | "pathao", allOrder: Bulk_Order_For_Steadfast | Bulk_Order_For_Pathao): Promise<import("./types/steadfast.js").Bulk_Order_Response_For_Steadfast | import("./types/steadfast.js").ErrorResponse | import("./types/pathao.js").Bulk_Order_For_Pathao_Response[]>;
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
    getOrderStatus(orderData: {
        provider: string;
        data: {
            consignment_id: string;
            authToken?: string;
        };
    }): Promise<any>;
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
    statusByInvoice(invoice: string): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Delivery_Status_Response>;
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
    statusBytrackingcode(trackingcode: string): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Delivery_Status_Response>;
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
    getSteadFastBalance(): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Balance_Response>;
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
    createSteadfastReturnRequest(params: Create_Return_Request_Params): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Return_Request>;
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
    getSteadfastReturnRequest(id: number): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Return_Request>;
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
    getSteadfastReturnRequests(): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Return_Request[]>;
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
    getSteadfastPayments(): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Payment[]>;
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
    getSteadfastSinglePayment(paymentId: number): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Payment>;
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
    getSteadfastPoliceStations(): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Police_Station[]>;
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
    createPathaoToken(): Promise<import("./types/pathao.js").TokenIssueResponse | import("./types/pathao.js").ErrorResponse>;
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
    createPathaoRefreshToken(refreshToken: string): Promise<import("./types/pathao.js").TokenIssueResponse | import("./types/pathao.js").ErrorResponse>;
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
    createPathaoStore(authToken: string, storeData: PathaoStore): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoStoreResponse>;
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
    getPathaoCity(authToken: string): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoCityResponse>;
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
    getPathaoZone(authToken: string, cityId: number): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoZoneResponse>;
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
    getPathaoArea(authToken: string, zoneId: number): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoAreaResponse>;
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
    price_plane(authToken: string, orderData: any): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoPriceResponse>;
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
    getAllPathaoStore(authToken: string): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoAllStoreResponse>;
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
    createRedXStore(storeData: {
        name: string;
        phone: string;
        address: string;
        area_id: string;
    }): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxStoreResponse>;
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
    trackParcelByTrackingCode(trackingcode: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxTrackByidResponse>;
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
    getParcelInfoByTrackingCode(trackingcode: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxTrackByid>;
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
    updateParcel(trackingcode: string, data: object): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxUpdateOrder>;
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
    getRedXAreaList(): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxAreaResponse[]>;
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
    getResXAreabyPostcode(postcode: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxAreaResponse>;
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
    getRedXAreaBYDistrict_name(district_name: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxAreaResponse>;
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
    getRedXStores(): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxStoreResponse[]>;
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
    getPickupStoreInfo(storeId: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxStoreResponse>;
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
    calculateRedXPrice(orderData: {
        delivery_area_id: number;
        pickup_area_id: number;
        cash_collection_amount: number;
        weight: number;
    }): Promise<any>;
}
export default RouteXpress;
export { RouteXpress };
