import { Redx_Config } from "src/types/config.js";
import { RedxCreateOrder, ErrorResponse, RedxResponse, RedxUpdateOrder, RedxStoreResponse, RedxTrackByidResponse, RedxTrackByid, RedxAreaResponse } from "src/types/redx.js";
declare class Redx {
    private config;
    private baseUrl;
    constructor(config: Redx_Config, environment: "production" | "development");
    createOrder(orderData: RedxCreateOrder): Promise<RedxResponse | ErrorResponse>;
    createStore(storeData: {
        name: string;
        address: string;
        phone: string;
        area_id: string;
    }): Promise<RedxStoreResponse | ErrorResponse>;
    trackParcelByTrackingCode(trackingCode: string): Promise<RedxTrackByidResponse | ErrorResponse>;
    getParcelInfoByTrackingCode(trackingCode: string): Promise<RedxTrackByid | ErrorResponse>;
    updateParcel(trackingCode: string, updateData: object): Promise<RedxUpdateOrder | ErrorResponse>;
    getAreaList(): Promise<RedxAreaResponse[] | ErrorResponse>;
    getAreaByPostcode(postcode: string): Promise<RedxAreaResponse | ErrorResponse>;
    getAreaByDistrictName(districtName: string): Promise<RedxAreaResponse | ErrorResponse>;
    getStores(): Promise<RedxStoreResponse[] | ErrorResponse>;
    getPickupStoreInfo(storeId: string): Promise<RedxStoreResponse | ErrorResponse>;
    calculatePrice(orderData: {
        delivery_area_id: number;
        pickup_area_id: number;
        cash_collection_amount: number;
        weight: number;
    } | object): Promise<any>;
}
export { Redx };
