import {
  Order_Data_For_Steadfast,
  Bulk_Order_For_Steadfast,
  Bulk_Order_Response_For_Steadfast,
  ErrorResponse,
  Create_Order_Response_Items_For_Steadfast,
} from "../../types/steadfast.js";
import { Steadfast_Config } from "../../types/config.js";
class Steadfast {
  private config: Steadfast_Config;
  private baseUrl: string;

  constructor(config: Steadfast_Config) {
    this.config = config;
    this.baseUrl = "https://portal.steadfast.com.bd/api/v1";
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

  async createOrder(orderData: Order_Data_For_Steadfast) {
    try {
      const validationResult = this.validator(orderData);
      if (validationResult) {
        return {
          status: validationResult.status,
          message: validationResult.errors,
        };
      }

      const response = await fetch(
        `${this.baseUrl}/create_order`,
        {
          method: "POST",
          headers: {
            "Api-Key": this.config.apiKey,
            "Secret-Key": this.config.apiSecret,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData.order_details),
        }
      );
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

  async createBulkOrder(bulkOrder: Bulk_Order_For_Steadfast) {
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

      // Validate each order in the bulk request
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

      // Transform orders to match API expected format
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

  async getStatusByCid(cid: string) {
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
      return data;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async getStatusByInvoice(invoice: string) {
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
      return data;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async statusBytrackingcode(trackingcode: string) {
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
      return data;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async getBalance() {
    try {
      const response = await fetch(
        `${this.baseUrl}/get_balance`,
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
      return data;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }
}

export {Steadfast};
