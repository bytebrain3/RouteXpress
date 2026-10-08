import type { CarrybeeCreateOrder } from "@/types/carrybee.js";
import {
  collect,
  required,
  bdPhone,
  maxLength,
  minLength,
  positiveInteger,
  oneOf,
} from "@/utils/validation.js";

function validateCarrybeeOrder(order: CarrybeeCreateOrder): string | null {
  if (!order || typeof order !== "object") {
    return "Order data is required";
  }
  return collect(
    required(order.store_id, "Store ID"),
    order.merchant_order_id
      ? maxLength(order.merchant_order_id, 50, "Merchant order ID")
      : null,
    oneOf(order.delivery_type, [1, 2], "Delivery type"),
    oneOf(order.product_type, [1, 2, 3], "Product type"),
    bdPhone(order.recipient_phone, "Recipient phone"),
    order.recipient_secendary_phone
      ? bdPhone(order.recipient_secendary_phone, "Recipient secondary phone")
      : null,
    minLength(order.recipient_name, 2, "Recipient name"),
    maxLength(order.recipient_name, 99, "Recipient name"),
    minLength(order.recipient_address, 10, "Recipient address"),
    maxLength(order.recipient_address, 200, "Recipient address"),
    order.city_id !== undefined
      ? positiveInteger(order.city_id, "City ID")
      : null,
    order.zone_id !== undefined
      ? positiveInteger(order.zone_id, "Zone ID")
      : null,
    order.area_id !== undefined
      ? positiveInteger(order.area_id, "Area ID")
      : null,
    order.special_instruction
      ? maxLength(order.special_instruction, 255, "Special instruction")
      : null,
    order.product_description
      ? maxLength(order.product_description, 255, "Product description")
      : null,
    positiveInteger(order.item_weight, "Item weight"),
    order.item_quantity !== undefined
      ? positiveInteger(order.item_quantity, "Item quantity")
      : null,
    order.collectable_amount !== undefined
      ? (() => {
          const msg = required(order.collectable_amount, "Collectable amount");
          if (msg) return msg;
          const num = Number(order.collectable_amount);
          if (Number.isNaN(num) || num < 0 || num > 100000) {
            return "Collectable amount must be between 0 and 100000";
          }
          return null;
        })()
      : null,
  );
}

export { validateCarrybeeOrder };
