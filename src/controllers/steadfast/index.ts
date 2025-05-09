import axios from "axios";
import {
  Order_Data_For_Steadfast,
  Bulk_Order_For_Steadfast,
  Bulk_Order_Response_For_Steadfast,
  ErrorResponse,
  Create_Order_Response_Items_For_Steadfast,
} from "../../types/steadfast";
import { Steadfast_Config } from "../../types/config";
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

      const response = await axios.post(
        `${this.baseUrl}/create_order`,
        orderData.order_details,
        {
          headers: {
            "Api-Key": this.config.apiKey,
            "Secret-Key": this.config.apiSecret,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data as Create_Order_Response_Items_For_Steadfast;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data || error.message,
        } as ErrorResponse;
      }
      return {
        status: 500,
        message: "An unexpected error occurred",
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
        cod_amount: order.cod_amount, // Convert to string
        note: order.note || null, // Ensure null for undefined notes
      }));

      const requestPayload = {
        data: JSON.stringify(formattedOrders), // Wrap in data property and stringify
      };

      //console.log("Request Payload:", requestPayload);

      const response = await axios.post(
        `${this.baseUrl}/create_order/bulk-order`,
        requestPayload,
        {
          headers: {
            "Api-Key": this.config.apiKey,
            "Secret-Key": this.config.apiSecret,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data as Bulk_Order_Response_For_Steadfast;
    } catch (error: unknown) {
      console.error("Error in createBulkOrder:", error);
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data?.message || error.message,
        } as ErrorResponse;
      }
      return {
        status: 500,
        message: "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async getStatusByCid(cid: string) {
    try {
      if (!cid) {
        throw new Error("CID is required to get order status.");
      }

      const response = await axios.get(`${this.baseUrl}/status_by_cid/${cid}`, {
        // Fixed headers object syntax
        headers: {
          "Api-Key": this.config.apiKey,
          "Secret-Key": this.config.apiSecret,
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data || error.message,
        } as ErrorResponse;
      }
      return {
        status: 500,
        message: "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async getStatusByInvoice(invoice: string) {
    try {
      if (!invoice) {
        throw new Error("Invoice is required to get order status.");
      }

      const response = await axios.get(
        `${this.baseUrl}/status_by_invoice/${invoice}`,
        {
          headers: {
            "Api-Key": this.config.apiKey,
            "Secret-Key": this.config.apiSecret,
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data || error.message,
        } as ErrorResponse;
      }
      return {
        status: 500,
        message: "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async statusBytrackingcode(trackingcode : string) {
    try {
      if (!trackingcode) {
        throw new Error("Tracking code is required to get order status.");
      }

      const response = await axios.get(
        `${this.baseUrl}/status_by_trackingcode/${trackingcode}`,
        {
          // Fixed headers object syntax
          headers: {
            "Api-Key": this.config.apiKey,
            "Secret-Key": this.config.apiSecret,
          },
        }
      );
      if (!response.data) {
        console.error("No data received from Steadfast API");
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data || error.message,
        } as ErrorResponse;
      }
      return {
        status: 500,
        message: "An unexpected error occurred",
      } as ErrorResponse;
    }
    }
  
  async getBalance() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/get_balance`,
        {
          // Fixed headers object syntax
          headers: {
            "Api-Key": this.config.apiKey,
            "Secret-Key": this.config.apiSecret,
          },
        }
      );

      if (!response.data) {
        throw new Error("No data received from Steadfast API");
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          status: error.response?.status || 500,
          message: error.response?.data || error.message,
        } as ErrorResponse;
      }
      return {
        status: 500,
        message: "An unexpected error occurred",
      } as ErrorResponse;
    
    }
  }
}

export default Steadfast;
