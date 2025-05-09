import { Order_Data_For_Steadfast, Bulk_Order_For_Steadfast } from "./types/steadfast.js";
import { PathaoStore, CreatePathaoOrder, Bulk_Order_For_Pathao } from "./types/pathao.js";
import { Config } from "./types/config.js";
import { Steadfast } from "./controllers/steadfast/index.js";
import { Pathao } from "./controllers/pathao/index.js";
declare class RouteXpress {
    private config;
    private pathao?;
    private steadfast?;
    constructor(config: Config);
    protected getSteadfast(): Steadfast;
    protected getPathao(): Pathao;
    createOrder(provider: "steadfast" | "pathao", orderData: Order_Data_For_Steadfast | CreatePathaoOrder): Promise<any>;
    createBulkOrder(provider: "steadfast" | "pathao", allOrder: Bulk_Order_For_Steadfast | Bulk_Order_For_Pathao): Promise<import("./types/steadfast.js").Bulk_Order_Response_For_Steadfast | import("./types/steadfast.js").ErrorResponse | import("./types/pathao.js").Bulk_Order_For_Pathao_Response[]>;
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
    createPathaoToken(): Promise<import("./types/pathao.js").TookenIssueResponse | import("./types/pathao.js").ErrorResponse>;
    createPathaoRefreshToken(refreshToken: string): Promise<import("./types/pathao.js").TookenIssueResponse | import("./types/pathao.js").ErrorResponse>;
    createPathaoStore(authToken: string, storeData: PathaoStore): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoStoreResponse>;
    getPathaoCity(authToken: string): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoCityResponse>;
    getPathaoZone(authToken: string, cityId: number): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoZoneResponse>;
    getPathaoArea(authToken: string, zoneId: number): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoAreaResponse>;
    price_plane(authToken: string, orderData: any): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoPriceResponse>;
    getAllPathaoStore(authToken: string): Promise<import("./types/pathao.js").ErrorResponse | import("./types/pathao.js").PathaoAllStoreResponse>;
}
export default RouteXpress;
export { RouteXpress };
