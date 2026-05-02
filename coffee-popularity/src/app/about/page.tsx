'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useTranslations, Locale } from '@/i18n';

export default function AboutPage() {
  const [locale, setLocale] = useState<Locale>('zh');
  const { t } = useTranslations(locale);

  return (
    <div className="min-h-screen">
      <Header locale={locale} onLocaleChange={setLocale} />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            关于我们
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            了解咖啡热度，了解我们的使命和愿景
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-amber-900 mb-6">我们的使命</h2>
              <p className="text-amber-700 leading-relaxed mb-6">
                咖啡热度致力于为咖啡爱好者提供最全面、最准确的咖啡馆热度数据。我们通过收集和分析外卖平台的数据，帮助用户发现最受欢迎的咖啡馆，了解不同城市的咖啡文化。
              </p>
              <p className="text-amber-700 leading-relaxed">
                我们相信，每一杯咖啡都承载着独特的故事和文化。通过我们的平台，用户可以不仅找到好喝的咖啡，还能了解咖啡的历史、种类和特点，成为真正的咖啡专家。
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-amber-900 mb-6">我们的愿景</h2>
              <p className="text-amber-700 leading-relaxed mb-6">
                我们希望成为咖啡爱好者最信赖的伙伴，帮助他们在茫茫咖啡海中找到属于自己的那一杯。我们计划覆盖更多城市，提供更丰富的数据，让每个人都能轻松发现身边的好咖啡馆。
              </p>
              <p className="text-amber-700 leading-relaxed">
                未来，我们还将推出更多功能，如咖啡馆预约、咖啡课程推荐等，为用户提供更全面的咖啡体验服务。
              </p>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">我们的优势</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-4">数据准确</h3>
                <p className="text-amber-700">
                  基于外卖平台实时数据，确保热度排名的准确性和时效性
                </p>
              </div>
              
              <div className="text-center p-8 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🏙️</span>
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-4">覆盖广泛</h3>
                <p className="text-amber-700">
                  覆盖全国主要城市，满足不同地区用户的需求
                </p>
              </div>
              
              <div className="text-center p-8 bg-white rounded-xl shadow-md">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">☕</span>
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-4">内容丰富</h3>
                <p className="text-amber-700">
                  除了热度排名，还提供咖啡百科、店铺详情等丰富内容
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-amber-900 mb-6">联系我们</h2>
            <p className="text-amber-700 mb-8">
              如果您有任何问题或建议，欢迎随时联系我们
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors">
                发送邮件
              </button>
              <button className="px-8 py-3 border-2 border-amber-500 text-amber-600 rounded-lg font-bold hover:bg-amber-50 transition-colors">
                微信联系
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}