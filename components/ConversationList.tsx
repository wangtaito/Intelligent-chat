'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

interface Conversation {
  id: string
  title: string
  createdAt: string
}

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetchConversations()
  }, [pathname])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error('加载对话列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault() // 阻止链接跳转
    if (!confirm('确定要删除这个对话吗？')) return

    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== id))
        // 如果当前正在查看被删除的对话，则返回首页
        if (pathname === `/chat/${id}`) {
          router.push('/')
        }
      }
    } catch (error) {
      console.error('删除对话失败:', error)
    }
  }

  return (
    <div className="p-2 space-y-2">
      {loading ? (
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      ) : (
        conversations.map((conv) => (
          <div key={conv.id} className="group relative">
            <Link
              href={`/chat/${conv.id}`}
              className={`block p-3 pr-12 rounded-lg transition-colors ${
                pathname === `/chat/${conv.id}`
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              <div className="text-sm font-medium truncate">{conv.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(conv.createdAt).toLocaleDateString()}
              </div>
            </Link>
            <button
              onClick={(e) => handleDelete(conv.id, e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 
                         text-gray-400 dark:text-gray-500
                         hover:text-red-500 dark:hover:text-red-400 
                         opacity-0 group-hover:opacity-100 transition-opacity"
              title="删除对话"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  )
}