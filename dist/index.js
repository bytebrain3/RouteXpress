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
    // Helper methods to safely access services
    getSteadfast() {
        if (!this.steadfast) {
            throw new Error("Steadfast service is not configured");
        }
        return this.steadfast;
    }
    getPathao() {
        if (!this.pathao) {
            throw new Error("Pathao service is not configured");
        }
        return this.pathao;
    }
    getRedx() {
        if (!this.redx) {
            throw new Error("Redx service is not configured");
        }
        return this.redx;
    }
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
    //add pathao methods here
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
    async createPathaoRefreshToken(refreshToken) {
        try {
            return await this.getPathao().createRefresshToken(refreshToken);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unknown error occurred");
        }
    }
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
