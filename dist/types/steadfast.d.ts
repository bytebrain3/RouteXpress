interface Order_Details_For_Steadfast {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
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
}
interface Bulk_Order_Item_For_Steadfast {
    invoice: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_address: string;
    cod_amount: number;
    note?: string;
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
export { Order_Details_For_Steadfast, Bulk_Order_Item_For_Steadfast, Bulk_Order_For_Steadfast, Order_Data_For_Steadfast, Bulk_Order_Response_For_Steadfast, Bulk_Order_Response_Items_For_Steadfast, ErrorResponse, Create_Order_Response_Items_For_Steadfast };
