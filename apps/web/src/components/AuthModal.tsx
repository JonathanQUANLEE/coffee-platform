'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: any, token: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = mode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const body = mode === 'login' 
        ? { email, password }
        : { email, password, nickname };

      const res = await fetch(`http://localhost:8000${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || '操作失败');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onAuth(data.user, data.access_token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">
              {mode === 'login' ? t('登录', 'Login') : t('注册', 'Sign Up')}
            </h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">{t('昵称', 'Nickname')}</label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('邮箱', 'Email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{t('密码', 'Password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {loading ? t('处理中...', 'Processing...') : 
             mode === 'login' ? t('登录', 'Login') : t('注册', 'Sign Up')}
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