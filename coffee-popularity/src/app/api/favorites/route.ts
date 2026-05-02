import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, addFavorite, removeFavorite, getUserFavorites, isFavorited } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '请提供有效的认证信息' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: '认证信息无效' },
        { status: 401 }
      );
    }

    const favorites = getUserFavorites(decoded.id);
    
    return NextResponse.json({
      success: true,
      favorites,
    });
  } catch (error: any) {
    console.error('获取收藏错误:', error);
    return NextResponse.json(
      { error: error.message || '获取收藏失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '请提供有效的认证信息' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: '认证信息无效' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { coffeeShopId } = body;
    
    if (!coffeeShopId) {
      return NextResponse.json(
        { error: '请提供咖啡馆ID' },
        { status: 400 }
      );
    }

    // 检查是否已收藏
    if (isFavorited(decoded.id, coffeeShopId)) {
      return NextResponse.json(
        { error: '已经收藏过了' },
        { status: 400 }
      );
    }

    const favorite = addFavorite(decoded.id, coffeeShopId);
    
    return NextResponse.json({
      success: true,
      message: '收藏成功',
      favorite,
    });
  } catch (error: any) {
    console.error('添加收藏错误:', error);
    return NextResponse.json(
      { error: error.message || '添加收藏失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '请提供有效的认证信息' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: '认证信息无效' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const coffeeShopId = searchParams.get('coffeeShopId');
    
    if (!coffeeShopId) {
      return NextResponse.json(
        { error: '请提供咖啡馆ID' },
        { status: 400 }
      );
    }

    const success = removeFavorite(decoded.id, coffeeShopId);
    
    if (!success) {
      return NextResponse.json(
        { error: '收藏不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '取消收藏成功',
    });
  } catch (error: any) {
    console.error('取消收藏错误:', error);
    return NextResponse.json(
      { error: error.message || '取消收藏失败' },
      { status: 500 }
    );
  }
}