import {
  TookenIssueResponse,
  ErrorResponse,
  PathaoStore,
  PathaoStoreResponse,
  CreatePathaoOrder,
  Bulk_Order_For_Pathao_Response,
  Bulk_Order_For_Pathao,
  PathaoCityResponse,
  PathaoZoneResponse,
  PathaoPriceResponse,
  PathaoAreaResponse,
  PathaoOrderPiceData,
  PathaoAllStoreResponse
} from "../../types/pathao.js"; // updated with .js

import { Pathao_Config } from "../../types/config.js"; // updated with .js

class Pathao {
  private config: Pathao_Config;
  private baseUrl: string;

  constructor(config: Pathao_Config) {
    this.config = config;
    this.baseUrl = "https://api-hermes.pathao.com";
  }

  async createNewToken(): Promise<TookenIssueResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/issue-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: this.config.apiKey ?? "",
            client_secret: this.config.apiSecret ?? "",
            grant_type: "password",
            username: this.config.username ?? "",
            password: this.config.password ?? "",
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
        } as ErrorResponse;
      }
      return data as TookenIssueResponse;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async createRefresshToken(
    refreshToken: string
  ): Promise<TookenIssueResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/issue-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: this.config.apiKey,
            client_secret: this.config.apiSecret,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
        } as ErrorResponse;
      }
      return data as TookenIssueResponse;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async createStore(
    authToken: string,
    store: PathaoStore
  ): Promise<PathaoStoreResponse | ErrorResponse> {
    try {
      if (!store) {
        return {
          status: 400,
          message: "Store data is required",
        } as ErrorResponse;
      }

      if (!store.name) {
        return {
          status: 400,
          message: "Store name is required",
        } as ErrorResponse;
      }
      if (!store.contact_name) {
        return {
          status: 400,
          message: "Contact name is required",
        } as ErrorResponse;
      }
      if (!store.contact_number) {
        return {
          status: 400,
          message: "Contact number is required",
        } as ErrorResponse;
      }
      if (!store.address) {
        return {
          status: 400,
          message: "Address is required",
        } as ErrorResponse;
      }
      if (!store.city_id) {
        return {
          status: 400,
          message: "City ID is required",
        } as ErrorResponse;
      }
      if (!store.zone_id) {
        return {
          status: 400,
          message: "Zone ID is required",
        } as ErrorResponse;
      }
      if (!store.area_id) {
        return {
          status: 400,
          message: "Area ID is required",
        } as ErrorResponse;
      }
      if (!store.contact_number.match(/^\d{11}$/)) {
        return {
          status: 400,
          message: "Contact number must be 11 digits",
        } as ErrorResponse;
      }
      if (
        store.secondary_contact &&
        !store.secondary_contact.match(/^\d{11}$/)
      ) {
        return {
          status: 400,
          message: "Secondary contact number must be 11 digits",
        } as ErrorResponse;
      }
      if (store.contact_number === store.secondary_contact) {
        return {
          status: 400,
          message:
            "Contact number and secondary contact number cannot be the same",
        } as ErrorResponse;
      }
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/stores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(store),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
          code: data?.code,
          error: data?.errors,
        } as ErrorResponse;
      }
      return data as PathaoStoreResponse;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
        code: undefined,
        error: undefined,
      } as ErrorResponse;
    }
  }

  async createOrder(authToken: string, order: CreatePathaoOrder) {
    try {
      if (!order) {
        return {
          status: 400,
          message: "Order data is required",
        } as ErrorResponse;
      }

      if (!order.store_id) {
        return {
          status: 400,
          message: "Store ID is required",
        } as ErrorResponse;
      }

      if (!order.recipient_name) {
        return {
          status: 400,
          message: "Recipient name is required",
        } as ErrorResponse;
      }

      if (!order.recipient_phone) {
        return {
          status: 400,
          message: "Recipient phone is required",
        } as ErrorResponse;
      }

      if (!order.recipient_address || order.recipient_address.length < 10) {
        return {
          status: 400,
          message:
            "Recipient address is required and must be at least 10 characters",
        } as ErrorResponse;
      }

      if (!order.recipient_city) {
        return {
          status: 400,
          message: "Recipient city is required",
        } as ErrorResponse;
      }

      if (!order.recipient_zone) {
        return {
          status: 400,
          message: "Recipient zone is required",
        } as ErrorResponse;
      }

      if (!order.delivery_type || ![48, 12].includes(order.delivery_type)) {
        return {
          status: 400,
          message:
            "Delivery type is required and must be 48 (Normal Delivery) or 12 (On Demand Delivery)",
        } as ErrorResponse;
      }

      if (!order.item_type || ![1, 2].includes(order.item_type)) {
        return {
          status: 400,
          message:
            "Item type is required and must be 1 (Document) or 2 (Parcel)",
        } as ErrorResponse;
      }

      if (!order.item_quantity || order.item_quantity <= 0) {
        return {
          status: 400,
          message: "Item quantity is required and must be greater than 0",
        } as ErrorResponse;
      }

      if (
        !order.item_weight ||
        order.item_weight < 0.5 ||
        order.item_weight > 10
      ) {
        return {
          status: 400,
          message: "Item weight is required and must be between 0.5 and 10 kg",
        } as ErrorResponse;
      }

      if (
        order.amount_to_collect === undefined ||
        order.amount_to_collect < 0
      ) {
        return {
          status: 400,
          message:
            "Amount to collect is required and must be a non-negative value",
        } as ErrorResponse;
      }
      const removeAuthTokrn = { ...order, authToken: undefined };
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(removeAuthTokrn),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
          code: data?.code,
          error: data?.errors,
        } as ErrorResponse;
      }
      return data;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
        code: undefined,
        error: undefined,
      } as ErrorResponse;
    }
  }

  async createBulkOrder(
    pathaoOrder: Bulk_Order_For_Pathao
  ): Promise<Bulk_Order_For_Pathao_Response[] | ErrorResponse> {
    try {
      // Validate the input
      if (!pathaoOrder || !pathaoOrder.orders || !pathaoOrder.authToken) {
        return {
          status: 400,
          message: "Order data, orders array, and auth token are required",
        } as ErrorResponse;
      }

      if (
        !Array.isArray(pathaoOrder.orders) ||
        pathaoOrder.orders.length === 0
      ) {
        return {
          status: 400,
          message: "Orders must be a non-empty array of order objects",
        } as ErrorResponse;
      }

      for (const order of pathaoOrder.orders) {
        if (!order.store_id || typeof order.store_id !== "number") {
          return {
            status: 400,
            message: "Each order must have a valid store_id (integer)",
          } as ErrorResponse;
        }

        if (!order.recipient_name || typeof order.recipient_name !== "string") {
          return {
            status: 400,
            message: "Each order must have a valid recipient_name (string)",
          } as ErrorResponse;
        }

        if (
          !order.recipient_phone ||
          !order.recipient_phone.match(/^\d{11}$/)
        ) {
          return {
            status: 400,
            message:
              "Each order must have a valid recipient_phone (11-digit number)",
          } as ErrorResponse;
        }

        if (
          !order.recipient_address ||
          typeof order.recipient_address !== "string" ||
          order.recipient_address.length < 10
        ) {
          return {
            status: 400,
            message:
              "Each order must have a valid recipient_address (minimum 10 characters)",
          } as ErrorResponse;
        }

        if (!order.recipient_city || typeof order.recipient_city !== "number") {
          return {
            status: 400,
            message: "Each order must have a valid recipient_city (integer)",
          } as ErrorResponse;
        }

        if (!order.recipient_zone || typeof order.recipient_zone !== "number") {
          return {
            status: 400,
            message: "Each order must have a valid recipient_zone (integer)",
          } as ErrorResponse;
        }

        if (order.recipient_area && typeof order.recipient_area !== "number") {
          return {
            status: 400,
            message: "If provided, recipient_area must be a valid integer",
          } as ErrorResponse;
        }

        if (!order.delivery_type || ![48, 12].includes(order.delivery_type)) {
          return {
            status: 400,
            message:
              "Each order must have a valid delivery_type (48 for Normal Delivery, 12 for On Demand Delivery)",
          } as ErrorResponse;
        }

        if (!order.item_type || ![1, 2].includes(order.item_type)) {
          return {
            status: 400,
            message:
              "Each order must have a valid item_type (1 for Document, 2 for Parcel)",
          } as ErrorResponse;
        }

        if (
          !order.item_quantity ||
          typeof order.item_quantity !== "number" ||
          order.item_quantity <= 0
        ) {
          return {
            status: 400,
            message:
              "Each order must have a valid item_quantity (integer greater than 0)",
          } as ErrorResponse;
        }

        if (
          !order.item_weight ||
          typeof order.item_weight !== "number" ||
          order.item_weight < 0.5 ||
          order.item_weight > 10
        ) {
          return {
            status: 400,
            message:
              "Each order must have a valid item_weight (between 0.5 and 10 kg)",
          } as ErrorResponse;
        }

        if (
          order.amount_to_collect === undefined ||
          typeof order.amount_to_collect !== "number" ||
          order.amount_to_collect < 0
        ) {
          return {
            status: 400,
            message:
              "Each order must have a valid amount_to_collect (non-negative integer)",
          } as ErrorResponse;
        }
      }

      // Send the request with proper format
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/orders/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${pathaoOrder.authToken}`,
          },
          body: JSON.stringify({ orders: pathaoOrder.orders }), // Wrap orders array in an object with 'orders' key
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
          code: data?.code,
          error: JSON.stringify(data?.errors),
        } as ErrorResponse;
      }
      return data as Bulk_Order_For_Pathao_Response[];
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
        code: undefined,
        error: undefined,
      } as ErrorResponse;
    }
  }

  async getStatusByCid(cidDetails: { cid: string; authToken: string }) {
    try {
      // Validate auth token
      if (!cidDetails.authToken) {
        throw new Error("Valid authentication token is required");
      }

      // Validate order data
      if (!cidDetails.cid) {
        throw new Error("CID is required to get order status");
      }

      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/orders/${cidDetails.cid}/info`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cidDetails.authToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
          code: data?.code,
          error: JSON.stringify(data?.errors),
        } as ErrorResponse;
      }
      return data;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
        code: undefined,
        error: undefined,
      } as ErrorResponse;
    }
  }

  async getCitys(
    authToken: string
  ): Promise<PathaoCityResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/city-list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
          code: data?.code,
          error: JSON.stringify(data?.errors),
        } as ErrorResponse;
      }
      return {
        message: data.message,
        type: data.type,
        code: data.code,
        data: data.data.data,
      } as PathaoCityResponse;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
        code: undefined,
        error: undefined,
      } as ErrorResponse;
    }
  }

  async getZone(
    authToken: string,
    cityId: number
  ): Promise<PathaoZoneResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/cities/${cityId}/zone-list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
          code: data?.code,
          error: JSON.stringify(data?.errors),
        } as ErrorResponse;
      }
      return {
        message: data.message,
        type: data.type,
        code: data.code,
        data: data.data.data,
      } as PathaoZoneResponse;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
        code: undefined,
        error: undefined,
      } as ErrorResponse;
    }
  }

  async get_area_list(
    authToken: string,
    zoneId: number
  ): Promise<PathaoAreaResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/zones/${zoneId}/area-list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
          code: data?.code,
          error: JSON.stringify(data?.errors),
        } as ErrorResponse;
      }
      return {
        message: data.message,
        type: data.type,
        code: data.code,
        data: data.data.data,
      } as PathaoAreaResponse;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
        code: undefined,
        error: undefined,
      } as ErrorResponse;
    }
  }

  async price_plane(
    authToken: string,
    orderData: PathaoOrderPiceData
  ): Promise<PathaoPriceResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/merchant/price-plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
          code: data?.code,
          error: JSON.stringify(data?.errors),
        } as ErrorResponse;
      }
      return data as PathaoPriceResponse;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
        code: undefined,
        error: undefined,
      } as ErrorResponse;
    }
  }

  async getAllStore(
    authToken: string
  ): Promise<PathaoAllStoreResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/aladdin/api/v1/stores`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return {
          status: response.status,
          message: data?.message ?? response.statusText,
          code: data?.code,
          error: JSON.stringify(data?.errors),
        } as ErrorResponse;
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
      } as PathaoAllStoreResponse;
    } catch (error: any) {
      return {
        status: 500,
        message: error?.message || "An unexpected error occurred",
        code: undefined,
        error: undefined,
      } as ErrorResponse;
    }
  }
}

export {Pathao};
