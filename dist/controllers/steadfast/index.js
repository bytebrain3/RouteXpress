class Steadfast {
    constructor(config) {
        this.config = config;
        this.baseUrl = "https://portal.packzy.com/api/v1";
    }
    validator(orderData) {
        if (!orderData.order_details.recipient_phone ||
            orderData.order_details.recipient_phone.length !== 11) {
            return {
                status: 500,
                errors: "Customer phone number must be exactly 11 digits",
            };
        }
        if (!orderData.order_details.recipient_name ||
            orderData.order_details.recipient_name.length > 100) {
            return {
                status: 500,
                errors: "Recipient name cannot be greater than 100 characters",
            };
        }
        if (!orderData.order_details.recipient_address ||
            orderData.order_details.recipient_address.length > 250) {
            return {
                status: 500,
                errors: "Recipient address cannot be greater than 250 characters",
            };
        }
        if (!orderData.order_details.cod_amount ||
            orderData.order_details.cod_amount < 0) {
            return {
                status: 500,
                errors: "Cash on delivery amount cannot be less than 0",
            };
        }
        return null;
    }
    async createOrder(orderData) {
        try {
            const validationResult = this.validator(orderData);
            if (validationResult) {
                return {
                    status: validationResult.status,
                    message: validationResult.errors,
                };
            }
            const response = await fetch(`${this.baseUrl}/create_order`, {
                method: "POST",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData.order_details),
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async createBulkOrder(bulkOrder) {
        try {
            if (!bulkOrder || !bulkOrder.orders) {
                throw new Error("Bulk order data with orders array is required.");
            }
            const { orders } = bulkOrder;
            if (!Array.isArray(orders)) {
                throw new Error("Orders must be an array.");
            }
            if (orders.length === 0) {
                throw new Error("Orders array cannot be empty.");
            }
            if (orders.length > 500) {
                throw new Error("Cannot exceed 500 orders in a bulk request.");
            }
            for (const order of orders) {
                const validationResult = this.validator({
                    order_details: {
                        invoice: order.invoice,
                        recipient_name: order.recipient_name,
                        recipient_phone: order.recipient_phone,
                        recipient_address: order.recipient_address,
                        cod_amount: Number(order.cod_amount),
                        note: order.note,
                    },
                });
                if (validationResult) {
                    return {
                        status: validationResult.status,
                        message: validationResult.errors,
                    };
                }
            }
            const formattedOrders = orders.map((order) => ({
                invoice: order.invoice,
                recipient_name: order.recipient_name,
                recipient_phone: order.recipient_phone,
                recipient_address: order.recipient_address,
                cod_amount: order.cod_amount,
                note: order.note || null,
            }));
            const requestPayload = {
                data: JSON.stringify(formattedOrders),
            };
            const response = await fetch(`${this.baseUrl}/create_order/bulk-order`, {
                method: "POST",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestPayload),
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async getStatusByCid(cid) {
        try {
            if (!cid) {
                throw new Error("CID is required to get order status.");
            }
            const response = await fetch(`${this.baseUrl}/status_by_cid/${cid}`, {
                method: "GET",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async getStatusByInvoice(invoice) {
        try {
            if (!invoice) {
                throw new Error("Invoice is required to get order status.");
            }
            const response = await fetch(`${this.baseUrl}/status_by_invoice/${invoice}`, {
                method: "GET",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async statusBytrackingcode(trackingcode) {
        try {
            if (!trackingcode) {
                throw new Error("Tracking code is required to get order status.");
            }
            const response = await fetch(`${this.baseUrl}/status_by_trackingcode/${trackingcode}`, {
                method: "GET",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async getBalance() {
        try {
            const response = await fetch(`${this.baseUrl}/get_balance`, {
                method: "GET",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async createReturnRequest(params) {
        try {
            if (!params.consignment_id && !params.invoice && !params.tracking_code) {
                throw new Error("At least one of consignment_id, invoice, or tracking_code is required.");
            }
            const response = await fetch(`${this.baseUrl}/create_return_request`, {
                method: "POST",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async getReturnRequest(id) {
        try {
            if (!id) {
                throw new Error("Return request ID is required.");
            }
            const response = await fetch(`${this.baseUrl}/get_return_request/${id}`, {
                method: "GET",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async getReturnRequests() {
        try {
            const response = await fetch(`${this.baseUrl}/get_return_requests`, {
                method: "GET",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async getPayments() {
        try {
            const response = await fetch(`${this.baseUrl}/payments`, {
                method: "GET",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async getSinglePayment(paymentId) {
        try {
            if (!paymentId) {
                throw new Error("Payment ID is required.");
            }
            const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
                method: "GET",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
    async getPoliceStations() {
        try {
            const response = await fetch(`${this.baseUrl}/police_stations`, {
                method: "GET",
                headers: {
                    "Api-Key": this.config.apiKey,
                    "Secret-Key": this.config.apiSecret,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    status: response.status,
                    message: data?.message || response.statusText,
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
}
export { Steadfast };
