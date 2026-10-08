import {
  Order_Data_For_Steadfast,
  Bulk_Order_For_Steadfast,
  Bulk_Order_Response_For_Steadfast,
  ErrorResponse,
  Create_Order_Response_Items_For_Steadfast,
  Delivery_Status_Response,
  Balance_Response,
  Return_Request,
  Create_Return_Request_Params,
  Payment,
  Police_Station,
} from "@/types/steadfast.js";
import { Steadfast_Config } from "@/types/config.js";
import {
  ErrorResponse as ApiErrorResponse,
  validationError,
  apiError,
  unknownError,
} from "@/utils/errors.js";
import {
  validateSteadfastOrder,
  validateSteadfastBulkOrder,
} from "@/validators/steadfast.js";

class Steadfast {
  private config: Steadfast_Config;
  private baseUrl: string;

  constructor(config: Steadfast_Config) {
    this.config = config;
    this.baseUrl = "https://portal.packzy.com/api/v1";
  }

  private async request<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T | ApiErrorResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, init);
      const raw = await response.text();

      if (!response.ok) {
        return await apiError(response, raw);
      }

      if (!raw) {
        return {} as T;
      }

      try {
        return JSON.parse(raw) as T;
      } catch {
        return {
          status: response.status,
          message: "Invalid JSON response from Steadfast",
        };
      }
    } catch (error) {
      return unknownError(error);
    }
  }

  private jsonHeaders(): Record<string, string> {
    return {
      "Api-Key": this.config.apiKey,
      "Secret-Key": this.config.apiSecret,
      "Content-Type": "application/json",
    };
  }

  private getHeaders(): Record<string, string> {
    return {
      "Api-Key": this.config.apiKey,
      "Secret-Key": this.config.apiSecret,
    };
  }

  /**
   * Create a new order on Steadfast.
   *
   * @param orderData - The order details including recipient info and COD amount.
   * @returns The created order with consignment and tracking info, or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.createOrder({
   *   order_details: {
   *     invoice: "INV-001",
   *     recipient_name: "John Doe",
   *     recipient_phone: "01712345678",
   *     recipient_address: "123 Main St, Dhaka",
   *     cod_amount: 1500,
   *     note: "Handle with care",
   *   },
   * });
   * //=> { invoice: "INV-001", consignment_id: 12345, tracking_code: "SF123456", status: "pending", ... }
   * ```
   */
  async createOrder(
    orderData: Order_Data_For_Steadfast
  ): Promise<Create_Order_Response_Items_For_Steadfast | ErrorResponse> {
    const validation = validateSteadfastOrder(orderData);
    if (validation) {
      return validationError(validation);
    }

    return this.request<Create_Order_Response_Items_For_Steadfast>(
      "/create_order",
      {
        method: "POST",
        headers: this.jsonHeaders(),
        body: JSON.stringify(orderData.order_details),
      },
    );
  }

  /**
   * Create multiple orders in a single request (max 500).
   *
   * @param bulkOrder - Object containing an array of order items.
   * @returns Bulk order response with per-order status, or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.createBulkOrder({
   *   orders: [
   *     {
   *       invoice: "INV-001",
   *       recipient_name: "John Doe",
   *       recipient_phone: "01712345678",
   *       recipient_address: "123 Main St, Dhaka",
   *       cod_amount: 1500,
   *     },
   *     {
   *       invoice: "INV-002",
   *       recipient_name: "Jane Smith",
   *       recipient_phone: "01812345678",
   *       recipient_address: "456 Oak Ave, Chittagong",
   *       cod_amount: 2000,
   *     },
   *   ],
   * });
   * //=> { data: [{ invoice: "INV-001", status: "success", tracking_code: "SF123" }, ...] }
   * ```
   */
  async createBulkOrder(
    bulkOrder: Bulk_Order_For_Steadfast
  ): Promise<Bulk_Order_Response_For_Steadfast | ErrorResponse> {
    const validation = validateSteadfastBulkOrder(bulkOrder);
    if (validation) {
      return validationError(validation);
    }

    const formattedOrders = bulkOrder.orders.map((order) => ({
      invoice: order.invoice,
      recipient_name: order.recipient_name,
      recipient_phone: order.recipient_phone,
      recipient_address: order.recipient_address,
      cod_amount: order.cod_amount,
      note: order.note || null,
    }));

    return this.request<Bulk_Order_Response_For_Steadfast>(
      "/create_order/bulk-order",
      {
        method: "POST",
        headers: this.jsonHeaders(),
        body: JSON.stringify({ data: JSON.stringify(formattedOrders) }),
      },
    );
  }

  /**
   * Get delivery status by consignment ID.
   *
   * @param cid - The consignment ID.
   * @returns Current delivery status or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.getStatusByCid("12345");
   * //=> { status: 200, delivery_status: "delivered" }
   * ```
   */
  async getStatusByCid(cid: string): Promise<Delivery_Status_Response | ErrorResponse> {
    if (!cid) {
      return validationError("CID is required to get order status.");
    }

    return this.request<Delivery_Status_Response>(
      `/status_by_cid/${cid}`,
      { method: "GET", headers: this.getHeaders() },
    );
  }

  /**
   * Get delivery status by invoice number.
   *
   * @param invoice - The invoice number.
   * @returns Current delivery status or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.getStatusByInvoice("INV-001");
   * //=> { status: 200, delivery_status: "in_transit" }
   * ```
   */
  async getStatusByInvoice(invoice: string): Promise<Delivery_Status_Response | ErrorResponse> {
    if (!invoice) {
      return validationError("Invoice is required to get order status.");
    }

    return this.request<Delivery_Status_Response>(
      `/status_by_invoice/${invoice}`,
      { method: "GET", headers: this.getHeaders() },
    );
  }

  /**
   * Get delivery status by tracking code.
   *
   * @param trackingcode - The tracking code.
   * @returns Current delivery status or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.statusBytrackingcode("SF123456");
   * //=> { status: 200, delivery_status: "delivered" }
   * ```
   */
  async statusBytrackingcode(trackingcode: string): Promise<Delivery_Status_Response | ErrorResponse> {
    if (!trackingcode) {
      return validationError("Tracking code is required to get order status.");
    }

    return this.request<Delivery_Status_Response>(
      `/status_by_trackingcode/${trackingcode}`,
      { method: "GET", headers: this.getHeaders() },
    );
  }

  /**
   * Get the current balance of the Steadfast account.
   *
   * @returns Balance info or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.getBalance();
   * //=> { status: 200, current_balance: 5000.00 }
   * ```
   */
  async getBalance(): Promise<Balance_Response | ErrorResponse> {
    return this.request<Balance_Response>("/get_balance", {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  /**
   * Create a return request for a consignment.
   *
   * @param params - At least one of `consignment_id`, `invoice`, or `tracking_code` is required.
   * @returns The created return request or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.createReturnRequest({
   *   consignment_id: 12345,
   *   reason: "Customer not available",
   * });
   * //=> { id: 1, consignment_id: 12345, status: "pending", ... }
   * ```
   */
  async createReturnRequest(
    params: Create_Return_Request_Params
  ): Promise<Return_Request | ErrorResponse> {
    if (!params?.consignment_id && !params?.invoice && !params?.tracking_code) {
      return validationError(
        "At least one of consignment_id, invoice, or tracking_code is required.",
      );
    }

    return this.request<Return_Request>("/create_return_request", {
      method: "POST",
      headers: this.jsonHeaders(),
      body: JSON.stringify(params),
    });
  }

  /**
   * Get a single return request by ID.
   *
   * @param id - The return request ID.
   * @returns Return request details or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.getReturnRequest(1);
   * //=> { id: 1, consignment_id: 12345, status: "approved", ... }
   * ```
   */
  async getReturnRequest(id: number): Promise<Return_Request | ErrorResponse> {
    if (!id) {
      return validationError("Return request ID is required.");
    }

    return this.request<Return_Request>(`/get_return_request/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  /**
   * Get all return requests.
   *
   * @returns Array of return requests or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.getReturnRequests();
   * //=> [{ id: 1, consignment_id: 12345, status: "pending" }, ...]
   * ```
   */
  async getReturnRequests(): Promise<Return_Request[] | ErrorResponse> {
    return this.request<Return_Request[]>("/get_return_requests", {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  /**
   * Get all payments.
   *
   * @returns Array of payments or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.getPayments();
   * //=> [{ id: 1, amount: 5000, status: "completed", consignments: [...] }, ...]
   * ```
   */
  async getPayments(): Promise<Payment[] | ErrorResponse> {
    return this.request<Payment[]>("/payments", {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  /**
   * Get a single payment with its consignments.
   *
   * @param paymentId - The payment ID.
   * @returns Payment details or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.getSinglePayment(1);
   * //=> { id: 1, amount: 5000, status: "completed", consignments: [...] }
   * ```
   */
  async getSinglePayment(paymentId: number): Promise<Payment | ErrorResponse> {
    if (!paymentId) {
      return validationError("Payment ID is required.");
    }

    return this.request<Payment>(`/payments/${paymentId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }

  /**
   * Get all police stations for address validation.
   *
   * @returns Array of police stations or an error.
   *
   * @example
   * ```ts
   * const result = await steadfast.getPoliceStations();
   * //=> [{ id: 1, name: "Dhanmondi", district_id: 1, division_id: 1 }, ...]
   * ```
   */
  async getPoliceStations(): Promise<Police_Station[] | ErrorResponse> {
    return this.request<Police_Station[]>("/police_stations", {
      method: "GET",
      headers: this.getHeaders(),
    });
  }
}

export { Steadfast };
