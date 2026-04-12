'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/components/LoaderContext';

export default function Onboarding() {
  const router = useRouter();
  const { setShow } = useLoader();

  const [step, setStep] = useState(1);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [originQuery, setOriginQuery] = useState('');

  const originOptions = [
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'AT', name: 'Austria' },
    { code: 'AU', name: 'Australia' },
    { code: 'BR', name: 'Brazil' },
    { code: 'CA', name: 'Canada' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'CN', name: 'China' },
    { code: 'DE', name: 'Germany' },
    { code: 'EG', name: 'Egypt' },
    { code: 'ES', name: 'Spain' },
    { code: 'FR', name: 'France' },
    { code: 'US', name: 'United States' },
    { code: 'GR', name: 'Greece' },
    { code: 'HR', name: 'Croatia' },
    { code: 'IN', name: 'India' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'IT', name: 'Italy' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'MA', name: 'Morocco' },
    { code: 'MX', name: 'Mexico' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'PT', name: 'Portugal' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'TH', name: 'Thailand' },
    { code: 'TR', name: 'Turkey' },
    { code: 'VN', name: 'Vietnam' },
  ];

  const filteredOrigins = useMemo(() => {
    const q = originQuery.trim().toLowerCase();
    if (!q) return originOptions;
    return originOptions.filter(
      (origin) =>
        origin.name.toLowerCase().includes(q) ||
        origin.code.toLowerCase().includes(q)
    );
  }, [originQuery]);

  const handleFinishOnboarding = () => {
    if (!selectedOrigin) {
      alert('Please select your origin country first!');
      return;
    }

    localStorage.setItem('tripbozo_origin_country', JSON.stringify(selectedOrigin));

    setShow(true);
    router.push('/');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f7fbff] via-[#ecfeff] to-[#f8fafc] py-16 sm:py-20 flex flex-col items-center justify-center min-h-screen">
      <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="container mx-auto px-4 flex flex-col items-center justify-center relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wider text-cyan-700 shadow-sm mb-5">
            <span>tripbozo Setup</span>
            <span className="h-1 w-1 rounded-full bg-cyan-500" />
            <span>2 Minutes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4 text-slate-900 leading-tight">
            Start Smart, Travel Lighter
          </h2>
          <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto">
            Learn the tripbozo flow, then set your origin country for personalized assistance, emergency context, and better app picks.
          </p>
        </div>
        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border transition ${step >= 1 ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>1</div>
            <div className={`w-14 h-1 rounded-full mx-2 ${step === 2 ? 'bg-cyan-300' : 'bg-gray-300'}`}></div>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border transition ${step === 2 ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-500'}`}>2</div>
          </div>
        </div>

        
{step === 1 && (
  <div className="flex flex-col items-center justify-center w-full">
    <h3 className="text-2xl md:text-3xl font-display font-medium text-center mb-3 text-slate-900">How tripbozo works</h3>
    <p className="text-sm md:text-base text-slate-600 text-center mb-8 max-w-2xl">
      Think of this as your travel command center: discover, bundle, install, and stay prepared.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
      {[
        { emoji: '🌍', title: 'Pick a Country', desc: 'Search any destination to open your complete travel app guide.' },
        { emoji: '📱', title: 'Choose Apps', desc: 'Add apps to your bundle, open direct store links, and compare alternatives.' },
        { emoji: '🧾', title: 'Build Your Bundle', desc: 'Generate a QR bundle to install your selected apps quickly on your phone.' },
        { emoji: '🛟', title: 'Use Essentials', desc: 'Get emergency contacts, local phrases, useful tips, and country assistance.' },
        { emoji: '💾', title: 'Download & Share', desc: 'Download key sections for offline use and share app picks with others.' },
        { emoji: '⭐', title: 'Rate Recommendations', desc: 'Rate app usefulness per country to track what worked best for you.' },
      ].map((item, idx) => (
        <div
          key={item.title}
          className="group border border-slate-200 p-5 rounded-2xl bg-white/95 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start animate-fade-in-up"
          style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'both' }}
        >
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-emerald-100 text-2xl shadow-sm group-hover:scale-110 transition-transform">
            {item.emoji}
          </div>
          <h4 className="font-display font-semibold text-lg mb-2 text-slate-900">{item.title}</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
    <div className="mt-10 flex flex-col items-center gap-2">
      <button
        onClick={() => setStep(2)}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold shadow-lg transition"
      >
        Let&apos;s Set My Origin Country
      </button>
      <p className="text-xs text-slate-500">You can always update this later from onboarding.</p>
    </div>
  </div>
)}


        {step === 2 && (
          <div className="flex flex-col items-center justify-center w-full">
            <h3 className="text-2xl md:text-3xl font-display font-medium text-center mb-3 text-slate-900">Where are you traveling from?</h3>
            <p className="text-base text-slate-600 text-center mb-8">This powers personalized embassy/consular support and more relevant Essentials guidance.</p>
            <div className="w-full max-w-2xl mx-auto">
              <input
                type="text"
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                placeholder="Search country name or code"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
              <div className="mt-4 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                {filteredOrigins.length ? (
                  filteredOrigins.map((origin) => (
                    <button
                      key={origin.code}
                      onClick={() => setSelectedOrigin(origin)}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-cyan-50 ${
                        selectedOrigin?.code === origin.code ? 'bg-cyan-50' : 'bg-white'
                      }`}
                      aria-label={`Select ${origin.name}`}
                    >
                      <span className="text-sm sm:text-base font-semibold text-slate-900">{origin.name}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{origin.code}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-slate-500">No country found for "{originQuery}"</p>
                )}
              </div>
              {selectedOrigin && (
                <p className="mt-3 text-sm font-medium text-cyan-700">
                  Selected origin: {selectedOrigin.name} ({selectedOrigin.code})
                </p>
              )}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleFinishOnboarding}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold shadow-lg transition"
              >
                Save and Continue
              </button>
              <button
                onClick={() => {
                  setShow(true);
                  router.push('/');
                }}
                className="px-8 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}