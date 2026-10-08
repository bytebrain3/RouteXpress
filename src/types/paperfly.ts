interface PaperflyConfig {
  username: string;
  password: string;
  apiKey: string;
}

interface PaperflyCreateOrder {
  merchantOrderReference: string;
  storeName: string;
  productBrief: string;
  packagePrice: string;
  max_weight: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  orderType?: string;
  exchangeDescription?: string;
  exchangePrice?: string;
  exchangeWeight?: string;
}

interface PaperflyOrderResponse {
  success: {
    message: string;
    tracking_number: string;
    tracking_barcode: string;
  };
  response_code: number;
}

interface PaperflyTrackingResponse {
  success: {
    message: string;
    trackingStatus: Array<{
      invNum: string;
      receivedAmount: string;
      Pick: string | null;
      PickTime: string | null;
      inTransit: string;
      inTransitTime: string;
      ReceivedAtPoint: string;
      ReceivedAtPointTime: string;
      PickedForDelivery: string;
      PickedForDeliveryTime: string;
      Delivered: string;
      DeliveredTime: string;
      Returned: string;
      ReturnedTime: string;
      Partial: string;
      PartialTime: string;
      onHoldSchedule: string;
      close: string;
      closeTime: string;
    }>;
  };
  response_code: number;
}

interface PaperflyCancelResponse {
  success: {
    message: string;
    response_code: number;
  };
}

export {
  PaperflyConfig,
  PaperflyCreateOrder,
  PaperflyOrderResponse,
  PaperflyTrackingResponse,
  PaperflyCancelResponse,
};

export type { ErrorResponse } from "@/utils/errors.js";
