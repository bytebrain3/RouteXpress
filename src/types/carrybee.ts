interface CarrybeeCreateOrder {
  store_id: string;
  merchant_order_id?: string;
  delivery_type: number;
  product_type: number;
  recipient_phone: string;
  recipient_secendary_phone?: string;
  recipient_name: string;
  recipient_address: string;
  city_id?: number;
  zone_id?: number;
  area_id?: number;
  special_instruction?: string;
  product_description?: string;
  item_weight: number;
  item_quantity?: number;
  collectable_amount?: number;
  is_closed_box?: boolean;
  is_exchange?: boolean;
}

interface CarrybeeBulkOrder {
  orders: CarrybeeCreateOrder[];
}

interface CarrybeeOrderResponse {
  order: {
    consignment_id: string;
    store_id: string;
    merchant_order_id: string;
    collectable_amount: string;
    cod_fee: number;
    delivery_fee: string;
  };
}

interface CarrybeeBulkResponse {
  error: boolean;
  message: string;
  data: null;
}

interface CarrybeeOrderDetails {
  transfer_status: string;
  store_id: string;
  consignment_id: string;
  merchant_order_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_secondary_phone: string;
  recipient_address: string;
  collectable_amount: string;
  collected_amount: string;
  cod_fee: number;
  delivery_fee: string;
  attempt: number;
  reason: string;
  invoice_id: string;
  payment_status: string;
  updated_at: string;
}

interface CarrybeeCancelResponse {
  error: boolean;
  message: string;
  data: null;
}

interface CarrybeeCity {
  id: number;
  name: string;
}

interface CarrybeeZone {
  id: number;
  name: string;
  city_id: number;
}

interface CarrybeeArea {
  id: number;
  name: string;
  zone_id: number;
}

interface CarrybeeAreaSuggestion {
  city_id: number;
  city_name: string;
  zone_id: number;
  zone_name: string;
  area_id: number;
  area_name: string;
}

interface CarrybeeAddressDetails {
  city_id: number;
  zone_id: number;
}

interface CarrybeeStore {
  id: string;
  name: string;
  contact_person_name: string;
  contact_person_number: string;
  address: string;
  city_id: number;
  zone_id: number;
  area_id: number;
  is_active: boolean;
  is_approved: boolean;
  is_default_pickup_store: boolean;
  is_default_return_store: boolean;
  pending_count: number;
}

interface CarrybeeStoreResponse {
  error: boolean;
  message: string;
  data: null;
}

interface CarrybeeReversePickupResponse {
  consignment_id: string;
  store_id: string;
  merchant_order_id: string;
  delivery_fee: string;
}

interface CarrybeeExchangeResponse {
  order: {
    consignment_id: string;
    store_id: string;
    merchant_order_id: string;
    collectable_amount: string;
    cod_fee: number;
    delivery_fee: string;
  };
}

interface CarrybeeCreateStore {
  name: string;
  contact_person_name: string;
  contact_person_number: string;
  contact_person_secondary_number?: string;
  address: string;
  city_id: number;
  zone_id: number;
  area_id: number;
  lat?: number;
  lng?: number;
}

interface CarrybeeReversePickup {
  store_id: string;
  merchant_order_id?: string;
  product_type: number;
  customer_phone: string;
  customer_secondary_phone?: string;
  customer_name: string;
  customer_address: string;
  city_id: number;
  zone_id: number;
  area_id?: number;
  item_weight: number;
  item_quantity?: number;
  product_value?: number;
  product_description?: string;
  special_instruction?: string;
}

interface CarrybeeExchange {
  merchant_order_id?: string;
  collectable_amount?: number;
  item_quantity?: number;
  item_weight?: number;
  product_description?: string;
  special_instruction?: string;
}

export {
  CarrybeeCreateOrder,
  CarrybeeBulkOrder,
  CarrybeeOrderResponse,
  CarrybeeBulkResponse,
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
};

export type { ErrorResponse } from "@/utils/errors.js";
