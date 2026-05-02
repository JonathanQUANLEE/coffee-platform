import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getUserById, getUserFavorites, getUserReviews } from '@/lib/auth';

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

    const user = getUserById(decoded.id);
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 获取用户收藏和评价
    const favorites = getUserFavorites(user.id);
    const reviews = getUserReviews(user.id);
    
    // 计算平均评分
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        favorites,
        reviews,
        stats: {
          totalFavorites: favorites.length,
          totalReviews: reviews.length,
          averageRating: Math.round(averageRating * 10) / 10,
        },
      },
    });
  } catch (error: any) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { error: error.message || '获取用户信息失败' },
      { status: 500 }
    );
  }
}