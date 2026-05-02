import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import CoffeeShopCard from '@/components/CoffeeShopCard';
import { getCityWithStats, getCoffeeShopsByCity, getPopularityByCity } from '@/data';

interface CityPageProps {
  params: {
    cityId: string;
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { cityId } = params;
  const cityStats = getCityWithStats(cityId);

  if (!cityStats) {
    notFound();
  }

  const cityCoffeeShops = getCoffeeShopsByCity(cityId);
  const cityPopularity = getPopularityByCity(cityId);

  const coffeeShopsWithPopularity = cityCoffeeShops
    .map(shop => {
      const popData = cityPopularity.find(p => p.coffeeShopId === shop.id);
      return {
        ...shop,
        popularityScore: popData?.popularityScore || 0,
        trend: 'stable' as const,
        city: cityStats,
        topCoffeeTypes: [],
      };
    })
    .sort((a, b) => b.popularityScore - a.popularityScore);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* City Header */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {cityStats.name}
            </h1>
            <p className="text-xl text-amber-100 mb-6">
              {cityStats.nameEn}, {cityStats.country}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">{cityStats.totalCoffeeShops}</div>
                <div className="text-amber-100">咖啡馆</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">{cityStats.averageRating.toFixed(1)}</div>
                <div className="text-amber-100">平均评分</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">{cityStats.totalReviews.toLocaleString()}</div>
                <div className="text-amber-100">总评价</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-3xl font-bold mb-2">
                  {cityPopularity.reduce((sum, p) => sum + p.orderCount, 0).toLocaleString()}
                </div>
                <div className="text-amber-100">订单数</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Shops List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              {cityStats.name}咖啡馆热度排名
            </h2>
            <p className="text-amber-700 max-w-2xl mx-auto">
              基于外卖平台数据，为您推荐{cityStats.name}最受欢迎的咖啡馆
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coffeeShopsWithPopularity.map((shop, index) => (
              <CoffeeShopCard key={shop.id} shop={shop} rank={index + 1} />
            ))}
          </div>
          
          {coffeeShopsWithPopularity.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">☕</div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">暂无数据</h3>
              <p className="text-amber-700">该城市暂无咖啡馆数据，请稍后再来查看</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}