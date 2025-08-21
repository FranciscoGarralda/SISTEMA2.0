/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['localhost'],
    // Si tienes imágenes externas, agrégalas aquí
  },
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante la compilación
  },
  typescript: {
    // !! ADVERTENCIA !!
    // Ignorar errores de TypeScript durante la compilación
    // Esto es útil para despliegues rápidos, pero no recomendado para producción
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Configuraciones adicionales de webpack si son necesarias
    return config;
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;