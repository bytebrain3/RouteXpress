import { Redx_Config } from "src/types/config.js";
import {
  RedxCreateOrder,
  ErrorResponse,
  RedxResponse,
  RedxUpdateOrder,
  RedxStoreResponse,
  RedxTrackByidResponse,
  RedxTrackByid,
  RedxAreaResponse,
} from "src/types/redx.js";

class Redx {
  private config: Redx_Config;
  private baseUrl: string;

  constructor(config: Redx_Config, environment: "production" | "development") {
    this.config = config;
    this.baseUrl =
      environment === "production"
        ? "openapi.redx.com.bd/v1.0.0-beta"
        : "sandbox.redx.com.bd/v1.0.0-beta";
  }

  async createOrder(
    orderData: RedxCreateOrder
  ): Promise<RedxResponse | ErrorResponse> {
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
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async createStore(storeData: {
    name: string;
    address: string;
    phone: string;
    area_id: string;
  }): Promise<RedxStoreResponse | ErrorResponse> {
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
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async trackParcelByTrackingCode(
    trackingCode: string
  ): Promise<RedxTrackByidResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `https://${this.baseUrl}/parcel/track/${trackingCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error Response Body:", errorBody);
        throw new Error(errorBody);
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async getParcelInfoByTrackingCode(
    trackingCode: string
  ): Promise<RedxTrackByid | ErrorResponse> {
    try {
      const response = await fetch(
        `https://${this.baseUrl}/parcel/info/${trackingCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error Response Body:", errorBody);

        throw new Error(errorBody);
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async updateParcel(
    trackingCode: string,
    updateData: object
  ): Promise<RedxUpdateOrder | ErrorResponse> {
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
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }
  async getAreaList(): Promise<RedxAreaResponse[] | ErrorResponse> {
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
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async getAreaByPostcode(
    postcode: string
  ): Promise<RedxAreaResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `https://${this.baseUrl}//areas?post_code=${postcode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error Response Body:", errorBody);
        throw new Error(errorBody);
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async getAreaByDistrictName(
    districtName: string
  ): Promise<RedxAreaResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `https://${this.baseUrl}/areas?district_name=${districtName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error Response Body:", errorBody);
        throw new Error(errorBody);
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async getStores(): Promise<RedxStoreResponse[] | ErrorResponse> {
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
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }
  async getPickupStoreInfo(
    storeId: string
  ): Promise<RedxStoreResponse | ErrorResponse> {
    try {
      const response = await fetch(
        `https://${this.baseUrl}/pickup/store/info/${storeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error Response Body:", errorBody);
        throw new Error(errorBody);
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }

  async calculatePrice(
    orderData:
      | {
          delivery_area_id: number;
          pickup_area_id: number;
          cash_collection_amount: number;
          weight: number;
        }
      | object
  ) {

    try {
      console.log("Request Payload:", orderData);
      const queryParams = new URLSearchParams(orderData as Record<string, string>).toString();
      const response = await fetch(
        `https://${this.baseUrl}/charge/charge_calculator?${queryParams}`,
        {
          method: "GET",
          headers: {
        "API-ACCESS-TOKEN": `Bearer ${this.config.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error Response Body:", errorBody);
        throw new Error(errorBody);
      }

      const data = await response.json();
      return data;
    } catch (error: unknown) {
      return {
        status: 500,
        message: (error as Error)?.message || "An unexpected error occurred",
      } as ErrorResponse;
    }
  }
}

export { Redx };
