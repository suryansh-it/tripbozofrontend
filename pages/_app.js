import '@/styles/globals.css';
import { LoaderProvider } from '@/components/LoaderContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <LoaderProvider>
      <Navbar />
      <main className="min-h-screen pt-16">
        {getLayout(<Component {...pageProps} />)}
      </main>
      <Footer />
    </LoaderProvider>
  );
} 