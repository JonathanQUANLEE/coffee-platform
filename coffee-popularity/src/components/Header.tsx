'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations, Locale } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';

interface HeaderProps {
  locale?: Locale;
  onLocaleChange?: (locale: Locale) => void;
}

export default function Header({ locale = 'zh', onLocaleChange }: HeaderProps) {
  const { t } = useTranslations(locale);
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-amber-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <span className="text-white text-xl">☕</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-amber-900">咖啡热度</h1>
                <p className="text-xs text-amber-600">Coffee Popularity</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-amber-800 hover:text-amber-600 font-medium transition-colors">
                {t('common.home')}
              </Link>
              <Link href="/coffee-types" className="text-amber-800 hover:text-amber-600 font-medium transition-colors">
                {t('common.coffeeTypes')}
              </Link>
              <Link href="/about" className="text-amber-800 hover:text-amber-600 font-medium transition-colors">
                {t('common.about')}
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onLocaleChange?.('zh')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    locale === 'zh' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => onLocaleChange?.('en')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    locale === 'en' 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  EN
                </button>
              </div>
              
              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline font-medium">{user.username}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-amber-100 py-2 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        个人中心
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        我的收藏
                      </Link>
                      <Link
                        href="/reviews"
                        className="block px-4 py-2 text-amber-800 hover:bg-amber-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        我的评价
                      </Link>
                      <hr className="my-2 border-amber-100" />
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-4 py-2 text-amber-800 hover:text-amber-600 font-medium transition-colors"
                  >
                    登录
                  </button>
                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
                  >
                    注册
                  </button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-amber-800 hover:text-amber-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-amber-100">
              <nav className="flex flex-col gap-4">
                <Link 
                  href="/" 
                  className="text-amber-800 hover:text-amber-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('common.home')}
                </Link>
                <Link 
                  href="/coffee-types" 
                  className="text-amber-800 hover:text-amber-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('common.coffeeTypes')}
                </Link>
                <Link 
                  href="/about" 
                  className="text-amber-800 hover:text-amber-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('common.about')}
                </Link>
                
                {/* Mobile Language Switcher */}
                <div className="flex items-center gap-2 pt-4 border-t border-amber-100">
                  <button
                    onClick={() => onLocaleChange?.('zh')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      locale === 'zh' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => onLocaleChange?.('en')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      locale === 'en' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}