interface Pathao_Config {
  apiKey: string;
  apiSecret: string;
  username: string;
  password: string;
}

interface Steadfast_Config {
  apiKey: string;
  apiSecret: string;
}

interface Redx_Config {
  apiKey: string;
  environment: "production" | "development";
}

interface Config {
  steadfast?: Steadfast_Config; // Replace with the actual type for Steadfast configuration
  pathao?: Pathao_Config; // Replace with the actual type for Pathao configuration
  redx?: Redx_Config; // Replace with the actual type for Redx configuration
}

export { Pathao_Config, Steadfast_Config, Redx_Config , Config };
