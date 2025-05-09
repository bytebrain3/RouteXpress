"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("node_modules/axios"));
class Pathao {
    constructor(config) {
        this.config = config;
        this.baseUrl = "https://api-hermes.pathao.com";
    }
    async createNewToken() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/aladdin/api/v1/issue-token`, {
                client_id: (_a = this.config.apiKey) !== null && _a !== void 0 ? _a : "",
                client_secret: (_b = this.config.apiSecret) !== null && _b !== void 0 ? _b : "",
                grant_type: "password",
                username: (_c = this.config.username) !== null && _c !== void 0 ? _c : "",
                password: (_d = this.config.password) !== null && _d !== void 0 ? _d : "",
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                return {
                    status: (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.status) !== null && _f !== void 0 ? _f : 500,
                    message: (_j = (_h = (_g = error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.message) !== null && _j !== void 0 ? _j : error.message,
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
            };
        }
    }
    async createRefresshToken(refreshToken) {
        var _a, _b, _c, _d, _e;
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/aladdin/api/v1/issue-token`, {
                client_id: this.config.apiKey,
                client_secret: this.config.apiSecret,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                return {
                    status: (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 500,
                    message: (_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : error.message,
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
            };
        }
    }
    async createStore(authToken, store) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
            console.log("Store data:", store);
            console.log("Auth token:", authToken);
            const jsonData = JSON.stringify(store);
            const response = await axios_1.default.post(`${this.baseUrl}/aladdin/api/v1/stores`, store, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                return {
                    status: (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 500,
                    message: (_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : error.message,
                    code: (_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.code,
                    error: (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.errors,
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async createOrder(authToken, order) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
            const response = await axios_1.default.post(`${this.baseUrl}/aladdin/api/v1/orders`, removeAuthTokrn, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                return {
                    status: (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 500,
                    message: (_e = (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) !== null && _e !== void 0 ? _e : error.message,
                    code: (_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.code,
                    error: (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.errors,
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async createBulkOrder(pathaoOrder) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
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
            const response = await axios_1.default.post(`${this.baseUrl}/aladdin/api/v1/orders/bulk`, { orders: pathaoOrder.orders }, // Wrap orders array in an object with 'orders' key
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${pathaoOrder.authToken}`,
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios error details:", {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    message: error.message,
                });
                return {
                    status: (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : 500,
                    message: (_g = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : error.message,
                    code: (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.code,
                    error: JSON.stringify((_l = (_k = error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.errors),
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async getStatusByCid(cidDetails) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            // Validate auth token
            if (!cidDetails.authToken) {
                throw new Error("Valid authentication token is required");
            }
            // Validate order data
            if (!cidDetails.cid) {
                throw new Error("CID is required to get order status");
            }
            const response = await axios_1.default.get(`${this.baseUrl}/aladdin/api/v1/orders/${cidDetails.cid}/info`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${cidDetails.authToken}`,
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios error details:", {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    message: error.message,
                });
                return {
                    status: (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : 500,
                    message: (_g = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : error.message,
                    code: (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.code,
                    error: JSON.stringify((_l = (_k = error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.errors),
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async getCitys(authToken) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/aladdin/api/v1/city-list`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return {
                message: response.data.message,
                type: response.data.type,
                code: response.data.code,
                data: response.data.data.data, // Access the nested 'data' array
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios error details:", {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    message: error.message,
                });
                return {
                    status: (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : 500,
                    message: (_g = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : error.message,
                    code: (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.code,
                    error: JSON.stringify((_l = (_k = error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.errors),
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async getZone(authToken, cityId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/aladdin/api/v1/cities/${cityId}/zone-list`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return {
                message: response.data.message,
                type: response.data.type,
                code: response.data.code,
                data: response.data.data.data,
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios error details:", {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    message: error.message,
                });
                return {
                    status: (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : 500,
                    message: (_g = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : error.message,
                    code: (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.code,
                    error: JSON.stringify((_l = (_k = error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.errors),
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async get_area_list(authToken, zoneId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/aladdin/api/v1/zones/${zoneId}/area-list`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return {
                message: response.data.message,
                type: response.data.type,
                code: response.data.code,
                data: response.data.data.data,
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios error details:", {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    message: error.message,
                });
                return {
                    status: (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : 500,
                    message: (_g = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : error.message,
                    code: (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.code,
                    error: JSON.stringify((_l = (_k = error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.errors),
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async price_plane(authToken, orderData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/aladdin/api/v1/merchant/price-plan`, orderData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios error details:", {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    message: error.message,
                });
                return {
                    status: (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : 500,
                    message: (_g = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : error.message,
                    code: (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.code,
                    error: JSON.stringify((_l = (_k = error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.errors),
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
    async getAllStore(authToken) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/aladdin/api/v1/stores`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return {
                message: response.data.message,
                type: response.data.type,
                code: response.data.code,
                data: response.data.data.data,
                pagination: {
                    total: response.data.data.total,
                    current_page: response.data.data.current_page,
                    per_page: response.data.data.per_page,
                    total_in_page: response.data.data.total_in_page,
                    last_page: response.data.data.last_page,
                    path: response.data.data.path,
                    to: response.data.data.to,
                    from: response.data.data.from,
                    last_page_url: response.data.data.last_page_url,
                    first_page_url: response.data.data.first_page_url,
                },
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error("Axios error details:", {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    message: error.message,
                });
                return {
                    status: (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : 500,
                    message: (_g = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) !== null && _g !== void 0 ? _g : error.message,
                    code: (_j = (_h = error.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.code,
                    error: JSON.stringify((_l = (_k = error.response) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.errors),
                };
            }
            return {
                status: 500,
                message: "An unexpected error occurred",
                code: undefined,
                error: undefined,
            };
        }
    }
}
exports.default = Pathao;
