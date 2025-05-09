import { Order_Data_For_Steadfast, Bulk_Order_For_Steadfast, Bulk_Order_Response_For_Steadfast, ErrorResponse, Create_Order_Response_Items_For_Steadfast } from "../../types/steadfast.js";
import { Steadfast_Config } from "../../types/config.js";
declare class Steadfast {
    private config;
    private baseUrl;
    constructor(config: Steadfast_Config);
    private validator;
    createOrder(orderData: Order_Data_For_Steadfast): Promise<Create_Order_Response_Items_For_Steadfast | ErrorResponse>;
    createBulkOrder(bulkOrder: Bulk_Order_For_Steadfast): Promise<Bulk_Order_Response_For_Steadfast | ErrorResponse>;
    getStatusByCid(cid: string): Promise<any>;
    getStatusByInvoice(invoice: string): Promise<any>;
    statusBytrackingcode(trackingcode: string): Promise<any>;
    getBalance(): Promise<any>;
}
export { Steadfast };
