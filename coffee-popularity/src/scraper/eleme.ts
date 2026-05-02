import { BaseScraper, ScrapedCoffeeShop, ScrapedReview } from './base';

export class ElemeScraper extends BaseScraper {
  constructor() {
    super('饿了么', 'https://www.ele.me');
  }

  async searchCoffeeShops(city: string, keyword: string = '咖啡'): Promise<ScrapedCoffeeShop[]> {
    try {
      const cityCode = this.getCityCode(city);
      const searchUrl = `${this.baseUrl}/${cityCode}/search?keyword=${encodeURIComponent(keyword)}`;
      
      console.log(`[饿了么] 搜索城市: ${city}, 关键词: ${keyword}`);
      console.log(`[饿了么] 请求URL: ${searchUrl}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return [];
    } catch (error) {
      console.error(`[饿了么] 搜索失败:`, error);
      return [];
    }
  }

  async getShopReviews(shopUrl: string): Promise<ScrapedReview[]> {
    try {
      console.log(`[饿了么] 获取店铺评价: ${shopUrl}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    } catch (error) {
      console.error(`[饿了么] 获取评价失败:`, error);
      return [];
    }
  }

  async getShopRating(shopId: string): Promise<{ rating: number; reviewCount: number }> {
    try {
      console.log(`[饿了么] 获取店铺评分: ${shopId}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        rating: 0,
        reviewCount: 0,
      };
    } catch (error) {
      console.error(`[饿了么] 获取评分失败:`, error);
      return { rating: 0, reviewCount: 0 };
    }
  }

  private getCityCode(city: string): string {
    const cityCodes: Record<string, string> = {
      '北京': '1',
      '上海': '2',
      '广州': '34',
      '深圳': '34',
      '成都': '59',
      '杭州': '5',
      '武汉': '17',
      '南京': '10',
    };
    return cityCodes[city] || '1';
  }
}