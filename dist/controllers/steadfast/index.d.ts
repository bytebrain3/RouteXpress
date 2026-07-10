import { Order_Data_For_Steadfast, Bulk_Order_For_Steadfast, Bulk_Order_Response_For_Steadfast, ErrorResponse, Create_Order_Response_Items_For_Steadfast, Delivery_Status_Response, Balance_Response, Return_Request, Create_Return_Request_Params, Payment, Police_Station } from "../../types/steadfast.js";
import { Steadfast_Config } from "../../types/config.js";
declare class Steadfast {
    private config;
    private baseUrl;
    constructor(config: Steadfast_Config);
    private validator;
    createOrder(orderData: Order_Data_For_Steadfast): Promise<Create_Order_Response_Items_For_Steadfast | ErrorResponse>;
    createBulkOrder(bulkOrder: Bulk_Order_For_Steadfast): Promise<Bulk_Order_Response_For_Steadfast | ErrorResponse>;
    getStatusByCid(cid: string): Promise<Delivery_Status_Response | ErrorResponse>;
    getStatusByInvoice(invoice: string): Promise<Delivery_Status_Response | ErrorResponse>;
    statusBytrackingcode(trackingcode: string): Promise<Delivery_Status_Response | ErrorResponse>;
    getBalance(): Promise<Balance_Response | ErrorResponse>;
    createReturnRequest(params: Create_Return_Request_Params): Promise<Return_Request | ErrorResponse>;
    getReturnRequest(id: number): Promise<Return_Request | ErrorResponse>;
    getReturnRequests(): Promise<Return_Request[] | ErrorResponse>;
    getPayments(): Promise<Payment[] | ErrorResponse>;
    getSinglePayment(paymentId: number): Promise<Payment | ErrorResponse>;
    getPoliceStations(): Promise<Police_Station[] | ErrorResponse>;
}
export { Steadfast };
