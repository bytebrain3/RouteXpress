import type {
  Order_Data_For_Steadfast,
  Bulk_Order_For_Steadfast,
} from "@/types/steadfast.js";
import {
  collect,
  required,
  bdPhone,
  maxLength,
  nonNegativeNumber,
} from "@/utils/validation.js";

function validateOrderDetails(details: {
  invoice?: string;
  recipient_name?: string;
  recipient_phone?: string;
  alternative_phone?: string;
  recipient_email?: string;
  recipient_address?: string;
  cod_amount?: number;
}): string | null {
  return collect(
    required(details.invoice, "Invoice"),
    required(details.recipient_name, "Recipient name"),
    maxLength(details.recipient_name, 100, "Recipient name"),
    bdPhone(details.recipient_phone, "Customer phone number"),
    details.alternative_phone
      ? bdPhone(details.alternative_phone, "Alternative phone number")
      : null,
    required(details.recipient_address, "Recipient address"),
    maxLength(details.recipient_address, 250, "Recipient address"),
    nonNegativeNumber(details.cod_amount, "Cash on delivery amount"),
  );
}

function validateSteadfastOrder(
  order: Order_Data_For_Steadfast,
): string | null {
  if (!order || typeof order !== "object" || !order.order_details) {
    return "order_details is required";
  }
  return validateOrderDetails(order.order_details);
}

function validateSteadfastBulkOrder(
  bulk: Bulk_Order_For_Steadfast,
): string | null {
  if (!bulk || !Array.isArray(bulk.orders)) {
    return "orders must be an array";
  }
  if (bulk.orders.length === 0) {
    return "orders cannot be empty";
  }
  if (bulk.orders.length > 500) {
    return "orders cannot contain more than 500 items";
  }
  for (let i = 0; i < bulk.orders.length; i++) {
    const error = validateOrderDetails(bulk.orders[i]);
    if (error) return `Order ${i + 1}: ${error}`;
  }
  return null;
}

export { validateSteadfastOrder, validateSteadfastBulkOrder };
