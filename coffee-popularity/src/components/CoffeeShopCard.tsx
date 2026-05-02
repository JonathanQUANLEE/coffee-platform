import Link from 'next/link';
import { CoffeeShopWithPopularity } from '@/types';

interface CoffeeShopCardProps {
  shop: CoffeeShopWithPopularity;
  rank?: number;
}

export default function CoffeeShopCard({ shop, rank }: CoffeeShopCardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getPopularityColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-50';
    if (score >= 80) return 'text-orange-600 bg-orange-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <Link href={`/coffee-shop/${shop.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-200 transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {rank && (
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                  {rank}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-amber-900">{shop.name}</h3>
                <p className="text-sm text-amber-600">{shop.nameEn}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getPopularityColor(shop.popularityScore)}`}>
              热度 {shop.popularityScore}
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-amber-700">
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>{shop.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{shop.reviewCount} 评价</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span>{shop.priceRange === 'low' ? '实惠' : shop.priceRange === 'medium' ? '中等' : '高端'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {shop.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-amber-600">{shop.address}</span>
            <div className="flex items-center gap-2">
              <span>{getTrendIcon(shop.trend)}</span>
              <span className="text-amber-500">查看详情 →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}