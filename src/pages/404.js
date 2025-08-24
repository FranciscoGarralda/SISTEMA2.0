import ErrorPage from '../components/ui/ErrorPage';

export default function Custom404() {
  return (
    <ErrorPage 
      statusCode={404}
      title="Página no encontrada"
      message="La página que buscas no existe o ha sido movida. Verifica la URL e intenta nuevamente."
    />
  );
}
