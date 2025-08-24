import ErrorPage from '../components/ui/ErrorPage';

export default function Custom500() {
  return (
    <ErrorPage 
      statusCode={500}
      title="Error del servidor"
      message="Ha ocurrido un error interno en el servidor. Por favor, intenta nuevamente más tarde."
      showHomeButton={true}
    />
  );
}
