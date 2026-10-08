import { validateSteadfastOrder, validateSteadfastBulkOrder } from "../dist/validators/steadfast.js";
import { validatePathaoStore, validatePathaoOrder, validatePathaoBulkOrder } from "../dist/validators/pathao.js";
import { validateRedxOrder } from "../dist/validators/redx.js";
import { validateCarrybeeOrder } from "../dist/validators/carrybee.js";

let passed = 0;
let failed = 0;

function check(name: string, actual: string | null, expected: string | null | RegExp) {
  let ok: boolean;
  if (expected === null) {
    ok = actual === null;
  } else if (expected instanceof RegExp) {
    ok = actual !== null && expected.test(actual);
  } else {
    ok = actual === expected;
  }
  if (ok) {
    passed++;
    console.log(`  ok - ${name}`);
  } else {
    failed++;
    console.error(`  FAIL - ${name}`);
    console.error(`    expected: ${expected}`);
    console.error(`    actual:   ${actual}`);
  }
}

const validSteadfastOrder = {
  order_details: {
    invoice: "INV001",
    recipient_name: "John Doe",
    recipient_phone: "01712345678",
    recipient_address: "123 Main Street, Dhaka",
    cod_amount: 1000,
  },
};

const validPathaoOrder = {
  store_id: 1,
  recipient_name: "John Doe",
  recipient_phone: "01712345678",
  recipient_address: "123 Main Street, Mirpur, Dhaka",
  recipient_city: 1,
  recipient_zone: 2,
  recipient_area: 3,
  delivery_type: 48,
  item_type: 1,
  item_quantity: 1,
  item_weight: 1,
  amount_to_collect: 1000,
};

const validRedxOrder = {
  customer_name: "John Doe",
  customer_phone: "01712345678",
  delivery_area: "Mirpur DOHS",
  delivery_area_id: 12,
  customer_address: "123 Main St, Mirpur, Dhaka",
  cash_collection_amount: "1500",
  parcel_weight: "500",
  value: "2000",
};

console.log("steadfast: validateSteadfastOrder");
check("valid order passes", validateSteadfastOrder(validSteadfastOrder as never), null);
check("null order rejected", validateSteadfastOrder(null as never), "order_details is required");
check("missing invoice", validateSteadfastOrder({
  order_details: { ...validSteadfastOrder.order_details, invoice: "" },
} as never), "Invoice is required");
check("bad phone", validateSteadfastOrder({
  order_details: { ...validSteadfastOrder.order_details, recipient_phone: "12345" },
} as never), "Customer phone number must be exactly 11 digits");
check("long name", validateSteadfastOrder({
  order_details: { ...validSteadfastOrder.order_details, recipient_name: "x".repeat(101) },
} as never), "Recipient name cannot be greater than 100 characters");
check("long address", validateSteadfastOrder({
  order_details: { ...validSteadfastOrder.order_details, recipient_address: "x".repeat(251) },
} as never), "Recipient address cannot be greater than 250 characters");
check("negative cod", validateSteadfastOrder({
  order_details: { ...validSteadfastOrder.order_details, cod_amount: -1 },
} as never), "Cash on delivery amount cannot be less than 0");
check("bad alternative phone", validateSteadfastOrder({
  order_details: { ...validSteadfastOrder.order_details, alternative_phone: "0171234567" },
} as never), "Alternative phone number must be exactly 11 digits");

console.log("steadfast: validateSteadfastBulkOrder");
check("valid bulk passes", validateSteadfastBulkOrder({ orders: [validSteadfastOrder.order_details] } as never), null);
check("empty orders", validateSteadfastBulkOrder({ orders: [] } as never), "orders cannot be empty");
check("not an array", validateSteadfastBulkOrder({ orders: {} } as never), "orders must be an array");
check("over 500", validateSteadfastBulkOrder({
  orders: Array.from({ length: 501 }, () => validSteadfastOrder.order_details),
} as never), "orders cannot contain more than 500 items");
check("bulk index prefix", validateSteadfastBulkOrder({
  orders: [
    validSteadfastOrder.order_details,
    { ...validSteadfastOrder.order_details, invoice: "" },
  ],
} as never), "Order 2: Invoice is required");

console.log("pathao: validatePathaoStore");
const validStore = {
  name: "My Store",
  contact_name: "John",
  contact_number: "01712345678",
  address: "123 Main St, Dhaka",
  city_id: 1,
  zone_id: 2,
  area_id: 3,
};
check("valid store passes", validatePathaoStore(validStore as never), null);
check("null store rejected", validatePathaoStore(null as never), "Store data is required");
check("bad contact phone", validatePathaoStore({
  ...validStore,
  contact_number: "abc",
} as never), "Contact number must be exactly 11 digits");
check("same secondary contact", validatePathaoStore({
  ...validStore,
  secondary_contact: "01712345678",
} as never), "Contact number and secondary contact number cannot be the same");
check("zero city id", validatePathaoStore({
  ...validStore,
  city_id: 0,
} as never), "City ID must be greater than 0");

console.log("pathao: validatePathaoOrder");
check("valid order passes", validatePathaoOrder(validPathaoOrder as never), null);
check("null order rejected", validatePathaoOrder(null as never), "Order data is required");
check("bad delivery type", validatePathaoOrder({
  ...validPathaoOrder,
  delivery_type: 99,
} as never), "Delivery type must be one of: 48, 12");
check("bad item type", validatePathaoOrder({
  ...validPathaoOrder,
  item_type: 3,
} as never), "Item type must be one of: 1, 2");
check("weight too high", validatePathaoOrder({
  ...validPathaoOrder,
  item_weight: 20,
} as never), "Item weight must be between 0.5 and 10 kg");
check("missing weight", validatePathaoOrder({
  ...validPathaoOrder,
  item_weight: undefined,
} as never), "Item weight is required and must be between 0.5 and 10 kg");
check("short address", validatePathaoOrder({
  ...validPathaoOrder,
  recipient_address: "Short",
} as never), "Recipient address must be at least 10 characters");
check("missing cod", validatePathaoOrder({
  ...validPathaoOrder,
  amount_to_collect: undefined,
} as never), "Amount to collect is required and must be a non-negative value");
check("negative cod", validatePathaoOrder({
  ...validPathaoOrder,
  amount_to_collect: -1,
} as never), "Amount to collect cannot be less than 0");

console.log("pathao: validatePathaoBulkOrder");
check("valid bulk passes", validatePathaoBulkOrder({
  authToken: "token",
  orders: [validPathaoOrder],
} as never), null);
check("missing token", validatePathaoBulkOrder({
  orders: [validPathaoOrder],
} as never), "Order data, orders array, and auth token are required");
check("bulk index prefix", validatePathaoBulkOrder({
  authToken: "token",
  orders: [validPathaoOrder, { ...validPathaoOrder, store_id: 0 }],
} as never), "Order 2: Store ID must be greater than 0");

console.log("redx: validateRedxOrder");
check("valid order passes", validateRedxOrder(validRedxOrder as never), null);
check("null order rejected", validateRedxOrder(null as never), "Order data is required");
check("missing name", validateRedxOrder({
  ...validRedxOrder,
  customer_name: "",
} as never), "Customer name is required");
check("bad phone", validateRedxOrder({
  ...validRedxOrder,
  customer_phone: "0171234567",
} as never), "Customer phone must be exactly 11 digits");
check("zero area id", validateRedxOrder({
  ...validRedxOrder,
  delivery_area_id: 0,
} as never), "Delivery area ID must be greater than 0");
check("negative cod", validateRedxOrder({
  ...validRedxOrder,
  cash_collection_amount: "-10",
} as never), "Cash collection amount cannot be less than 0");
check("missing value", validateRedxOrder({
  ...validRedxOrder,
  value: "",
} as never), "Value is required");

const validCarrybeeOrder = {
  store_id: "store-001",
  merchant_order_id: "order-001",
  delivery_type: 1,
  product_type: 1,
  recipient_phone: "01712345678",
  recipient_name: "John Doe",
  recipient_address: "123 Main Street, Dhaka",
  city_id: 14,
  zone_id: 50,
  area_id: 1676,
  item_weight: 500,
  item_quantity: 1,
  collectable_amount: 1500,
};

console.log("carrybee: validateCarrybeeOrder");
check("valid order passes", validateCarrybeeOrder(validCarrybeeOrder as never), null);
check("null order rejected", validateCarrybeeOrder(null as never), "Order data is required");
check("missing store_id", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  store_id: "",
} as never), "Store ID is required");
check("bad delivery type", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  delivery_type: 3,
} as never), "Delivery type must be one of: 1, 2");
check("bad product type", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  product_type: 5,
} as never), "Product type must be one of: 1, 2, 3");
check("bad phone", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  recipient_phone: "12345",
} as never), "Recipient phone must be exactly 11 digits");
check("short name", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  recipient_name: "A",
} as never), "Recipient name must be at least 2 characters");
check("long name", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  recipient_name: "x".repeat(100),
} as never), "Recipient name cannot be greater than 99 characters");
check("short address", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  recipient_address: "Short",
} as never), "Recipient address must be at least 10 characters");
check("long address", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  recipient_address: "x".repeat(201),
} as never), "Recipient address cannot be greater than 200 characters");
check("zero weight", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  item_weight: 0,
} as never), "Item weight must be greater than 0");
check("negative cod", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  collectable_amount: -1,
} as never), "Collectable amount must be between 0 and 100000");
check("cod too high", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  collectable_amount: 200000,
} as never), "Collectable amount must be between 0 and 100000");
check("long merchant_order_id", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  merchant_order_id: "x".repeat(51),
} as never), "Merchant order ID cannot be greater than 50 characters");
check("long special_instruction", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  special_instruction: "x".repeat(256),
} as never), "Special instruction cannot be greater than 255 characters");
check("bad secondary phone", validateCarrybeeOrder({
  ...validCarrybeeOrder,
  recipient_secendary_phone: "0171234567",
} as never), "Recipient secondary phone must be exactly 11 digits");

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
