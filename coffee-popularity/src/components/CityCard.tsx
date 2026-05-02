import Link from 'next/link';
import { CityWithStats } from '@/types';

interface CityCardProps {
  city: CityWithStats;
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/city/${city.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-100 hover:border-amber-200 transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-amber-900">{city.name}</h3>
            <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              {city.nameEn}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-800">{city.totalCoffeeShops}</div>
              <div className="text-sm text-amber-600">咖啡馆</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-800">{city.averageRating.toFixed(1)}</div>
              <div className="text-sm text-amber-600">平均评分</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-amber-700">
            <span>总评价数: {city.totalReviews.toLocaleString()}</span>
            <span className="text-amber-500">查看详情 →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}