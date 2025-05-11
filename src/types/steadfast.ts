

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
  invoice: string; // Must be Unique and can be alpha-numeric including hyphens and underscores.
  recipient_name: string; // Within 100 characters.
  recipient_phone: string; // Must be 11 Digits Phone number
  recipient_address: string; // Recipient's address within 250 characters.
  cod_amount: number; // Cash on delivery amount in BDT including all charges. Can't be less than 0.
  note?: string; // Delivery instructions or other notes.
  consignment_id: number; // consignment_id the id of steadfast
  tracking_code: string; // tracking number of steadfast (updated to string based on the provided JSON)
}



interface Bulk_Order_Item_For_Steadfast {
  invoice: string; // Must be Unique and can be alpha-numeric including hyphens and underscores.
  recipient_name: string; // Within 100 characters.
  recipient_phone: string; // Must be 11 Digits Phone number
  recipient_address: string; // Recipient's address within 250 characters.
  cod_amount: number; // Cash on delivery amount in BDT including all charges. Can't be less than 0.
  note?: string; // Delivery instructions or other notes.
}

interface Bulk_Order_For_Steadfast {
  orders: Bulk_Order_Item_For_Steadfast[];
}

interface Bulk_Order_Response_Items_For_Steadfast {
  invoice: string; // Must be Unique and can be alpha-numeric including hyphens and underscores.
  recipient_name: string; // Within 100 characters.
  recipient_phone: string; // Must be 11 Digits Phone number
  recipient_address: string; // Recipient's address within 250 characters.
  cod_amount: number; // Cash on delivery amount in BDT including all charges. Can't be less than 0.
  note?: string; // Delivery instructions or other notes.
  consignment_id: number | null; // consignment_id the id of steadfast, can be null in case of error
  tracking_code: string | null; // tracking number of steadfast, can be null in case of error
  status: "success" | "error"; // Status of the response item
}

interface Bulk_Order_Response_For_Steadfast {
  status?: number; // HTTP status code
  message?: string; // Message from the API
  data: Bulk_Order_Response_Items_For_Steadfast[]; // Array of response items
}

interface ErrorResponse {
    status : number,
    message : string,
}

export {
  Order_Details_For_Steadfast,
  Bulk_Order_Item_For_Steadfast,
  Bulk_Order_For_Steadfast,
  Order_Data_For_Steadfast,
  Bulk_Order_Response_For_Steadfast,
  Bulk_Order_Response_Items_For_Steadfast,
  ErrorResponse,
  Create_Order_Response_Items_For_Steadfast
};
