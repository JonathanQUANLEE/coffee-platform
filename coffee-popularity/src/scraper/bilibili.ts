import { BaseScraper } from './base';

export interface BilibiliComment {
  id: string;
  username: string;
  content: string;
  like: number;
  replyCount: number;
  timestamp: string;
  source: 'bilibili';
}

export interface BilibiliVideo {
  id: string;
  title: string;
  description: string;
  viewCount: number;
  danmakuCount: number;
  replyCount: number;
  upName: string;
  timestamp: string;
}

export class BilibiliScraper extends BaseScraper {
  private csrf: string = '';

  constructor() {
    super('B站', 'https://api.bilibili.com');
  }

  async searchVideos(keyword: string, page: number = 1, pageSize: number = 20): Promise<BilibiliVideo[]> {
    try {
      const searchUrl = `${this.baseUrl}/x/web-interface/search/type?search_type=video&keyword=${encodeURIComponent(keyword)}&page=${page}&pagesize=${pageSize}`;
      
      console.log(`[B站] 搜索视频: ${keyword}, 第${page}页`);
      
      const response = await this.fetchWithRetry(searchUrl, {
        headers: {
          'Referer': 'https://search.bilibili.com',
        },
      });
      const data = await response.json();
      
      if (data.code !== 0 || !data.data?.result) {
        console.error('[B站] 搜索失败:', data.message);
        return [];
      }

      return data.data.result.map((item: any) => ({
        id: String(item.bvid),
        title: this.cleanHtml(item.title),
        description: this.cleanHtml(item.description || ''),
        viewCount: item.play || 0,
        danmakuCount: item.video_review || 0,
        replyCount: item.review || 0,
        upName: item.author || '',
        timestamp: this.formatTimestamp(item.pubdate || 0),
      }));
    } catch (error) {
      console.error(`[B站] 搜索视频失败:`, error);
      return [];
    }
  }

  async getVideoComments(oid: number, page: number = 1, pageSize: number = 20): Promise<BilibiliComment[]> {
    try {
      const commentUrl = `${this.baseUrl}/x/v2/reply?type=1&oid=${oid}&pn=${page}&ps=${pageSize}&sort=1`;
      
      console.log(`[B站] 获取视频评论: ${oid}, 第${page}页`);
      
      const response = await this.fetchWithRetry(commentUrl, {
        headers: {
          'Referer': 'https://www.bilibili.com',
        },
      });
      const data = await response.json();
      
      if (data.code !== 0 || !data.data?.replies) {
        console.error('[B站] 获取评论失败:', data.message);
        return [];
      }

      return data.data.replies.map((item: any) => ({
        id: String(item.rpid),
        username: item.member?.uname || '',
        content: item.content?.message || '',
        like: item.like || 0,
        replyCount: item.rcount || 0,
        timestamp: this.formatTimestamp(item.ctime || 0),
        source: 'bilibili' as const,
      }));
    } catch (error) {
      console.error(`[B站] 获取评论失败:`, error);
      return [];
    }
  }

  async searchCoffeeComments(city: string = '全国', limit: number = 100): Promise<BilibiliComment[]> {
    const keywords = [
      `${city}咖啡店推荐`,
      `${city}咖啡馆`,
      `${city}必喝咖啡`,
      `${city}咖啡探店`,
      '咖啡推荐',
      '咖啡店打卡',
    ];

    const allComments: BilibiliComment[] = [];
    
    for (const keyword of keywords) {
      try {
        const videos = await this.searchVideos(keyword, 1, 10);
        
        for (const video of videos.slice(0, 3)) {
          // 将bvid转换为oid进行评论获取
          const oid = await this.getBvidToOid(video.id);
          if (oid) {
            const comments = await this.getVideoComments(oid, 1, 20);
            allComments.push(...comments);
          }
          
          // 避免请求过快
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (allComments.length >= limit) break;
      } catch (error) {
        console.error(`[B站] 搜索关键词失败: ${keyword}`, error);
      }
    }

    return allComments.slice(0, limit);
  }

  private async getBvidToOid(bvid: string): Promise<number | null> {
    try {
      const url = `${this.baseUrl}/x/web-interface/view?bvid=${bvid}`;
      const response = await this.fetchWithRetry(url);
      const data = await response.json();
      
      if (data.code === 0 && data.data) {
        return data.data.aid;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private cleanHtml(text: string): string {
    return text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '');
  }

  private formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toISOString();
  }

  async searchCoffeeShops(city: string, keyword: string = '咖啡'): Promise<any[]> {
    const videos = await this.searchVideos(`${city} ${keyword}`);
    return videos.map(v => ({
      name: v.title,
      city,
      source: 'B站',
      description: v.description,
    }));
  }

  async getShopReviews(shopUrl: string): Promise<any[]> {
    return [];
  }
}