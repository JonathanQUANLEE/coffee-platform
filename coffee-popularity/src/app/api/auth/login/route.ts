import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { LoginDTO } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: LoginDTO = await request.json();
    
    // 验证必填字段
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: '请提供邮箱和密码' },
        { status: 400 }
      );
    }

    const result = await loginUser(body);
    
    return NextResponse.json({
      success: true,
      message: '登录成功',
      ...result,
    });
  } catch (error: any) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: error.message || '登录失败，请稍后重试' },
      { status: 400 }
    );
  }
}