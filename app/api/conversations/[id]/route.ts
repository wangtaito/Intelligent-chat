import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 删除所有相关消息
    await prisma.message.deleteMany({
      where: { conversationId: params.id }
    })
    
    // 删除对话
    await prisma.conversation.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除对话失败:', error)
    return NextResponse.json(
      { error: '删除对话失败' },
      { status: 500 }
    )
  }
} 