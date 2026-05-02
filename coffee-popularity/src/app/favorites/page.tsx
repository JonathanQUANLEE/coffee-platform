'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import CoffeeShopCard from '@/components/CoffeeShopCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations, Locale } from '@/i18n';
import { getCoffeeShopById, getCityById, getPopularityByCoffeeShop } from '@/data';

export default function FavoritesPage() {
  const [locale, setLocale] = useState<Locale>('zh');
  const { t } = useTranslations(locale);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        // 获取收藏的咖啡馆详情
        const favoritesWithDetails = data.favorites.map((fav: any) => {
          const shop = getCoffeeShopById(fav.coffeeShopId);
          if (!shop) return null;
          
          const city = getCityById(shop.cityId);
          const popData = getPopularityByCoffeeShop(shop.id);
          const latestPop = popData[0];
          
          return {
            ...shop,
            popularityScore: latestPop?.popularityScore || 0,
            trend: 'stable' as const,
            city: city || null,
            topCoffeeTypes: [],
            favoriteId: fav.id,
            favoritedAt: fav.createdAt,
          };
        }).filter(Boolean);
        
        setFavorites(favoritesWithDetails);
      }
    } catch (error) {
      console.error('获取收藏失败:', error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  const handleRemoveFavorite = async (coffeeShopId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/favorites?coffeeShopId=${coffeeShopId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== coffeeShopId));
      }
    } catch (error) {
      console.error('取消收藏失败:', error);
    }
  };

  if (isLoading || isLoadingFavorites) {
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-amber-900 mb-4">我的收藏</h1>
          <p className="text-amber-700">
            您收藏的咖啡馆都在这里
          </p>
        </div>
        
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((shop) => (
              <div key={shop.id} className="relative">
                <CoffeeShopCard shop={shop} />
                <button
                  onClick={() => handleRemoveFavorite(shop.id)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  title="取消收藏"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">暂无收藏</h3>
            <p className="text-amber-700 mb-6">您还没有收藏任何咖啡馆</p>
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