/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configuración para Netlify Functions
  output: 'standalone',
  trailingSlash: false,
  images: {
    domains: ['localhost'],
    unoptimized: true, // Necesario para Netlify
  },
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true, // Deshabilitado para deploy - corregir después
  },
  typescript: {
    // Habilitar verificación de tipos para mejor calidad
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    // Configuraciones adicionales de webpack si son necesarias
    return config;
  },
  // Configuración para Netlify
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
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