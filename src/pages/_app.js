import Head from 'next/head';
import '../styles/globals.css';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { ClientsProvider } from '../store/ClientsContext';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Viewport meta tag - debe estar en _app.js, no en _document.js */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </Head>
      <ErrorBoundary>
        <ClientsProvider>
          <Component {...pageProps} />
        </ClientsProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;