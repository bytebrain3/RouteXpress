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
    steadfast?: Steadfast_Config;
    pathao?: Pathao_Config;
}
export { Pathao_Config, Steadfast_Config, Config };
