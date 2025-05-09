interface TookenIssueResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

interface ErrorResponse {
  status: number;
  message: string;
  code?: number;
  error?: string;
}

interface PathaoStore {
  name: string;
  contact_name: string;
  contact_number: string;
  secondary_contact?: string;
  address: string;
  city_id: number;
  zone_id: number;
  area_id: number;
}

interface PathaoStoreResponse {
  message: string;
  type: string;
  code: number;
  data: {
    store_name: string;
  };
}

interface CreatePathaoOrderResponse {
  message: string;
  type: string;
  code: number;
  data: {
    consignment_id: string;
    merchant_order_id: string;
    order_status: string;
    delivery_fee: number;
  };
}

interface CreatePathaoOrder {
  authToken: string;
  store_id: number;
  merchant_order_id?: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: number;
  recipient_zone: number;
  recipient_area?: number;
  delivery_type: number;
  item_type: number;
  special_instruction?: string;
  item_quantity: number;
  item_weight: number;
  item_description?: string;
  amount_to_collect: number;
}

interface PathaoOrderItem {
  store_id: number;
  merchant_order_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: number;
  recipient_zone: number;
  recipient_area: number;
  delivery_type: number;
  item_type: number;
  special_instruction?: string;
  item_quantity: number;
  item_weight: number;
  item_description?: string;
  amount_to_collect: number;
}

interface Bulk_Order_For_Pathao {
  authToken: string;
  orders: PathaoOrderItem[];
}

interface Bulk_Order_For_Pathao_Response {
  message: string;
  type: string;
  code: number;
  data: boolean;
  error?: string;
}
interface PathaoCityResponse {
  message: string;
  type: string;
  code: number;
  data: {
    data: {
      city_id: number;
      city_name: string;
    }[];
  };
}
interface PathaoZoneResponse {
  message: string;
  type: string;
  code: number;
  data: {
    data: {
      zone_id: number;
      zone_name: string;
    }[];
  };
}
interface PathaoAreaResponse {
  message: string;
  type: string;
  code: number;
  data: {
    data: {
      area_id: number;
      area_name: string;
      home_delivery_available: boolean;
      pickup_available: boolean;
    }[];
  };
}

interface PathaoPriceResponse {
  message: string;
  type: string;
  code: number;
  data: {
    price: number;
    discount: number;
    promo_discount: number;
    plan_id: number;
    cod_enabled: number;
    cod_percentage: number;
    additional_charge: number;
    final_price: number;
  };
}

interface PathaoOrderPiceData {
  store_id: number; // Store ID provided by the merchant
  item_type: number; // 1 for Document, 2 for Parcel
  delivery_type: number; // 48 for Normal Delivery, 12 for On Demand Delivery
  item_weight: number; // Weight of the parcel in kg (0.5 to 10 kg)
  recipient_city: number; // Parcel receiver's city_id
  recipient_zone: number; // Parcel receiver's zone_id
}

interface PathaoAllStoreResponse {
  message: string;
  type: string;
  code: number;
  data: {
    data: {
      store_id: string;
      store_name: string;
      store_address: string;
      is_active: number;
      city_id: string;
      zone_id: string;
      hub_id: string;
      is_default_store: boolean;
      is_default_return_store: boolean;
    }[];
    total: number;
    current_page: number;
    per_page: number;
    total_in_page: number;
    last_page: number;
    path: string;
    to: number;
    from: number;
    last_page_url: string;
    first_page_url: string;
  };
}

export {
  TookenIssueResponse,
  ErrorResponse,
  PathaoStore,
  PathaoStoreResponse,
  PathaoAllStoreResponse,
  CreatePathaoOrder,
  CreatePathaoOrderResponse,
  Bulk_Order_For_Pathao_Response,
  Bulk_Order_For_Pathao,
  PathaoCityResponse,
  PathaoZoneResponse,
  PathaoAreaResponse,
  PathaoPriceResponse,
  PathaoOrderPiceData,
};
