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
        
        {/* Mobile optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Favicon principal */}
        <link rel="icon" type="image/png" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/png" href="/favicon.ico" />
        
        {/* Apple Touch Icons - para iOS */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="57x57" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        
        {/* Android Chrome Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileImage" content="/favicon.ico" />
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