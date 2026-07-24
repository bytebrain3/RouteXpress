import { TokenIssueResponse, ErrorResponse, PathaoStore, PathaoStoreResponse, CreatePathaoOrder, Bulk_Order_For_Pathao_Response, Bulk_Order_For_Pathao, PathaoCityResponse, PathaoZoneResponse, PathaoPriceResponse, PathaoAreaResponse, PathaoOrderPiceData, PathaoAllStoreResponse } from "../../types/pathao.js";
import { Pathao_Config } from "../../types/config.js";
declare class Pathao {
    private config;
    private baseUrl;
    constructor(config: Pathao_Config);
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
    createNewToken(): Promise<TokenIssueResponse | ErrorResponse>;
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
    createRefreshToken(refreshToken: string): Promise<TokenIssueResponse | ErrorResponse>;
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
    createStore(authToken: string, store: PathaoStore): Promise<PathaoStoreResponse | ErrorResponse>;
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
    createOrder(authToken: string, order: CreatePathaoOrder): Promise<any>;
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
    createBulkOrder(pathaoOrder: Bulk_Order_For_Pathao): Promise<Bulk_Order_For_Pathao_Response[] | ErrorResponse>;
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
    getStatusByCid(cidDetails: {
        cid: string;
        authToken: string;
    }): Promise<any>;
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
    getCitys(authToken: string): Promise<PathaoCityResponse | ErrorResponse>;
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
    getZone(authToken: string, cityId: number): Promise<PathaoZoneResponse | ErrorResponse>;
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
    get_area_list(authToken: string, zoneId: number): Promise<PathaoAreaResponse | ErrorResponse>;
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
    price_plane(authToken: string, orderData: PathaoOrderPiceData): Promise<PathaoPriceResponse | ErrorResponse>;
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
    getAllStore(authToken: string): Promise<PathaoAllStoreResponse | ErrorResponse>;
}
export { Pathao };
