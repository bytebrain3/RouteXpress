# RouteXpress-BD

![RouteXpress Logo](/public/route.png)

A Node.js library to unify and manage courier services in Bangladesh (Pathao, Steadfast, etc.).

---

## Features

- Unified API for multiple courier providers (Pathao, Steadfast, etc.)
- Create single or bulk orders
- Fetch order status by consignment ID, invoice, or tracking code
- Manage Pathao tokens, stores, and locations
- Get Steadfast account balance
- Price calculation for Pathao orders

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
import RouteXpress from "routexpress-bd";

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
});
```

---

## API Reference & Usage Examples

### 1. Create Order

#### Steadfast

```typescript
const orderData = {
  provider: "steadfast",
  order_details: {
    invoice: "INV90444w0144",
    recipient_name: "John Doe",
    recipient_phone: "01712344578",
    recipient_address: "123 Main Street, Dhaka",
    cod_amount: 1000,
  },
};

const response = await client.createOrder("steadfast", orderData);
console.log("Steadfast Order Response:", response);
```

#### Pathao

```typescript
const pathaoOrder = {
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
};

const response = await client.createOrder("pathao", pathaoOrder);
console.log("Pathao Order Response:", response);
```

---

### 2. Create Bulk Order

#### Steadfast

```typescript
const bulkOrderData = {
  provider: "steadfast",
  orders: [
    {
      invoice: "INV0094e8981",
      recipient_name: "John Doe",
      recipient_phone: "01712345678",
      recipient_address: "123 Main Street, Dhaka",
      cod_amount: 1000,
    },
    // ...more orders
  ],
};

const response = await client.createBulkOrder("steadfast", bulkOrderData);
console.log("Bulk Order Response:", response);
```

#### Pathao

```typescript
const bulkOrderDataForPathao = {
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
    // ...more orders
  ],
};

const response = await client.createBulkOrder("pathao", bulkOrderDataForPathao);
console.log("Bulk Order Response:", response);
```

---

### 3. Get Order Status

#### By Consignment ID

```typescript
const response = await client.getOrderStatus({
  provider: "steadfast",
  data: { consignment_id: "DT0905255BZNFQ" },
});

const pathaoResponse = await client.getOrderStatus({
  provider: "pathao",
  data: {
    consignment_id: "DT0905255BZNFQ",
    authToken: "YOUR_PATHAO_AUTH_TOKEN",
  },
});
console.log("Response:", pathaoResponse);
```

#### By Invoice

```typescript
const response = await client.statusByInvoice("INV90444344w0144");
console.log("Response:", response);
```

#### By Tracking Code

```typescript
const response = await client.statusBytrackingcode("88D026EF9");
console.log("Response:", response);
```

---

### 4. Get Steadfast Balance

```typescript
const response = await client.getSteadFastBalance();
console.log("Response:", response);
```

---

### 5. Pathao Token Management

#### Create Access Token

```typescript
const response = await client.createPathaoToken();
console.log("Access Token:", response.access_token);
```

#### Refresh Token

```typescript
const accessTokenResponse = await client.createPathaoToken();
const refreshToken = accessTokenResponse.refresh_token;
const response = await client.createPathaoRefreshToken(refreshToken);
console.log("Response:", response);
```

---

### 6. Pathao Store Management

#### Create Store

```typescript
const authToken = "YOUR_PATHAO_AUTH_TOKEN";
const storeData = {
  name: "My StoreDemo1",
  contact_name: "John Doe",
  contact_number: "01712345678",
  secondary_contact: "01787654321",
  address: "123 Main Street, Dhaka",
  city_id: 1,
  zone_id: 1,
  area_id: 1,
};
const response = await client.createPathaoStore(authToken, storeData);
console.log("Store Name:", response.store_name);
```

#### Get All Stores

```typescript
const response = await client.getAllPathaoStore(authToken);
console.log("Response:", response);
```

---

### 7. Pathao Location Data

#### Get Cities

```typescript
const response = await client.getPathaoCity(authToken);
console.log("Response:", response);
```

#### Get Zones

```typescript
const response = await client.getPathaoZone(authToken, city_id);
console.log("Response:", response);
```

#### Get Areas

```typescript
const response = await client.getPathaoArea(authToken, zone_id);
console.log("Response:", response);
```

---

### 8. Pathao Price Calculation

```typescript
const orderData = {
  store_id: 148430,
  item_type: 2,
  recipient_city: 1,
  recipient_zone: 1,
  recipient_area: 1,
  delivery_type: 48,
  item_weight: 5,
  item_quantity: 1,
  amount_to_collect: 1000,
};
const response = await client.price_plane(authToken, orderData);
console.log("Response:", response);
```

---

## Error Handling

All methods throw errors on failure. Use try/catch to handle errors:

```typescript
try {
  // ...call any client method
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
