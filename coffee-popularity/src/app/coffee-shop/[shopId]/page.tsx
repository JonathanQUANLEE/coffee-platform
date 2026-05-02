'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations, Locale } from '@/i18n';
import { getCoffeeShopById, getCityById, getPopularityByCoffeeShop } from '@/data';

export default function CoffeeShopPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopId as string;
  
  const [locale, setLocale] = useState<Locale>('zh');
  const { t } = useTranslations(locale);
  const { user } = useAuth();
  
  const [shop, setShop] = useState<any>(null);
  const [city, setCity] = useState<any>(null);
  const [popularity, setPopularity] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 评价表单
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    loadData();
  }, [shopId]);

  useEffect(() => {
    if (user && shop) {
      checkFavorite();
    }
  }, [user, shop]);

  const loadData = async () => {
    setIsLoading(true);
    
    const shopData = getCoffeeShopById(shopId);
    if (shopData) {
      setShop(shopData);
      const cityData = getCityById(shopData.cityId);
      setCity(cityData);
      
      const popData = getPopularityByCoffeeShop(shopId);
      setPopularity(popData[0] || null);
    }
    
    setIsLoading(false);
  };

  const checkFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setIsFavorited(data.favorites.some((f: any) => f.coffeeShopId === shopId));
      }
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (isFavorited) {
        const response = await fetch(`/api/favorites?coffeeShopId=${shopId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ coffeeShopId: shopId }),
        });

        if (response.ok) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('请先登录');
      return;
    }

    if (!reviewContent.trim()) {
      setReviewError('请输入评价内容');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          coffeeShopId: shopId,
          rating: reviewRating,
          content: reviewContent,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '评价失败');
      }

      setReviews([data.review, ...reviews]);
      setShowReviewForm(false);
      setReviewContent('');
      setReviewRating(5);
    } catch (err: any) {
      setReviewError(err.message || '评价失败');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-600 text-xl">加载中...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">店铺不存在</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header locale={locale} onLocaleChange={setLocale} />
      
      {/* Shop Header */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-6xl">
              ☕
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {shop.name}
              </h1>
              <p className="text-xl text-amber-100 mb-4">
                {shop.nameEn}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{city?.name}</span>
                </div>
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
            </div>
            
            {popularity && (
              <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="text-4xl font-bold mb-2">
                  {popularity.popularityScore}
                </div>
                <div className="text-amber-100">热度指数</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shop Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">店铺信息</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500">📍</span>
                    <div>
                      <div className="font-medium text-amber-900">地址</div>
                      <div className="text-amber-700">{shop.address}</div>
                    </div>
                  </div>
                  
                  {shop.openingHours && (
                    <div className="flex items-start gap-3">
                      <span className="text-amber-500">🕐</span>
                      <div>
                        <div className="font-medium text-amber-900">营业时间</div>
                        <div className="text-amber-700">{shop.openingHours}</div>
                      </div>
                    </div>
                  )}
                  
                  {shop.phone && (
                    <div className="flex items-start gap-3">
                      <span className="text-amber-500">📞</span>
                      <div>
                        <div className="font-medium text-amber-900">联系电话</div>
                        <div className="text-amber-700">{shop.phone}</div>
                      </div>
                    </div>
                  )}
                  
                  {shop.description && (
                    <div className="flex items-start gap-3">
                      <span className="text-amber-500">📝</span>
                      <div>
                        <div className="font-medium text-amber-900">店铺介绍</div>
                        <div className="text-amber-700">{shop.description}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">特色标签</h2>
                <div className="flex flex-wrap gap-2">
                  {shop.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-amber-900">用户评价</h2>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                  >
                    写评价
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-amber-50 rounded-lg">
                    {reviewError && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {reviewError}
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-amber-900 mb-2">
                        评分
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className={`text-2xl ${star <= reviewRating ? 'text-amber-400' : 'text-gray-300'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-amber-900 mb-2">
                        评价内容
                      </label>
                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                        rows={4}
                        placeholder="分享您对这家咖啡馆的感受..."
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="px-6 py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
                      >
                        {isSubmittingReview ? '提交中...' : '提交评价'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReviewForm(false);
                          setReviewContent('');
                          setReviewRating(5);
                          setReviewError('');
                        }}
                        className="px-6 py-2 border-2 border-amber-200 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-amber-100 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${star <= review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-amber-600">{review.rating}.0</span>
                        </div>
                        <p className="text-amber-800">{review.content}</p>
                        <p className="text-sm text-amber-600 mt-2">
                          {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-amber-600">
                    <p>暂无评价，成为第一个评价的人吧！</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Popularity Stats */}
              {popularity && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h2 className="text-2xl font-bold text-amber-900 mb-4">热度数据</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700">热度指数</span>
                      <span className="text-2xl font-bold text-amber-600">
                        {popularity.popularityScore}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700">订单数</span>
                      <span className="text-xl font-bold text-amber-600">
                        {popularity.orderCount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700">搜索数</span>
                      <span className="text-xl font-bold text-amber-600">
                        {popularity.searchCount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700">数据来源</span>
                      <span className="text-amber-600">
                        {popularity.source === 'meituan' ? '美团' : '饿了么'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-amber-700">数据日期</span>
                      <span className="text-amber-600">{popularity.date}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">快速操作</h2>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium">
                    查看地图
                  </button>
                  <button className="w-full px-4 py-3 border-2 border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium">
                    分享店铺
                  </button>
                  <button
                    onClick={handleFavorite}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                      isFavorited
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'border-2 border-amber-200 text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    {isFavorited ? '❤️ 已收藏' : '🤍 收藏店铺'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}