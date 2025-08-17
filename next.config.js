/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    // Si tienes imágenes externas, agrégalas aquí
  },
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true, // Ignorar errores de ESLint durante la compilación
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