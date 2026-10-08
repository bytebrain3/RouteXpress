import type { PaperflyCreateOrder } from "@/types/paperfly.js";
import { collect, required, bdPhone } from "@/utils/validation.js";

function validatePaperflyOrder(order: PaperflyCreateOrder): string | null {
  if (!order || typeof order !== "object") {
    return "Order data is required";
  }
  return collect(
    required(order.merchantOrderReference, "Merchant order reference"),
    required(order.storeName, "Store name"),
    required(order.productBrief, "Product brief"),
    required(order.packagePrice, "Package price"),
    required(order.max_weight, "Max weight"),
    required(order.customerName, "Customer name"),
    required(order.customerAddress, "Customer address"),
    bdPhone(order.customerPhone, "Customer phone"),
  );
}

export { validatePaperflyOrder };
