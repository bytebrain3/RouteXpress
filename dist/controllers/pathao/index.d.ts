import { TookenIssueResponse, ErrorResponse, PathaoStore, PathaoStoreResponse, CreatePathaoOrder, Bulk_Order_For_Pathao_Response, Bulk_Order_For_Pathao, PathaoCityResponse, PathaoZoneResponse, PathaoPriceResponse, PathaoAreaResponse, PathaoOrderPiceData, PathaoAllStoreResponse } from "../../types/pathao.js";
import { Pathao_Config } from "../../types/config.js";
declare class Pathao {
    private config;
    private baseUrl;
    constructor(config: Pathao_Config);
    createNewToken(): Promise<TookenIssueResponse | ErrorResponse>;
    createRefresshToken(refreshToken: string): Promise<TookenIssueResponse | ErrorResponse>;
    createStore(authToken: string, store: PathaoStore): Promise<PathaoStoreResponse | ErrorResponse>;
    createOrder(authToken: string, order: CreatePathaoOrder): Promise<any>;
    createBulkOrder(pathaoOrder: Bulk_Order_For_Pathao): Promise<Bulk_Order_For_Pathao_Response[] | ErrorResponse>;
    getStatusByCid(cidDetails: {
        cid: string;
        authToken: string;
    }): Promise<any>;
    getCitys(authToken: string): Promise<PathaoCityResponse | ErrorResponse>;
    getZone(authToken: string, cityId: number): Promise<PathaoZoneResponse | ErrorResponse>;
    get_area_list(authToken: string, zoneId: number): Promise<PathaoAreaResponse | ErrorResponse>;
    price_plane(authToken: string, orderData: PathaoOrderPiceData): Promise<PathaoPriceResponse | ErrorResponse>;
    getAllStore(authToken: string): Promise<PathaoAllStoreResponse | ErrorResponse>;
}
export { Pathao };
