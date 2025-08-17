import '../styles/globals.css';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { ClientsProvider } from '../store/ClientsContext';

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