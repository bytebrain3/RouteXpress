class Redx {
    constructor(config, environment) {
        this.config = config;
        this.baseUrl =
            environment === "production"
                ? "openapi.redx.com.bd/v1.0.0-beta"
                : "sandbox.redx.com.bd/v1.0.0-beta";
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
    async createOrder(orderData) {
        try {
            console.log("Request Payload:", orderData);
            const response = await fetch(`https://${this.baseUrl}/parcel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify(orderData),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            console.log("Parsed Response Data:", data);
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async createStore(storeData) {
        try {
            const response = await fetch(`https://${this.baseUrl}/pickup/store`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify(storeData),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async trackParcelByTrackingCode(trackingCode) {
        try {
            const response = await fetch(`https://${this.baseUrl}/parcel/track/${trackingCode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async getParcelInfoByTrackingCode(trackingCode) {
        try {
            const response = await fetch(`https://${this.baseUrl}/parcel/info/${trackingCode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async updateParcel(trackingCode, updateData) {
        try {
            console.log("Update Data:", updateData);
            const response = await fetch(`https://${this.baseUrl}/parcels`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
                body: JSON.stringify({
                    entity_type: "parcel-tracking-id",
                    entity_id: trackingCode,
                    update_details: updateData,
                }),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async getAreaList() {
        try {
            const response = await fetch(`https://${this.baseUrl}/areas`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async getAreaByPostcode(postcode) {
        try {
            const response = await fetch(`https://${this.baseUrl}//areas?post_code=${postcode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async getAreaByDistrictName(districtName) {
        try {
            const response = await fetch(`https://${this.baseUrl}/areas?district_name=${districtName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async getStores() {
        try {
            const response = await fetch(`https://${this.baseUrl}/pickup/stores`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async getPickupStoreInfo(storeId) {
        try {
            const response = await fetch(`https://${this.baseUrl}/pickup/store/info/${storeId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
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
    async calculatePrice(orderData) {
        try {
            console.log("Request Payload:", orderData);
            const queryParams = new URLSearchParams(orderData).toString();
            const response = await fetch(`https://${this.baseUrl}/charge/charge_calculator?${queryParams}`, {
                method: "GET",
                headers: {
                    "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
                },
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Error Response Body:", errorBody);
                throw new Error(errorBody);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
    }
}
export { Redx };
