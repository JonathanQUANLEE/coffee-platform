import { BilibiliScraper, BilibiliComment } from './bilibili';
import { DouyinScraper, DouyinComment } from './douyin';
import { XiaohongshuScraper, XiaohongshuComment } from './xiaohongshu';
import { DataAnalyzer, CityCoffeeStats, ExtractedCoffeeShop } from './analyzer';

export interface SocialComment {
  id: string;
  username: string;
  content: string;
  like: number;
  timestamp: string;
  source: 'bilibili' | 'douyin' | 'xiaohongshu';
}

export interface ScrapingResult {
  city: string;
  comments: SocialComment[];
  extractedShops: ExtractedCoffeeShop[];
  stats: CityCoffeeStats;
  insights: string[];
  timestamp: string;
}

export class SocialMediaManager {
  private bilibiliScraper: BilibiliScraper;
  private douyinScraper: DouyinScraper;
  private xiaohongshuScraper: XiaohongshuScraper;
  private analyzer: DataAnalyzer;

  constructor() {
    this.bilibiliScraper = new BilibiliScraper();
    this.douyinScraper = new DouyinScraper();
    this.xiaohongshuScraper = new XiaohongshuScraper();
    this.analyzer = new DataAnalyzer();
  }

  async scrapeAllPlatforms(city: string, limit: number = 100): Promise<ScrapingResult> {
    console.log(`[社交媒体管理器] 开始爬取所有平台数据: ${city}`);
    
    const allComments: SocialComment[] = [];

    // 并行爬取所有平台
    const scrapingPromises = [
      this.scrapeBilibili(city, limit),
      this.scrapeDouyin(city, limit),
      this.scrapeXiaohongshu(city, limit),
    ];

    const results = await Promise.allSettled(scrapingPromises);
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allComments.push(...result.value);
      }
    }

    console.log(`[社交媒体管理器] 总共获取 ${allComments.length} 条评论`);

    // 提取咖啡馆信息
    const commentTexts = allComments.map(c => c.content);
    const extractedShops = this.analyzer.extractCoffeeShops(commentTexts, city, 'social');
    
    console.log(`[社交媒体管理器] 提取到 ${extractedShops.length} 家咖啡馆`);

    // 分析城市统计
    const stats = this.analyzer.analyzeCityStats(city, commentTexts, 'social');
    
    // 生成洞察
    const insights = this.analyzer.generateInsights([stats]);

    return {
      city,
      comments: allComments,
      extractedShops,
      stats,
      insights,
      timestamp: new Date().toISOString(),
    };
  }

  private async scrapeBilibili(city: string, limit: number): Promise<SocialComment[]> {
    try {
      const comments = await this.bilibiliScraper.searchCoffeeComments(city, limit);
      return comments.map(c => ({
        id: c.id,
        username: c.username,
        content: c.content,
        like: c.like,
        timestamp: c.timestamp,
        source: 'bilibili' as const,
      }));
    } catch (error) {
      console.error(`[B站] 爬取失败:`, error);
      return [];
    }
  }

  private async scrapeDouyin(city: string, limit: number): Promise<SocialComment[]> {
    try {
      const comments = await this.douyinScraper.searchCoffeeComments(city, limit);
      return comments.map(c => ({
        id: c.id,
        username: c.username,
        content: c.content,
        like: c.like,
        timestamp: c.timestamp,
        source: 'douyin' as const,
      }));
    } catch (error) {
      console.error(`[抖音] 爬取失败:`, error);
      return [];
    }
  }

  private async scrapeXiaohongshu(city: string, limit: number): Promise<SocialComment[]> {
    try {
      const comments = await this.xiaohongshuScraper.searchCoffeeComments(city, limit);
      return comments.map(c => ({
        id: c.id,
        username: c.username,
        content: c.content,
        like: c.like,
        timestamp: c.timestamp,
        source: 'xiaohongshu' as const,
      }));
    } catch (error) {
      console.error(`[小红书] 爬取失败:`, error);
      return [];
    }
  }

  async scrapeSinglePlatform(platform: string, city: string, limit: number = 50): Promise<SocialComment[]> {
    switch (platform) {
      case 'bilibili':
        return this.scrapeBilibili(city, limit);
      case 'douyin':
        return this.scrapeDouyin(city, limit);
      case 'xiaohongshu':
        return this.scrapeXiaohongshu(city, limit);
      default:
        console.error(`[社交媒体管理器] 未知平台: ${platform}`);
        return [];
    }
  }

  analyzeComments(comments: SocialComment[], city: string): CityCoffeeStats {
    const commentTexts = comments.map(c => c.content);
    return this.analyzer.analyzeCityStats(city, commentTexts, 'social');
  }

  extractShopsFromComments(comments: SocialComment[], city: string): ExtractedCoffeeShop[] {
    const commentTexts = comments.map(c => c.content);
    return this.analyzer.extractCoffeeShops(commentTexts, city, 'social');
  }
}