import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { CreateUserDTO } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserDTO = await request.json();
    
    // 验证必填字段
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { error: '请提供完整的注册信息' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少6位' },
        { status: 400 }
      );
    }

    // 验证用户名长度
    if (body.username.length < 2 || body.username.length > 20) {
      return NextResponse.json(
        { error: '用户名长度应在2-20位之间' },
        { status: 400 }
      );
    }

    const result = await createUser(body);
    
    return NextResponse.json({
      success: true,
      message: '注册成功',
      ...result,
    });
  } catch (error: any) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: error.message || '注册失败，请稍后重试' },
      { status: 400 }
    );
  }
}