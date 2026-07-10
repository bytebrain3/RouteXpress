interface Order_Details_For_Steadfast {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    alternative_phone?: string;
    recipient_email?: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
    item_description?: string;
    total_lot?: number;
    delivery_type?: number;
}
interface Order_Data_For_Steadfast {
    order_details: Order_Details_For_Steadfast;
}
interface Create_Order_Response_Items_For_Steadfast {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
    consignment_id: number;
    tracking_code: string;
    status: string;
    created_at: string;
    updated_at: string;
}
interface Bulk_Order_Item_For_Steadfast {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    alternative_phone?: string;
    recipient_email?: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
    item_description?: string;
    total_lot?: number;
    delivery_type?: number;
}
interface Bulk_Order_For_Steadfast {
    orders: Bulk_Order_Item_For_Steadfast[];
}
interface Bulk_Order_Response_Items_For_Steadfast {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
    consignment_id: number | null;
    tracking_code: string | null;
    status: "success" | "error";
}
interface Bulk_Order_Response_For_Steadfast {
    status?: number;
    message?: string;
    data: Bulk_Order_Response_Items_For_Steadfast[];
}
interface ErrorResponse {
    status: number;
    message: string;
}
interface Delivery_Status_Response {
    status: number;
    delivery_status: string;
}
interface Balance_Response {
    status: number;
    current_balance: number;
}
interface Return_Request {
    id: number;
    user_id: number;
    consignment_id: number;
    reason: string | null;
    status: "pending" | "approved" | "processing" | "completed" | "cancelled";
    created_at: string;
    updated_at: string;
}
interface Create_Return_Request_Params {
    consignment_id?: number;
    invoice?: string;
    tracking_code?: string;
    reason?: string;
}
interface Payment {
    id: number;
    user_id: number;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
    consignments?: Payment_Consignment[];
}
interface Payment_Consignment {
    id: number;
    consignment_id: number;
    invoice: string;
    tracking_code: string;
    cod_amount: number;
    status: string;
}
interface Police_Station {
    id: number;
    name: string;
    district_id: number;
    division_id: number;
}
export { Order_Details_For_Steadfast, Bulk_Order_Item_For_Steadfast, Bulk_Order_For_Steadfast, Order_Data_For_Steadfast, Bulk_Order_Response_For_Steadfast, Bulk_Order_Response_Items_For_Steadfast, ErrorResponse, Create_Order_Response_Items_For_Steadfast, Delivery_Status_Response, Balance_Response, Return_Request, Create_Return_Request_Params, Payment, Payment_Consignment, Police_Station, };
