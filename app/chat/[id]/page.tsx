'use client'

import React, { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: string
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 加载历史消息
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/messages?conversationId=${params.id}`)
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        console.error('加载消息失败:', error)
      }
    }
    loadMessages()
  }, [params.id])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return

    const userMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user' as const,
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: params.id,
          message: userMessage.content
        })
      })

      if (!response.ok) throw new Error('请求失败')
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('无法读取响应')

      const decoder = new TextDecoder()
      let aiMessageId = Date.now().toString()
      let aiMessage = {
        id: aiMessageId,
        content: '',
        role: 'assistant' as const,
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(5))
                if (data.content) {
                  aiMessage.content += data.content
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === aiMessageId ? { ...msg, content: aiMessage.content } : msg
                    )
                  )
                }
              } catch (e) {
                console.error('解析响应数据失败:', e)
              }
            }
          }
        }
      } catch (error) {
        console.error('读取流失败:', error)
      }
    } catch (error) {
      console.error('发送消息失败:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-lg p-4 ${
              message.role === 'user' 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t dark:border-gray-800 p-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="輸入消息..."
            className="flex-1 rounded-lg border dark:border-gray-700 p-3 
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 
                       transition-colors duration-200 disabled:opacity-50"
          >
            {sending ? '發送中...' : '發送'}
          </button>
        </div>
      </form>
    </div>
  )
} 