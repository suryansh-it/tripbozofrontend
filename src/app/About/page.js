import AboutPageClient from '@/components/about/AboutPageClient';

export const metadata = {
  title: 'About tripbozo | Your Essential Travel App Companion',
  description: 'Learn how tripbozo helps travelers discover country-specific app bundles selected from traveler feedback and practical criteria, plus useful Essentials and personalized onboarding for each destination.',
  alternates: {
    canonical: 'https://tripbozo.com/About',
  },
  openGraph: {
    title: 'About tripbozo | Your Essential Travel App Companion',
    description: 'Learn how tripbozo helps travelers discover country-specific app bundles selected from traveler feedback and practical criteria, plus useful Essentials and personalized onboarding for each destination.',
  }
};

export default function AboutPage() {
  return <AboutPageClient />;
}