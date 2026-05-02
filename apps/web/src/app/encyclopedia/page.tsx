'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { coffeeTypesDetailed } from '@/data/coffee-types-detailed';

export default function EncyclopediaPage() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string | null>(null);

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
              <Link href="/rankings/hot" className="text-stone-600 hover:text-stone-900 font-medium">{t('榜单', 'Rankings')}</Link>
              <Link href="/encyclopedia" className="text-stone-900 font-medium">{t('百科', 'Encyclopedia')}</Link>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">{t('咖啡百科', 'Coffee Encyclopedia')}</h1>
          <p className="text-stone-500 text-lg">{t('了解每种咖啡的特点，找到你的最爱', 'Learn about each coffee type, find your favorite')}</p>
        </div>

        {/* Coffee Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coffeeTypesDetailed.map((coffee) => (
            <Link
              key={coffee.id}
              href={`/encyclopedia/${coffee.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Coffee Image */}
              <div className={`relative h-56 bg-gradient-to-br ${coffee.color} overflow-hidden`}>
                <img
                  src={coffee.image}
                  alt={t(coffee.name.zh, coffee.name.en)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{t(coffee.name.zh, coffee.name.en)}</h3>
                  <p className="text-white/80 text-sm">{t(coffee.name.en, coffee.name.zh)}</p>
                </div>
              </div>

              {/* Coffee Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">{t(coffee.origin.zh, coffee.origin.en)}</span>
                  <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs">{coffee.caffeine}</span>
                </div>
                
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">{t(coffee.taste.zh, coffee.taste.en)}</p>

                {/* Taste Indicators */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">{t('苦度', 'Bitter')}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`w-4 h-2 rounded-full ${i <= coffee.bitterness ? 'bg-stone-700' : 'bg-stone-200'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">{t('酸度', 'Acid')}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`w-4 h-2 rounded-full ${i <= coffee.acidity ? 'bg-amber-500' : 'bg-stone-200'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">{t('甜度', 'Sweet')}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`w-4 h-2 rounded-full ${i <= coffee.sweetness ? 'bg-pink-400' : 'bg-stone-200'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-stone-100">
                  <p className="text-xs text-stone-500">{t('适合', 'Suitable for')}: {t(coffee.suitableFor.zh, coffee.suitableFor.en)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}