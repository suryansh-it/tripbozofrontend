'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/components/LoaderContext';

export default function Onboarding() {
  const router = useRouter();
  const { setShow } = useLoader();

  const [step, setStep] = useState(1);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const travelerOptions = [
    { id: 'solo', title: 'Solo Adventurer', desc: 'Independent traveler seeking authentic experiences', emoji: '🎒' },
    { id: 'family', title: 'Family Trip', desc: 'Travel with kids and focus on family-friendly activities', emoji: '👨‍👩‍👧‍👦' },
    { id: 'business', title: 'Business Traveler', desc: 'Efficient travel focused on work and productivity', emoji: '💼' },
    { id: 'adventure', title: 'Adventure Seeker', desc: 'Outdoor experiences and adrenaline-pumping activities', emoji: '🏔️' },
  ];

  const destinationOptions = [
    { code: 'JP', name: 'Japan' },
    { code: 'FR', name: 'France' },
    { code: 'TH', name: 'Thailand' },
    { code: 'US', name: 'United States' },
    { code: 'IT', name: 'Italy' },
    { code: 'AU', name: 'Australia' },
  ];

  const handleViewApps = (countryCode) => {
    if (countryCode) {
      setShow(true); // Show loader before navigation
      router.push(`/country/${countryCode}`);
      // Loader will be hidden by LoaderRouteListener
    } else {
      alert('Please select a destination country first!');
    }
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
            <h3 className="text-2xl font-display font-medium text-center mb-8 text-black">Where are you traveling to?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              {destinationOptions.map(dest => (
                <button
                  key={dest.code}
                  className={`border-2 border-gray-300 p-10 rounded-3xl cursor-pointer transition-all hover:shadow-2xl hover:border-blue-500 flex flex-col items-center justify-center min-h-[180px] min-w-[180px] active:scale-95 ${
                    selectedCountry === dest.code
                      ? 'border-blue-500 bg-teal-50 shadow'
                      : 'bg-white'
                  }`}
                  onClick={() => {
                    setSelectedCountry(dest.code);
                    setTimeout(() => {
                      handleViewApps(dest.code);
                    }, 200);
                  }}
                  aria-label={`Select ${dest.name}`}
                >
                  <h4 className="text-2xl font-bold text-black">{dest.code}</h4>
                  <p className="text-lg text-black mt-2">{dest.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}