import { Order_Data_For_Steadfast, Bulk_Order_For_Steadfast, Bulk_Order_Response_For_Steadfast, ErrorResponse, Create_Order_Response_Items_For_Steadfast, Delivery_Status_Response, Balance_Response, Return_Request, Create_Return_Request_Params, Payment, Police_Station } from "../../types/steadfast.js";
import { Steadfast_Config } from "../../types/config.js";
declare class Steadfast {
    private config;
    private baseUrl;
    constructor(config: Steadfast_Config);
    private validator;
    /**
     * Create a new order on Steadfast.
     *
     * @param orderData - The order details including recipient info and COD amount.
     * @returns The created order with consignment and tracking info, or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.createOrder({
     *   order_details: {
     *     invoice: "INV-001",
     *     recipient_name: "John Doe",
     *     recipient_phone: "01712345678",
     *     recipient_address: "123 Main St, Dhaka",
     *     cod_amount: 1500,
     *     note: "Handle with care",
     *   },
     * });
     * //=> { invoice: "INV-001", consignment_id: 12345, tracking_code: "SF123456", status: "pending", ... }
     * ```
     */
    createOrder(orderData: Order_Data_For_Steadfast): Promise<Create_Order_Response_Items_For_Steadfast | ErrorResponse>;
    /**
     * Create multiple orders in a single request (max 500).
     *
     * @param bulkOrder - Object containing an array of order items.
     * @returns Bulk order response with per-order status, or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.createBulkOrder({
     *   orders: [
     *     {
     *       invoice: "INV-001",
     *       recipient_name: "John Doe",
     *       recipient_phone: "01712345678",
     *       recipient_address: "123 Main St, Dhaka",
     *       cod_amount: 1500,
     *     },
     *     {
     *       invoice: "INV-002",
     *       recipient_name: "Jane Smith",
     *       recipient_phone: "01812345678",
     *       recipient_address: "456 Oak Ave, Chittagong",
     *       cod_amount: 2000,
     *     },
     *   ],
     * });
     * //=> { data: [{ invoice: "INV-001", status: "success", tracking_code: "SF123" }, ...] }
     * ```
     */
    createBulkOrder(bulkOrder: Bulk_Order_For_Steadfast): Promise<Bulk_Order_Response_For_Steadfast | ErrorResponse>;
    /**
     * Get delivery status by consignment ID.
     *
     * @param cid - The consignment ID.
     * @returns Current delivery status or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.getStatusByCid("12345");
     * //=> { status: 200, delivery_status: "delivered" }
     * ```
     */
    getStatusByCid(cid: string): Promise<Delivery_Status_Response | ErrorResponse>;
    /**
     * Get delivery status by invoice number.
     *
     * @param invoice - The invoice number.
     * @returns Current delivery status or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.getStatusByInvoice("INV-001");
     * //=> { status: 200, delivery_status: "in_transit" }
     * ```
     */
    getStatusByInvoice(invoice: string): Promise<Delivery_Status_Response | ErrorResponse>;
    /**
     * Get delivery status by tracking code.
     *
     * @param trackingcode - The tracking code.
     * @returns Current delivery status or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.statusBytrackingcode("SF123456");
     * //=> { status: 200, delivery_status: "delivered" }
     * ```
     */
    statusBytrackingcode(trackingcode: string): Promise<Delivery_Status_Response | ErrorResponse>;
    /**
     * Get the current balance of the Steadfast account.
     *
     * @returns Balance info or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.getBalance();
     * //=> { status: 200, current_balance: 5000.00 }
     * ```
     */
    getBalance(): Promise<Balance_Response | ErrorResponse>;
    /**
     * Create a return request for a consignment.
     *
     * @param params - At least one of `consignment_id`, `invoice`, or `tracking_code` is required.
     * @returns The created return request or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.createReturnRequest({
     *   consignment_id: 12345,
     *   reason: "Customer not available",
     * });
     * //=> { id: 1, consignment_id: 12345, status: "pending", ... }
     * ```
     */
    createReturnRequest(params: Create_Return_Request_Params): Promise<Return_Request | ErrorResponse>;
    /**
     * Get a single return request by ID.
     *
     * @param id - The return request ID.
     * @returns Return request details or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.getReturnRequest(1);
     * //=> { id: 1, consignment_id: 12345, status: "approved", ... }
     * ```
     */
    getReturnRequest(id: number): Promise<Return_Request | ErrorResponse>;
    /**
     * Get all return requests.
     *
     * @returns Array of return requests or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.getReturnRequests();
     * //=> [{ id: 1, consignment_id: 12345, status: "pending" }, ...]
     * ```
     */
    getReturnRequests(): Promise<Return_Request[] | ErrorResponse>;
    /**
     * Get all payments.
     *
     * @returns Array of payments or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.getPayments();
     * //=> [{ id: 1, amount: 5000, status: "completed", consignments: [...] }, ...]
     * ```
     */
    getPayments(): Promise<Payment[] | ErrorResponse>;
    /**
     * Get a single payment with its consignments.
     *
     * @param paymentId - The payment ID.
     * @returns Payment details or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.getSinglePayment(1);
     * //=> { id: 1, amount: 5000, status: "completed", consignments: [...] }
     * ```
     */
    getSinglePayment(paymentId: number): Promise<Payment | ErrorResponse>;
    /**
     * Get all police stations for address validation.
     *
     * @returns Array of police stations or an error.
     *
     * @example
     * ```ts
     * const result = await steadfast.getPoliceStations();
     * //=> [{ id: 1, name: "Dhanmondi", district_id: 1, division_id: 1 }, ...]
     * ```
     */
    getPoliceStations(): Promise<Police_Station[] | ErrorResponse>;
}
export { Steadfast };
