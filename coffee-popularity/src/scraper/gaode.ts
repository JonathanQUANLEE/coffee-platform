import { BaseScraper, ScrapedCoffeeShop } from './base';

export class GaodeScraper extends BaseScraper {
  private apiKey: string;

  constructor(apiKey: string = '') {
    super('高德地图', 'https://restapi.amap.com');
    this.apiKey = apiKey;
  }

  async searchCoffeeShops(city: string, keyword: string = '咖啡'): Promise<ScrapedCoffeeShop[]> {
    try {
      // 高德地图POI搜索API
      const searchUrl = `${this.baseUrl}/v3/place/text?key=${this.apiKey}&keywords=${encodeURIComponent(keyword)}&city=${encodeURIComponent(city)}&citylimit=true&offset=20&page=1&extensions=all`;
      
      console.log(`[高德地图] 搜索城市: ${city}, 关键词: ${keyword}`);
      console.log(`[高德地图] 请求URL: ${searchUrl}`);
      
      // 如果没有API key，返回空数组
      if (!this.apiKey) {
        console.log('[高德地图] 未提供API key，跳过搜索');
        return [];
      }

      const response = await this.fetchWithRetry(searchUrl);
      const data = await response.json();
      
      if (data.status !== '1' || !data.pois) {
        console.error('[高德地图] 搜索失败:', data.info);
        return [];
      }

      return data.pois.map((poi: any) => ({
        name: poi.name,
        city: poi.cityname,
        address: poi.address,
        rating: 0,
        reviewCount: 0,
        priceRange: 'medium' as const,
        tags: poi.type ? poi.type.split(';') : [],
        source: '高德地图',
        phone: poi.tel,
        latitude: parseFloat(poi.location.split(',')[1]),
        longitude: parseFloat(poi.location.split(',')[0]),
      }));
    } catch (error) {
      console.error(`[高德地图] 搜索失败:`, error);
      return [];
    }
  }

  async getShopReviews(shopUrl: string): Promise<[]> {
    // 高德地图不提供评价功能
    return [];
  }

  async getShopDetail(poiId: string): Promise<any> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const detailUrl = `${this.baseUrl}/v3/place/detail?key=${this.apiKey}&id=${poiId}&extensions=all`;
      console.log(`[高德地图] 获取POI详情: ${poiId}`);
      
      const response = await this.fetchWithRetry(detailUrl);
      const data = await response.json();
      
      if (data.status !== '1' || !data.pois || data.pois.length === 0) {
        return null;
      }

      return data.pois[0];
    } catch (error) {
      console.error(`[高德地图] 获取详情失败:`, error);
      return null;
    }
  }
}