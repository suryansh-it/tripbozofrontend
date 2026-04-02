'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLoader } from '@/components/LoaderContext';

const CallToAction = () => {
  const router = useRouter();
  const { setShow } = useLoader();
  
  const handleGetStarted = () => {
    setShow(true); // Show loader before navigation
    router.push('/Onboarding');
    // Loader will be hidden by LoaderRouteListener
  };
  
  return (
    <section className="py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-teal-500 to-teal-700 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-8 max-w-3xl">
            Find the perfect apps for your destination and travel with confidence. 
            Our curated collections make it easy to prepare for any journey.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-white text-teal-700 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;