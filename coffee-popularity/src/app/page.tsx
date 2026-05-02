'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CityCard from '@/components/CityCard';
import CoffeeShopCard from '@/components/CoffeeShopCard';
import { getAllCitiesWithStats, getCoffeeShops, getPopularityData } from '@/data';
import { useTranslations, Locale } from '@/i18n';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('zh');
  const { t } = useTranslations(locale);
  
  const citiesWithStats = getAllCitiesWithStats();
  const allCoffeeShops = getCoffeeShops();
  const allPopularity = getPopularityData();

  const topCoffeeShops = allCoffeeShops
    .map(shop => {
      const popData = allPopularity.find(p => p.coffeeShopId === shop.id);
      const city = citiesWithStats.find(c => c.id === shop.cityId);
      return {
        ...shop,
        popularityScore: popData?.popularityScore || 0,
        trend: 'stable' as const,
        city: city || citiesWithStats[0],
        topCoffeeTypes: [],
      };
    })
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      <Header locale={locale} onLocaleChange={setLocale} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-600 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-amber-600 rounded-lg font-bold hover:bg-amber-50 transition-colors">
                {t('home.startExploring')}
              </button>
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors">
                {t('home.learnMore')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {citiesWithStats.length}
              </div>
              <div className="text-amber-800">{t('home.coveredCities')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {allCoffeeShops.length}
              </div>
              <div className="text-amber-800">{t('home.coffeeShops')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {allCoffeeShops.reduce((sum, shop) => sum + shop.reviewCount, 0).toLocaleString()}
              </div>
              <div className="text-amber-800">{t('home.userReviews')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {allPopularity.reduce((sum, p) => sum + p.orderCount, 0).toLocaleString()}
              </div>
              <div className="text-amber-800">{t('home.orderData')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">{t('home.hotCities')}</h2>
            <p className="text-amber-700 max-w-2xl mx-auto">
              {t('home.hotCitiesDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citiesWithStats.slice(0, 6).map(city => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Coffee Shops Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">{t('home.popularityRanking')}</h2>
            <p className="text-amber-700 max-w-2xl mx-auto">
              {t('home.popularityRankingDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCoffeeShops.map((shop, index) => (
              <CoffeeShopCard key={shop.id} shop={shop} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">{t('home.whyChooseUs')}</h2>
            <p className="text-amber-700 max-w-2xl mx-auto">
              {t('home.whyChooseUsDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">{t('home.realtimeData')}</h3>
              <p className="text-amber-700">
                {t('home.realtimeDataDescription')}
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏙️</span>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">{t('home.multiCityCoverage')}</h3>
              <p className="text-amber-700">
                {t('home.multiCityCoverageDescription')}
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">☕</span>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">{t('home.coffeeEncyclopedia')}</h3>
              <p className="text-amber-700">
                {t('home.coffeeEncyclopediaDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white text-xl">☕</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">咖啡热度</h3>
                  <p className="text-sm text-amber-300">Coffee Popularity</p>
                </div>
              </div>
              <p className="text-amber-300 text-sm">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2 text-amber-300 text-sm">
                <li><a href="/" className="hover:text-white transition-colors">{t('common.home')}</a></li>
                <li><a href="/coffee-types" className="hover:text-white transition-colors">{t('common.coffeeTypes')}</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">{t('common.about')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">{t('footer.contactUs')}</h4>
              <ul className="space-y-2 text-amber-300 text-sm">
                <li>{t('footer.email')}: contact@coffeepopularity.com</li>
                <li>{t('footer.wechat')}: CoffeePopularity</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-400 text-sm">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}