export interface ScrapedCoffeeShop {
  name: string;
  nameEn?: string;
  city: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceRange: 'low' | 'medium' | 'high';
  tags: string[];
  source: string;
  url?: string;
  phone?: string;
  openingHours?: string;
  description?: string;
}

export interface ScrapedReview {
  userName: string;
  rating: number;
  content: string;
  date: string;
  source: string;
  helpful?: number;
}

export abstract class BaseScraper {
  protected sourceName: string;
  protected baseUrl: string;

  constructor(sourceName: string, baseUrl: string) {
    this.sourceName = sourceName;
    this.baseUrl = baseUrl;
  }

  abstract searchCoffeeShops(city: string, keyword?: string): Promise<ScrapedCoffeeShop[]>;
  abstract getShopReviews(shopUrl: string): Promise<ScrapedReview[]>;
  
  protected async fetchWithRetry(url: string, options?: RequestInit, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/html, */*',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            ...options?.headers,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Max retries reached');
  }

  protected parseRating(ratingStr: string): number {
    const match = ratingStr.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  protected parseReviewCount(countStr: string): number {
    const match = countStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  protected determinePriceRange(avgPrice: number): 'low' | 'medium' | 'high' {
    if (avgPrice < 20) return 'low';
    if (avgPrice < 40) return 'medium';
    return 'high';
  }
}