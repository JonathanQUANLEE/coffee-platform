'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';

export default function MerchantApplyPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    shop_name: '',
    contact_name: '',
    contact_phone: '',
    address: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('商家入驻', 'Merchant Signup')}
          </h1>
          <p className="text-xl text-stone-300">
            {t('让更多咖啡爱好者发现你的店', 'Let more coffee lovers discover your shop')}
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">{t('申请已提交', 'Application Submitted')}</h2>
            <p className="text-stone-600 mb-8 text-lg">
              {t('我们会在1-3个工作日内审核您的资料', 'We will review your application within 1-3 business days')}
            </p>
            <Link href="/" className="inline-block px-8 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-all">
              {t('返回首页', 'Back to Home')}
            </Link>
          </div>
        ) : (
          <>
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { title: { zh: '品牌曝光', en: 'Exposure' }, desc: { zh: '出现在城市榜、商圈榜、主题榜', en: 'Appear in city rankings' } },
                { title: { zh: '品牌主页', en: 'Brand Page' }, desc: { zh: '展示图片、环境、菜单、营业时间', en: 'Show photos, menu, hours' } },
                { title: { zh: '数据洞察', en: 'Insights' }, desc: { zh: '查看收藏、浏览、打卡、评论数据', en: 'View favorites, views, reviews' } },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold text-stone-900 mb-2">{t(item.title.zh, item.title.en)}</h3>
                  <p className="text-stone-600">{t(item.desc.zh, item.desc.en)}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-xl font-bold text-stone-900">{t('填写入驻信息', 'Fill in your info')}</h2>
                <p className="text-stone-500 mt-1">{t('请填写您的店铺信息', 'Please fill in your shop info')}</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-base font-medium text-stone-700 mb-2">{t('店铺名称', 'Shop Name')} *</label>
                  <input
                    type="text"
                    value={formData.shop_name}
                    onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none text-base"
                    placeholder={t('请输入店铺名称', 'Enter shop name')}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base font-medium text-stone-700 mb-2">{t('联系人', 'Contact')} *</label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base font-medium text-stone-700 mb-2">{t('联系电话', 'Phone')} *</label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-stone-700 mb-2">{t('店铺地址', 'Address')} *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-stone-700 mb-2">{t('营业执照', 'Business License')}</label>
                  <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 text-center hover:border-stone-400 transition-colors cursor-pointer">
                    <p className="text-stone-500">{t('点击上传或拖拽文件到此处', 'Click to upload')}</p>
                    <p className="text-stone-400 text-sm mt-1">{t('支持 JPG、PNG、PDF，最大 10MB', 'JPG, PNG, PDF, max 10MB')}</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-medium text-base hover:bg-stone-800 transition-all active:scale-[0.98]"
                >
                  {t('提交申请', 'Submit Application')}
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">{t('常见问题', 'FAQ')}</h2>
              <div className="space-y-4">
                {[
                  { q: { zh: '入驻是否收费？', en: 'Is it free?' }, a: { zh: 'MVP阶段完全免费，不收取任何入驻费用。', en: 'Free during MVP phase.' } },
                  { q: { zh: '审核需要多久？', en: 'How long is the review?' }, a: { zh: '通常1-3个工作日，审核通过后会通知您。', en: 'Usually 1-3 business days.' } },
                  { q: { zh: '排名怎么算？', en: 'How is ranking calculated?' }, a: { zh: '基于浏览、收藏、打卡、评价等综合数据计算。', en: 'Based on views, favorites, check-ins, reviews.' } },
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold text-stone-900 mb-2">{t(item.q.zh, item.q.en)}</h3>
                    <p className="text-stone-600">{t(item.a.zh, item.a.en)}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}