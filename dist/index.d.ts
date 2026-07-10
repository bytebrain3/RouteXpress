import { Order_Data_For_Steadfast, Bulk_Order_For_Steadfast } from "./types/steadfast.js";
import { PathaoStore, CreatePathaoOrder, Bulk_Order_For_Pathao } from "./types/pathao.js";
import { RedxCreateOrder } from "./types/redx.js";
import { Config } from "./types/config.js";
import { Steadfast } from "./controllers/steadfast/index.js";
import { Pathao } from "./controllers/pathao/index.js";
import { Redx } from "./controllers/redx/index.js";
declare class RouteXpress {
    private config;
    private pathao?;
    private steadfast?;
    private redx?;
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
     * Create an order for a specified provider.
     * @param {"steadfast" | "pathao" | "redx"} provider - The delivery service provider.
     * @param {Order_Data_For_Steadfast | CreatePathaoOrder | RedxCreateOrder} orderData - The order data.
     * @returns {Promise<any>} The response from the provider.
     * @throws {Error} If the provider or order data is invalid.
     */
    createOrder(provider: "steadfast" | "pathao" | "redx", orderData: Order_Data_For_Steadfast | CreatePathaoOrder | RedxCreateOrder): Promise<any>;
    /**
     * Create a bulk order for a specified provider.
     * @param {"steadfast" | "pathao"} provider - The delivery service provider.
     * @param {Bulk_Order_For_Steadfast | Bulk_Order_For_Pathao} allOrder - The bulk order data.
     * @returns {Promise<any>} The response from the provider.
     * @throws {Error} If the provider or bulk order data is invalid.
     */
    createBulkOrder(provider: "steadfast" | "pathao", allOrder: Bulk_Order_For_Steadfast | Bulk_Order_For_Pathao): Promise<import("./types/steadfast.js").Bulk_Order_Response_For_Steadfast | import("./types/steadfast.js").ErrorResponse | import("./types/pathao.js").Bulk_Order_For_Pathao_Response[]>;
    /**
     * Get the status of an order by its consignment ID.
     * @param {Object} orderData - The order data containing provider and consignment ID.
     * @param {string} orderData.provider - The delivery service provider.
     * @param {Object} orderData.data - The data containing consignment ID and optional auth token.
     * @param {string} orderData.data.consignment_id - The consignment ID of the order.
     * @param {string} [orderData.data.authToken] - The optional auth token for Pathao orders.
     * @returns {Promise<any>} The status of the order.
     * @throws {Error} If the order data is invalid.
     */
    getOrderStatus(orderData: {
        provider: string;
        data: {
            consignment_id: string;
            authToken?: string;
        };
    }): Promise<any>;
    /**
     * Get the status of an order by its invoice number.
     * @param {string} invoice - The invoice number of the order.
     * @returns {Promise<any>} The status of the order.
     * @throws {Error} If the invoice number is invalid.
     */
    statusByInvoice(invoice: string): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Delivery_Status_Response>;
    /**
     * Get the status of an order by its tracking code.
     * @param {string} trackingcode - The tracking code of the order.
     * @returns {Promise<any>} The status of the order.
     * @throws {Error} If the tracking code is invalid.
     */
    statusBytrackingcode(trackingcode: string): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Delivery_Status_Response>;
    /**
     * Get the balance of the Steadfast account.
     * @returns {Promise<any>} The balance information.
     * @throws {Error} If there is an error retrieving the balance.
     */
    getSteadFastBalance(): Promise<import("./types/steadfast.js").ErrorResponse | import("./types/steadfast.js").Balance_Response>;
    /**
     * Create a new token for Pathao.
     * @returns {Promise<any>} The response containing the new token.
     * @throws {Error} If there is an error creating the token.
     */
    createPathaoToken(): Promise<import("./types/pathao.js").TokenIssueResponse | import("./types/pathao.js").ErrorResponse>;
    /**
     * Create a refresh token for Pathao.
     * @param {string} refreshToken - The refresh token.
     * @returns {Promise<any>} The response containing the new refresh token.
     * @throws {Error} If there is an error creating the refresh token.
     */
    createPathaoRefreshToken(refreshToken: string): Promise<import("./types/pathao.js").TokenIssueResponse | import("./types/pathao.js").ErrorResponse>;
    /**
     * Create a new store in Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @param {PathaoStore} storeData - The data for the new store.
     * @returns {Promise<any>} The response containing the created store information.
     * @throws {Error} If there is an error creating the store.
     */
    createPathaoStore(authToken: string, storeData: PathaoStore): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoStoreResponse>;
    /**
     * Get the list of cities for Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @returns {Promise<any>} The list of cities.
     * @throws {Error} If there is an error retrieving the cities.
     */
    getPathaoCity(authToken: string): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoCityResponse>;
    /**
     * Get the list of zones in a city for Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @param {number} cityId - The ID of the city.
     * @returns {Promise<any>} The list of zones in the city.
     * @throws {Error} If there is an error retrieving the zones.
     */
    getPathaoZone(authToken: string, cityId: number): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoZoneResponse>;
    /**
     * Get the list of areas in a zone for Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @param {number} zoneId - The ID of the zone.
     * @returns {Promise<any>} The list of areas in the zone.
     * @throws {Error} If there is an error retrieving the areas.
     */
    getPathaoArea(authToken: string, zoneId: number): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoAreaResponse>;
    /**
     * Get the price plan for an order in Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @param {any} orderData - The order data.
     * @returns {Promise<any>} The price plan information.
     * @throws {Error} If there is an error retrieving the price plan.
     */
    price_plane(authToken: string, orderData: any): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoPriceResponse>;
    /**
     * Get all stores for a Pathao account.
     * @param {string} authToken - The auth token for Pathao.
     * @returns {Promise<any>} The list of all stores.
     * @throws {Error} If there is an error retrieving the stores.
     */
    getAllPathaoStore(authToken: string): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoAllStoreResponse>;
    /**
     * Create a new store in Redx.
     * @param {Object} storeData - The data for the new store.
     * @param {string} storeData.name - The name of the store.
     * @param {string} storeData.phone - The phone number of the store.
     * @param {string} storeData.address - The address of the store.
     * @param {string} storeData.area_id - The area ID where the store is located.
     * @returns {Promise<any>} The response containing the created store information.
     * @throws {Error} If there is an error creating the store.
     */
    createRedXStore(storeData: {
        name: string;
        phone: string;
        address: string;
        area_id: string;
    }): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxStoreResponse>;
    /**
     * Track a parcel by its tracking code in Redx.
     * @param {string} trackingcode - The tracking code of the parcel.
     * @returns {Promise<any>} The tracking information of the parcel.
     * @throws {Error} If the tracking code is invalid.
     */
    trackParcelByTrackingCode(trackingcode: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxTrackByidResponse>;
    /**
     * Get parcel information by its tracking code in Redx.
     * @param {string} trackingcode - The tracking code of the parcel.
     * @returns {Promise<any>} The parcel information.
     * @throws {Error} If the tracking code is invalid.
     */
    getParcelInfoByTrackingCode(trackingcode: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxTrackByid>;
    /**
     * Update parcel information in Redx.
     * @param {string} trackingcode - The tracking code of the parcel.
     * @param {Object} data - The data to update.
     * @returns {Promise<any>} The response from Redx.
     * @throws {Error} If there is an error updating the parcel.
     */
    updateParcel(trackingcode: string, data: object): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxUpdateOrder>;
    /**
     * Get the list of areas for Redx.
     * @returns {Promise<any>} The list of areas.
     * @throws {Error} If there is an error retrieving the areas.
     */
    getRedXAreaList(): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxAreaResponse[]>;
    /**
     * Get area information by postcode in Redx.
     * @param {string} postcode - The postcode to lookup.
     * @returns {Promise<any>} The area information.
     * @throws {Error} If there is an error retrieving the area.
     */
    getResXAreabyPostcode(postcode: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxAreaResponse>;
    /**
     * Get area information by district name in Redx.
     * @param {string} district_name - The district name to lookup.
     * @returns {Promise<any>} The area information.
     * @throws {Error} If there is an error retrieving the area.
     */
    getRedXAreaBYDistrict_name(district_name: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxAreaResponse>;
    /**
     * Get the list of stores for Redx.
     * @returns {Promise<any>} The list of stores.
     * @throws {Error} If there is an error retrieving the stores.
     */
    getRedXStores(): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxStoreResponse[]>;
    /**
     * Get pickup store information by store ID in Redx.
     * @param {string} storeId - The ID of the store.
     * @returns {Promise<any>} The pickup store information.
     * @throws {Error} If there is an error retrieving the store information.
     */
    getPickupStoreInfo(storeId: string): Promise<import("./types/redx.js").ErrorResponse | import("./types/redx.js").RedxStoreResponse>;
    /**
     * Calculate the price for a Redx order.
     * @param {Object} orderData - The order data for price calculation.
     * @param {number} orderData.delivery_area_id - The delivery area ID.
     * @param {number} orderData.pickup_area_id - The pickup area ID.
     * @param {number} orderData.cash_collection_amount - The cash collection amount.
     * @param {number} orderData.weight - The weight of the package.
     * @returns {Promise<any>} The calculated price.
     * @throws {Error} If any of the required fields are missing or if there is an error calculating the price.
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
