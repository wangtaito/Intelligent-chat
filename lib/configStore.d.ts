declare module 'lib/configStore' {
  type ApiProvider = 'openai' | 'deepseek';

  interface ApiConfig {
    provider: ApiProvider;
    key: string;
    baseUrl: string;
  }

  export function getConfig(): ApiConfig;
  export function setConfig(config: ApiConfig): void;
  export function resetConfig(): void;
}
