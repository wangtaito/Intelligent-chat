import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import ConversationList from '@/components/ConversationList'
import ThemeToggle from '@/components/ThemeToggle'
import { Providers } from './providers'
import ApiKeySelector from '@/components/ApiKeySelector'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "佛學千問V1.0",
  description: "探索佛法智識，尋找內心平靜",
};

/**
 * RootLayout 组件是应用的根布局组件，用于定义整个应用的布局结构。
 *
 * @param props 包含子组件的 props 对象
 * @param props.children 需要被渲染的子组件
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={`${inter.className} h-screen flex bg-gray-50 dark:bg-gray-900`}>
        <Providers>
          {/* 左侧边栏 */}
          <aside className="w-[260px] h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* 顶部搜索栏 */}
            <div className="flex gap-2 items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <a href="/" className="flex flex-1 gap-2 items-center px-4 py-2 text-white bg-indigo-500 rounded-md transition-colors hover:bg-indigo-600">
                <span>+</span>
                <span>新建对话</span>
              </a>
              <ThemeToggle />
              <button className="p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            {/* 对话列表 */}
            <div className="overflow-y-auto flex-1">
              <ConversationList />
            </div>
          </aside>

          {/* 主内容区 */}
          <main className="flex flex-col flex-1 bg-white dark:bg-gray-900">
            {/* 顶部标题栏 */}
            <div className="h-[60px] border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
              <h1 className="text-xl font-medium text-gray-900 dark:text-white mr-4">佛學千問 1.0</h1>
              <ApiKeySelector />
            </div>
            {/* 聊天内容区 */}
            <div className="overflow-hidden flex-1">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  )
} 