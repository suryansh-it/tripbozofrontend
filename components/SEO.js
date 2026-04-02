import React from 'react';
import Script from 'next/script';

/**
 * SEO Component to add structured data and improve SEO
 * @param {Object} props
 * @param {string} props.type - The type of schema.org entity (WebPage, Article, Product, etc.)
 * @param {string} props.title - The title of the page
 * @param {string} props.description - The description of the page
 * @param {string} props.url - The canonical URL of the page
 * @param {string} props.image - The main image URL for the page
 * @param {Object} props.additionalData - Any additional schema.org properties to include
 */
const SEO = ({ 
  type = 'WebPage', 
  title = 'Trip Bozo | Your Essential Travel App Companion', 
  description = 'Trip Bozo curates the perfect app bundle for every traveler\'s needs, no matter where your journey takes you.', 
  url = 'https://tripbozo.com', 
  image = 'https://tripbozo.com/logo.png',
  additionalData = {} 
}) => {
  // Basic schema data all pages should have
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    "name": title,
    "description": description,
    "url": url,
    "image": image,
    "publisher": {
      "@type": "Organization",
      "name": "Trip Bozo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tripbozo.com/logo.png"
      }
    }
  };

  // Merge base schema with any additional data provided
  const schemaData = { ...baseSchema, ...additionalData };

  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default SEO; 