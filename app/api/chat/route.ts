import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { getConfig } from '@/lib/configStore'
import { prisma } from '@/lib/prisma'
import { Message } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const { conversationId, message } = await request.json()
    const config = getConfig()

    // 创建 OpenAI 客户端实例
    const openai = new OpenAI({
      apiKey: config.key,
      baseURL: config.baseUrl
    })

    // 获取对话历史
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    })

    // 保存用户消息
    await prisma.message.create({
      data: {
        content: message,
        role: 'user',
        conversationId
      }
    })

    // 构建消息历史
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: '你是一位精通佛法的智者，能以慈悲和智慧回答关于佛教的问题。请用简单易懂的方式解释深奥的佛法概念。'
      },
      ...history.map((msg: Message) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    // 创建流式响应
    const response = new TransformStream()
    const writer = response.writable.getWriter()
    const encoder = new TextEncoder()

    // 开始流式响应
    openai.chat.completions.create({
      model: config.provider === 'deepseek' ? 'deepseek-chat' : 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true
    }).then(async (stream) => {
      try {
        let fullContent = ''
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullContent += content
            await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
          }
        }

        // 保存完整响应
        await prisma.message.create({
          data: {
            content: fullContent,
            role: 'assistant',
            conversationId
          }
        })

        // 更新对话标题（如果是第一条消息）
        if (history.length === 0) {
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { title: message.slice(0, 50) }
          })
        }
      } catch (error) {
        console.error('流处理错误:', error)
      } finally {
        await writer.close()
      }
    }).catch(async (error) => {
      console.error('OpenAI API 错误:', error)
      const errorMessage = JSON.stringify({ error: '处理消息失败' })
      await writer.write(encoder.encode(`data: ${errorMessage}\n\n`))
      await writer.close()
    })

    return new Response(response.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    })
  } catch (error) {
    console.error('处理消息失败:', error)
    return NextResponse.json(
      { error: '处理消息失败' },
      { status: 500 }
    )
  }
} 