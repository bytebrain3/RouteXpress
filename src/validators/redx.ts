import type { RedxCreateOrder } from "@/types/redx.js";
import {
  collect,
  required,
  bdPhone,
  nonNegativeNumber,
  positiveInteger,
} from "@/utils/validation.js";

function validateRedxOrder(order: RedxCreateOrder): string | null {
  if (!order || typeof order !== "object") {
    return "Order data is required";
  }
  return collect(
    required(order.customer_name, "Customer name"),
    bdPhone(order.customer_phone, "Customer phone"),
    required(order.delivery_area, "Delivery area"),
    positiveInteger(order.delivery_area_id, "Delivery area ID"),
    required(order.customer_address, "Customer address"),
    nonNegativeNumber(order.cash_collection_amount, "Cash collection amount"),
    required(order.parcel_weight, "Parcel weight"),
    required(order.value, "Value"),
    order.merchant_invoice_id
      ? required(order.merchant_invoice_id, "Merchant invoice ID")
      : null,
    order.pickup_store_id
      ? required(order.pickup_store_id, "Pickup store ID")
      : null,
  );
}

export { validateRedxOrder };
