class Redx {
    constructor(config, environment) {
        this.config = config;
        this.baseUrl =
            environment === "production"
                ? "openapi.redx.com.bd/v1.0.0-beta"
                : "sandbox.redx.com.bd/v1.0.0-beta";
    }
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
