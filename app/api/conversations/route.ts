import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 获取对话列表的异步函数
 *
 * @returns 返回一个Promise，解析为包含所有对话的JSON对象，或者在发生错误时返回错误信息和500状态码
 */
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        updatedAt: 'desc'
      }
    })
    
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('获取对话列表失败:', error)
    return NextResponse.json(
      { error: '获取对话列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { title = '新对话' } = await request.json()
    
    const conversation = await prisma.conversation.create({
      data: {
        title,
      }
    })
    
    return NextResponse.json(conversation)
  } catch (error) {
    console.error('创建对话失败:', error)
    return NextResponse.json(
      { error: '创建对话失败' },
      { status: 500 }
    )
  }
} 