# Intelligent Chat 項目

## 項目概述
Intelligent Chat 是一個基於 Next.js 的智能聊天應用程序，支持與 OpenAI 和 DeepSeek 等 AI 模型的對話。項目採用 TypeScript 開發，使用 Prisma 進行數據庫管理，並實現了流式響應功能。

## 功能特性
- 支持多種 AI 模型（OpenAI, DeepSeek）
- 流式響應，實時顯示聊天內容
- 對話歷史管理
- 系統提示詞配置
- 主題切換功能

## 技術棧
- Next.js 14
- TypeScript
- Prisma
- Tailwind CSS
- OpenAI API

## 安裝指南

### 1. 克隆項目
`ash
git clone https://github.com/your-repo/intelligent-chat.git
cd intelligent-chat
`

### 2. 安裝依賴
`ash
npm install
`

### 3. 配置環境變量
創建 .env 文件並添加以下配置：
`env
DATABASE_URL=
file:./dev.db
OPENAI_API_KEY=your-openai-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
`

### 4. 初始化數據庫
`ash
npx prisma migrate dev --name init
`

## 運行項目

### 開發模式
`ash
npm run dev
`

### 生產模式
`ash
npm run build
npm start
`

## 配置說明

### API 配置
可以在 lib/configStore.ts 中修改默認的 API 配置：
- provider: 選擇使用的 AI 提供商（openai 或 deepseek）
- key: API 密鑰
- baseUrl: API 基礎地址

### 系統提示詞
可以在聊天界面中設置系統提示詞，默認為：
`
你是一位精通佛法及廣論的智者，能以慈悲和智慧回答关于佛教的问题。请用简单易懂的方式解释深奥的佛法概念。
`

## 貢獻指南
歡迎提交 Pull Request 或 Issue。請確保代碼風格一致並通過所有測試。

## 許可證
MIT
