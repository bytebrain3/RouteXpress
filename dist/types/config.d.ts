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
interface Config {
    steadfast?: Steadfast_Config;
    pathao?: Pathao_Config;
    redx?: Redx_Config;
    webhooks?: {
        steadfast?: SteadfastWebhookConfig;
        pathao?: PathaoWebhookConfig;
        redx?: RedXWebhookConfig;
    };
}
export { Pathao_Config, Steadfast_Config, Redx_Config, SteadfastWebhookConfig, PathaoWebhookConfig, RedXWebhookConfig, Config, };
