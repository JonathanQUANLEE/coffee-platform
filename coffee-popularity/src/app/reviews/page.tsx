'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations, Locale } from '@/i18n';
import { getCoffeeShopById } from '@/data';

export default function ReviewsPage() {
  const [locale, setLocale] = useState<Locale>('zh');
  const { t } = useTranslations(locale);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok && data.user.reviews) {
        // 获取评价的咖啡馆详情
        const reviewsWithDetails = data.user.reviews.map((review: any) => {
          const shop = getCoffeeShopById(review.coffeeShopId);
          return {
            ...review,
            shop: shop || null,
          };
        });
        
        setReviews(reviewsWithDetails);
      }
    } catch (error) {
      console.error('获取评价失败:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('确定要删除这条评价吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/reviews?reviewId=${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== reviewId));
      }
    } catch (error) {
      console.error('删除评价失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading || isLoadingReviews) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-600 text-xl">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header locale={locale} onLocaleChange={setLocale} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">我的评价</h1>
          <p className="text-amber-700">
            您发布的所有评价
          </p>
        </div>
        
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {review.shop ? (
                      <Link href={`/coffee-shop/${review.shop.id}`} className="hover:opacity-80 transition-opacity">
                        <div className="w-16 h-16 rounded-lg bg-amber-100 flex items-center justify-center text-3xl">
                          ☕
                        </div>
                      </Link>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-3xl">
                        ☕
                      </div>
                    )}
                    <div>
                      {review.shop ? (
                        <Link href={`/coffee-shop/${review.shop.id}`} className="font-bold text-amber-900 hover:text-amber-700 transition-colors">
                          {review.shop.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-amber-900">未知咖啡馆</span>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${star <= review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-amber-600">{review.rating}.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-600 transition-colors text-sm"
                  >
                    删除
                  </button>
                </div>
                
                <p className="text-amber-800 leading-relaxed mb-4">
                  {review.content}
                </p>
                
                <div className="text-sm text-amber-600">
                  发布于 {formatDate(review.createdAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">暂无评价</h3>
            <p className="text-amber-700 mb-6">您还没有发布过任何评价</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors"
            >
              去发现好咖啡
            </a>
          </div>
        )}
      </main>
    </div>
  );
}