'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCoffeeTypeById } from '@/data/coffee-types-detailed';

export default function CoffeeDetailPage() {
  const params = useParams();
  const coffeeId = params.id as string;
  const { language, setLanguage, t } = useLanguage();
  
  const coffee = getCoffeeTypeById(coffeeId);

  if (!coffee) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">{t('咖啡类型未找到', 'Coffee type not found')}</h1>
          <Link href="/encyclopedia" className="text-amber-600 hover:text-amber-700">
            {t('返回百科', 'Back to Encyclopedia')}
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Hero Section */}
      <section className={`relative h-[500px] bg-gradient-to-br ${coffee.color} pt-16`}>
        <div className="absolute inset-0">
          <img
            src={coffee.image}
            alt={t(coffee.name.zh, coffee.name.en)}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-24 left-6 z-10">
          <Link href="/encyclopedia" className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-stone-800 font-medium hover:bg-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('返回', 'Back')}
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">{t(coffee.origin.zh, coffee.origin.en)}</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">{coffee.caffeine}</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">{coffee.temperature}</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">{t(coffee.name.zh, coffee.name.en)}</h1>
            <p className="text-xl text-white/80">{coffee.name.en}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Taste Profile */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <h2 className="text-lg font-bold text-stone-900 mb-4">{t('风味特点', 'Flavor Profile')}</h2>
              <p className="text-stone-700 leading-relaxed text-lg">{t(coffee.taste.zh, coffee.taste.en)}</p>
            </div>

            {/* History */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <h2 className="text-lg font-bold text-stone-900 mb-4">{t('历史起源', 'History & Origin')}</h2>
              <p className="text-stone-700 leading-relaxed">{t(coffee.history.zh, coffee.history.en)}</p>
            </div>

            {/* Suitable For */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <h2 className="text-lg font-bold text-stone-900 mb-4">{t('适合人群', 'Suitable For')}</h2>
              <p className="text-stone-700 leading-relaxed">{t(coffee.suitableFor.zh, coffee.suitableFor.en)}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Taste Bars */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <h2 className="text-lg font-bold text-stone-900 mb-4">{t('口味指标', 'Taste Indicators')}</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-stone-600">{t('苦度', 'Bitterness')}</span>
                    <span className="text-stone-800 font-medium">{coffee.bitterness}/5</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-stone-700 rounded-full" style={{ width: `${coffee.bitterness * 20}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-stone-600">{t('酸度', 'Acidity')}</span>
                    <span className="text-stone-800 font-medium">{coffee.acidity}/5</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${coffee.acidity * 20}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-stone-600">{t('甜度', 'Sweetness')}</span>
                    <span className="text-stone-800 font-medium">{coffee.sweetness}/5</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-400 rounded-full" style={{ width: `${coffee.sweetness * 20}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <h2 className="text-lg font-bold text-stone-900 mb-4">{t('基本信息', 'Quick Info')}</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{t('起源地', 'Origin')}</span>
                  <span className="text-stone-800 font-medium">{t(coffee.origin.zh, coffee.origin.en)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{t('咖啡因', 'Caffeine')}</span>
                  <span className="text-stone-800 font-medium">{coffee.caffeine}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{t('温度', 'Temperature')}</span>
                  <span className="text-stone-800 font-medium">{coffee.temperature}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{t('加奶量', 'Milk')}</span>
                  <span className="text-stone-800 font-medium">
                    {coffee.milk === 'none' ? t('无', 'None') :
                     coffee.milk === 'little' ? t('少量', 'Little') :
                     coffee.milk === 'medium' ? t('中等', 'Medium') : t('多', 'Lots')}
                  </span>
                </div>
              </div>
            </div>

            {/* Find Shops */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h2 className="text-lg font-bold text-stone-900 mb-2">{t('想试试？', 'Want to try?')}</h2>
              <p className="text-stone-600 text-sm mb-4">{t('看看附近哪些店有这款咖啡', 'Find shops serving this coffee')}</p>
              <Link href="/rankings/hot" className="block w-full py-3 bg-stone-900 text-white rounded-xl font-medium text-center hover:bg-stone-800 transition-colors">
                {t('查看榜单', 'View Rankings')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}