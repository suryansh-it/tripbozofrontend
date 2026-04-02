import AboutPageClient from '@/components/about/AboutPageClient';

export const metadata = {
  title: 'About tripbozo | Your Essential Travel App Companion',
  description: 'Learn about tripbozo, the app that curates travel app bundles tailored to your destination. Discover our mission, features, and how we help travelers worldwide.',
  alternates: {
    canonical: 'https://tripbozo.com/About',
  },
  openGraph: {
    title: 'About tripbozo | Your Essential Travel App Companion',
    description: 'Learn about tripbozo, the app that curates travel app bundles tailored to your destination. Discover our mission, features, and how we help travelers worldwide.',
  }
};

export default function AboutPage() {
  return <AboutPageClient />;
}