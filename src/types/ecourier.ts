interface EcourierConfig {
  apiKey: string;
  apiSecret: string;
  userId: string;
  environment: "production" | "sandbox";
}

interface EcourierCreateOrder {
  recipient_name: string;
  recipient_mobile: string;
  recipient_city: string;
  recipient_thana: string;
  recipient_area: string;
  recipient_address: string;
  package_code: string;
  product_price: number;
  payment_method: string;
  recipient_zip: string;
  parcel_type?: string;
  requested_delivery_time?: string;
  product_id?: string;
  pick_address?: string;
  pick_hub?: number;
  comments?: string;
  number_of_item?: number;
  actual_product_price?: number;
  special_instruction?: string;
  pgwid?: string;
  pgwtxn_id?: string;
}

interface EcourierOrderResponse {
  errors: string[];
  response_code: number;
  message: string;
  ID: string;
}

interface EcourierTrackingData {
  status: string[][];
  REFID: string;
  company: string;
  product_id: string;
  r_name: string;
  r_mobile: string;
  r_address: string;
  r_area: string;
  r_type: string;
  r_time: string;
  agent: string;
  paymentmethod: string;
  paymentclear: string;
  r_timing: string;
  r_coverage: string;
  r_weight: string;
  product_price: string;
  shipping_price: string;
  cod: number;
}

interface EcourierTrackingResponse {
  response_code: number;
  message: string;
  query_data: string | EcourierTrackingData[];
}

interface EcourierCancelResponse {
  success: string;
  message: string;
}

interface EcourierPackage {
  package_name: string;
  package_code: string;
  shipping_charge: string;
  weight: string;
  delivery_time: string;
  coverage_id: string;
  coverage: string;
}

interface EcourierFraudCheckResponse {
  success: boolean;
  response_code: number;
  customer_status: string;
  message: string[];
}

interface EcourierCity {
  name: string;
  value: string;
}

interface EcourierThana {
  name: string;
  value: string;
}

interface EcourierBranch {
  name: string;
  value: number;
}

interface EcourierPaymentStatus {
  success: boolean;
  message: string;
}

export {
  EcourierConfig,
  EcourierCreateOrder,
  EcourierOrderResponse,
  EcourierTrackingData,
  EcourierTrackingResponse,
  EcourierCancelResponse,
  EcourierPackage,
  EcourierFraudCheckResponse,
  EcourierCity,
  EcourierThana,
  EcourierBranch,
  EcourierPaymentStatus,
};

export type { ErrorResponse } from "@/utils/errors.js";
