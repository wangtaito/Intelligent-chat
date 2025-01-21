'use client'

import { useState, useEffect } from 'react'

type ApiProvider = 'openai' | 'deepseek'

interface ApiConfig {
  provider: ApiProvider
  key: string
  baseUrl: string
}

const defaultConfigs: Record<ApiProvider, ApiConfig> = {
  openai: {
    provider: 'openai',
    key: 'sk-A4HWQhooLJLkNiUl2735E18b8249439fB9288bC6C4B08397',
    baseUrl: 'https://free.v36.cm/v1'
  },
  deepseek: {
    provider: 'deepseek',
    key: 'sk-361fff856c5f4c3c8697c166ed00868d',
    baseUrl: 'https://api.deepseek.com/v1'
  }
}

export default function ApiKeySelector() {
  const [mounted, setMounted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentProvider, setCurrentProvider] = useState<ApiProvider>('deepseek')
  const [configs] = useState(defaultConfigs)

  useEffect(() => {
    setMounted(true)
    // 从 localStorage 加载配置
    const savedConfig = localStorage.getItem('apiConfig')
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      setCurrentProvider(config.provider)
    }
  }, [])

  if (!mounted) return null

  const handleProviderChange = async (provider: ApiProvider) => {
    setCurrentProvider(provider)
    const config = configs[provider]
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        localStorage.setItem('apiConfig', JSON.stringify(config))
      }
    } catch (error) {
      console.error('更新配置失败:', error)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 
                   hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <span>{currentProvider === 'openai' ? 'OpenAI' : 'DeepSeek'}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              选择 API 提供商
            </h3>
            <div className="space-y-3">
              {Object.entries(configs).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => {
                    handleProviderChange(key as ApiProvider)
                    setShowModal(false)
                  }}
                  className={`w-full p-3 rounded-lg flex items-center justify-between
                    ${currentProvider === key 
                      ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                >
                  <span className="font-medium">{key === 'openai' ? 'OpenAI' : 'DeepSeek'}</span>
                  {currentProvider === key && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg 
                         hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                         text-gray-900 dark:text-white"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  )
} 