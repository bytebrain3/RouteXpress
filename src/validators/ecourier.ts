import type { EcourierCreateOrder } from "@/types/ecourier.js";
import { collect, required, bdPhone, maxLength } from "@/utils/validation.js";

function validateEcourierOrder(order: EcourierCreateOrder): string | null {
  if (!order || typeof order !== "object") {
    return "Order data is required";
  }
  return collect(
    required(order.recipient_name, "Recipient name"),
    maxLength(order.recipient_name, 250, "Recipient name"),
    bdPhone(order.recipient_mobile, "Recipient mobile"),
    required(order.recipient_city, "Recipient city"),
    maxLength(order.recipient_city, 40, "Recipient city"),
    required(order.recipient_thana, "Recipient thana"),
    maxLength(order.recipient_thana, 40, "Recipient thana"),
    required(order.recipient_area, "Recipient area"),
    maxLength(order.recipient_area, 40, "Recipient area"),
    required(order.recipient_address, "Recipient address"),
    maxLength(order.recipient_address, 40, "Recipient address"),
    required(order.package_code, "Package code"),
    required(order.product_price, "Product price"),
    required(order.payment_method, "Payment method"),
    required(order.recipient_zip, "Recipient zip"),
    order.comments ? maxLength(order.comments, 255, "Comments") : null,
  );
}

export { validateEcourierOrder };
