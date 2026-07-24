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

class Steadfast {
  private config: Steadfast_Config;
  private baseUrl: string;

  constructor(config: Steadfast_Config) {
    this.config = config;
    this.baseUrl = "https://portal.packzy.com/api/v1";
  }

  private validator(
    orderData: Order_Data_For_Steadfast
  ): { status: number; errors: string } | null {
    if (
      !orderData.order_details.recipient_phone ||
      orderData.order_details.recipient_phone.length !== 11
    ) {
      return {
        status: 500,
        errors: "Customer phone number must be exactly 11 digits",
      };
    }

    if (
      !orderData.order_details.recipient_name ||
      orderData.order_details.recipient_name.length > 100
    ) {
      return {
        status: 500,
        errors: "Recipient name cannot be greater than 100 characters",
      };
    }

    if (
      !orderData.order_details.recipient_address ||
      orderData.order_details.recipient_address.length > 250
    ) {
      return {
        status: 500,
        errors: "Recipient address cannot be greater than 250 characters",
      };
    }

    if (
      !orderData.order_details.cod_amount ||
      orderData.order_details.cod_amount < 0
    ) {
      return {
        status: 500,
        errors: "Cash on delivery amount cannot be less than 0",
      };
    }

    return null;
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
        } as ErrorResponse;
      }
      return data as Create_Order_Response_Items_For_Steadfast;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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

      const response = await fetch(
        `${this.baseUrl}/create_order/bulk-order`,
        {
          method: "POST",
          headers: {
            "Api-Key": this.config.apiKey,
            "Secret-Key": this.config.apiSecret,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message || response.statusText,
        } as ErrorResponse;
      }
      return data as Bulk_Order_Response_For_Steadfast;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
        } as ErrorResponse;
      }
      return data as Delivery_Status_Response;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
    try {
      if (!invoice) {
        throw new Error("Invoice is required to get order status.");
      }

      const response = await fetch(
        `${this.baseUrl}/status_by_invoice/${invoice}`,
        {
          method: "GET",
          headers: {
            "Api-Key": this.config.apiKey,
            "Secret-Key": this.config.apiSecret,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message || response.statusText,
        } as ErrorResponse;
      }
      return data as Delivery_Status_Response;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
    try {
      if (!trackingcode) {
        throw new Error("Tracking code is required to get order status.");
      }

      const response = await fetch(
        `${this.baseUrl}/status_by_trackingcode/${trackingcode}`,
        {
          method: "GET",
          headers: {
            "Api-Key": this.config.apiKey,
            "Secret-Key": this.config.apiSecret,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message || response.statusText,
        } as ErrorResponse;
      }
      return data as Delivery_Status_Response;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
        } as ErrorResponse;
      }
      return data as Balance_Response;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
    try {
      if (!params.consignment_id && !params.invoice && !params.tracking_code) {
        throw new Error(
          "At least one of consignment_id, invoice, or tracking_code is required."
        );
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
        } as ErrorResponse;
      }
      return data as Return_Request;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
        } as ErrorResponse;
      }
      return data as Return_Request;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
        } as ErrorResponse;
      }
      return data as Return_Request[];
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
        } as ErrorResponse;
      }
      return data as Payment[];
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
        } as ErrorResponse;
      }
      return data as Payment;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
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
        } as ErrorResponse;
      }
      return data as Police_Station[];
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }
}

export { Steadfast };
