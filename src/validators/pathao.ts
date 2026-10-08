import type {
  PathaoStore,
  CreatePathaoOrder,
  Bulk_Order_For_Pathao,
} from "@/types/pathao.js";
import {
  collect,
  required,
  bdPhone,
  minLength,
  nonNegativeNumber,
  positiveInteger,
  oneOf,
} from "@/utils/validation.js";

function validatePathaoStore(store: PathaoStore): string | null {
  if (!store || typeof store !== "object") {
    return "Store data is required";
  }

  const sameContact =
    store.contact_number &&
    store.secondary_contact &&
    store.contact_number === store.secondary_contact;

  return collect(
    required(store.name, "Store name"),
    required(store.contact_name, "Contact name"),
    bdPhone(store.contact_number, "Contact number"),
    required(store.address, "Address"),
    positiveInteger(store.city_id, "City ID"),
    positiveInteger(store.zone_id, "Zone ID"),
    positiveInteger(store.area_id, "Area ID"),
    store.secondary_contact
      ? bdPhone(store.secondary_contact, "Secondary contact number")
      : null,
    sameContact
      ? "Contact number and secondary contact number cannot be the same"
      : null,
  );
}

function validateOrderFields(order: {
  store_id?: number;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  recipient_city?: number;
  recipient_zone?: number;
  recipient_area?: number;
  delivery_type?: number;
  item_type?: number;
  item_quantity?: number;
  item_weight?: number;
  amount_to_collect?: number;
  merchant_order_id?: string;
}, label = ""): string | null {
  const prefix = label ? `${label} ` : "";
  const weight = Number(order.item_weight);

  const weightError = (() => {
    if (order.item_weight === undefined || order.item_weight === null) {
      return `${prefix}Item weight is required and must be between 0.5 and 10 kg`;
    }
    if (Number.isNaN(weight) || weight < 0.5 || weight > 10) {
      return `${prefix}Item weight must be between 0.5 and 10 kg`;
    }
    return null;
  })();

  return collect(
    positiveInteger(order.store_id, `${prefix}Store ID`),
    required(order.recipient_name, `${prefix}Recipient name`),
    bdPhone(order.recipient_phone, `${prefix}Recipient phone`),
    required(order.recipient_address, `${prefix}Recipient address`),
    minLength(order.recipient_address, 10, `${prefix}Recipient address`),
    positiveInteger(order.recipient_city, `${prefix}Recipient city`),
    positiveInteger(order.recipient_zone, `${prefix}Recipient zone`),
    order.recipient_area
      ? positiveInteger(order.recipient_area, `${prefix}Recipient area`)
      : null,
    oneOf(order.delivery_type, [48, 12], `${prefix}Delivery type`),
    oneOf(order.item_type, [1, 2], `${prefix}Item type`),
    positiveInteger(order.item_quantity, `${prefix}Item quantity`),
    weightError,
    order.amount_to_collect === undefined || order.amount_to_collect === null
      ? `${prefix}Amount to collect is required and must be a non-negative value`
      : nonNegativeNumber(order.amount_to_collect, `${prefix}Amount to collect`),
    order.merchant_order_id
      ? required(order.merchant_order_id, `${prefix}Merchant order ID`)
      : null,
  );
}

function validatePathaoOrder(order: CreatePathaoOrder): string | null {
  if (!order || typeof order !== "object") {
    return "Order data is required";
  }
  return validateOrderFields(order);
}

function validatePathaoBulkOrder(
  bulk: Bulk_Order_For_Pathao,
): string | null {
  if (!bulk || !bulk.orders || !bulk.authToken) {
    return "Order data, orders array, and auth token are required";
  }
  if (!Array.isArray(bulk.orders) || bulk.orders.length === 0) {
    return "Orders must be a non-empty array of order objects";
  }
  for (let i = 0; i < bulk.orders.length; i++) {
    const error = validateOrderFields(bulk.orders[i], `Order ${i + 1}:`);
    if (error) return error;
  }
  return null;
}

export { validatePathaoStore, validatePathaoOrder, validatePathaoBulkOrder };
