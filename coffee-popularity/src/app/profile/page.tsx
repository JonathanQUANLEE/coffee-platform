'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations, Locale } from '@/i18n';

export default function ProfilePage() {
  const [locale, setLocale] = useState<Locale>('zh');
  const { t } = useTranslations(locale);
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user, isLoading, router]);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新失败');
      }

      updateUser(data.user);
      setSuccess('个人信息更新成功');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || '更新失败');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-amber-600">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-center sm:text-left pb-2">
                <h1 className="text-2xl font-bold text-amber-900">{user.username}</h1>
                <p className="text-amber-600">{user.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border-2 border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium"
              >
                编辑资料
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {user.stats?.totalFavorites || 0}
            </div>
            <div className="text-amber-800">收藏咖啡馆</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {user.stats?.totalReviews || 0}
            </div>
            <div className="text-amber-800">发布评价</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {user.stats?.averageRating || 0}
            </div>
            <div className="text-amber-800">平均评分</div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-amber-900 mb-6">编辑个人信息</h2>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
                {success}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                  minLength={2}
                  maxLength={20}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-sm text-amber-600 mt-1">邮箱暂不支持修改</p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {isSaving ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setUsername(user.username);
                    setError('');
                    setSuccess('');
                  }}
                  className="px-6 py-3 border-2 border-amber-200 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-amber-900 mb-6">快速操作</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/favorites"
              className="flex items-center gap-4 p-4 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                ❤️
              </div>
              <div>
                <h3 className="font-bold text-amber-900">我的收藏</h3>
                <p className="text-sm text-amber-600">查看您收藏的咖啡馆</p>
              </div>
            </a>
            
            <a
              href="/reviews"
              className="flex items-center gap-4 p-4 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                💬
              </div>
              <div>
                <h3 className="font-bold text-amber-900">我的评价</h3>
                <p className="text-sm text-amber-600">管理您发布的评价</p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}