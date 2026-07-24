# RouteXpress-BD

![RouteXpress Logo](/public/route.png)

## NPM Stats & Info

![npm downloads total](https://img.shields.io/npm/dt/routexpress-bd)
![npm version](https://img.shields.io/npm/v/routexpress-bd)
![npm downloads weekly](https://img.shields.io/npm/dw/routexpress-bd)
![npm downloads monthly](https://img.shields.io/npm/dm/routexpress-bd)

A Node.js library to unify and manage courier services in Bangladesh (Steadfast, Pathao, REDX).

---

## Features

- Unified API for multiple courier providers (Steadfast, Pathao, REDX)
- Create single or bulk orders
- Fetch order status by consignment ID, invoice, or tracking code
- Manage Pathao tokens, stores, and locations
- Steadfast return requests, payments, and police stations
- REDX store management, parcel tracking, and price calculation
- Get Steadfast account balance
- Price calculation for Pathao and REDX orders
- **Webhook support** for all three providers with built-in verification

---

## Installation

Install with npm or pnpm:

```bash
npm install routexpress-bd
# or
pnpm add routexpress-bd
```

---

## Getting Started

### Import and Initialize

```typescript
// Default import
import RouteXpress from "routexpress-bd";

// Or named import
import { RouteXpress } from "routexpress-bd";

const client = new RouteXpress({
  steadfast: {
    apiKey: "YOUR_STEADFAST_API_KEY",
    apiSecret: "YOUR_STEADFAST_API_SECRET",
  },
  pathao: {
    apiKey: "YOUR_PATHAO_API_KEY",
    apiSecret: "YOUR_PATHAO_API_SECRET",
    username: "YOUR_PATHAO_USERNAME",
    password: "YOUR_PATHAO_PASSWORD",
  },
  redx: {
    apiKey: "YOUR_REDX_API_KEY",
    environment: "production", // or "development"
  },
});
```

> You can configure one, two, or all three providers. At least one must be configured.

### Webhook Configuration (Optional)

Each provider can have its own webhook endpoint. Add the `webhooks` config to enable them:

```typescript
const client = new RouteXpress({
  steadfast: { apiKey: "...", apiSecret: "..." },
  pathao: { apiKey: "...", apiSecret: "...", username: "...", password: "..." },
  redx: { apiKey: "...", environment: "production" },

  webhooks: {
    steadfast: {
      enabled: true,
      webhookUrl: "https://your-server.com/api/webhooks/steadfast",
      apiSecret: "YOUR_STEADFAST_WEBHOOK_SECRET",
    },
    pathao: {
      enabled: true,
      webhookUrl: "https://your-server.com/api/webhooks/pathao",
      integrationSecret: "YOUR_PATHAO_INTEGRATION_SECRET",
    },
    redx: {
      enabled: true,
      webhookUrl: "https://your-server.com/api/webhooks/redx",
      apiAccessToken: "YOUR_REDX_API_ACCESS_TOKEN",
    },
  },
});
```

| Provider | Verification Method | Secret Field |
|---|---|---|
| Steadfast | `Authorization: Bearer <apiSecret>` header | `apiSecret` |
| Pathao | `X-Pathao-Merchant-Webhook-Integration-Secret` header + optional HMAC-SHA256 `X-PATHAO-Signature` | `integrationSecret` |
| RedX | `API-ACCESS-TOKEN` header | `apiAccessToken` |

---

## API Reference & Usage Examples

---

### Steadfast

#### 1. Create Order

```typescript
const response = await client.createOrder("steadfast", {
  order_details: {
    invoice: "INV90444w0144",
    recipient_name: "John Doe",
    recipient_phone: "01712344578",
    recipient_address: "123 Main Street, Dhaka",
    cod_amount: 1000,
    note: "Deliver within 3 PM",
    alternative_phone: "01712345678",
    recipient_email: "john@example.com",
    item_description: "Electronics",
    total_lot: 1,
    delivery_type: 0, // 0 = home delivery, 1 = point delivery/hub pickup
  },
});
console.log("Steadfast Order Response:", response);
```

#### 2. Create Bulk Order

```typescript
const response = await client.createBulkOrder("steadfast", {
  orders: [
    {
      invoice: "INV0094e8981",
      recipient_name: "John Doe",
      recipient_phone: "01712345678",
      recipient_address: "123 Main Street, Dhaka",
      cod_amount: 1000,
    },
    {
      invoice: "INV009849e82",
      recipient_name: "Jane Smith",
      recipient_phone: "01787654321",
      recipient_address: "456 Elm Street, Chittagong",
      cod_amount: 2000,
    },
  ],
});
console.log("Bulk Order Response:", response);
```

#### 3. Get Order Status

##### By Consignment ID

```typescript
const response = await client.getOrderStatus({
  provider: "steadfast",
  data: { consignment_id: "DT0905255BZNFQ" },
});
console.log("Response:", response);
```

##### By Invoice

```typescript
const response = await client.statusByInvoice("INV90444344w0144");
console.log("Response:", response);
```

##### By Tracking Code

```typescript
const response = await client.statusBytrackingcode("88D026EF9");
console.log("Response:", response);
```

#### 4. Get Steadfast Balance

```typescript
const response = await client.getSteadFastBalance();
console.log("Response:", response);
```

#### 5. Create Return Request

```typescript
const response = await client.createSteadfastReturnRequest({
  consignment_id: 10000042,
  reason: "Customer requested return",
});
console.log("Response:", response);
```

You can identify the consignment using any one of `consignment_id`, `invoice`, or `tracking_code`.

#### 6. Get Single Return Request

```typescript
const response = await client.getSteadfastReturnRequest(1);
console.log("Response:", response);
```

#### 7. Get All Return Requests

```typescript
const response = await client.getSteadfastReturnRequests();
console.log("Response:", response);
```

#### 8. Get Payments

```typescript
const response = await client.getSteadfastPayments();
console.log("Response:", response);
```

#### 9. Get Single Payment with Consignments

```typescript
const response = await client.getSteadfastSinglePayment(1);
console.log("Response:", response);
```

#### 10. Get Police Stations

```typescript
const response = await client.getSteadfastPoliceStations();
console.log("Response:", response);
```

---

### Pathao

#### 1. Create Access Token

```typescript
const response = await client.createPathaoToken();
console.log("Access Token:", response.access_token);
```

#### 2. Refresh Token

```typescript
const accessTokenResponse = await client.createPathaoToken();
const refreshToken = accessTokenResponse.refresh_token;
const response = await client.createPathaoRefreshToken(refreshToken);
console.log("Response:", response);
```

#### 3. Create Order

```typescript
const response = await client.createOrder("pathao", {
  authToken: "YOUR_PATHAO_AUTH_TOKEN",
  store_id: 148430,
  merchant_order_id: "ORD123456",
  recipient_name: "John Doe",
  recipient_phone: "01712325678",
  recipient_address: "123 Main Street, Dhaka",
  recipient_city: 1,
  recipient_zone: 1,
  recipient_area: 1,
  delivery_type: 48,
  item_type: 2,
  special_instruction: "Handle with care",
  item_quantity: 1,
  item_weight: 0.5,
  item_description: "Electronics",
  amount_to_collect: 1000,
});
console.log("Pathao Order Response:", response);
```

#### 4. Create Bulk Order

```typescript
const response = await client.createBulkOrder("pathao", {
  authToken: "YOUR_PATHAO_AUTH_TOKEN",
  orders: [
    {
      store_id: 148430,
      merchant_order_id: "ORD123456",
      recipient_name: "John Doe",
      recipient_phone: "01712342578",
      recipient_address: "123 Main Street, Dhaka",
      recipient_city: 1,
      recipient_zone: 1,
      recipient_area: 1,
      delivery_type: 48,
      item_type: 2,
      special_instruction: "Handle with care",
      item_quantity: 1,
      item_weight: 0.5,
      item_description: "Electronics",
      amount_to_collect: 1000,
    },
  ],
});
console.log("Bulk Order Response:", response);
```

#### 5. Get Order Status by Consignment ID

```typescript
const response = await client.getOrderStatus({
  provider: "pathao",
  data: {
    consignment_id: "DT0905255BZNFQ",
    authToken: "YOUR_PATHAO_AUTH_TOKEN",
  },
});
console.log("Response:", response);
```

#### 6. Create Store

```typescript
const response = await client.createPathaoStore("YOUR_PATHAO_AUTH_TOKEN", {
  name: "My Store",
  contact_name: "John Doe",
  contact_number: "01712345678",
  secondary_contact: "01787654321",
  address: "123 Main Street, Dhaka",
  city_id: 1,
  zone_id: 1,
  area_id: 1,
});
console.log("Store Name:", response.store_name);
```

#### 7. Get All Stores

```typescript
const response = await client.getAllPathaoStore("YOUR_PATHAO_AUTH_TOKEN");
console.log("Response:", response);
```

#### 8. Get Cities

```typescript
const response = await client.getPathaoCity("YOUR_PATHAO_AUTH_TOKEN");
console.log("Response:", response);
```

#### 9. Get Zones

```typescript
const response = await client.getPathaoZone("YOUR_PATHAO_AUTH_TOKEN", 1);
console.log("Response:", response);
```

#### 10. Get Areas

```typescript
const response = await client.getPathaoArea("YOUR_PATHAO_AUTH_TOKEN", 1);
console.log("Response:", response);
```

#### 11. Price Calculation

```typescript
const response = await client.price_plane("YOUR_PATHAO_AUTH_TOKEN", {
  store_id: 148430,
  item_type: 2,
  recipient_city: 1,
  recipient_zone: 1,
  recipient_area: 1,
  delivery_type: 48,
  item_weight: 5,
  item_quantity: 1,
  amount_to_collect: 1000,
});
console.log("Response:", response);
```

---

### REDX

#### 1. Create Order

```typescript
const response = await client.createOrder("redx", {
  customer_name: "John Doe",
  customer_phone: "01712345628",
  delivery_area: "Dhaka",
  delivery_area_id: 1,
  customer_address: "123 Main Street, Dhaka",
  merchant_invoice_id: "INV123456",
  cash_collection_amount: "1000",
  parcel_weight: "2",
  instruction: "Handle with care",
  value: "1500",
  pickup_store_id: "504839",
  parcel_details_json: [
    { name: "Electronics Item 1", category: "Electronics", value: "1000" },
  ],
});
console.log("Redx Order Response:", response);
```

#### 2. Create Store

```typescript
const response = await client.createRedXStore({
  name: "My Store",
  address: "123 Main Street, Dhaka",
  phone: "01712345678",
  area_id: "1",
});
console.log("Store Response:", response);
```

#### 3. Track Parcel by Tracking Code

```typescript
const response = await client.trackParcelByTrackingCode("25A510SA18UXL7");
console.log("Response:", response);
```

#### 4. Get Parcel Info by Tracking Code

```typescript
const response = await client.getParcelInfoByTrackingCode("25A510SA18UXL7");
console.log("Response:", response);
```

#### 5. Update Parcel

```typescript
const response = await client.updateParcel("25A510SA18UXL7", {
  property_name: "status",
  new_value: "cancelled",
  reason: "Customer requested change",
});
console.log("Response:", response);
```

#### 6. Get All Stores

```typescript
const response = await client.getRedXStores();
console.log("Response:", response);
```

#### 7. Get Pickup Store Info

```typescript
const response = await client.getPickupStoreInfo("504839");
console.log("Response:", response);
```

#### 8. Get Area List

```typescript
const response = await client.getRedXAreaList();
console.log("Response:", response);
```

#### 9. Get Area by Postcode

```typescript
const response = await client.getResXAreabyPostcode("1204");
console.log("Response:", response);
```

#### 10. Get Area by District Name

```typescript
const response = await client.getRedXAreaBYDistrict_name("Dhaka");
console.log("Response:", response);
```

#### 11. Calculate Price

```typescript
const response = await client.calculateRedXPrice({
  delivery_area_id: 1,
  pickup_area_id: 1,
  cash_collection_amount: 1000,
  weight: 2,
});
console.log("Response:", response);
```

---

## Webhooks

RouteXpress provides built-in webhook handlers for each provider. Use them in your route handlers to verify and parse incoming webhooks.

### Steadfast Webhooks

```typescript
// Express example
app.post("/api/webhooks/steadfast", (req, res) => {
  const handler = client.getSteadfastWebhook();

  // Verify + parse in one step
  const result = handler.handle(req.body, req.headers);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const webhook = result.data;

  // Handle delivery status updates
  if (webhook.notification_type === "delivery_status") {
    console.log(`Order ${webhook.consignment_id}: ${webhook.current_status}`);
  }

  // Handle tracking updates
  if (webhook.notification_type === "tracking_update") {
    console.log(`Tracking update for ${webhook.consignment_id}`);
  }

  res.json({ received: true });
});
```

### Pathao Webhooks

```typescript
// Express example — integration secret verification
app.post("/api/webhooks/pathao", (req, res) => {
  const handler = client.getPathaoWebhook();

  // Verify via X-Pathao-Merchant-Webhook-Integration-Secret header
  const result = handler.handle(req.body, req.headers);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  console.log("Pathao event:", result.data.event);
  console.log("Consignment:", result.data.consignment_id);

  res.json({ received: true });
});

// Or verify via HMAC-SHA256 signature (X-PATHAO-Signature header)
app.post("/api/webhooks/pathao/signature", (req, res) => {
  const handler = client.getPathaoWebhook();

  const result = handler.handleWithSignature(req.body, req.headers);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  console.log("Pathao event:", result.data.event);
  res.json({ received: true });
});
```

### RedX Webhooks

```typescript
// Express example
app.post("/api/webhooks/redx", (req, res) => {
  const handler = client.getRedXWebhook();

  // Verify via API-ACCESS-TOKEN header
  const result = handler.handle(req.body, req.headers);

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const webhook = result.data;

  console.log(`Parcel ${webhook.tracking_number}: ${webhook.status}`);

  res.json({ received: true });
});
```

### Getting the Webhook URL

Use `getWebhookUrl()` to retrieve the URL you registered with each provider:

```typescript
const steadfastUrl = client.getWebhookUrl("steadfast");
//=> "https://your-server.com/api/webhooks/steadfast"

const pathaoUrl = client.getWebhookUrl("pathao");
//=> "https://your-server.com/api/webhooks/pathao"

const redxUrl = client.getWebhookUrl("redx");
//=> "https://your-server.com/api/webhooks/redx"
```

### Webhook Verification Summary

| Provider | Header | Method |
|---|---|---|
| Steadfast | `Authorization: Bearer <apiSecret>` | `handler.handle(body, headers)` |
| Pathao (secret) | `X-Pathao-Merchant-Webhook-Integration-Secret` | `handler.handle(body, headers)` |
| Pathao (signature) | `X-PATHAO-Signature` (HMAC-SHA256) | `handler.handleWithSignature(body, headers)` |
| RedX | `API-ACCESS-TOKEN` | `handler.handle(body, headers)` |

---

## Exports

```typescript
// Default export
import RouteXpress from "routexpress-bd";

// Named export — same class
import { RouteXpress } from "routexpress-bd";

// Webhook handlers
import {
  SteadfastWebhookHandler,
  PathaoWebhookHandler,
  RedXWebhookHandler,
} from "routexpress-bd";

// Webhook types
import type {
  // Steadfast
  SteadfastWebhookPayload,
  SteadfastDeliveryStatusWebhook,
  SteadfastTrackingUpdateWebhook,
  // Pathao
  PathaoWebhookPayload,
  PathaoWebhookEvent,
  PathaoWebhookBase,
  // RedX
  RedXWebhookPayload,
  RedXWebhookStatus,
  RedXDeliveryType,
  // Common
  WebhookVerifyResult,
  WebhookParseResult,
} from "routexpress-bd";

// Config types
import type {
  Config,
  Steadfast_Config,
  Pathao_Config,
  Redx_Config,
  SteadfastWebhookConfig,
  PathaoWebhookConfig,
  RedXWebhookConfig,
} from "routexpress-bd";
```

---

## Error Handling

All methods throw errors on failure. Use try/catch to handle errors:

```typescript
try {
  const response = await client.createOrder("steadfast", orderData);
} catch (err) {
  console.error(err);
}
```

---

## Best Practices

- Always keep your API keys and tokens secure. Do not hardcode them in production code.
- Use async/await and proper error handling for all API calls.
- Refer to the official documentation of each courier for more details on their specific requirements.

---

## License

MIT

---

For more details, see the [test/main.ts](./test/main.ts) file for real usage examples.
