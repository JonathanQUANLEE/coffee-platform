'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { allShops, searchShops } from '@/data/real-shops-data';

interface SearchBarProps {
  className?: string;
  large?: boolean;
}

export default function SearchBar({ className = '', large = false }: SearchBarProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredShops = query.length > 0 ? searchShops(query).slice(0, 8) : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredShops.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      window.location.href = `/shops/${filteredShops[selectedIndex].id}`;
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(e.target.value.length > 0);
          setSelectedIndex(-1);
        }}
        onFocus={() => query.length > 0 && setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        placeholder={t('搜索咖啡馆名称、商圈、特色...', 'Search shop name, district, features...')}
        className={`w-full px-4 py-3 bg-white text-stone-800 placeholder-stone-400 outline-none rounded-xl border border-stone-200 focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition-all ${
          large ? 'text-lg py-4' : 'text-base'
        }`}
      />
      
      {query && (
        <button
          onClick={() => {
            setQuery('');
            setShowDropdown(false);
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* 下拉提示 */}
      {showDropdown && filteredShops.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {filteredShops.map((shop, index) => (
            <Link
              key={shop.id}
              href={`/shops/${shop.id}`}
              className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                index === selectedIndex ? 'bg-stone-100' : 'hover:bg-stone-50'
              }`}
              onClick={() => setShowDropdown(false)}
            >
              <div className="w-12 h-12 rounded-lg bg-stone-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${shop.id}/100/100`}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-stone-900 truncate">{shop.name}</div>
                <div className="text-sm text-stone-500 truncate">
                  {shop.city} · {shop.district} · {shop.address}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-amber-500">★</span>
                  <span className="font-medium text-stone-800">{shop.rating}</span>
                </div>
                <div className="text-xs text-stone-500">¥{shop.avgPrice}</div>
              </div>
            </Link>
          ))}
          
          {filteredShops.length >= 8 && (
            <div className="px-4 py-3 text-center text-sm text-stone-500 border-t border-stone-100">
              {t('还有更多结果...', 'More results...')}
            </div>
          )}
        </div>
      )}

      {/* 无结果 */}
      {showDropdown && query.length > 0 && filteredShops.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-200 p-6 text-center z-50">
          <div className="text-stone-400 mb-2">{t('未找到相关咖啡馆', 'No shops found')}</div>
          <div className="text-sm text-stone-500">{t('试试其他关键词', 'Try other keywords')}</div>
        </div>
      )}
    </div>
  );
}