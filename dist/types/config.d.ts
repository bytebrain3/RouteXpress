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
    steadfast?: Steadfast_Config;
    pathao?: Pathao_Config;
    redx?: Redx_Config;
}
export { Pathao_Config, Steadfast_Config, Redx_Config, Config };
