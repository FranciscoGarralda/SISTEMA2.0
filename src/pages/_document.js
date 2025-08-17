import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Meta tags SEO */}
        <meta name="description" content="Sistema Financiero - Casa de Cambio Alliance F&R. Gestión de operaciones financieras, clientes y movimientos." />
        <meta name="keywords" content="casa de cambio, finanzas, divisas, alliance, sistema financiero" />
        <meta name="author" content="Alliance F&R" />
        <meta name="theme-color" content="#1e40af" />
        
        {/* Favicon principal */}
        <link rel="icon" type="image/png" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="shortcut icon" type="image/png" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        
        {/* Apple Touch Icons - para iOS */}
        <link rel="apple-touch-icon" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        
        {/* Android Chrome Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="https://raw.githubusercontent.com/FranciscoGarralda/ALL/main/favicon2.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags adicionales */}
        <meta name="application-name" content="Alliance F&R" />
        <meta name="apple-mobile-web-app-title" content="Alliance F&R" />
        
        {/* Preconnect para optimización */}
        <link rel="preconnect" href="https://raw.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}