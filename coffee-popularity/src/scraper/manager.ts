import { DianpingScraper } from './dianping';
import { MeituanScraper } from './meituan';
import { ElemeScraper } from './eleme';
import { GaodeScraper } from './gaode';
import { ScrapedCoffeeShop } from './base';

export class ScraperManager {
  private scrapers: Map<string, any>;

  constructor(gaodeApiKey?: string) {
    this.scrapers = new Map();
    
    // 初始化各个平台爬虫
    this.scrapers.set('dianping', new DianpingScraper());
    this.scrapers.set('meituan', new MeituanScraper());
    this.scrapers.set('eleme', new ElemeScraper());
    this.scrapers.set('gaode', new GaodeScraper(gaodeApiKey));
  }

  async searchAllPlatforms(city: string, keyword: string = '咖啡'): Promise<Map<string, ScrapedCoffeeShop[]>> {
    const results = new Map<string, ScrapedCoffeeShop[]>();
    
    console.log(`[爬虫管理器] 开始搜索所有平台: ${city} - ${keyword}`);
    
    // 并行搜索所有平台
    const searchPromises = Array.from(this.scrapers.entries()).map(async ([platform, scraper]) => {
      try {
        const shops = await scraper.searchCoffeeShops(city, keyword);
        results.set(platform, shops);
        console.log(`[爬虫管理器] ${platform} 搜索完成，找到 ${shops.length} 家店铺`);
      } catch (error) {
        console.error(`[爬虫管理器] ${platform} 搜索失败:`, error);
        results.set(platform, []);
      }
    });

    await Promise.allSettled(searchPromises);
    
    return results;
  }

  async searchSinglePlatform(platform: string, city: string, keyword: string = '咖啡'): Promise<ScrapedCoffeeShop[]> {
    const scraper = this.scrapers.get(platform);
    if (!scraper) {
      console.error(`[爬虫管理器] 未知平台: ${platform}`);
      return [];
    }

    try {
      return await scraper.searchCoffeeShops(city, keyword);
    } catch (error) {
      console.error(`[爬虫管理器] ${platform} 搜索失败:`, error);
      return [];
    }
  }

  async mergeResults(results: Map<string, ScrapedCoffeeShop[]>): Promise<ScrapedCoffeeShop[]> {
    const merged: ScrapedCoffeeShop[] = [];
    const shopMap = new Map<string, ScrapedCoffeeShop>();

    for (const [platform, shops] of results) {
      for (const shop of shops) {
        const key = `${shop.name}-${shop.city}-${shop.address}`;
        const existing = shopMap.get(key);
        
        if (existing) {
          // 合并数据，优先保留评分更高的
          if (shop.rating > existing.rating) {
            shopMap.set(key, shop);
          }
        } else {
          shopMap.set(key, shop);
        }
      }
    }

    return Array.from(shopMap.values());
  }

  getAvailablePlatforms(): string[] {
    return Array.from(this.scrapers.keys());
  }
}