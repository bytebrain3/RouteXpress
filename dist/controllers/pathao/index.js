class Pathao {
    constructor(config) {
        this.config = config;
        this.baseUrl = "https://api-hermes.pathao.com";
    }
    async createNewToken() {
        try {
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/issue-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: this.config.apiKey ?? "",
                    client_secret: this.config.apiSecret ?? "",
                    grant_type: "password",
                    username: this.config.username ?? "",
                    password: this.config.password ?? "",
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                };
            }
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
    }
    async createRefresshToken(refreshToken) {
        try {
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/issue-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: this.config.apiKey,
                    client_secret: this.config.apiSecret,
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                };
            }
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
            };
        }
    }
    async createStore(authToken, store) {
        try {
            if (!store) {
                return {
                    status: 400,
                    message: "Store data is required",
                };
            }
            if (!store.name) {
                return {
                    status: 400,
                    message: "Store name is required",
                };
            }
            if (!store.contact_name) {
                return {
                    status: 400,
                    message: "Contact name is required",
                };
            }
            if (!store.contact_number) {
                return {
                    status: 400,
                    message: "Contact number is required",
                };
            }
            if (!store.address) {
                return {
                    status: 400,
                    message: "Address is required",
                };
            }
            if (!store.city_id) {
                return {
                    status: 400,
                    message: "City ID is required",
                };
            }
            if (!store.zone_id) {
                return {
                    status: 400,
                    message: "Zone ID is required",
                };
            }
            if (!store.area_id) {
                return {
                    status: 400,
                    message: "Area ID is required",
                };
            }
            if (!store.contact_number.match(/^\d{11}$/)) {
                return {
                    status: 400,
                    message: "Contact number must be 11 digits",
                };
            }
            if (store.secondary_contact &&
                !store.secondary_contact.match(/^\d{11}$/)) {
                return {
                    status: 400,
                    message: "Secondary contact number must be 11 digits",
                };
            }
            if (store.contact_number === store.secondary_contact) {
                return {
                    status: 400,
                    message: "Contact number and secondary contact number cannot be the same",
                };
            }
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/stores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(store),
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                    code: data?.code,
                    error: data?.errors,
                };
            }
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async createOrder(authToken, order) {
        try {
            if (!order) {
                return {
                    status: 400,
                    message: "Order data is required",
                };
            }
            if (!order.store_id) {
                return {
                    status: 400,
                    message: "Store ID is required",
                };
            }
            if (!order.recipient_name) {
                return {
                    status: 400,
                    message: "Recipient name is required",
                };
            }
            if (!order.recipient_phone) {
                return {
                    status: 400,
                    message: "Recipient phone is required",
                };
            }
            if (!order.recipient_address || order.recipient_address.length < 10) {
                return {
                    status: 400,
                    message: "Recipient address is required and must be at least 10 characters",
                };
            }
            if (!order.recipient_city) {
                return {
                    status: 400,
                    message: "Recipient city is required",
                };
            }
            if (!order.recipient_zone) {
                return {
                    status: 400,
                    message: "Recipient zone is required",
                };
            }
            if (!order.delivery_type || ![48, 12].includes(order.delivery_type)) {
                return {
                    status: 400,
                    message: "Delivery type is required and must be 48 (Normal Delivery) or 12 (On Demand Delivery)",
                };
            }
            if (!order.item_type || ![1, 2].includes(order.item_type)) {
                return {
                    status: 400,
                    message: "Item type is required and must be 1 (Document) or 2 (Parcel)",
                };
            }
            if (!order.item_quantity || order.item_quantity <= 0) {
                return {
                    status: 400,
                    message: "Item quantity is required and must be greater than 0",
                };
            }
            if (!order.item_weight ||
                order.item_weight < 0.5 ||
                order.item_weight > 10) {
                return {
                    status: 400,
                    message: "Item weight is required and must be between 0.5 and 10 kg",
                };
            }
            if (order.amount_to_collect === undefined ||
                order.amount_to_collect < 0) {
                return {
                    status: 400,
                    message: "Amount to collect is required and must be a non-negative value",
                };
            }
            const removeAuthTokrn = { ...order, authToken: undefined };
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(removeAuthTokrn),
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                    code: data?.code,
                    error: data?.errors,
                };
            }
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async createBulkOrder(pathaoOrder) {
        try {
            // Validate the input
            if (!pathaoOrder || !pathaoOrder.orders || !pathaoOrder.authToken) {
                return {
                    status: 400,
                    message: "Order data, orders array, and auth token are required",
                };
            }
            if (!Array.isArray(pathaoOrder.orders) ||
                pathaoOrder.orders.length === 0) {
                return {
                    status: 400,
                    message: "Orders must be a non-empty array of order objects",
                };
            }
            for (const order of pathaoOrder.orders) {
                if (!order.store_id || typeof order.store_id !== "number") {
                    return {
                        status: 400,
                        message: "Each order must have a valid store_id (integer)",
                    };
                }
                if (!order.recipient_name || typeof order.recipient_name !== "string") {
                    return {
                        status: 400,
                        message: "Each order must have a valid recipient_name (string)",
                    };
                }
                if (!order.recipient_phone ||
                    !order.recipient_phone.match(/^\d{11}$/)) {
                    return {
                        status: 400,
                        message: "Each order must have a valid recipient_phone (11-digit number)",
                    };
                }
                if (!order.recipient_address ||
                    typeof order.recipient_address !== "string" ||
                    order.recipient_address.length < 10) {
                    return {
                        status: 400,
                        message: "Each order must have a valid recipient_address (minimum 10 characters)",
                    };
                }
                if (!order.recipient_city || typeof order.recipient_city !== "number") {
                    return {
                        status: 400,
                        message: "Each order must have a valid recipient_city (integer)",
                    };
                }
                if (!order.recipient_zone || typeof order.recipient_zone !== "number") {
                    return {
                        status: 400,
                        message: "Each order must have a valid recipient_zone (integer)",
                    };
                }
                if (order.recipient_area && typeof order.recipient_area !== "number") {
                    return {
                        status: 400,
                        message: "If provided, recipient_area must be a valid integer",
                    };
                }
                if (!order.delivery_type || ![48, 12].includes(order.delivery_type)) {
                    return {
                        status: 400,
                        message: "Each order must have a valid delivery_type (48 for Normal Delivery, 12 for On Demand Delivery)",
                    };
                }
                if (!order.item_type || ![1, 2].includes(order.item_type)) {
                    return {
                        status: 400,
                        message: "Each order must have a valid item_type (1 for Document, 2 for Parcel)",
                    };
                }
                if (!order.item_quantity ||
                    typeof order.item_quantity !== "number" ||
                    order.item_quantity <= 0) {
                    return {
                        status: 400,
                        message: "Each order must have a valid item_quantity (integer greater than 0)",
                    };
                }
                if (!order.item_weight ||
                    typeof order.item_weight !== "number" ||
                    order.item_weight < 0.5 ||
                    order.item_weight > 10) {
                    return {
                        status: 400,
                        message: "Each order must have a valid item_weight (between 0.5 and 10 kg)",
                    };
                }
                if (order.amount_to_collect === undefined ||
                    typeof order.amount_to_collect !== "number" ||
                    order.amount_to_collect < 0) {
                    return {
                        status: 400,
                        message: "Each order must have a valid amount_to_collect (non-negative integer)",
                    };
                }
            }
            // Send the request with proper format
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/orders/bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${pathaoOrder.authToken}`,
                },
                body: JSON.stringify({ orders: pathaoOrder.orders }), // Wrap orders array in an object with 'orders' key
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                    code: data?.code,
                    error: JSON.stringify(data?.errors),
                };
            }
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async getStatusByCid(cidDetails) {
        try {
            // Validate auth token
            if (!cidDetails.authToken) {
                throw new Error("Valid authentication token is required");
            }
            // Validate order data
            if (!cidDetails.cid) {
                throw new Error("CID is required to get order status");
            }
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/orders/${cidDetails.cid}/info`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cidDetails.authToken}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                    code: data?.code,
                    error: JSON.stringify(data?.errors),
                };
            }
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async getCitys(authToken) {
        try {
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/city-list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                    code: data?.code,
                    error: JSON.stringify(data?.errors),
                };
            }
            return {
                message: data.message,
                type: data.type,
                code: data.code,
                data: data.data.data,
            };
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async getZone(authToken, cityId) {
        try {
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/cities/${cityId}/zone-list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                    code: data?.code,
                    error: JSON.stringify(data?.errors),
                };
            }
            return {
                message: data.message,
                type: data.type,
                code: data.code,
                data: data.data.data,
            };
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async get_area_list(authToken, zoneId) {
        try {
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/zones/${zoneId}/area-list`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                    code: data?.code,
                    error: JSON.stringify(data?.errors),
                };
            }
            return {
                message: data.message,
                type: data.type,
                code: data.code,
                data: data.data.data,
            };
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async price_plane(authToken, orderData) {
        try {
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/merchant/price-plan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(orderData),
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                    code: data?.code,
                    error: JSON.stringify(data?.errors),
                };
            }
            return data;
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async getAllStore(authToken) {
        try {
            const response = await fetch(`${this.baseUrl}/aladdin/api/v1/stores`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message ?? response.statusText,
                    code: data?.code,
                    error: JSON.stringify(data?.errors),
                };
            }
            return {
                message: data.message,
                type: data.type,
                code: data.code,
                data: data.data.data,
                pagination: {
                    total: data.data.total,
                    current_page: data.data.current_page,
                    per_page: data.data.per_page,
                    total_in_page: data.data.total_in_page,
                    last_page: data.data.last_page,
                    path: data.data.path,
                    to: data.data.to,
                    from: data.data.from,
                    last_page_url: data.data.last_page_url,
                    first_page_url: data.data.first_page_url,
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                message: error?.message || "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
}
export { Pathao };
