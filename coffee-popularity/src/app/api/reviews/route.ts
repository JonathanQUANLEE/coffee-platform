import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, addReview, updateReview, deleteReview, getShopReviews } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coffeeShopId = searchParams.get('coffeeShopId');
    
    if (!coffeeShopId) {
      return NextResponse.json(
        { error: '请提供咖啡馆ID' },
        { status: 400 }
      );
    }

    const reviews = getShopReviews(coffeeShopId);
    
    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error: any) {
    console.error('获取评价错误:', error);
    return NextResponse.json(
      { error: error.message || '获取评价失败' },
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
    const { coffeeShopId, rating, content } = body;
    
    if (!coffeeShopId || !rating || !content) {
      return NextResponse.json(
        { error: '请提供完整的评价信息' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '评分应在1-5之间' },
        { status: 400 }
      );
    }

    const review = addReview(decoded.id, coffeeShopId, rating, content);
    
    return NextResponse.json({
      success: true,
      message: '评价成功',
      review,
    });
  } catch (error: any) {
    console.error('添加评价错误:', error);
    return NextResponse.json(
      { error: error.message || '添加评价失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { reviewId, rating, content } = body;
    
    if (!reviewId) {
      return NextResponse.json(
        { error: '请提供评价ID' },
        { status: 400 }
      );
    }

    const updatedReview = updateReview(reviewId, decoded.id, rating, content);
    
    if (!updatedReview) {
      return NextResponse.json(
        { error: '评价不存在或无权修改' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '更新成功',
      review: updatedReview,
    });
  } catch (error: any) {
    console.error('更新评价错误:', error);
    return NextResponse.json(
      { error: error.message || '更新评价失败' },
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
    const reviewId = searchParams.get('reviewId');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: '请提供评价ID' },
        { status: 400 }
      );
    }

    const success = deleteReview(reviewId, decoded.id);
    
    if (!success) {
      return NextResponse.json(
        { error: '评价不存在或无权删除' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '删除成功',
    });
  } catch (error: any) {
    console.error('删除评价错误:', error);
    return NextResponse.json(
      { error: error.message || '删除评价失败' },
      { status: 500 }
    );
  }
}