import { NextRequest, NextResponse } from 'next/server';
import { ScraperManager } from '@/scraper/manager';

const scraperManager = new ScraperManager(process.env.GAODE_API_KEY);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  const keyword = searchParams.get('keyword') || '咖啡';
  const platform = searchParams.get('platform');

  if (!city) {
    return NextResponse.json(
      { error: '请提供城市参数' },
      { status: 400 }
    );
  }

  try {
    let results;
    
    if (platform) {
      // 搜索单个平台
      const shops = await scraperManager.searchSinglePlatform(platform, city, keyword);
      results = { [platform]: shops };
    } else {
      // 搜索所有平台
      const allResults = await scraperManager.searchAllPlatforms(city, keyword);
      results = Object.fromEntries(allResults);
    }

    return NextResponse.json({
      success: true,
      city,
      keyword,
      results,
      platforms: scraperManager.getAvailablePlatforms(),
    });
  } catch (error) {
    console.error('爬虫API错误:', error);
    return NextResponse.json(
      { error: '搜索失败，请稍后重试' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, keyword = '咖啡', platforms } = body;

    if (!city) {
      return NextResponse.json(
        { error: '请提供城市参数' },
        { status: 400 }
      );
    }

    let results;
    
    if (platforms && Array.isArray(platforms)) {
      // 搜索指定平台
      const platformResults = new Map();
      for (const platform of platforms) {
        const shops = await scraperManager.searchSinglePlatform(platform, city, keyword);
        platformResults.set(platform, shops);
      }
      results = Object.fromEntries(platformResults);
    } else {
      // 搜索所有平台
      const allResults = await scraperManager.searchAllPlatforms(city, keyword);
      results = Object.fromEntries(allResults);
    }

    // 合并结果
    const mergedResults = await scraperManager.mergeResults(
      new Map(Object.entries(results))
    );

    return NextResponse.json({
      success: true,
      city,
      keyword,
      results,
      merged: mergedResults,
      platforms: scraperManager.getAvailablePlatforms(),
    });
  } catch (error) {
    console.error('爬虫API错误:', error);
    return NextResponse.json(
      { error: '搜索失败，请稍后重试' },
      { status: 500 }
    );
  }
}