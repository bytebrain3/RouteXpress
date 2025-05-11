interface RedxCreateOrder {
    customer_name: string;
    customer_phone: string;
    delivery_area: string;
    delivery_area_id: number;
    customer_address: string;
    cash_collection_amount: string;
    parcel_weight: string;
    merchant_invoice_id?: string;
    instruction?: string;
    type?: string;
    value: string;
    parcel_details_json?: object;
    pickup_store_id?: string;
    is_closed_box?: boolean;
}
interface ErrorResponse {
    status: number;
    message: string;
    code?: number;
    error?: string;
}
interface RedxResponse {
    tracking_id: string;
}
interface RedxUpdateOrder {
    success: boolean;
    message: string;
}
interface RedxStoreResponse {
    id: number;
    name: string;
    address: string;
    area_name: string;
    area_id: number;
    phone: string;
}
interface RedxTrackByidResponse {
    tracking: Array<{
        message_en: string;
        message_bn: string;
        time: string;
    }>;
}
interface RedxTrackByid {
    tracking_id: string;
    customer_address: string;
    delivery_area: string;
    delivery_area_id: number;
    charge: number;
    customer_name: string;
    customer_phone: string;
    cash_collection_amount: number;
    parcel_weight: number;
    merchant_invoice_id: string;
    status: string;
    instruction: string;
    created_at: string;
    delivery_type: string;
    value: string;
    pickup_location: {
        id: number;
        name: string;
        address: string;
        area_name: string;
        area_id: number;
    };
}
interface RedxAreaResponse {
    areas: Array<{
        id: number;
        name: string;
        post_code: number;
        division_name: string;
        zone_id: number;
    }>;
}
export { RedxCreateOrder, ErrorResponse, RedxResponse, RedxUpdateOrder, RedxStoreResponse, RedxTrackByidResponse, RedxTrackByid, RedxAreaResponse, };
