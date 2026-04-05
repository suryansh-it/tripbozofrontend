'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/components/LoaderContext';

export default function Onboarding() {
  const router = useRouter();
  const { setShow } = useLoader();

  const [step, setStep] = useState(1);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [originQuery, setOriginQuery] = useState('');

  const travelerOptions = [
    { id: 'solo', title: 'Solo Adventurer', desc: 'Independent traveler seeking authentic experiences', emoji: '🎒' },
    { id: 'family', title: 'Family Trip', desc: 'Travel with kids and focus on family-friendly activities', emoji: '👨‍👩‍👧‍👦' },
    { id: 'business', title: 'Business Traveler', desc: 'Efficient travel focused on work and productivity', emoji: '💼' },
    { id: 'adventure', title: 'Adventure Seeker', desc: 'Outdoor experiences and adrenaline-pumping activities', emoji: '🏔️' },
  ];

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
    if (selectedTraveler) {
      localStorage.setItem('tripbozo_traveler_type', selectedTraveler);
    }

    setShow(true);
    router.push('/');
  };

  const handleTravelerSelect = (travelerId) => {
    setSelectedTraveler(travelerId);
    // Add a small delay to provide visual feedback before navigating
    setTimeout(() => {
      setStep(2);
    }, 200);
  };

  return (
    <section className="bg-white py-16 sm:py-20 flex flex-col items-center justify-center min-h-screen">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4 text-black">Set Up Your Travel Profile</h2>
          <p className="text-lg text-black">Let&apos;s personalize your travel app recommendations</p>
        </div>
        {/* Step Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-white border-2 ${step >= 1 ? 'bg-teal-400 border-blue-500' : 'bg-gray-300 border-gray-300'}`}>1</div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold border-2 ${step === 2 ? 'bg-teal-400 text-white border-blue-500' : 'bg-gray-200 text-gray-400 border-gray-300'}`}>2</div>
          </div>
        </div>

        
{step === 1 && (
  <div className="flex flex-col items-center justify-center w-full">
    <h3 className="text-2xl font-display font-medium text-center mb-12 text-black">What type of traveler are you?</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
      {travelerOptions.map(opt => (
        <button
          key={opt.id}
          className={`border-2 border-gray-300 p-10 rounded-3xl cursor-pointer transition-all hover:shadow-2xl hover:border-blue-500 flex flex-col items-center justify-center min-h-[220px] min-w-[220px] text-left active:scale-95 ${
            selectedTraveler === opt.id
              ? 'border-blue-500 bg-teal-50 shadow'
              : 'bg-white'
          }`}
          onClick={() => handleTravelerSelect(opt.id)}
          aria-label={`Select ${opt.title}`}
        >
          <div className="text-6xl mb-4">{opt.emoji}</div>
          <h4 className="font-display font-medium text-xl mb-2 text-black">{opt.title}</h4>
          <p className="text-base text-black text-center">{opt.desc}</p>
        </button>
      ))}
    </div>
  </div>
)}


        {step === 2 && (
          <div className="flex flex-col items-center justify-center w-full">
            <h3 className="text-2xl font-display font-medium text-center mb-3 text-black">Where are you traveling from?</h3>
            <p className="text-base text-gray-700 text-center mb-8">We use this to show embassy and consular help in Essentials.</p>
            <div className="w-full max-w-2xl mx-auto">
              <input
                type="text"
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                placeholder="Search country name or code"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
              <div className="mt-4 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                {filteredOrigins.length ? (
                  filteredOrigins.map((origin) => (
                    <button
                      key={origin.code}
                      onClick={() => setSelectedOrigin(origin)}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-teal-50 ${
                        selectedOrigin?.code === origin.code ? 'bg-teal-50' : 'bg-white'
                      }`}
                      aria-label={`Select ${origin.name}`}
                    >
                      <span className="text-sm sm:text-base font-semibold text-gray-900">{origin.name}</span>
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">{origin.code}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-6 text-center text-sm text-gray-500">No country found for "{originQuery}"</p>
                )}
              </div>
              {selectedOrigin && (
                <p className="mt-3 text-sm font-medium text-teal-700">
                  Selected origin: {selectedOrigin.name} ({selectedOrigin.code})
                </p>
              )}
            </div>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleFinishOnboarding}
                className="px-8 py-3 rounded-xl bg-teal-400 hover:bg-teal-500 text-white font-semibold shadow-lg transition"
              >
                Save and Continue
              </button>
              <button
                onClick={() => {
                  setShow(true);
                  router.push('/');
                }}
                className="px-8 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition"
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