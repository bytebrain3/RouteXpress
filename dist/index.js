import { Steadfast } from "./controllers/steadfast/index.js"; // updated
import { Pathao } from "./controllers/pathao/index.js"; // updated
import { Redx } from "./controllers/redx/index.js"; // updated
class RouteXpress {
    constructor(config) {
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
        // Ensure at least one service is configured
        if (!this.steadfast && !this.pathao && !this.redx) {
            throw new Error("At least one delivery service provider must be configured");
        }
    }
    /**
     * Safely access the Steadfast service.
     * @returns {Steadfast} The Steadfast service instance.
     * @throws {Error} If the Steadfast service is not configured.
     */
    getSteadfast() {
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
    getPathao() {
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
    getRedx() {
        if (!this.redx) {
            throw new Error("Redx service is not configured");
        }
        return this.redx;
    }
    /**
     * Create an order for a specified provider.
     * @param {"steadfast" | "pathao" | "redx"} provider - The delivery service provider.
     * @param {Order_Data_For_Steadfast | CreatePathaoOrder | RedxCreateOrder} orderData - The order data.
     * @returns {Promise<any>} The response from the provider.
     * @throws {Error} If the provider or order data is invalid.
     */
    async createOrder(provider, orderData) {
        try {
            if (!orderData || !provider) {
                throw new Error("Order data and provider are required");
            }
            const normalizedProvider = provider.toLowerCase();
            if (normalizedProvider === "steadfast") {
                const steadfastOrder = orderData;
                if (!steadfastOrder?.order_details) {
                    throw new Error("Order details are required for Steadfast orders");
                }
                return await this.getSteadfast().createOrder(steadfastOrder);
            }
            if (normalizedProvider === "pathao") {
                const pathaoOrder = orderData;
                if (!pathaoOrder.authToken) {
                    throw new Error("Auth token is required for Pathao orders");
                }
                return await this.getPathao().createOrder(pathaoOrder.authToken, pathaoOrder);
            }
            if (normalizedProvider === "redx") {
                const redxOrder = orderData;
                if (!redxOrder) {
                    throw new Error("Order data is required for Redx orders");
                }
                return await this.getRedx().createOrder(redxOrder);
            }
            throw new Error(`Unsupported provider: ${provider}`);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Order creation failed: ${error.message}`);
            }
            throw new Error("An unknown error occurred while creating the order");
        }
    }
    /**
     * Create a bulk order for a specified provider.
     * @param {"steadfast" | "pathao"} provider - The delivery service provider.
     * @param {Bulk_Order_For_Steadfast | Bulk_Order_For_Pathao} allOrder - The bulk order data.
     * @returns {Promise<any>} The response from the provider.
     * @throws {Error} If the provider or bulk order data is invalid.
     */
    async createBulkOrder(provider, allOrder) {
        try {
            if (!allOrder || !provider) {
                throw new Error("Bulk order and provider are required");
            }
            const normalizedProvider = provider.toLowerCase();
            if (normalizedProvider === "steadfast") {
                const steadfastOrder = allOrder;
                if (!steadfastOrder?.orders) {
                    throw new Error("Orders are required for Steadfast bulk orders");
                }
                return await this.getSteadfast().createBulkOrder(steadfastOrder);
            }
            if (normalizedProvider === "pathao") {
                const pathaoOrder = allOrder;
                if (!pathaoOrder?.orders || !pathaoOrder.authToken) {
                    throw new Error("Orders and auth token are required for Pathao bulk orders");
                }
                return await this.getPathao().createBulkOrder(pathaoOrder);
            }
            throw new Error(`Unsupported provider: ${provider}`);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Bulk order creation failed: ${error.message}`);
            }
            throw new Error("An unknown error occurred during bulk order creation");
        }
    }
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
    async getOrderStatus(orderData) {
        try {
            if (!orderData || !orderData.provider) {
                throw new Error("Order data and provider are required");
            }
            if (!orderData.data || !orderData.data.consignment_id) {
                throw new Error("Tracking code is required");
            }
            switch (orderData.provider.toLowerCase()) {
                case "steadfast":
                    const result = await this.getSteadfast().getStatusByCid(orderData.data.consignment_id);
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
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get the status of an order by its invoice number.
     * @param {string} invoice - The invoice number of the order.
     * @returns {Promise<any>} The status of the order.
     * @throws {Error} If the invoice number is invalid.
     */
    async statusByInvoice(invoice) {
        try {
            if (!invoice) {
                throw new Error("Invoice is required to get order status");
            }
            return await this.getSteadfast().getStatusByInvoice(invoice);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get the status of an order by its tracking code.
     * @param {string} trackingcode - The tracking code of the order.
     * @returns {Promise<any>} The status of the order.
     * @throws {Error} If the tracking code is invalid.
     */
    async statusBytrackingcode(trackingcode) {
        try {
            if (!trackingcode) {
                throw new Error("Tracking code is required to get order status");
            }
            return await this.getSteadfast().statusBytrackingcode(trackingcode);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get the balance of the Steadfast account.
     * @returns {Promise<any>} The balance information.
     * @throws {Error} If there is an error retrieving the balance.
     */
    async getSteadFastBalance() {
        try {
            return await this.getSteadfast().getBalance();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Create a return request for a Steadfast consignment.
     * @param {Create_Return_Request_Params} params - The return request parameters.
     * @returns {Promise<any>} The created return request.
     * @throws {Error} If there is an error creating the return request.
     */
    async createSteadfastReturnRequest(params) {
        try {
            return await this.getSteadfast().createReturnRequest(params);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get a single return request by ID from Steadfast.
     * @param {number} id - The return request ID.
     * @returns {Promise<any>} The return request details.
     * @throws {Error} If there is an error retrieving the return request.
     */
    async getSteadfastReturnRequest(id) {
        try {
            return await this.getSteadfast().getReturnRequest(id);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get all return requests from Steadfast.
     * @returns {Promise<any>} The list of return requests.
     * @throws {Error} If there is an error retrieving the return requests.
     */
    async getSteadfastReturnRequests() {
        try {
            return await this.getSteadfast().getReturnRequests();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get all payments from Steadfast.
     * @returns {Promise<any>} The list of payments.
     * @throws {Error} If there is an error retrieving the payments.
     */
    async getSteadfastPayments() {
        try {
            return await this.getSteadfast().getPayments();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get a single payment with consignments from Steadfast.
     * @param {number} paymentId - The payment ID.
     * @returns {Promise<any>} The payment details with consignments.
     * @throws {Error} If there is an error retrieving the payment.
     */
    async getSteadfastSinglePayment(paymentId) {
        try {
            return await this.getSteadfast().getSinglePayment(paymentId);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get all police stations from Steadfast.
     * @returns {Promise<any>} The list of police stations.
     * @throws {Error} If there is an error retrieving the police stations.
     */
    async getSteadfastPoliceStations() {
        try {
            return await this.getSteadfast().getPoliceStations();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    //add pathao methods here
    /**
     * Create a new token for Pathao.
     * @returns {Promise<any>} The response containing the new token.
     * @throws {Error} If there is an error creating the token.
     */
    async createPathaoToken() {
        try {
            return await this.getPathao().createNewToken();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Create a refresh token for Pathao.
     * @param {string} refreshToken - The refresh token.
     * @returns {Promise<any>} The response containing the new refresh token.
     * @throws {Error} If there is an error creating the refresh token.
     */
    async createPathaoRefreshToken(refreshToken) {
        try {
            return await this.getPathao().createRefreshToken(refreshToken);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Create a new store in Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @param {PathaoStore} storeData - The data for the new store.
     * @returns {Promise<any>} The response containing the created store information.
     * @throws {Error} If there is an error creating the store.
     */
    async createPathaoStore(authToken, storeData) {
        try {
            return await this.getPathao().createStore(authToken, storeData);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get the list of cities for Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @returns {Promise<any>} The list of cities.
     * @throws {Error} If there is an error retrieving the cities.
     */
    async getPathaoCity(authToken) {
        try {
            return await this.getPathao().getCitys(authToken);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get the list of zones in a city for Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @param {number} cityId - The ID of the city.
     * @returns {Promise<any>} The list of zones in the city.
     * @throws {Error} If there is an error retrieving the zones.
     */
    async getPathaoZone(authToken, cityId) {
        try {
            return await this.getPathao().getZone(authToken, cityId);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get the list of areas in a zone for Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @param {number} zoneId - The ID of the zone.
     * @returns {Promise<any>} The list of areas in the zone.
     * @throws {Error} If there is an error retrieving the areas.
     */
    async getPathaoArea(authToken, zoneId) {
        try {
            return await this.getPathao().get_area_list(authToken, zoneId);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get the price plan for an order in Pathao.
     * @param {string} authToken - The auth token for Pathao.
     * @param {any} orderData - The order data.
     * @returns {Promise<any>} The price plan information.
     * @throws {Error} If there is an error retrieving the price plan.
     */
    async price_plane(authToken, orderData) {
        try {
            return await this.getPathao().price_plane(authToken, orderData);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get all stores for a Pathao account.
     * @param {string} authToken - The auth token for Pathao.
     * @returns {Promise<any>} The list of all stores.
     * @throws {Error} If there is an error retrieving the stores.
     */
    async getAllPathaoStore(authToken) {
        try {
            return await this.getPathao().getAllStore(authToken);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
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
    async createRedXStore(storeData) {
        try {
            return await this.getRedx().createStore(storeData);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Track a parcel by its tracking code in Redx.
     * @param {string} trackingcode - The tracking code of the parcel.
     * @returns {Promise<any>} The tracking information of the parcel.
     * @throws {Error} If the tracking code is invalid.
     */
    async trackParcelByTrackingCode(trackingcode) {
        try {
            if (!trackingcode) {
                throw new Error("Tracking code is required to get parcel info");
            }
            return await this.getRedx().trackParcelByTrackingCode(trackingcode);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get parcel information by its tracking code in Redx.
     * @param {string} trackingcode - The tracking code of the parcel.
     * @returns {Promise<any>} The parcel information.
     * @throws {Error} If the tracking code is invalid.
     */
    async getParcelInfoByTrackingCode(trackingcode) {
        try {
            if (!trackingcode) {
                throw new Error("Tracking code is required to get parcel info");
            }
            return await this.getRedx().getParcelInfoByTrackingCode(trackingcode);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Update parcel information in Redx.
     * @param {string} trackingcode - The tracking code of the parcel.
     * @param {Object} data - The data to update.
     * @returns {Promise<any>} The response from Redx.
     * @throws {Error} If there is an error updating the parcel.
     */
    async updateParcel(trackingcode, data) {
        try {
            return await this.getRedx().updateParcel(trackingcode, data);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get the list of areas for Redx.
     * @returns {Promise<any>} The list of areas.
     * @throws {Error} If there is an error retrieving the areas.
     */
    async getRedXAreaList() {
        try {
            return await this.getRedx().getAreaList();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get area information by postcode in Redx.
     * @param {string} postcode - The postcode to lookup.
     * @returns {Promise<any>} The area information.
     * @throws {Error} If there is an error retrieving the area.
     */
    async getResXAreabyPostcode(postcode) {
        try {
            return await this.getRedx().getAreaByPostcode(postcode);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get area information by district name in Redx.
     * @param {string} district_name - The district name to lookup.
     * @returns {Promise<any>} The area information.
     * @throws {Error} If there is an error retrieving the area.
     */
    async getRedXAreaBYDistrict_name(district_name) {
        try {
            return await this.getRedx().getAreaByDistrictName(district_name);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get the list of stores for Redx.
     * @returns {Promise<any>} The list of stores.
     * @throws {Error} If there is an error retrieving the stores.
     */
    async getRedXStores() {
        try {
            return await this.getRedx().getStores();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
    /**
     * Get pickup store information by store ID in Redx.
     * @param {string} storeId - The ID of the store.
     * @returns {Promise<any>} The pickup store information.
     * @throws {Error} If there is an error retrieving the store information.
     */
    async getPickupStoreInfo(storeId) {
        try {
            return await this.getRedx().getPickupStoreInfo(storeId);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
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
    async calculateRedXPrice(orderData) {
        try {
            if (!orderData.delivery_area_id ||
                !orderData.pickup_area_id ||
                !orderData.cash_collection_amount ||
                !orderData.weight) {
                throw new Error("All fields (delivery_area_id, pickup_area_id, cash_collection_amount, weight) are required");
            }
            return await this.getRedx().calculatePrice(orderData);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred while calculating the price");
        }
    }
}
export default RouteXpress;
export { RouteXpress };
