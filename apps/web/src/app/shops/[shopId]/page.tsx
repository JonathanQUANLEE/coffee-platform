'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { allShops, getReviewsByShopId } from '@/data/real-shops-data';

// 使用picsum.photos作为图片源
const getShopImage = (id: string) => `https://picsum.photos/seed/shop${id}/800/400`;
const getAvatar = (id: number) => `https://picsum.photos/seed/user${id}/100/100`;

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = params.shopId as string;
  const [activeTab, setActiveTab] = useState('reviews');
  const [isFavorited, setIsFavorited] = useState(false);

  const shop = allShops.find(s => s.id === shopId) || allShops[0];
  const reviews = getReviewsByShopId(shop.id);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-stone-800 to-amber-900">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-stone-800 font-medium hover:bg-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>

        {/* Shop Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{shop.name}</h1>
                <p className="text-white/80 flex items-center gap-2">
                  <span>📍</span>
                  {shop.city} · {shop.district} · {shop.address}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl text-center">
                <div className="text-3xl font-bold text-white">{shop.popularityScore}</div>
                <div className="text-xs text-white/70">热度指数</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <section className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-xl">★</span>
                <span className="text-2xl font-bold text-stone-800">{shop.rating}</span>
                <span className="text-stone-500">({shop.reviewCount.toLocaleString()}评价)</span>
              </div>
              <div className="h-6 w-px bg-stone-200"></div>
              <span className="text-stone-600">人均 <span className="font-bold text-stone-800">¥{shop.avgPrice}</span></span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  isFavorited
                    ? 'bg-red-50 text-red-500 border border-red-200'
                    : 'bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200'
                }`}
              >
                {isFavorited ? '❤️ 已收藏' : '🤍 收藏'}
              </button>
              <button className="px-5 py-2.5 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors">
                📍 导航
              </button>
              <button className="px-5 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-medium border border-stone-200 hover:bg-stone-200 transition-colors">
                📞 电话
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-stone-100 rounded-2xl">
              {[
                { id: 'info', label: '店铺信息' },
                { id: 'reviews', label: `用户评价 (${reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-stone-800 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-stone-200">
                  <h2 className="text-lg font-bold text-stone-900 mb-4">关于这家店</h2>
                  <p className="text-stone-700 leading-relaxed">{shop.description}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200">
                  <h2 className="text-lg font-bold text-stone-900 mb-4">特色标签</h2>
                  <div className="flex flex-wrap gap-3">
                    {shop.features.map((feature, idx) => (
                      <span key={idx} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {shop.signatureDrinks && (
                  <div className="bg-white rounded-2xl p-6 border border-stone-200">
                    <h2 className="text-lg font-bold text-stone-900 mb-4">招牌推荐</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {shop.signatureDrinks.map((drink, idx) => (
                        <div key={idx} className="text-center p-4 bg-stone-50 rounded-xl">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                            <span className="text-2xl">☕</span>
                          </div>
                          <span className="text-stone-800 font-medium text-sm">{drink}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photo Gallery */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200">
                  <h2 className="text-lg font-bold text-stone-900 mb-4">店铺照片</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-stone-300 to-stone-400">
                      <img
                        src={getShopImage(shop.id + '1')}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-amber-200 to-amber-300">
                      <img
                        src={getShopImage(shop.id + '2')}
                        alt="咖啡"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={review.id} className="bg-white rounded-2xl p-6 border border-stone-200">
                      <div className="flex items-start gap-4">
                        <img
                          src={getAvatar(index + 200)}
                          alt={review.username}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-stone-800">{review.username}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                review.source === '大众点评' ? 'bg-orange-500 text-white' :
                                review.source === '小红书' ? 'bg-red-500 text-white' :
                                review.source === 'B站' ? 'bg-blue-500 text-white' : 'bg-black text-white'
                              }`}>{review.source}</span>
                            </div>
                            <span className="text-sm text-stone-500">{review.date}</span>
                          </div>
                          <div className="flex text-amber-500 mb-2">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </div>
                          <p className="text-stone-700 leading-relaxed">{review.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-stone-500">
                            <button className="flex items-center gap-1 hover:text-stone-700">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              有用 ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center">
                    <div className="text-5xl mb-4">💬</div>
                    <h3 className="text-lg font-bold text-stone-800 mb-2">暂无评价</h3>
                    <p className="text-stone-500">成为第一个评价的人吧！</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <h2 className="text-lg font-bold text-stone-900 mb-4">基本信息</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-stone-400 mt-0.5">📍</span>
                  <div>
                    <p className="text-sm text-stone-500">地址</p>
                    <p className="text-stone-800">{shop.address}</p>
                  </div>
                </div>
                {shop.openingHours && (
                  <div className="flex items-start gap-3">
                    <span className="text-stone-400 mt-0.5">🕐</span>
                    <div>
                      <p className="text-sm text-stone-500">营业时间</p>
                      <p className="text-stone-800">{shop.openingHours}</p>
                    </div>
                  </div>
                )}
                {shop.phone && (
                  <div className="flex items-start gap-3">
                    <span className="text-stone-400 mt-0.5">📞</span>
                    <div>
                      <p className="text-sm text-stone-500">联系电话</p>
                      <p className="text-stone-800">{shop.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span className="text-stone-400 mt-0.5">💰</span>
                  <div>
                    <p className="text-sm text-stone-500">人均消费</p>
                    <p className="text-stone-800">¥{shop.avgPrice}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-stone-200">
              <h2 className="text-lg font-bold text-stone-900 mb-4">数据来源</h2>
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
                <span className="px-3 py-1 bg-orange-500 text-white text-sm rounded font-medium">{shop.source}</span>
                <div>
                  <p className="text-sm text-stone-500">数据来自</p>
                  <p className="font-medium text-stone-800">{shop.source}</p>
                </div>
              </div>
              <p className="text-xs text-stone-500 mt-3">数据更新至 2026年5月</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}