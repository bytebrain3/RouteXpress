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

interface Config {
  steadfast?: Steadfast_Config; // Replace with the actual type for Steadfast configuration
  pathao?: Pathao_Config; // Replace with the actual type for Pathao configuration
}

export { Pathao_Config, Steadfast_Config, Config };
