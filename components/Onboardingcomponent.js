'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoader } from './LoaderContext';

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
];

const OnboardingComponent = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { setShow } = useLoader();

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewApps = () => {
    if (selectedCountry) {
      setShow(true); // Show loader before navigation
      router.push(`/country/${selectedCountry}`);
      // Loader will be hidden by LoaderRouteListener
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Destination
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Select a country to discover essential travel apps that will enhance your journey.
          </p>
        </div>

        {/* Search input */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Country grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCountries.map((country) => (
            <div
              key={country.code}
              onClick={() => setSelectedCountry(country.code)}
              className={`cursor-pointer rounded-lg p-4 flex flex-col items-center justify-center transition-all ${
                selectedCountry === country.code
                  ? 'bg-teal-500 text-white shadow-lg transform scale-105'
                  : 'bg-white hover:bg-gray-100 text-gray-800 shadow-sm'
              }`}
            >
              <span className="text-4xl mb-2">{country.flag}</span>
              <span className="font-medium text-center">{country.name}</span>
              <span className="text-xs opacity-75">{country.code}</span>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredCountries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No countries found matching &quot;{searchQuery}&quot;</p>
          </div>
        )}

        {/* Action button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleViewApps}
            disabled={!selectedCountry}
            className={`px-8 py-3 rounded-full text-white font-semibold shadow-md transition-all ${
              selectedCountry
                ? 'bg-teal-500 hover:bg-teal-600 transform hover:-translate-y-1'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            View Travel Apps
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComponent; 