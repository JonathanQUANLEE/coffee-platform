import { NextRequest, NextResponse } from 'next/server';
import { SocialMediaManager } from '@/scraper/social-manager';

const socialManager = new SocialMediaManager();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  const platform = searchParams.get('platform');
  const limit = parseInt(searchParams.get('limit') || '100');

  if (!city) {
    return NextResponse.json(
      { error: '请提供城市参数' },
      { status: 400 }
    );
  }

  try {
    let result;
    
    if (platform) {
      // 爬取单个平台
      const comments = await socialManager.scrapeSinglePlatform(platform, city, limit);
      const stats = socialManager.analyzeComments(comments, city);
      const shops = socialManager.extractShopsFromComments(comments, city);
      
      result = {
        city,
        platform,
        comments,
        stats,
        extractedShops: shops,
      };
    } else {
      // 爬取所有平台
      result = await socialManager.scrapeAllPlatforms(city, limit);
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('社交媒体爬取API错误:', error);
    return NextResponse.json(
      { error: '爬取失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, platforms, limit = 100 } = body;

    if (!city) {
      return NextResponse.json(
        { error: '请提供城市参数' },
        { status: 400 }
      );
    }

    let result;
    
    if (platforms && Array.isArray(platforms)) {
      // 爬取指定平台
      const allComments = [];
      for (const platform of platforms) {
        const comments = await socialManager.scrapeSinglePlatform(platform, city, limit);
        allComments.push(...comments);
      }
      
      const stats = socialManager.analyzeComments(allComments, city);
      const shops = socialManager.extractShopsFromComments(allComments, city);
      
      result = {
        city,
        platforms,
        comments: allComments,
        stats,
        extractedShops: shops,
      };
    } else {
      // 爬取所有平台
      result = await socialManager.scrapeAllPlatforms(city, limit);
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('社交媒体爬取API错误:', error);
    return NextResponse.json(
      { error: '爬取失败，请稍后重试' },
      { status: 500 }
    );
  }
}