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

interface SteadfastWebhookConfig {
  enabled: boolean;
  webhookUrl: string;
  apiSecret: string;
}

interface PathaoWebhookConfig {
  enabled: boolean;
  webhookUrl: string;
  integrationSecret: string;
}

interface RedXWebhookConfig {
  enabled: boolean;
  webhookUrl: string;
  apiAccessToken: string;
}

interface Carrybee_Config {
  clientId: string;
  clientSecret: string;
  clientContext: string;
  environment: "production" | "sandbox";
}

interface CarrybeeWebhookConfig {
  enabled: boolean;
  webhookUrl: string;
  webhookSecret: string;
}

interface Config {
  steadfast?: Steadfast_Config;
  pathao?: Pathao_Config;
  redx?: Redx_Config;
  carrybee?: Carrybee_Config;
  webhooks?: {
    steadfast?: SteadfastWebhookConfig;
    pathao?: PathaoWebhookConfig;
    redx?: RedXWebhookConfig;
    carrybee?: CarrybeeWebhookConfig;
  };
}

export {
  Pathao_Config,
  Steadfast_Config,
  Redx_Config,
  Carrybee_Config,
  SteadfastWebhookConfig,
  PathaoWebhookConfig,
  RedXWebhookConfig,
  CarrybeeWebhookConfig,
  Config,
};
