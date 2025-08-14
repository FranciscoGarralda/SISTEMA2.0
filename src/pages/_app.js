import '../styles/globals.css';
import ErrorBoundary from '../shared/components/ui/ErrorBoundary';
import { ClientsProvider } from '../shared/contexts/ClientsContext';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ClientsProvider>
        <Component {...pageProps} />
      </ClientsProvider>
    </ErrorBoundary>
  );
}

export default MyApp;