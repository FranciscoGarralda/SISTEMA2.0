import ErrorPage from '../components/ui/ErrorPage';

function Error({ statusCode, title, message }) {
  const getErrorInfo = () => {
    switch (statusCode) {
      case 404:
        return {
          title: 'Página no encontrada',
          message: 'La página que buscas no existe o ha sido movida.'
        };
      case 500:
        return {
          title: 'Error del servidor',
          message: 'Ha ocurrido un error interno en el servidor.'
        };
      case 403:
        return {
          title: 'Acceso denegado',
          message: 'No tienes permisos para acceder a esta página.'
        };
      default:
        return {
          title: title || 'Error inesperado',
          message: message || 'Ha ocurrido un error inesperado.'
        };
    }
  };

  const errorInfo = getErrorInfo();

  return (
    <ErrorPage 
      statusCode={statusCode}
      title={errorInfo.title}
      message={errorInfo.message}
    />
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
