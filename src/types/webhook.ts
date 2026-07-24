// ==================== Steadfast Webhook Types ====================

export type SteadfastNotificationType = "delivery_status" | "tracking_update";

/**
 * Steadfast delivery status webhook payload.
 *
 * @example
 * ```json
 * {
 *   "notification_type": "delivery_status",
 *   "consignment_id": 12345,
 *   "invoice": "INV-67890",
 *   "cod_amount": 1500.00,
 *   "status": "delivered",
 *   "delivery_charge": 100.00,
 *   "tracking_message": "Your package has been delivered successfully.",
 *   "updated_at": "2025-03-02 12:45:30"
 * }
 * ```
 */
export interface SteadfastDeliveryStatusWebhook {
  notification_type: "delivery_status";
  consignment_id: number;
  invoice: string;
  cod_amount: number;
  status:
    | "pending"
    | "delivered"
    | "partial_delivered"
    | "cancelled"
    | "unknown";
  delivery_charge: number;
  tracking_message: string;
  updated_at: string;
}

/**
 * Steadfast tracking update webhook payload.
 *
 * @example
 * ```json
 * {
 *   "notification_type": "tracking_update",
 *   "consignment_id": 12345,
 *   "invoice": "INV-67890",
 *   "tracking_message": "Package arrived at the sorting center.",
 *   "updated_at": "2025-03-02 13:15:00"
 * }
 * ```
 */
export interface SteadfastTrackingUpdateWebhook {
  notification_type: "tracking_update";
  consignment_id: number;
  invoice: string;
  tracking_message: string;
  updated_at: string;
}

/**
 * Union type for all Steadfast webhook payloads.
 * Use `notification_type` to discriminate between variants.
 */
export type SteadfastWebhookPayload =
  | SteadfastDeliveryStatusWebhook
  | SteadfastTrackingUpdateWebhook;

// ==================== Pathao Webhook Types ====================

/**
 * All possible Pathao webhook event types.
 */
export type PathaoWebhookEvent =
  | "webhook_integration"
  | "order.created"
  | "order.updated"
  | "order.pickup-requested"
  | "order.assigned-for-pickup"
  | "order.picked"
  | "order.pickup-failed"
  | "order.pickup-cancelled"
  | "order.at-sorting-hub"
  | "order.in-transit"
  | "order.received-at-last-mile-hub"
  | "order.assigned-for-delivery"
  | "order.delivered"
  | "order.partial-delivery"
  | "order.returned"
  | "order.delivery-failed"
  | "order.on-hold"
  | "order.paid"
  | "order.paid-return"
  | "order.exchanged"
  | "order.return-id-created"
  | "order.return-in-transit"
  | "order.returned-to-merchant";

/**
 * Base fields present in all Pathao webhook payloads.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:49:43",
 *   "timestamp": "2024-12-27T17:49:43+00:00",
 *   "store_id": 130820,
 *   "event": "order.created",
 *   "delivery_fee": 83.46
 * }
 * ```
 */
export interface PathaoWebhookBase {
  consignment_id: string;
  merchant_order_id: string;
  updated_at: string;
  timestamp: string;
  store_id: number;
  event: PathaoWebhookEvent;
  delivery_fee?: number;
}

/**
 * Fired when a new order is created.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:49:43",
 *   "timestamp": "2024-12-27T17:49:43+00:00",
 *   "store_id": 130820,
 *   "event": "order.created",
 *   "delivery_fee": 83.46
 * }
 * ```
 */
export interface PathaoOrderCreatedWebhook extends PathaoWebhookBase {
  event: "order.created";
  delivery_fee: number;
}

/**
 * Fired when an order is updated.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:50:16",
 *   "timestamp": "2024-12-27T17:50:16+00:00",
 *   "store_id": 130820,
 *   "event": "order.updated",
 *   "delivery_fee": 83.46
 * }
 * ```
 */
export interface PathaoOrderUpdatedWebhook extends PathaoWebhookBase {
  event: "order.updated";
  delivery_fee: number;
}

/**
 * Fired when an order is delivered.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:53:23",
 *   "timestamp": "2024-12-27T17:53:23+00:00",
 *   "store_id": 130820,
 *   "event": "order.delivered",
 *   "collected_amount": 60
 * }
 * ```
 */
export interface PathaoOrderDeliveredWebhook extends PathaoWebhookBase {
  event: "order.delivered";
  collected_amount: number;
}

/**
 * Fired when a partial delivery is made.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:53:45",
 *   "timestamp": "2024-12-27T17:53:45+00:00",
 *   "store_id": 130820,
 *   "event": "order.partial-delivery",
 *   "collected_amount": 60,
 *   "reason": "This field might not be present in some cases."
 * }
 * ```
 */
export interface PathaoPartialDeliveryWebhook extends PathaoWebhookBase {
  event: "order.partial-delivery";
  collected_amount: number;
  reason?: string;
}

/**
 * Fired when an order is returned.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:54:02",
 *   "timestamp": "2024-12-27T17:54:02+00:00",
 *   "store_id": 130820,
 *   "event": "order.returned",
 *   "reason": "This field might not be present in some cases."
 * }
 * ```
 */
export interface PathaoOrderReturnedWebhook extends PathaoWebhookBase {
  event: "order.returned";
  reason?: string;
}

/**
 * Fired when a delivery fails.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:54:21",
 *   "timestamp": "2024-12-27T17:54:21+00:00",
 *   "store_id": 130820,
 *   "event": "order.delivery-failed",
 *   "reason": "This field might not be present in some cases."
 * }
 * ```
 */
export interface PathaoDeliveryFailedWebhook extends PathaoWebhookBase {
  event: "order.delivery-failed";
  reason?: string;
}

/**
 * Fired when an order is put on hold.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:54:46",
 *   "timestamp": "2024-12-27T17:54:46+00:00",
 *   "store_id": 130820,
 *   "event": "order.on-hold",
 *   "reason": "This field might not be present in some cases."
 * }
 * ```
 */
export interface PathaoOnHoldWebhook extends PathaoWebhookBase {
  event: "order.on-hold";
  reason?: string;
}

/**
 * Fired when a paid return is processed.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:55:17",
 *   "timestamp": "2024-12-27T17:55:17+00:00",
 *   "store_id": 130820,
 *   "event": "order.paid-return",
 *   "collected_amount": 60,
 *   "reason": "This field might not be present in some cases."
 * }
 * ```
 */
export interface PathaoPaidReturnWebhook extends PathaoWebhookBase {
  event: "order.paid-return";
  collected_amount: number;
  reason?: string;
}

/**
 * Fired when an exchange is processed.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:55:34",
 *   "timestamp": "2024-12-27T17:55:34+00:00",
 *   "store_id": 130820,
 *   "event": "order.exchanged",
 *   "reason": "This field might not be present in some cases.",
 *   "collected_amount": 60
 * }
 * ```
 */
export interface PathaoExchangeWebhook extends PathaoWebhookBase {
  event: "order.exchanged";
  reason?: string;
  collected_amount: number;
}

/**
 * Fired when a payment invoice is generated.
 *
 * @example
 * ```json
 * {
 *   "consignment_id": "DL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "updated_at": "2024-12-27 23:55:01",
 *   "timestamp": "2024-12-27T17:55:01+00:00",
 *   "store_id": 130820,
 *   "event": "order.paid",
 *   "invoice_id": "121224IBW19790"
 * }
 * ```
 */
export interface PathaoPaymentInvoiceWebhook extends PathaoWebhookBase {
  event: "order.paid";
  invoice_id: string;
}

/**
 * Fired when a return consignment ID is created.
 *
 * @example
 * ```json
 * {
 *   "event": "order.return-id-created",
 *   "consignment_id": "DL121224VS8TTJ",
 *   "return_consignment_id": "RL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "store_id": 130820,
 *   "collected_amount": 60,
 *   "return_type": "return",
 *   "reason": "This field might not be present in some cases.",
 *   "updated_at": "2024-12-27 23:55:34",
 *   "timestamp": "2024-12-27T17:55:34+00:00"
 * }
 * ```
 */
export interface PathaoReturnIdCreatedWebhook extends PathaoWebhookBase {
  event: "order.return-id-created";
  return_consignment_id: string;
  collected_amount: number;
  return_type: "return" | "paid-return" | "exchange" | "partial-delivery";
  reason?: string;
}

/**
 * Fired when a return is in transit.
 *
 * @example
 * ```json
 * {
 *   "event": "order.return-in-transit",
 *   "consignment_id": "DL121224VS8TTJ",
 *   "return_consignment_id": "RL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "store_id": 130820,
 *   "collected_amount": 60,
 *   "return_type": "return",
 *   "reason": "This field might not be present in some cases.",
 *   "updated_at": "2024-12-27 23:55:34",
 *   "timestamp": "2024-12-27T17:55:34+00:00"
 * }
 * ```
 */
export interface PathaoReturnInTransitWebhook extends PathaoWebhookBase {
  event: "order.return-in-transit";
  return_consignment_id: string;
  collected_amount: number;
  return_type: "return" | "paid-return" | "exchange" | "partial-delivery";
  reason?: string;
}

/**
 * Fired when a return is delivered back to the merchant.
 *
 * @example
 * ```json
 * {
 *   "event": "order.returned-to-merchant",
 *   "consignment_id": "DL121224VS8TTJ",
 *   "return_consignment_id": "RL121224VS8TTJ",
 *   "merchant_order_id": "TS-123",
 *   "store_id": 130820,
 *   "collected_amount": 60,
 *   "return_type": "return",
 *   "reason": "This field might not be present in some cases.",
 *   "updated_at": "2024-12-27 23:55:34",
 *   "timestamp": "2024-12-27T17:55:34+00:00"
 * }
 * ```
 */
export interface PathaoReturnedToMerchantWebhook extends PathaoWebhookBase {
  event: "order.returned-to-merchant";
  return_consignment_id: string;
  collected_amount: number;
  return_type: "return" | "paid-return" | "exchange" | "partial-delivery";
  reason?: string;
}

/**
 * Union type for all Pathao webhook payloads.
 * Use `event` to discriminate between variants.
 */
export type PathaoWebhookPayload =
  | PathaoWebhookBase
  | PathaoOrderCreatedWebhook
  | PathaoOrderUpdatedWebhook
  | PathaoOrderDeliveredWebhook
  | PathaoPartialDeliveryWebhook
  | PathaoOrderReturnedWebhook
  | PathaoDeliveryFailedWebhook
  | PathaoOnHoldWebhook
  | PathaoPaidReturnWebhook
  | PathaoExchangeWebhook
  | PathaoPaymentInvoiceWebhook
  | PathaoReturnIdCreatedWebhook
  | PathaoReturnInTransitWebhook
  | PathaoReturnedToMerchantWebhook;

// ==================== RedX Webhook Types ====================

/**
 * All possible RedX webhook status values.
 *
 * | Status | Meaning |
 * |---|---|
 * | ready-for-delivery | Parcel received from merchants |
 * | delivery-in-progress | Parcels have been dispatched to rider |
 * | delivered | Parcels delivered by rider |
 * | agent-hold | Parcels are on hold to agent |
 * | agent-returning | Parcel return-in-progress |
 * | returned | Parcels returned |
 * | agent-area-change | Area change requested & in progress |
 */
export type RedXWebhookStatus =
  | "ready-for-delivery"
  | "delivery-in-progress"
  | "delivered"
  | "agent-hold"
  | "agent-returning"
  | "returned"
  | "agent-area-change";

/**
 * RedX delivery type reference.
 *
 * | Type | Meaning |
 * |---|---|
 * | regular | Regular forward delivery |
 * | reverse | Regular reverse delivery |
 * | exchange-delivery | Forward exchange parcel |
 * | exchange-return | Reverse exchange parcel |
 * | partial-delivery | Partial delivery parcel |
 * | partial-return | Partial return parcel |
 */
export type RedXDeliveryType =
  | "regular"
  | "reverse"
  | "exchange-delivery"
  | "exchange-return"
  | "partial-delivery"
  | "partial-return";

/**
 * RedX webhook payload sent on parcel status changes.
 *
 * @example
 * ```json
 * {
 *   "tracking_number": "21A427TU4BN3R",
 *   "timestamp": "2025-03-02T12:45:30.000Z",
 *   "status": "delivered",
 *   "message_en": "Package is delivered successfully",
 *   "message_bn": "পার্সেলটি সফলভাবে ডেলিভারি করা হয়েছে",
 *   "invoice_number": "INV-67890",
 *   "delivery_type": "regular"
 * }
 * ```
 */
export interface RedXWebhookPayload {
  tracking_number: string;
  timestamp: string;
  status: RedXWebhookStatus;
  message_en: string;
  message_bn: string;
  invoice_number: string;
  delivery_type: RedXDeliveryType;
}

// ==================== Common Webhook Types ====================

/**
 * Result of webhook verification.
 *
 * @example
 * ```json
 * { "valid": true }
 * ```
 * or
 * ```json
 * { "valid": false, "error": "Invalid API secret" }
 * ```
 */
export interface WebhookVerifyResult {
  valid: boolean;
  error?: string;
}

/**
 * Result of webhook parsing.
 *
 * @example
 * ```json
 * { "success": true, "data": { ... } }
 * ```
 * or
 * ```json
 * { "success": false, "error": "Missing event field" }
 * ```
 */
export interface WebhookParseResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
