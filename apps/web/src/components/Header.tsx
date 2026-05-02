'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isTransparent = transparent && !scrolled;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isTransparent ? 'bg-white' : 'bg-stone-900'
              }`}>
                <svg className={`w-6 h-6 ${isTransparent ? 'text-stone-900' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21V19H20V21H2ZM20 8V5H18V8H20ZM20 8C20 5.2 17.8 3 15 3H9C6.2 3 4 5.2 4 8V16C4 18.8 6.2 21 9 21H15C17.8 21 20 18.8 20 16V8Z"/>
                </svg>
              </div>
              <span className={`text-2xl font-bold transition-colors ${isTransparent ? 'text-white' : 'text-stone-900'}`}>
                {t('咖啡热度', 'CoffeePop')}
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {[
                { href: '/', label: { zh: '首页', en: 'Home' } },
                { href: '/rankings/hot', label: { zh: '榜单', en: 'Rankings' } },
                { href: '/encyclopedia', label: { zh: '百科', en: 'Encyclopedia' } },
                { href: '/merchant/apply', label: { zh: '商家入驻', en: 'Merchant' } },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-2.5 rounded-lg text-base font-medium transition-all ${
                    isTransparent
                      ? 'text-white/90 hover:text-white hover:bg-white/10'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {t(item.label.zh, item.label.en)}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isTransparent
                    ? 'text-white/80 bg-white/10 hover:bg-white/20'
                    : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                }`}
              >
                {language === 'zh' ? 'EN' : '中文'}
              </button>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className={`text-base font-medium ${isTransparent ? 'text-white' : 'text-stone-700'}`}>
                    {user.nickname}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`px-4 py-2 text-sm rounded-lg transition-all ${
                      isTransparent
                        ? 'text-white/80 hover:bg-white/10'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {t('退出', 'Exit')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className={`px-6 py-2.5 text-base font-medium rounded-lg transition-all ${
                    isTransparent
                      ? 'bg-white text-stone-900 hover:bg-white/90'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                >
                  {t('登录', 'Login')}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={(u) => setUser(u)} />}
    </>
  );
}

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
        className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">
              {mode === 'login' ? t('登录', 'Login') : t('注册', 'Sign Up')}
            </h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-3xl leading-none">&times;</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          {mode === 'register' && (
            <div>
              <label className="block text-base font-medium text-stone-700 mb-2">{t('昵称', 'Nickname')}</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none text-base"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-base font-medium text-stone-700 mb-2">{t('邮箱', 'Email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none text-base"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-stone-700 mb-2">{t('密码', 'Password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none text-base"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-medium text-base hover:bg-stone-800 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? t('处理中...', 'Processing...') : mode === 'login' ? t('登录', 'Login') : t('注册', 'Sign Up')}
          </button>

          <div className="text-center text-base text-stone-500">
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