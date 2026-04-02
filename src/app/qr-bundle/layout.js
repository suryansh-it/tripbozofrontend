import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LoaderProvider } from '@/components/LoaderContext';
import LoaderRouteListener from '@/components/LoaderRouteListener';
import LoaderConsumerContent from '@/components/LoaderConsumerContent';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata = {
  title: 'Your Travel Apps Bundle | tripbozo',
  description: 'Access your curated bundle of travel apps for your destination.',
};

export default function QRBundleLayout({ children }) {
  return (
    <div className={`${geistSans.variable} antialiased bg-white`}>
      <LoaderProvider>
        <LoaderRouteListener />
        <LoaderConsumerContent>
          <main className="min-h-screen">
            {children}
            <Analytics />
          </main>
        </LoaderConsumerContent>
      </LoaderProvider>
    </div>
  );
} 