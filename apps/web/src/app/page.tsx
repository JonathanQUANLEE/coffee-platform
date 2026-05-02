'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import SearchBar from '@/components/SearchBar';

const cities = [
  { zh: '上海', en: 'Shanghai' },
  { zh: '北京', en: 'Beijing' },
  { zh: '广州', en: 'Guangzhou' },
  { zh: '深圳', en: 'Shenzhen' },
  { zh: '成都', en: 'Chengdu' },
  { zh: '杭州', en: 'Hangzhou' },
  { zh: '武汉', en: 'Wuhan' },
  { zh: '南京', en: 'Nanjing' },
  { zh: '天津', en: 'Tianjin' },
  { zh: '重庆', en: 'Chongqing' },
  { zh: '西安', en: "Xian" },
  { zh: '长沙', en: 'Changsha' },
  { zh: '沈阳', en: 'Shenyang' },
  { zh: '青岛', en: 'Qingdao' },
  { zh: '郑州', en: 'Zhengzhou' },
  { zh: '大连', en: 'Dalian' },
  { zh: '东莞', en: 'Dongguan' },
  { zh: '宁波', en: 'Ningbo' },
  { zh: '厦门', en: 'Xiamen' },
  { zh: '福州', en: 'Fuzhou' },
  { zh: '无锡', en: 'Wuxi' },
  { zh: '合肥', en: 'Hefei' },
  { zh: '昆明', en: 'Kunming' },
  { zh: '哈尔滨', en: 'Harbin' },
  { zh: '济南', en: 'Jinan' },
  { zh: '佛山', en: 'Foshan' },
  { zh: '长春', en: 'Changchun' },
  { zh: '温州', en: 'Wenzhou' },
  { zh: '石家庄', en: 'Shijiazhuang' },
  { zh: '南宁', en: 'Nanning' },
  { zh: '常州', en: 'Changzhou' },
  { zh: '泉州', en: 'Quanzhou' },
  { zh: '南昌', en: 'Nanchang' },
  { zh: '贵阳', en: 'Guiyang' },
  { zh: '太原', en: 'Taiyuan' },
];

const quickFilters = [
  { label: { zh: '热门榜', en: 'Hot' }, slug: 'hot', color: 'bg-red-500' },
  { label: { zh: '手冲精品', en: 'Pour Over' }, slug: 'pour-over', color: 'bg-amber-600' },
  { label: { zh: '出片圣地', en: 'Photogenic' }, slug: 'photogenic', color: 'bg-pink-500' },
  { label: { zh: '办公友好', en: 'Work Friendly' }, slug: 'work', color: 'bg-blue-500' },
  { label: { zh: '深夜营业', en: 'Late Night' }, slug: 'late-night', color: 'bg-purple-500' },
  { label: { zh: '新店首发', en: 'New' }, slug: 'new', color: 'bg-green-500' },
];

const getShopImage = (id: number) => `https://picsum.photos/seed/coffee${id}/800/600`;

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState('上海');
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const topShops = realShanghaiShops.slice(0, 6);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header - 固定导航栏，滚动时加阴影 */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className={`text-xl font-bold transition-colors ${scrolled ? 'text-stone-900' : 'text-white'}`}>
                {t('咖啡热度', 'Coffee Pop')}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: '/', label: { zh: '首页', en: 'Home' } },
                { href: '/rankings/hot', label: { zh: '榜单', en: 'Rankings' } },
                { href: '/encyclopedia', label: { zh: '百科', en: 'Encyclopedia' } },
                { href: '/merchant/apply', label: { zh: '商家入驻', en: 'Merchant' } },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10 ${
                    scrolled ? 'text-stone-700 hover:bg-stone-100' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {t(item.label.zh, item.label.en)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  scrolled
                    ? 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                    : 'text-white/80 bg-white/10 hover:bg-white/20'
                }`}
              >
                {language === 'zh' ? 'EN' : '中文'}
              </button>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${scrolled ? 'text-stone-700' : 'text-white'}`}>{user.nickname}</span>
                  <button
                    onClick={handleLogout}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      scrolled
                        ? 'text-stone-600 hover:bg-stone-100'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    {t('退出', 'Exit')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    scrolled
                      ? 'bg-stone-900 text-white hover:bg-stone-800'
                      : 'bg-white text-stone-900 hover:bg-white/90'
                  }`}
                >
                  {t('登录', 'Login')}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[700px] overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 pt-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {t('发现城市里', 'Discover in the city')}
              <br />
              <span className="text-amber-400">{t('值得喝的一杯咖啡', 'a cup of coffee worth drinking')}</span>
            </h1>
            
            <p className="text-xl text-stone-300 mb-10 max-w-2xl mx-auto">
              {t('基于 12,580+ 条真实用户评价，为你推荐最好的咖啡馆', 'Based on 12,580+ real user reviews')}
            </p>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 rounded-xl md:w-48">
                    <span className="text-stone-400">📍</span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent text-stone-800 font-medium outline-none cursor-pointer flex-1"
                    >
                      {cities.map((city) => (
                        <option key={city.zh} value={city.zh}>{language === 'zh' ? city.zh : city.en}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <SearchBar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="relative -mt-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {quickFilters.map((filter, index) => (
              <Link
                key={filter.slug}
                href={`/rankings/${filter.slug}`}
                className="flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-2 h-2 rounded-full ${filter.color}`}></div>
                <span className="text-sm font-medium text-stone-700">{t(filter.label.zh, filter.label.en)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Rankings */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">Hot Rankings</span>
              <h2 className="text-3xl font-bold text-stone-900 mt-1">{t('本周热度榜', 'Weekly Popularity')}</h2>
              <p className="text-stone-500 mt-1">{t('截止 2026年5月', 'Updated May 2026')}</p>
            </div>
            <Link href="/rankings/hot" className="text-stone-600 hover:text-stone-800 font-medium flex items-center gap-1 group">
              {t('查看全部', 'View All')}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topShops.map((shop, index) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-stone-700 to-stone-900">
                  <img
                    src={getShopImage(index * 10 + 1)}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                      <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                        {shop.name}
                      </h3>
                      <p className="text-sm text-stone-500">{shop.district}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span className="font-bold text-stone-800">{shop.rating}</span>
                      </div>
                      <p className="text-xs text-stone-500">{shop.reviewCount.toLocaleString()}{t('评价', 'reviews')}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {shop.features.slice(0, 3).map((feature, idx) => (
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coffee Knowledge */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">Coffee Knowledge</span>
            <h2 className="text-3xl font-bold text-stone-900 mt-1">{t('咖啡百科', 'Coffee Encyclopedia')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { href: '/encyclopedia', title: { zh: '咖啡种类', en: 'Coffee Types' }, desc: { zh: '了解美式、拿铁、卡布奇诺等经典咖啡', en: 'Learn about Americano, Latte, Cappuccino' }, color: 'from-amber-600 to-amber-800' },
              { href: '/encyclopedia', title: { zh: '咖啡历史', en: 'Coffee History' }, desc: { zh: '从埃塞俄比亚到全球的故事', en: 'From Ethiopia to the world' }, color: 'from-stone-600 to-stone-800' },
              { href: '/encyclopedia', title: { zh: '新手指南', en: 'Beginner Guide' }, desc: { zh: '第一次喝咖啡？看这里', en: 'First time drinking coffee?' }, color: 'from-amber-700 to-red-800' },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{t(item.title.zh, item.title.en)}</h3>
                  <p className="text-white/80 text-sm">{t(item.desc.zh, item.desc.en)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('让更多咖啡爱好者发现你的店', 'Let more coffee lovers discover your shop')}
          </h2>
          <p className="text-stone-300 mb-8 text-lg">
            {t('入驻咖啡热度平台，进入城市咖啡地图', 'Join Coffee Popularity, enter the city coffee map')}
          </p>
          <Link
            href="/merchant/apply"
            className="inline-block px-10 py-4 bg-white text-stone-900 rounded-xl font-bold hover:bg-stone-100 transition-all active:scale-95"
          >
            {t('商家入驻', 'Merchant Signup')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">{t('咖啡热度', 'Coffee Pop')}</h3>
              <p className="text-sm">{t('发现城市里值得喝的一杯咖啡', 'Discover coffee worth drinking')}</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">{t('探索', 'Explore')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/rankings/hot" className="hover:text-white transition-colors">{t('城市榜单', 'Rankings')}</Link></li>
                <li><Link href="/encyclopedia" className="hover:text-white transition-colors">{t('咖啡百科', 'Encyclopedia')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">{t('商家', 'Merchant')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/merchant/apply" className="hover:text-white transition-colors">{t('商家入驻', 'Signup')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">{t('关于', 'About')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">{t('关于我们', 'About Us')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-12 pt-8 text-center text-sm">
            <p>© 2026 {t('咖啡热度', 'Coffee Pop')}</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={(u) => setUser(u)} />}
    </div>
  );
}

// 简化的登录弹窗组件
function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (user: any) => void }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const body = mode === 'login' ? { email, password } : { email, password, nickname };

      const res = await fetch(`http://localhost:8000${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || '操作失败');

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuth(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">
              {mode === 'login' ? t('登录', 'Login') : t('注册', 'Sign Up')}
            </h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-2xl">×</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('昵称', 'Nickname')}</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('邮箱', 'Email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('密码', 'Password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? t('处理中...', 'Processing...') : mode === 'login' ? t('登录', 'Login') : t('注册', 'Sign Up')}
          </button>

          <div className="text-center text-sm text-stone-500">
            {mode === 'login' ? (
              <span>
                {t('没有账号？', 'No account? ')}
                <button type="button" onClick={() => setMode('register')} className="text-stone-900 font-medium hover:underline">
                  {t('立即注册', 'Sign up')}
                </button>
              </span>
            ) : (
              <span>
                {t('已有账号？', 'Have account? ')}
                <button type="button" onClick={() => setMode('login')} className="text-stone-900 font-medium hover:underline">
                  {t('立即登录', 'Login')}
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

import { realShanghaiShops } from '@/data/real-shanghai-shops';
import { realReviews } from '@/data/real-reviews';