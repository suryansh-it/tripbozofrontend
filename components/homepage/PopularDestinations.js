
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/components/LoaderContext';
import { fetchPopularCountries } from '@/src/utils/api';
import { SkeletonCard } from '@/components/Skeletons';

const fallbackDestinations = [
  { code: 'TH', name: 'Thailand', image: '/Images/Thailand.jpg', description: 'Discover Thailand\'s vibrant culture, street food, and stunning temples with the best travel apps for your trip.' },
  { code: 'FR', name: 'France', image: '/Images/france.jpg', description: 'Navigate the romantic streets of Paris with apps for public transit, language translation, and more.' },
  { code: 'US', name: 'United States', image: '/Images/usa.png', description: 'Discover apps to help you explore the United States, from subway maps to event guides.' },
  { code: 'JP', name: 'Japan', image: '/Images/japan.png', description: 'Navigate Japan\'s blend of tradition and technology with the perfect travel apps.' },
  { code: 'AU', name: 'Australia', image: '/Images/australia.png', description: 'Explore Australia\'s vast landscapes and vibrant cities with essential travel apps.' },
  { code: 'IT', name: 'Italy', image: '/Images/italy.png', description: 'Discover the best apps for exploring Italy\'s rich history, art, and cuisine.' },
];

const countryVisuals = {
  TH: fallbackDestinations[0],
  FR: fallbackDestinations[1],
  US: fallbackDestinations[2],
  JP: fallbackDestinations[3],
  AU: fallbackDestinations[4],
  IT: fallbackDestinations[5],
};

const PopularDestinations = () => {
  const router = useRouter();
  const { setShow } = useLoader();
  const [destinations, setDestinations] = useState(fallbackDestinations);
  const [loading, setLoading] = useState(true);

  const handleExploreClick = (countryCode) => {
    setShow(true); // Show loader before navigation
    router.push(`/country/${countryCode}`);
    // Loader will be hidden by LoaderRouteListener
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const popularCountries = await fetchPopularCountries(6);
        if (!active) return;

        const mapped = (popularCountries || []).slice(0, 6).map((country, index) => {
          const code = String(country?.code || '').toUpperCase();
          const visual = countryVisuals[code] || {};
          return {
            code,
            name: country?.name || visual.name || code || `Country ${index + 1}`,
            image: visual.image || country?.flag || '/Images/Thailand.jpg',
            description:
              country?.description ||
              visual.description ||
              'Explore curated travel apps for this destination.',
            visitCount: country?.visit_count || 0,
          };
        });

        if (mapped.length > 0) {
          setDestinations(mapped);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 md:px-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 text-center font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
          Popular Destinations
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-12 text-center italic font-sans tracking-wide animate-fade-in">
          <span className="inline-block px-2 py-1 bg-white/80 rounded-xl shadow-sm border border-teal-100">
            Explore apps tailored for these trending destinations
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} className="h-44" />
            ))
          ) : (
            destinations.map((destination, index) => (
              <button
                key={`${destination.code}-${index}`}
                className="relative rounded-3xl shadow-md overflow-hidden h-44 transition-all hover:scale-105 hover:shadow-lg border border-gray-200 bg-white text-left active:scale-95 cursor-pointer"
                onClick={() => handleExploreClick(destination.code)}
                aria-label={`Explore ${destination.name} apps`}
              >
                <div className="absolute inset-0">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                </div>
                <div className="relative z-10 p-4 flex flex-col justify-end h-full text-white">
                  <h3 className="text-xl font-semibold mb-1">{destination.code} {destination.name}</h3>
                  <p className="text-xs mb-2">
                    {destination.description}
                  </p>
                  {destination.visitCount ? (
                    <p className="text-[11px] uppercase tracking-[0.2em] text-teal-100/90">
                      {destination.visitCount.toLocaleString()} visits
                    </p>
                  ) : null}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;