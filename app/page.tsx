'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    setLoading(true)
    try {
      // 创建新对话
      const convResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: input.trim() })
      })
      const conversation = await convResponse.json()

      // 发送第一条消息并等待完成
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: conversation.id,
          message: input.trim()
        })
      })

      if (!chatResponse.ok) throw new Error('发送消息失败')

      // 等待流式响应完成
      const reader = chatResponse.body?.getReader()
      if (reader) {
        while (true) {
          const { done } = await reader.read()
          if (done) break
        }
      }

      // 完成后跳转
      router.push(`/chat/${conversation.id}`)
    } catch (error) {
      console.error('创建对话失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">佛學千問</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            探索佛法智慧，尋找內心平靜
          </p>
        </div>
      </div>
      <div className="border-t dark:border-gray-800">
        <div className="max-w-3xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="請輸入您的問題..."
              className="flex-1 rounded-lg border dark:border-gray-700 p-3 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 
                       transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? '發送中...' : '發送'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 