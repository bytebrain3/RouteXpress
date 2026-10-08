import { Carrybee_Config } from "@/types/config.js";
import {
  CarrybeeCreateOrder,
  CarrybeeOrderResponse,
  CarrybeeOrderDetails,
  CarrybeeCancelResponse,
  CarrybeeCity,
  CarrybeeZone,
  CarrybeeArea,
  CarrybeeAreaSuggestion,
  CarrybeeAddressDetails,
  CarrybeeStore,
  CarrybeeStoreResponse,
  CarrybeeReversePickupResponse,
  CarrybeeExchangeResponse,
  CarrybeeCreateStore,
  CarrybeeReversePickup,
  CarrybeeExchange,
  CarrybeeBulkOrder,
  CarrybeeBulkResponse,
  ErrorResponse,
} from "@/types/carrybee.js";
import {
  RequestResult,
  validationError,
  apiError,
  unknownError,
} from "@/utils/errors.js";
import { validateCarrybeeOrder } from "@/validators/carrybee.js";

class Carrybee {
  private config: Carrybee_Config;
  private baseUrl: string;

  constructor(config: Carrybee_Config) {
    this.config = config;
    this.baseUrl =
      config.environment === "production"
        ? "https://developers.carrybee.com"
        : "https://sandbox.carrybee.com";
  }

  private async request<T>(
    path: string,
    init?: RequestInit,
  ): Promise<RequestResult<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, init);
      const raw = await response.text();

      if (!response.ok) {
        return { ok: false, error: await apiError(response, raw) };
      }

      if (!raw) {
        return { ok: true, data: {} as T };
      }

      try {
        return { ok: true, data: JSON.parse(raw) as T };
      } catch {
        return {
          ok: false,
          error: {
            status: response.status,
            message: "Invalid JSON response from CarryBee",
          },
        };
      }
    } catch (error) {
      return { ok: false, error: unknownError(error) };
    }
  }

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "Client-ID": this.config.clientId,
      "Client-Secret": this.config.clientSecret,
      "Client-Context": this.config.clientContext,
    };
  }

  async createOrder(
    orderData: CarrybeeCreateOrder,
  ): Promise<CarrybeeOrderResponse | ErrorResponse> {
    const validation = validateCarrybeeOrder(orderData);
    if (validation) {
      return validationError(validation);
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: { order: CarrybeeOrderResponse["order"] };
    }>("/api/v2/orders", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(orderData),
    });
    if (!result.ok) return result.error;
    return { order: result.data.data.order };
  }

  async createBulkOrder(
    bulkOrder: CarrybeeBulkOrder,
  ): Promise<CarrybeeBulkResponse | ErrorResponse> {
    if (!bulkOrder || !bulkOrder.orders || !Array.isArray(bulkOrder.orders)) {
      return validationError("Orders array is required for bulk order");
    }
    if (bulkOrder.orders.length === 0) {
      return validationError("Orders array cannot be empty");
    }

    const result = await this.request<CarrybeeBulkResponse>(
      "/api/v2/orders-bulk",
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(bulkOrder.orders),
      },
    );
    return result.ok ? result.data : result.error;
  }

  async getOrderDetails(
    consignmentId: string,
  ): Promise<CarrybeeOrderDetails | ErrorResponse> {
    if (!consignmentId || consignmentId.length < 3) {
      return validationError("Consignment ID is required (minimum 3 characters)");
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: CarrybeeOrderDetails;
    }>(`/api/v2/orders/${consignmentId}/details`, {
      method: "GET",
      headers: this.headers(),
    });
    if (!result.ok) return result.error;
    return result.data.data;
  }

  async cancelOrder(
    consignmentId: string,
    cancellationReason: string,
  ): Promise<CarrybeeCancelResponse | ErrorResponse> {
    if (!consignmentId) {
      return validationError("Consignment ID is required");
    }
    if (!cancellationReason || cancellationReason.length > 200) {
      return validationError(
        "Cancellation reason is required and must be under 200 characters",
      );
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: null;
    }>(`/api/v2/orders/${consignmentId}/cancel`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ cancellation_reason: cancellationReason }),
    });
    return result.ok ? result.data : result.error;
  }

  async getCities(): Promise<CarrybeeCity[] | ErrorResponse> {
    const result = await this.request<{
      error: boolean;
      message: string;
      data: { cities: CarrybeeCity[] };
    }>("/api/v2/cities", {
      method: "GET",
      headers: this.headers(),
    });
    if (!result.ok) return result.error;
    return result.data.data.cities;
  }

  async getZones(cityId: number): Promise<CarrybeeZone[] | ErrorResponse> {
    if (!cityId) {
      return validationError("City ID is required");
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: { zones: CarrybeeZone[] };
    }>(`/api/v2/cities/${cityId}/zones`, {
      method: "GET",
      headers: this.headers(),
    });
    if (!result.ok) return result.error;
    return result.data.data.zones;
  }

  async getAreas(
    cityId: number,
    zoneId: number,
  ): Promise<CarrybeeArea[] | ErrorResponse> {
    if (!cityId) {
      return validationError("City ID is required");
    }
    if (!zoneId) {
      return validationError("Zone ID is required");
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: { areas: CarrybeeArea[] };
    }>(`/api/v2/cities/${cityId}/zones/${zoneId}/areas`, {
      method: "GET",
      headers: this.headers(),
    });
    if (!result.ok) return result.error;
    return result.data.data.areas;
  }

  async searchAreas(
    search: string,
  ): Promise<CarrybeeAreaSuggestion[] | ErrorResponse> {
    if (!search || search.length < 3) {
      return validationError("Search query must be at least 3 characters");
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: { items: CarrybeeAreaSuggestion[] };
    }>(
      `/api/v2/area-suggestion?search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: this.headers(),
      },
    );
    if (!result.ok) return result.error;
    return result.data.data.items;
  }

  async getAddressDetails(
    query: string,
  ): Promise<CarrybeeAddressDetails | ErrorResponse> {
    if (!query || query.length < 10) {
      return validationError("Address query must be at least 10 characters");
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: CarrybeeAddressDetails;
    }>("/api/v2/address-details", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ query }),
    });
    if (!result.ok) return result.error;
    return result.data.data;
  }

  async createStore(
    storeData: CarrybeeCreateStore,
  ): Promise<CarrybeeStoreResponse | ErrorResponse> {
    if (!storeData) {
      return validationError("Store data is required");
    }
    if (
      !storeData.name ||
      storeData.name.length < 3 ||
      storeData.name.length > 30
    ) {
      return validationError("Store name must be 3-30 characters");
    }
    if (
      !storeData.contact_person_name ||
      storeData.contact_person_name.length < 3 ||
      storeData.contact_person_name.length > 30
    ) {
      return validationError("Contact person name must be 3-30 characters");
    }
    if (!storeData.contact_person_number) {
      return validationError("Contact person number is required");
    }
    if (
      !storeData.address ||
      storeData.address.length < 3 ||
      storeData.address.length > 100
    ) {
      return validationError("Address must be 3-100 characters");
    }
    if (!storeData.city_id) {
      return validationError("City ID is required");
    }
    if (!storeData.zone_id) {
      return validationError("Zone ID is required");
    }
    if (!storeData.area_id) {
      return validationError("Area ID is required");
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: null;
    }>("/api/v2/stores", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(storeData),
    });
    return result.ok ? result.data : result.error;
  }

  async getStores(): Promise<CarrybeeStore[] | ErrorResponse> {
    const result = await this.request<{
      error: boolean;
      message: string;
      data: { stores: CarrybeeStore[] };
    }>("/api/v2/stores", {
      method: "GET",
      headers: this.headers(),
    });
    if (!result.ok) return result.error;
    return result.data.data.stores;
  }

  async createReversePickup(
    pickupData: CarrybeeReversePickup,
  ): Promise<CarrybeeReversePickupResponse | ErrorResponse> {
    if (!pickupData) {
      return validationError("Reverse pickup data is required");
    }
    if (!pickupData.store_id) {
      return validationError("Store ID is required");
    }
    if (!pickupData.product_type) {
      return validationError("Product type is required");
    }
    if (!pickupData.customer_phone) {
      return validationError("Customer phone is required");
    }
    if (!pickupData.customer_name || pickupData.customer_name.length < 2) {
      return validationError("Customer name is required");
    }
    if (
      !pickupData.customer_address ||
      pickupData.customer_address.length < 10
    ) {
      return validationError("Customer address must be at least 10 characters");
    }
    if (!pickupData.city_id) {
      return validationError("City ID is required");
    }
    if (!pickupData.zone_id) {
      return validationError("Zone ID is required");
    }
    if (!pickupData.item_weight) {
      return validationError("Item weight is required");
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: CarrybeeReversePickupResponse;
    }>("/api/v2/orders/reverse-pickup", {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(pickupData),
    });
    if (!result.ok) return result.error;
    return result.data.data;
  }

  async createReversePickupFromOrder(
    consignmentId: string,
    pickupData?: Partial<CarrybeeReversePickup>,
  ): Promise<CarrybeeReversePickupResponse | ErrorResponse> {
    if (!consignmentId) {
      return validationError("Consignment ID is required");
    }

    const body: Record<string, unknown> = {};
    if (pickupData) {
      if (pickupData.store_id) body.store_id = pickupData.store_id;
      if (pickupData.merchant_order_id)
        body.merchant_order_id = pickupData.merchant_order_id;
      if (pickupData.customer_phone)
        body.customer_phone = pickupData.customer_phone;
      if (pickupData.customer_secondary_phone)
        body.customer_secondary_phone = pickupData.customer_secondary_phone;
      if (pickupData.customer_name)
        body.customer_name = pickupData.customer_name;
      if (pickupData.customer_address)
        body.customer_address = pickupData.customer_address;
      if (pickupData.city_id) body.city_id = pickupData.city_id;
      if (pickupData.zone_id) body.zone_id = pickupData.zone_id;
      if (pickupData.area_id) body.area_id = pickupData.area_id;
      if (pickupData.item_weight) body.item_weight = pickupData.item_weight;
      if (pickupData.item_quantity)
        body.item_quantity = pickupData.item_quantity;
      if (pickupData.product_value)
        body.product_value = pickupData.product_value;
      if (pickupData.product_description)
        body.product_description = pickupData.product_description;
      if (pickupData.special_instruction)
        body.special_instruction = pickupData.special_instruction;
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: CarrybeeReversePickupResponse;
    }>(`/api/v2/orders/${consignmentId}/reverse-pickup`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!result.ok) return result.error;
    return result.data.data;
  }

  async createExchange(
    consignmentId: string,
    exchangeData?: CarrybeeExchange,
  ): Promise<CarrybeeExchangeResponse | ErrorResponse> {
    if (!consignmentId) {
      return validationError("Consignment ID is required");
    }

    const body: Record<string, unknown> = {};
    if (exchangeData) {
      if (exchangeData.merchant_order_id)
        body.merchant_order_id = exchangeData.merchant_order_id;
      if (exchangeData.collectable_amount !== undefined)
        body.collectable_amount = exchangeData.collectable_amount;
      if (exchangeData.item_quantity !== undefined)
        body.item_quantity = exchangeData.item_quantity;
      if (exchangeData.item_weight !== undefined)
        body.item_weight = exchangeData.item_weight;
      if (exchangeData.product_description)
        body.product_description = exchangeData.product_description;
      if (exchangeData.special_instruction)
        body.special_instruction = exchangeData.special_instruction;
    }

    const result = await this.request<{
      error: boolean;
      message: string;
      data: { order: CarrybeeExchangeResponse["order"] };
    }>(`/api/v2/orders/${consignmentId}/exchange`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!result.ok) return result.error;
    return { order: result.data.data.order };
  }
}

export { Carrybee };
