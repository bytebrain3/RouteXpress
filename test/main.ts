
import RouteXpress from "../src/index";

const client = new RouteXpress({
  steadfast: {
    apiKey: "",
    apiSecret: "",
  },
  pathao: {
    apiKey: "",
    apiSecret: "",
    username: "",
    password: "",
  },
});

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
    {
      invoice: "INV009849e82",
      recipient_name: "Jane Smith",
      recipient_phone: "01787654321",
      recipient_address: "456 Elm Street, Chittagong",
      cod_amount: 2000,
    },
    {
      invoice: "INV009854ew983",
      recipient_name: "Alice Johnson",
      recipient_phone: "01876543210",
      recipient_address: "789 Oak Street, Sylhet",
      cod_amount: 1500,
    },
    {
      invoice: "INV00958ew984",
      recipient_name: "Bob Brown",
      recipient_phone: "01987654321",
      recipient_address: "321 Pine Street, Khulna",
      cod_amount: 2500,
    },
  ],
};

const createOrder = async () => {
  try {
    // For Steadfast
    /* const steadfastOrder = await client.createOrder("steadfast", {
      order_details: {
        invoice: "INV9044q24w40144",
        recipient_name: "John Doe",
        recipient_phone: "01712344578",
        recipient_address: "123 Main Street, Dhaka",
        cod_amount: 1000,
      },
    });
    console.log("Steadfast Order Response:", steadfastOrder); */

    // For Pathao
    const authToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyNjciLCJqdGkiOiIwZDk3Yjk5MDY5ZGQ0NjVjZGEzMTU0YTIwZjUyMzJkZjExMTJiY2Q0NmZhNDBmZmY0ODU4NWUzZTdmNDFhMjBhNDA4ZGI4ZjY5YTI4NjdiZiIsImlhdCI6MTc0Njc3NTA1MS4yMTQxMjcsIm5iZiI6MTc0Njc3NTA1MS4yMTQxMywiZXhwIjoxNzQ3MjA3MDUxLjIwMDIwOCwic3ViIjoiMzUyIiwic2NvcGVzIjpbXX0.pgKuB5fxdHEdlPKSdN6jAEb1yO_TmGQGEoHjJVCQEAMF3LxymzpfQEgD28B3_V_PiLTWBpU6dLFv66R-0a65rN7cy2n2QIb6nCyq0kZ2PPeihgPgMsJuKsWAI-JnaVFJKhOh-p0rV5tfdb0ljlgQWad-wilZHsZ4RoCCMqgcdmCG9--DT90Pkj65UJwJM3_DDHuA6eFqmGLkYdwPr7R8BT63E1yzlWL41heJ4saDgc3462Ubv1LCsrz-HogEi-5hGHZqzWtR1RLFRlic3UqLx37NPGHfK7WJJBr1anUPJKciALM2qmQRK-sdf3S15sbOqlGYYNHKg62vKrQZ8__ruLPBGoz0xllDyAoJ5W2X_A19PyvbPWwIwNGXhZf4GmnGYOlmyXMHHVOcCpzRhOJHdpgCAV2GBbRUSOHn4m3CMO8n6o4Wtk7O5Zt3uF4-rSnvunacvpDRbq-bnyTulzg0h9m5R6J01cWPox0hItCbWoUC5aY0GfsMe4sxaNoc6puWUSXL00vtQbW2T4sZ3-r--Tn3V8u0FN8LDAegSvXInq0ttW-Da5jCK1tblAP904lg615o38SbXf-Fp8zJS0Ie5Pjmks0G5zT9InN5CJ7mT5R4ezgkrmynqfRDkMhaCch-j-n4ti2FXdx7lwYSbvQkUGDAbwPUqAYM78oOjtP9XwE";
    const pathaoOrder = {
      authToken: authToken,
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

    const pathaoOrderResponse = await client.createOrder("pathao", pathaoOrder);
    console.log("Pathao Order Response:", pathaoOrderResponse);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};

const bulkOrderDataForPathao = {
  authToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyNjciLCJqdGkiOiIwZDk3Yjk5MDY5ZGQ0NjVjZGEzMTU0YTIwZjUyMzJkZjExMTJiY2Q0NmZhNDBmZmY0ODU4NWUzZTdmNDFhMjBhNDA4ZGI4ZjY5YTI4NjdiZiIsImlhdCI6MTc0Njc3NTA1MS4yMTQxMjcsIm5iZiI6MTc0Njc3NTA1MS4yMTQxMywiZXhwIjoxNzQ3MjA3MDUxLjIwMDIwOCwic3ViIjoiMzUyIiwic2NvcGVzIjpbXX0.pgKuB5fxdHEdlPKSdN6jAEb1yO_TmGQGEoHjJVCQEAMF3LxymzpfQEgD28B3_V_PiLTWBpU6dLFv66R-0a65rN7cy2n2QIb6nCyq0kZ2PPeihgPgMsJuKsWAI-JnaVFJKhOh-p0rV5tfdb0ljlgQWad-wilZHsZ4RoCCMqgcdmCG9--DT90Pkj65UJwJM3_DDHuA6eFqmGLkYdwPr7R8BT63E1yzlWL41heJ4saDgc3462Ubv1LCsrz-HogEi-5hGHZqzWtR1RLFRlic3UqLx37NPGHfK7WJJBr1anUPJKciALM2qmQRK-sdf3S15sbOqlGYYNHKg62vKrQZ8__ruLPBGoz0xllDyAoJ5W2X_A19PyvbPWwIwNGXhZf4GmnGYOlmyXMHHVOcCpzRhOJHdpgCAV2GBbRUSOHn4m3CMO8n6o4Wtk7O5Zt3uF4-rSnvunacvpDRbq-bnyTulzg0h9m5R6J01cWPox0hItCbWoUC5aY0GfsMe4sxaNoc6puWUSXL00vtQbW2T4sZ3-r--Tn3V8u0FN8LDAegSvXInq0ttW-Da5jCK1tblAP904lg615o38SbXf-Fp8zJS0Ie5Pjmks0G5zT9InN5CJ7mT5R4ezgkrmynqfRDkMhaCch-j-n4ti2FXdx7lwYSbvQkUGDAbwPUqAYM78oOjtP9XwE",
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
    {
      store_id: 148430,
      merchant_order_id: "ORD12w3456",
      recipient_name: "John Doe",
      recipient_phone: "01712325748",
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
    // ... other orders
  ],
};

const createBulkOrder = async () => {
  try {
    console.log("Creating bulk order...");
    // For Steadfast
    const response = await client.createBulkOrder(
      "pathao",
      bulkOrderDataForPathao
    );
    console.log("Bulk Order Response:", response);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error creating bulk order:", err.message);
    } else {
      console.error("Unknown error occurred");
    }
    process.exit(1);
  }
};

const authToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyNjciLCJqdGkiOiIwZDk3Yjk5MDY5ZGQ0NjVjZGEzMTU0YTIwZjUyMzJkZjExMTJiY2Q0NmZhNDBmZmY0ODU4NWUzZTdmNDFhMjBhNDA4ZGI4ZjY5YTI4NjdiZiIsImlhdCI6MTc0Njc3NTA1MS4yMTQxMjcsIm5iZiI6MTc0Njc3NTA1MS4yMTQxMywiZXhwIjoxNzQ3MjA3MDUxLjIwMDIwOCwic3ViIjoiMzUyIiwic2NvcGVzIjpbXX0.pgKuB5fxdHEdlPKSdN6jAEb1yO_TmGQGEoHjJVCQEAMF3LxymzpfQEgD28B3_V_PiLTWBpU6dLFv66R-0a65rN7cy2n2QIb6nCyq0kZ2PPeihgPgMsJuKsWAI-JnaVFJKhOh-p0rV5tfdb0ljlgQWad-wilZHsZ4RoCCMqgcdmCG9--DT90Pkj65UJwJM3_DDHuA6eFqmGLkYdwPr7R8BT63E1yzlWL41heJ4saDgc3462Ubv1LCsrz-HogEi-5hGHZqzWtR1RLFRlic3UqLx37NPGHfK7WJJBr1anUPJKciALM2qmQRK-sdf3S15sbOqlGYYNHKg62vKrQZ8__ruLPBGoz0xllDyAoJ5W2X_A19PyvbPWwIwNGXhZf4GmnGYOlmyXMHHVOcCpzRhOJHdpgCAV2GBbRUSOHn4m3CMO8n6o4Wtk7O5Zt3uF4-rSnvunacvpDRbq-bnyTulzg0h9m5R6J01cWPox0hItCbWoUC5aY0GfsMe4sxaNoc6puWUSXL00vtQbW2T4sZ3-r--Tn3V8u0FN8LDAegSvXInq0ttW-Da5jCK1tblAP904lg615o38SbXf-Fp8zJS0Ie5Pjmks0G5zT9InN5CJ7mT5R4ezgkrmynqfRDkMhaCch-j-n4ti2FXdx7lwYSbvQkUGDAbwPUqAYM78oOjtP9XwE";

const getOrderByCid = async () => {
  try {
    const response = await client.getOrderStatus({
      provider: "steadfast",
      data: {
        consignment_id: "DT0905255BZNFQ",
      },
    });
    
    const pathaoResponse = await client.getOrderStatus({
      provider: "pathao",
      data: {
        consignment_id: "DT0905255BZNFQ",
        authToken: authToken,
      },
    });
    console.log("Response:", pathaoResponse);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};

const getOrderByInvoice = async () => {
  try {
    const response = await client.statusByInvoice("INV90444344w0144");
    console.log("Response:", response);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};

const getStatusByTrackingCode = async () => {
  try {
    const response = await client.statusBytrackingcode("88D026EF9");
    console.log("Response:", response);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};

const getBalance = async () => {
  try {
    const response = await client.getSteadFastBalance();
    console.log("Response:", response);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};

// pathao test

const createAccessToken = async () => {
  try {
    const response = await client.createPathaoToken();
    if ("access_token" in response) {
      return response.access_token;
    } else {
      console.error("Error:", response);
    }
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};

const createRefreshToken = async () => {
  try {
    const createAccessTokenResponse = await client.createPathaoToken();
    let refreshToken = "";
    if ("access_token" in createAccessTokenResponse) {
      console.log("Access Token:", createAccessTokenResponse.refresh_token);
      refreshToken = createAccessTokenResponse.refresh_token;
    } else {
      console.error("Error:", createAccessTokenResponse);
      return;
    }
    const response = await client.createPathaoRefreshToken(refreshToken);
    console.log("Response:", response);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};

const createPathaoStore = async () => {
  try {
    const authToken = await createAccessToken();
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
    if (!authToken) {
      throw new Error("Auth token is undefined");
    }
    const response = await client.createPathaoStore(authToken, storeData);
    if ("store_name" in response) {
      console.log("Store Name:", response.store_name);
    } else {
      console.error("Error:", response);
    }
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};


const getCity = async () => {
  try {
    const authToken = await createAccessToken();
    if (!authToken) {
      throw new Error("Auth token is undefined");
    }
    const response = await client.getPathaoCity(authToken);
    console.log("Response:", response);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};


const getZone = async () => {
  try {
    const authToken = await createAccessToken();
    if (!authToken) {
      throw new Error("Auth token is undefined");
    }
    const response = await client.getPathaoZone(authToken, 1);
    console.log("Response:", response);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
};
const getArea = async () => {
  try {
    const authToken = await createAccessToken();
    if (!authToken) {
      throw new Error("Auth token is undefined");
    }
    const response = await client.getPathaoArea(authToken, 1);
    console.log("Response:", response);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
}

const price_plane = async () => {
  try {
    const authToken = await createAccessToken();
    if (!authToken) {
      throw new Error("Auth token is undefined");
    }
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
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
}

const getAllPathaoStore = async () => {
  try {
    const authToken = await createAccessToken();
    if (!authToken) {
      throw new Error("Auth token is undefined");
    }
    const response = await client.getAllPathaoStore(authToken);
    console.log("Response:", response);
  } catch (err: unknown) {
    console.log(err);
    process.exit(1);
  }
}

getAllPathaoStore()