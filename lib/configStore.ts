type ApiProvider = 'openai' | 'deepseek'

interface ApiConfig {
  provider: ApiProvider
  key: string
  baseUrl: string
}

const defaultConfig: ApiConfig = {
  provider: 'deepseek',
  key: 'sk-361fff856c5f4c3c8697c166ed00868d',
  baseUrl: 'https://api.deepseek.com/v1'
}

// 使用闭包来保存配置状态
const configStore = () => {
  let currentConfig = defaultConfig

  return {
    getConfig: () => currentConfig,
    setConfig: (config: ApiConfig) => {
      currentConfig = config
    },
    resetConfig: () => {
      currentConfig = defaultConfig
    }
  }
}

export const { getConfig, setConfig, resetConfig } = configStore() 