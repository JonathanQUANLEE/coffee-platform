export interface ExtractedCoffeeShop {
  name: string;
  city: string;
  source: string;
  mentionCount: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  comments: string[];
}

export interface CoffeeTrend {
  keyword: string;
  count: number;
  trend: 'rising' | 'stable' | 'falling';
}

export interface CityCoffeeStats {
  city: string;
  totalMentions: number;
  topShops: ExtractedCoffeeShop[];
  popularKeywords: string[];
  averageSentiment: number;
}

export class DataAnalyzer {
  private coffeeShopPatterns = [
    /(.+?)(?:咖啡|coffee|cafe|Cafe| Café)/i,
    /(?:去|到|在|推荐)(.+?)(?:喝咖啡|喝|坐坐|打卡)/,
    /(.+?)(?:店|馆|厅)/,
  ];

  private positiveKeywords = [
    '好喝', '推荐', '喜欢', '不错', '棒', '赞', '惊艳', '绝了',
    '必去', '宝藏', '良心', '超好', '很好', '太好', '真的好',
    '好喝', '好喝', '好喝', '好喝', '好喝', '好喝', '好喝', '好喝',
  ];

  private negativeKeywords = [
    '难喝', '失望', '一般', '不推荐', '踩雷', '避雷', '太贵',
    '不值', '难', '差', '不好', '不行', '太差', '真的差',
  ];

  private commonKeywords = [
    '拿铁', '美式', '卡布奇诺', '摩卡', '浓缩', '手冲',
    '环境', '服务', '价格', '位置', '装修', '氛围',
    '拍照', '打卡', '下午茶', '甜点', '蛋糕', '简餐',
  ];

  extractCoffeeShops(comments: string[], city: string, source: string): ExtractedCoffeeShop[] {
    const shopMap = new Map<string, ExtractedCoffeeShop>();

    for (const comment of comments) {
      const shopName = this.extractShopName(comment);
      if (shopName) {
        const existing = shopMap.get(shopName);
        if (existing) {
          existing.mentionCount++;
          existing.comments.push(comment);
          this.updateSentiment(existing, comment);
          this.updateKeywords(existing, comment);
        } else {
          const newShop: ExtractedCoffeeShop = {
            name: shopName,
            city,
            source,
            mentionCount: 1,
            sentiment: this.analyzeSentiment(comment),
            keywords: this.extractKeywords(comment),
            comments: [comment],
          };
          shopMap.set(shopName, newShop);
        }
      }
    }

    return Array.from(shopMap.values())
      .sort((a, b) => b.mentionCount - a.mentionCount);
  }

  private extractShopName(text: string): string | null {
    for (const pattern of this.coffeeShopPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = match[1].trim();
        if (name.length >= 2 && name.length <= 20) {
          return name;
        }
      }
    }
    return null;
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    let positiveCount = 0;
    let negativeCount = 0;

    for (const keyword of this.positiveKeywords) {
      if (text.includes(keyword)) positiveCount++;
    }

    for (const keyword of this.negativeKeywords) {
      if (text.includes(keyword)) negativeCount++;
    }

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private updateSentiment(shop: ExtractedCoffeeShop, comment: string) {
    const sentiment = this.analyzeSentiment(comment);
    if (sentiment === 'positive') {
      shop.mentionCount += 0.1;
    } else if (sentiment === 'negative') {
      shop.mentionCount -= 0.05;
    }
  }

  private extractKeywords(text: string): string[] {
    const keywords: string[] = [];
    
    for (const keyword of this.commonKeywords) {
      if (text.includes(keyword)) {
        keywords.push(keyword);
      }
    }
    
    // 提取可能是咖啡类型的词
    const coffeeTypes = ['拿铁', '美式', '卡布奇诺', '摩卡', '浓缩', '手冲', '澳白', '馥芮白'];
    for (const type of coffeeTypes) {
      if (text.includes(type) && !keywords.includes(type)) {
        keywords.push(type);
      }
    }
    
    return keywords;
  }

  private updateKeywords(shop: ExtractedCoffeeShop, comment: string) {
    const newKeywords = this.extractKeywords(comment);
    for (const keyword of newKeywords) {
      if (!shop.keywords.includes(keyword)) {
        shop.keywords.push(keyword);
      }
    }
  }

  analyzeTrends(comments: string[]): CoffeeTrend[] {
    const keywordCount = new Map<string, number>();
    
    for (const comment of comments) {
      const keywords = this.extractKeywords(comment);
      for (const keyword of keywords) {
        keywordCount.set(keyword, (keywordCount.get(keyword) || 0) + 1);
      }
    }

    return Array.from(keywordCount.entries())
      .map(([keyword, count]) => ({
        keyword,
        count,
        trend: 'stable' as const,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  analyzeCityStats(city: string, comments: string[], source: string): CityCoffeeStats {
    const shops = this.extractCoffeeShops(comments, city, source);
    const trends = this.analyzeTrends(comments);
    
    // 计算平均情感分数
    let sentimentScore = 0;
    let sentimentCount = 0;
    
    for (const shop of shops) {
      for (const comment of shop.comments) {
        const sentiment = this.analyzeSentiment(comment);
        if (sentiment === 'positive') sentimentScore += 1;
        else if (sentiment === 'negative') sentimentScore -= 1;
        sentimentCount++;
      }
    }

    const averageSentiment = sentimentCount > 0 ? sentimentScore / sentimentCount : 0;

    return {
      city,
      totalMentions: comments.length,
      topShops: shops.slice(0, 10),
      popularKeywords: trends.slice(0, 10).map(t => t.keyword),
      averageSentiment,
    };
  }

  generateInsights(stats: CityCoffeeStats[]): string[] {
    const insights: string[] = [];

    // 找出最热门的城市
    const sortedByMentions = [...stats].sort((a, b) => b.totalMentions - a.totalMentions);
    if (sortedByMentions.length > 0) {
      insights.push(`${sortedByMentions[0].city}是讨论最多的咖啡城市，共有${sortedByMentions[0].totalMentions}条相关评论`);
    }

    // 找出最受欢迎的关键词
    const allKeywords = new Map<string, number>();
    for (const stat of stats) {
      for (const keyword of stat.popularKeywords) {
        allKeywords.set(keyword, (allKeywords.get(keyword) || 0) + 1);
      }
    }
    
    const topKeywords = Array.from(allKeywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (topKeywords.length > 0) {
      insights.push(`最受欢迎的咖啡关键词是：${topKeywords.map(k => k[0]).join('、')}`);
    }

    // 找出情感最积极的城市
    const sortedBySentiment = [...stats].sort((a, b) => b.averageSentiment - a.averageSentiment);
    if (sortedBySentiment.length > 0 && sortedBySentiment[0].averageSentiment > 0) {
      insights.push(`${sortedBySentiment[0].city}的咖啡评论情感最积极，用户满意度最高`);
    }

    return insights;
  }
}