'use client';

import React from 'react';
import PopularDestinations from './PopularDestinations';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import CallToAction from './CallToAction';
import SEO from '../SEO';

const HomePage = () => {
  // Homepage specific schema data
  const homeSchemaData = {
    "@type": "WebSite",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://tripbozo.com/country/{country}"
      },
      "query-input": "required name=country"
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Trip Bozo",
      "applicationCategory": "TravelApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  };

  return (
    <>
      <SEO 
        type="WebSite"
        title="Trip Bozo | Your Essential Travel App Companion"
        description="Discover curated travel app bundles tailored to your destination. Navigate, communicate, and explore with confidence."
        url="https://tripbozo.com"
        image="https://tripbozo.com/logo.png"
        additionalData={homeSchemaData}
      />
      <main>
        <HeroSection />
        <PopularDestinations />
        <HowItWorks />
        <CallToAction />
      </main>
    </>
  );
};

export default HomePage; 