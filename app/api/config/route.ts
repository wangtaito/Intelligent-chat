import { NextResponse } from 'next/server'
import { setConfig } from '@/lib/configStore'

export async function POST(request: Request) {
  try {
    const config = await request.json()
    setConfig(config)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('更新配置失败:', error)
    return NextResponse.json(
      { error: '更新配置失败' },
      { status: 500 }
    )
  }
} 