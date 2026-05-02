'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { realShanghaiShops, realBeijingShops, realGuangzhouShops } from '@/data/real-shanghai-shops';
import { getReviewsByShopId } from '@/data/real-reviews';

const allShops = [...realShanghaiShops, ...realBeijingShops, ...realGuangzhouShops];

const filterConfig: Record<string, { zh: string; en: string; filter: (shop: any) => boolean }> = {
  hot: { zh: '热门榜', en: 'Hot', filter: (shop) => shop.popularityScore >= 85 },
  'pour-over': { zh: '手冲精品', en: 'Pour Over', filter: (shop) => shop.features.some((f: string) => f.includes('手冲') || f.includes('精品')) },
  photogenic: { zh: '出片圣地', en: 'Photogenic', filter: (shop) => shop.features.some((f: string) => f.includes('拍照') || f.includes('网红') || f.includes('出片')) },
  work: { zh: '办公友好', en: 'Work Friendly', filter: (shop) => shop.features.some((f: string) => f.includes('办公') || f.includes('安静')) },
  'late-night': { zh: '深夜营业', en: 'Late Night', filter: (shop) => shop.openingHours && (shop.openingHours.includes('22:00') || shop.openingHours.includes('23:00')) },
  new: { zh: '新店首发', en: 'New', filter: (shop) => shop.popularityScore >= 80 },
};

const getShopImage = (id: number) => `https://picsum.photos/seed/shop${id}/800/600`;

export default function FilterPage() {
  const params = useParams();
  const filterSlug = params.filter as string;
  const { language, setLanguage, t } = useLanguage();
  
  const config = filterConfig[filterSlug] || filterConfig.hot;
  const filteredShops = allShops.filter(config.filter);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21V19H20V21H2ZM20 8V5H18V8H20ZM20 8C20 5.2 17.8 3 15 3H9C6.2 3 4 5.2 4 8V16C4 18.8 6.2 21 9 21H15C17.8 21 20 18.8 20 16V8Z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-stone-900">{t('咖啡热度', 'Coffee Pop')}</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-stone-600 hover:text-stone-900 font-medium">{t('首页', 'Home')}</Link>
              <Link href="/rankings/hot" className="text-stone-900 font-medium">{t('榜单', 'Rankings')}</Link>
              <Link href="/encyclopedia" className="text-stone-600 hover:text-stone-900 font-medium">{t('百科', 'Encyclopedia')}</Link>
              <Link href="/merchant/apply" className="text-stone-600 hover:text-stone-900 font-medium">{t('商家入驻', 'Merchant')}</Link>
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors">
                {language === 'zh' ? 'EN' : '中文'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-stone-500 hover:text-stone-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-stone-900">{t(config.zh, config.en)}</h1>
          </div>
          <p className="text-stone-500">{t(`共 ${filteredShops.length} 家咖啡馆`, `${filteredShops.length} coffee shops`)}</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(filterConfig).map(([slug, cfg]) => (
            <Link
              key={slug}
              href={`/rankings/${slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterSlug === slug
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {t(cfg.zh, cfg.en)}
            </Link>
          ))}
        </div>

        {/* Shop List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop, index) => {
            const shopReviews = getReviewsByShopId(shop.id);
            return (
              <Link
                key={shop.id}
                href={`/shops/${shop.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-stone-700 to-stone-900">
                  <img
                    src={getShopImage(index * 7 + 20)}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                    index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-stone-400' : index === 2 ? 'bg-amber-700' : 'bg-stone-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                    <span className="text-white font-bold text-sm">{shop.popularityScore}</span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-stone-900">{shop.name}</h3>
                      <p className="text-sm text-stone-500">{shop.district} · {shop.city}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="font-bold text-stone-800">{shop.rating}</span>
                      </div>
                      <p className="text-xs text-stone-500">{shop.reviewCount.toLocaleString()}{t('评价', 'reviews')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {shop.features.slice(0, 3).map((feature: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600 text-sm">
                      {t('人均', 'Avg')} <span className="font-bold text-stone-800">¥{shop.avgPrice}</span>
                    </span>
                    <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded font-medium">{shop.source}</span>
                  </div>

                  {shopReviews.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <p className="text-sm text-stone-600 line-clamp-2">
                        &ldquo;{shopReviews[0].content.slice(0, 50)}...&rdquo;
                      </p>
                      <span className="text-xs text-stone-400 mt-1 block">{shopReviews[0].username} · {shopReviews[0].date}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 text-stone-300">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">{t('暂无数据', 'No data yet')}</h3>
            <p className="text-stone-500">{t('该分类下暂无咖啡馆', 'No coffee shops in this category')}</p>
          </div>
        )}
      </main>
    </div>
  );
}