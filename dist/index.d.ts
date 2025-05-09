import { Order_Data_For_Steadfast, Bulk_Order_For_Steadfast } from "./types/steadfast";
import { PathaoStore, CreatePathaoOrder, Bulk_Order_For_Pathao_Response, Bulk_Order_For_Pathao } from "./types/pathao";
import { Config } from "./types/config";
import Steadfast from "./controllers/steadfast";
import Pathao from "./controllers/pathao";
declare class RouteXpress {
    private config;
    private pathao?;
    private steadfast?;
    constructor(config: Config);
    protected getSteadfast(): Steadfast;
    protected getPathao(): Pathao;
    createOrder(provider: "steadfast" | "pathao", orderData: Order_Data_For_Steadfast | CreatePathaoOrder): Promise<any>;
    createBulkOrder(provider: "steadfast" | "pathao", allOrder: Bulk_Order_For_Steadfast | Bulk_Order_For_Pathao): Promise<import("./types/steadfast").Bulk_Order_Response_For_Steadfast | import("./types/steadfast").ErrorResponse | Bulk_Order_For_Pathao_Response[]>;
    getOrderStatus(orderData: {
        provider: string;
        data: {
            consignment_id: string;
            authToken?: string;
        };
    }): Promise<any>;
    statusByInvoice(invoice: string): Promise<any>;
    statusBytrackingcode(trackingcode: string): Promise<any>;
    getSteadFastBalance(): Promise<any>;
    createPathaoToken(): Promise<import("./types/pathao").TookenIssueResponse | import("./types/pathao").ErrorResponse>;
    createPathaoRefreshToken(refreshToken: string): Promise<import("./types/pathao").TookenIssueResponse | import("./types/pathao").ErrorResponse>;
    createPathaoStore(authToken: string, storeData: PathaoStore): Promise<import("./types/pathao").ErrorResponse | import("./types/pathao").PathaoStoreResponse>;
    getPathaoCity(authToken: string): Promise<import("./types/pathao").ErrorResponse | import("./types/pathao").PathaoCityResponse>;
    getPathaoZone(authToken: string, cityId: number): Promise<import("./types/pathao").ErrorResponse | import("./types/pathao").PathaoZoneResponse>;
    getPathaoArea(authToken: string, zoneId: number): Promise<import("./types/pathao").ErrorResponse | import("./types/pathao").PathaoAreaResponse>;
    price_plane(authToken: string, orderData: any): Promise<import("./types/pathao").ErrorResponse | import("./types/pathao").PathaoPriceResponse>;
    getAllPathaoStore(authToken: string): Promise<import("./types/pathao").ErrorResponse | import("./types/pathao").PathaoAllStoreResponse>;
}
export default RouteXpress;
